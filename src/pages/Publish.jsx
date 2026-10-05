import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Stepper from '../components/Stepper.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

const STATUS = { live: 'green', promo: 'lime', ready: '', sched: 'blue' };
const ADS = [
  { id: 'a1', type: 'ugc', title: 'Red before the event', recipe: 'AI UGC', caption: "Wedding's Saturday.", bg: '#3B2A22', st: 'ready', label: 'Ready to post' },
  { id: 'a2', type: 'wot', title: 'My nails after gels', recipe: 'Wall of text', caption: 'Nobody warned me…', bg: '#24252C', st: 'promo', label: 'On Meta Ads' },
  { id: 'a3', type: 'broll', title: 'Salon red, five minutes', recipe: 'B-roll', caption: 'Salon red.', bg: '#4A0F18', st: 'ready', label: 'Ready to post' },
  { id: 'a4', type: 'ugc', title: '£40 every two weeks', recipe: 'AI UGC', caption: 'I did the maths', bg: '#3A2E2B', st: 'live', label: 'Live · 48K views' },
  { id: 'a5', type: 'static', title: 'Red Alert, £12.99', recipe: 'Static', caption: 'Salon red for £12.99', bg: '#3A2426', st: 'sched', label: 'Thu 7:00 PM' },
  { id: 'a6', type: 'wot', title: 'Group chat: help', recipe: 'Native story', caption: 'me: party in 3 hrs', bg: '#1E2638', st: 'ready', label: 'Ready to post' },
  { id: 'a7', type: 'broll', title: 'Peel, press, done', recipe: 'B-roll', caption: 'Peel. Press. Done.', bg: '#3A0C12', st: 'live', label: 'Live · 12K views' },
  { id: 'a8', type: 'static', title: 'Day 1 vs day 7', recipe: 'Static', caption: 'Still on. Day 7.', bg: '#33281F', st: 'ready', label: 'Ready to post' }
];

export default function Publish() {
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState({ a1: true, a3: true, a6: true });
  const [ch, setCh] = useState({ tt: true, ig: true, yt: false });
  const [scheduled, setScheduled] = useState(false);
  const selCount = Object.values(sel).filter(Boolean).length;
  const chCount = Object.values(ch).filter(Boolean).length;
  const shown = ADS.filter((a) => filter === 'all' || a.type === filter);

  return (
    <Layout section="Products" crumbs={['Moyou London', 'Red Alert Gel Nail Strip']} screen="Publish" guide>
      <Stepper current={6} />
      <section className="stack" style={{ gap: 12 }}>
        <span className="row wrap" style={{ gap: 10 }}><span className="eyebrow">Step 07 · Deliver</span><span className="pill">Optional · only when we run the accounts</span></span>
        <h1 className="h1">Post it, watch it, scale winners.</h1>
        <p className="lede">Schedule kept pieces organically, promote what takes off, and let results steer the next batch.</p>
      </section>

      <Guide
        title="How this screen works"
        items={[
          ["What it's for", 'Optional. Only for brands where we post on their social accounts. Client jobs that they post themselves skip this.'],
          ['What you do', 'Click videos to select them, choose the channels, then press Schedule.'],
          ['What happens next', 'Results come back here. The best performers can be turned into new variations or promoted as paid ads.']
        ]}
        terms={<><span><b>Hold rate</b> = share of viewers still watching after 3 seconds.</span><span><b>ROAS</b> = revenue for every $1 of ad spend.</span></>}
      />

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[['Views, last 7 days', '1.28M', '+34% vs prior week', true], ['Avg. hold rate', '38%', '+6 pts', true], ['Promoted to ads', '4', 'of 42 posted'], ['Paid ROAS', '2.6×', 'blended, promoted only']].map(([l, v, s, up]) => (
          <div key={l} className="card stack" style={{ padding: 16, gap: 6 }}>
            <span className="faint" style={{ fontSize: 12 }} title={l === 'Avg. hold rate' ? 'Share of viewers still watching after 3 seconds' : undefined}>{l}{l === 'Avg. hold rate' ? ' ⓘ' : ''}</span>
            <span className="mono" style={{ fontSize: 26, fontWeight: 500 }}>{v}</span>
            <span style={{ fontSize: 12, color: up ? '#86EFAC' : 'var(--faint)' }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="stack" style={{ flex: '999 1 560px', minWidth: 0, gap: 16 }}>
          <div className="row wrap" role="group" aria-label="Filter by format" style={{ gap: 8 }}>
            {[['all', 'All'], ['ugc', 'AI UGC'], ['wot', 'Text and native'], ['broll', 'B-roll'], ['static', 'Static']].map(([id, l]) => <button key={id} type="button" className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{l}</button>)}
          </div>
          <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
            {shown.map((a) => {
              const on = !!sel[a.id];
              return (
                <button key={a.id} type="button" className={'pick' + (on ? ' on' : '')} style={{ padding: '8px 8px 12px', gap: 10 }} aria-pressed={on} onClick={() => { setSel({ ...sel, [a.id]: !on }); setScheduled(false); }}>
                  <span className="phone" style={{ display: 'block', height: 220, borderRadius: 11, background: a.bg, border: 0 }}>
                    <span className="head" /><span className="body" /><span className="cap">{a.caption}</span>
                    {on && <span style={{ position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: '50%', background: 'var(--lime)', color: '#0B0B0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.check size={14} sw={3} /></span>}
                  </span>
                  <span className="stack" style={{ gap: 6, padding: '0 4px' }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{a.title}</span>
                    <span className="faint" style={{ fontSize: 12 }}>{a.recipe} · 9:16, 4:5</span>
                    <span className={'pill mono ' + STATUS[a.st]} style={{ alignSelf: 'flex-start' }}>{a.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="card row wrap" style={{ padding: '14px 16px', gap: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 600, flex: '1 1 140px' }}><span className="mono" style={{ color: 'var(--lime)' }}>{selCount}</span> selected</span>
            <div className="segs" role="group" aria-label="Channels">
              {[['tt', 'TikTok'], ['ig', 'Reels'], ['yt', 'Shorts']].map(([id, l]) => <button key={id} type="button" className={'seg' + (ch[id] ? ' on' : '')} aria-pressed={ch[id]} onClick={() => { setCh({ ...ch, [id]: !ch[id] }); setScheduled(false); }}>{l}</button>)}
            </div>
            <button type="button" className="btn primary" onClick={() => setScheduled(true)}>{scheduled ? 'Scheduled' : `Schedule ${selCount * chCount} posts`}</button>
          </div>
          {scheduled && <div className="notice">Scheduled across the next 3 days at each channel's best posting times. Anything past 50K views in 48 hours gets flagged for Meta Ads.</div>}
        </section>

        <aside className="stack" style={{ flex: '1 1 300px', minWidth: 0, gap: 14 }}>
          <div className="stack" style={{ borderRadius: 18, padding: 20, gap: 14, background: '#15170F', border: '1px solid rgba(198,244,50,0.35)' }}>
            <span className="pill lime mono" style={{ alignSelf: 'flex-start' }}>Top winner</span>
            <h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>My nails after gels</h2>
            <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[['412K', 'views'], ['61%', 'hold rate'], ['2.9×', 'ROAS paid']].map(([v, l]) => <div key={l} className="stack" style={{ gap: 2 }}><span className="mono" style={{ fontSize: 20 }}>{v}</span><span className="faint" style={{ fontSize: 11 }}>{l}</span></div>)}
            </div>
            <div className="row wrap" style={{ gap: 8 }}>
              <Link className="btn primary" to="/product/formats" style={{ flex: 1 }}>Make 10 variations</Link>
              <button type="button" className="btn" style={{ flex: 1 }}>Promote on Meta</button>
            </div>
          </div>
          <div className="card stack" style={{ padding: 20, gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>What the engine learned</h3>
            {[['var(--lime)', 'Removal-pain hooks win', '2.1× the hold rate of occasion hooks. Next batch leans 60/40 toward them.'], ['var(--blue)', 'Wall of text is the cheapest winner', 'Lowest cost per 1K views across the last 3 batches.'], ['var(--red)', 'Close-up hands get skipped most', 'Quality bar for macro hand shots raised from 80 to 88.']].map(([c, t, d]) => (
              <div key={t} className="row" style={{ gap: 12, alignItems: 'flex-start' }}>
                <span style={{ flex: 'none', width: 8, height: 8, marginTop: 7, borderRadius: '50%', background: c }} />
                <div className="stack" style={{ gap: 4 }}><span style={{ fontSize: 14, fontWeight: 500 }}>{t}</span><span className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>{d}</span></div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Layout>
  );
}
