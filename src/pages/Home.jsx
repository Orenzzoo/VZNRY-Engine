import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';
import { useCurrentUser, person } from '../data/team.jsx';
import { RESEARCH, STATUS, useWork } from '../data/work.js';
import ResearcherHome from './ResearcherHome.jsx';

// Sample numbers. In the real build these come from the review queue, client rounds and the library.
// Declined = a client pressed "Request changes" and left a comment.
const DECLINED = [
  { title: 'Salon red, five minutes', brand: 'Moyou London', dot: '#C8102E', bg: '#4A0F18', round: 'r2', comment: 'Red looks a bit orange here.', at: '0:07', who: 'Sophie at Moyou', when: '12 min ago' },
  { title: 'Do they lift? Day 7', brand: 'Moyou London', dot: '#C8102E', bg: '#33281F', round: 'r2', comment: 'Can we use a different presenter?', at: '0:02', who: 'Sophie at Moyou', when: '12 min ago' },
  { title: 'The 3 AM rescue', brand: 'Pillow client', dot: '#7C9CF5', bg: '#2B2440', round: 'r5', comment: 'Can the pillow look a bit fluffier when it wakes up?', at: '0:05', who: 'Dan at Pillow client', when: 'Yesterday' },
  { title: 'Too Hot To Handle, video 5', brand: 'Moyou London', dot: '#C8102E', bg: '#3A1F12', round: 'r6', comment: 'Love these. Just swap the music on the last one.', at: '0:00', who: 'Sophie at Moyou', when: 'Fri' }
];
const OVERDUE = { title: 'Dollar Tree Secrets EP 01–03', brand: 'Dollar Tree', dot: '#2E7D32', note: 'Sent Fri, was due Mon. Link not opened yet.' };

const WEEKS = [['17 Aug', 34], ['24 Aug', 41], ['31 Aug', 39], ['7 Sep', 47], ['14 Sep', 52], ['21 Sep', 61], ['28 Sep', 63], ['5 Oct', 72]];
const LAST_30 = WEEKS.slice(-4).reduce((a, [, n]) => a + n, 0);
const PREV_30 = WEEKS.slice(0, 4).reduce((a, [, n]) => a + n, 0);


// Counts up from 0 on first render. Skipped for people who turn motion off.
export function useCountUp(target, ms = 900) {
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

export function Stat({ to, label, value, foot, tone, tip }) {
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

export const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
};

// Each role gets its own home: researchers see the pipeline, editors see their work.
export default function Home() {
  const user = useCurrentUser();
  return user.role === 'researcher' ? <ResearcherHome /> : <EditorHome />;
}

function EditorHome() {
  const user = useCurrentUser();
  const { tasks } = useWork();
  const mine = tasks.filter((t) => t.editor === user.id && t.status !== 'done');
  const hello = greeting();
  const first = user.name.split(' ')[0];
  const max = Math.max(...WEEKS.map(([, n]) => n));
  const growth = Math.round(((LAST_30 - PREV_30) / PREV_30) * 100);
  const attention = DECLINED.length + 1;

  return (
    <Layout section="Home" crumbs={['Visionary Studios', 'Home']} brand={{ name: 'All brands', color: 'var(--lime)' }} screen="Home">
      <section className="row wrap between" style={{ gap: 20, alignItems: 'flex-end' }}>
        <div className="stack" style={{ gap: 8, flex: '1 1 380px' }}>
          <span className="faint" style={{ fontSize: 13 }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <h1 className="h1">{hello}, {first}.</h1>
          <p className="lede">You have <span style={{ color: 'var(--text)' }}>{mine.filter((t) => t.status !== 'client').length} open tasks</span>, and <span style={{ color: 'var(--text)' }}>{DECLINED.length} videos need fixes</span> after client feedback.</p>
        </div>
        <div className="row wrap" style={{ gap: 10 }}>
          <Link className="btn" to="/custom/new"><Icon.briefs size={16} />Custom video</Link>
          <Link className="btn primary" to="/generate"><Icon.sparkle />Generate</Link>
        </div>
      </section>

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 14 }}>
        <Stat to="/client-reviews" label="Needs attention" value={attention} tone="#FCA5A5" foot={`${DECLINED.length} declined with comments · 1 overdue`} tip="Videos a client sent back with a comment, plus reviews past their due date." />
        <Stat to="/tasks" label="With the researcher for review" value={mine.filter((t) => t.status === 'review').length} foot={`${mine.filter((t) => t.status === 'approved').length} approved, ready to send`} />
        <Stat to="/client-reviews" label="With clients now" value={9} foot="2 review rounds out" />
        <Stat to="/library" label="Videos made, last 30 days" value={LAST_30} tone="var(--lime)" foot={`+${growth}% on the 30 days before`} tip="Every video the engine finished, before human review." />
      </div>

      <section className="card" style={{ overflow: 'hidden' }}>
        <div className="row wrap between" style={{ padding: '18px 20px', gap: 10 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="h2">Your tasks</h2>
            <span className="muted" style={{ fontSize: 13 }}>Handed to you by the researcher, with the research attached.</span>
          </div>
          <Link to="/tasks" style={{ fontSize: 13, fontWeight: 600 }}>All tasks →</Link>
        </div>
        <div className="stagger">
          {mine.map((t) => {
            const r = RESEARCH[t.research];
            return (
              <Link key={t.id} to={`/tasks?task=${t.id}`} className="list-row" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto', textDecoration: 'none' }}>
                <span className="stack" style={{ gap: 4, minWidth: 0 }}>
                  <span className="row wrap" style={{ gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: r.dot }} /><span style={{ fontWeight: 600 }}>{r.product}</span><span className="faint" style={{ fontSize: 13 }}>· {t.title}</span>{t.fresh && <span className="pill lime" style={{ fontSize: 11, minHeight: 20 }}>New</span>}</span>
                  <span className="faint" style={{ fontSize: 12 }}>{r.brand} · {t.target} videos · from {person(t.from).name}</span>
                </span>
                <span className="stack" style={{ gap: 6, alignItems: 'flex-end' }}><span className={'pill ' + STATUS[t.status].cls}>{STATUS[t.status].label}</span><span className="mono faint" style={{ fontSize: 11 }}>due {t.due}</span></span>
              </Link>
            );
          })}
          {mine.length === 0 && <span className="muted" style={{ display: 'block', padding: '0 20px 18px', fontSize: 14 }}>No tasks right now. New ones from the researcher show up here.</span>}
        </div>
      </section>

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
              <Link key={d.title} to={`/product/review?round=${d.round}`} className="list-row" style={{ gridTemplateColumns: '56px minmax(0, 1fr) auto', textDecoration: 'none' }}>
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
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--lime)', whiteSpace: 'nowrap' }}>Fix it →</span>
              </Link>
            ))}
            <Link to="/product/review?round=r3" className="list-row" style={{ gridTemplateColumns: '56px minmax(0, 1fr) auto', textDecoration: 'none' }}>
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

    </Layout>
  );
}
