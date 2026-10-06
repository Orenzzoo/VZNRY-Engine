import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { ROUNDS, DECISION, decisionOf, roundCounts, fmtTime } from '../data/reviews.js';
import { useCurrentUser } from '../data/team.jsx';

// "Client feedback" on the Review page: one round, its videos one by one, with the client's decision and timestamped comments.
export default function ClientFeedback({ roundId, onRound }) {
  const user = useCurrentUser();
  const round = ROUNDS.find((r) => r.id === roundId) || ROUNDS[0];
  const n = roundCounts(round);
  const [idx, setIdx] = useState(() => Math.max(0, round.videos.findIndex((x) => x.decision === 'no')));
  const [time, setTime] = useState(0);
  const [replies, setReplies] = useState({});
  const [draft, setDraft] = useState('');
  const vid = round.videos[Math.min(idx, round.videos.length - 1)];
  const d = decisionOf(vid);
  const thread = [...vid.comments, ...(replies[round.id + vid.id] || [])].sort((a, b) => a.t - b.t);
  const go = (i) => { setIdx(i); setTime(0); setDraft(''); };
  const reply = () => {
    if (!draft.trim()) return;
    const k = round.id + vid.id;
    setReplies({ ...replies, [k]: [...(replies[k] || []), { t: time, who: user.name, text: draft.trim(), us: true }] });
    setDraft('');
  };
  const seek = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    setTime(Math.max(0, Math.min(vid.len, Math.round(((e.clientX - box.left) / box.width) * vid.len))));
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <section className="card row wrap between" style={{ padding: '16px 20px', gap: 16 }}>
        <div className="stack" style={{ gap: 6, flex: '1 1 300px', minWidth: 0 }}>
          <label htmlFor="cf-round" className="faint" style={{ fontSize: 12 }}>Review round</label>
          <select id="cf-round" className="in" value={round.id} onChange={(e) => { onRound(e.target.value); setIdx(0); setTime(0); }} style={{ minHeight: 44, maxWidth: 460 }}>
            {ROUNDS.map((r) => <option key={r.id} value={r.id}>{r.client} · {r.product} · {r.round} ({r.status})</option>)}
          </select>
        </div>
        <div className="stack" style={{ gap: 8, flex: '1 1 260px', minWidth: 0 }}>
          <div className="row" style={{ height: 8, borderRadius: 8, overflow: 'hidden', gap: 2, background: 'var(--line)' }}>
            <div className="grow-x" style={{ flex: n.ok, height: '100%', background: 'var(--green)' }} />
            <div className="grow-x" style={{ flex: n.no, height: '100%', background: 'var(--red)' }} />
            <div style={{ flex: n.wait, height: '100%', background: '#3A3A42' }} />
          </div>
          <div className="row wrap faint" style={{ gap: 12, fontSize: 12 }}>
            <span><span className="mono" style={{ color: '#86EFAC' }}>{n.ok}</span> approved</span>
            <span><span className="mono" style={{ color: '#FCA5A5' }}>{n.no}</span> changes</span>
            <span><span className="mono">{n.wait}</span> not reviewed</span>
            <span><span className="mono">{n.comments}</span> comments</span>
          </div>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className={'pill ' + round.statusCls}>{round.status}</span>
          <Link className="btn sm" to={`/review/${round.id}`}>Client's view</Link>
        </div>
      </section>

      <div key={round.id + vid.id} className="row wrap anim-in" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card stack" style={{ flex: '1 1 320px', minWidth: 0, padding: 20, gap: 14, alignItems: 'center' }}>
          <div className="phone stack" style={{ width: '100%', maxWidth: 280, aspectRatio: '9 / 16', borderRadius: 22, background: vid.bg, padding: 14, justifyContent: 'space-between' }}>
            <div className="row between" style={{ position: 'relative' }}>
              <span className="pill mono" style={{ background: 'rgba(11,11,15,0.7)' }}>{idx + 1} / {round.videos.length}</span>
              <span className={'pill ' + d.cls} style={{ background: 'rgba(11,11,15,0.75)' }}>{d.label}</span>
            </div>
            <span className="head" style={{ top: '28%' }} /><span className="body" />
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.play /></div>
            </div>
            <span style={{ position: 'relative', alignSelf: 'center', textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#0B0B0F', lineHeight: 1.25, padding: '6px 10px', background: '#fff', borderRadius: 8 }}>{vid.caption}</span>
          </div>

          <div className="stack" style={{ gap: 6, width: '100%', maxWidth: 280 }}>
            <div role="slider" tabIndex={0} aria-label="Playhead" aria-valuemin={0} aria-valuemax={vid.len} aria-valuenow={time} onClick={seek}
              onKeyDown={(e) => { if (e.key === 'ArrowRight') setTime(Math.min(vid.len, time + 1)); if (e.key === 'ArrowLeft') setTime(Math.max(0, time - 1)); }}
              style={{ position: 'relative', height: 22, cursor: 'pointer' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 9, height: 4, borderRadius: 4, background: 'var(--line-3)' }} />
              <div style={{ position: 'absolute', left: 0, top: 9, height: 4, borderRadius: 4, width: `${(time / vid.len) * 100}%`, background: 'var(--text)', transition: 'width .2s var(--ease)' }} />
              {thread.map((m, i) => (
                <span key={i} title={`${fmtTime(m.t)} · ${m.who}: ${m.text}`} style={{ position: 'absolute', top: 5, left: `calc(${(m.t / vid.len) * 100}% - 6px)`, width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--card)', background: m.us ? 'var(--lime)' : d.color === '#3A3A42' ? 'var(--amber)' : d.color }} />
              ))}
            </div>
            <div className="row between mono faint" style={{ fontSize: 11 }}><span>{fmtTime(time)}</span><span>{fmtTime(vid.len)}</span></div>
          </div>

          <div className="row" style={{ gap: 8, width: '100%', maxWidth: 280 }}>
            <button type="button" className={'btn sm' + (idx === 0 ? ' off' : '')} style={{ flex: 1 }} disabled={idx === 0} onClick={() => go(idx - 1)}>← Previous</button>
            <button type="button" className={'btn sm' + (idx >= round.videos.length - 1 ? ' off' : '')} style={{ flex: 1 }} disabled={idx >= round.videos.length - 1} onClick={() => go(idx + 1)}>Next →</button>
          </div>
        </section>

        <section className="card stack" style={{ flex: '999 1 380px', minWidth: 0, padding: 20, gap: 16 }}>
          <div className="row wrap between" style={{ gap: 10, alignItems: 'flex-start' }}>
            <div className="stack" style={{ gap: 6 }}>
              <span className="mono faint" style={{ fontSize: 12 }}>Video {idx + 1} of {round.videos.length} · {vid.recipe} · {fmtTime(vid.len)}</span>
              <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{vid.title}</h2>
            </div>
            <span className={'pill ' + d.cls} style={{ minHeight: 30, padding: '0 12px', fontSize: 13 }}>{vid.decision === 'ok' && <Icon.check size={13} />}{vid.decision === 'no' && <Icon.x size={13} />}{d.label}</span>
          </div>

          <div className="stack" style={{ gap: 10 }}>
            <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>Comments · {thread.length}</span>
            {thread.length === 0 && <span className="muted" style={{ fontSize: 14 }}>{vid.decision ? `${round.reviewer} didn't leave a comment on this one.` : `${round.reviewer} hasn't reviewed this video yet.`}</span>}
            <div className="stack stagger" style={{ gap: 8 }}>
              {thread.map((m, i) => (
                <button key={i} type="button" onClick={() => setTime(m.t)} className="sub row" style={{ gap: 12, padding: 12, alignItems: 'flex-start', textAlign: 'left', color: 'var(--text)', cursor: 'pointer', font: 'inherit', borderColor: m.us ? 'rgba(198,244,50,0.25)' : undefined }}>
                  <span className="avatar" style={{ width: 28, height: 28, fontSize: 12, background: m.us ? 'var(--lime)' : round.dot, color: m.us ? '#0B0B0F' : '#fff' }}>{m.who[0]}</span>
                  <span className="stack" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12 }}><b>{m.who}</b> <span className="faint">{m.us ? '· Visionary Studios' : `· ${round.client}`}</span></span>
                    <span style={{ fontSize: 14, lineHeight: 1.5 }}>{m.text}</span>
                  </span>
                  <span className="pill mono" title="Jump to this moment">{fmtTime(m.t)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="stack" style={{ gap: 8 }}>
            <label htmlFor="cf-reply" style={{ fontSize: 13, fontWeight: 600 }}>Reply to {round.reviewer} <span className="faint" style={{ fontWeight: 400 }}>· at {fmtTime(time)}</span></label>
            <div className="row" style={{ gap: 8 }}>
              <input id="cf-reply" className="in" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && reply()} placeholder="e.g. Fixed in the next round" style={{ minHeight: 44 }} />
              <button type="button" className={'btn ' + (draft.trim() ? 'primary' : 'off')} onClick={reply}>Reply</button>
            </div>
          </div>

          {vid.decision === 'no' && round.task && (
            <div className="notice row wrap between" style={{ gap: 10, background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.3)', color: '#FCA5A5' }}>
              <span>{round.reviewer} asked for changes on this video.</span>
              <Link className="btn sm primary" to={`/generate?task=${round.task}`}>Fix in Generate</Link>
            </div>
          )}
        </section>
      </div>

      <section className="stack" style={{ gap: 10 }}>
        <div className="row between"><h2 className="h2">All videos in this round</h2><span className="faint" style={{ fontSize: 13 }}>Click one to open it</span></div>
        <div className="row" style={{ gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
          {round.videos.map((x, i) => {
            const xd = decisionOf(x);
            const on = i === idx;
            return (
              <button key={x.id} type="button" className={'pick' + (on ? ' on' : '')} aria-pressed={on} onClick={() => go(i)} style={{ flex: 'none', width: 150, padding: 6, gap: 8 }}>
                <span style={{ display: 'block', position: 'relative', aspectRatio: '9 / 16', borderRadius: 10, background: x.bg, overflow: 'hidden' }}>
                  <span style={{ position: 'absolute', left: 6, right: 6, top: '40%', fontSize: 10, fontWeight: 700, lineHeight: 1.3, color: '#0B0B0F', background: '#fff', padding: '3px 5px', borderRadius: 5, textAlign: 'center' }}>{x.caption}</span>
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: xd.color }} />
                </span>
                <span className="stack" style={{ gap: 4, padding: '0 2px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{x.title}</span>
                  <span className="row between" style={{ gap: 6 }}><span className={'pill ' + xd.cls} style={{ fontSize: 10, minHeight: 18, padding: '0 6px' }}>{xd.label}</span>{x.comments.filter((m) => !m.us).length > 0 && <span className="row faint" style={{ gap: 4, fontSize: 11 }}><Icon.message size={12} />{x.comments.filter((m) => !m.us).length}</span>}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="row wrap faint" style={{ gap: 14, fontSize: 12 }}>
          {Object.values(DECISION).map((x) => <span key={x.label} className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 4, borderRadius: 2, background: x.color }} />{x.label}</span>)}
        </div>
      </section>
    </div>
  );
}
