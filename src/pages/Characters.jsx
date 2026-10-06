import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';

const BASE = [
  { id: 'mia', name: 'Mia, 24', kind: 'ai', scene: '#2B211C', skin: '#E8C4A8', shirt: '#7A3B3B', vibe: 'Bright, chatty beauty creator. Best for UGC talking heads.', voice: 'Bright, British · cloned', consistency: '96%', note: '24 of 25 test shots matched the reference face.', usedIn: 'Moyou London · 128 videos', brands: 'Moyou London' },
  { id: 'tasha', name: 'Tasha, 34', kind: 'ai', scene: '#2B3A2E', skin: '#9C6B4E', shirt: '#3F6B4A', vibe: 'Warm, feels like a friend letting you in on something.', voice: 'Warm, American · library voice', consistency: '94%', note: 'Locked for the Dollar Tree Secrets series.', usedIn: 'Dollar Tree Secrets · 36 videos', brands: 'Dollar Tree' },
  { id: 'marcus', name: 'Marcus, 28', kind: 'ai', scene: '#2A2E3A', skin: '#6B4A36', shirt: '#4A5578', vibe: 'Deadpan and quick. Good for "you are doing it wrong" hooks.', voice: 'Dry, American · library voice', consistency: '91%', note: 'Side profile drifts slightly; front shots are solid.', usedIn: 'HookLife · 12 videos', brands: 'HookLife' },
  { id: 'grace', name: 'Grace, 61', kind: 'ai', scene: '#3A2E2B', skin: '#E8C4A8', shirt: '#8A4A5A', vibe: 'Grandma energy, thrifty and proud of it.', voice: 'Soft, Southern US · library voice', consistency: '93%', note: '14 of 15 test shots matched.', usedIn: 'Dollar Tree Secrets · 9 videos', brands: 'Dollar Tree' },
  { id: 'kobe', name: 'Kobe Peretz', kind: 'up', scene: '#1F2A33', skin: '#C9946E', shirt: '#2F4858', vibe: 'Real creator, uploaded from 4 photos and a voice sample.', voice: 'His own voice · cloned with consent', consistency: '89%', note: 'Add a full-body photo to improve wide shots.', usedIn: 'HookLife · 54 videos', brands: 'HookLife' },
  { id: 'tiffany', name: 'Tiffany', kind: 'up', scene: '#33222B', skin: '#F1D9C6', shirt: '#B35A7A', vibe: 'Real nail tech. Hands and close-ups mainly.', voice: 'Her own voice · cloned with consent', consistency: '90%', note: 'Hand shots are the strongest match.', usedIn: 'Moyou London · 22 videos', brands: 'Moyou London' },
  { id: 'pillow', name: 'Pillow (clay)', kind: 'anim', scene: '#2B2440', skin: '#E9E4F7', shirt: '#E9E4F7', vibe: 'Animated pillow from the approved character sheet.', voice: 'No voice · sound effects only', consistency: '98%', note: 'Built from 4 approved poses.', usedIn: 'Pillow animation · 4 videos', brands: 'Pillow client' }
];
const TYPE = {
  ai: { type: 'AI-generated', cls: 'blue', rights: 'AI-generated, not a real person', rightsCls: '' },
  up: { type: 'Uploaded', cls: 'violet', rights: 'Consent on file', rightsCls: 'green' },
  anim: { type: 'Animated', cls: 'lime', rights: 'Original artwork', rightsCls: '' },
  train: { type: 'Training', cls: 'amber', rights: 'Consent on file', rightsCls: 'green' }
};
const REF_LABELS = ['Front', 'Three-quarter', 'Side', 'Full body'];
// Looks the generator "returns". Replace with real image generation results.
const GEN_LOOKS = [
  { scene: '#2E2A3A', skin: '#D9A982', shirt: '#5B4A8A' },
  { scene: '#2A3530', skin: '#8D5B3E', shirt: '#3E6B5A' },
  { scene: '#3A2C24', skin: '#F0CDB0', shirt: '#A35D3D' },
  { scene: '#1F2B38', skin: '#B07A55', shirt: '#2F4F6F' }
];
const VIBES = ['Warm', 'Deadpan', 'High energy', 'Calm', 'Funny', 'Luxury'];
const AGES = ['20s', '30s', '40s', '60+'];
const VOICES = ['Bright, British', 'Warm, American', 'Dry, American', 'Soft, Southern US'];

function Portrait({ c, small }) {
  if (c.photo) return <img src={c.photo} alt={c.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />;
  if (c.kind === 'anim') return (
    <span className="row" style={{ position: 'absolute', left: '50%', top: '50%', width: small ? 48 : 110, height: small ? 32 : 72, transform: 'translate(-50%, -50%)', borderRadius: small ? 12 : 28, background: '#E9E4F7', boxShadow: 'inset -8px -10px 0 rgba(60,40,110,0.18)', justifyContent: 'center', gap: small ? 6 : 14 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B2F5C' }} /><span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B2F5C' }} />
    </span>
  );
  return (
    <>
      <span style={{ position: 'absolute', left: '50%', top: '20%', width: '32%', aspectRatio: '1', transform: 'translateX(-50%)', borderRadius: '50%', background: c.skin }} />
      <span style={{ position: 'absolute', left: '50%', top: '52%', width: '62%', height: '58%', transform: 'translateX(-50%)', borderRadius: '45% 45% 12px 12px', background: c.shirt }} />
    </>
  );
}

export default function Characters() {
  const [added, setAdded] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selId, setSelId] = useState('mia');
  const [params, setParams] = useSearchParams();
  const [mode, setModeRaw] = useState(params.get('new') === 'generate' ? 'generate' : 'view'); // view | upload | generate
  const adding = mode === 'upload';
  const setMode = (m) => { setModeRaw(m); if (params.get('new')) setParams({}, { replace: true }); };
  const setAdding = (on) => setMode(on ? 'upload' : 'view');
  // Generate flow
  const [gKind, setGKind] = useState('real');
  const [gPrompt, setGPrompt] = useState('');
  const [gAge, setGAge] = useState('30s');
  const [gVibe, setGVibe] = useState('Warm');
  const [gVoice, setGVoice] = useState('Warm, American');
  const [gState, setGState] = useState('idle'); // idle | loading | ready
  const [gPick, setGPick] = useState(null);
  const [gName, setGName] = useState('');
  const gTimer = useRef(null);
  useEffect(() => () => clearTimeout(gTimer.current), []);
  const [draftName, setDraftName] = useState('');
  const [files, setFiles] = useState([]);
  const [consent, setConsent] = useState(false);

  const all = BASE.concat(added);
  const shown = all.filter((c) => filter === 'all' || c.kind === filter || (filter === 'up' && c.kind === 'train'));
  const sel = all.find((c) => c.id === selId) || all[0];
  const canSave = consent && draftName.trim().length > 0;

  // Previews stay in the browser. In the real build: upload photos + voice, store the signed consent form, then start training.
  const onFiles = (e) => setFiles(Array.from(e.target.files || []).slice(0, 4).map((f) => URL.createObjectURL(f)));
  // Simulated generation. Replace with the real image model call.
  const generate = () => {
    clearTimeout(gTimer.current);
    setGState('loading'); setGPick(null);
    gTimer.current = setTimeout(() => setGState('ready'), 1800);
  };
  const resetGen = () => { setGState('idle'); setGPick(null); setGName(''); setGPrompt(''); };
  const canSaveGen = gPick != null && gName.trim().length > 0;
  const saveGen = () => {
    if (!canSaveGen) return;
    const id = 'gen' + (added.length + 1);
    const look = GEN_LOOKS[gPick];
    const anim = gKind === 'anim';
    setAdded(added.concat([{ id, name: gName.trim(), kind: anim ? 'anim' : 'ai', fresh: true, ...look, vibe: gPrompt.trim() || `${gVibe} ${anim ? 'animated character' : 'presenter, ' + gAge}.`, voice: anim ? 'No voice · sound effects only' : `${gVoice} · library voice`, consistency: '0%', note: 'Just generated. 4 test shots run automatically to check the face stays the same.', usedIn: 'Not used yet', brands: 'All brands' }]));
    setSelId(id); setMode('view'); resetGen();
  };

  const save = () => {
    if (!canSave) return;
    const id = 'new' + (added.length + 1);
    setAdded(added.concat([{ id, name: draftName.trim(), kind: 'train', scene: '#22222A', skin: '#C9946E', shirt: '#3A3A42', vibe: 'Uploaded just now. Training on the reference photos.', voice: 'No voice yet', consistency: '0%', note: 'Test shots run automatically when training finishes (about 10 min).', usedIn: 'Not used yet', brands: 'Moyou London', photo: files[0], photos: files }]));
    setSelId(id); setAdding(false); setFiles([]); setConsent(false); setDraftName('');
  };

  return (
    <Layout section="Characters" crumbs={['Visionary Studios', 'Characters']} brand={{ name: 'All brands', color: 'var(--lime)' }}>
      <PageHead
        eyebrow="Workspace · Characters"
        title="Your cast, ready for any ad."
        lede="Upload a person, generate an AI presenter or add an animated character. Each one is locked with reference images and a voice, so they look and sound the same in every video."
        right={
          <div className="row wrap" style={{ gap: 10 }}>
            <button type="button" className="btn" onClick={() => setAdding(true)}><Icon.upload />Upload a real person</button>
            <button type="button" className="btn primary" onClick={() => setMode('generate')}><Icon.wand />Generate character</button>
          </div>
        }
      />

      <div className="row wrap" role="group" aria-label="Filter characters" style={{ gap: 8 }}>
        {[['all', 'All'], ['ai', 'AI-generated'], ['up', 'Uploaded'], ['anim', 'Animated']].map(([id, l]) => <button key={id} type="button" className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{l}</button>)}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section key={filter} className="grid-auto stagger" style={{ flex: '999 1 520px', minWidth: 0, gridTemplateColumns: 'repeat(auto-fill, minmax(min(170px, 100%), 1fr))' }}>
          {(filter === 'all' || filter === 'ai' || filter === 'anim') && (
            <button type="button" className={'pick' + (mode === 'generate' ? ' on' : '')} onClick={() => setMode('generate')} style={{ padding: '8px 8px 12px', gap: 10, borderStyle: 'dashed', background: 'transparent' }}>
              <span className="stack" style={{ height: 190, borderRadius: 11, alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(198,244,50,0.04)', color: 'var(--lime)' }}>
                <span className="row" style={{ justifyContent: 'center', width: 48, height: 48, borderRadius: 14, background: 'rgba(198,244,50,0.12)' }}><Icon.wand size={22} /></span>
                <span className="faint" style={{ fontSize: 12, textAlign: 'center', padding: '0 12px', lineHeight: 1.4 }}>Describe a person or mascot, get 4 options</span>
              </span>
              <span className="stack" style={{ gap: 4, padding: '0 4px' }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>Generate character</span>
                <span className="faint" style={{ fontSize: 12 }}>AI-generated · about 20 s</span>
              </span>
            </button>
          )}
          {shown.map((c) => (
            <button key={c.id} type="button" className={'pick' + (c.id === selId && mode === 'view' ? ' on' : '')} style={{ padding: '8px 8px 12px', gap: 10 }} aria-pressed={c.id === selId} onClick={() => { setSelId(c.id); setMode('view'); }}>
              <span style={{ display: 'block', height: 190, borderRadius: 11, background: c.scene, position: 'relative', overflow: 'hidden' }}>
                <Portrait c={c} />
                <span className={'pill ' + TYPE[c.kind].cls} style={{ position: 'absolute', left: 8, top: 8, background: 'rgba(11,11,15,0.75)' }}>{TYPE[c.kind].type}</span>
              </span>
              <span className="stack" style={{ gap: 4, padding: '0 4px' }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</span>
                <span className="faint" style={{ fontSize: 12 }}>{c.brands}{c.kind === 'train' ? ' · training' : c.fresh ? ' · just generated' : ` · ${c.consistency} match`}</span>
              </span>
            </button>
          ))}
        </section>

        <aside key={mode + (mode === 'view' ? sel.id : '')} className="card stack anim-in" style={{ flex: '1 1 340px', minWidth: 0, padding: 20, gap: 18 }}>
          {mode === 'generate' ? (
            <>
              <div className="row between"><h2 style={{ fontSize: 18, fontWeight: 600 }}>Generate a character</h2><button type="button" className="btn" style={{ minHeight: 40 }} onClick={() => { setMode('view'); resetGen(); }}>Cancel</button></div>
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>What kind?</span>
                <div className="segs" role="group" aria-label="Kind of character">{[['real', 'Realistic person'], ['anim', 'Animated mascot']].map(([id, l]) => <button key={id} type="button" className={'seg' + (gKind === id ? ' on' : '')} aria-pressed={gKind === id} onClick={() => { setGKind(id); setGState('idle'); setGPick(null); }}>{l}</button>)}</div>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                <label htmlFor="g-prompt" style={{ fontSize: 13, fontWeight: 600 }}>Describe them</label>
                <textarea id="g-prompt" className="in" value={gPrompt} onChange={(e) => setGPrompt(e.target.value)} style={{ minHeight: 88, fontSize: 14 }}
                  placeholder={gKind === 'anim' ? 'e.g. A sleepy cloud with tiny arms, soft pastel colours, always yawning.' : 'e.g. Friendly woman, curly hair, cosy cardigan, kitchen background. Feels like a friend giving tips.'} />
              </div>
              {gKind === 'real' && (
                <div className="stack" style={{ gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Age</span>
                  <div className="segs" role="group" aria-label="Age">{AGES.map((a) => <button key={a} type="button" className={'seg' + (gAge === a ? ' on' : '')} aria-pressed={gAge === a} onClick={() => setGAge(a)}>{a}</button>)}</div>
                </div>
              )}
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Vibe</span>
                <div className="row wrap" style={{ gap: 6 }}>{VIBES.map((x) => <button key={x} type="button" className={'chip' + (gVibe === x ? ' on' : '')} style={{ minHeight: 34, fontSize: 12 }} aria-pressed={gVibe === x} onClick={() => setGVibe(x)}>{x}</button>)}</div>
              </div>
              {gKind === 'real' && (
                <div className="stack" style={{ gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Voice</span>
                  <div className="row wrap" style={{ gap: 6 }}>{VOICES.map((x) => <button key={x} type="button" className={'chip' + (gVoice === x ? ' on' : '')} style={{ minHeight: 34, fontSize: 12 }} aria-pressed={gVoice === x} onClick={() => setGVoice(x)}>{x}</button>)}</div>
                </div>
              )}
              <button type="button" className={'btn ' + (gState === 'loading' ? 'off' : gState === 'ready' ? 'sm' : 'primary')} style={{ minHeight: 44 }} onClick={() => gState !== 'loading' && generate()}>
                {gState === 'loading' ? <><svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M20 12a8 8 0 0 0-8-8" /></svg>Generating 4 options…</> : gState === 'ready' ? <><Icon.sparkle />Generate 4 more</> : <><Icon.sparkle />Generate 4 options</>}
              </button>
              {gState !== 'idle' && (
                <div className="stack" style={{ gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{gState === 'loading' ? 'Creating options…' : 'Pick one'}</span>
                  <div className="grid-auto stagger" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {GEN_LOOKS.map((look, i) => gState === 'loading' ? (
                      <div key={'s' + i} className="skel" style={{ aspectRatio: '3 / 4', borderRadius: 12 }} />
                    ) : (
                      <button key={'o' + i} type="button" className={'pick' + (gPick === i ? ' on' : '')} aria-pressed={gPick === i} aria-label={`Option ${i + 1}`} onClick={() => setGPick(i)} style={{ padding: 4, borderRadius: 14 }}>
                        <span style={{ display: 'block', aspectRatio: '3 / 4', borderRadius: 10, background: look.scene, position: 'relative', overflow: 'hidden' }}>
                          <Portrait c={{ ...look, kind: gKind === 'anim' ? 'anim' : 'ai' }} />
                          <span className="pill mono" style={{ position: 'absolute', left: 6, top: 6, background: 'rgba(11,11,15,0.7)', fontSize: 11 }}>{i + 1}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {gState === 'ready' && (
                <div className="stack anim-in" style={{ gap: 12 }}>
                  <div className="stack" style={{ gap: 8 }}><label htmlFor="g-name" style={{ fontSize: 13, fontWeight: 600 }}>Name</label><input id="g-name" className="in" value={gName} onChange={(e) => setGName(e.target.value)} placeholder={gKind === 'anim' ? 'e.g. Cloudy' : 'e.g. Jess, 32'} /></div>
                  <span className="hint"><Icon.info size={14} />Generated people are not real, so no consent form is needed. Test shots run after saving.</span>
                  <button type="button" className={'btn ' + (canSaveGen ? 'primary' : 'off')} onClick={saveGen}>{gPick == null ? 'Pick an option first' : !gName.trim() ? 'Add a name to save' : 'Save character'}</button>
                </div>
              )}
            </>
          ) : adding ? (
            <>
              <div className="row between"><h2 style={{ fontSize: 18, fontWeight: 600 }}>Upload a character</h2><button type="button" className="btn" style={{ minHeight: 40 }} onClick={() => setAdding(false)}>Cancel</button></div>
              <div className="stack" style={{ gap: 8 }}><label htmlFor="c-name" style={{ fontSize: 13, fontWeight: 600 }}>Name</label><input id="c-name" className="in" value={draftName} onChange={(e) => setDraftName(e.target.value)} placeholder="e.g. Jess, 27" /></div>
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Reference photos</span>
                <label className="drop" htmlFor="c-files" style={{ minHeight: 120 }}>
                  <Icon.image /><span>Drop up to 4 photos, or click to choose</span><span className="faint" style={{ fontSize: 12 }}>Front, three-quarter, side and full body work best</span>
                </label>
                <input id="c-files" className="sr-only" type="file" accept="image/*" multiple onChange={onFiles} />
                <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {REF_LABELS.map((l, i) => (
                    <div key={l} className="stack" style={{ gap: 6 }}>
                      <div style={{ aspectRatio: '3 / 4', borderRadius: 10, background: 'var(--sub)', border: '1px dashed #2E2E36', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {files[i] ? <img src={files[i]} alt={l + ' reference'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span className="faint mono" style={{ fontSize: 18 }}>+</span>}
                      </div>
                      <span className="faint" style={{ fontSize: 11, textAlign: 'center' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Voice</span>
                <div className="row wrap" style={{ gap: 8 }}><button type="button" className="btn" style={{ minHeight: 40 }}>Upload a voice sample</button><button type="button" className="btn" style={{ minHeight: 40 }}>Pick from voice library</button></div>
                <span className="faint" style={{ fontSize: 12 }}>30 seconds of clean speech is enough to clone a voice.</span>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Can be used by</span>
                <div className="row wrap" style={{ gap: 8 }}>
                  <span className="pill lime" style={{ minHeight: 30, padding: '0 12px' }}>Moyou London</span>
                  <span className="pill" style={{ minHeight: 30, padding: '0 12px' }}>Dollar Tree</span>
                  <span className="pill" style={{ minHeight: 30, padding: '0 12px' }}>HookLife</span>
                  <span className="pill" style={{ minHeight: 30, padding: '0 12px', borderStyle: 'dashed' }}>All brands</span>
                </div>
              </div>
              <button type="button" className="toggle-row" style={{ alignItems: 'flex-start', lineHeight: 1.45 }} aria-pressed={consent} onClick={() => setConsent(!consent)}>
                <span className={'box' + (consent ? ' on' : '')} style={{ marginTop: 1 }}>{consent && <Icon.check size={12} sw={3.4} />}</span>
                <span>This is a real person and we have their signed consent to use their likeness and voice in ads. <span className="faint">The consent form is stored with the character.</span></span>
              </button>
              <button type="button" className={'btn ' + (canSave ? 'primary' : 'off')} onClick={save}>Save and train character</button>
            </>
          ) : (
            <>
              <div className="row between" style={{ alignItems: 'flex-start', gap: 10 }}>
                <div className="stack" style={{ gap: 6 }}><h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{sel.name}</h2><span className="muted" style={{ fontSize: 14, lineHeight: 1.45 }}>{sel.vibe}</span></div>
                <span className={'pill ' + TYPE[sel.kind].cls}>{TYPE[sel.kind].type}</span>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Reference images</span>
                <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {REF_LABELS.map((l, i) => (
                    <div key={l} className="stack" style={{ gap: 6 }}>
                      <div style={{ aspectRatio: '3 / 4', borderRadius: 10, background: sel.scene, overflow: 'hidden', position: 'relative' }}>
                        {sel.photos && sel.photos[i] ? <img src={sel.photos[i]} alt={l + ' reference'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Portrait c={{ ...sel, photo: null }} small />}
                      </div>
                      <span className="faint" style={{ fontSize: 11, textAlign: 'center' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sub row between" style={{ padding: 14, gap: 10 }}>
                <div className="stack" style={{ gap: 2 }}><span className="faint" style={{ fontSize: 12 }}>Voice</span><span style={{ fontSize: 14 }}>{sel.voice}</span></div>
                <button type="button" className="btn" style={{ minHeight: 40 }}><Icon.play size={14} />Play</button>
              </div>
              <div className="sub stack" style={{ padding: 14, gap: 8 }}>
                <div className="row between" style={{ fontSize: 13 }}><span className="muted">Consistency across test shots</span><span className="mono">{sel.consistency}</span></div>
                <div style={{ height: 6, borderRadius: 6, background: 'var(--line)', overflow: 'hidden' }}><div style={{ width: sel.consistency, height: '100%', background: 'var(--lime)' }} /></div>
                <span className="faint" style={{ fontSize: 12 }}>{sel.note}</span>
              </div>
              <div className="stack" style={{ gap: 8 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Rights</span><span className={'pill ' + TYPE[sel.kind].rightsCls} style={{ alignSelf: 'flex-start', minHeight: 30, padding: '0 12px' }}>{TYPE[sel.kind].rights}</span></div>
              <div className="stack" style={{ gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Used in</span><span className="muted" style={{ fontSize: 14 }}>{sel.usedIn}</span></div>
              <div className="row wrap" style={{ gap: 8 }}>
                <button type="button" className="btn" style={{ flex: 1 }}>Run 4 test shots</button>
                <Link className="btn primary" to="/generate" style={{ flex: 1 }}>Use in Generate</Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </Layout>
  );
}
