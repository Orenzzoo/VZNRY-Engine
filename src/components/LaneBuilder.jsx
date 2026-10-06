import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import { formatById } from '../data/formats.js';

// Hooks / cores / CTAs lanes: generate pieces, approve or reject them, drop in your own clips, then stitch.
// Used by Generate (editor tasks) and by the custom-video Generate step.
const LANES = [
  { key: 'hooks', label: 'Hooks', short: 'H', about: 'First 1–3 s', pool: 'hooks', secs: ['0:03', '0:02', '0:03', '0:02'], all: 4 },
  { key: 'cores', label: 'Cores', short: 'C', about: 'The middle', pool: 'cores', secs: ['0:12', '0:10', '0:14'], all: 3 },
  { key: 'ctas', label: 'CTAs', short: 'T', about: 'The ending', pool: 'ctas', secs: ['0:04', '0:03'], all: 2 }
];

function Tile({ item, label, onVerdict }) {
  if (item.state === 'loading') return <div className="tile skel anim-fade" aria-label="Generating" />;
  const f = formatById(item.format);
  return (
    <div title={item.text} className={'tile anim-in' + (item.verdict === 'ok' ? ' ok' : item.verdict === 'no' ? ' no' : '')} style={{ background: item.uploaded ? '#1C1C22' : f ? f.bg : '#22222A' }}>
      <div className="meta">
        <span className="pill mono" style={{ background: 'rgba(11,11,15,0.7)', fontSize: 11, minHeight: 20, padding: '0 7px' }}>{label}</span>
        <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)' }}>{item.secs}</span>
      </div>
      {item.uploaded ? (
        <span className="stack" style={{ position: 'absolute', inset: '30% 8px auto', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 11, textAlign: 'center', wordBreak: 'break-word' }}><Icon.upload />{item.text}</span>
      ) : (
        <span className="cap">{item.text}</span>
      )}
      <span className="faint" style={{ position: 'absolute', left: 8, right: 8, bottom: 44, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{item.uploaded ? 'Your upload' : item.formatName}</span>
      <div className="acts">
        <button type="button" className={item.verdict === 'ok' ? 'yes' : ''} aria-pressed={item.verdict === 'ok'} aria-label={`Approve ${label}`} onClick={() => onVerdict(item.verdict === 'ok' ? null : 'ok')}><Icon.check size={14} /></button>
        <button type="button" className={item.verdict === 'no' ? 'nope' : ''} aria-pressed={item.verdict === 'no'} aria-label={`Reject ${label}`} onClick={() => onVerdict(item.verdict === 'no' ? null : 'no')}><Icon.x size={14} /></button>
      </div>
    </div>
  );
}

// `pools` = { hooks: [...], cores: [...], ctas: [...] } texts to fill generated tiles with.
// `formatId` / `formatName` label each new tile; `onFirstGenerate` runs when generating starts (e.g. mark the task in progress).
// `onSend(ads)` sends the stitched ads to the researcher for review; `reviewerName` labels the button.
export default function LaneBuilder({ pools, formatId = null, formatName = '', onFirstGenerate, title = '2. Generate, then approve', onSend, reviewerName = 'the researcher', doneTo = '/tasks' }) {
  const [lanes, setLanes] = useState({ hooks: [], cores: [], ctas: [] });
  const [stitched, setStitched] = useState(null); // null · { loading: true } · { ads, key }
  const stitchRef = useRef(null);
  const [sent, setSent] = useState(false);
  const send = () => {
    if (!stitched || !stitched.ads) return;
    if (onSend) onSend(stitched.ads.map((ad, n) => ({ label: ad.parts.map((x) => x.label).join(' + '), text: ad.parts[0].text, secs: ad.secs, bg: ad.bg, format: ad.parts[0].formatName || 'Your upload' })));
    setSent(true);
  };
  const timers = useRef([]);
  const uid = useRef(0);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const busy = Object.values(lanes).some((l) => l.some((i) => i.state === 'loading'));
  const approved = (k) => lanes[k].filter((i) => i.state === 'ready' && i.verdict === 'ok').length;
  const [h, c, t] = [approved('hooks'), approved('cores'), approved('ctas')];
  const combos = h * c * t;
  const ready = h > 0 && c > 0 && t > 0;
  // Approved pieces with their tile labels (H1, C2…), in lane order.
  const picked = (k, short) => lanes[k].map((x, i) => ({ ...x, label: short + (i + 1) })).filter((x) => x.state === 'ready' && x.verdict === 'ok');
  const approvedKey = ['hooks', 'cores', 'ctas'].map((k) => picked(k, '').map((x) => x.id).join(',')).join('|');
  const stale = stitched && stitched.ads && stitched.key !== approvedKey;
  const total = Object.values(lanes).reduce((a, l) => a + l.length, 0);

  // Simulated generation: each tile resolves after a short wait. Replace with the real generation job.
  const generate = (laneKey, n, delay = 0) => {
    if (onFirstGenerate) onFirstGenerate();
    const lane = LANES.find((l) => l.key === laneKey);
    const ids = Array.from({ length: n }, () => 'g' + uid.current++);
    timers.current.push(setTimeout(() => {
      setLanes((prev) => ({ ...prev, [laneKey]: [...prev[laneKey], ...ids.map((id) => ({ id, state: 'loading' }))] }));
      ids.forEach((id, i) => {
        timers.current.push(setTimeout(() => {
          setLanes((prev) => {
            const list = prev[laneKey];
            const at = list.findIndex((x) => x.id === id);
            const pool = pools[lane.pool] && pools[lane.pool].length ? pools[lane.pool] : ['Generated ' + lane.label.toLowerCase().slice(0, -1)];
            const done = { id, state: 'ready', verdict: null, text: pool[at % pool.length], secs: lane.secs[at % lane.secs.length], format: formatId, formatName };
            return { ...prev, [laneKey]: list.map((x) => (x.id === id ? done : x)) };
          });
        }, 900 + i * 450));
      });
    }, delay));
  };
  const generateAll = () => LANES.forEach((l, i) => generate(l.key, l.all, i * 350));
  const secsOf = (x) => { const m = /(\d+):(\d+)/.exec(x.secs || ''); return m ? +m[1] * 60 + +m[2] : 5; };
  // Simulated stitching: every approved hook × core × CTA becomes one ad. Replace with the real render job.
  const stitch = () => {
    const H = picked('hooks', 'H'), C = picked('cores', 'C'), T = picked('ctas', 'T');
    const key = approvedKey;
    setStitched({ loading: true, count: H.length * C.length * T.length });
    timers.current.push(setTimeout(() => {
      const ads = [];
      H.forEach((hk) => C.forEach((co) => T.forEach((ct) => ads.push({ id: `${hk.id}-${co.id}-${ct.id}`, parts: [hk, co, ct], secs: secsOf(hk) + secsOf(co) + secsOf(ct), bg: hk.uploaded ? '#1C1C22' : (formatById(hk.format) || {}).bg || '#22222A' }))));
      setStitched({ ads, key });
    }, 1300));
    timers.current.push(setTimeout(() => stitchRef.current && stitchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60));
  };
  const setVerdict = (laneKey, id, verdict) => setLanes((prev) => ({ ...prev, [laneKey]: prev[laneKey].map((x) => (x.id === id ? { ...x, verdict } : x)) }));
  const onDrop = (laneKey, files) => {
    const list = Array.from(files || []).slice(0, 6);
    if (!list.length) return;
    setLanes((prev) => ({ ...prev, [laneKey]: [...prev[laneKey], ...list.map((f) => ({ id: 'u' + uid.current++, state: 'ready', verdict: 'ok', uploaded: true, text: f.name, secs: '' }))] }));
  };


  return (
    <>
      <section className="card" style={{ overflow: 'hidden' }}>
        <div className="row wrap between" style={{ padding: '18px 20px', gap: 12 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="h2">{title}</h2>
            <span className="muted" style={{ fontSize: 13 }}>Press ✓ on the pieces you like. Approved hooks, cores and CTAs get stitched into ads.</span>
          </div>
          <button type="button" className={'btn ' + (busy ? 'off' : 'primary')} onClick={() => !busy && generateAll()} style={{ minHeight: 48 }}>
            {busy ? <><svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M20 12a8 8 0 0 0-8-8" /></svg>Generating…</> : <><Icon.sparkle />{total ? 'Generate another set' : 'Generate everything'}</>}
          </button>
        </div>
        {LANES.map((l) => (
          <div key={l.key} className="lane">
            <div className="stack" style={{ gap: 2 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}><span className="mono">{lanes[l.key].length}</span> {l.label}</span>
              <span className="faint" style={{ fontSize: 12 }}>{l.about}</span>
              {approved(l.key) > 0 && <span className="mono anim-fade" style={{ fontSize: 12, color: 'var(--lime)' }}>{approved(l.key)} approved</span>}
            </div>
            <div className="lane-row">
              <button type="button" className="tile add" onClick={() => generate(l.key, 1)} aria-label={`Generate one more ${l.label.toLowerCase().slice(0, -1)}`}>
                <span className="plus"><Icon.plus /></span>Generate
              </button>
              {lanes[l.key].map((item, i) => <Tile key={item.id} item={item} label={l.short + (i + 1)} onVerdict={(v) => setVerdict(l.key, item.id, v)} />)}
              <label className="tile add drop-t" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onDrop(l.key, e.dataTransfer.files); }}>
                <span className="plus" style={{ background: 'transparent' }}><Icon.upload /></span>Drop videos
                <input type="file" accept="video/*" multiple className="sr-only" onChange={(e) => { onDrop(l.key, e.target.files); e.target.value = ''; }} />
              </label>
            </div>
          </div>
        ))}
      </section>

      <section className="card row wrap between" style={{ padding: '18px 20px', gap: 16, borderColor: ready ? 'rgba(198,244,50,0.35)' : undefined }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>
          <span className="mono">{h}</span> hooks × <span className="mono">{c}</span> cores × <span className="mono">{t}</span> CTAs = <span className="mono" style={{ color: ready ? 'var(--lime)' : undefined }}>{ready ? combos : 0}</span> ads
        </span>
        {ready ? (
          <button type="button" className={'btn ' + (stitched && !stale ? '' : 'primary')} style={{ minHeight: 48 }} disabled={stitched && stitched.loading} onClick={stitch}>
            <Icon.generate size={16} />{stitched && stitched.ads && !stale ? 'Stitch again' : `Stitch ${combos} ad${combos === 1 ? '' : 's'}`}
          </button>
        ) : (
          <span className="faint" style={{ fontSize: 13 }}>Approve at least one of each to stitch.</span>
        )}
      </section>

      {stitched && (
        <section ref={stitchRef} className="card anim-in" style={{ overflow: 'hidden', scrollMarginTop: 16 }}>
          <div className="row wrap between" style={{ padding: '18px 20px', gap: 12 }}>
            <div className="stack" style={{ gap: 4 }}>
              <h2 className="h2">Stitched ads {stitched.ads && <span className="mono faint" style={{ fontWeight: 400 }}>· {stitched.ads.length}</span>}</h2>
              <span className="muted" style={{ fontSize: 13 }}>{stitched.loading ? 'Joining your approved pieces…' : 'Each ad is one hook, one core and one CTA. Check them, then send them to review.'}</span>
            </div>
            {stitched.ads && !sent && <button type="button" className="btn primary" disabled={stale} onClick={send} style={{ minHeight: 48 }}><Icon.send size={16} />Send {stitched.ads.length} ad{stitched.ads.length === 1 ? '' : 's'} to {reviewerName} for review</button>}
          </div>
          {sent && (
            <div className="notice row wrap between anim-in" style={{ margin: '0 20px 14px', gap: 10 }}>
              <span className="row" style={{ gap: 8 }}><Icon.check />Sent to {reviewerName} for review. You'll be notified when they've kept or skipped each ad.</span>
              <Link className="btn sm" to={doneTo}>Back to my tasks</Link>
            </div>
          )}
          {stale && !sent && <div className="notice" style={{ margin: '0 20px 14px', fontSize: 13 }}>Your approvals changed since you stitched. Press "Stitch again" to update these ads.</div>}
          <div className="stitch-grid stagger">
            {stitched.loading
              ? Array.from({ length: Math.min(stitched.count, 8) }, (_, i) => <div key={i} className="skel" style={{ aspectRatio: '9 / 16', borderRadius: 14 }} />)
              : stitched.ads.map((ad, i) => (
                <div key={ad.id} className="stitch-card" style={{ background: ad.bg }}>
                  <div className="row between" style={{ position: 'relative' }}>
                    <span className="pill mono" style={{ background: 'rgba(11,11,15,0.7)', fontSize: 11, minHeight: 20, padding: '0 7px' }}>Ad {i + 1}</span>
                    <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>0:{String(ad.secs).padStart(2, '0')}</span>
                  </div>
                  <span className="stitch-play"><Icon.play size={16} /></span>
                  <span className="stitch-cap" title={ad.parts.map((x) => x.text).join(' → ')}>{ad.parts[0].text}</span>
                  <div className="stitch-strip" aria-label={`${ad.parts.map((x) => x.label).join(' + ')}`}>
                    {ad.parts.map((x, k) => <span key={k} style={{ flex: secsOf(x), background: ['#F4F4F5', '#3A3A42', 'var(--lime)'][k] }} />)}
                  </div>
                  <span className="mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>{ad.parts.map((x) => x.label).join(' + ')}</span>
                </div>
              ))}
          </div>
        </section>
      )}
    </>
  );
}
