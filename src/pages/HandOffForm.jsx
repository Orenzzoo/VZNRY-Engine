import { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { DatePicker, NumberField } from '../components/Inputs.jsx';
import { FORMATS } from '../data/formats.js';
import { RESEARCH, PRIORITY, useWork, assignTask, openTasks } from '../data/work.js';
import { EDITORS, Avatar, person, useCurrentUser } from '../data/team.jsx';

const MAX_VIDEOS = 200;
const pad = (n) => String(n).padStart(2, '0');
const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (n) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };
const nextWeekday = (day) => { const d = addDays(1); while (d.getDay() !== day) d.setDate(d.getDate() + 1); return d; }; // 1 = Mon, 5 = Fri
const fromIso = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
// "Today", "Tomorrow", or e.g. "Thu 8 Oct", the way due dates read everywhere else.
const dueLabel = (iso) => {
  if (iso === toIso(addDays(0))) return 'Today';
  if (iso === toIso(addDays(1))) return 'Tomorrow';
  return fromIso(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');
};

// The hand-off form: turns one researched product into a task for an editor. Shown in a floating card on the Editors page.
export default function HandOffForm({ pkgId, editorId, onDone, onBack }) {
  const user = useCurrentUser();
  const { ready, tasks } = useWork();
  const pkg = RESEARCH[pkgId];
  const pkgTitle = (ready.find((p) => p.id === pkgId) || {}).title || 'Batch 1';
  const load = (id) => openTasks(tasks, id).length;
  const lightest = [...EDITORS].sort((a, b) => load(a.id) - load(b.id))[0];

  const [editor, setEditor] = useState(editorId || lightest.id);
  const today = toIso(addDays(0));
  const latest = toIso(addDays(365));
  const quickDues = [['Tomorrow', toIso(addDays(1))], ['Friday', toIso(nextWeekday(5))], ['Next Monday', toIso(nextWeekday(1))]];
  const [due, setDue] = useState(toIso(addDays(2)));
  const [priority, setPriority] = useState('normal');
  const [target, setTarget] = useState('12');
  const [formats, setFormats] = useState(null); // null = use the research suggestion
  const [customs, setCustoms] = useState([]); // "Other" formats typed by the researcher
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherText, setOtherText] = useState('');
  const [note, setNote] = useState('');
  const chosenFormats = formats || pkg.formats;
  const toggleFormat = (id) => setFormats(chosenFormats.includes(id) ? chosenFormats.filter((f) => f !== id) : [...chosenFormats, id]);
  const addOther = () => {
    const name = otherText.trim().replace(/\s+/g, ' ');
    const known = FORMATS.find((f) => f.name.toLowerCase() === name.toLowerCase());
    const id = known ? known.id : name;
    if (name) {
      if (!known && !customs.includes(name)) setCustoms([...customs, name]);
      if (!chosenFormats.includes(id)) setFormats([...chosenFormats, id]);
    }
    setOtherText(''); setOtherOpen(false);
  };

  // Validation: due date must be today or later (and within a year); videos a whole number 1–200; at least one format.
  const videos = Number(target);
  const dueError = !due ? 'Pick a due date.' : due < today ? 'That date has already passed. Pick today or a later date.' : due > latest ? 'Pick a date within the next year.' : '';
  const videoError = target.trim() === '' ? 'Enter how many videos.' : !Number.isInteger(videos) || videos < 1 ? 'Use a whole number of at least 1.' : videos > MAX_VIDEOS ? `That's a lot. Split it into tasks of ${MAX_VIDEOS} or fewer.` : '';
  const formatError = chosenFormats.length === 0 ? 'Pick at least one format.' : '';
  const canAssign = !dueError && !videoError && !formatError;

  const submit = () => {
    if (!canAssign) return;
    const t = assignTask(pkgId, { editor, due: dueLabel(due), priority, target: videos, formats: chosenFormats, note: note.trim(), from: user.id });
    onDone({ task: t, product: `${pkg.product} · ${pkgTitle}`, editor: person(editor) });
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="stack" style={{ gap: 6, paddingRight: 48 }}>
        <span className="row" style={{ gap: 10, fontSize: 12 }}>
          <span className="faint">Assign · step 2 of 2</span>
          {onBack && <button type="button" onClick={onBack} style={{ border: 0, background: 'none', padding: 0, color: 'var(--lime)', font: 'inherit', fontSize: 12, cursor: 'pointer' }}>← Change product</button>}
        </span>
        <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{pkg.product} <span className="faint" style={{ fontWeight: 400 }}>· {pkgTitle}</span></h2>
        <span className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{pkg.summary}</span>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Editor</span>
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))', gap: 8 }}>
          {EDITORS.map((e) => {
            const n = load(e.id);
            const on = e.id === editor;
            return (
              <button key={e.id} type="button" className={'pick' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setEditor(e.id)} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 }}>
                <Avatar user={e} size={30} />
                <span className="stack" style={{ gap: 2, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{e.name}</span>
                  <span className="faint" style={{ fontSize: 12 }}>{n} open{e.id === lightest.id ? ' · lightest' : ''}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 16 }}>
        <div className="stack" style={{ gap: 8 }}>
          <label htmlFor="as-due" style={{ fontSize: 13, fontWeight: 600 }}>Due</label>
          <DatePicker id="as-due" value={due} onChange={setDue} min={today} max={latest} invalid={!!dueError} describedBy="as-due-msg" />
          <div className="row wrap" style={{ gap: 6 }}>{quickDues.map(([l, d]) => <button key={l} type="button" className={'chip' + (due === d ? ' on' : '')} style={{ minHeight: 32, fontSize: 12 }} onClick={() => setDue(d)}>{l}</button>)}</div>
          {dueError && <span id="as-due-msg" style={{ fontSize: 12, color: '#FCA5A5' }}>{dueError}</span>}
        </div>
        <div className="stack" style={{ gap: 16 }}>
          <div className="stack" style={{ gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Priority</span>
            <div className="segs" role="group" aria-label="Priority" style={{ padding: 3 }}>{Object.keys(PRIORITY).map((k) => <button key={k} type="button" className={'seg' + (priority === k ? ' on' : '')} style={{ minHeight: 34, fontSize: 12 }} onClick={() => setPriority(k)}>{PRIORITY[k].label}</button>)}</div>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <label htmlFor="as-videos" style={{ fontSize: 13, fontWeight: 600 }}>How many videos?</label>
            <NumberField id="as-videos" value={target} onChange={setTarget} min={1} max={MAX_VIDEOS} invalid={!!videoError} describedBy="as-videos-msg" style={{ maxWidth: 200 }} />
            {videoError && <span id="as-videos-msg" style={{ fontSize: 12, color: '#FCA5A5' }}>{videoError}</span>}
          </div>
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Suggested formats <span className="faint" style={{ fontWeight: 400 }}>· the editor can still change these</span></span>
        <div className="row wrap" style={{ gap: 6 }}>
          {FORMATS.map((f) => <button key={f.id} type="button" className={'chip' + (chosenFormats.includes(f.id) ? ' on' : '')} style={{ minHeight: 34, fontSize: 12 }} aria-pressed={chosenFormats.includes(f.id)} onClick={() => toggleFormat(f.id)}>{f.name}</button>)}
          {customs.map((c) => <button key={c} type="button" className={'chip anim-fade' + (chosenFormats.includes(c) ? ' on' : '')} style={{ minHeight: 34, fontSize: 12 }} aria-pressed={chosenFormats.includes(c)} onClick={() => toggleFormat(c)}>{c}</button>)}
          {otherOpen ? (
            <span className="row anim-fade" style={{ gap: 6 }}>
              <input className="in" autoFocus value={otherText} maxLength={40} onChange={(e) => setOtherText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addOther(); if (e.key === 'Escape') { e.stopPropagation(); setOtherOpen(false); setOtherText(''); } }} placeholder="e.g. Podcast clip" aria-label="Other format" style={{ minHeight: 34, width: 180, borderRadius: 999, fontSize: 12, padding: '6px 12px' }} />
              <button type="button" className={'btn sm ' + (otherText.trim() ? 'primary' : 'off')} style={{ minHeight: 34 }} onClick={addOther}>Add</button>
            </span>
          ) : (
            <button type="button" className="chip" style={{ minHeight: 34, fontSize: 12, borderStyle: 'dashed', color: 'var(--lime-hover)' }} onClick={() => setOtherOpen(true)}>+ Other</button>
          )}
        </div>
        {formatError && <span style={{ fontSize: 12, color: '#FCA5A5' }}>{formatError}</span>}
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <label htmlFor="as-note" style={{ fontSize: 13, fontWeight: 600 }}>Note for the editor <span className="faint" style={{ fontWeight: 400 }}>· optional</span></label>
        <textarea id="as-note" className="in" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Lead with the occasion angle. Client hates the word cheap." style={{ minHeight: 76, fontSize: 14 }} />
      </div>

      <div className="row wrap between" style={{ gap: 12 }}>
        <span className="faint" style={{ fontSize: 13 }}>{canAssign ? `${person(editor).name} gets the research, your note and ${videos} video${videos === 1 ? '' : 's'} by ${dueLabel(due)}.` : 'Fix the highlighted fields to assign.'}</span>
        <button type="button" className={'btn ' + (canAssign ? 'primary' : 'off')} disabled={!canAssign} onClick={submit} style={{ minHeight: 48 }}><Icon.handoff />Assign to {person(editor).name}</button>
      </div>
    </div>
  );
}
