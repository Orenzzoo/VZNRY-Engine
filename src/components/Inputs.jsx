import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons.jsx';

const pad = (n) => String(n).padStart(2, '0');
export const toIso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromIso = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
const DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Date picker in the app's style. `min` / `max` are ISO dates (YYYY-MM-DD); days outside them can't be picked.
export function DatePicker({ id, value, onChange, min, max, invalid, describedBy }) {
  const [open, setOpen] = useState(false);
  const sel = value ? fromIso(value) : null;
  const [view, setView] = useState(() => { const d = sel || new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const ref = useRef(null);
  const today = toIso(new Date());

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);
  useEffect(() => { if (open && sel) setView(new Date(sel.getFullYear(), sel.getMonth(), 1)); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Monday-first grid with leading/trailing days from the neighbouring months.
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const days = Array.from({ length: 42 }, (_, i) => new Date(view.getFullYear(), view.getMonth(), 1 - lead + i));
  const weeks = days[35].getMonth() !== view.getMonth() ? days.slice(0, 35) : days;
  const minMonth = min ? fromIso(min) : null;
  const maxMonth = max ? fromIso(max) : null;
  const canPrev = !minMonth || new Date(view.getFullYear(), view.getMonth() - 1 + 1, 0) >= new Date(minMonth.getFullYear(), minMonth.getMonth(), 1);
  const canNext = !maxMonth || new Date(view.getFullYear(), view.getMonth() + 1, 1) <= maxMonth;
  const off = (iso) => (min && iso < min) || (max && iso > max);
  const pick = (iso) => { onChange(iso); setOpen(false); };

  return (
    <div className="menu-wrap" ref={ref}>
      <button id={id} type="button" className={'in date-btn' + (invalid ? ' bad' : '')} aria-haspopup="dialog" aria-expanded={open} aria-describedby={describedBy} onClick={() => setOpen(!open)}>
        <Icon.calendar style={{ color: 'var(--faint)' }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{sel ? sel.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : <span className="faint">Pick a date</span>}</span>
        <Icon.chevron className="chev" style={{ color: 'var(--faint)' }} />
      </button>
      {open && (
        <div className="menu cal" role="dialog" aria-label="Choose a due date">
          <div className="row between" style={{ padding: '4px 4px 10px' }}>
            <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} disabled={!canPrev} aria-label="Previous month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}><Icon.chevron style={{ transform: 'rotate(90deg)' }} /></button>
            <span key={view.getMonth()} className="anim-fade" style={{ fontWeight: 600, fontSize: 14 }}>{view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
            <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} disabled={!canNext} aria-label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}><Icon.chevron style={{ transform: 'rotate(-90deg)' }} /></button>
          </div>
          <div className="cal-grid">
            {DOW.map((d) => <span key={d} className="cal-dow">{d}</span>)}
            {weeks.map((d) => {
              const iso = toIso(d);
              const disabled = off(iso);
              const other = d.getMonth() !== view.getMonth();
              const cls = 'cal-day' + (iso === value ? ' sel' : '') + (iso === today ? ' today' : '') + (other ? ' other' : '');
              return <button key={iso} type="button" className={cls} disabled={disabled} aria-pressed={iso === value} aria-label={d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} onClick={() => pick(iso)}>{d.getDate()}</button>;
            })}
          </div>
          <div className="row between" style={{ padding: '10px 4px 2px', borderTop: '1px solid var(--line)', marginTop: 8 }}>
            <span className="faint" style={{ fontSize: 12 }}>Past dates can't be picked</span>
            <button type="button" className="mini" onClick={() => pick(today)} disabled={off(today)}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Whole-number field with − / + buttons instead of the browser's spinner arrows.
export function NumberField({ id, value, onChange, min = 1, max = 999, invalid, describedBy, style }) {
  const n = parseInt(value, 10);
  const step = (d) => onChange(String(Math.max(min, Math.min(max, (Number.isNaN(n) ? min : n) + d))));
  return (
    <div className={'field num-field' + (invalid ? ' bad' : '')} style={style}>
      <button type="button" className="num-btn" aria-label="One fewer" disabled={!Number.isNaN(n) && n <= min} onClick={() => step(-1)}><Icon.minus /></button>
      <input id={id} inputMode="numeric" pattern="[0-9]*" value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))} aria-invalid={invalid} aria-describedby={describedBy}
        onKeyDown={(e) => { if (e.key === 'ArrowUp') { e.preventDefault(); step(1); } if (e.key === 'ArrowDown') { e.preventDefault(); step(-1); } }}
        className="mono" style={{ textAlign: 'center' }} />
      <button type="button" className="num-btn" aria-label="One more" disabled={!Number.isNaN(n) && n >= max} onClick={() => step(1)}><Icon.plus /></button>
    </div>
  );
}
