import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout, { PageHead } from '../components/Layout.jsx';
import Stepper, { EDITOR_STEPS } from '../components/Stepper.jsx';
import { Icon } from '../components/Icons.jsx';
import LaneBuilder from '../components/LaneBuilder.jsx';
import { FORMATS, formatById } from '../data/formats.js';
import { RESEARCH, STATUS, useWork, setTaskStatus, taskName, submitForReview } from '../data/work.js';
import { person, useCurrentUser } from '../data/team.jsx';

const DEFAULT_PROMPT = 'A {persona} films a selfie video at home, natural light, handheld, 9:16.\nThey say: "{hook}"\nShow {product} close up in their hand for at least 2 seconds.\n! Never show other brands or logos.';

function Builder({ task }) {
  const r = RESEARCH[task.research];
  const from = person(task.from);
  const known = task.formats.filter((f) => formatById(f));
  const others = task.formats.filter((f) => !formatById(f)); // "Other" formats the researcher typed in
  const [formatId, setFormatId] = useState(known[0] || 'ugc');
  const [mode, setMode] = useState(known.length === 0 && others.length ? 'prompt' : 'format');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [promptMode, setPromptMode] = useState('tweak');
  const formatName = mode === 'prompt' ? 'Your prompt' : formatById(formatId).name;

  return (
    <>
      <details className="card" open style={{ overflow: 'hidden' }}>
        <summary className="row wrap between" style={{ listStyle: 'none', cursor: 'pointer', padding: '16px 20px', gap: 10 }}>
          <span className="row" style={{ gap: 12 }}>
            <span className="avatar" style={{ width: 32, height: 32, fontSize: 13, background: from.color }}>{from.initials}</span>
            <span className="stack" style={{ gap: 2 }}>
              <span style={{ fontWeight: 600 }}>Research from {from.name}</span>
              <span className="faint" style={{ fontSize: 12 }}>{r.signals} · angle: {r.angle}</span>
            </span>
          </span>
          <span className="row" style={{ gap: 8 }}><span className={'pill ' + STATUS[task.status].cls}>{STATUS[task.status].label}</span><span className="pill">Due {task.due}</span></span>
        </summary>
        <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 12, padding: '0 20px 18px' }}>
          <div className="sub stack" style={{ padding: 14, gap: 8 }}>
            <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>The product</span>
            <span style={{ fontSize: 14, lineHeight: 1.5 }}>{r.summary}</span>
            <span className="faint" style={{ fontSize: 12 }}>{r.price} · {r.offer}</span>
          </div>
          <div className="sub stack" style={{ padding: 14, gap: 8 }}>
            <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>Pinned hooks</span>
            {r.hooks.slice(0, 3).map((x) => <span key={x} style={{ fontSize: 13, lineHeight: 1.45 }}>"{x}"</span>)}
          </div>
          <div className="sub stack" style={{ padding: 14, gap: 8 }}>
            <span className="gk" style={{ margin: 0, color: 'var(--faint)' }}>Rules</span>
            <span style={{ fontSize: 13, lineHeight: 1.45 }}><span className="faint">Must say </span>{r.mustSay}</span>
            <span style={{ fontSize: 13, lineHeight: 1.45 }}><span className="faint">Avoid </span>{r.avoid}</span>
            {task.note && <span style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--lime-hover)' }}>{from.name}: "{task.note}"</span>}
          </div>
        </div>
      </details>

      <section className="card stack" style={{ padding: 20, gap: 16 }}>
        <div className="row wrap between" style={{ gap: 12 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="h2">1. How should it look?</h2>
            <span className="muted" style={{ fontSize: 13 }}>Pick a tested format, or write your own prompt.</span>
          </div>
          <div className="segs" role="group" aria-label="Generate from" style={{ minWidth: 'min(320px, 100%)' }}>
            <button type="button" className={'seg' + (mode === 'format' ? ' on' : '')} aria-pressed={mode === 'format'} onClick={() => setMode('format')}>Choose a format</button>
            <button type="button" className={'seg' + (mode === 'prompt' ? ' on' : '')} aria-pressed={mode === 'prompt'} onClick={() => setMode('prompt')}>Your own prompt</button>
          </div>
        </div>
        {mode === 'format' && others.length > 0 && (
          <span className="faint" style={{ fontSize: 13 }}>{from.name} also suggested <b style={{ color: 'var(--text)' }}>{others.join(', ')}</b>, which isn't a saved format yet. <button type="button" onClick={() => setMode('prompt')} style={{ border: 0, background: 'none', padding: 0, color: 'var(--lime)', font: 'inherit', cursor: 'pointer' }}>Use your own prompt for it →</button></span>
        )}
        {mode === 'format' ? (
          <div key="f" className="grid-auto stagger" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(190px, 100%), 1fr))', gap: 10 }}>
            {FORMATS.map((f) => {
              const on = f.id === formatId;
              const tip = task.formats.includes(f.id);
              return (
                <button key={f.id} type="button" className={'pick' + (on ? ' on' : '')} aria-pressed={on} onClick={() => setFormatId(f.id)} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, gap: 12 }}>
                  <span style={{ flex: 'none', position: 'relative', width: 40, height: 64, borderRadius: 8, background: f.bg, border: '1px solid var(--line-3)' }} />
                  <span className="stack" style={{ gap: 4, minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</span>
                    <span className="faint" style={{ fontSize: 12, lineHeight: 1.35 }}>{f.about}</span>
                    {tip && <span className="pill lime" style={{ alignSelf: 'flex-start', fontSize: 11, minHeight: 20 }}>Suggested by {from.name}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div key="p" className="stack anim-in" style={{ gap: 10 }}>
            {others.length > 0 && <span className="notice" style={{ fontSize: 13 }}>{from.name} suggested a format that isn't in the list: <b>{others.join(', ')}</b>. Describe it in your prompt below.</span>}
            <label htmlFor="gen-prompt" className="sr-only">Your prompt</label>
            <textarea id="gen-prompt" className="in mono" value={prompt} onChange={(e) => setPrompt(e.target.value)} style={{ minHeight: 120, fontSize: 13 }} />
            <div className="row wrap between" style={{ gap: 10 }}>
              <span className="faint" style={{ fontSize: 12, lineHeight: 1.5 }}><span className="mono">{'{blanks}'}</span> are filled from the research. Lines starting with <span className="mono">!</span> are never changed.</span>
              <div className="segs" role="group" aria-label="Prompt mode" style={{ padding: 3 }}>
                <button type="button" className={'seg' + (promptMode === 'exact' ? ' on' : '')} style={{ minHeight: 34, fontSize: 12 }} onClick={() => setPromptMode('exact')}>Run exactly</button>
                <button type="button" className={'seg' + (promptMode === 'tweak' ? ' on' : '')} style={{ minHeight: 34, fontSize: 12 }} onClick={() => setPromptMode('tweak')} title="The engine adjusts your prompt for this product and explains every change.">Let the engine adapt it ⓘ</button>
              </div>
            </div>
            <Link to="/recipes/editor" style={{ fontSize: 13, fontWeight: 500 }}>Open the full prompt editor →</Link>
          </div>
        )}
      </section>

      <LaneBuilder pools={r} formatId={mode === 'prompt' ? null : formatId} formatName={formatName} onFirstGenerate={() => task.status === 'todo' && setTaskStatus(task.id, 'doing')}
        reviewerName={from.name} onSend={(ads) => submitForReview({ taskId: task.id, editor: task.editor, reviewer: task.from, ads })} doneTo={`/tasks?task=${task.id}`} />
    </>
  );
}

export default function Generate() {
  const user = useCurrentUser();
  const { tasks } = useWork();
  const [params, setParams] = useSearchParams();
  const mine = tasks.filter((t) => (user.role === 'editor' ? t.editor === user.id : true) && t.status !== 'done' && t.status !== 'client');
  const task = tasks.find((t) => t.id === params.get('task')) || mine.find((t) => t.status === 'fixes') || mine.find((t) => t.status === 'doing') || mine[0];
  const r = task && RESEARCH[task.research];

  return (
    <Layout section="Generate" crumbs={task ? [r.brand, r.product, task.title] : ['Generate']} brand={task ? { name: r.brand, color: r.dot } : undefined} screen="Generate">
      <Stepper steps={EDITOR_STEPS} current={1} />
      <PageHead
        eyebrow={task ? `Step 02 · Generate · ${taskName(task)}` : 'Step 02 · Generate'}
        title="Build your ads."
        lede="Review hooks, cores and CTAs, then stitch the approved ones into finished ads. One click makes a full first set."
        right={mine.length > 1 && (
          <div className="stack" style={{ gap: 6, minWidth: 'min(280px, 100%)' }}>
            <label htmlFor="gen-task" className="faint" style={{ fontSize: 12 }}>Working on task</label>
            <select id="gen-task" className="in" value={task ? task.id : ''} onChange={(e) => setParams({ task: e.target.value })} style={{ minHeight: 44 }}>
              {mine.map((t) => <option key={t.id} value={t.id}>{taskName(t)} · {STATUS[t.status].label}</option>)}
            </select>
          </div>
        )}
      />
      {task ? <Builder key={task.id} task={task} /> : (
        <div className="card stack" style={{ padding: 28, gap: 10, alignItems: 'flex-start' }}>
          <h2 className="h2">No open tasks</h2>
          <span className="muted" style={{ fontSize: 14 }}>When a researcher hands you a product, it shows up here ready to generate.</span>
          <Link className="btn" to="/tasks">Go to my tasks</Link>
        </div>
      )}
    </Layout>
  );
}
