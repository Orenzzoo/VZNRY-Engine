import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper from '../components/Stepper.jsx';
import Guide, { Hint } from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';

const PHRASES = [
  { id: 'p1', type: 'pain', text: 'My gels look amazing for a week, then I wreck my nails getting them off.', stage: 'Problem aware', source: 'Reddit', count: 'seen 214×' },
  { id: 'p2', type: 'pain', text: "I can't justify £40 every two weeks at the salon any more.", stage: 'Problem aware', source: 'TikTok', count: 'seen 167×' },
  { id: 'p3', type: 'desire', text: 'I just want nails that look done for the wedding without booking anything.', stage: 'Solution aware', source: 'TikTok', count: 'seen 129×' },
  { id: 'p4', type: 'objection', text: 'Strips always lift at the edges by day two.', stage: 'Solution aware', source: 'Amazon', count: 'seen 301×' },
  { id: 'p5', type: 'objection', text: 'Will it look fake up close?', stage: 'Product aware', source: 'TikTok', count: 'seen 96×' },
  { id: 'p6', type: 'aha', text: 'Peeled them off and my nails were actually fine underneath.', stage: 'Most aware', source: 'Reviews', count: 'seen 88×' },
  { id: 'p7', type: 'desire', text: 'Something I can do on the sofa in fifteen minutes.', stage: 'Solution aware', source: 'Reviews', count: 'seen 74×' }
];
const TYPE = { pain: ['Pain', 'red'], desire: ['Desire', 'blue'], objection: ['Objection', 'amber'], aha: ['Aha moment', 'green'] };
const SOURCES = [['TikTok comments', 4120, '#C6F432'], ['Amazon and site reviews', 3306, '#60A5FA'], ['Reddit posts', 2871, '#A78BFA'], ['Competitor ads', 185, '#FB923C']];
const PERSONAS = [
  { init: 'EP', bg: '#3A1D22', fg: '#FCA5A5', name: 'The event-week planner', who: 'Wedding, party or holiday soon', wants: 'nails that look done without booking.', worries: 'edges lifting in photos.', angle: 'occasion transformation', share: 44 },
  { init: 'LS', bg: '#1C2A40', fg: '#93C5FD', name: 'The lapsed salon regular', who: 'Quit gels over cost or damage', wants: 'the salon look without the bill.', worries: 'damage at removal.', angle: 'removal reassurance', share: 31 }
];

export default function Research() {
  const [filter, setFilter] = useState('all');
  const [pins, setPins] = useState({ p1: true, p3: true });
  const shown = PHRASES.filter((p) => filter === 'all' || p.type === filter);
  const pinCount = Object.values(pins).filter(Boolean).length;

  return (
    <Layout section="Products" crumbs={['Moyou London', 'Red Alert Gel Nail Strip']} screen="Buyer research" guide>
      <Stepper current={2} />
      <PageHead eyebrow="Step 03 · Research" title="What buyers actually say." lede="Before writing a single ad, the engine reads what real people say about products like this one, so your ads sound like a buyer talking, not like an ad." />

      <Guide title="What is research for? How it turns into your ads">
        <div className="stack" style={{ padding: '2px 16px 18px', gap: 14 }}>
          <div className="flow">
            {[['1 · Read', 'The engine reads thousands of comments and reviews about this kind of product.'], ['2 · Sort', 'It pulls out the lines people repeat: what annoys them, what they want, why they hesitate.'], ['3 · You pin (optional)', 'Pin the lines you like best. Pinned lines get used first.']].map(([k, v]) => (
              <span key={k} style={{ display: 'contents' }}>
                <div className="fstep"><span className="gk" style={{ margin: 0 }}>{k}</span><span className="gv">{v}</span></div>
                <div className="farrow" aria-hidden="true"><Icon.arrow size={18} sw={2} /></div>
              </span>
            ))}
            <div className="fstep" style={{ borderColor: 'rgba(198,244,50,0.35)' }}><span className="gk" style={{ margin: 0, color: 'var(--lime-hover)' }}>4 · Becomes your hook</span><span className="gv">The first line of an ad, in the buyer's own words. You'll see it in the Director's script.</span></div>
          </div>
          <div className="sub row wrap" style={{ padding: '14px 16px', gap: '10px 18px', fontSize: 14, lineHeight: 1.5 }}>
            <span className="faint">Example</span>
            <span>A Reddit comment says <span style={{ color: 'var(--text)' }}>"I wreck my nails getting them off"</span></span>
            <Icon.arrow style={{ color: 'var(--faint)' }} />
            <span>The ad opens with <span style={{ color: 'var(--lime-hover)' }}>"My gels look amazing for a week, then I wreck my nails getting them off."</span></span>
          </div>
          <div className="gterms">
            <span><b>Do I need to do anything?</b> No. It runs by itself in about 3 minutes. Pinning is optional.</span>
            <span><b>Awareness stage</b> = how ready the buyer is. Early-stage buyers get the problem first; ready buyers get proof first.</span>
            <span><b>Persona</b> = a type of buyer. Each one gets its own ads.</span>
          </div>
        </div>
      </Guide>

      <div className="card stack" style={{ padding: '22px 24px', gap: 16 }}>
        <div className="row wrap between" style={{ alignItems: 'baseline', gap: 12 }}>
          <div className="row" style={{ alignItems: 'baseline', gap: 12 }}><span className="mono" style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-0.02em' }}>10,482</span><span className="muted" style={{ fontSize: 14 }}>comments and reviews read in 3 min 12 s · where they came from</span></div>
          <span className="pill lime">Refreshes weekly</span>
        </div>
        <div className="row" style={{ height: 10, borderRadius: 10, overflow: 'hidden', gap: 3 }}>
          {SOURCES.map(([n, v, c]) => <div key={n} style={{ flex: v, background: c, minWidth: 6, height: '100%' }} />)}
        </div>
        <div className="row wrap" style={{ gap: 20, fontSize: 13 }}>
          {SOURCES.map(([n, v, c]) => <span key={n} className="row" style={{ gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c }} />{n} <span className="mono faint">{v.toLocaleString()}</span></span>)}
        </div>
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="card" style={{ flex: '999 1 520px', minWidth: 0, overflow: 'hidden' }}>
          <div className="stack" style={{ padding: 18, gap: 14 }}>
            <div className="row wrap between" style={{ gap: 12 }}>
              <div className="stack" style={{ gap: 4 }}>
                <h2 className="h2">What buyers say <span className="faint" style={{ fontWeight: 400 }}>· becomes your hooks</span></h2>
                <Hint>Real lines from real comments. Pin the ones that sound most like your customer.</Hint>
              </div>
              <span className="pill lime mono">{pinCount} pinned</span>
            </div>
            <div className="row wrap" role="group" aria-label="Filter phrases" style={{ gap: 8 }}>
              {[['all', 'All'], ['pain', 'Pains'], ['desire', 'Desires'], ['objection', 'Objections'], ['aha', 'Aha moments']].map(([id, l]) => (
                <button key={id} type="button" className={'chip' + (filter === id ? ' on' : '')} onClick={() => setFilter(id)}>{l}</button>
              ))}
            </div>
          </div>
          {shown.map((p) => {
            const on = !!pins[p.id];
            return (
              <div key={p.id} className="row wrap" style={{ padding: 18, gap: 14, alignItems: 'flex-start', borderTop: '1px solid var(--line)' }}>
                <div className="stack" style={{ flex: '999 1 320px', minWidth: 0, gap: 10 }}>
                  <p style={{ fontSize: 16, lineHeight: 1.45 }}>"{p.text}"</p>
                  <div className="row wrap" style={{ gap: 8 }}>
                    <span className={'pill ' + TYPE[p.type][1]}>{TYPE[p.type][0]}</span>
                    <span className="pill" title="How ready this buyer is to buy. Early stages get problem-first hooks; later stages get proof-first hooks.">{p.stage}</span>
                    <span className="faint" style={{ fontSize: 12 }}>{p.source} · {p.count}</span>
                  </div>
                </div>
                <button type="button" className={'btn sm' + (on ? ' primary' : '')} style={{ minHeight: 40 }} aria-pressed={on} onClick={() => setPins({ ...pins, [p.id]: !on })}><Icon.pin />{on ? 'Pinned' : 'Pin'}</button>
              </div>
            );
          })}
        </section>

        <aside className="stack" style={{ flex: '1 1 300px', minWidth: 0, gap: 14 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="h2">Who's buying</h2>
            <Hint>The two main types of buyer found in the comments. The batch is split between them, each with its own angle.</Hint>
          </div>
          {PERSONAS.map((p) => (
            <div key={p.name} className="card stack" style={{ padding: 20, gap: 14 }}>
              <div className="row" style={{ gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: p.bg, color: p.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{p.init}</div>
                <div className="stack" style={{ gap: 2 }}><span style={{ fontWeight: 600 }}>{p.name}</span><span className="faint" style={{ fontSize: 13 }}>{p.who}</span></div>
              </div>
              <div className="stack" style={{ gap: 8, fontSize: 14, lineHeight: 1.45 }}>
                <div><span className="faint">Wants </span>{p.wants}</div>
                <div><span className="faint">Worries </span>{p.worries}</div>
                <div><span className="faint">Best angle </span>{p.angle}</div>
              </div>
              <div className="stack" style={{ gap: 6 }}>
                <div className="row between" style={{ fontSize: 12 }}><span className="faint">Share of signals</span><span className="mono">{p.share}%</span></div>
                <div style={{ height: 6, borderRadius: 6, background: 'var(--line)' }}><div style={{ width: p.share + '%', height: '100%', borderRadius: 6, background: 'var(--lime)' }} /></div>
              </div>
            </div>
          ))}
        </aside>
      </div>

      <div className="row wrap between" style={{ gap: 12 }}>
        <Link className="btn" to="/product/brand-kit">Back</Link>
        <Link className="btn primary" to="/product/formats">Choose formats <Icon.arrow /></Link>
      </div>
    </Layout>
  );
}
