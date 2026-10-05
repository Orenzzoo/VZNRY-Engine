import { NavLink } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import BugReport from './BugReport.jsx';

const NAV = [
  { to: '/', label: 'Products', icon: 'products', end: true },
  { to: '/recipes', label: 'Recipes', icon: 'recipes' },
  { to: '/briefs/new', label: 'Briefs', icon: 'briefs' },
  { to: '/characters', label: 'Characters', icon: 'characters' },
  { to: '/review-queue', label: 'Review queue', icon: 'review', count: 19, lime: true },
  { to: '/client-reviews', label: 'Client reviews', icon: 'send', count: 3 },
  { to: '/library', label: 'Library', icon: 'library' },
  { to: '/product/research', label: 'Buyers', icon: 'buyers' }
];

// `section` decides which sidebar item is highlighted, since product steps live under "Products".
export function Sidebar({ section, brand = { name: 'Moyou London', color: '#C8102E' }, screen }) {
  return (
    <nav className="side" aria-label="Main">
      <div className="row" style={{ gap: 10, padding: '4px 8px' }}>
        <img src="/vznry-logo.png" alt="" width="30" height="30" style={{ borderRadius: 8, border: '1px solid var(--line-3)' }} />
        <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>VZNRY Engine</span>
      </div>
      <button type="button" className="row" style={{ gap: 10, minHeight: 44, padding: '0 10px', borderRadius: 10, background: '#131317', border: '1px solid #23232A', color: 'var(--text)', fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ width: 20, height: 20, borderRadius: 6, background: brand.color, flex: 'none' }} />
        <span style={{ flex: 1 }}>{brand.name}</span>
        <Icon.chevron style={{ color: 'var(--faint)' }} />
      </button>
      <div className="stack" style={{ gap: 2 }}>
        <span className="mono faint" style={{ fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', padding: '0 10px 6px' }}>Workspace</span>
        {NAV.map((n) => {
          const I = Icon[n.icon];
          const on = section === n.label;
          return (
            <NavLink key={n.label} to={n.to} end={n.end} className={() => 'nav' + (on ? ' on' : '')}>
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
        <div style={{ height: 6, borderRadius: 6, background: 'var(--line)', overflow: 'hidden' }}><div style={{ width: '62%', height: '100%', background: 'var(--lime)', borderRadius: 6 }} /></div>
        <span className="faint" style={{ fontSize: 12 }}>$1,240 of $2,000 budget</span>
      </div>
    </nav>
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
      </div>
    </div>
  );
}

export default function Layout({ section, crumbs, screen, brand, guide, children }) {
  return (
    <div className="shell">
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
