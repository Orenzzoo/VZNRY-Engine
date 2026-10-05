import { useState } from 'react';
import { Icon } from './Icons.jsx';

const SEV = {
  minor: { label: 'Minor', dot: '#FACC15' },
  annoying: { label: 'Annoying', dot: '#FB923C' },
  blocking: { label: 'Blocking', dot: '#EF4444' }
};

// Sidebar "Report a bug" panel. Posting to Slack is mocked; wire `send` to a Slack webhook or bot in the real build.
export default function BugReport({ screen = 'this screen', channel = '#engine-bugs' }) {
  const [mode, setMode] = useState('closed');
  const [text, setText] = useState('');
  const [sev, setSev] = useState('annoying');
  const [shot, setShot] = useState(true);
  const empty = text.trim().length === 0;
  const reset = () => { setMode('closed'); setText(''); setSev('annoying'); setShot(true); };

  if (mode === 'closed') {
    return (
      <button type="button" onClick={() => setMode('editing')} className="row" style={{ gap: 10, width: '100%', minHeight: 44, padding: '0 10px', borderRadius: 10, border: '1px dashed #3A3A42', background: 'transparent', color: '#C4C4CC', fontSize: 14, cursor: 'pointer', textAlign: 'left' }}>
        <Icon.bug style={{ color: '#FCA5A5' }} />
        <span style={{ flex: 1 }}>Report a bug</span>
        <span className="faint" style={{ fontSize: 11 }}>to Slack</span>
      </button>
    );
  }

  if (mode === 'sent') {
    return (
      <div className="stack" style={{ gap: 12, padding: 14, borderRadius: 12, background: '#131317', border: '1px solid rgba(198,244,50,0.35)' }}>
        <span className="row" style={{ gap: 8, fontSize: 14, fontWeight: 600, color: 'var(--lime-hover)' }}><Icon.check />Posted to {channel}</span>
        <div className="row" style={{ gap: 10, alignItems: 'flex-start', padding: 10, borderRadius: 10, background: '#0B0B0E', border: '1px solid var(--line)' }}>
          <img src="/vznry-logo.png" alt="" width="28" height="28" style={{ borderRadius: 7, border: '1px solid var(--line-3)', flex: 'none' }} />
          <div className="stack" style={{ gap: 4, fontSize: 12, lineHeight: 1.45, minWidth: 0 }}>
            <span><b>VZNRY Engine</b> <span className="faint">just now</span></span>
            <span className="row" style={{ gap: 6, fontWeight: 600 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: SEV[sev].dot }} />{SEV[sev].label} bug on {screen}</span>
            <span style={{ color: '#D4D4D8', wordBreak: 'break-word' }}>"{text}"</span>
            <span className="faint">Reported by you{shot ? ' · screenshot attached' : ''}</span>
          </div>
        </div>
        <span className="muted" style={{ fontSize: 12, lineHeight: 1.45 }}>The team will reply in the thread. You'll get a notification here when it's fixed.</span>
        <div className="row" style={{ gap: 6 }}>
          <button type="button" className="btn sm" style={{ flex: 1 }}>Open in Slack</button>
          <button type="button" className="btn sm" style={{ flex: 1, background: 'transparent' }} onClick={reset}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stack" style={{ gap: 12, padding: 14, borderRadius: 12, background: '#131317', border: '1px solid var(--line-3)' }}>
      <div className="row between">
        <span style={{ fontSize: 14, fontWeight: 600 }}>Report a bug</span>
        <button type="button" onClick={() => setMode('closed')} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 8, border: 0, background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}><Icon.x /></button>
      </div>
      <span className="row muted" style={{ gap: 6, fontSize: 12 }}><Icon.hash />Goes to <b style={{ color: 'var(--text)', fontWeight: 500 }}>{channel}</b> in Slack</span>
      <label htmlFor="bug-what" style={{ fontSize: 12, fontWeight: 600 }}>What went wrong?</label>
      <textarea id="bug-what" className="in" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Analyze got stuck on step 3" style={{ minHeight: 76, fontSize: 13 }} />
      <div className="stack" style={{ gap: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>How bad is it?</span>
        <div className="segs" role="group" aria-label="Severity" style={{ padding: 3 }}>
          {Object.keys(SEV).map((k) => (
            <button key={k} type="button" className={'seg' + (k === sev ? ' on' : '')} aria-pressed={k === sev} onClick={() => setSev(k)}
              style={{ minHeight: 34, fontSize: 12, ...(k === sev && k === 'blocking' ? { background: '#EF4444', color: '#fff' } : {}) }}>{SEV[k].label}</button>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => setShot(!shot)} aria-pressed={shot} className="row" style={{ gap: 10, minHeight: 40, border: 0, background: 'transparent', color: '#D4D4D8', fontSize: 12, cursor: 'pointer', textAlign: 'left', padding: 0 }}>
        <span className={'switch' + (shot ? ' on' : '')} />Attach a screenshot of this screen
      </button>
      <span className="faint" style={{ fontSize: 11, lineHeight: 1.45 }}>Also sent automatically: the screen ({screen}), the product and batch, and your browser.</span>
      <button type="button" className={'btn' + (empty ? ' off' : ' primary')} onClick={() => !empty && setMode('sent')}><Icon.send size={15} />Send to {channel}</button>
      {empty && <span className="faint" style={{ fontSize: 11, textAlign: 'center' }}>Add a short description first.</span>}
    </div>
  );
}
