import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { EDITOR_STEPS } from '../components/Stepper.jsx';
import { Icon } from '../components/Icons.jsx';
import ClientFeedback from './ClientFeedback.jsx';
import { ROUNDS } from '../data/reviews.js';
import { useCurrentUser, person } from '../data/team.jsx';
import { useWork, finishReview, reviewSubject } from '../data/work.js';

const SAMPLE_QUEUE = [
  { title: 'Red before the event', caption: "Wedding's Saturday. Zero appointments.", recipe: 'AI UGC', character: 'Mia', angle: 'Occasion', qa: '94', length: '18 s', tint: '#3B2A22' },
  { title: 'My nails after gels', caption: 'Nobody warned me about the removal…', recipe: 'Wall of text', character: 'None', angle: 'Removal pain', qa: '96', length: '9 s', tint: '#24252C' },
  { title: 'Salon red, five minutes', caption: 'Salon red. Five minutes.', recipe: 'Product B-roll', character: 'Hands only', angle: 'Speed', qa: '88', length: '12 s', tint: '#4A0F18' },
  { title: 'Do they lift? Day 7', caption: 'You said they lift by day two.', recipe: 'Before and after', character: 'Tamsin', angle: 'Objection', qa: '86', length: '15 s', tint: '#33281F' },
  { title: '£40 every two weeks', caption: 'I did the maths on my salon habit', recipe: 'AI UGC', character: 'Jo', angle: 'Cost', qa: '91', length: '20 s', tint: '#3A2E2B' },
  { title: 'Group chat: help', caption: 'me: party in 3 hrs, nails are tragic', recipe: 'Native story', character: 'None', angle: 'Occasion', qa: '93', length: '11 s', tint: '#1E2638' }
];
const REASONS = ['Wrong product', 'Uncanny face or hands', 'Weak hook', 'Off-brand', 'Caption problem', 'Other'];

// Two views: the researcher's keep/skip check of an editor's submitted ads (?submission=rv1), and
// "Client feedback" (?round=r2) to go through what a client said, video by video.
export default function Review() {
  const [params, setParams] = useSearchParams();
  const user = useCurrentUser();
  const { reviews, tasks } = useWork();
  const roundId = params.get('round');
  const tab = roundId ? 'client' : 'ours';
  const round = ROUNDS.find((r) => r.id === roundId);
  // Which submission is being reviewed: the one in the URL, else the oldest one still waiting.
  const waiting = reviews.filter((r) => r.status === 'waiting');
  const [initialId] = useState(() => (user.role === 'researcher' && waiting.length ? waiting[waiting.length - 1].id : null));
  const subm = reviews.find((r) => r.id === (params.get('submission') || initialId)) || null;
  const subject = subm && reviewSubject(subm, tasks);
  const fromEditor = subm && person(subm.editor);
  const QUEUE = subm
    ? subm.ads.map((a, n) => ({ title: `Ad ${n + 1} · ${a.label}`, caption: a.text, recipe: a.format, character: '-', angle: subject.client, qa: String(86 + ((n * 5) % 12)), length: `${a.secs} s`, tint: a.bg }))
    : SAMPLE_QUEUE;
  const alreadyDone = subm && subm.status === 'done';
  const [i, setI] = useState(0);
  const [kept, setKept] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [log, setLog] = useState({});
  const [rejecting, setRejecting] = useState(false);
  const done = i >= QUEUE.length;
  const cur = QUEUE[Math.min(i, QUEUE.length - 1)];

  // In the real build, save each decision (and skip reason) against the clip so the learning loop can use it.
  // The last decision finishes the review and sends the result back to the editor.
  const advance = (k, s, lg) => { if (i + 1 >= QUEUE.length && subm && !alreadyDone) finishReview(subm.id, { kept: k, skipped: s, reasons: lg }); setI(i + 1); setRejecting(false); };
  const keep = () => { setKept(kept + 1); advance(kept + 1, skipped, log); };
  const skip = (reason) => { const lg = { ...log, [reason]: (log[reason] || 0) + 1 }; setSkipped(skipped + 1); setLog(lg); advance(kept, skipped + 1, lg); };
  const reset = () => { setI(0); setKept(0); setSkipped(0); setLog({}); setRejecting(false); };

  return (
    <Layout section={tab === 'client' ? 'Client reviews' : user.role === 'researcher' ? 'Editors' : 'My tasks'} crumbs={tab === 'client' && round ? [round.client, round.product, round.round] : subject ? ['Editors', 'Review', subject.title] : ['Moyou London', 'Red Alert Gel Nail Strip', 'Batch 4']} brand={tab === 'client' && round ? { name: round.client, color: round.dot } : undefined} screen={tab === 'client' ? 'Client feedback' : 'Review'}>
      {user.role === 'editor' && <Stepper steps={EDITOR_STEPS} current={2} />}
      <PageHead
        eyebrow={tab === 'client' ? 'Step 03 · Review · Client feedback' : 'Step 03 · Review'}
        title={tab === 'client' ? 'What the client said.' : subm ? `Review ${fromEditor.name}'s ads.` : 'Keep or skip. Say why.'}
        lede={tab === 'client' ? 'Every video you sent in this round, one by one, with the client\'s decision and their comments at the exact moment they made them.' : subm ? `${subject.title} · ${subm.ads.length} stitched ads sent ${subm.sent}. Keep or skip each one; kept ads go back to ${fromEditor.name} to send to the client.` : 'Only pieces that passed the quality checks get here. Every skip reason teaches the next batch.'}
        right={
          <div className="segs" role="tablist" aria-label="Review view" style={{ minWidth: 'min(340px, 100%)' }}>
            <button type="button" role="tab" aria-selected={tab === 'ours'} className={'seg' + (tab === 'ours' ? ' on' : '')} onClick={() => setParams({}, { replace: true })}>Our check</button>
            <button type="button" role="tab" aria-selected={tab === 'client'} className={'seg' + (tab === 'client' ? ' on' : '')} onClick={() => setParams({ round: roundId || 'r2' }, { replace: true })}>Client feedback</button>
          </div>
        }
      />

      {tab === 'client' ? <ClientFeedback key={roundId} roundId={roundId} onRound={(id) => setParams({ round: id }, { replace: true })} /> : (

      <div className="row wrap" style={{ gap: 24, alignItems: 'flex-start' }}>
        <section style={{ flex: '999 1 520px', minWidth: 0 }}>
          {!done && (
            <div className="card row wrap" style={{ padding: 20, gap: 28, alignItems: 'stretch' }}>
              <div className="phone stack" style={{ width: 300, height: 533, borderRadius: 22, background: cur.tint, padding: 16, justifyContent: 'space-between', flex: 'none', margin: '0 auto' }}>
                <div className="row" style={{ gap: 4 }}>
                  <div style={{ flex: 1, height: 3, borderRadius: 2, background: '#fff' }} />
                  <div style={{ flex: 3, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
                  <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.25)' }} />
                </div>
                <span className="head" style={{ top: '30%' }} /><span className="body" />
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.play /></div>
                </div>
                <div className="stack" style={{ position: 'relative', gap: 10, alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: 19, fontWeight: 700, color: '#0B0B0F', lineHeight: 1.25, padding: '6px 10px', background: '#fff', borderRadius: 8 }}>{cur.caption}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{cur.length} · 9:16</span>
                </div>
              </div>

              <div className="stack" style={{ flex: '1 1 260px', gap: 18 }}>
                <div className="row between"><span className="mono faint" style={{ fontSize: 12 }}>{i + 1} of {QUEUE.length} in queue</span><span className="pill green mono">QA {cur.qa}</span></div>
                <h2 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em' }}>{cur.title}</h2>
                <div className="sub stack">
                  {[['Recipe', cur.recipe], ['Presenter', cur.character], ['Hook angle', cur.angle]].map(([k, v], n) => (
                    <div key={k} className="row between" style={{ gap: 10, padding: '12px 14px', fontSize: 14, borderTop: n ? '1px solid var(--line)' : 0 }}><span className="faint">{k}</span><span>{v}</span></div>
                  ))}
                </div>
                <div className="stack" style={{ marginTop: 'auto', gap: 12 }}>
                  {!rejecting ? (
                    <div className="row" style={{ gap: 10 }}>
                      <button type="button" className="btn" style={{ flex: 1, minHeight: 56, borderRadius: 16, fontSize: 15, fontWeight: 600 }} onClick={() => setRejecting(true)}><Icon.x size={18} />Skip</button>
                      <button type="button" className="btn primary" style={{ flex: 1, minHeight: 56, borderRadius: 16, fontSize: 15 }} onClick={keep}><Icon.check size={18} />Keep</button>
                    </div>
                  ) : (
                    <div className="sub stack" style={{ padding: 14, gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>What's wrong with it?</span>
                      <div className="row wrap" style={{ gap: 8 }}>{REASONS.map((r) => <button key={r} type="button" className="chip" style={{ minHeight: 44 }} onClick={() => skip(r)}>{r}</button>)}</div>
                      <button type="button" className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => setRejecting(false)}>Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {done && (
            <div className="card stack" style={{ padding: 32, gap: 16, alignItems: 'flex-start', maxWidth: 620 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--lime)', color: '#0B0B0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.check size={22} sw={2.8} /></div>
              <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{subm ? 'Review sent back' : 'Queue cleared'}</h2>
              <p className="muted" style={{ fontSize: 15, lineHeight: 1.55 }}>{kept} kept, {skipped} skipped. {subm ? (kept ? `${fromEditor.name} can now send the kept ads to ${subject.client || 'the client'}.` : `Nothing kept, so it's back with ${fromEditor.name} to remake.`) : 'Kept pieces are resized and captioned in every size you picked.'}</p>
              <div className="row wrap" style={{ gap: 10 }}>
                {subm ? <Link className="btn primary" to="/editors">Back to Editors</Link> : <Link className="btn primary" to="/product/deliver">Go to delivery</Link>}
                {waiting.filter((r) => r.id !== subm?.id).length > 0 && <Link className="btn" to={`/product/review?submission=${waiting.filter((r) => r.id !== subm.id)[0].id}`} onClick={reset}>Next review</Link>}
              </div>
            </div>
          )}
        </section>

        <aside className="stack" style={{ flex: '1 1 260px', minWidth: 0, gap: 14 }}>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[[kept, 'kept', 'var(--lime)'], [skipped, 'skipped', '#FCA5A5'], [Math.max(0, QUEUE.length - i), 'left', 'var(--text)']].map(([v, l, c]) => (
              <div key={l} className="card stack" style={{ padding: 14, gap: 4 }}><span className="mono" style={{ fontSize: 26, color: c }}>{v}</span><span className="faint" style={{ fontSize: 12 }}>{l}</span></div>
            ))}
          </div>
          <div className="card stack" style={{ padding: 18, gap: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>What skips are teaching</h3>
            {!Object.keys(log).length && <span className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>Skip something and the reason shows up here. Repeated reasons raise the quality bar for that shot type.</span>}
            {Object.entries(log).map(([k, v]) => <div key={k} className="row between" style={{ fontSize: 14 }}><span>{k}</span><span className="mono" style={{ color: '#FCA5A5' }}>× {v}</span></div>)}
          </div>
        </aside>
      </div>
      )}
    </Layout>
  );
}
