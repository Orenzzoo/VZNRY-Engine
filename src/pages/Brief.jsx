import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { BRIEF_STEPS } from '../components/Stepper.jsx';
import { Icon } from '../components/Icons.jsx';
import { EXAMPLES, StartFrom, VIDEO_TYPES, useExample } from './briefExamples.jsx';

const PLACEHOLDERS = {
  name: 'e.g. Office drama, season 1',
  what: 'e.g. A coffee brand, a gift card, an app',
  link: 'https://',
  idea: 'Describe it like you would to a friend. Who is in it, what happens, and where does the product show up?',
  must: 'e.g. Product name said once. Logo on the end card.',
  avoid: 'e.g. Health claims. Competitor names.'
};
const SEG_COLORS = { hook: ['#F4F4F5', '#0B0B0F'], story: ['#2A2A31', '#F4F4F5'], promo: ['#C6F432', '#0B0B0F'] };

const BEAT_TEXT = { hook: 'Hook: the first line, written from your idea', story: 'Story: changes each episode', promo: 'Promo / CTA: made once, reused' };

function segments(L, place) {
  const s = (label, secs, kind) => ({ label, secs, kind });
  if (place === 'end') return [s('Hook', 3, 'hook'), s('Story', L - 7, 'story'), s('Promo', 4, 'promo')];
  if (place === 'mid') { const a = Math.floor((L - 7) / 2); return [s('Hook', 3, 'hook'), s('Story', a, 'story'), s('Promo', 4, 'promo'), s('Story', L - 7 - a, 'story')]; }
  const a = Math.floor((L - 9) / 2);
  return [s('Hook', 3, 'hook'), s('Story', a, 'story'), s('Promo', 3, 'promo'), s('Story', L - 9 - a, 'story'), s('Promo', 3, 'promo')];
}

// The ad's timeline. Handles between parts can be dragged (or moved with arrow keys) in 1-second steps; every part keeps at least 1 s.
function AdStructure({ segs, len, onChange }) {
  const bar = useRef(null);
  const drag = useRef(null);
  const [dragging, setDragging] = useState(false);
  const secs = segs.map((g) => g.secs);
  const move = (i, start, d) => {
    const step = Math.max(1 - start[i], Math.min(start[i + 1] - 1, d));
    const next = start.slice();
    next[i] += step; next[i + 1] -= step;
    onChange(next);
  };
  const down = (i) => (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, x: e.clientX, start: secs, width: bar.current.getBoundingClientRect().width };
    setDragging(true);
  };
  const moveTo = (e) => {
    const d = drag.current;
    if (!d) return;
    move(d.i, d.start, Math.round(((e.clientX - d.x) / d.width) * len));
  };
  const up = () => { drag.current = null; setDragging(false); };
  const key = (i) => (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); move(i, secs, -1); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); move(i, secs, 1); }
  };
  let at = 0;
  return (
    <div ref={bar} className="row" style={{ height: 56, userSelect: 'none', touchAction: 'none' }}>
      {segs.map((g, i) => {
        at += g.secs;
        return (
          <span key={i} style={{ display: 'contents' }}>
            <div className="stack anim-fade" style={{ flex: g.secs, minWidth: 0, transition: dragging ? 'none' : 'flex .35s var(--ease-out)', height: '100%', borderRadius: 9, background: SEG_COLORS[g.kind][0], color: SEG_COLORS[g.kind][1], alignItems: 'center', justifyContent: 'center', gap: 2, overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 2px' }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>{g.label}</span><span className="mono" style={{ fontSize: 10, opacity: 0.8 }}>{g.secs}s</span>
            </div>
            {i < segs.length - 1 && (
              <span role="slider" tabIndex={0} className="seg-handle" aria-label={`Boundary between ${g.label} and ${segs[i + 1].label}`} aria-valuemin={1} aria-valuemax={len - 1} aria-valuenow={at} aria-valuetext={`${g.label} ends at ${at} seconds`}
                onPointerDown={down(i)} onPointerMove={moveTo} onPointerUp={up} onPointerCancel={up} onKeyDown={key(i)} title="Drag to change the timing" />
            )}
          </span>
        );
      })}
    </div>
  );
}

export default function Brief() {
  const [exId, setExId] = useExample();
  const base = EXAMPLES[exId];
  const [edits, setEdits] = useState({});
  const [series, setSeries] = useState(true);
  const [types, setTypes] = useState(VIDEO_TYPES);
  const [addingType, setAddingType] = useState(false);
  const [newType, setNewType] = useState('');
  const v = { ...base, ...(edits[exId] || {}) };
  const set = (k, val) => setEdits({ ...edits, [exId]: { ...(edits[exId] || {}), [k]: val } });
  const field = (k) => ({ value: v[k], placeholder: PLACEHOLDERS[k], onChange: (e) => set(k, e.target.value) });
  const allTypes = v.format && !types.includes(v.format) ? types.concat(v.format) : types;
  const addType = () => {
    const t = newType.trim();
    if (t) { if (!types.includes(t)) setTypes(types.concat(t)); set('format', t); }
    setNewType(''); setAddingType(false);
  };
  // Timing of each part. Starts from the default split for the length and promo placement; dragging the handles changes it.
  const splitKey = `${v.len}|${v.place}`;
  const [splits, setSplits] = useState({});
  const defaults = segments(v.len, v.place);
  const segs = defaults.map((g, i) => ({ ...g, secs: (splits[exId + splitKey] || defaults.map((d) => d.secs))[i] }));
  const custom = !!splits[exId + splitKey];
  const setSecs = (arr) => setSplits({ ...splits, [exId + splitKey]: arr });

  return (
    <Layout section="Custom videos" crumbs={['Custom videos', v.name]} screen="Custom video idea" brand={{ name: base.client, color: base.dot }}>
      <Stepper steps={BRIEF_STEPS.map((s) => ({ ...s, to: `${s.to}?ex=${exId}` }))} current={0} />
      <PageHead
        eyebrow="Briefs · Step 01"
        title="Make a custom video."
        lede="For any video that doesn't start from a product page: a presenter series, an AI drama, a song, a brainrot edit, whatever you have in mind. Describe it in plain words. The engine plans the rest."
      />

      <StartFrom value={exId} onChange={setExId} />

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section key={exId} className="card stack anim-in" style={{ flex: '999 1 520px', minWidth: 0, padding: 24, gap: 22 }}>
          <div className="stack" style={{ gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>What kind of video? <span className="faint" style={{ fontWeight: 400 }} title="Helps the engine pick the right script style and pacing. Not on the list? Add your own.">ⓘ</span></span>
            <div className="row wrap" role="group" aria-label="Kind of video" style={{ gap: 8 }}>
              {allTypes.map((t) => <button key={t} type="button" className={'chip' + (v.format === t ? ' on' : '')} aria-pressed={v.format === t} onClick={() => set('format', v.format === t ? '' : t)}>{t}</button>)}
              {addingType ? (
                <span className="row anim-fade" style={{ gap: 6 }}>
                  <input className="in" autoFocus value={newType} onChange={(e) => setNewType(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addType(); if (e.key === 'Escape') { setAddingType(false); setNewType(''); } }} placeholder="e.g. Cooking hack" aria-label="New kind of video" style={{ minHeight: 40, width: 190, borderRadius: 999, fontSize: 13 }} />
                  <button type="button" className="btn sm primary" onClick={addType}>Add</button>
                </span>
              ) : (
                <button type="button" className="chip" style={{ borderStyle: 'dashed', color: 'var(--lime-hover)' }} onClick={() => setAddingType(true)}>+ Add your own</button>
              )}
            </div>
          </div>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="stack" style={{ gap: 8 }}><label htmlFor="b-name" style={{ fontSize: 13, fontWeight: 600 }}>Video name</label><input id="b-name" className="in" {...field('name')} /></div>
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
            <AdStructure segs={segs} len={v.len} onChange={setSecs} />
            <div className="row wrap between" style={{ gap: 8 }}>
              <span className="faint" style={{ fontSize: 12 }}>Drag the handles between parts to change the timing.</span>
              {custom && <button type="button" className="mini anim-fade" onClick={() => { const n = { ...splits }; delete n[exId + splitKey]; setSplits(n); }}>Reset timing</button>}
            </div>
            <div className="row wrap faint" style={{ gap: 14, fontSize: 12 }}>
              <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#F4F4F5' }} />Hook</span>
              <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#2A2A31', border: '1px solid #3A3A42' }} />Story, changes each episode</span>
              <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--lime)' }} />Promo / CTA, locked</span>
            </div>
            <div className="sub stack" style={{ padding: 14, gap: 8 }}>
              <span className="faint" style={{ fontSize: 12 }}>How the beats will look</span>
              {segs.reduce((acc, g, i) => {
                const start = acc.t;
                acc.t += g.secs;
                const text = g.kind === 'hook' && base.sample ? base.beats[0][1] : BEAT_TEXT[g.kind];
                acc.rows.push(<div key={i} className="row" style={{ gap: 10, fontSize: 13, lineHeight: 1.45, alignItems: 'flex-start' }}><span className="mono faint" style={{ flex: 'none', width: 60 }}>{start}–{acc.t}s</span><span>{text}</span></div>);
                return acc;
              }, { t: 0, rows: [] }).rows}
            </div>
          </div>
          <div className="card stack" style={{ padding: 20, gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>What happens next</h2>
            {[base.next1, 'The engine writes 10–20 script options, all with the same promo slot.', base.next3].map((t, i) => (
              <div key={i} className="row" style={{ gap: 10, fontSize: 14, lineHeight: 1.45, alignItems: 'flex-start' }}><span className="mono" style={{ color: 'var(--lime)' }}>{i + 1}</span><span>{t}</span></div>
            ))}
          </div>
          <Link className="btn primary" to={`/custom/episodes?ex=${exId}`} style={{ minHeight: 52 }}>Suggest episodes <Icon.arrow /></Link>
        </aside>
      </div>
    </Layout>
  );
}
