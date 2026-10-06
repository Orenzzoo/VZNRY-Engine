import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';

const SLOT = { hook: ['#C6F432', '#0B0B0F'], body: ['#2A2A31', '#F4F4F5'], cta: ['#60A5FA', '#0B0B0F'] };
const slot = (label, w, kind) => ({ label, w, kind });
const RECIPES = [
  { id: 'ugc', kind: 'video', name: 'AI UGC talking head', owner: 'Arland', tuned: '2 days ago', pass: '86%', hold: '34%', uses: '412', status: 'Live', statusCls: 'green', thumb: '#3B2A22',
    about: 'A presenter talks to camera about a real moment, then shows the product working.', length: '15–20 s',
    slots: [slot('Hook', 3, 'hook'), slot('Problem', 4, 'body'), slot('Demo', 8, 'body'), slot('CTA', 3, 'cta')],
    routes: [['Talking to camera', 'Avatar lip-sync'], ['Hands and product', 'Image to video'], ['End card', 'Composed in code']],
    prompt: 'Vertical 9:16 phone footage, {character} in {setting},\nnatural window light, slight handheld shake.\nThey say: "{hook_line}"\nProduct reference: {cutout}. Keep colour exact.\nAvoid: studio lighting, extra fingers, logos.', passN: 17 },
  { id: 'wot', kind: 'video', name: 'Wall of text', owner: 'Jerome', tuned: '1 week ago', pass: '97%', hold: '41%', uses: '388', status: 'Live', statusCls: 'green', thumb: '#24252C',
    about: 'One honest paragraph in bold captions over a looping, low-key clip.', length: '8–12 s',
    slots: [slot('Text on loop', 10, 'hook')],
    routes: [['Background loop', 'Text to video'], ['Caption layer', 'Composed in code']],
    prompt: 'Calm 9:16 loop, {everyday_moment}, muted colours,\nno faces, no text in frame.\nOverlay paragraph from VoC phrase: "{phrase}"', passN: 19 },
  { id: 'broll', kind: 'video', name: 'Product B-roll', owner: 'Willem', tuned: '4 days ago', pass: '81%', hold: '29%', uses: '196', status: 'Live', statusCls: 'green', thumb: '#4A0F18',
    about: 'Four macro product shots cut to a beat, captions carry the message.', length: '10–14 s',
    slots: [slot('Shot 1', 3, 'hook'), slot('Shot 2', 3, 'body'), slot('Shot 3', 3, 'body'), slot('Price', 3, 'cta')],
    routes: [['Macro product', 'Image to video'], ['Captions and price', 'Composed in code']],
    prompt: 'Macro shot of {cutout} on {surface},\nslow push-in, shallow depth of field,\nsoft daylight, 9:16. Product colour must match exactly.', passN: 16 },
  { id: 'static', kind: 'static', name: 'Static ad', owner: 'Lorenz', tuned: '3 days ago', pass: '99%', hold: '—', uses: '640', status: 'Live', statusCls: 'green', thumb: '#3A2426',
    about: 'Headline, product, one proof point and the offer, laid out on brand.', length: 'Image',
    slots: [slot('Headline', 3, 'hook'), slot('Product', 4, 'body'), slot('Proof', 3, 'body'), slot('Offer', 2, 'cta')],
    routes: [['Background scene', 'Image model'], ['Layout and type', 'Composed in code']],
    prompt: 'Background: {setting}, brand colours {palette},\nempty space top third for headline.\nHeadline from top pinned phrase.', passN: 20 },
  { id: 'native', kind: 'video', name: 'Native story', owner: 'David', tuned: '2 weeks ago', pass: '93%', hold: '37%', uses: '154', status: 'Live', statusCls: 'green', thumb: '#1E2638',
    about: 'Looks like a notes app or a group chat, so it reads as a post, not an ad.', length: '8–12 s',
    slots: [slot('Message 1', 3, 'hook'), slot('Messages', 6, 'body'), slot('Reveal', 3, 'cta')],
    routes: [['Chat UI', 'Composed in code'], ['Reveal clip', 'Image to video']],
    prompt: 'Group chat between friends, casual typos allowed.\nProblem from VoC: "{phrase}".\nLast message shows the product result.', passN: 18 },
  { id: 'ba', kind: 'video', name: 'Before and after', owner: 'Arland', tuned: 'yesterday', pass: '78%', hold: '31%', uses: '88', status: 'Testing', statusCls: 'amber', thumb: '#33281F',
    about: 'Answers an objection head on by showing the same thing before and after.', length: '12–16 s',
    slots: [slot('Objection', 3, 'hook'), slot('Before', 4, 'body'), slot('After', 5, 'body'), slot('CTA', 2, 'cta')],
    routes: [['Presenter', 'Avatar lip-sync'], ['Split screen', 'Image to video']],
    prompt: 'Split 9:16 frame, identical hand pose both sides.\nLeft: {before_state}. Right: {after_state}.\nSame lighting, same angle, same nail shape.', passN: 15 },
  { id: 'green', kind: 'video', name: 'Green-screen reaction', owner: 'Lorenz', tuned: 'draft', pass: '—', hold: '—', uses: '0', status: 'Draft', statusCls: '', thumb: '#1F2A22',
    about: 'Presenter reacts in front of a screenshot of a comment, review or competitor ad.', length: '10–15 s',
    slots: [slot('Comment', 3, 'hook'), slot('Reaction', 7, 'body'), slot('CTA', 2, 'cta')],
    routes: [['Presenter cut-out', 'Avatar lip-sync'], ['Background', 'Composed in code']],
    prompt: '{character} in front of screenshot: "{comment}".\nPoints at it, reacts, answers in one line.', passN: 0 }
];
const COLS = 'minmax(0,2.2fr) 90px 90px 90px 110px';

export default function Recipes() {
  const [filter, setFilter] = useState('all');
  const [id, setId] = useState('ugc');
  const shown = RECIPES.filter((r) => filter === 'all' || (filter === 'draft' ? r.status !== 'Live' : r.kind === filter));
  const sel = RECIPES.find((r) => r.id === id);

  return (
    <Layout section="Recipes" crumbs={['Visionary Studios', 'Recipes']}>
      <PageHead
        eyebrow="Workspace · Recipes"
        title="Formats the team has tuned."
        lede="A recipe is written and tested once by someone good at prompting, then anyone can use it with one click. Shared across every brand."
        right={<Link className="btn primary" to="/recipes/editor"><Icon.plus />New recipe from my prompt</Link>}
      />

      <div className="row wrap" role="group" aria-label="Filter recipes" style={{ gap: 8 }}>
        {[['all', 'All'], ['video', 'Video'], ['static', 'Static'], ['draft', 'Drafts and testing']].map(([k, l]) => <button key={k} type="button" className={'chip' + (filter === k ? ' on' : '')} onClick={() => setFilter(k)}>{l}</button>)}
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card" style={{ flex: '999 1 540px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 620 }}>
              <div className="th" style={{ gridTemplateColumns: COLS }}>
                <span>Recipe</span><span title="Share of generated shots that pass the automatic quality check">QA pass ⓘ</span><span title="Share of viewers still watching after 3 seconds">Hold rate ⓘ</span><span>Uses</span><span>Status</span>
              </div>
              {shown.map((r) => (
                <button key={r.id} type="button" className={'list-row anim-in' + (r.id === id ? ' on' : '')} style={{ gridTemplateColumns: COLS }} onClick={() => setId(r.id)}>
                  <span className="row" style={{ gap: 12, minWidth: 0 }}>
                    <span style={{ flex: 'none', width: 34, height: 48, borderRadius: 7, background: r.thumb, border: '1px solid var(--line-3)' }} />
                    <span className="stack" style={{ gap: 3, minWidth: 0 }}><span style={{ fontWeight: 600 }}>{r.name}</span><span className="faint" style={{ fontSize: 12 }}>by {r.owner} · tuned {r.tuned}</span></span>
                  </span>
                  <span className="mono">{r.pass}</span><span className="mono">{r.hold}</span><span className="mono muted">{r.uses}</span>
                  <span><span className={'pill ' + r.statusCls}>{r.status}</span></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside key={id} className="card stack anim-in" style={{ flex: '1 1 340px', minWidth: 0, padding: 22, gap: 18 }}>
          <div className="stack" style={{ gap: 6 }}>
            <div className="row between" style={{ gap: 10 }}><h2 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{sel.name}</h2><span className={'pill ' + sel.statusCls}>{sel.status}</span></div>
            <span className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{sel.about}</span>
          </div>
          <div className="stack" style={{ gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Structure · {sel.length}</span>
            <div className="row" style={{ gap: 4, height: 34 }}>
              {sel.slots.map((s, i) => <div key={i} className="row" style={{ flex: s.w, height: '100%', borderRadius: 8, background: SLOT[s.kind][0], color: SLOT[s.kind][1], justifyContent: 'center', fontSize: 11, fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 4px' }}>{s.label}</div>)}
            </div>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Shot routing</span>
            {sel.routes.map(([shot, model]) => <div key={shot} className="row between" style={{ gap: 10, fontSize: 13 }}><span className="muted">{shot}</span><span className="pill blue">{model}</span></div>)}
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Prompt template</span>
            <pre className="mono sub" style={{ margin: 0, padding: 14, fontSize: 12, lineHeight: 1.6, color: '#C4C4CC', whiteSpace: 'pre-wrap' }}>{sel.prompt}</pre>
          </div>
          <div className="sub stack" style={{ padding: 14, gap: 8 }}>
            <div className="row between" style={{ fontSize: 13 }}><span className="muted">Last 20 test runs</span><span className="mono">{sel.passN ? `${sel.passN} of 20 passed` : 'Not tested yet'}</span></div>
            <div className="row" style={{ gap: 3 }}>{Array.from({ length: 20 }).map((_, i) => <div key={i} style={{ flex: 1, height: 18, borderRadius: 3, background: !sel.passN ? '#24242B' : i < sel.passN ? '#6B8A12' : '#7F1D1D' }} />)}</div>
          </div>
          <div className="row wrap" style={{ gap: 8 }}>
            <Link className="btn" to="/recipes/editor" style={{ flex: 1 }}>Edit prompt</Link>
            <Link className="btn primary" to="/generate" style={{ flex: 1 }}>Use in Generate</Link>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
