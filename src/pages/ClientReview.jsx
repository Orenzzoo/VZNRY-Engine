import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';

// The page a client opens from a review link. No sidebar, no login.
// In the real build, load the round by the :roundId in the URL and save decisions/comments to the backend.
const VIDS = [
  { id: 'v1', title: 'Red before the event', recipe: 'AI UGC', len: 18, bg: '#3B2A22', caption: "Wedding's Saturday. Zero appointments." },
  { id: 'v2', title: 'My nails after gels', recipe: 'Wall of text', len: 9, bg: '#24252C', caption: 'Nobody warned me about the removal…' },
  { id: 'v3', title: 'Salon red, five minutes', recipe: 'Product B-roll', len: 12, bg: '#4A0F18', caption: 'Salon red. Five minutes.' },
  { id: 'v4', title: 'Do they lift? Day 7', recipe: 'Before and after', len: 15, bg: '#33281F', caption: 'You said they lift by day two.' },
  { id: 'v5', title: '£40 every two weeks', recipe: 'AI UGC', len: 20, bg: '#3A2E2B', caption: 'I did the maths on my salon habit' },
  { id: 'v6', title: 'Group chat: help', recipe: 'Native story', len: 11, bg: '#1E2638', caption: 'me: party in 3 hrs, nails are tragic' }
];
const fmt = (s) => '0:' + String(s).padStart(2, '0');

export default function ClientReview() {
  const [decisions, setDecisions] = useState({ v1: 'ok' });
  const [comments, setComments] = useState({
    v1: [{ t: 3, who: 'You', text: 'Love this opening, keep it.' }],
    v3: [{ t: 7, who: 'Visionary Studios', text: 'Round 2: red colour corrected after your note.' }]
  });
  const [curId, setCurId] = useState('v1');
  const [time, setTime] = useState(0);
  const [draft, setDraft] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cur = VIDS.find((v) => v.id === curId);
  const list = (comments[curId] || []).slice().sort((a, b) => a.t - b.t);
  const d = decisions[curId];
  const decided = VIDS.filter((v) => decisions[v.id]).length;
  const approved = VIDS.filter((v) => decisions[v.id] === 'ok').length;
  const rejected = VIDS.filter((v) => decisions[v.id] === 'no').length;
  const commentTotal = Object.values(comments).reduce((a, l) => a + l.length, 0);
  const setDecision = (val) => { setDecisions({ ...decisions, [curId]: d === val ? undefined : val }); setSubmitted(false); };
  const post = () => {
    if (!draft.trim()) return;
    setComments({ ...comments, [curId]: (comments[curId] || []).concat([{ t: time, who: 'You', text: draft.trim() }]) });
    setDraft(''); setSubmitted(false);
  };
  const statusOf = (id) => decisions[id] === 'ok' ? ['Approved', 'green'] : decisions[id] === 'no' ? ['Changes requested', 'red'] : ['To review', ''];

  return (
    <div className="stack" style={{ minHeight: '100vh' }}>
      <div className="row wrap between" style={{ gap: 10, padding: '10px 24px', background: '#15170F', borderBottom: '1px solid rgba(198,244,50,0.25)', fontSize: 13 }}>
        <span style={{ color: 'var(--lime-hover)' }}>Preview: this is the page your client sees from the review link. No login, no sidebar.</span>
        <Link to="/product/deliver" style={{ fontWeight: 600, textDecoration: 'none' }}>Back to Deliver</Link>
      </div>

      <header className="row wrap between" style={{ gap: 16, padding: '18px 32px', borderBottom: '1px solid #1F1F25' }}>
        <div className="row" style={{ gap: 14 }}>
          <img src="/vznry-logo.png" alt="VZNRY" width="34" height="34" style={{ borderRadius: 9, border: '1px solid var(--line-3)' }} />
          <div className="stack" style={{ gap: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>Moyou London · Red Alert, round 2</span>
            <span className="faint" style={{ fontSize: 13 }}>From Visionary Studios · due Thu 8 Oct</span>
          </div>
        </div>
        <div className="row" style={{ gap: 14 }}>
          <div className="stack" style={{ gap: 6, minWidth: 180 }}>
            <div className="row between" style={{ fontSize: 12 }}><span className="faint">Reviewed</span><span className="mono">{decided} / {VIDS.length}</span></div>
            <div style={{ height: 6, borderRadius: 6, background: 'var(--line)', overflow: 'hidden' }}><div style={{ width: (decided / VIDS.length) * 100 + '%', height: '100%', background: 'var(--lime)' }} /></div>
          </div>
          <button type="button" className="btn primary" onClick={() => setSubmitted(true)}>{submitted ? 'Review sent' : `Send review (${decided} of ${VIDS.length})`}</button>
        </div>
      </header>

      {submitted && <div className="notice" style={{ margin: '20px 32px 0' }}>Thanks! Your review was sent to Visionary Studios: {approved} approved, {rejected} with changes requested, {commentTotal} comments. Approved videos are now available to download.</div>}

      <div style={{ padding: '20px 32px 0', maxWidth: 1440, width: '100%' }}>
      </div>

      <main className="row wrap" style={{ flex: 1, gap: 24, padding: '24px 32px 48px', alignItems: 'flex-start', maxWidth: 1440, width: '100%' }}>
        <aside className="stack" style={{ flex: '1 1 260px', minWidth: 0, gap: 4 }}>
          <span className="faint" style={{ fontSize: 12, padding: '0 10px 8px' }}>{VIDS.length} videos</span>
          {VIDS.map((v) => {
            const [st, cls] = statusOf(v.id);
            const n = (comments[v.id] || []).length;
            return (
              <button key={v.id} type="button" className="row" onClick={() => { setCurId(v.id); setTime(0); setDraft(''); }}
                style={{ gap: 12, width: '100%', padding: 10, borderRadius: 14, border: '1px solid ' + (v.id === curId ? 'var(--line-3)' : 'transparent'), background: v.id === curId ? '#18181D' : 'transparent', color: 'var(--text)', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ flex: 'none', width: 40, height: 58, borderRadius: 8, background: v.bg, border: '1px solid var(--line-3)' }} />
                <span className="stack" style={{ flex: 1, minWidth: 0, gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{v.title}</span>
                  <span className="row" style={{ gap: 8 }}><span className={'pill ' + cls}>{st}</span>{n > 0 && <span className="faint mono" style={{ fontSize: 12 }}>{n} comments</span>}</span>
                </span>
              </button>
            );
          })}
        </aside>

        <section className="row wrap" style={{ flex: '999 1 640px', minWidth: 0, gap: 24, alignItems: 'flex-start' }}>
          <div className="stack" style={{ flex: 'none', width: 320, maxWidth: '100%', gap: 12, margin: '0 auto' }}>
            <div className="phone" style={{ width: '100%', aspectRatio: '9 / 16', borderRadius: 22, background: cur.bg }}>
              <span className="head" style={{ top: '26%' }} /><span className="body" style={{ top: '46%' }} />
              <div style={{ position: 'absolute', left: '50%', top: '50%', width: 64, height: 64, transform: 'translate(-50%, -50%)', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.play size={26} /></div>
              <span className="cap" style={{ fontSize: 18, bottom: 22, left: 16, right: 16 }}>{cur.caption}</span>
              <span className="mono" style={{ position: 'absolute', top: 12, right: 12, fontSize: 12, padding: '3px 8px', borderRadius: 7, background: 'rgba(11,11,15,0.7)' }}>{fmt(time)} / {fmt(cur.len)}</span>
            </div>
            <div>
              <label htmlFor="scrub" className="sr-only">Video position</label>
              <input id="scrub" type="range" min="0" max={cur.len} step="1" value={time} onChange={(e) => setTime(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--lime)', minHeight: 28 }} />
              <div style={{ position: 'relative', height: 10, margin: '0 8px' }}>
                {list.map((c, i) => <span key={i} style={{ position: 'absolute', left: (c.t / cur.len) * 100 + '%', top: 0, width: 8, height: 8, marginLeft: -4, borderRadius: '50%', background: 'var(--lime)' }} />)}
              </div>
            </div>
            <span className="faint" style={{ fontSize: 12, textAlign: 'center' }}>Drag to a moment, then comment. Dots show where comments are.</span>
          </div>

          <div className="stack" style={{ flex: '1 1 320px', minWidth: 0, gap: 16 }}>
            <div className="stack" style={{ gap: 6 }}>
              <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{cur.title}</h1>
              <span className="faint" style={{ fontSize: 14 }}>{cur.recipe} · {fmt(cur.len)} · also in 4:5</span>
            </div>
            <div className="row" style={{ gap: 10 }}>
              <button type="button" className="btn" aria-pressed={d === 'no'} onClick={() => setDecision('no')} style={{ flex: 1, minHeight: 52, borderRadius: 14, fontSize: 15, fontWeight: 600, ...(d === 'no' ? { background: '#EF4444', borderColor: '#EF4444', color: '#fff' } : {}) }}><Icon.x size={18} />Request changes</button>
              <button type="button" className="btn" aria-pressed={d === 'ok'} onClick={() => setDecision('ok')} style={{ flex: 1, minHeight: 52, borderRadius: 14, fontSize: 15, fontWeight: 600, ...(d === 'ok' ? { background: '#22C55E', borderColor: '#22C55E', color: '#04130A' } : {}) }}><Icon.check size={18} />Approve</button>
            </div>
            {d === 'no' && !list.some((c) => c.who === 'You') && <span style={{ fontSize: 13, color: '#FCA5A5' }}>Tell the team what to change. Add a comment below.</span>}

            <div className="card stack" style={{ overflow: 'hidden' }}>
              <div className="row between" style={{ padding: '14px 16px' }}><h2 style={{ fontSize: 15, fontWeight: 600 }}>Comments</h2><span className="faint mono" style={{ fontSize: 12 }}>{list.length}</span></div>
              {!list.length && <span className="faint" style={{ padding: '0 16px 14px', fontSize: 14 }}>No comments yet.</span>}
              {list.map((c, i) => (
                <div key={i} className="row" style={{ gap: 12, padding: '12px 16px', borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
                  <div style={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', background: c.who === 'You' ? 'var(--lime)' : '#93C5FD', color: '#0B0B0F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{c.who[0]}</div>
                  <div className="stack" style={{ flex: 1, minWidth: 0, gap: 4 }}>
                    <div className="row wrap" style={{ gap: 8 }}><span style={{ fontSize: 13, fontWeight: 600 }}>{c.who}</span>
                      <button type="button" className="mono" onClick={() => setTime(c.t)} style={{ minHeight: 28, padding: '0 8px', borderRadius: 7, border: '1px solid rgba(198,244,50,0.3)', background: 'rgba(198,244,50,0.08)', color: 'var(--lime-hover)', fontSize: 12, cursor: 'pointer' }}>{fmt(c.t)}</button>
                    </div>
                    <span style={{ fontSize: 14, lineHeight: 1.5 }}>{c.text}</span>
                  </div>
                </div>
              ))}
              <div className="row" style={{ gap: 8, padding: '12px 16px', borderTop: '1px solid var(--line)', background: '#0F0F13' }}>
                <label htmlFor="cmt" className="sr-only">Comment</label>
                <input id="cmt" className="in" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && post()} placeholder={`Comment at ${fmt(time)}…`} style={{ fontSize: 14 }} />
                <button type="button" className="btn primary" onClick={post}>Post</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
