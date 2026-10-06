import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';

const DEFAULT = [
  'Vertical 9:16 phone video, UGC style, {length}.',
  '{character} in {setting}, natural light, slight handheld shake.',
  'Opening line, said to camera: "{hook}"',
  'Show {product}: {product_details}.',
  '! Match the product reference image exactly. Never change the colour.',
  'Tone: {brand_voice}.',
  "! Avoid: studio lighting, extra fingers, other brands' logos."
].join('\n');

const VARS = [
  ['product', 'Product name'], ['product_details', 'Key visual details from the brand kit'], ['character', 'Cast character for this ad'],
  ['setting', 'Where the scene takes place'], ['hook', 'Opening line, written from buyer research'], ['brand_voice', 'Tone words from the brand kit'],
  ['length', 'Target length'], ['offer', 'Current offer, if any']
];

// Per-product values and the tweaks the engine would suggest. In the real build these come from the brand kit, research and an LLM pass.
const PRODUCTS = {
  red: { label: 'Red Alert', name: 'Red Alert Gel Nail Strip',
    values: { product: 'Red Alert Gel Nail Strip', product_details: 'glossy classic red gel strips, peel-off, salon finish', character: 'Mia, 24', setting: 'a sofa at home', hook: 'My gels look amazing for a week, then I wreck my nails getting them off.', brand_voice: 'playful, confident, salon-savvy, British', length: '18 seconds', offer: '[no current offer]' },
    tweaks: [
      ['hook', 'Hook → "Wedding\'s Saturday and I didn\'t book a single appointment."', 'Pinned research phrase for the event-week persona.'],
      ['setting', 'Setting → getting ready at a vanity, warm evening light.', 'Red reads best against warm light; matches the occasion angle.'],
      ['product', 'Add → one macro shot of the nail edge.', '"Strips lift at the edges" is the top objection in research.'],
      ['camera', 'Camera → first 2 seconds on the hands, not the face.', 'Hand-first openings held longer for this product.']
    ] },
  hot: { label: 'Too Hot To Handle', name: 'Too Hot To Handle',
    values: { product: 'Too Hot To Handle gel strips', product_details: 'orange-red base with flame tips', character: 'Tasha, 34', setting: 'a sunny balcony', hook: "I can't justify £40 every two weeks at the salon any more.", brand_voice: 'playful, confident, salon-savvy, British', length: '15 seconds', offer: '[no current offer]' },
    tweaks: [
      ['product', 'Add → hold the flame tips to camera in macro for 1.5 s.', 'The flame design is what makes this shade different.'],
      ['setting', 'Setting → rooftop at golden hour.', 'Summer shade; bright light keeps the orange true.'],
      ['camera', 'Camera → faster cuts, about 1.5 s per shot.', 'Bolder shade suits a higher-energy edit.']
    ] },
  peri: { label: 'Periwinkle', name: 'Periwinkle',
    values: { product: 'Periwinkle gel strips', product_details: 'soft lavender-blue, cream finish', character: 'Mia, 24', setting: 'a kitchen counter with morning coffee', hook: 'Something I can do on the sofa in fifteen minutes.', brand_voice: 'playful, confident, salon-savvy, British', length: '18 seconds', offer: '[no current offer]' },
    tweaks: [
      ['product', 'Add → plain neutral background behind the hands.', 'Pastel shades tend to shift colour in generated video.'],
      ['hook', 'Hook → "This is the calmest colour I own and I\'m obsessed."', 'Soft shade suits a calmer hook than the pain-point ones.']
    ] },
  pillow: { label: 'Pillow', name: 'Memory-foam pillow',
    values: { product: 'the memory-foam pillow', product_details: 'soft white pillow with a removable cover', character: 'Pillow (clay)', setting: 'a bedroom at night', hook: 'Clock says 3:12. Someone is NOT sleeping.', brand_voice: 'gentle, cosy, a little funny', length: '15 seconds', offer: '[Offer]' },
    tweaks: [
      ['product', 'Switch → use the clay character sheet as the reference, not a photo.', 'This product is cast as an animated character.'],
      ['camera', 'Camera → slow push-ins, remove handheld shake.', 'Handheld shake looks wrong in animation.'],
      ['setting', 'Setting → night scene, then a morning scene for the payoff.', 'The story needs a before and after.']
    ] }
};
const ALLOWED = [['hook', 'Hook wording'], ['setting', 'Setting'], ['product', 'Product shots'], ['camera', 'Camera and pacing']];
const KNOWN = new Set(VARS.map(([k]) => k));

export default function PromptEditor() {
  const [name, setName] = useState('My UGC format');
  const [template, setTemplate] = useState(DEFAULT);
  const [mode, setMode] = useState('tweak');
  const [allowed, setAllowed] = useState({ hook: true, setting: true, product: true, camera: false });
  const [pid, setPid] = useState('red');
  const [notes, setNotes] = useState({});
  const [tested, setTested] = useState(false);
  const prod = PRODUCTS[pid];
  const used = new Set(), unknown = new Set();

  const lines = template.split('\n').filter((l) => l.trim()).map((raw) => {
    const locked = raw.trim().startsWith('!');
    const text = locked ? raw.trim().slice(1).trim() : raw;
    const segs = text.split(/(\{[a-z_]+\})/g).filter(Boolean).map((p) => {
      const m = p.match(/^\{([a-z_]+)\}$/);
      if (!m) return { text: p, cls: '' };
      if (KNOWN.has(m[1])) { used.add(m[1]); return { text: prod.values[m[1]], cls: 'var' }; }
      unknown.add(m[1]); return { text: p, cls: 'bad' };
    });
    return { locked, segs };
  });

  const note = notes[pid] || '';
  const tweaks = mode === 'tweak' ? prod.tweaks.filter(([t]) => allowed[t]) : [];
  if (note.trim()) tweaks.push(['note', 'Product note → ' + note.trim(), 'Your note for this product.']);

  return (
    <Layout section="Recipes" crumbs={['Recipes', name]}>
      <PageHead eyebrow="Recipes · Prompt editor" title="Bring your own prompt format." lede="Write the prompt the way you like it, with blanks the engine fills for each product. Then choose: run it exactly as written, or let the engine tweak it per product and show you every change." />

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card stack" style={{ flex: '999 1 520px', minWidth: 0, padding: 22, gap: 20 }}>
          <div className="stack" style={{ gap: 8 }}><label htmlFor="r-name" style={{ fontSize: 13, fontWeight: 600 }}>Recipe name</label><input id="r-name" className="in" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="stack" style={{ gap: 8 }}>
            <div className="row between" style={{ alignItems: 'baseline' }}><label htmlFor="r-prompt" style={{ fontSize: 13, fontWeight: 600 }}>Your prompt</label><span className="faint" style={{ fontSize: 12 }}>Start a line with ! to lock it</span></div>
            <textarea id="r-prompt" className="in mono" spellCheck={false} value={template} onChange={(e) => setTemplate(e.target.value)} style={{ minHeight: 240, fontSize: 13, lineHeight: 1.7 }} />
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Blanks you can use <span className="faint" style={{ fontWeight: 400 }}>· click to add</span></span>
            <div className="row wrap" style={{ gap: 6 }}>
              {VARS.map(([k, about]) => (
                <button key={k} type="button" title={about} className="mono" onClick={() => setTemplate(template.replace(/\s*$/, '') + ` {${k}}`)}
                  style={{ minHeight: 36, padding: '0 10px', borderRadius: 8, border: '1px solid ' + (used.has(k) ? 'rgba(198,244,50,0.35)' : 'var(--line-3)'), background: '#16161B', color: used.has(k) ? 'var(--lime-hover)' : '#93C5FD', fontSize: 12, cursor: 'pointer' }}>{`{${k}}`}</button>
              ))}
            </div>
            {unknown.size > 0 && <span style={{ fontSize: 12, color: '#FCA5A5' }}>Unknown blank: {[...unknown].map((k) => `{${k}}`).join(', ')}. It will stay empty unless you rename it.</span>}
          </div>
          <div className="stack" style={{ gap: 10, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>How should the engine use it?</span>
            <div className="segs" role="group" aria-label="Tweak mode">{[['exact', 'Use exactly as written'], ['tweak', 'Tweak per product']].map(([k, l]) => <button key={k} type="button" className={'seg' + (mode === k ? ' on' : '')} onClick={() => setMode(k)}>{l}</button>)}</div>
            <span className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{mode === 'tweak' ? 'The engine keeps your structure and locked lines, and adjusts only what you allow, using the brand kit and buyer research. Every change is shown with the reason.' : 'Blanks are filled in and nothing else changes. Best when a format is already proven and you want identical structure every time.'}</span>
            {mode === 'tweak' && (
              <div className="stack" style={{ gap: 8 }}>
                <span className="faint" style={{ fontSize: 12 }}>Allowed to change</span>
                <div className="row wrap" style={{ gap: 8 }}>
                  {ALLOWED.map(([k, l]) => (
                    <button key={k} type="button" className={'mini' + (allowed[k] ? ' on' : '')} style={{ minHeight: 44, padding: '0 12px', fontSize: 13 }} aria-pressed={allowed[k]} onClick={() => setAllowed({ ...allowed, [k]: !allowed[k] })}>
                      <span className="row" style={{ gap: 10 }}><span className={'box' + (allowed[k] ? ' on' : '')} style={{ width: 16, height: 16, borderRadius: 5 }} />{l}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="stack" style={{ flex: '1 1 400px', minWidth: 0, gap: 14 }}>
          <div className="card stack" style={{ padding: 20, gap: 14 }}>
            <div className="row wrap between" style={{ gap: 10 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600 }}>Preview for a product</h2>
              <span className={'pill' + (mode === 'tweak' ? ' lime' : '')}>{mode === 'tweak' ? `${tweaks.length} ${tweaks.length === 1 ? 'tweak' : 'tweaks'} for this product` : 'Exactly as written'}</span>
            </div>
            <div className="segs" role="group" aria-label="Preview product">{Object.entries(PRODUCTS).map(([k, p]) => <button key={k} type="button" className={'seg' + (pid === k ? ' on' : '')} onClick={() => setPid(k)}>{p.label}</button>)}</div>
            <div className="sub stack mono" style={{ padding: 16, gap: 6, fontSize: 12.5, lineHeight: 1.7 }}>
              {lines.map((l, i) => (
                <div key={i} className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
                  {l.locked && <span title="Locked line" className="faint" style={{ flex: 'none', marginTop: 3 }}><Icon.lock size={12} /></span>}
                  <span>{l.segs.map((s, j) => <span key={j} style={s.cls === 'var' ? { color: '#93C5FD', background: 'rgba(96,165,250,0.1)', borderRadius: 4, padding: '1px 3px' } : s.cls === 'bad' ? { color: '#FCA5A5', background: 'rgba(248,113,113,0.12)', borderRadius: 4, padding: '1px 3px' } : { color: '#C4C4CC' }}>{s.text}</span>)}</span>
                </div>
              ))}
              {tweaks.map(([, text, why]) => (
                <div key={text} className="stack" style={{ gap: 2, marginTop: 6, padding: '8px 10px', borderRadius: 8, background: 'rgba(198,244,50,0.07)', borderLeft: '2px solid var(--lime)' }}>
                  <span style={{ color: 'var(--lime-hover)' }}>{text}</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--faint)' }}>Why: {why}</span>
                </div>
              ))}
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <label htmlFor="r-note" style={{ fontSize: 13, fontWeight: 600 }}>Note for this product only</label>
              <input id="r-note" className="in" value={note} onChange={(e) => setNotes({ ...notes, [pid]: e.target.value })} placeholder="e.g. Always show the flame tips up close" />
              {note.trim() && <span className="faint" style={{ fontSize: 12 }}>Added to the prompt for {prod.name} only. Other products are unaffected.</span>}
            </div>
          </div>
          {tested && <div className="notice">3 test runs queued on Red Alert, Too Hot To Handle and the pillow. Results land in the Review queue in about 4 minutes.</div>}
          <div className="row wrap" style={{ gap: 8 }}>
            <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setTested(true)}>Test on 3 products</button>
            <Link className="btn primary" to="/recipes" style={{ flex: 1 }}>Save as recipe</Link>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
