import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';
import Modal from '../components/Modal.jsx';
import HandOffForm from './HandOffForm.jsx';
import TaskDetail from './TaskDetail.jsx';
import { RESEARCH, STATUS, PRIORITY, useWork, openTasks, reviewSubject, statusLabel } from '../data/work.js';
import { EDITORS, Avatar, person, switchUser } from '../data/team.jsx';

const FILTERS = [['open', 'Open'], ['todo', 'To do'], ['doing', 'In progress'], ['review', 'For review'], ['approved', 'Ready to send'], ['fixes', 'Changes requested'], ['client', 'With client'], ['all', 'All']];
const ORDER = { fixes: 0, approved: 1, todo: 2, doing: 3, review: 4, client: 5, done: 6 };
const COLS = 'minmax(0, 2fr) 150px 160px 110px';

// Researcher's view of the editing team: who's working on what, and handing new products to them.
export default function Editors() {
  const { ready, tasks, reviews } = useWork();
  const toReview = reviews.filter((r) => r.status === 'waiting');
  const reviewed = reviews.filter((r) => r.status === 'done');
  const [params, setParams] = useSearchParams();
  const [who, setWho] = useState('all');
  const [filter, setFilter] = useState('open');
  const [done, setDone] = useState(null);
  // Assigning is a two-step floating card: 1) pick a researched product, 2) pick the editor and details.
  // ?handoff= (empty) opens step 1; ?handoff=<research id> jumps to step 2 (links from Research and the home page use it).
  const handoff = params.get('handoff');
  const handoffOpen = handoff !== null;
  const handoffId = handoff && ready.some((p) => p.id === handoff) ? handoff : null;
  const pickProduct = (id) => setParams({ handoff: id }, { replace: true });
  const openHandoff = () => setParams({ handoff: '' }, { replace: true });
  const closeHandoff = () => setParams({}, { replace: true });
  // ?task=<id> opens that task's card on top of this page.
  const openTask = tasks.find((t) => t.id === params.get('task'));
  const showTask = (id) => setParams({ task: id }, { replace: true });

  const maxLoad = Math.max(1, ...EDITORS.map((e) => openTasks(tasks, e.id).length));
  const isOpen = (t) => t.status !== 'client' && t.status !== 'done';
  const shown = tasks
    .filter((t) => (who === 'all' || t.editor === who) && (filter === 'all' || (filter === 'open' ? isOpen(t) : t.status === filter)))
    .sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  return (
    <Layout section="Editors" crumbs={['Visionary Studios', 'Editors']} screen="Editors">
      <PageHead
        title="Editors"
        lede="Who's working on what, and how busy everyone is. Assign a researched product to an editor when someone has room."
        right={<button type="button" className="btn primary" onClick={openHandoff}><Icon.handoff size={16} />Assign to an editor{ready.length > 0 && <span className="pill mono" style={{ minHeight: 20, padding: '0 7px', background: 'rgba(11,11,15,0.15)', borderColor: 'transparent', color: '#0B0B0F' }}>{ready.length}</span>}</button>}
      />

      {done && (
        <div className="notice row wrap between anim-in" style={{ gap: 12 }}>
          <span className="row" style={{ gap: 10 }}><Icon.check />Assigned <b>{done.product}</b> to {done.editor.name}. It's in their "My tasks" now.</span>
          <span className="row" style={{ gap: 8 }}>
            <button type="button" className="btn sm" onClick={() => switchUser(done.editor.id)}>See it as {done.editor.name}</button>
            <button type="button" className="icon-btn" aria-label="Dismiss" onClick={() => setDone(null)}><Icon.x /></button>
          </span>
        </div>
      )}

      <section className="card" style={{ overflow: 'hidden', borderColor: toReview.length ? 'rgba(198,244,50,0.3)' : undefined }}>
        <div className="row wrap between" style={{ padding: '16px 20px', gap: 10 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="h2">Review videos {toReview.length > 0 && <span className="pill lime mono" style={{ marginLeft: 6 }}>{toReview.length}</span>}</h2>
            <span className="muted" style={{ fontSize: 13 }}>Stitched ads editors sent you. Keep or skip each one; kept ads go back to the editor to send to the client.</span>
          </div>
        </div>
        <div className="stagger">
          {toReview.map((r) => {
            const sj = reviewSubject(r, tasks);
            const e = person(r.editor);
            return (
              <div key={r.id} className="list-row" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto', cursor: 'default' }}>
                <span className="row" style={{ gap: 12, minWidth: 0 }}>
                  <span className="row" style={{ gap: 3, flex: 'none' }}>{r.ads.slice(0, 3).map((a, k) => <span key={k} style={{ width: 18, height: 32, borderRadius: 4, background: a.bg, border: '1px solid var(--line-3)' }} />)}</span>
                  <span className="stack" style={{ gap: 3, minWidth: 0 }}>
                    <span className="row wrap" style={{ gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: sj.dot }} /><span style={{ fontWeight: 600 }}>{sj.title}</span>{r.fresh && <span className="pill lime" style={{ fontSize: 11, minHeight: 20 }}>New</span>}</span>
                    <span className="row wrap faint" style={{ gap: 8, fontSize: 12 }}><Avatar user={e} size={18} />{e.name} · {r.ads.length} ad{r.ads.length === 1 ? '' : 's'} · sent {r.sent}{sj.client ? ` · ${sj.client}` : ''}</span>
                  </span>
                </span>
                <Link className="btn sm primary" to={`/product/review?submission=${r.id}`}>Review {r.ads.length} ad{r.ads.length === 1 ? '' : 's'} <Icon.arrow size={14} /></Link>
              </div>
            );
          })}
          {toReview.length === 0 && <div className="faint" style={{ padding: '14px 20px', fontSize: 13, borderTop: '1px solid var(--line)' }}>Nothing to review right now.</div>}
          {reviewed.slice(0, 3).map((r) => (
            <div key={r.id} className="row wrap between faint" style={{ gap: 10, padding: '10px 20px', borderTop: '1px solid var(--line)', fontSize: 13 }}>
              <span className="row" style={{ gap: 8 }}><Icon.check size={14} style={{ color: 'var(--green)' }} />{reviewSubject(r, tasks).title} · {person(r.editor).name}</span>
              <span className="mono" style={{ fontSize: 12 }}>{r.kept} kept · {r.skipped} skipped</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card stack" style={{ padding: 20, gap: 14 }}>
        <div className="row between"><h2 className="h2">Team workload</h2><span className="faint" style={{ fontSize: 13 }}>Open tasks per editor · click one to see their tasks</span></div>
        <div className="stack stagger" style={{ gap: 4 }}>
          {EDITORS.map((e) => {
            const open = openTasks(tasks, e.id);
            const on = who === e.id;
            return (
              <button key={e.id} type="button" className={'load-row' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setWho(on ? 'all' : e.id)}>
                <span className="row" style={{ gap: 10, width: 120, flex: 'none' }}><Avatar user={e} size={28} /><span style={{ fontWeight: 500 }}>{e.name}</span></span>
                <div className="progress" style={{ flex: '1 1 160px', height: 8 }}><span className="grow-x" style={{ width: `${(open.length / maxLoad) * 100}%` }} /></div>
                <span className="mono faint" style={{ width: 64, fontSize: 12, flex: 'none' }}>{open.length} open</span>
                <span className="faint load-names" style={{ flex: '1 1 220px', fontSize: 12, minWidth: 0 }}>{open.map((t) => RESEARCH[t.research].product).join(', ') || 'Free for new work'}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card" style={{ flex: '1 1 100%', minWidth: 0, overflow: 'hidden' }}>
          <div className="row wrap between" style={{ padding: '16px 20px', gap: 12 }}>
            <h2 className="h2">{who === 'all' ? 'Current tasks' : `${person(who).name}'s tasks`}</h2>
            <div className="row wrap" style={{ gap: 6 }}>
              {who !== 'all' && <button type="button" className="mini" onClick={() => setWho('all')}>Show everyone</button>}
              {FILTERS.map(([k, l]) => <button key={k} type="button" className={'chip' + (filter === k ? ' on' : '')} style={{ minHeight: 32, fontSize: 12, padding: '0 12px' }} onClick={() => setFilter(k)}>{l}</button>)}
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 640 }}>
              <div className="th" style={{ gridTemplateColumns: COLS }}><span>Task</span><span>Editor</span><span>Status</span><span>Due</span></div>
              <div key={who + filter} className="stagger">
                {shown.map((t) => {
                  const tr = RESEARCH[t.research];
                  const e = person(t.editor);
                  return (
                    <button key={t.id} type="button" onClick={() => showTask(t.id)} aria-haspopup="dialog" className="list-row" style={{ gridTemplateColumns: COLS }}>
                      <span className="stack" style={{ gap: 3, minWidth: 0 }}>
                        <span className="row wrap" style={{ gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 3, background: tr.dot, flex: 'none' }} /><span style={{ fontWeight: 500 }}>{tr.product}</span><span className="faint" style={{ fontSize: 13 }}>· {t.title}</span>{t.fresh && <span className="pill lime" style={{ fontSize: 11, minHeight: 20 }}>Just assigned</span>}</span>
                        <span className="faint" style={{ fontSize: 12 }}>{tr.brand} · {t.target} videos{t.priority !== 'normal' ? ` · ${PRIORITY[t.priority].label} priority` : ''}</span>
                      </span>
                      <span className="row" style={{ gap: 8 }}><Avatar user={e} size={22} />{e.name}</span>
                      <span><span className={'pill ' + STATUS[t.status].cls}>{statusLabel(t.status, 'researcher')}</span></span>
                      <span className="mono faint" style={{ fontSize: 12 }}>{t.due}</span>
                    </button>
                  );
                })}
                {shown.length === 0 && <div className="faint" style={{ padding: '16px 20px', fontSize: 13, borderTop: '1px solid var(--line)' }}>No tasks here.</div>}
              </div>
            </div>
          </div>
        </section>

      </div>

      <Modal open={!!openTask} onClose={closeHandoff} label={openTask ? `${RESEARCH[openTask.research].product} · ${openTask.title}` : ''} width={760}>
        {openTask && <TaskDetail task={openTask} />}
      </Modal>

      <Modal open={handoffOpen} onClose={closeHandoff} label="Assign to an editor" width={760}>
        {handoffId ? (
          <div key={handoffId} className="anim-in">
            <HandOffForm pkgId={handoffId} editorId={who !== 'all' ? who : undefined} onBack={openHandoff} onDone={(d) => { setDone(d); closeHandoff(); }} />
          </div>
        ) : (
          <div key="pick" className="stack anim-in" style={{ gap: 16 }}>
            <div className="stack" style={{ gap: 6, paddingRight: 48 }}>
              <span className="faint" style={{ fontSize: 12 }}>Assign · step 1 of 2</span>
              <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>Which product?</h2>
              <span className="muted" style={{ fontSize: 14 }}>These are researched and ready to be assigned. Pick one, then choose the editor.</span>
            </div>
            {ready.length === 0 ? (
              <div className="sub stack" style={{ padding: 18, gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 600 }}>Nothing is waiting</span>
                <span className="muted" style={{ fontSize: 13 }}>Everything researched is already assigned. Research a new product first.</span>
                <Link className="btn sm primary" to="/product/new"><Icon.plus />Add product</Link>
              </div>
            ) : (
              <div className="stack stagger" style={{ gap: 8 }}>
                {ready.map((p) => {
                  const rp = RESEARCH[p.id];
                  return (
                    <button key={p.id} type="button" className="pick" onClick={() => pickProduct(p.id)} style={{ flexDirection: 'row', alignItems: 'center', padding: '14px 16px', gap: 14 }}>
                      <span style={{ flex: 'none', width: 36, height: 36, borderRadius: 10, background: rp.dot }} />
                      <span className="stack" style={{ gap: 3, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{rp.product} <span className="faint" style={{ fontWeight: 400 }}>· {p.title}</span></span>
                        <span className="faint" style={{ fontSize: 12 }}>{rp.brand} · {rp.kind} · {rp.personas.length} buyer type{rp.personas.length === 1 ? '' : 's'} · {rp.hooks.length} pinned hooks · researched {p.finished}</span>
                      </span>
                      <span className="row" style={{ gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--lime)', whiteSpace: 'nowrap' }}>Choose <Icon.arrow size={14} /></span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Layout>
  );
}
