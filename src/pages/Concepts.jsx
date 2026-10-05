import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { BRIEF_STEPS } from '../components/Stepper.jsx';
import Guide from '../components/Guide.jsx';
import { Icon } from '../components/Icons.jsx';
import { EXAMPLES, BriefSource, useExample } from './briefExamples.jsx';

const STATUS_CLS = { Verified: 'green', 'Needs check': 'amber', 'Varies by store': 'amber', 'Ask client': 'amber', Blocked: 'red' };

export default function Concepts() {
  const [exId] = useExample();
  const ex = EXAMPLES[exId];
  const [picksAll, setPicksAll] = useState(() => Object.fromEntries(Object.entries(EXAMPLES).map(([id, e]) => [id, e.defaultPicks])));
  const [verAll, setVerAll] = useState({});
  const picks = picksAll[exId];
  const ver = verAll[exId] || {};
  const selCount = ex.concepts.filter((c) => picks[c.id]).length;

  return (
    <Layout section="Briefs" crumbs={['Briefs', ex.name]} screen="Concept board" brand={{ name: ex.client, color: ex.dot }} guide>
      <Stepper steps={BRIEF_STEPS.map((s) => ({ ...s, to: s.to.startsWith('/briefs') ? `${s.to}?ex=${exId}` : s.to }))} current={1} />
      <PageHead eyebrow="Briefs · Step 02" title="Pick the episodes to make." lede="Script options written from your brief. Every one keeps the same locked promo segment; only the story changes." right={<BriefSource exId={exId} />} />

      {ex.empty && <div className="notice">This brief is still blank, so these are empty slots. <Link to="/briefs/new?ex=blank" style={{ fontWeight: 600 }}>Add your idea to the brief</Link> and the engine writes 10–20 real options here.</div>}

      <Guide
        items={[
          ["What it's for", 'Picking which scripts from your brief actually get made.'],
          ['What you do', 'Click cards to select them. Check the panel on the right: facts marked "Needs check" must be confirmed before a script that uses them can go out.'],
          ['What happens next', 'Selected scripts go to Look and cast, where you choose who or what appears.']
        ]}
        terms={<span><b>Why fact check?</b> Ads that state false facts can get rejected by platforms or cause legal trouble. "Blocked" claims are never used.</span>}
      />

      <div className="card row wrap" style={{ padding: '16px 20px', gap: 16 }}>
        <span className="pill lime">Locked promo</span>
        <span style={{ flex: '1 1 300px', fontSize: 15, lineHeight: 1.45 }}>{ex.promo}</span>
        <span className="mono faint" style={{ fontSize: 12 }}>{ex.promoSlot}</span>
        <button type="button" className="btn">Edit promo</button>
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <section className="stack" style={{ flex: '999 1 540px', minWidth: 0, gap: 12 }}>
          <div className="row between"><h2 className="h2">{ex.conceptsTitle}</h2><span className="faint" style={{ fontSize: 13 }}>{selCount} of {ex.concepts.length} selected</span></div>
          <div className="grid-auto stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))' }}>
            {ex.concepts.map((c) => {
              const on = !!picks[c.id];
              return (
                <button key={c.id} type="button" className={'pick' + (on ? ' on' : '')} style={{ padding: 16 }} aria-pressed={on} onClick={() => setPicksAll({ ...picksAll, [exId]: { ...picks, [c.id]: !on } })}>
                  <span className="row between"><span className="mono faint" style={{ fontSize: 12 }}>{c.ep}</span><span className={'box' + (on ? ' on' : '')} style={{ width: 22, height: 22 }}>{on && <Icon.check size={13} sw={3.2} />}</span></span>
                  <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{c.title}</span>
                  <span className="sub" style={{ display: 'block', padding: '10px 12px', fontSize: 13, lineHeight: 1.45, color: '#D4D4D8' }}>"{c.hook}"</span>
                  <span className="row wrap" style={{ gap: 6 }}><span className="pill">{c.angle}</span><span className={'pill ' + c.factCls}>{c.fact}</span></span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="card" style={{ flex: '1 1 320px', minWidth: 0, overflow: 'hidden' }}>
          <div className="stack" style={{ padding: '18px 16px 12px', gap: 6 }}><h2 style={{ fontSize: 16, fontWeight: 600 }}>{ex.factsTitle}</h2><span className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>{ex.factsAbout}</span></div>
          {ex.facts.map((f) => {
            const status = ver[f.id] ? 'Verified' : f.status;
            return (
              <div key={f.id} className="stack" style={{ gap: 8, padding: '14px 16px', borderTop: '1px solid var(--line)' }}>
                <span style={{ fontSize: 14, lineHeight: 1.45 }}>{f.text}</span>
                <div className="row wrap between" style={{ gap: 8 }}>
                  <span className="row" style={{ gap: 8 }}><span className={'pill ' + (STATUS_CLS[status] || '')}>{status}</span><span className="faint" style={{ fontSize: 12 }}>{f.source}</span></span>
                  {status !== 'Verified' && status !== 'Blocked' && <button type="button" className="mini" onClick={() => setVerAll({ ...verAll, [exId]: { ...ver, [f.id]: true } })}>Mark verified</button>}
                </div>
              </div>
            );
          })}
        </aside>
      </div>

      <div className="row wrap between" style={{ gap: 12 }}>
        <Link className="btn" to={`/briefs/new?ex=${exId}`}>Back to brief</Link>
        <Link className="btn primary" to={`/briefs/cast?ex=${exId}`}>Choose look and cast for {selCount} <Icon.arrow /></Link>
      </div>
    </Layout>
  );
}
