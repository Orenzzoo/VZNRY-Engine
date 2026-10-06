import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout, { PageHead, BRANDS } from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';
import { ROUNDS, fmtTime } from '../data/reviews.js';
import { RESEARCH, STATUS, useWork, statusLabel } from '../data/work.js';
import { Avatar, person, EDITORS } from '../data/team.jsx';

// Client details that aren't in the other sample data. Replace with the client table from the backend.
const INFO = {
  'Moyou London': { contact: 'Sophie', products: 'Nail strips · 3 products' },
  'Dollar Tree': { contact: 'Mark', products: 'Gift cards · presenter series' },
  HookLife: { contact: 'Kim', products: 'Hook tests for paid ads' },
  'Pillow client': { contact: 'Dan', products: 'Memory-foam pillow · animation' }
};

// Older approved videos, so the list shows what a long-running client looks like. Sample data.
const HISTORY = (() => {
  const titles = ['Salon red at home', 'Five-minute mani', 'Peel test', 'Date-night nails', 'Office-safe red', 'Wedding guest nails', 'Holiday glow', 'The £12 manicure', 'Desk to dinner', 'Gel without the lamp', 'No-chip week', 'Bridesmaid set'];
  const products = ['Red Alert', 'Too Hot To Handle', 'Periwinkle'];
  const tints = ['#3B2A22', '#24252C', '#4A0F18', '#33281F', '#3A1F12', '#1E2638', '#2A1E1A'];
  const eds = ['renz', 'arland', 'jerome'];
  return Array.from({ length: 42 }, (_, i) => ({
    id: 'old' + i, title: `${titles[i % titles.length]}${i >= titles.length ? ' ' + (Math.floor(i / titles.length) + 1) : ''}`,
    product: products[i % 3], bg: tints[i % tints.length], editor: eds[i % 3],
    when: `${28 - (i % 27)} ${i < 20 ? 'Sep' : 'Aug'}`, link: '/library'
  }));
})();

const PAGE = 10;

// Everything made for one client, flattened into simple rows.
function overview(client, tasks) {
  const rounds = ROUNDS.filter((r) => r.client === client);
  const editorOf = (r) => { const t = tasks.find((x) => x.id === r.task); return t ? t.editor : null; };
  const videos = rounds.flatMap((r) => r.videos.map((v) => ({ ...v, id: r.id + v.id, product: r.product, round: r.round, when: r.dates.replace(/^sent /, '').split(' · ')[0], editor: editorOf(r), link: `/product/review?round=${r.id}` })));
  return {
    done: [...videos.filter((v) => v.decision === 'ok'), ...(client === 'Moyou London' ? HISTORY : [])],
    revisions: videos.filter((v) => v.decision === 'no'),
    waiting: videos.filter((v) => !v.decision).length,
    tasks: tasks.filter((t) => RESEARCH[t.research].brand === client && t.status !== 'done').map((t) => ({ ...t, product: RESEARCH[t.research].product }))
  };
}

function Who({ id }) {
  if (!id) return <span className="faint" style={{ fontSize: 12 }}>Unassigned</span>;
  const u = person(id);
  return <span className="row" style={{ gap: 6, fontSize: 12, whiteSpace: 'nowrap' }}><Avatar user={u} size={20} />{u.name}</span>;
}

// The opened client: one list at a time (tabs), with search, filters and "Show more" so it stays short with hundreds of videos.
function ClientPanel({ o }) {
  const [tab, setTab] = useState(o.revisions.length ? 'rev' : o.tasks.length ? 'make' : 'done');
  const [q, setQ] = useState('');
  const [product, setProduct] = useState('all');
  const [editor, setEditor] = useState('all');
  const [limit, setLimit] = useState(PAGE);
  const lists = { rev: o.revisions, make: o.tasks, done: o.done };
  const all = lists[tab];
  const products = [...new Set(all.map((x) => x.product))];
  const query = q.trim().toLowerCase();
  const shown = all.filter((x) => (product === 'all' || x.product === product) && (editor === 'all' || x.editor === editor) && (!query || `${x.title} ${x.product}`.toLowerCase().includes(query)));
  const page = shown.slice(0, limit);
  const switchTab = (t) => { setTab(t); setProduct('all'); setLimit(PAGE); };

  return (
    <div className="anim-in stack" style={{ gap: 14, padding: '4px 20px 20px' }}>
      <div className="row wrap between" style={{ gap: 12 }}>
        <div className="segs" role="tablist" aria-label="Videos" style={{ padding: 3 }}>
          {[['rev', 'Revisions', o.revisions.length], ['make', 'Being made', o.tasks.length], ['done', 'Completed', o.done.length]].map(([k, l, n]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} className={'seg' + (tab === k ? ' on' : '')} style={{ minHeight: 34, fontSize: 13 }} onClick={() => switchTab(k)}>{l} <span className="mono" style={{ opacity: 0.6, marginLeft: 4 }}>{n}</span></button>
          ))}
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          <div className="field" style={{ minHeight: 36, width: 220, borderRadius: 10 }}>
            <Icon.search style={{ color: 'var(--faint)' }} />
            <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder="Search videos" aria-label="Search videos" style={{ minHeight: 34, fontSize: 13 }} />
          </div>
          {products.length > 1 && (
            <select className="in" value={product} onChange={(e) => { setProduct(e.target.value); setLimit(PAGE); }} aria-label="Product" style={{ minHeight: 36, width: 'auto', fontSize: 13, padding: '0 10px' }}>
              <option value="all">All products</option>
              {products.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
          <select className="in" value={editor} onChange={(e) => { setEditor(e.target.value); setLimit(PAGE); }} aria-label="Editor" style={{ minHeight: 36, width: 'auto', fontSize: 13, padding: '0 10px' }}>
            <option value="all">All editors</option>
            {EDITORS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      <div key={tab} className="sub" style={{ overflow: 'hidden' }}>
        {page.length === 0 && <div className="faint" style={{ padding: 16, fontSize: 13 }}>{all.length === 0 ? (tab === 'rev' ? 'Nothing sent back. Nice.' : tab === 'make' ? 'No open tasks.' : 'No approved videos yet.') : 'No videos match.'}</div>}
        {page.map((x, i) => tab === 'make' ? (
          <div key={x.id} className="client-item" style={{ borderTop: i ? undefined : 0 }}>
            <span className="stack" style={{ gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{x.product} <span className="faint" style={{ fontWeight: 400 }}>· {x.title}</span></span>
              <span className="faint" style={{ fontSize: 12 }}>{x.target} videos · due {x.due}</span>
            </span>
            <span className={'pill ' + STATUS[x.status].cls} style={{ fontSize: 11, minHeight: 20 }}>{statusLabel(x.status, 'researcher')}</span>
            <Who id={x.editor} />
          </div>
        ) : (
          <Link key={x.id} to={x.link} className="client-item" style={{ borderTop: i ? undefined : 0 }}>
            <span className="row" style={{ gap: 10, minWidth: 0 }}>
              <span style={{ flex: 'none', width: 20, height: 34, borderRadius: 5, background: x.bg }} />
              <span className="stack" style={{ gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{x.title}</span>
                {tab === 'rev'
                  ? x.comments.filter((m) => !m.us).slice(0, 2).map((m, k) => <span key={k} style={{ fontSize: 12, lineHeight: 1.4, color: '#D4D4D8' }}><span className="mono faint">{fmtTime(m.t)}</span> {m.who}: "{m.text}"</span>)
                  : <span className="faint" style={{ fontSize: 12 }}>{x.product}{x.round ? ` · ${x.round}` : ''}</span>}
              </span>
            </span>
            <span className="mono faint" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{x.when}</span>
            <Who id={x.editor} />
          </Link>
        ))}
      </div>

      {shown.length > PAGE && (
        <div className="row wrap between" style={{ gap: 10 }}>
          <span className="faint" style={{ fontSize: 12 }}>Showing {page.length} of {shown.length}</span>
          {limit < shown.length && (
            <div className="row" style={{ gap: 8 }}>
              <button type="button" className="btn sm" onClick={() => setLimit(limit + PAGE)}>Show {Math.min(PAGE, shown.length - limit)} more</button>
              <button type="button" className="btn sm" style={{ background: 'transparent' }} onClick={() => setLimit(shown.length)}>Show all</button>
            </div>
          )}
        </div>
      )}
      {tab === 'make' && o.waiting > 0 && <span className="faint" style={{ fontSize: 12 }}>Plus {o.waiting} video{o.waiting === 1 ? '' : 's'} waiting for the client to review.</span>}
    </div>
  );
}

export default function Clients() {
  const { tasks } = useWork();
  const [params, setParams] = useSearchParams();
  const clients = BRANDS.filter((b) => b.name !== 'All brands');
  const open = params.get('client') ?? clients[0].name;
  const toggle = (name) => setParams(open === name ? { client: '' } : { client: name }, { replace: true });

  return (
    <Layout section="Clients" crumbs={['Visionary Studios', 'Clients']} screen="Clients">
      <PageHead title="Clients" lede="Everyone we make videos for. Open a client to see revisions, work in progress and finished videos, and who made them." />

      <div className="card" style={{ overflow: 'hidden' }}>
        {clients.map((c, i) => {
          const o = overview(c.name, tasks);
          const info = INFO[c.name] || {};
          const isOpen = open === c.name;
          return (
            <div key={c.name} style={{ borderTop: i ? '1px solid var(--line)' : 0 }}>
              <button type="button" className={'client-row' + (isOpen ? ' on' : '')} aria-expanded={isOpen} onClick={() => toggle(c.name)}>
                <span style={{ flex: 'none', width: 36, height: 36, borderRadius: 10, background: c.color }} />
                <span className="stack" style={{ gap: 2, flex: '1 1 200px', minWidth: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</span>
                  <span className="faint" style={{ fontSize: 12 }}>{info.products} · contact {info.contact}</span>
                </span>
                <span className="row wrap client-stats" style={{ gap: 18 }}>
                  <span><b className="mono" style={{ color: o.revisions.length ? 'var(--red)' : undefined }}>{o.revisions.length}</b> revisions</span>
                  <span><b className="mono">{o.tasks.length}</b> being made</span>
                  <span><b className="mono" style={{ color: 'var(--green)' }}>{o.done.length}</b> completed</span>
                </span>
                <Icon.chevron className="chev" style={{ color: 'var(--faint)', flex: 'none' }} />
              </button>
              {isOpen && <ClientPanel key={c.name} o={o} />}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
