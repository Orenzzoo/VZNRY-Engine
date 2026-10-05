import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Guide from '../components/Guide.jsx';
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
  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [files, setFiles] = useState([]);
  const [consent, setConsent] = useState(false);

  const all = BASE.concat(added);
  const shown = all.filter((c) => filter === 'all' || c.kind === filter || (filter === 'up' && c.kind === 'train'));
  const sel = all.find((c) => c.id === selId) || all[0];
  const canSave = consent && draftName.trim().length > 0;

  // Previews stay in the browser. In the real build: upload photos + voice, store the signed consent form, then start training.
  const onFiles = (e) => setFiles(Array.from(e.target.files || []).slice(0, 4).map((f) => URL.createObjectURL(f)));
  const save = () => {
    if (!canSave) return;
    const id = 'new' + (added.length + 1);
    setAdded(added.concat([{ id, name: draftName.trim(), kind: 'train', scene: '#22222A', skin: '#C9946E', shirt: '#3A3A42', vibe: 'Uploaded just now. Training on the reference photos.', voice: 'No voice yet', consistency: '0%', note: 'Test shots run automatically when training finishes (about 10 min).', usedIn: 'Not used yet', brands: 'Moyou London', photo: files[0], photos: files }]));
    setSelId(id); setAdding(false); setFiles([]); setConsent(false); setDraftName('');
  };

  return (
    <Layout section="Characters" crumbs={['Visionary Studios', 'Characters']} brand={{ name: 'All brands', color: 'var(--lime)' }} guide>
      <PageHead
        eyebrow="Workspace · Characters"
        title="Your cast, ready for any ad."
        lede="Upload a person, generate an AI presenter or add an animated character. Each one is locked with reference images and a voice, so they look and sound the same in every video."
        right={<button type="button" className="btn primary" onClick={() => setAdding(true)}><Icon.upload />Upload character</button>}
      />

      <Guide
        title="How this page works"
        items={[
          ["What it's for", 'Everyone and everything that can appear in our ads, across all brands.'],
          ['What you do', 'Click a character to check its photos, voice and rights. To add someone, press "Upload character": 4 photos, a voice sample, and signed consent if it\'s a real person.'],
          ['What happens next', 'New characters train for about 10 minutes, then appear in Look and cast and on the Formats step.']
        ]}
        terms={<><span><b>Match %</b> = how often test shots look like the reference photos. Above 90% is reliable.</span><span><b>AI-generated</b> = not a real person. <b>Uploaded</b> = a real person, consent required.</span></>}
      />

      <div className="row wrap" role="group" aria-label="Filter characters" style={{ gap: 8 }}>
        {[['all', 'All'], ['ai', 'AI-generated'], ['up', 'Uploaded'], ['anim', 'Animated']].map(([id, l]) => <button key={id} type="button" className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{l}</button>)}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="grid-auto" style={{ flex: '999 1 520px', minWidth: 0, gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
          {shown.map((c) => (
            <button key={c.id} type="button" className={'pick' + (c.id === selId && !adding ? ' on' : '')} style={{ padding: '8px 8px 12px', gap: 10 }} aria-pressed={c.id === selId} onClick={() => { setSelId(c.id); setAdding(false); }}>
              <span style={{ display: 'block', height: 190, borderRadius: 11, background: c.scene, position: 'relative', overflow: 'hidden' }}>
                <Portrait c={c} />
                <span className={'pill ' + TYPE[c.kind].cls} style={{ position: 'absolute', left: 8, top: 8, background: 'rgba(11,11,15,0.75)' }}>{TYPE[c.kind].type}</span>
              </span>
              <span className="stack" style={{ gap: 4, padding: '0 4px' }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</span>
                <span className="faint" style={{ fontSize: 12 }}>{c.brands}{c.kind === 'train' ? ' · training' : ` · ${c.consistency} match`}</span>
              </span>
            </button>
          ))}
        </section>

        <aside className="card stack" style={{ flex: '1 1 340px', minWidth: 0, padding: 20, gap: 18 }}>
          {adding ? (
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
                <Link className="btn primary" to="/product/formats" style={{ flex: 1 }}>Use in a batch</Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </Layout>
  );
}
