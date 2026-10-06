import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { EDITOR_STEPS } from '../components/Stepper.jsx';
import { Icon } from '../components/Icons.jsx';

const PIECES = [
  {
    title: 'Red before the event', recipe: 'AI UGC', character: 'Mia', status: 'Ready', statusCls: 'green', length: '18 s', thumb: '#3B2A22',
    persona: 'Event-week planner', source: 'nails that look done for the wedding',
    script: "Wedding's Saturday and I didn't book a single appointment. So, sofa, fifteen minutes, Red Alert. Look at the edges. That's it, that's the whole routine. Link's below if you've also got a thing this week.",
    shots: [
      ['1', '0–3s', 'Mia to camera, half-ready for an event, holds up bare nails', '"Wedding\'s Saturday and I didn\'t book a single appointment."', 'Avatar lip-sync', '94', 'green', 'Face match ok'],
      ['2', '3–7s', 'Close-up, hands peel a red strip from the sheet on a sofa arm', 'Text: "15 min, no salon"', 'Image to video', 'Fixed', 'amber', 'Extra finger, regenerated'],
      ['3', '7–11s', 'Macro of finished nail edge, slow tilt, window light', '"Look at the edges."', 'Image to video', '91', 'green', 'Product colour ok'],
      ['4', '11–15s', 'Mia in outfit, hand on glass, nails in focus', '"That\'s the whole routine."', 'Avatar lip-sync', '88', 'green', ''],
      ['5', '15–18s', 'Product pack on dresser, end card with price', 'Text: "Red Alert · £12.99"', 'Composed in code', '99', 'green', 'Brand rules ok']
    ]
  },
  {
    title: 'My nails after gels', recipe: 'Wall of text', character: 'No presenter', status: 'Ready', statusCls: 'green', length: '9 s', thumb: '#24252C',
    persona: 'Lapsed salon regular', source: 'wreck my nails getting them off',
    script: 'Nobody warned me that the worst part of salon gels is the removal. Three years of soaking and scraping. Switched to strips I can peel off on the sofa, and my nails finally grew back.',
    shots: [
      ['1', '0–9s', 'Looping clip: hand scrolling phone on a duvet, soft daylight', 'Full paragraph, bold white text, black outline', 'Text to video', '96', 'green', 'Text legible'],
      ['2', '0–9s', 'Caption layer and safe-zone check for TikTok UI', '—', 'Composed in code', '99', 'green', 'No banned words']
    ]
  },
  {
    title: 'Salon red, five minutes', recipe: 'Product B-roll', character: 'Hands only', status: 'Generating 3/4', statusCls: '', length: '12 s', thumb: '#4A0F18',
    persona: 'Event-week planner', source: 'something I can do on the sofa',
    script: 'No voice. Four macro shots on a beat; captions carry the message: salon red, five minutes, peels off clean.',
    shots: [
      ['1', '0–3s', 'Strip sheet slides into frame on blush background', 'Text: "Salon red."', 'Image to video', '90', 'green', ''],
      ['2', '3–6s', 'Thumb presses strip onto nail, macro', 'Text: "Five minutes."', 'Image to video', '87', 'green', ''],
      ['3', '6–9s', 'File snaps off excess along the nail tip', 'Text: "No appointment."', 'Image to video', '85', 'green', ''],
      ['4', '9–12s', 'Five finished nails fan out, slow push in', 'Text: "Red Alert · £12.99"', 'Image to video', 'Running', '', '3 candidates']
    ]
  },
  {
    title: 'Do they lift? Day 7', recipe: 'Before and after', character: 'Tamsin', status: 'Re-planning', statusCls: 'amber', length: '15 s', thumb: '#33281F',
    persona: 'Lapsed salon regular', source: 'strips always lift at the edges',
    script: 'Answering the top objection head on: day one versus day seven, same nails, edges in macro.',
    shots: [
      ['1', '0–3s', 'Tamsin to camera holding phone with the comment on screen', '"You said strips lift by day two. Let\'s see."', 'Avatar lip-sync', '89', 'green', ''],
      ['2', '3–9s', 'Split screen, day 1 vs day 7 macro of the same nail', 'Text: "Day 1 / Day 7"', 'Image to video', 'Fixed', 'amber', 'Nail shape mismatch, re-planned'],
      ['3', '9–15s', 'Tamsin shrugs, taps the edge, smiles', '"Yeah. No."', 'Avatar lip-sync', '86', 'green', '']
    ]
  }
];
const COLS = '40px 64px minmax(0,2fr) minmax(0,1.6fr) 140px 130px';

export default function Director() {
  const [idx, setIdx] = useState(0);
  const [ask, setAsk] = useState('Make shot 2 messier, like a real bathroom counter');
  const [applied, setApplied] = useState(false);
  const sel = PIECES[idx];

  return (
    <Layout section="Generate" crumbs={['Moyou London', 'Red Alert Gel Nail Strip', 'Batch 4']} screen="Director">
      <Stepper steps={EDITOR_STEPS} current={1} />
      <PageHead
        eyebrow="Step 02 · Generate · Shot list"
        title="Script, shots, then footage."
        lede="Every piece becomes a shot list before anything is generated, and every shot is quality-checked. Watch, or step in with plain words."
        right={
          <div className="card stack" style={{ padding: '14px 16px', gap: 10, minWidth: 240 }}>
            <div className="row between" style={{ fontSize: 13 }}><span className="muted">Batch progress</span><span className="mono">19 / 30</span></div>
            <div style={{ height: 6, borderRadius: 6, background: 'var(--line)', overflow: 'hidden' }}><div style={{ width: '63%', height: '100%', background: 'var(--lime)' }} /></div>
            <span className="faint" style={{ fontSize: 12 }}>About 6 min left · $41 spent</span>
          </div>
        }
      />

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section aria-label="Pieces in this batch" className="stack" style={{ flex: '1 1 280px', minWidth: 0, gap: 8 }}>
          {PIECES.map((p, i) => (
            <button key={p.title} type="button" className={'pick row' + (i === idx ? ' on' : '')} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 }} onClick={() => { setIdx(i); setApplied(false); }}>
              <span style={{ flex: 'none', width: 44, height: 64, borderRadius: 8, background: p.thumb, border: '1px solid var(--line-3)' }} />
              <span className="stack" style={{ flex: 1, minWidth: 0, gap: 6 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</span>
                <span className="faint" style={{ fontSize: 12 }}>{p.recipe} · {p.character}</span>
                <span className={'pill mono ' + p.statusCls} style={{ alignSelf: 'flex-start' }}>{p.status}</span>
              </span>
            </button>
          ))}
          <span className="faint" style={{ fontSize: 13, padding: '6px 4px' }}>+ 26 more in this batch</span>
        </section>

        <section className="stack" style={{ flex: '999 1 560px', minWidth: 0, gap: 16 }}>
          <div className="card stack" style={{ padding: 22, gap: 16 }}>
            <div className="row wrap between" style={{ gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{sel.title}</h2>
              <span className="faint mono" style={{ fontSize: 13 }}>{sel.recipe} · {sel.length}</span>
            </div>
            <div className="row wrap" style={{ gap: 8 }}>
              <span className="pill" style={{ minHeight: 30, padding: '0 12px' }}>Persona · {sel.persona}</span>
              <span className="pill lime" style={{ minHeight: 30, padding: '4px 12px', whiteSpace: 'normal', lineHeight: 1.35 }}>Hook from research · "{sel.source}"</span>
            </div>
            <div className="sub stack" style={{ padding: 16, gap: 8 }}>
              <span className="lbl">Script</span>
              <p style={{ fontSize: 16, lineHeight: 1.55 }}>{sel.script}</p>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="row wrap between" style={{ padding: '16px 20px', gap: 10 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>Shot list</h3>
              <span className="faint" style={{ fontSize: 13 }}>Each shot goes to the model that does it best</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ minWidth: 800 }}>
                <div className="th" style={{ gridTemplateColumns: COLS, background: 'var(--sub)', borderTop: '1px solid var(--line)' }}>
                  <span>#</span><span>Time</span><span>What we see</span><span>Line or text</span><span>Model</span><span>Quality</span>
                </div>
                {sel.shots.map(([n, t, see, line, model, qa, qaCls, note]) => (
                  <div key={n + t} className="list-row" style={{ gridTemplateColumns: COLS, alignItems: 'start', lineHeight: 1.45, cursor: 'default' }}>
                    <span className="mono faint">{n}</span>
                    <span className="mono faint">{t}</span>
                    <span>{see}</span>
                    <span className="muted">{line}</span>
                    <span><span className="pill blue" title="The AI tool that makes this clip. Each type of shot goes to the tool that's best at it.">{model}</span></span>
                    <span className="stack" style={{ gap: 4, alignItems: 'flex-start' }}><span className={'pill mono ' + qaCls}>{qa}</span><span className="faint" style={{ fontSize: 12 }}>{note}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card stack" style={{ padding: '18px 20px', gap: 12 }}>
            <label htmlFor="change" style={{ fontSize: 14, fontWeight: 600 }}>Ask for a change</label>
            <div className="row wrap" style={{ gap: 10 }}>
              <div className="field" style={{ flex: '1 1 320px', minHeight: 50 }}>
                <Icon.sparkle style={{ color: 'var(--lime)' }} />
                <input id="change" type="text" value={ask} onChange={(e) => setAsk(e.target.value)} />
              </div>
              <button type="button" className="btn primary" style={{ minHeight: 50 }} onClick={() => setApplied(true)}>Re-plan shots</button>
            </div>
            {applied && <div className="notice">Shot 2 re-planned: messy bathroom counter, handheld, phone-camera look. 3 new candidates queued. The rest of the ad is unchanged.</div>}
          </div>

          <div className="row wrap between" style={{ gap: 12 }}>
            <Link className="btn" to="/generate">Back to generate</Link>
            <Link className="btn primary" to="/product/review">Review 19 ready pieces <Icon.arrow /></Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
