import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { ACCOUNT } from '../components/Layout.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

// Sample numbers. In the real build these come from the review queue, client rounds and the library.
// Declined = a client pressed "Request changes" and left a comment.
const DECLINED = [
  { title: 'Salon red, five minutes', brand: 'Moyou London', dot: '#C8102E', bg: '#4A0F18', comment: 'Red looks a bit orange here.', at: '0:07', who: 'Sophie at Moyou', when: '12 min ago' },
  { title: 'Do they lift? Day 7', brand: 'Moyou London', dot: '#C8102E', bg: '#33281F', comment: 'Can we use a different presenter?', at: '0:02', who: 'Sophie at Moyou', when: '12 min ago' },
  { title: 'The 3 AM rescue', brand: 'Pillow client', dot: '#7C9CF5', bg: '#2B2440', comment: 'Can the pillow look a bit fluffier when it wakes up?', at: '0:05', who: 'Dan at Pillow client', when: 'Yesterday' },
  { title: 'Too Hot To Handle, video 5', brand: 'Moyou London', dot: '#C8102E', bg: '#3A1F12', comment: 'Love these. Just swap the music on the last one.', at: '0:00', who: 'Sophie at Moyou', when: 'Fri' }
];
const OVERDUE = { title: 'Dollar Tree Secrets EP 01–03', brand: 'Dollar Tree', dot: '#2E7D32', note: 'Sent Fri, was due Mon. Link not opened yet.' };

const WEEKS = [['17 Aug', 34], ['24 Aug', 41], ['31 Aug', 39], ['7 Sep', 47], ['14 Sep', 52], ['21 Sep', 61], ['28 Sep', 63], ['5 Oct', 72]];
const LAST_30 = WEEKS.slice(-4).reduce((a, [, n]) => a + n, 0);
const PREV_30 = WEEKS.slice(0, 4).reduce((a, [, n]) => a + n, 0);

const RUNNING = [
  { name: 'Too Hot To Handle · Batch 2', brand: 'Moyou London', dot: '#C8102E', step: 'Generating videos', done: 7, of: 12 },
  { name: 'Dollar Tree Secrets · EP 04–06', brand: 'Dollar Tree', dot: '#2E7D32', step: 'Checking facts', done: 2, of: 3 },
  { name: 'Periwinkle', brand: 'Moyou London', dot: '#C8102E', step: 'Researching buyers', done: 3, of: 4 }
];
const ACTIVITY = [
  ['Sophie at Moyou requested changes on 2 videos', '12 min ago', 'red'],
  ['Batch 4 passed automatic checks (6 videos)', '2 h ago', 'lime'],
  ['HookLife downloaded 8 approved videos', 'Wed', 'green'],
  ['Arland kept 5 of 6 in Too Hot To Handle', 'Tue', 'blue']
];

// Counts up from 0 on first render. Skipped for people who turn motion off.
function useCountUp(target, ms = 900) {
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [n, setN] = useState(still ? target : 0);
  useEffect(() => {
    if (still) return;
    let raf, start;
    const tick = (t) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, still]);
  return n;
}

function Stat({ to, label, value, foot, tone, tip }) {
  const n = useCountUp(value);
  return (
    <Link to={to} className="card stat">
      <span className="row between" style={{ fontSize: 13 }}>
        <span className="muted" title={tip}>{label}{tip && ' ⓘ'}</span>
        <Icon.arrow style={{ color: 'var(--faint)' }} />
      </span>
      <span className="num" style={tone ? { color: tone } : undefined}>{n}</span>
      <span className="faint" style={{ fontSize: 12 }}>{foot}</span>
    </Link>
  );
}

export default function Home() {
  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const first = ACCOUNT.name.split(' ')[0];
  const max = Math.max(...WEEKS.map(([, n]) => n));
  const growth = Math.round(((LAST_30 - PREV_30) / PREV_30) * 100);
  const attention = DECLINED.length + 1;

  return (
    <Layout section="Home" crumbs={['Visionary Studios', 'Home']} brand={{ name: 'All brands', color: 'var(--lime)' }} screen="Home" guide>
      <section className="card hero-glow row wrap between" style={{ padding: '28px 28px', gap: 24, alignItems: 'flex-end' }}>
        <div className="stack" style={{ gap: 12, position: 'relative', flex: '1 1 380px' }}>
          <span className="eyebrow">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <h1 className="h1">{hello}, {first}.</h1>
          <p className="lede"><span style={{ color: 'var(--text)' }}>{DECLINED.length} videos need fixes</span> after client feedback and <span style={{ color: 'var(--text)' }}>1 client review is overdue</span>. Everything else is moving.</p>
        </div>
        <div className="row wrap" style={{ gap: 10, position: 'relative' }}>
          <Link className="btn primary" to="/product/new"><Icon.plus />New product</Link>
          <Link className="btn" to="/briefs/new"><Icon.briefs size={16} />New brief</Link>
          <Link className="btn" to="/characters?new=generate"><Icon.wand />Generate character</Link>
        </div>
      </section>

      <Guide
        title="How the home page works"
        open={false}
        items={[
          ["What it's for", 'A quick look at what needs you today, across every brand.'],
          ['What you do', 'Start with "Needs attention": these are videos a client sent back with a comment. Click one to fix it. The tiles jump to the matching page.'],
          ['What happens next', 'Fixed videos go out again as the next review round. The numbers here update as work moves along.']
        ]}
        terms={<><span><b>Declined</b> = a client pressed "Request changes" on a video and left a comment.</span><span><b>Output</b> = videos the engine finished making, before anyone reviews them.</span></>}
      />

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 14 }}>
        <Stat to="/client-reviews" label="Needs attention" value={attention} tone="#FCA5A5" foot={`${DECLINED.length} declined with comments · 1 overdue`} tip="Videos a client sent back with a comment, plus reviews past their due date." />
        <Stat to="/review-queue" label="Waiting for your review" value={19} foot="5 batches · oldest 3 days" />
        <Stat to="/client-reviews" label="With clients now" value={9} foot="2 review rounds out" />
        <Stat to="/library" label="Videos made, last 30 days" value={LAST_30} tone="var(--lime)" foot={`+${growth}% on the 30 days before`} tip="Every video the engine finished, before human review." />
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card" style={{ flex: '999 1 520px', minWidth: 0, overflow: 'hidden' }}>
          <div className="row wrap between" style={{ padding: '18px 20px', gap: 10 }}>
            <div className="stack" style={{ gap: 4 }}>
              <h2 className="h2">Needs attention</h2>
              <span className="muted" style={{ fontSize: 13 }}>Declined by a client, with their comment. Newest first.</span>
            </div>
            <span className="pill red mono">{attention}</span>
          </div>
          <div className="stagger">
            {DECLINED.map((d) => (
              <Link key={d.title} to="/client-reviews" className="list-row" style={{ gridTemplateColumns: '56px minmax(0, 1fr) auto', textDecoration: 'none' }}>
                <span className="row" style={{ justifyContent: 'center', width: 56, height: 72, borderRadius: 10, background: d.bg, color: 'rgba(255,255,255,0.75)' }}><Icon.play size={18} /></span>
                <span className="stack" style={{ gap: 6, minWidth: 0 }}>
                  <span className="row wrap" style={{ gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>{d.title}</span>
                    <span className="row faint" style={{ gap: 6, fontSize: 12 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: d.dot }} />{d.brand}</span>
                  </span>
                  <span className="row" style={{ gap: 8, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.45, color: '#D4D4D8' }}>
                    <Icon.message style={{ flex: 'none', marginTop: 2, color: 'var(--faint)' }} />
                    <span>"{d.comment}" <span className="mono faint" style={{ fontSize: 12 }}>at {d.at}</span></span>
                  </span>
                  <span className="faint" style={{ fontSize: 12 }}>{d.who} · {d.when}</span>
                </span>
                <span className="stack" style={{ gap: 8, alignItems: 'flex-end' }}>
                  <span className="pill red">Changes requested</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--lime)' }}>Fix it →</span>
                </span>
              </Link>
            ))}
            <Link to="/client-reviews" className="list-row" style={{ gridTemplateColumns: '56px minmax(0, 1fr) auto', textDecoration: 'none' }}>
              <span className="row" style={{ justifyContent: 'center', width: 56, height: 56, borderRadius: 10, background: 'rgba(251,146,60,0.1)', color: 'var(--amber)' }}><Icon.send /></span>
              <span className="stack" style={{ gap: 4, minWidth: 0 }}>
                <span className="row wrap" style={{ gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{OVERDUE.title}</span>
                  <span className="row faint" style={{ gap: 6, fontSize: 12 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: OVERDUE.dot }} />{OVERDUE.brand}</span>
                </span>
                <span className="muted" style={{ fontSize: 13 }}>{OVERDUE.note}</span>
              </span>
              <span className="stack" style={{ gap: 8, alignItems: 'flex-end' }}>
                <span className="pill amber">Overdue</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--lime)' }}>Nudge →</span>
              </span>
            </Link>
          </div>
        </section>

        <aside className="stack" style={{ flex: '1 1 320px', minWidth: 0, gap: 20 }}>
          <section className="card stack" style={{ padding: 20, gap: 16 }}>
            <div className="row between" style={{ alignItems: 'flex-start' }}>
              <div className="stack" style={{ gap: 4 }}>
                <h2 className="h2">Output</h2>
                <span className="muted" style={{ fontSize: 13 }}>Videos made per week, last 8 weeks</span>
              </div>
              <span className="pill lime mono">+{growth}%</span>
            </div>
            <div className="row" style={{ alignItems: 'baseline', gap: 8 }}>
              <span className="mono" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.02em' }}>{WEEKS[WEEKS.length - 1][1]}</span>
              <span className="faint" style={{ fontSize: 13 }}>this week</span>
            </div>
            <div className="row" role="img" aria-label={'Videos made per week: ' + WEEKS.map(([w, n]) => `${w} ${n}`).join(', ')} style={{ height: 140, gap: 2, alignItems: 'stretch', borderBottom: '1px solid var(--line-3)' }}>
              {WEEKS.map(([w, n], i) => (
                <div key={w} className={'bar-col' + (i === WEEKS.length - 1 ? ' now' : '')}>
                  <span className="tip"><span className="mono">{n}</span> <span className="faint">videos · week of {w}</span></span>
                  <span className="b grow-y" style={{ height: `${(n / max) * 100}%`, animationDelay: `${i * 0.05}s` }} />
                </div>
              ))}
            </div>
            <div className="row" style={{ gap: 2 }}>
              {WEEKS.map(([w], i) => <span key={w} className="mono faint" style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 10, visibility: i % 2 === 1 || i === WEEKS.length - 1 ? 'visible' : 'hidden' }}>{w}</span>)}
            </div>
            <div className="grid-auto" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="sub stack" style={{ padding: 12, gap: 4 }}><span className="faint" style={{ fontSize: 12 }}>Approved by clients</span><span className="mono" style={{ fontSize: 18 }}>86%</span></div>
              <div className="sub stack" style={{ padding: 12, gap: 4 }}><span className="faint" style={{ fontSize: 12 }}>Avg. time to approve</span><span className="mono" style={{ fontSize: 18 }}>1.8 days</span></div>
            </div>
          </section>
        </aside>
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card stack" style={{ flex: '999 1 420px', minWidth: 0, padding: 20, gap: 16 }}>
          <div className="row between"><h2 className="h2">In progress</h2><span className="faint" style={{ fontSize: 13 }}>Runs by itself</span></div>
          <div className="stack stagger" style={{ gap: 16 }}>
            {RUNNING.map((r) => (
              <div key={r.name} className="stack" style={{ gap: 8 }}>
                <div className="row wrap between" style={{ gap: 8 }}>
                  <span className="row" style={{ gap: 8, fontSize: 14, fontWeight: 500 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: r.dot }} />{r.name}</span>
                  <span className="row faint" style={{ gap: 8, fontSize: 12 }}><span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)' }} />{r.step} · <span className="mono">{r.done}/{r.of}</span></span>
                </div>
                <div className="progress"><span className="grow-x" style={{ width: `${(r.done / r.of) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
        <section className="card" style={{ flex: '1 1 320px', minWidth: 0, overflow: 'hidden' }}>
          <h2 className="h2" style={{ padding: '18px 20px 10px' }}>Recent activity</h2>
          <div className="stagger">
            {ACTIVITY.map(([t, when, c]) => (
              <div key={t} className="row" style={{ gap: 12, padding: '12px 20px', borderTop: '1px solid var(--line)', fontSize: 13, lineHeight: 1.45 }}>
                <span style={{ flex: 'none', width: 8, height: 8, borderRadius: '50%', background: `var(--${c})` }} />
                <span style={{ flex: 1, minWidth: 0 }}>{t}</span>
                <span className="mono faint" style={{ fontSize: 11 }}>{when}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
