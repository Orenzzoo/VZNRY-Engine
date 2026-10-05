import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper from '../components/Stepper.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

const QUEUE = [
  { title: 'Red before the event', caption: "Wedding's Saturday. Zero appointments.", recipe: 'AI UGC', character: 'Mia', angle: 'Occasion', qa: '94', length: '18 s', tint: '#3B2A22' },
  { title: 'My nails after gels', caption: 'Nobody warned me about the removal…', recipe: 'Wall of text', character: 'None', angle: 'Removal pain', qa: '96', length: '9 s', tint: '#24252C' },
  { title: 'Salon red, five minutes', caption: 'Salon red. Five minutes.', recipe: 'Product B-roll', character: 'Hands only', angle: 'Speed', qa: '88', length: '12 s', tint: '#4A0F18' },
  { title: 'Do they lift? Day 7', caption: 'You said they lift by day two.', recipe: 'Before and after', character: 'Tamsin', angle: 'Objection', qa: '86', length: '15 s', tint: '#33281F' },
  { title: '£40 every two weeks', caption: 'I did the maths on my salon habit', recipe: 'AI UGC', character: 'Jo', angle: 'Cost', qa: '91', length: '20 s', tint: '#3A2E2B' },
  { title: 'Group chat: help', caption: 'me: party in 3 hrs, nails are tragic', recipe: 'Native story', character: 'None', angle: 'Occasion', qa: '93', length: '11 s', tint: '#1E2638' }
];
const REASONS = ['Wrong product', 'Uncanny face or hands', 'Weak hook', 'Off-brand', 'Caption problem', 'Other'];

export default function Review() {
  const [i, setI] = useState(0);
  const [kept, setKept] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [log, setLog] = useState({});
  const [rejecting, setRejecting] = useState(false);
  const done = i >= QUEUE.length;
  const cur = QUEUE[Math.min(i, QUEUE.length - 1)];

  // In the real build, save each decision (and skip reason) against the clip so the learning loop can use it.
  const keep = () => { setKept(kept + 1); setI(i + 1); setRejecting(false); };
  const skip = (reason) => { setSkipped(skipped + 1); setLog({ ...log, [reason]: (log[reason] || 0) + 1 }); setI(i + 1); setRejecting(false); };
  const reset = () => { setI(0); setKept(0); setSkipped(0); setLog({}); setRejecting(false); };

  return (
    <Layout section="Products" crumbs={['Moyou London', 'Red Alert Gel Nail Strip', 'Batch 4']} screen="Review" guide>
      <Stepper current={5} />
      <PageHead eyebrow="Step 06 · Review" title="Keep or skip. Say why." lede="Only pieces that passed the quality checks get here. Every skip reason teaches the next batch." />

      <Guide items={[
        ["What it's for", "Our team's own check, before anything goes to a client or gets posted."],
        ['What you do', 'Watch each video, then press Keep or Skip. When you skip, pick the reason. It takes one click.'],
        ['What happens next', 'Kept videos are resized and captioned, then wait in Deliver. Skip reasons make the next batch better.']
      ]} />

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
              <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Queue cleared</h2>
              <p className="muted" style={{ fontSize: 15, lineHeight: 1.55 }}>{kept} kept, {skipped} skipped. Kept pieces are resized and captioned in every size you picked.</p>
              <div className="row wrap" style={{ gap: 10 }}>
                <Link className="btn primary" to="/product/deliver">Go to delivery</Link>
                <button type="button" className="btn" onClick={reset}>Start over</button>
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
    </Layout>
  );
}
