import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper from '../components/Stepper.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

export const RECIPE_CARDS = [
  { id: 'ugc', name: 'AI UGC talking head', structure: 'Hook 0–3s · problem · demo · CTA', owner: 'Arland', cost: 2.4, pass: '86%', bg: '#2B211C', overlay: 'POV: wedding in 2 days' },
  { id: 'wot', name: 'Wall of text', structure: 'One bold paragraph over a looping clip', owner: 'Jerome', cost: 0.15, pass: '97%', bg: '#1E1F26', overlay: 'Nobody told me…' },
  { id: 'broll', name: 'Product B-roll', structure: '4 macro shots · captions · music', owner: 'Willem', cost: 1.1, pass: '81%', bg: '#2E1116', overlay: 'Salon red, 5 min' },
  { id: 'static', name: 'Static ad', structure: 'Headline · product · proof · offer', owner: 'Lorenz', cost: 0.05, pass: '99%', bg: '#2A1D1E', overlay: '£12.99' },
  { id: 'native', name: 'Native story', structure: 'Notes-app or text-thread style', owner: 'David', cost: 0.6, pass: '93%', bg: '#1A2030', overlay: 'me: help' },
  { id: 'ba', name: 'Before and after', structure: 'Bare nails · apply · reveal', owner: 'Arland', cost: 1.3, pass: '78%', bg: '#26221C', overlay: 'Before' }
];
const SIZES = [['s916', '9:16'], ['s45', '4:5'], ['s11', '1:1']];

export default function Formats() {
  const [picks, setPicks] = useState({ ugc: 10, wot: 15, broll: 5 });
  const [sizes, setSizes] = useState({ s916: true, s45: true, s11: false });
  const set = (id, qty) => setPicks({ ...picks, [id]: qty });
  const chosen = RECIPE_CARDS.filter((r) => (picks[r.id] || 0) > 0);
  const pieces = chosen.reduce((a, r) => a + picks[r.id], 0);
  const cost = RECIPE_CARDS.reduce((a, r) => a + (picks[r.id] || 0) * r.cost, 0);
  const sizeCount = Math.max(1, Object.values(sizes).filter(Boolean).length);

  return (
    <Layout section="Products" crumbs={['Moyou London', 'Red Alert Gel Nail Strip']} screen="Formats" guide>
      <Stepper current={3} />
      <section className="stack" style={{ gap: 12 }}>
        <span className="eyebrow">Step 04 · Formats</span>
        <h1 className="h1">Pick recipes, not prompts.</h1>
        <p className="lede">Each recipe is a tested format with a fixed structure, shot types and prompt templates, tuned once by the team. Choose how many of each and generate.</p>
        <Link to="/recipes/editor" style={{ fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Or use your own prompt format →</Link>
      </section>

      <Guide
        items={[
          ["What it's for", 'Choosing which kinds of video to make for this product, and how many of each.'],
          ['What you do', 'Press "Add to batch" on the formats you want, then use − and + to set how many. Pick the sizes on the right. Total files and cost update as you go.'],
          ['What happens next', '"Generate" sends the batch to the Director, which writes and makes every video. Nothing is spent until you press it.']
        ]}
        terms={<><span><b>Recipe</b> = a tested video format with a fixed structure.</span><span><b>Pass %</b> = how often its shots pass the automatic quality check. Higher is more reliable.</span><span><b>Sizes</b> = 9:16 for TikTok and Reels, 4:5 for feeds, 1:1 for square.</span></>}
      />

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <div className="grid-auto" style={{ flex: '999 1 560px', minWidth: 0, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 14 }}>
          {RECIPE_CARDS.map((r) => {
            const qty = picks[r.id] || 0, on = qty > 0;
            return (
              <div key={r.id} className="card stack" style={{ padding: 12, gap: 14, ...(on ? { borderColor: 'var(--lime)', boxShadow: '0 0 0 4px rgba(198,244,50,0.1)' } : {}) }}>
                <div style={{ height: 176, borderRadius: 12, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div className="phone" style={{ width: 86, height: 152, borderRadius: 12, background: '#0B0B0E', borderWidth: 2 }}>
                    <span className="head" /><span className="body" />
                    <span className="cap" style={{ fontSize: 9 }}>{r.overlay}</span>
                  </div>
                  <span className="pill green mono" style={{ position: 'absolute', top: 10, left: 10 }} title="How often this recipe's shots pass the automatic quality check">{r.pass} pass</span>
                </div>
                <div className="stack" style={{ gap: 6, padding: '0 4px' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>{r.name}</h3>
                  <span className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>{r.structure}</span>
                  <span className="faint" style={{ fontSize: 12 }}>Tuned by {r.owner} · <span className="mono">${r.cost.toFixed(2)}</span> each</span>
                </div>
                <div className="row between" style={{ gap: 8, padding: '0 4px 4px' }}>
                  <button type="button" className={'btn' + (on ? ' primary' : '')} onClick={() => set(r.id, on ? 0 : 5)}>{on ? 'Added' : 'Add to batch'}</button>
                  {on && (
                    <div className="row" style={{ gap: 6 }}>
                      <button type="button" className="btn" style={{ width: 40, padding: 0 }} aria-label="Fewer" onClick={() => set(r.id, Math.max(0, qty - 5))}>−</button>
                      <span className="mono" style={{ minWidth: 28, textAlign: 'center' }}>{qty}</span>
                      <button type="button" className="btn" style={{ width: 40, padding: 0 }} aria-label="More" onClick={() => set(r.id, qty + 5)}>+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="card stack" style={{ flex: '1 1 300px', minWidth: 0, padding: 22, gap: 20 }}>
          <div className="row between"><h2 className="h2">This batch</h2><span className="pill mono">Batch 4</span></div>
          <div className="stack" style={{ gap: 10 }}>
            {chosen.map((r) => <div key={r.id} className="row between" style={{ fontSize: 14 }}><span>{r.name}</span><span className="mono muted">× {picks[r.id]}</span></div>)}
            {!chosen.length && <span className="faint" style={{ fontSize: 14 }}>Add at least one recipe.</span>}
          </div>
          <div className="stack" style={{ gap: 10, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Cast</span>
            <div className="row" style={{ gap: 10 }}>
              <div className="row">
                {[['Mi', '#E8C4A8', '#0B0B0F'], ['Ta', '#9C6B4E', '#fff'], ['Jo', '#F1D9C6', '#0B0B0F']].map(([n, bg, fg], i) => (
                  <div key={n} style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color: fg, border: '2px solid var(--card)', marginLeft: i ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{n}</div>
                ))}
              </div>
              <span className="muted" style={{ fontSize: 13 }}>3 characters, rotated · <Link to="/characters">change</Link></span>
            </div>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Sizes</span>
            <div className="segs" role="group" aria-label="Sizes">
              {SIZES.map(([id, l]) => <button key={id} type="button" className={'seg' + (sizes[id] ? ' on' : '')} aria-pressed={sizes[id]} onClick={() => setSizes({ ...sizes, [id]: !sizes[id] })}>{l}</button>)}
            </div>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Languages</span>
            <div className="row wrap" style={{ gap: 8 }}><span className="pill lime" style={{ minHeight: 30, padding: '0 12px' }}>English (UK)</span><span className="pill" style={{ minHeight: 30, padding: '0 12px', borderStyle: 'dashed' }}>+ Add language</span></div>
          </div>
          <div className="grid-auto" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="sub stack" style={{ padding: 14, gap: 4 }}><span className="mono" style={{ fontSize: 26, fontWeight: 500 }}>{pieces * sizeCount}</span><span className="faint" style={{ fontSize: 12 }}>finished files</span></div>
            <div className="sub stack" style={{ padding: 14, gap: 4 }}><span className="mono" style={{ fontSize: 26, fontWeight: 500 }}>${cost.toFixed(0)}</span><span className="faint" style={{ fontSize: 12 }}>est. cost</span></div>
          </div>
          <span className="faint" style={{ fontSize: 12, lineHeight: 1.5 }}>{pieces} pieces × {sizeCount} sizes. Cost includes 3 candidates per shot for quality checks.</span>
          <Link className="btn primary" to="/product/director" style={{ minHeight: 50 }}>Generate {pieces} pieces <Icon.arrow /></Link>
        </aside>
      </div>
    </Layout>
  );
}
