import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper from '../components/Stepper.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

// Images scraped from the product page. `rec` = engine's recommendation to use it.
const SCRAPED = [
  { id: 'i1', label: 'Packshot, front', kind: 'pack', bg: '#F4F1EC', res: '1600×1600', rec: true, tip: 'Recommended · clean, shows true colour', tipCls: 'green' },
  { id: 'i2', label: 'Hand on striped top', kind: 'hand', bg: '#2B2B2E', res: '1200×1200', rec: true, tip: 'Recommended · shows the finished look', tipCls: 'green' },
  { id: 'i3', label: 'Model wearing the shade', kind: 'person', bg: '#D9CFC4', res: '1080×1350', rec: true, tip: 'Has a real person · swap or exclude', tipCls: 'amber', person: true },
  { id: 'i4', label: 'Nail close-up', kind: 'hand', bg: '#F2D7D5', res: '1400×1400', rec: true, tip: 'Recommended · good edge detail', tipCls: 'green' },
  { id: 'i5', label: 'Packshot, angled', kind: 'pack', bg: '#EDE6E3', res: '1600×1600', rec: true, tip: 'Recommended', tipCls: 'green' },
  { id: 'i6', label: 'Hand on sofa', kind: 'hand', bg: '#3A2E2B', res: '533×533', rec: false, tip: 'Small source · may look blurry', tipCls: 'amber' },
  { id: 'i7', label: 'How to apply guide', kind: 'text', bg: '#F7F7F2', res: '1200×1800', rec: false, tip: 'Mostly text · not useful as a reference', tipCls: '' },
  { id: 'i8', label: 'Size and shape chart', kind: 'text', bg: '#FFFFFF', res: '1000×1000', rec: false, tip: 'Mostly text · not useful as a reference', tipCls: '' },
  { id: 'i9', label: 'Packshot, duplicate', kind: 'pack', bg: '#F4F1EC', res: '800×800', rec: false, tip: 'Duplicate of “Packshot, front”', tipCls: '' },
  { id: 'i10', label: 'Review photo from customer', kind: 'person', bg: '#B9A99A', res: '960×1280', rec: false, tip: 'Customer photo · needs permission to use', tipCls: 'amber', person: true }
];

const RED = '#C8102E';

function ImageArt({ kind, src, label }) {
  if (kind === 'upload') return <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  if (kind === 'pack') return (
    <div style={{ position: 'absolute', left: '27%', top: '17%', width: '46%', height: '66%', borderRadius: 8, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.25)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6%', padding: '12% 10%' }}>
      {Array.from({ length: 6 }).map((_, i) => <span key={i} style={{ borderRadius: '6px 6px 3px 3px', background: RED }} />)}
    </div>
  );
  if (kind === 'hand') return (
    <div style={{ position: 'absolute', left: '22%', bottom: 0, width: '56%', height: '70%', display: 'flex', alignItems: 'flex-start', gap: '6%' }}>
      {[[70, 14], [86, 0], [80, 4], [62, 20]].map(([h, mt], i) => (
        <span key={i} style={{ flex: 1, height: h + '%', marginTop: mt + '%', borderRadius: '40px 40px 0 0', background: '#E2B796', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '18%', right: '18%', top: '4%', height: '17%', borderRadius: 10, background: RED }} />
        </span>
      ))}
    </div>
  );
  if (kind === 'person') return (
    <>
      <span style={{ position: 'absolute', left: '35%', top: '18%', width: '30%', height: '30%', borderRadius: '50%', background: '#C9946E' }} />
      <span style={{ position: 'absolute', left: '18%', top: '52%', width: '64%', height: '60%', borderRadius: '48% 48% 8px 8px', backgroundImage: 'repeating-linear-gradient(0deg, #1F1F1F 0 6px, #EDEDED 6px 14px)' }} />
      <span style={{ position: 'absolute', left: '30%', top: '62%', width: '12%', height: '9%', borderRadius: 6, background: RED }} />
    </>
  );
  return (
    <div className="stack" style={{ position: 'absolute', inset: '16%', gap: '9%', justifyContent: 'center' }}>
      <span style={{ height: '10%', width: '80%', borderRadius: 3, background: '#111' }} />
      {[100, 92, 70].map((w) => <span key={w} style={{ height: '6%', width: w + '%', borderRadius: 3, background: '#9A9A9A' }} />)}
    </div>
  );
}

export default function BrandKit() {
  const [locked, setLocked] = useState(false);
  const [inc, setInc] = useState({});
  const [hero, setHero] = useState('i1');
  const [swap, setSwap] = useState({ i3: true });
  const [filter, setFilter] = useState('all');
  const [uploads, setUploads] = useState([]);

  const all = SCRAPED.concat(uploads.map((src, i) => ({ id: 'u' + i, label: 'Uploaded photo ' + (i + 1), kind: 'upload', src, bg: '#1A1A20', res: 'Your file', rec: true, tip: 'Uploaded by you', tipCls: 'lime' })));
  const isIn = (m) => (inc[m.id] !== undefined ? inc[m.id] : m.rec);
  const shown = all.filter((m) => filter === 'in' ? isIn(m) : filter === 'out' ? !isIn(m) : filter === 'up' ? m.kind === 'upload' : true);

  const toggle = (m) => {
    const on = isIn(m);
    const next = { ...inc, [m.id]: !on };
    setInc(next);
    if (on && m.id === hero) {
      const other = all.find((x) => x.id !== m.id && x.kind !== 'text' && (next[x.id] !== undefined ? next[x.id] : x.rec));
      if (other) setHero(other.id);
    }
  };

  // Previews stay in the browser. In the real build, upload these to storage and save their URLs on the product.
  const onUpload = (e) => {
    const urls = Array.from(e.target.files || []).slice(0, 8).map((f) => URL.createObjectURL(f));
    if (urls.length) { setUploads(uploads.concat(urls)); setFilter('all'); }
  };

  return (
    <Layout section="Products" crumbs={['Moyou London', 'Red Alert Gel Nail Strip']} screen="Brand kit" guide>
      <Stepper current={1} />
      <PageHead
        eyebrow="Step 02 · Brand kit"
        title="One page every ad reads from."
        lede="Pulled from the link. Fix anything wrong once, lock it, and every script, shot and caption follows it."
        right={<button type="button" className={'btn' + (locked ? '' : ' primary')} onClick={() => setLocked(!locked)}><Icon.lock />{locked ? 'Unlock to edit' : 'Lock brand kit'}</button>}
      />

      <Guide
        items={[
          ["What it's for", 'Everything the ads must get right about this product: what it looks like, how the brand talks, and what we’re not allowed to say.'],
          ['What you do', '1. Tick the product images to use and pick a hero. 2. Glance over the facts and voice; fix anything wrong. 3. Press Lock brand kit.'],
          ['What happens next', 'Every script, shot and caption reads from this page. If you change it later, only new ads follow the change.']
        ]}
        terms={<><span><b>Hero image</b> = the main photo the video models copy, so the product looks right.</span><span><b>Guardrails</b> = words and claims that get blocked automatically.</span></>}
      />

      {locked && (
        <div className="row wrap between" style={{ gap: 12, padding: '14px 18px', borderRadius: 14, background: 'rgba(198,244,50,0.08)', border: '1px solid rgba(198,244,50,0.3)' }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--lime-hover)' }}>Brand kit locked. Research and generation will use this version.</span>
          <Link to="/product/research" style={{ fontSize: 14, fontWeight: 600 }}>See buyer research</Link>
        </div>
      )}

      <section className="card stack" style={{ padding: 22, gap: 18 }}>
        <div className="row wrap between" style={{ alignItems: 'flex-end', gap: 14 }}>
          <div className="stack" style={{ gap: 6, maxWidth: 640 }}>
            <div className="row wrap" style={{ gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>Product images for generation</h2>
              <span className="pill lime mono">{all.filter(isIn).length} of {all.length} used</span>
            </div>
            <span className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>Pulled from <span className="mono" style={{ color: 'var(--text)', wordBreak: 'break-all' }}>moyou.co.uk/products/gel-nail-strip-red-alert</span>. Ticked images are sent to every shot as product references. The hero image is the main one the models copy.</span>
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            <button type="button" className="btn" onClick={() => { setInc({}); setHero('i1'); setFilter('all'); }}>Use recommended</button>
            <label className="btn primary" htmlFor="bk-upload"><Icon.upload />Upload photos</label>
            <input id="bk-upload" className="sr-only" type="file" accept="image/*" multiple onChange={onUpload} />
          </div>
        </div>

        <div className="row wrap" role="group" aria-label="Filter images" style={{ gap: 8 }}>
          {[['all', 'All'], ['in', 'Used'], ['out', 'Not used'], ['up', 'Uploaded']].map(([id, label]) => (
            <button key={id} type="button" className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>

        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
          {shown.map((m) => {
            const on = isIn(m);
            return (
              <div key={m.id} className="stack" style={{ gap: 10, padding: '8px 8px 12px', borderRadius: 16, border: '1px solid ' + (on ? 'rgba(198,244,50,0.45)' : 'var(--line-2)'), background: 'var(--card)' }}>
                <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 11, overflow: 'hidden', background: m.bg }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: on ? 1 : 0.35, filter: on ? 'none' : 'grayscale(0.7)' }}><ImageArt {...m} /></div>
                  {m.id === hero && <span className="pill" style={{ position: 'absolute', left: 8, top: 8, background: 'var(--lime)', color: '#0B0B0F', borderColor: 'var(--lime)' }}>Hero</span>}
                  <button type="button" onClick={() => toggle(m)} aria-pressed={on} aria-label={on ? 'Used for generation, click to exclude' : 'Not used, click to include'}
                    style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: 9, border: '1.5px solid ' + (on ? 'var(--lime)' : '#3A3A42'), background: on ? 'var(--lime)' : 'rgba(11,11,15,0.75)', color: '#0B0B0F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                    {on && <Icon.check sw={3.2} />}
                  </button>
                  <span className="mono" style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 11, padding: '2px 6px', borderRadius: 6, background: 'rgba(11,11,15,0.75)', color: '#D4D4D8' }}>{m.res}</span>
                </div>
                <div className="stack" style={{ gap: 6, padding: '0 2px' }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{m.label}</span>
                  <span className={'pill ' + m.tipCls} style={{ alignSelf: 'flex-start', whiteSpace: 'normal', lineHeight: 1.35, padding: '3px 9px' }}>{m.tip}</span>
                </div>
                <div className="stack" style={{ gap: 6 }}>
                  {on && m.id !== hero && m.kind !== 'text' && <button type="button" className="mini" onClick={() => setHero(m.id)}>Set as hero</button>}
                  {m.person && on && (
                    <button type="button" className={'mini' + (swap[m.id] ? ' on' : '')} aria-pressed={!!swap[m.id]} onClick={() => setSwap({ ...swap, [m.id]: !swap[m.id] })}>
                      {swap[m.id] ? 'Person swapped for cast character' : 'Replace person with cast character'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          <label className="drop" htmlFor="bk-upload" style={{ minHeight: 280 }}>
            <Icon.image />
            <span style={{ fontWeight: 500 }}>Add your own photos</span>
            <span className="faint" style={{ fontSize: 12 }}>Packshots, close-ups or lifestyle shots. At least 1000 px wide works best.</span>
          </label>
        </div>
      </section>

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(420px, 100%), 1fr))', gap: 16 }}>
        <section className="card stack" style={{ padding: 24, gap: 20 }}>
          <div className="row wrap" style={{ gap: 18 }}>
            <div style={{ width: 88, height: 88, borderRadius: 16, background: '#1A1A20', border: '1px solid #26262D', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><div style={{ width: 30, height: 52, borderRadius: 6, background: RED }} /></div>
            <div className="stack" style={{ gap: 6, minWidth: 0 }}>
              <span className="pill green" style={{ alignSelf: 'flex-start' }}>Verified from page</span>
              <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Red Alert Gel Nail Strip</h2>
              <span className="muted" style={{ fontSize: 14 }}>Gel nail strips · <span className="mono" style={{ color: 'var(--text)' }}>£12.99</span></span>
            </div>
          </div>
          <div className="sub stack" style={{ padding: '14px 16px', gap: 6 }}>
            <span className="lbl">The problem it solves</span>
            <p style={{ fontSize: 15, lineHeight: 1.5 }}>A salon-style manicure without long application or damaging your nails at removal.</p>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <span className="lbl">Claims found on the page</span>
            <div className="row wrap" style={{ gap: 8 }}>{['Salon-style finish at home', 'Applies in minutes', 'Peels off cleanly', 'Long-lasting wear'].map((t) => <span key={t} className="tag">{t}</span>)}</div>
          </div>
          <div className="row between" style={{ paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <span className="lbl">Current offer</span><span style={{ fontSize: 14, color: '#FDBA74' }}>[Add offer]</span>
          </div>
        </section>

        <section className="card stack" style={{ padding: 24, gap: 20 }}>
          <h2 className="h2">Brand voice</h2>
          <div className="row wrap" style={{ gap: 8 }}>
            {['Playful', 'Confident', 'Salon-savvy', 'British'].map((t) => <span key={t} className="tag on">{t}</span>)}
            {['Luxury', 'Clinical'].map((t) => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="sub stack" style={{ padding: 16, gap: 8 }}>
            <span className="lbl">Sounds like</span>
            <p style={{ fontSize: 17, lineHeight: 1.45, letterSpacing: '-0.01em' }}>"Red that means business. Five minutes on the sofa, salon nails by dinner."</p>
          </div>
          <div className="stack" style={{ padding: 16, gap: 8, borderRadius: 12, border: '1px dashed #2E2E36' }}>
            <span className="lbl">Never sounds like</span>
            <p className="muted" style={{ fontSize: 15, lineHeight: 1.5, textDecoration: 'line-through', textDecorationColor: 'var(--red)' }}>"Revolutionary nail technology for the modern woman."</p>
          </div>
        </section>

        <section className="card stack" style={{ padding: 24, gap: 20 }}>
          <h2 className="h2">Visual identity</h2>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {['#C8102E', '#111111', '#F2D7D5', '#FFFFFF'].map((c) => (
              <div key={c} className="stack" style={{ gap: 8 }}><div style={{ height: 72, borderRadius: 12, background: c, border: c === '#111111' ? '1px solid var(--line-3)' : 0 }} /><span className="mono faint" style={{ fontSize: 12 }}>{c}</span></div>
            ))}
          </div>
          <span className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Fonts and logo are pulled from the site too. Change a colour by clicking its swatch.</span>
        </section>

        <section className="card stack" style={{ padding: 24, gap: 20 }}>
          <div className="stack" style={{ gap: 6 }}>
            <h2 className="h2">Guardrails</h2>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>Checked automatically on every script and caption before anything reaches review.</p>
          </div>
          <div className="stack" style={{ gap: 8 }}><span className="lbl">Words to avoid</span><div className="row wrap" style={{ gap: 8 }}>{['press-on', 'cheap', 'fake nails'].map((t) => <span key={t} className="tag no">{t}</span>)}</div></div>
          <div className="stack" style={{ gap: 8 }}><span className="lbl">Claims we can't make</span><div className="row wrap" style={{ gap: 8 }}>{['Exact wear time in days', '"Strengthens nails"'].map((t) => <span key={t} className="tag">{t}</span>)}</div></div>
          <button type="button" className="btn" style={{ alignSelf: 'flex-start' }}><Icon.plus />Add a rule</button>
        </section>
      </div>

      <div className="row wrap between" style={{ gap: 12 }}>
        <Link className="btn" to="/">Back</Link>
        <Link className="btn primary" to="/product/research">Continue to research <Icon.arrow /></Link>
      </div>
    </Layout>
  );
}
