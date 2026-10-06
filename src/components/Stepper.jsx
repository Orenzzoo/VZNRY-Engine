import { Link } from 'react-router-dom';

// Researcher: from a product link to a researched product assigned to an editor.
export const PRODUCT_STEPS = [
  { to: '/product/new', label: 'Link' },
  { to: '/product/brand-kit', label: 'Brand kit' },
  { to: '/product/research', label: 'Research' },
  { to: '/product/handoff', label: 'Assign' }
];

// Editor: custom videos (no product page): idea → episodes → look → generate.
export const BRIEF_STEPS = [
  { to: '/custom/new', label: 'Idea' },
  { to: '/custom/episodes', label: 'Episodes' },
  { to: '/custom/cast', label: 'Look & cast' },
  { to: '/custom/generate', label: 'Generate' }
];

// Editor: from an assigned task to videos with the client.
export const EDITOR_STEPS = [
  { to: '/tasks', label: 'Task' },
  { to: '/generate', label: 'Generate' },
  { to: '/tasks', label: 'Researcher review' },
  { to: '/product/deliver', label: 'Deliver' }
];

// `current` is the zero-based index of the active step.
export default function Stepper({ steps = PRODUCT_STEPS, current }) {
  return (
    <nav className="stepper" aria-label="Steps">
      {steps.map((s, i) => (
        <Link key={s.label} to={s.to} className={'st' + (i < current ? ' done' : i === current ? ' on' : '')} aria-current={i === current ? 'step' : undefined}>
          <span className="bar" />
          <span><span className="mono">{String(i + 1).padStart(2, '0')}</span> {s.label}</span>
        </Link>
      ))}
    </nav>
  );
}
