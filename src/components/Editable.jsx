import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons.jsx';

// Click-to-edit text. Enter (or leaving the field) saves, Escape cancels. Multiline uses Ctrl/⌘+Enter to save.
export function EditText({ value, onChange, multiline = false, placeholder = 'Click to add', disabled = false, label, style, inputStyle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select(); } }, [editing]);
  const save = () => { setEditing(false); if (draft.trim() !== value) onChange(draft.trim()); };
  const cancel = () => { setEditing(false); setDraft(value); };
  const onKey = (e) => {
    if (e.key === 'Escape') cancel();
    if (e.key === 'Enter' && (!multiline || e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
  };

  if (editing) {
    const common = { ref, className: 'in', value: draft, onChange: (e) => setDraft(e.target.value), onBlur: save, onKeyDown: onKey, 'aria-label': label, placeholder };
    return multiline
      ? <textarea {...common} style={{ minHeight: 84, fontSize: 'inherit', ...inputStyle }} />
      : <input {...common} style={{ minHeight: 40, fontSize: 'inherit', ...inputStyle }} />;
  }
  return (
    <button type="button" className={'editable' + (disabled ? ' locked' : '')} disabled={disabled} onClick={() => { setDraft(value); setEditing(true); }} aria-label={label ? `Edit ${label}` : undefined} title={disabled ? 'Unlock the brand kit to edit' : 'Click to edit'} style={style}>
      <span style={{ flex: 1, minWidth: 0 }}>{value || <span className="faint">{placeholder}</span>}</span>
      {!disabled && <Icon.pencil className="ed-pen" />}
    </button>
  );
}

// A list of tags you can remove (×) and add to. `tagClass` styles the tag (e.g. "tag no").
// With `onToggle`, clicking a tag turns it on/off (for voice tags); `isOn` says which are on.
export function TagList({ items, onChange, tagClass = 'tag', addLabel = 'Add', placeholder = 'Type and press Enter', disabled = false, onToggle, isOn }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const add = () => {
    const t = draft.trim();
    if (t && !items.some((x) => x.toLowerCase() === t.toLowerCase())) onChange([...items, t]);
    setDraft(''); setAdding(false);
  };
  return (
    <div className="row wrap" style={{ gap: 8 }}>
      {items.map((t) => (
        <span key={t} className={tagClass + (isOn && isOn(t) ? ' on' : '') + ' anim-fade'} style={{ paddingRight: disabled ? 12 : 4, gap: 4 }}>
          {onToggle && !disabled
            ? <button type="button" className="tag-text" aria-pressed={isOn(t)} onClick={() => onToggle(t)} title="Click to turn on or off">{t}</button>
            : <span>{t}</span>}
          {!disabled && <button type="button" className="tag-x" aria-label={`Remove ${t}`} onClick={() => onChange(items.filter((x) => x !== t))}><Icon.x size={12} /></button>}
        </span>
      ))}
      {!disabled && (adding ? (
        <span className="row anim-fade" style={{ gap: 6 }}>
          <input className="in" autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={add} onKeyDown={(e) => { if (e.key === 'Enter') add(); if (e.key === 'Escape') { setDraft(''); setAdding(false); } }} placeholder={placeholder} aria-label={addLabel} style={{ minHeight: 32, width: 190, borderRadius: 999, fontSize: 13, padding: '4px 12px' }} />
        </span>
      ) : (
        <button type="button" className="tag" style={{ borderStyle: 'dashed', background: 'transparent', color: 'var(--lime-hover)', cursor: 'pointer' }} onClick={() => setAdding(true)}><Icon.plus size={13} />{addLabel}</button>
      ))}
    </div>
  );
}
