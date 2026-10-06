import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icons.jsx';

// Floating card in the middle of the screen. Closes on Escape, the × button or a click on the backdrop.
export default function Modal({ open, onClose, label, width = 720, children }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current && closeRef.current.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="modal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal card" role="dialog" aria-modal="true" aria-label={label} style={{ width: `min(${width}px, 100%)` }}>
        <button ref={closeRef} type="button" className="icon-btn modal-x" aria-label="Close" onClick={onClose}><Icon.x /></button>
        {children}
      </div>
    </div>,
    document.body
  );
}
