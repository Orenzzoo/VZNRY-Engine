import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { BRIEF_STEPS } from '../components/Stepper.jsx';
import { Icon } from '../components/Icons.jsx';
import { EXAMPLES, BriefSource, useExample, useEpisodes } from './briefExamples.jsx';

const PRESENTERS = [
  { id: 'tasha', name: 'Tasha, 34', vibe: 'Warm, chatty, feels like a friend letting you in on something', tag: 'Most used', scene: '#2B3A2E', skin: '#9C6B4E', shirt: '#3F6B4A' },
  { id: 'marcus', name: 'Marcus, 28', vibe: 'Deadpan, quick, good for "you are doing it wrong" hooks', tag: 'New', scene: '#2A2E3A', skin: '#6B4A36', shirt: '#4A5578' },
  { id: 'grace', name: 'Grace, 61', vibe: 'Grandma energy, thrifty and proud of it', tag: 'Tested', scene: '#3A2E2B', skin: '#E8C4A8', shirt: '#8A4A5A' }
];
const STYLES = [
  { id: 'clay', name: 'Soft 3D clay', about: 'Rounded, tactile, stop-motion feel', scene: '#2B2440', fill: '#E9E4F7', radius: 30, shadow: 'inset -8px -10px 0 rgba(60,40,110,0.18)', border: '0', ink: '#3B2F5C' },
  { id: 'flat', name: 'Flat 2D', about: 'Clean shapes, cheapest to animate in code', scene: '#1A2238', fill: '#8FB3FF', radius: 16, shadow: 'none', border: '0', ink: '#14203D' },
  { id: 'book', name: 'Storybook', about: 'Warm, hand-drawn bedtime feel', scene: '#2E2619', fill: '#F3E3C8', radius: 32, shadow: 'none', border: '3px solid #C9A97A', ink: '#6B4F2A' },
  { id: 'paper', name: 'Paper cut-out', about: 'Layered paper with a hard offset shadow', scene: '#2A1E22', fill: '#F7F7F2', radius: 18, shadow: '8px 8px 0 #D96C6C', border: '0', ink: '#2A1E22' }
];
const POSES = [
  { label: 'Front', w: 120, h: 78, gap: 14, ew: 8, eh: 8, tf: 'none' },
  { label: 'Three-quarter', w: 96, h: 74, gap: 10, ew: 7, eh: 8, tf: 'skewY(-6deg)' },
  { label: 'Squished (happy)', w: 136, h: 58, gap: 16, ew: 10, eh: 3, tf: 'none' },
  { label: 'Asleep', w: 120, h: 78, gap: 14, ew: 12, eh: 3, tf: 'rotate(-4deg)' }
];

function Pillow({ s, w = 128, h = 84, gap = 14, ew = 8, eh = 8, tf = 'none' }) {
  return (
    <span className="row" style={{ justifyContent: 'center', gap, width: w, height: h, background: s.fill, borderRadius: s.radius, boxShadow: s.shadow, border: s.border, transform: tf }}>
      <span style={{ width: ew, height: eh, borderRadius: 4, background: s.ink }} /><span style={{ width: ew, height: eh, borderRadius: 4, background: s.ink }} />
    </span>
  );
}

export default function Cast() {
  const [exId] = useExample();
  const ex = EXAMPLES[exId];
  const isDT = ex.style !== 'anim'; // presenter-style briefs cast a person; animated ones lock a look
  const picked = useEpisodes(exId).selected.length;
  const firstLine = ex.beats[0][1].replace(/^"|"$/g, '');
  const [pid, setPid] = useState('tasha');
  const [voice, setVoice] = useState('warm');
  const [sid, setSid] = useState('clay');
  const [approved, setApproved] = useState(false);
  const chosen = PRESENTERS.find((p) => p.id === pid);
  const sel = STYLES.find((s) => s.id === sid);

  return (
    <Layout section="Custom videos" crumbs={['Custom videos', ex.name]} screen="Look and cast" brand={{ name: ex.client, color: ex.dot }}>
      <Stepper steps={BRIEF_STEPS.map((s) => ({ ...s, to: `${s.to}?ex=${exId}` }))} current={2} />
      <PageHead
        eyebrow="Briefs · Step 03"
        title={isDT ? 'Cast the face of the series.' : 'Lock the look before any video.'}
        lede={isDT ? 'Pick one presenter and voice. They stay the same across every episode, so viewers start to recognise them.' : 'Animation drifts when the style isn’t fixed. Approve a style frame and a character sheet first; every shot is built from them.'}
        right={<BriefSource exId={exId} />}
      />

      {isDT ? (
        <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
          <section className="stack" style={{ flex: '999 1 540px', minWidth: 0, gap: 12 }}>
            <div className="row between"><h2 className="h2">Presenter</h2><Link className="btn" to="/characters?new=generate" style={{ minHeight: 40 }}><Icon.wand />Generate a new presenter</Link></div>
            <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {PRESENTERS.map((p) => (
                <button key={p.id} type="button" className={'pick' + (p.id === pid ? ' on' : '')} aria-pressed={p.id === pid} onClick={() => setPid(p.id)}>
                  <span style={{ display: 'block', height: 240, borderRadius: 11, background: p.scene, position: 'relative', overflow: 'hidden' }}>
                    <span style={{ position: 'absolute', left: '50%', top: '22%', width: 74, height: 74, marginLeft: -37, borderRadius: '50%', background: p.skin }} />
                    <span style={{ position: 'absolute', left: '50%', top: '52%', width: 140, height: 130, marginLeft: -70, borderRadius: '60px 60px 14px 14px', background: p.shirt }} />
                    <span className="pill" style={{ position: 'absolute', left: 8, top: 8, background: 'rgba(11,11,15,0.7)' }}>{p.tag}</span>
                  </span>
                  <span className="stack" style={{ gap: 4, padding: '0 4px' }}><span style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</span><span className="faint" style={{ fontSize: 12, lineHeight: 1.4 }}>{p.vibe}</span></span>
                </button>
              ))}
            </div>
          </section>
          <aside className="card stack" style={{ flex: '1 1 320px', minWidth: 0, padding: 20, gap: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>{chosen.name} for this series</h2>
            <div className="stack" style={{ gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Voice</span>
              <div className="segs" role="group" aria-label="Voice">{[['warm', 'Warm'], ['up', 'Upbeat'], ['hush', 'Secret whisper']].map(([id, l]) => <button key={id} type="button" className={'seg' + (voice === id ? ' on' : '')} onClick={() => setVoice(id)}>{l}</button>)}</div>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Setting</span>
              <div className="row wrap" style={{ gap: 8 }}><span className="pill lime" style={{ minHeight: 30, padding: '0 12px' }}>Store aisles</span><span className="pill" style={{ minHeight: 30, padding: '0 12px' }}>Parked car</span><span className="pill" style={{ minHeight: 30, padding: '0 12px' }}>Kitchen counter</span></div>
            </div>
            <div className="sub stack" style={{ padding: 14, gap: 8 }}><span className="faint" style={{ fontSize: 12 }}>Consistency</span><span style={{ fontSize: 14, lineHeight: 1.5 }}>{chosen.name} is locked with 6 reference images and one cloned voice, so every episode shows the same person.</span></div>
            <div className="sub stack" style={{ padding: 14, gap: 8 }}>
              <span className="faint" style={{ fontSize: 12 }}>Line read preview</span>
              <span style={{ fontSize: 15, lineHeight: 1.45 }}>"{firstLine}"</span>
              <button type="button" className="btn" style={{ alignSelf: 'flex-start', minHeight: 40 }}><Icon.play size={14} />Play sample</button>
            </div>
          </aside>
        </div>
      ) : (
        <div className="stack" style={{ gap: 20 }}>
          <section className="stack" style={{ gap: 12 }}>
            <div className="row between"><h2 className="h2">1. Pick a style frame</h2><button type="button" className="btn" style={{ minHeight: 40 }}>Generate 4 more</button></div>
            <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
              {STYLES.map((s) => (
                <button key={s.id} type="button" className={'pick' + (s.id === sid ? ' on' : '')} aria-pressed={s.id === sid} onClick={() => { setSid(s.id); setApproved(false); }}>
                  <span className="row" style={{ justifyContent: 'center', height: 190, borderRadius: 11, background: s.scene }}><Pillow s={s} /></span>
                  <span className="stack" style={{ gap: 4, padding: '0 4px' }}><span style={{ fontSize: 15, fontWeight: 600 }}>{s.name}</span><span className="faint" style={{ fontSize: 12 }}>{s.about}</span></span>
                </button>
              ))}
            </div>
          </section>
          <section className="card stack" style={{ padding: 20, gap: 16 }}>
            <div className="row wrap between" style={{ gap: 10 }}>
              <div className="stack" style={{ gap: 4 }}><h2 className="h2">2. Approve the character sheet</h2><span className="muted" style={{ fontSize: 13 }}>Every shot in every video uses these poses as references, so the character never changes shape or colour.</span></div>
              <span className={'pill' + (approved ? ' green' : '')}>{approved ? 'Approved' : 'Waiting for approval'}</span>
            </div>
            <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
              {POSES.map((p) => (
                <div key={p.label} className="stack" style={{ gap: 8 }}>
                  <div className="row" style={{ justifyContent: 'center', height: 150, borderRadius: 12, background: sel.scene }}><Pillow s={sel} {...p} /></div>
                  <span className="faint" style={{ fontSize: 12, textAlign: 'center' }}>{p.label}</span>
                </div>
              ))}
            </div>
            <div className="row wrap" style={{ gap: 10 }}>
              <button type="button" className="btn">Regenerate sheet</button>
              <button type="button" className="btn primary" onClick={() => setApproved(true)}>{approved ? 'Approved' : 'Approve look'}</button>
            </div>
          </section>
        </div>
      )}

      <div className="row wrap between" style={{ gap: 12 }}>
        <Link className="btn" to={`/custom/episodes?ex=${exId}`}>Back to episodes</Link>
        <Link className="btn primary" to={`/custom/generate?ex=${exId}`}>Generate {picked || 'your'} {ex.conceptsTitle.toLowerCase()} <Icon.arrow /></Link>
      </div>
    </Layout>
  );
}
