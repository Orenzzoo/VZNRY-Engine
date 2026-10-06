import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Stepper from '../components/Stepper.jsx';
import { Icon } from '../components/Icons.jsx';

const STEPS = [
  { label: 'Read the product page', done: '12 images · £12.99 · 6 product claims', running: 'Reading the page…' },
  { label: 'Extract brand voice', done: 'Playful, confident, salon-savvy', running: 'Reading site copy and top posts…' },
  { label: 'Build visual identity', done: '4 brand colours · logo · 8 product cutouts', running: 'Removing backgrounds from product shots…' },
  { label: 'Research buyers', done: '10,482 signals · 2 personas · 38 phrases', running: 'Mining Reddit, TikTok and reviews…' }
];


export default function NewProduct() {
  const [url, setUrl] = useState('https://moyou.co.uk/products/gel-nail-strip-red-alert');
  const [step, setStep] = useState(-1);
  const timer = useRef(null);

  useEffect(() => () => clearInterval(timer.current), []);

  // Simulated setup run. Replace with the real analyze job and poll its progress.
  const analyze = () => {
    clearInterval(timer.current);
    setStep(0);
    timer.current = setInterval(() => {
      setStep((s) => {
        if (s + 1 >= STEPS.length) clearInterval(timer.current);
        return s + 1;
      });
    }, 850);
  };

  return (
    <Layout section="Products" crumbs={['Products', 'Add product']} screen="Paste link">
      <Stepper current={0} />

      <section className="stack" style={{ gap: 14, paddingTop: 12 }}>
        <h1 className="h1">Paste a link.<br /><span className="faint">Get ads back.</span></h1>
        <p className="lede">The engine reads the product, the brand's voice and its visuals, then researches real buyers. No brief, no prompts.</p>
      </section>

      <div className="stack" style={{ gap: 10, maxWidth: 900 }}>
        <label htmlFor="product-url" className="muted" style={{ fontSize: 13, fontWeight: 500 }}>Product page URL</label>
        <div className="card row wrap" style={{ padding: 8, gap: 8 }}>
          <div className="field" style={{ flex: '1 1 360px', minHeight: 58 }}>
            <Icon.link style={{ color: 'var(--faint)' }} />
            <input id="product-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <button type="button" className="btn primary" onClick={analyze} style={{ minHeight: 58, padding: '0 26px', borderRadius: 13 }}>Analyze <Icon.arrow /></button>
        </div>
      </div>

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', maxWidth: 900 }}>
        {[['~60 sec', 'Product facts', 'Price, offer, claims and images'], ['~60 sec', 'Brand voice', 'Tone from site copy and top posts'], ['~90 sec', 'Visuals', 'Colours, logo, clean cutouts'], ['~3 min', 'Buyer research', 'Reddit, TikTok, reviews, ad library']].map(([t, h, d]) => (
          <div key={h} className="card stack" style={{ padding: 16, gap: 10 }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--lime)' }}>{t}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{h}</span>
            <span className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>{d}</span>
          </div>
        ))}
      </div>

      {step >= 0 && (
        <div className="card stack anim-in" style={{ padding: '22px 24px', gap: 4, maxWidth: 900 }}>
          <div className="row between" style={{ marginBottom: 10 }}>
            <h2 className="h2">Setting up Red Alert Gel Nail Strip</h2>
            <span className="mono faint" style={{ fontSize: 12 }}>{Math.min(step, 4)} of 4</span>
          </div>
          <div className="progress" style={{ marginBottom: 10 }}><span style={{ width: `${Math.max(4, (Math.min(step + (step < 4 ? 0.5 : 0), 4) / 4) * 100)}%` }} /></div>
          {STEPS.map((s, i) => {
            const done = step > i, running = step === i;
            return (
              <div key={s.label} className="row" style={{ gap: 14, padding: '14px 0', borderTop: '1px solid var(--line)' }}>
                {done && <div className="anim-fade" style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', background: 'var(--lime)', color: '#0B0B0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.check size={15} sw={3} /></div>}
                {running && <div style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', background: 'rgba(198,244,50,0.1)', color: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M20 12a8 8 0 0 0-8-8" /></svg></div>}
                {!done && !running && <div style={{ flex: 'none', width: 28, height: 28, borderRadius: '50%', border: '1px dashed #3A3A42' }} />}
                <div className="stack" style={{ gap: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{s.label}</span>
                  <span key={done ? 'd' : running ? 'r' : 'w'} className={'muted anim-fade' + (running ? ' pulse' : '')} style={{ fontSize: 13 }}>{done ? s.done : running ? s.running : 'Waiting'}</span>
                </div>
              </div>
            );
          })}
          {step >= 4 && (
            <div className="row wrap between anim-in" style={{ gap: 12, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
              <span className="muted" style={{ fontSize: 14 }}>Ready to check. Most people only fix one or two things.</span>
              <Link className="btn primary" to="/product/brand-kit">Review brand kit <Icon.arrow /></Link>
            </div>
          )}
        </div>
      )}

    </Layout>
  );
}
