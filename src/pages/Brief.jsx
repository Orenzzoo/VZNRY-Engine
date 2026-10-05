import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { BRIEF_STEPS } from '../components/Stepper.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';
import { EXAMPLES, ExampleSwitch, useExample } from './briefExamples.jsx';

const SEG_COLORS = { hook: ['#F4F4F5', '#0B0B0F'], story: ['#2A2A31', '#F4F4F5'], promo: ['#C6F432', '#0B0B0F'] };

function segments(L, place) {
  const s = (label, secs, kind) => ({ label, secs, kind });
  if (place === 'end') return [s('Hook', 3, 'hook'), s('Story', L - 7, 'story'), s('Promo', 4, 'promo')];
  if (place === 'mid') { const a = Math.floor((L - 7) / 2); return [s('Hook', 3, 'hook'), s('Story', a, 'story'), s('Promo', 4, 'promo'), s('Story', L - 7 - a, 'story')]; }
  const a = Math.floor((L - 9) / 2);
  return [s('Hook', 3, 'hook'), s('Story', a, 'story'), s('Promo', 3, 'promo'), s('Story', L - 9 - a, 'story'), s('Promo', 3, 'promo')];
}

export default function Brief() {
  const [exId, setExId] = useExample();
  const base = EXAMPLES[exId];
  const [edits, setEdits] = useState({});
  const [series, setSeries] = useState(true);
  const v = { ...base, ...(edits[exId] || {}) };
  const set = (k, val) => setEdits({ ...edits, [exId]: { ...(edits[exId] || {}), [k]: val } });
  const field = (k) => ({ value: v[k], onChange: (e) => set(k, e.target.value) });
  const segs = segments(v.len, v.place);

  return (
    <Layout section="Briefs" crumbs={['Briefs', v.name]} screen="New brief" brand={{ name: base.client, color: base.dot }} guide>
      <Stepper steps={BRIEF_STEPS.map((s) => ({ ...s, to: s.to.startsWith('/briefs') ? `${s.to}?ex=${exId}` : s.to }))} current={0} />
      <PageHead
        eyebrow="Briefs · Step 01"
        title="No product page? Write a brief."
        lede="For custom ads: a character with a story, an animation, a series. Describe the idea in plain words. The engine plans the rest."
        right={<ExampleSwitch value={exId} onChange={setExId} />}
      />

      <Guide
        title="When to use a brief, and how"
        items={[
          ["What it's for", "Ads that don't come from a product page: a recurring character series, an animation, a story with a promo in it."],
          ['What you do', 'Describe the idea in plain words, pick a style and length, and choose where the promo goes. Try the two examples at the top right to see how it works.'],
          ['What happens next', 'The engine writes 10–20 script options. You pick the ones to make on the next screen.']
        ]}
        terms={<><span><b>Promo, locked</b> = the part that advertises the product. It's made once and reused unchanged in every episode.</span><span><b>Series</b> = keeps the same character and look, so the next episode is one click.</span></>}
      />

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card stack" style={{ flex: '999 1 520px', minWidth: 0, padding: 24, gap: 22 }}>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="stack" style={{ gap: 8 }}><label htmlFor="b-name" style={{ fontSize: 13, fontWeight: 600 }}>Brief name</label><input id="b-name" className="in" {...field('name')} /></div>
            <div className="stack" style={{ gap: 8 }}><label htmlFor="b-what" style={{ fontSize: 13, fontWeight: 600 }}>What are we promoting?</label><input id="b-what" className="in" {...field('what')} /></div>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <label htmlFor="b-link" style={{ fontSize: 13, fontWeight: 600 }}>Link for facts <span className="faint" style={{ fontWeight: 400 }}>· optional</span></label>
            <input id="b-link" className="in" type="url" {...field('link')} />
            <span className="faint" style={{ fontSize: 12 }}>Used only to check facts like prices and terms. Nothing is scripted from it unless it's verified.</span>
          </div>
          <div className="stack" style={{ gap: 8 }}><label htmlFor="b-idea" style={{ fontSize: 13, fontWeight: 600 }}>The idea</label><textarea id="b-idea" className="in" {...field('idea')} /></div>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="stack" style={{ gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Style</span>
              <div className="segs" role="group" aria-label="Style">{[['ai', 'AI presenter'], ['anim', 'Animated'], ['mix', 'Mixed']].map(([id, l]) => <button key={id} type="button" className={'seg' + (v.style === id ? ' on' : '')} onClick={() => set('style', id)}>{l}</button>)}</div>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Length</span>
              <div className="segs" role="group" aria-label="Length">{[15, 30, 45].map((n) => <button key={n} type="button" className={'seg' + (v.len === n ? ' on' : '')} onClick={() => set('len', n)}>{n} s</button>)}</div>
            </div>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Where does the promo go?</span>
            <div className="segs" role="group" aria-label="Promo placement" style={{ maxWidth: 420 }}>{[['mid', 'Middle'], ['end', 'End'], ['both', 'Both']].map(([id, l]) => <button key={id} type="button" className={'seg' + (v.place === id ? ' on' : '')} onClick={() => set('place', id)}>{l}</button>)}</div>
          </div>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="stack" style={{ gap: 8 }}><label htmlFor="b-must" style={{ fontSize: 13, fontWeight: 600 }}>Must say</label><textarea id="b-must" className="in" style={{ minHeight: 76 }} {...field('must')} /></div>
            <div className="stack" style={{ gap: 8 }}><label htmlFor="b-avoid" style={{ fontSize: 13, fontWeight: 600 }}>Avoid</label><textarea id="b-avoid" className="in" style={{ minHeight: 76 }} {...field('avoid')} /></div>
          </div>
          <button type="button" className="toggle-row" aria-pressed={series} onClick={() => setSeries(!series)}>
            <span className={'switch' + (series ? ' on' : '')} />
            <span className="stack" style={{ gap: 2 }}><span style={{ fontSize: 14, fontWeight: 600 }}>Save as a series</span><span className="faint" style={{ fontSize: 12 }}>Keeps the character, look, promo segment and structure, so the next episode is one click.</span></span>
          </button>
        </section>

        <aside className="stack" style={{ flex: '1 1 340px', minWidth: 0, gap: 14 }}>
          <div className="card stack" style={{ padding: 20, gap: 16 }}>
            <div className="row between"><h2 style={{ fontSize: 16, fontWeight: 600 }}>Ad structure</h2><span className="mono faint" style={{ fontSize: 12 }}>{v.len} seconds</span></div>
            <div className="row" style={{ gap: 4, height: 52 }}>
              {segs.map((g, i) => (
                <div key={i} className="stack" style={{ flex: g.secs, height: '100%', borderRadius: 9, background: SEG_COLORS[g.kind][0], color: SEG_COLORS[g.kind][1], alignItems: 'center', justifyContent: 'center', gap: 2, overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{g.label}</span><span className="mono" style={{ fontSize: 10, opacity: 0.8 }}>{g.secs}s</span>
                </div>
              ))}
            </div>
            <div className="row wrap faint" style={{ gap: 14, fontSize: 12 }}>
              <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F4F4F5' }} />Hook</span>
              <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#2A2A31', border: '1px solid #3A3A42' }} />Story, changes each episode</span>
              <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--lime)' }} />Promo, locked</span>
            </div>
            <div className="sub stack" style={{ padding: 14, gap: 8 }}>
              <span className="faint" style={{ fontSize: 12 }}>Example beats</span>
              {base.beats.map(([t, text]) => <div key={t} className="row" style={{ gap: 10, fontSize: 13, lineHeight: 1.45, alignItems: 'flex-start' }}><span className="mono faint" style={{ flex: 'none', width: 52 }}>{t}</span><span>{text}</span></div>)}
            </div>
          </div>
          <div className="card stack" style={{ padding: 20, gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>What happens next</h2>
            {[base.next1, 'The engine writes 10–20 script options, all with the same promo slot.', base.next3].map((t, i) => (
              <div key={i} className="row" style={{ gap: 10, fontSize: 14, lineHeight: 1.45, alignItems: 'flex-start' }}><span className="mono" style={{ color: 'var(--lime)' }}>{i + 1}</span><span>{t}</span></div>
            ))}
          </div>
          <Link className="btn primary" to={`/briefs/concepts?ex=${exId}`} style={{ minHeight: 52 }}>Generate concepts <Icon.arrow /></Link>
        </aside>
      </div>
    </Layout>
  );
}
