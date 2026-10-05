import { NavLink, Link, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from './Icons.jsx';
import BugReport from './BugReport.jsx';

const NAV = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/product/new', label: 'Products', icon: 'products' },
  { to: '/recipes', label: 'Recipes', icon: 'recipes' },
  { to: '/briefs/new', label: 'Briefs', icon: 'briefs' },
  { to: '/characters', label: 'Characters', icon: 'characters' },
  { to: '/review-queue', label: 'Review queue', icon: 'review', count: 19, lime: true },
  { to: '/client-reviews', label: 'Client reviews', icon: 'send', count: 3 },
  { to: '/library', label: 'Library', icon: 'library' },
  { to: '/buyers', label: 'Buyers', icon: 'buyers' }
];

// Brands (clients) you can work on. Sample list; replace with the workspace's brands from the backend.
export const BRANDS = [
  { name: 'All brands', color: 'var(--lime)', meta: 'Everything in Visionary Studios' },
  { name: 'Moyou London', color: '#C8102E', meta: '@moyoulondon · 3 products' },
  { name: 'Dollar Tree', color: '#2E7D32', meta: '@dollartree · 1 series' },
  { name: 'HookLife', color: '#60A5FA', meta: '@hooklife · internal tests' },
  { name: 'Pillow client', color: '#7C9CF5', meta: '1 animation series' }
];

// Signed-in person. Dummy account until login exists.
export const ACCOUNT = { name: 'Renz', initials: 'R', role: 'Producer', email: 'renz@vznry.com', color: '#C6F432' };

// The brand picked in the switcher, shared by every page. Mocked: picking a brand doesn't filter the sample data yet.
let pickedBrand = null;
const brandListeners = new Set();
const brandStore = {
  get: () => pickedBrand,
  set: (b) => { pickedBrand = b; brandListeners.forEach((l) => l()); },
  sub: (l) => { brandListeners.add(l); return () => brandListeners.delete(l); }
};
export function usePickedBrand() {
  return [useSyncExternalStore(brandStore.sub, brandStore.get), brandStore.set];
}

// Closes a dropdown on outside click or Escape.
function useDismiss(open, setOpen) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, setOpen]);
  return ref;
}

function BrandSwitcher({ brand }) {
  const [picked, setPicked] = usePickedBrand();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useDismiss(open, setOpen);
  const current = picked || brand;
  const shown = BRANDS.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="stack" style={{ gap: 6 }}>
      <span className="mono faint" style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', padding: '0 10px' }}>Working on</span>
      <div className="menu-wrap" ref={ref}>
        <button type="button" className="brand-btn" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span style={{ width: 22, height: 22, borderRadius: 7, background: current.color, flex: 'none' }} />
          <span className="stack" style={{ flex: 1, minWidth: 0, gap: 1 }}>
            <span style={{ fontWeight: 500 }}>{current.name}</span>
            <span className="faint" style={{ fontSize: 11 }}>Switch brand</span>
          </span>
          <Icon.chevron className="chev" style={{ color: 'var(--faint)' }} />
        </button>
        {open && (
          <div className="menu full" role="listbox" aria-label="Brands">
            <div className="field" style={{ minHeight: 40, margin: '2px 2px 6px', borderRadius: 9 }}>
              <Icon.search style={{ color: 'var(--faint)' }} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a brand" aria-label="Find a brand" style={{ minHeight: 36, fontSize: 13 }} />
            </div>
            <div className="stagger">
              {shown.map((b) => {
                const on = b.name === current.name;
                return (
                  <button key={b.name} type="button" role="option" aria-selected={on} className={'menu-item' + (on ? ' on' : '')} onClick={() => { setPicked(b); setOpen(false); setQ(''); }}>
                    <span style={{ width: 22, height: 22, borderRadius: 7, background: b.color, flex: 'none' }} />
                    <span className="stack" style={{ flex: 1, minWidth: 0, gap: 1 }}>
                      <span>{b.name}</span>
                      <span className="faint" style={{ fontSize: 11 }}>{b.meta}</span>
                    </span>
                    {on && <Icon.check style={{ color: 'var(--lime)' }} />}
                  </button>
                );
              })}
              {shown.length === 0 && <span className="faint" style={{ display: 'block', padding: '10px', fontSize: 13 }}>No brand called "{q}".</span>}
            </div>
            <div className="menu-sep" />
            <button type="button" className="menu-item" style={{ color: 'var(--lime-hover)' }} onClick={() => setOpen(false)}><Icon.plus />Add a brand</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Remembers where the highlight was on the last page, so it can slide from there to the new item.
let lastGlowTop = null;

// `section` decides which sidebar item is highlighted, since product steps live under "Products".
export function Sidebar({ section, brand = BRANDS[1], screen }) {
  const listRef = useRef(null);
  const glowRef = useRef(null);

  useLayoutEffect(() => {
    const g = glowRef.current;
    const el = listRef.current.querySelector('.nav.on');
    if (!el) { g.style.opacity = 0; return; }
    const top = el.offsetTop;
    g.style.opacity = 1;
    g.style.height = el.offsetHeight + 'px';
    g.style.transition = 'none';
    g.style.transform = `translateY(${lastGlowTop ?? top}px)`;
    g.getBoundingClientRect(); // apply the start position before animating
    g.style.transition = '';
    g.style.transform = `translateY(${top}px)`;
    lastGlowTop = top;
  }, [section]);

  return (
    <nav className="side" aria-label="Main">
      <Link to="/" className="side-head" aria-label="VZNRY Engine home">
        <img src="/vznry-logo.png" alt="" width="32" height="32" style={{ borderRadius: 9, border: '1px solid var(--line-3)' }} />
        <span className="wordmark"><b>VZNRY</b><span>ENGINE</span></span>
        <span className="pill mono" style={{ marginLeft: 'auto', fontSize: 10, minHeight: 20, padding: '0 7px' }}>v0.1</span>
      </Link>
      <BrandSwitcher brand={brand} />
      <div className="stack nav-list" ref={listRef} style={{ gap: 2 }}>
        <span className="mono faint" style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', padding: '0 10px 6px' }}>Workspace</span>
        <span className="nav-glow" ref={glowRef} aria-hidden="true" />
        {NAV.map((n) => {
          const I = Icon[n.icon];
          const on = section === n.label;
          return (
            <NavLink key={n.label} to={n.to} end={n.end} className={() => 'nav' + (on ? ' on' : '')} aria-current={on ? 'page' : undefined}>
              <I />
              {n.label}
              {n.count != null && <span className={'pill mono' + (n.lime ? ' lime' : '')} style={{ marginLeft: 'auto' }}>{n.count}</span>}
            </NavLink>
          );
        })}
      </div>
      <div style={{ marginTop: 'auto' }}><BugReport screen={screen} /></div>
      <div className="sub stack" style={{ padding: 14, gap: 10 }}>
        <div className="row between" style={{ fontSize: 13 }}><span className="muted">Credits this month</span><span className="mono">62%</span></div>
        <div className="progress" style={{ height: 6 }}><span className="grow-x" style={{ width: '62%' }} /></div>
        <span className="faint" style={{ fontSize: 12 }}>$1,240 of $2,000 budget</span>
      </div>
    </nav>
  );
}

const NOTES = [
  ['Moyou London asked for changes', '"Red looks a bit orange here." · Salon red, five minutes', '12 min ago', 'red'],
  ['Batch 4 finished generating', '6 videos passed checks and are in the review queue', '2 h ago', 'lime'],
  ['Dollar Tree review is overdue', 'Secrets EP 01–03 · link not opened yet', 'Yesterday', 'amber']
];

function Notifications() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, setOpen);
  return (
    <div className="menu-wrap" ref={ref}>
      <button type="button" className="icon-btn" aria-label="Notifications, 3 new" aria-expanded={open} onClick={() => setOpen(!open)}><Icon.bell /><span className="dot" /></button>
      {open && (
        <div className="menu right" style={{ width: 340, maxWidth: 'calc(100vw - 32px)' }}>
          <div className="menu-label row between"><span>Notifications</span><span style={{ color: 'var(--lime)' }}>3 new</span></div>
          <div className="stagger">
            {NOTES.map(([t, d, when, c]) => (
              <Link key={t} to="/" className="menu-item" style={{ alignItems: 'flex-start', padding: '10px' }} onClick={() => setOpen(false)}>
                <span style={{ flex: 'none', width: 8, height: 8, marginTop: 6, borderRadius: '50%', background: `var(--${c})` }} />
                <span className="stack" style={{ gap: 3, minWidth: 0 }}>
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{t}</span>
                  <span className="muted" style={{ fontSize: 12, lineHeight: 1.4 }}>{d}</span>
                  <span className="faint mono" style={{ fontSize: 11 }}>{when}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, setOpen);
  const a = ACCOUNT;
  return (
    <div className="menu-wrap" ref={ref}>
      <button type="button" className="acct-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="avatar" style={{ width: 30, height: 30, fontSize: 12, background: a.color }}>{a.initials}</span>
        <span className="stack acct-name" style={{ gap: 1, textAlign: 'left' }}>
          <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.1 }}>{a.name}</span>
          <span className="faint" style={{ fontSize: 11, lineHeight: 1.1 }}>{a.role}</span>
        </span>
        <Icon.chevron style={{ color: 'var(--faint)' }} />
      </button>
      {open && (
        <div className="menu right" role="menu">
          <div className="row" style={{ gap: 12, padding: '10px 10px 12px' }}>
            <span className="avatar" style={{ width: 40, height: 40, fontSize: 14, background: a.color }}>{a.initials}</span>
            <span className="stack" style={{ gap: 2, minWidth: 0 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{a.name}</span>
              <span className="faint" style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.email}</span>
            </span>
          </div>
          <div className="row" style={{ gap: 8, padding: '0 10px 10px' }}>
            <span className="pill">{a.role}</span><span className="pill lime">Visionary Studios</span>
          </div>
          <div className="menu-sep" />
          <button type="button" role="menuitem" className="menu-item" onClick={() => setOpen(false)}><Icon.user />Profile</button>
          <button type="button" role="menuitem" className="menu-item" onClick={() => setOpen(false)}><Icon.settings />Workspace settings</button>
          <div className="menu-sep" />
          <button type="button" role="menuitem" className="menu-item" style={{ color: '#FCA5A5' }} onClick={() => setOpen(false)}><Icon.logout />Sign out</button>
        </div>
      )}
    </div>
  );
}

export function TopBar({ crumbs }) {
  return (
    <div className="top">
      <div className="crumb">
        {crumbs.map((c, i) => (
          <span key={i} className="row" style={{ gap: 8 }}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === crumbs.length - 1 ? <b>{c}</b> : <span>{c}</span>}
          </span>
        ))}
      </div>
      <div className="row wrap" style={{ gap: 10 }}>
        <div className="search"><Icon.search /><span style={{ flex: 1 }}>Search or jump to</span><span className="kbd">⌘K</span></div>
        <span className="pill lime mono">Sample data</span>
        <Notifications />
        <AccountMenu />
      </div>
    </div>
  );
}

// Thin lime bar that sweeps across the top on every page change.
function RouteBar() {
  const { pathname } = useLocation();
  return <div key={pathname} className="route-bar" aria-hidden="true" />;
}

export default function Layout({ section, crumbs, screen, brand, guide, children }) {
  return (
    <div className="shell">
      <RouteBar />
      <Sidebar section={section} brand={brand} screen={screen || crumbs[crumbs.length - 1]} />
      <div className="main">
        <TopBar crumbs={crumbs} />
        <div className={'content' + (guide ? ' has-guide' : '')}>{children}</div>
      </div>
    </div>
  );
}

export function PageHead({ eyebrow, title, lede, right }) {
  return (
    <div className="row wrap between" style={{ alignItems: 'flex-end', gap: 20 }}>
      <section className="stack" style={{ gap: 12 }}>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="h1">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
      </section>
      {right}
    </div>
  );
}
