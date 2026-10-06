import { Link } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { formatLabel } from '../data/formats.js';
import { RESEARCH, STATUS, PRIORITY, useWork, setTaskStatus, statusLabel } from '../data/work.js';
import { Avatar, person, useCurrentUser } from '../data/team.jsx';

// The main button on a task card depends on who is looking.
// Editors: start / continue / fix in Generate, wait for review, or send to the client.
// Researchers: review the ads when it's waiting for them; otherwise nothing to do here.
function TaskActions({ task }) {
  const user = useCurrentUser();
  const { reviews } = useWork();
  const from = person(task.from);
  const editor = person(task.editor);
  const pending = reviews.find((r) => r.task === task.id && r.status === 'waiting');
  if (user.role === 'researcher') {
    if (task.status === 'review' && pending) return <Link className="btn primary" to={`/product/review?submission=${pending.id}`} style={{ flex: 1 }}>Review {pending.ads.length} ad{pending.ads.length === 1 ? '' : 's'} from {editor.name} <Icon.arrow /></Link>;
    if (task.status === 'client') return <Link className="btn primary" to="/client-reviews" style={{ flex: 1 }}>See client review <Icon.arrow /></Link>;
    const note = { todo: `${editor.name} hasn't started yet.`, doing: `${editor.name} is generating.`, fixes: `${editor.name} is fixing the client's changes.`, approved: `You approved it. ${editor.name} is sending it to the client.`, done: 'Approved by the client.' }[task.status] || '';
    return <span className="btn off" style={{ flex: 1, cursor: 'default' }}>{note}</span>;
  }
  if (task.status === 'client') return <Link className="btn primary" to="/client-reviews" style={{ flex: 1 }}>See client review <Icon.arrow /></Link>;
  if (task.status === 'review') return <span className="btn off" style={{ flex: 1 }}>Waiting for {from.name}'s review</span>;
  if (task.status === 'approved') return <Link className="btn primary" to="/product/deliver" style={{ flex: 1 }}><Icon.send size={16} />{from.name} approved {task.kept || ''} ads · send to client</Link>;
  const cta = task.status === 'todo' ? 'Start generating' : task.status === 'fixes' ? 'Fix the changes' : 'Continue generating';
  return <Link className="btn primary" to={`/generate?task=${task.id}`} style={{ flex: 1 }} onClick={() => task.status === 'todo' && setTaskStatus(task.id, 'doing')}><Icon.sparkle />{cta}</Link>;
}

// Everything about one task: status, the researcher's note, the research package, and the next action.
// Shown in a floating card on My tasks (editor) and on the Editors page (researcher).
export default function TaskDetail({ task }) {
  const user = useCurrentUser();
  const r = RESEARCH[task.research];
  const from = person(task.from);
  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="stack" style={{ gap: 8, paddingRight: 48 }}>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className={'pill ' + STATUS[task.status].cls}>{statusLabel(task.status, user.role)}</span>
          <span className={'pill ' + PRIORITY[task.priority].cls}>{PRIORITY[task.priority].label} priority</span>
          <span className="pill">{r.kind}</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{r.product} <span className="faint" style={{ fontWeight: 400 }}>· {task.title}</span></h2>
        <span className="faint" style={{ fontSize: 13 }}>{r.brand} · {task.target} videos · due <b style={{ color: 'var(--text)', fontWeight: 500 }}>{task.due}</b></span>
      </div>

      {task.note && (
        <div className="sub row" style={{ padding: 14, gap: 12, alignItems: 'flex-start' }}>
          <Avatar user={from} size={28} />
          <span className="stack" style={{ gap: 4 }}>
            <span style={{ fontSize: 12 }}><b>{from.id === user.id ? 'You' : from.name}</b> <span className="faint">· assigned {task.assigned}{from.id === user.id ? ` to ${person(task.editor).name}` : ''}</span></span>
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>{task.note}</span>
          </span>
        </div>
      )}

      <div className="stack" style={{ gap: 6 }}>
        <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>The product</span>
        <span style={{ fontSize: 14, lineHeight: 1.5 }}>{r.summary}</span>
        <span className="faint" style={{ fontSize: 12 }}>{r.price} · {r.offer} · {r.url}</span>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>Who's buying</span>
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 8 }}>
        {r.personas.map((p) => (
          <div key={p.name} className="sub stack" style={{ padding: 12, gap: 6 }}>
            <div className="row between" style={{ gap: 8 }}><span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span><span className="mono faint" style={{ fontSize: 12 }}>{p.share}%</span></div>
            <span style={{ fontSize: 13, lineHeight: 1.45 }}><span className="faint">Wants </span>{p.wants} <span className="faint">Worries </span>{p.worries}</span>
          </div>
        ))}
        </div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>Pinned hooks · in buyers' words</span>
        {r.hooks.map((x) => <span key={x} className="row" style={{ gap: 8, fontSize: 14, lineHeight: 1.45, alignItems: 'flex-start' }}><Icon.pin style={{ flex: 'none', marginTop: 3, color: 'var(--lime)' }} />"{x}"</span>)}
      </div>

      <div className="grid-auto" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="sub stack" style={{ padding: 12, gap: 4 }}><span className="faint" style={{ fontSize: 12 }}>Must say</span><span style={{ fontSize: 13, lineHeight: 1.45 }}>{r.mustSay}</span></div>
        <div className="sub stack" style={{ padding: 12, gap: 4 }}><span className="faint" style={{ fontSize: 12 }}>Avoid</span><span style={{ fontSize: 13, lineHeight: 1.45 }}>{r.avoid}</span></div>
      </div>

      <div className="stack" style={{ gap: 8 }}>
        <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>Suggested formats</span>
        <div className="row wrap" style={{ gap: 6 }}>{task.formats.map((f) => <span key={f} className="pill lime">{formatLabel(f)}</span>)}</div>
      </div>

      <div className="row wrap" style={{ gap: 8 }}>
        <TaskActions task={task} />
        <Link className="btn" to="/buyers">Full research</Link>
      </div>
    </div>
  );
}
