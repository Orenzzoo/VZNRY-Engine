import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';
import Modal from '../components/Modal.jsx';
import TaskDetail from './TaskDetail.jsx';
import { formatLabel } from '../data/formats.js';
import { RESEARCH, STATUS, PRIORITY, useWork, setTaskStatus, statusLabel } from '../data/work.js';
import { Avatar, person, useCurrentUser } from '../data/team.jsx';

const FILTERS = [['open', 'Open'], ['todo', 'To do'], ['doing', 'In progress'], ['review', 'For review'], ['approved', 'Ready to send'], ['fixes', 'Changes requested'], ['client', 'With client'], ['all', 'All']];
const ORDER = { fixes: 0, approved: 1, todo: 2, doing: 3, review: 4, client: 5, done: 6 };

export default function Tasks() {
  const user = useCurrentUser();
  const { tasks } = useWork();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState('open');
  const everyone = user.role !== 'editor';
  const mine = tasks.filter((t) => everyone || t.editor === user.id).sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const shown = mine.filter((t) => filter === 'all' || (filter === 'open' ? t.status !== 'client' && t.status !== 'done' : t.status === filter));
  // The open task shows in a floating card; ?task= keeps it open on reload and from links.
  const sel = mine.find((t) => t.id === params.get('task'));
  const close = () => setParams({}, { replace: true });

  return (
    <Layout section="My tasks" crumbs={['Visionary Studios', everyone ? 'All tasks' : 'My tasks']} brand={{ name: 'All brands', color: 'var(--lime)' }} screen="My tasks">
      <PageHead
        eyebrow="Editor · My tasks"
        title={everyone ? 'Every task, every editor.' : `Your tasks, ${user.name}.`}
        lede="Products the researcher handed to you, with the research already done. Open one to see the context, then generate in one click."
      />

      <div className="row wrap" role="group" aria-label="Filter tasks" style={{ gap: 8 }}>
        {FILTERS.map(([id, l]) => {
          const n = id === 'all' ? mine.length : id === 'open' ? mine.filter((t) => t.status !== 'client' && t.status !== 'done').length : mine.filter((t) => t.status === id).length;
          return <button key={id} type="button" className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{l} <span className="mono" style={{ opacity: 0.6, marginLeft: 4 }}>{n}</span></button>;
        })}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card" style={{ flex: '1 1 100%', minWidth: 0, overflow: 'hidden' }}>
          <div key={filter} className="stagger">
            {shown.map((t, i) => {
              const tr = RESEARCH[t.research];
              return (
                <button key={t.id} type="button" className={'list-row' + (sel && t.id === sel.id ? ' on' : '')} style={{ gridTemplateColumns: 'minmax(0, 1fr) auto', borderTop: i ? undefined : 0 }} onClick={() => setParams({ task: t.id }, { replace: true })} aria-haspopup="dialog">
                  <span className="stack" style={{ gap: 6, minWidth: 0 }}>
                    <span className="row wrap" style={{ gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 3, background: tr.dot }} />
                      <span style={{ fontWeight: 600 }}>{tr.product}</span>
                      <span className="faint" style={{ fontSize: 13 }}>· {t.title}</span>
                      {t.fresh && <span className="pill lime" style={{ fontSize: 11, minHeight: 20 }}>New</span>}
                    </span>
                    <span className="row wrap faint" style={{ gap: 8, fontSize: 12 }}>
                      <span>{tr.brand}</span><span>·</span><span>{t.target} videos</span><span>·</span><span>from {person(t.from).name}</span>
                      {everyone && <><span>·</span><span className="row" style={{ gap: 6 }}><Avatar user={person(t.editor)} size={18} />{person(t.editor).name}</span></>}
                    </span>
                  </span>
                  <span className="stack" style={{ gap: 6, alignItems: 'flex-end' }}>
                    <span className={'pill ' + STATUS[t.status].cls}>{statusLabel(t.status, user.role)}</span>
                    <span className="mono faint" style={{ fontSize: 11 }}>due {t.due}</span>
                  </span>
                </button>
              );
            })}
            {shown.length === 0 && <div className="stack" style={{ padding: 24, gap: 6 }}><span style={{ fontWeight: 600 }}>Nothing here</span><span className="muted" style={{ fontSize: 13 }}>No tasks match this filter.</span></div>}
          </div>
        </section>

        <Modal open={!!sel} onClose={close} label={sel ? `${RESEARCH[sel.research].product} · ${sel.title}` : ''} width={760}>
          {sel && <TaskDetail task={sel} />}
        </Modal>
      </div>
    </Layout>
  );
}
