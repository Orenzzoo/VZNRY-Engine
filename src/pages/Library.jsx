import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

const S = { review: ['In review', 'amber'], client: ['With client', 'blue'], approved: ['Approved', 'green'], delivered: ['Delivered', 'lime'], posted: ['Posted', 'lime'], skipped: ['Skipped', ''] };
const CLIPS = [
  { id: 'c1', title: 'Red before the event', caption: "Wedding's Saturday.", brand: 'Moyou London', bk: 'moyou', product: 'Red Alert Gel Nail Strip', recipe: 'AI UGC', dur: '0:18', status: 'client', bg: '#3B2A22', date: '5 Oct', character: 'Mia, 24', qa: '94', version: 'v2 · after client note', hook: "Wedding's Saturday and I didn't book a single appointment.", history: 'Made 2 Oct · kept in review · round 1 approved · in round 2 now' },
  { id: 'c2', title: 'My nails after gels', caption: 'Nobody warned me…', brand: 'Moyou London', bk: 'moyou', product: 'Red Alert Gel Nail Strip', recipe: 'Wall of text', dur: '0:09', status: 'posted', bg: '#24252C', date: '28 Sep', character: 'None', qa: '96', version: 'v1', hook: 'Nobody warned me that the worst part of salon gels is the removal.', history: 'Made 26 Sep · approved · posted to TikTok · promoted on Meta' },
  { id: 'c3', title: 'Salon red, five minutes', caption: 'Salon red.', brand: 'Moyou London', bk: 'moyou', product: 'Red Alert Gel Nail Strip', recipe: 'B-roll', dur: '0:12', status: 'client', bg: '#4A0F18', date: '5 Oct', character: 'Hands only', qa: '88', version: 'v2 · colour corrected', hook: 'Salon red. Five minutes. Peels off clean.', history: 'Made 2 Oct · client asked for deeper red · remade · in round 2' },
  { id: 'c4', title: 'Secret #1: the $5 aisle', caption: 'Workers won’t tell you…', brand: 'Dollar Tree', bk: 'dt', product: 'Dollar Tree Secrets', recipe: 'AI UGC series', dur: '0:30', status: 'client', bg: '#2B3A2E', date: '2 Oct', character: 'Tasha, 34', qa: '94', version: 'v1', hook: "Dollar Tree workers won't tell you this…", history: 'Made 1 Oct · kept · sent to client 2 Oct · not opened yet' },
  { id: 'c5', title: '£40 every two weeks', caption: 'I did the maths', brand: 'Moyou London', bk: 'moyou', product: 'Red Alert Gel Nail Strip', recipe: 'AI UGC', dur: '0:20', status: 'approved', bg: '#3A2E2B', date: '3 Oct', character: 'Jo', qa: '91', version: 'v1', hook: "I can't justify £40 every two weeks at the salon any more.", history: 'Made 2 Oct · client approved 3 Oct · ready to download' },
  { id: 'c6', title: 'The 3 AM rescue', caption: '3:12 AM. Not sleeping.', brand: 'Pillow client', bk: 'pillow', product: 'Memory-foam pillow', recipe: 'Animation', dur: '0:15', status: 'review', bg: '#2B2440', date: '4 Oct', character: 'Pillow (clay)', qa: '97', version: 'v2 · fluffier', hook: 'Clock says 3:12. Someone is NOT sleeping.', history: 'Made 3 Oct · client asked for fluffier pillow · remade · in our review' },
  { id: 'c7', title: 'Hook test 06', caption: 'Stop scrolling.', brand: 'HookLife', bk: 'hook', product: 'Hook test', recipe: 'Green-screen', dur: '0:11', status: 'delivered', bg: '#1F2A33', date: '30 Sep', character: 'Kobe Peretz', qa: '90', version: 'v1', hook: 'Stop scrolling if you run ads.', history: 'Made 28 Sep · approved round 3 · client downloaded 30 Sep' },
  { id: 'c8', title: 'Peel, press, done', caption: 'Peel. Press. Done.', brand: 'Moyou London', bk: 'moyou', product: 'Red Alert Gel Nail Strip', recipe: 'B-roll', dur: '0:10', status: 'posted', bg: '#3A0C12', date: '27 Sep', character: 'Hands only', qa: '92', version: 'v1', hook: 'Peel. Press. Done.', history: 'Made 25 Sep · approved · posted to Reels' },
  { id: 'c9', title: 'Flame tips up close', caption: 'Look at the tips.', brand: 'Moyou London', bk: 'moyou', product: 'Too Hot To Handle', recipe: 'B-roll', dur: '0:12', status: 'review', bg: '#3A1F12', date: '4 Oct', character: 'Hands only', qa: '89', version: 'v1', hook: 'Look at the tips. Just look.', history: 'Made 4 Oct · waiting in our review queue' },
  { id: 'c10', title: 'Group chat: help', caption: 'me: party in 3 hrs', brand: 'Moyou London', bk: 'moyou', product: 'Red Alert Gel Nail Strip', recipe: 'Native story', dur: '0:11', status: 'client', bg: '#1E2638', date: '5 Oct', character: 'None', qa: '93', version: 'v1', hook: 'me: party in 3 hrs, nails are tragic', history: 'Made 2 Oct · kept · in round 2' },
  { id: 'c11', title: 'Hook test 03', caption: 'Wait for it…', brand: 'HookLife', bk: 'hook', product: 'Hook test', recipe: 'AI UGC', dur: '0:14', status: 'skipped', bg: '#22283A', date: '27 Sep', character: 'Marcus, 28', qa: '84', version: 'v1', hook: 'Wait for it…', history: 'Made 27 Sep · skipped: weak hook · deleted in 22 days' },
  { id: 'c12', title: 'Secret #2: new stock day', caption: 'Wrong day = wrong stuff', brand: 'Dollar Tree', bk: 'dt', product: 'Dollar Tree Secrets', recipe: 'AI UGC series', dur: '0:30', status: 'client', bg: '#24302A', date: '2 Oct', character: 'Tasha, 34', qa: '95', version: 'v1', hook: "If you shop Dollar Tree on the wrong day, you're missing the good stuff.", history: 'Made 1 Oct · fact checked · sent to client 2 Oct' }
];

export default function Library() {
  const [status, setStatus] = useState('all');
  const [brand, setBrand] = useState('all');
  const [q, setQ] = useState('');
  const [picks, setPicks] = useState({});
  const [selId, setSelId] = useState('c1');
  const query = q.trim().toLowerCase();
  const shown = CLIPS.filter((c) => {
    if (brand !== 'all' && c.bk !== brand) return false;
    if (status === 'done' && !(c.status === 'delivered' || c.status === 'posted')) return false;
    if (status !== 'all' && status !== 'done' && c.status !== status) return false;
    return !query || (c.title + ' ' + c.hook + ' ' + c.product).toLowerCase().includes(query);
  });
  const sel = CLIPS.find((c) => c.id === selId);
  const pickCount = Object.values(picks).filter(Boolean).length;

  return (
    <Layout section="Library" crumbs={['Visionary Studios', 'Library']} brand={{ name: 'All brands', color: 'var(--lime)' }} guide>
      <PageHead eyebrow="Workspace · Library" title="Every clip we've made." lede="All finished videos across every brand, with where each one is: in review, approved, delivered or posted." />
      <Guide
        title="How this page works"
        items={[
          ["What it's for", "Finding any video we've made: to re-send it, download it, or reuse a winner."],
          ['What you do', 'Filter by status, brand or format, or search by title. Click a clip to see its details. Tick the box in the corner to select several for bulk actions.'],
          ['What happens next', 'Selected clips can be downloaded, sent for client review, or turned into new variations.']
        ]}
        terms={<span><b>Statuses:</b> In review (ours) → With client → Approved → Delivered or Posted. <b>Skipped</b> clips are kept for 30 days in case you want them back.</span>}
      />

      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {[['597', 'clips in total'], ['412', 'approved'], ['128', 'delivered this month'], ['6', 'brands']].map(([v, l]) => (
          <div key={l} className="card stack" style={{ padding: '14px 16px', gap: 2 }}><span className="mono" style={{ fontSize: 24, fontWeight: 500 }}>{v}</span><span className="faint" style={{ fontSize: 12 }}>{l}</span></div>
        ))}
      </div>

      <div className="card stack" style={{ padding: 14, gap: 12 }}>
        <div className="row wrap" style={{ gap: 10 }}>
          <label className="field" style={{ flex: '1 1 260px', minHeight: 44 }} htmlFor="lib-q">
            <Icon.search size={16} style={{ color: 'var(--faint)' }} />
            <span className="sr-only">Search clips</span>
            <input id="lib-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, hook or product" style={{ minHeight: 40, fontSize: 14 }} />
          </label>
          <div className="segs" role="group" aria-label="Brand">
            {[['all', 'All brands'], ['moyou', 'Moyou'], ['dt', 'Dollar Tree'], ['hook', 'HookLife'], ['pillow', 'Pillow']].map(([k, l]) => <button key={k} type="button" className={'seg' + (brand === k ? ' on' : '')} style={{ minHeight: 38, padding: '0 12px' }} onClick={() => setBrand(k)}>{l}</button>)}
          </div>
        </div>
        <div className="row wrap" role="group" aria-label="Status" style={{ gap: 8 }}>
          {[['all', 'All'], ['review', 'In review'], ['client', 'With client'], ['approved', 'Approved'], ['done', 'Delivered or posted'], ['skipped', 'Skipped']].map(([k, l]) => <button key={k} type="button" className={'chip' + (status === k ? ' on' : '')} onClick={() => setStatus(k)}>{l}</button>)}
        </div>
      </div>

      {pickCount > 0 && (
        <div className="row wrap" style={{ gap: 10, padding: '12px 14px', borderRadius: 14, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.35)' }}>
          <span style={{ flex: '1 1 140px', fontSize: 14, fontWeight: 600, color: '#BFDBFE' }}>{pickCount} selected</span>
          <button type="button" className="btn sm">Download</button>
          <Link className="btn sm" to="/product/deliver">Send for client review</Link>
          <Link className="btn sm" to="/product/formats">Make variations</Link>
          <button type="button" className="btn sm" onClick={() => setPicks({})}>Clear</button>
        </div>
      )}

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="stack" style={{ flex: '999 1 520px', minWidth: 0, gap: 10 }}>
          <span className="faint" style={{ fontSize: 13 }}>Showing {shown.length} of {CLIPS.length} recent clips</span>
          <div key={status + brand} className="grid-auto stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(170px, 100%), 1fr))' }}>
            {shown.map((c) => {
              const picked = !!picks[c.id];
              return (
                <div key={c.id} className="stack" style={{ position: 'relative', gap: 8, padding: '8px 8px 12px', borderRadius: 16, background: 'var(--card)', border: '1px solid ' + (c.id === selId ? 'var(--lime)' : picked ? 'rgba(96,165,250,0.6)' : 'var(--line-2)'), boxShadow: c.id === selId ? '0 0 0 4px rgba(198,244,50,0.1)' : 'none' }}>
                  <button type="button" className="stack" style={{ gap: 8, padding: 0, border: 0, background: 'transparent', color: 'var(--text)', textAlign: 'left', cursor: 'pointer' }} onClick={() => setSelId(c.id)}>
                    <span className="phone" style={{ display: 'block', height: 220, borderRadius: 11, background: c.bg, border: 0 }}>
                      <span className="head" /><span className="body" />
                      <span className="cap" style={{ fontSize: 11, bottom: 30 }}>{c.caption}</span>
                      <span className="mono" style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 10, padding: '1px 5px', borderRadius: 5, background: 'rgba(11,11,15,0.75)', color: '#D4D4D8' }}>{c.dur}</span>
                    </span>
                    <span className="stack" style={{ gap: 4, padding: '0 4px' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{c.title}</span>
                      <span className="faint" style={{ fontSize: 12 }}>{c.brand} · {c.recipe}</span>
                      <span className="row between" style={{ gap: 6 }}><span className={'pill ' + S[c.status][1]}>{S[c.status][0]}</span><span className="faint mono" style={{ fontSize: 11 }}>{c.date}</span></span>
                    </span>
                  </button>
                  <button type="button" aria-pressed={picked} aria-label={'Select ' + c.title} onClick={() => setPicks({ ...picks, [c.id]: !picked })}
                    style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: 8, border: '1.5px solid ' + (picked ? 'var(--blue)' : '#3A3A42'), background: picked ? 'var(--blue)' : 'rgba(11,11,15,0.75)', color: '#0B0B0F', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                    {picked && <Icon.check size={14} sw={3.2} />}
                  </button>
                </div>
              );
            })}
          </div>
          {!shown.length && <div className="card faint" style={{ padding: 24, fontSize: 14, textAlign: 'center' }}>No clips match these filters.</div>}
        </section>

        <aside key={sel.id} className="card stack anim-in" style={{ flex: '1 1 320px', minWidth: 0, padding: 18, gap: 16 }}>
          <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
            <div className="row" style={{ flex: 'none', width: 96, height: 170, borderRadius: 12, background: sel.bg, border: '1px solid var(--line-3)', justifyContent: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon.play size={16} /></div>
            </div>
            <div className="stack" style={{ flex: 1, minWidth: 0, gap: 6 }}>
              <span className={'pill ' + S[sel.status][1]} style={{ alignSelf: 'flex-start' }}>{S[sel.status][0]}</span>
              <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25 }}>{sel.title}</h2>
              <span className="faint" style={{ fontSize: 13 }}>{sel.brand} · {sel.product}</span>
            </div>
          </div>
          <div className="sub stack">
            {[['Recipe', sel.recipe], ['Presenter', sel.character], ['Length', sel.dur], ['Quality score', sel.qa], ['Version', sel.version], ['Made', sel.date]].map(([k, v], i) => (
              <div key={k} className="row between" style={{ gap: 10, padding: '10px 12px', fontSize: 13, borderTop: i ? '1px solid var(--line)' : 0 }}><span className="faint">{k}</span><span>{v}</span></div>
            ))}
          </div>
          <div className="stack" style={{ gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Hook</span><span className="muted" style={{ fontSize: 14, lineHeight: 1.45 }}>"{sel.hook}"</span></div>
          <div className="stack" style={{ gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Sizes</span><div className="row wrap" style={{ gap: 6 }}>{['9:16', '4:5', '1:1', 'Captions .srt'].map((s) => <span key={s} className="pill">{s}</span>)}</div></div>
          <div className="stack" style={{ gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600 }}>History</span><span className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{sel.history}</span></div>
          <div className="grid-auto" style={{ gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button type="button" className="btn sm">Download</button>
            <Link className="btn sm" to="/product/deliver">Send to client</Link>
            <Link className="btn sm" to="/product/formats">Make variations</Link>
            <Link className="btn sm" to="/product/publish">Publish</Link>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
