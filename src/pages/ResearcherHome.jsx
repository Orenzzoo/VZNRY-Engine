import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';
import { person, useCurrentUser } from '../data/team.jsx';
import { RESEARCH, STATUS, useWork, statusLabel, reviewSubject } from '../data/work.js';
import { Stat, greeting } from './Home.jsx';

function Column({ title, count, tone, children, to }) {
  return (
    <section className="card stack" style={{ flex: '1 1 230px', minWidth: 0, padding: 16, gap: 12 }}>
      <div className="row between">
        <span className="row" style={{ gap: 8, fontSize: 14, fontWeight: 600 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: tone }} />{title}</span>
        {to ? <Link to={to} className="pill mono" style={{ textDecoration: 'none' }}>{count}</Link> : <span className="pill mono">{count}</span>}
      </div>
      <div className="stack stagger" style={{ gap: 8 }}>{children}</div>
    </section>
  );
}

function Mini({ dot, title, sub, right, to }) {
  const body = (
    <>
      <span className="row" style={{ gap: 8, minWidth: 0 }}><span style={{ flex: 'none', width: 8, height: 8, borderRadius: 3, background: dot }} /><span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span></span>
      <span className="row between" style={{ gap: 8 }}><span className="faint" style={{ fontSize: 12 }}>{sub}</span>{right}</span>
    </>
  );
  const style = { padding: 12, gap: 8, textDecoration: 'none', color: 'var(--text)' };
  return to ? <Link to={to} className="sub stack" style={style}>{body}</Link> : <div className="sub stack" style={style}>{body}</div>;
}

export default function ResearcherHome() {
  const user = useCurrentUser();
  const { ready, tasks, reviews } = useWork();
  const toReview = reviews.filter((r) => r.status === 'waiting');
  const adsToReview = toReview.reduce((n, r) => n + r.ads.length, 0);
  const withEditors = tasks.filter((t) => ['todo', 'doing', 'fixes', 'review', 'approved'].includes(t.status));
  const withClient = tasks.filter((t) => t.status === 'client');

  return (
    <Layout section="Home" crumbs={['Visionary Studios', 'Home']} brand={{ name: 'All brands', color: 'var(--lime)' }} screen="Home">
      <section className="row wrap between" style={{ gap: 20, alignItems: 'flex-end' }}>
        <div className="stack" style={{ gap: 8, flex: '1 1 380px' }}>
          <span className="faint" style={{ fontSize: 13 }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <h1 className="h1">{greeting()}, {user.name}.</h1>
          <p className="lede"><span style={{ color: 'var(--text)' }}>{ready.length} researched {ready.length === 1 ? 'product is' : 'products are'} waiting</span> for an editor, and <span style={{ color: 'var(--text)' }}>{withEditors.length} tasks</span> are with the team right now.</p>
        </div>
        <div className="row wrap" style={{ gap: 10 }}>
          <Link className="btn" to="/editors"><Icon.handoff size={16} />Editors</Link>
          <Link className="btn primary" to="/product/new"><Icon.plus />Research a product</Link>
        </div>
      </section>

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 14 }}>
        <Stat to="/editors" label="Ready to assign" value={ready.length} tone="var(--lime)" foot="Researched, waiting for an editor" />
        <Stat to="/editors" label="Videos to review" value={adsToReview} tone={adsToReview ? 'var(--lime)' : undefined} foot={toReview.length ? `${toReview.length} batch${toReview.length === 1 ? '' : 'es'} from ${[...new Set(toReview.map((r) => person(r.editor).name))].join(', ')}` : 'Nothing waiting'} />
        <Stat to="/editors" label="With editors" value={withEditors.length} foot={`${tasks.filter((t) => t.status === 'fixes').length} waiting on client fixes`} />
        <Stat to="/client-reviews" label="Products researched, 30 days" value={14} foot="+4 on the month before" />
      </div>

      <div className="stack" style={{ gap: 12 }}>
        <div className="row wrap between" style={{ gap: 8 }}><h2 className="h2">Pipeline</h2><span className="faint" style={{ fontSize: 13 }}>Your reviews · assign → editing → client</span></div>
        <div className="row wrap" style={{ gap: 14, alignItems: 'flex-start' }}>
          <Column title="Videos to review" count={adsToReview} tone="var(--lime)" to="/editors">
            {toReview.map((r) => { const sj = reviewSubject(r, tasks); return <Mini key={r.id} dot={sj.dot} title={sj.title} sub={`${person(r.editor).name} · ${r.ads.length} ad${r.ads.length === 1 ? '' : 's'} · ${r.sent}`} to={`/product/review?submission=${r.id}`} right={<span style={{ fontSize: 12, fontWeight: 600, color: 'var(--lime)' }}>Review →</span>} />; })}
            {toReview.length === 0 && <span className="faint" style={{ fontSize: 13 }}>Nothing to review.</span>}
          </Column>
          <Column title="Ready to assign" count={ready.length} tone="var(--lime)" to="/editors">
            {ready.map((p) => <Mini key={p.id} dot={RESEARCH[p.id].dot} title={`${RESEARCH[p.id].product} · ${p.title}`} sub={`Done ${p.finished}`} to={`/editors?handoff=${p.id}`} right={<span style={{ fontSize: 12, fontWeight: 600, color: 'var(--lime)' }}>Assign →</span>} />)}
            {ready.length === 0 && <span className="faint" style={{ fontSize: 13 }}>Nothing waiting.</span>}
          </Column>
          <Column title="With editors" count={withEditors.length} tone="var(--amber)" to="/editors">
            {withEditors.map((t) => <Mini key={t.id} dot={RESEARCH[t.research].dot} title={`${RESEARCH[t.research].product} · ${t.title}`} sub={`${person(t.editor).name} · due ${t.due}`} to={`/editors?task=${t.id}`} right={<span className={'pill ' + STATUS[t.status].cls} style={{ fontSize: 11, minHeight: 20 }}>{statusLabel(t.status, 'researcher')}</span>} />)}
          </Column>
          <Column title="With client" count={withClient.length} tone="var(--violet)" to="/client-reviews">
            {withClient.map((t) => <Mini key={t.id} dot={RESEARCH[t.research].dot} title={`${RESEARCH[t.research].product} · ${t.title}`} sub={`${person(t.editor).name} · due ${t.due}`} />)}
          </Column>
        </div>
      </div>

    </Layout>
  );
}
