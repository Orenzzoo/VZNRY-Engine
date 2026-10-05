import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Guide from '../components/Guide.jsx';

const ROUNDS = [
  { id: 'r1', client: 'Moyou London', dot: '#C8102E', product: 'Red Alert', round: 'Round 2', videos: 6, dates: 'sent Mon 5 Oct · due Thu 8 Oct', ok: 0, no: 0, wait: 6, kind: 'waiting', status: 'Waiting on client', statusCls: '', activity: 'Link opened 2 h ago', comment: '' },
  { id: 'r3', client: 'Dollar Tree', dot: '#2E7D32', product: 'Secrets EP 01–03', round: 'Round 1', videos: 3, dates: 'sent Fri 2 Oct · was due Mon 5 Oct', ok: 0, no: 0, wait: 3, kind: 'overdue', status: 'Overdue', statusCls: 'red', activity: 'Not opened yet', comment: '' },
  { id: 'r2', client: 'Moyou London', dot: '#C8102E', product: 'Red Alert', round: 'Round 1', videos: 6, dates: 'sent Sat 3 Oct', ok: 2, no: 2, wait: 2, kind: 'fix', status: 'Needs our fixes', statusCls: 'amber', activity: 'Fixes sent as round 2', comment: 'Red looks a bit orange here.' },
  { id: 'r5', client: 'Pillow client', dot: '#7C9CF5', product: 'Story 01', round: 'Round 1', videos: 1, dates: 'sent Sun 4 Oct', ok: 0, no: 1, wait: 0, kind: 'fix', status: 'Needs our fixes', statusCls: 'amber', activity: 'Reviewed yesterday', comment: 'Can the pillow look a bit fluffier when it wakes up?' },
  { id: 'r6', client: 'Moyou London', dot: '#C8102E', product: 'Too Hot To Handle', round: 'Round 1', videos: 5, dates: 'sent Thu 1 Oct', ok: 4, no: 1, wait: 0, kind: 'fix', status: 'Needs our fixes', statusCls: 'amber', activity: 'Reviewed Fri', comment: 'Love these. Just swap the music on the last one.' },
  { id: 'r4', client: 'HookLife', dot: '#60A5FA', product: 'Hook test', round: 'Round 3', videos: 8, dates: 'sent Tue 29 Sep', ok: 8, no: 0, wait: 0, kind: 'done', status: 'All approved', statusCls: 'green', activity: 'Downloaded Wed', comment: '' }
];
const COMMENTS = [
  ['Moyou London', '#F2A3AE', 'Salon red, five minutes', '3 Oct', 'Red looks a bit orange here.', 'Changes', 'red', '0:07'],
  ['Pillow client', '#B9C7F7', 'The 3 AM rescue', '4 Oct', 'Can the pillow look a bit fluffier when it wakes up?', 'Changes', 'red', '0:05'],
  ['Moyou London', '#F2A3AE', 'Red before the event', '3 Oct', 'Love this opening, keep it.', 'Approved', 'green', '0:03'],
  ['Moyou London', '#F2A3AE', 'Do they lift? Day 7', '3 Oct', 'Can we use a different presenter?', 'Changes', 'red', '0:02'],
  ['HookLife', '#A7C8F7', 'Hook test 06', '30 Sep', 'This one is going straight into our ads.', 'Approved', 'green', '0:01']
];
const isWaiting = (r) => r.kind === 'waiting' || r.kind === 'overdue';

export default function ClientReviews() {
  const [filter, setFilter] = useState('all');
  const [nudged, setNudged] = useState({});
  const count = (k) => ROUNDS.filter((r) => (k === 'waiting' ? isWaiting(r) : r.kind === k)).length;
  const shown = ROUNDS.filter((r) => filter === 'all' || (filter === 'waiting' ? isWaiting(r) : r.kind === filter));

  return (
    <Layout section="Client reviews" crumbs={['Visionary Studios', 'Client reviews']} brand={{ name: 'All brands', color: 'var(--lime)' }} guide>
      <PageHead eyebrow="Workspace · Client reviews" title="Where every client review stands." lede="All review links we've sent, what each client decided, and what's waiting on us or on them." />
      <Guide
        title="How this page works"
        items={[
          ["What it's for", 'A summary of every review link sent to clients, so you know who to chase and what to fix.'],
          ['What you do', 'Start with "Needs our fixes": open those in the Director. For "Waiting on client", press Nudge to send a reminder.'],
          ['What happens next', 'Fixed videos go out as the next round. Approved videos unlock for the client to download.']
        ]}
        terms={<><span><b>Bar colours:</b> green approved, red changes requested, grey not reviewed yet.</span><span><b>Round</b> = one review cycle for a batch.</span></>}
      />

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        {[['Waiting on clients', count('waiting'), '1 overdue'], ['Needs our fixes', count('fix'), 'rounds with change requests', '#FCA5A5'], ['First-round approval ⓘ', '68%', '+9 pts this month', null, '#86EFAC'], ['Avg. client response', '1.6 days', 'from link sent to decision']].map(([l, v, s, c, sc]) => (
          <div key={l} className="card stack" style={{ padding: 16, gap: 4 }}>
            <span className="faint" style={{ fontSize: 12 }} title={l.startsWith('First') ? 'Share of videos approved the first time a client saw them' : undefined}>{l}</span>
            <span className="mono" style={{ fontSize: 28, fontWeight: 500, color: c || undefined }}>{v}</span>
            <span style={{ fontSize: 12, color: sc || 'var(--faint)' }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="row wrap" role="group" aria-label="Filter reviews" style={{ gap: 8 }}>
        {[['all', 'All', ROUNDS.length], ['waiting', 'Waiting on client', count('waiting')], ['fix', 'Needs our fixes', count('fix')], ['overdue', 'Overdue', count('overdue')], ['done', 'Done', count('done')]].map(([k, l, n]) => (
          <button key={k} type="button" className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)}>{l} <span className="mono" style={{ opacity: 0.7 }}>{n}</span></button>
        ))}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card" style={{ flex: '999 1 560px', minWidth: 0, overflow: 'hidden' }}>
          <div className="row between" style={{ padding: '14px 18px' }}><h2 style={{ fontSize: 16, fontWeight: 600 }}>Review rounds</h2><span className="faint" style={{ fontSize: 13 }}>{shown.length} shown</span></div>
          {shown.map((r) => (
            <div key={r.id} className="stack" style={{ gap: 12, padding: '16px 18px', borderTop: '1px solid var(--line)' }}>
              <div className="row wrap between" style={{ alignItems: 'flex-start', gap: 10 }}>
                <div className="row" style={{ gap: 12, minWidth: 0 }}>
                  <span style={{ flex: 'none', width: 10, height: 10, borderRadius: 3, background: r.dot }} />
                  <div className="stack" style={{ gap: 3, minWidth: 0 }}><span style={{ fontWeight: 600 }}>{r.client} · {r.product}</span><span className="faint" style={{ fontSize: 12 }}>{r.round} · {r.videos} videos · {r.dates}</span></div>
                </div>
                <span className={'pill ' + r.statusCls}>{r.status}</span>
              </div>
              <div className="stack" style={{ gap: 6 }}>
                <div className="row" style={{ height: 8, borderRadius: 8, overflow: 'hidden', gap: 2, background: 'var(--line)' }}>
                  <div style={{ flex: r.ok, height: '100%', background: 'var(--green)' }} />
                  <div style={{ flex: r.no, height: '100%', background: 'var(--red)' }} />
                  <div style={{ flex: r.wait, height: '100%', background: '#3A3A42' }} />
                </div>
                <div className="row wrap faint" style={{ gap: 14, fontSize: 12 }}>
                  <span><span className="mono" style={{ color: '#86EFAC' }}>{r.ok}</span> approved</span>
                  <span><span className="mono" style={{ color: '#FCA5A5' }}>{r.no}</span> changes</span>
                  <span><span className="mono">{r.wait}</span> not reviewed</span>
                  <span>{r.activity}</span>
                </div>
              </div>
              {r.comment && <div className="sub" style={{ padding: '10px 12px', fontSize: 13, lineHeight: 1.45 }}><span className="faint">Latest comment · </span>"{r.comment}"</div>}
              <div className="row wrap" style={{ gap: 8 }}>
                {r.kind === 'fix' && <Link className="btn primary sm" to="/product/director">Fix in Director</Link>}
                {isWaiting(r) && <button type="button" className="btn sm" onClick={() => setNudged({ ...nudged, [r.id]: true })}>{nudged[r.id] ? 'Reminder sent' : 'Nudge client'}</button>}
                <Link className="btn sm" to="/product/deliver">Open round</Link>
                <Link className="btn sm" to={`/review/${r.id}`}>Client's view</Link>
              </div>
            </div>
          ))}
        </section>

        <aside className="card" style={{ flex: '1 1 320px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px' }}><h2 style={{ fontSize: 16, fontWeight: 600 }}>Latest client comments</h2></div>
          {COMMENTS.map(([client, dot, video, when, text, decision, cls, t]) => (
            <div key={text} className="row" style={{ gap: 12, padding: '12px 16px', borderTop: '1px solid var(--line)', alignItems: 'flex-start' }}>
              <div style={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', background: dot, color: '#0B0B0F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{client[0]}</div>
              <div className="stack" style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <span style={{ fontSize: 12 }}><b>{client}</b> <span className="faint">on {video} · {when}</span></span>
                <span style={{ fontSize: 14, lineHeight: 1.45 }}>"{text}"</span>
                <span className="row" style={{ gap: 8 }}><span className={'pill ' + cls}>{decision}</span><span className="mono faint" style={{ fontSize: 11 }}>at {t}</span></span>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </Layout>
  );
}
