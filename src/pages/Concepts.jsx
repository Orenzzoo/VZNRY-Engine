import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { BRIEF_STEPS } from '../components/Stepper.jsx';
import { Icon } from '../components/Icons.jsx';
import { EXAMPLES, BriefSource, useExample, useEpisodes } from './briefExamples.jsx';

const STATUS_CLS = { Verified: 'green', 'Needs check': 'amber', 'Varies by store': 'amber', 'Ask client': 'amber', Blocked: 'red' };
// One-click additions to the prompt.
const STARTERS = ['Open with a question', 'End on a cliffhanger', 'Add a plot twist', 'Use a trending sound', 'Make it funny', 'Show the product early'];

function EpisodeCard({ c, on, onToggle, onRemove }) {
  return (
    <div className={'pick' + (on ? ' on' : '')} style={{ padding: 16, position: 'relative' }}>
      <button type="button" aria-pressed={on} onClick={onToggle} className="stack" style={{ gap: 12, border: 0, background: 'none', padding: 0, color: 'inherit', font: 'inherit', textAlign: 'left', cursor: 'pointer', width: '100%' }}>
        <span className="row between"><span className="mono faint" style={{ fontSize: 12 }}>{c.ep}</span><span className={'box' + (on ? ' on' : '')} style={{ width: 22, height: 22 }}>{on && <Icon.check size={13} sw={3.2} />}</span></span>
        <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{c.title}</span>
        <span className="sub" style={{ display: 'block', padding: '10px 12px', fontSize: 13, lineHeight: 1.45, color: '#D4D4D8' }}>"{c.hook}"</span>
        <span className="row wrap" style={{ gap: 6 }}><span className={'pill' + (c.custom ? ' lime' : '')}>{c.angle}</span><span className={'pill ' + c.factCls}>{c.fact}</span></span>
      </button>
      {onRemove && <button type="button" className="mini" onClick={onRemove} style={{ position: 'absolute', right: 48, top: 12, minHeight: 26, padding: '0 8px', fontSize: 11 }}>Remove</button>}
    </div>
  );
}

export default function Concepts() {
  const [exId] = useExample();
  const ex = EXAMPLES[exId];
  const eps = useEpisodes(exId);
  const [verAll, setVerAll] = useState({});
  const [prompt, setPrompt] = useState('');
  const ver = verAll[exId] || {};
  const selCount = eps.selected.length;

  // Turns the prompt into an episode card. In the real build the engine writes the title, hook and claim check from it.
  const addEpisode = () => {
    const text = prompt.trim();
    if (!text) return;
    const n = eps.custom.length + 1;
    const words = text.replace(/\s+/g, ' ').split(' ');
    eps.add({ id: 'u' + Date.now(), ep: `YOURS ${String(n).padStart(2, '0')}`, title: words.slice(0, 6).join(' ') + (words.length > 6 ? '…' : ''), hook: text, angle: 'Your idea', fact: 'Checked after writing', factCls: 'amber', custom: true });
    setPrompt('');
  };
  const addStarter = (s) => setPrompt((p) => (p.trim() ? `${p.trim().replace(/[.]?$/, '.')} ${s}.` : `${s}.`));

  return (
    <Layout section="Custom videos" crumbs={['Custom videos', ex.name]} screen="Episodes" brand={{ name: ex.client, color: ex.dot }}>
      <Stepper steps={BRIEF_STEPS.map((s) => ({ ...s, to: `${s.to}?ex=${exId}` }))} current={1} />
      <PageHead title="Pick or write your episodes." lede="Choose from the suggested episodes, or describe your own in a prompt. Every episode keeps the same locked promo; only the story changes." right={<BriefSource exId={exId} />} />

      {ex.empty && <div className="notice">This idea is still blank, so the suggestions are empty slots. <Link to="/custom/new?ex=blank" style={{ fontWeight: 600 }}>Describe your idea</Link> and the engine suggests real episodes, or write your own below.</div>}

      <div className="card row wrap" style={{ padding: '16px 20px', gap: 16 }}>
        <span className="pill lime">Locked promo</span>
        <span style={{ flex: '1 1 300px', fontSize: 15, lineHeight: 1.45 }}>{ex.promo}</span>
        <span className="mono faint" style={{ fontSize: 12 }}>{ex.promoSlot}</span>
      </div>

      <div className="row wrap" style={{ gap: 20, alignItems: 'flex-start' }}>
        <div className="stack" style={{ flex: '999 1 540px', minWidth: 0, gap: 28 }}>
          <section className="stack" style={{ gap: 12 }}>
            <div className="row between"><h2 className="h2">Suggested {ex.conceptsTitle.toLowerCase()}</h2><span className="faint" style={{ fontSize: 13 }}>Written by the engine from your idea</span></div>
            <div className="grid-auto stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))' }}>
              {ex.concepts.map((c) => <EpisodeCard key={c.id} c={c} on={!!eps.picks[c.id]} onToggle={() => eps.toggle(c.id)} />)}
            </div>
          </section>

          <section className="stack" style={{ gap: 12 }}>
            <div className="row between"><h2 className="h2">Create your own episode</h2><span className="faint" style={{ fontSize: 13 }}>Describe it like a prompt</span></div>
            <div className="prompt-box">
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); addEpisode(); } }}
                aria-label="Describe your episode" placeholder={`Describe the episode: how it opens, what happens, how it ends.\ne.g. "${ex.empty ? 'A barista spills coffee on a customer, then saves the day with our product.' : ex.concepts[0].hook}"`} />
              <div className="row wrap between" style={{ gap: 10 }}>
                <div className="row wrap" style={{ gap: 6 }}>
                  {STARTERS.map((s) => <button key={s} type="button" className="chip" style={{ minHeight: 30, fontSize: 12, padding: '0 10px' }} onClick={() => addStarter(s)}>+ {s}</button>)}
                </div>
                <span className="row" style={{ gap: 10 }}>
                  <span className="faint mono" style={{ fontSize: 11 }}>Ctrl ↵</span>
                  <button type="button" className={'btn sm ' + (prompt.trim() ? 'primary' : 'off')} disabled={!prompt.trim()} onClick={addEpisode}><Icon.sparkle />Add episode</button>
                </span>
              </div>
            </div>
            {eps.custom.length > 0 && (
              <div className="grid-auto stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))' }}>
                {eps.custom.map((c) => <EpisodeCard key={c.id} c={c} on={!!eps.picks[c.id]} onToggle={() => eps.toggle(c.id)} onRemove={() => eps.remove(c.id)} />)}
              </div>
            )}
          </section>
        </div>

        <aside className="card" style={{ flex: '1 1 300px', minWidth: 0, overflow: 'hidden' }}>
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
        <Link className="btn" to={`/custom/new?ex=${exId}`}>Back to idea</Link>
        <Link className={'btn ' + (selCount ? 'primary' : 'off')} to={selCount ? `/custom/cast?ex=${exId}` : '#'} onClick={(e) => !selCount && e.preventDefault()}>{selCount ? `Choose look and cast for ${selCount}` : 'Pick at least one episode'} <Icon.arrow /></Link>
      </div>
    </Layout>
  );
}
