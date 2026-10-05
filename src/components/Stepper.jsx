import { Link } from 'react-router-dom';

export const PRODUCT_STEPS = [
  { to: '/product/new', label: 'Link' },
  { to: '/product/brand-kit', label: 'Brand kit' },
  { to: '/product/research', label: 'Research' },
  { to: '/product/formats', label: 'Formats' },
  { to: '/product/director', label: 'Director' },
  { to: '/product/review', label: 'Review' },
  { to: '/product/deliver', label: 'Deliver' }
];

export const BRIEF_STEPS = [
  { to: '/briefs/new', label: 'Brief' },
  { to: '/briefs/concepts', label: 'Concepts' },
  { to: '/briefs/cast', label: 'Look & cast' },
  { to: '/product/director', label: 'Director' },
  { to: '/product/review', label: 'Review' },
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
