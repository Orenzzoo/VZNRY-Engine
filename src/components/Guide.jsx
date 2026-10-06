import { Icon } from './Icons.jsx';

// Small inline tip with an info icon, e.g. under a section heading.
export function Hint({ children }) {
  return <span className="hint"><Icon.info size={14} />{children}</span>;
}
