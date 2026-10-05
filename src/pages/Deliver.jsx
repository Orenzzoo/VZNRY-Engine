import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import Stepper from '../components/Stepper.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

const ROUTES = [
  { id: 'review', title: 'Client review link', tag: 'Recommended', tagCls: 'lime', about: 'The client approves, rejects and comments on each video. Approved files unlock for download.' },
  { id: 'download', title: 'Download files', tag: 'Hand-off', tagCls: '', about: 'Every size, captions as .srt, thumbnails and an ad copy sheet in one zip.' },
  { id: 'publish', title: 'Publish to our channels', tag: 'Optional', tagCls: '', about: 'Only when we run the accounts. Schedule posts and promote winners.' }
];
const VIDS = [
  { id: 'v1', title: 'Red before the event', recipe: 'AI UGC', len: '18 s', bg: '#3B2A22' },
  { id: 'v2', title: 'My nails after gels', recipe: 'Wall of text', len: '9 s', bg: '#24252C' },
  { id: 'v3', title: 'Salon red, five minutes', recipe: 'B-roll', len: '12 s', bg: '#4A0F18' },
  { id: 'v4', title: 'Do they lift? Day 7', recipe: 'Before and after', len: '15 s', bg: '#33281F' },
  { id: 'v5', title: '£40 every two weeks', recipe: 'AI UGC', len: '20 s', bg: '#3A2E2B' },
  { id: 'v6', title: 'Group chat: help', recipe: 'Native story', len: '11 s', bg: '#1E2638' }
];
const ROUND1 = [
  { title: 'Red before the event', status: 'Approved', cls: 'green', comments: 1, latest: 'Client: "Love this opening."', fix: false },
  { title: 'My nails after gels', status: 'Waiting', cls: '', comments: 0, latest: 'Not reviewed yet', fix: false },
  { title: 'Salon red, five minutes', status: 'Changes requested', cls: 'red', comments: 2, latest: 'Client at 0:07: "Red looks a bit orange here."', fix: true },
  { title: 'Do they lift? Day 7', status: 'Changes requested', cls: 'red', comments: 1, latest: 'Client at 0:02: "Can we use a different presenter?"', fix: true },
  { title: '£40 every two weeks', status: 'Approved', cls: 'green', comments: 0, latest: 'Approved without comments', fix: false },
  { title: 'Group chat: help', status: 'Waiting', cls: '', comments: 0, latest: 'Not reviewed yet', fix: false }
];
const TCOLS = 'minmax(0,2fr) 150px 110px 190px';

export default function Deliver() {
  const [route, setRoute] = useState('review');
  const [picks, setPicks] = useState(Object.fromEntries(VIDS.map((v) => [v.id, true])));
  const [msg, setMsg] = useState('Hi! Round 2 of the Red Alert batch is ready. Approve, reject or leave a comment on any moment in each video.');
  const [due, setDue] = useState('3d');
  const [opts, setOpts] = useState({ lock: true, notes: false });
  const [sent, setSent] = useState(false);
  const pickCount = VIDS.filter((v) => picks[v.id]).length;

  return (
    <Layout section="Products" crumbs={['Moyou London', 'Red Alert Gel Nail Strip', 'Batch 4']} screen="Deliver" guide>
      <Stepper current={6} />
      <section className="stack" style={{ gap: 12 }}>
        <span className="eyebrow">Step 07 · Deliver</span>
        <h1 className="h1">Get it to the client.</h1>
        <p className="lede">Send a review link so the client can approve, reject and comment on each video, hand over the files, or post to our own channels. Pick whichever fits this job.</p>
      </section>

      <Guide
        items={[
          ["What it's for", 'Getting the finished videos to whoever needs them.'],
          ['What you do', 'Most client jobs: pick "Client review link", tick the videos, add the reviewer and press Send. Use "Download files" for a plain hand-off. Publishing is only for accounts we run.'],
          ['What happens next', 'The client\'s approvals and comments appear in the feedback table below. "Fix in Director" sends change requests back to be remade.']
        ]}
        terms={<><span><b>Round</b> = one review cycle. Fixes go out as round 2, and so on.</span><span>Use "Preview what the client sees" to check the client's view before sending.</span></>}
      />

      <div className="grid-auto" role="group" aria-label="Delivery route" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {ROUTES.map((r) => (
          <button key={r.id} type="button" className={'pick' + (r.id === route ? ' on' : '')} style={{ padding: 18, gap: 10 }} aria-pressed={r.id === route} onClick={() => setRoute(r.id)}>
            <span className="row between" style={{ gap: 8 }}><span style={{ fontSize: 16, fontWeight: 600 }}>{r.title}</span><span className={'pill ' + r.tagCls}>{r.tag}</span></span>
            <span className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{r.about}</span>
          </button>
        ))}
      </div>

      {route === 'review' && (
        <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
          <section className="card" style={{ flex: '999 1 460px', minWidth: 0, overflow: 'hidden' }}>
            <div className="row between" style={{ padding: '16px 18px' }}><h2 style={{ fontSize: 16, fontWeight: 600 }}>Videos to send</h2><span className="faint" style={{ fontSize: 13 }}>{pickCount} of {VIDS.length} selected</span></div>
            {VIDS.map((v) => {
              const on = !!picks[v.id];
              return (
                <button key={v.id} type="button" className="row" aria-pressed={on} onClick={() => { setPicks({ ...picks, [v.id]: !on }); setSent(false); }}
                  style={{ gap: 12, width: '100%', padding: '10px 12px', border: 0, borderTop: '1px solid var(--line)', background: 'transparent', color: 'var(--text)', textAlign: 'left', cursor: 'pointer' }}>
                  <span className={'box' + (on ? ' on' : '')}>{on && <Icon.check size={12} sw={3.4} />}</span>
                  <span style={{ flex: 'none', width: 36, height: 52, borderRadius: 7, background: v.bg, border: '1px solid var(--line-3)' }} />
                  <span className="stack" style={{ flex: 1, minWidth: 0, gap: 3 }}><span style={{ fontWeight: 500 }}>{v.title}</span><span className="faint" style={{ fontSize: 12 }}>{v.recipe} · {v.len} · 9:16, 4:5</span></span>
                </button>
              );
            })}
          </section>

          <aside className="card stack" style={{ flex: '1 1 360px', minWidth: 0, padding: 20, gap: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Review link settings</h2>
            <div className="stack" style={{ gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Reviewers</span>
              <div className="row wrap" style={{ gap: 8 }}><span className="pill" style={{ minHeight: 30, padding: '0 12px' }}>[client reviewer email]</span><span className="pill" style={{ minHeight: 30, padding: '0 12px', borderStyle: 'dashed' }}>+ Add reviewer</span></div>
              <span className="faint" style={{ fontSize: 12 }}>No login needed. Each reviewer gets their own link so comments show who wrote them.</span>
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <label htmlFor="msg" style={{ fontSize: 13, fontWeight: 600 }}>Message</label>
              <textarea id="msg" className="in" value={msg} onChange={(e) => setMsg(e.target.value)} style={{ minHeight: 84, fontSize: 14 }} />
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Review due</span>
              <div className="segs" role="group" aria-label="Review due">
                {[['1d', 'Tomorrow'], ['3d', 'In 3 days'], ['7d', 'Next week']].map(([id, l]) => <button key={id} type="button" className={'seg' + (due === id ? ' on' : '')} onClick={() => setDue(id)}>{l}</button>)}
              </div>
            </div>
            {[['lock', 'Files can only be downloaded once approved'], ['notes', 'Show our internal quality notes to the client']].map(([id, l]) => (
              <button key={id} type="button" className="toggle-row" aria-pressed={opts[id]} onClick={() => setOpts({ ...opts, [id]: !opts[id] })}>
                <span className={'switch' + (opts[id] ? ' on' : '')} />{l}
              </button>
            ))}
            <button type="button" className="btn primary" style={{ minHeight: 50 }} onClick={() => setSent(true)}><Icon.send size={16} />{sent ? 'Sent' : 'Send review link'}</button>
            {sent && (
              <div className="stack" style={{ gap: 10, padding: 14, borderRadius: 12, background: 'rgba(198,244,50,0.08)', border: '1px solid rgba(198,244,50,0.3)' }}>
                <span style={{ fontSize: 14, color: 'var(--lime-hover)' }}>Round 2 sent with {pickCount} videos. You'll get a notification as soon as the client starts reviewing.</span>
                <div className="row" style={{ gap: 8, padding: '8px 10px', borderRadius: 9, background: '#0B0B0E', border: '1px solid #26262D' }}>
                  <span className="mono faint" style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>[review link]/review/moyou-batch-4-round-2</span>
                  <span className="pill">Copy</span>
                </div>
              </div>
            )}
            <Link className="btn" to="/review/moyou-batch-4-round-2">Preview what the client sees</Link>
          </aside>
        </div>
      )}

      {route === 'download' && (
        <section className="card stack" style={{ padding: 20, gap: 14, maxWidth: 760 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Download package</h2>
          <div className="sub stack">
            {[['6 videos × 9:16 and 4:5', '12 files · 284 MB'], ['Captions as .srt', '6 files'], ['Thumbnails and ad copy sheet', '7 files']].map(([a, b], n) => (
              <div key={a} className="row between" style={{ gap: 10, padding: '12px 14px', fontSize: 14, borderTop: n ? '1px solid var(--line)' : 0 }}><span>{a}</span><span className="mono faint">{b}</span></div>
            ))}
          </div>
          <span className="faint" style={{ fontSize: 13 }}>Tip: if the client still needs to sign off, send a review link first. Approved videos are bundled automatically.</span>
          <button type="button" className="btn primary" style={{ alignSelf: 'flex-start' }}>Download .zip</button>
        </section>
      )}

      {route === 'publish' && (
        <section className="card row wrap" style={{ padding: 20, gap: 16, maxWidth: 760 }}>
          <div className="stack" style={{ flex: '1 1 300px', gap: 6 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Publish to our channels</h2>
            <span className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>Only for brands where we run the accounts. Schedule to TikTok, Reels and Shorts, then promote the winners.</span>
          </div>
          <Link className="btn primary" to="/product/publish">Open publishing</Link>
        </section>
      )}

      <section className="card" style={{ overflow: 'hidden' }}>
        <div className="row wrap between" style={{ padding: '16px 18px', gap: 10 }}>
          <div className="stack" style={{ gap: 4 }}><h2 style={{ fontSize: 16, fontWeight: 600 }}>Round 1 · client feedback</h2><span className="faint" style={{ fontSize: 13 }}>Sent Sat 3 Oct · 4 of 6 reviewed</span></div>
          <div className="row wrap" style={{ gap: 8 }}><span className="pill green">2 approved</span><span className="pill red">2 changes requested</span><span className="pill">2 waiting</span></div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 640 }}>
            <div className="th" style={{ gridTemplateColumns: TCOLS, background: 'var(--sub)' }}><span>Video</span><span>Client decision</span><span>Comments</span><span /></div>
            {ROUND1.map((r) => (
              <div key={r.title} className="list-row" style={{ gridTemplateColumns: TCOLS, cursor: 'default' }}>
                <span className="stack" style={{ gap: 3, minWidth: 0 }}><span style={{ fontWeight: 500 }}>{r.title}</span><span className="faint" style={{ fontSize: 12 }}>{r.latest}</span></span>
                <span><span className={'pill ' + r.cls}>{r.status}</span></span>
                <span className="mono muted">{r.comments}</span>
                <span className="row" style={{ justifyContent: 'flex-end' }}>
                  {r.fix ? <Link className="btn sm" to="/product/director">Fix in Director</Link> : <Link className="btn sm" to="/review/moyou-batch-4-round-1">Open review</Link>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
