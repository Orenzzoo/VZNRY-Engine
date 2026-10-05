import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Guide from '../components/Guide.jsx';

const BATCHES = [
  { id: 'b1', brand: 'Moyou London', dot: '#C8102E', product: 'Red Alert Gel Nail Strip', batch: 'Batch 4', waiting: 6, qa: 92, since: '2 h', sinceCls: '', overdue: false, note: 'client round due Thu', tints: ['#3B2A22', '#24252C', '#4A0F18', '#33281F', '#3A2E2B', '#1E2638'] },
  { id: 'b2', brand: 'Moyou London', dot: '#C8102E', product: 'Too Hot To Handle', batch: 'Batch 1', waiting: 5, qa: 89, since: '1 day', sinceCls: 'amber', overdue: false, note: 'no client deadline yet', tints: ['#3A1F12', '#2E2420', '#4A2410', '#33231A', '#2A1E1A'] },
  { id: 'b3', brand: 'Dollar Tree', dot: '#2E7D32', product: 'Dollar Tree Secrets', batch: 'EP 01–03', waiting: 3, qa: 94, since: '3 days', sinceCls: 'red', overdue: true, note: 'client is waiting for these', tints: ['#2B3A2E', '#24302A', '#2E3A24'] },
  { id: 'b4', brand: 'HookLife', dot: '#60A5FA', product: 'Hook test', batch: 'Batch 2', waiting: 4, qa: 88, since: '5 h', sinceCls: '', overdue: false, note: 'internal test, no client', tints: ['#1F2A33', '#22283A', '#1E2638', '#2A2E3A'] },
  { id: 'b5', brand: 'Pillow client', dot: '#7C9CF5', product: 'Pillow animation', batch: 'Story 01', waiting: 1, qa: 97, since: '1 day', sinceCls: 'amber', overdue: false, note: 'animated, clay style', tints: ['#2B2440'] }
];
const COLS = 'minmax(0,2.2fr) 90px 80px 110px 120px';

export default function ReviewQueue() {
  const [assign, setAssign] = useState({ b1: 'You', b2: 'Arland', b3: 'Unassigned', b4: 'Jerome', b5: 'You' });
  const [filter, setFilter] = useState('all');
  const [selId, setSelId] = useState('b1');
  const shown = BATCHES.filter((b) => filter === 'mine' ? assign[b.id] === 'You' : filter === 'none' ? assign[b.id] === 'Unassigned' : filter === 'late' ? b.overdue : true);
  const sel = BATCHES.find((b) => b.id === selId);
  const mine = BATCHES.filter((b) => assign[b.id] === 'You').reduce((a, b) => a + b.waiting, 0);

  return (
    <Layout section="Review queue" crumbs={['Visionary Studios', 'Review queue']} brand={{ name: 'All brands', color: 'var(--lime)' }} guide>
      <PageHead eyebrow="Workspace · Review queue" title="Everything waiting for a look." lede="Every generated video that passed the automatic checks and now needs a person to keep or skip it, across all brands." />
      <Guide
        title="How this page works"
        items={[
          ["What it's for", 'One place to see all review work, so nothing sits unchecked before a client deadline.'],
          ['What you do', 'Click a batch to preview it and assign it. Press "Start reviewing" to go through it with Keep and Skip.'],
          ['What happens next', 'Kept videos move to Client reviews or the Library. Skips go back to be remade.']
        ]}
        terms={<><span><b>Waiting</b> = time since the batch finished generating.</span><span><b>Overdue</b> = waiting more than 2 days, or a client deadline is close.</span></>}
      />

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
        {[['Videos waiting', '19', 'in 5 batches'], ['Assigned to you', String(mine), 'videos'], ['Oldest waiting', '3 days', 'Dollar Tree Secrets', '#FCA5A5'], ['Avg. quality score ⓘ', '91', 'out of 100']].map(([l, v, s, c]) => (
          <div key={l} className="card stack" style={{ padding: 16, gap: 4 }}>
            <span className="faint" style={{ fontSize: 12 }} title={l.includes('quality') ? 'Average automatic quality score of waiting videos' : undefined}>{l}</span>
            <span className="mono" style={{ fontSize: 28, fontWeight: 500, color: c }}>{v}</span>
            <span className="faint" style={{ fontSize: 12 }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="row wrap" role="group" aria-label="Filter batches" style={{ gap: 8 }}>
        {[['all', 'All batches'], ['mine', 'Assigned to me'], ['none', 'Unassigned'], ['late', 'Overdue']].map(([k, l]) => <button key={k} type="button" className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)}>{l}</button>)}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card" style={{ flex: '999 1 540px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 640 }}>
              <div className="th" style={{ gridTemplateColumns: COLS }}><span>Batch</span><span>Waiting</span><span>Quality</span><span>Since</span><span>Reviewer</span></div>
              {shown.map((b) => (
                <button key={b.id} type="button" className={'list-row' + (b.id === selId ? ' on' : '')} style={{ gridTemplateColumns: COLS }} onClick={() => setSelId(b.id)}>
                  <span className="row" style={{ gap: 12, minWidth: 0 }}>
                    <span style={{ flex: 'none', width: 10, height: 10, borderRadius: 3, background: b.dot }} />
                    <span className="stack" style={{ gap: 3, minWidth: 0 }}><span style={{ fontWeight: 600 }}>{b.product}</span><span className="faint" style={{ fontSize: 12 }}>{b.brand} · {b.batch}</span></span>
                  </span>
                  <span className="mono">{b.waiting}</span>
                  <span className="mono muted">{b.qa}</span>
                  <span><span className={'pill ' + b.sinceCls}>{b.since}</span></span>
                  <span className="muted" style={{ fontSize: 13 }}>{assign[b.id]}</span>
                </button>
              ))}
              {!shown.length && <div className="faint" style={{ padding: '22px 18px', borderTop: '1px solid var(--line)', fontSize: 14 }}>Nothing here. Nice.</div>}
            </div>
          </div>
        </section>

        <aside className="card stack" style={{ flex: '1 1 340px', minWidth: 0, padding: 20, gap: 16 }}>
          <div className="stack" style={{ gap: 4 }}>
            <span className="faint" style={{ fontSize: 12 }}>{sel.brand} · {sel.batch}</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{sel.product}</h2>
            <span className="muted" style={{ fontSize: 13 }}>{sel.waiting} videos · {sel.note}</span>
          </div>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {sel.tints.map((bg, i) => (
              <div key={i} className="phone" style={{ aspectRatio: '9 / 16', borderRadius: 9, background: bg }}>
                <span className="head" />
                <span className="mono" style={{ position: 'absolute', left: 6, bottom: 6, fontSize: 10, padding: '1px 5px', borderRadius: 5, background: 'rgba(11,11,15,0.75)', color: '#D4D4D8' }}>{sel.qa - (i % 3) * 2 + (i % 2)}</span>
              </div>
            ))}
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Reviewer</span>
            <div className="row wrap" role="group" aria-label="Assign reviewer" style={{ gap: 6 }}>
              {['You', 'Arland', 'Jerome', 'Unassigned'].map((p) => <button key={p} type="button" className={'chip' + (assign[selId] === p ? ' on' : '')} onClick={() => setAssign({ ...assign, [selId]: p })}>{p}</button>)}
            </div>
          </div>
          <Link className="btn primary" to="/product/review" style={{ minHeight: 50 }}>Start reviewing {sel.waiting} videos →</Link>
          <Link className="btn" to="/product/director">See how they were made</Link>
        </aside>
      </div>
    </Layout>
  );
}
