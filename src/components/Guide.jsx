import { Icon } from './Icons.jsx';

// The blue "How this step works" panel. Pass `items` as [label, text] pairs, `terms` as JSX, or `children` for custom content.
export default function Guide({ title = 'How this step works', items = [], terms, children, open = true, style }) {
  return (
    <details className="guide" open={open} style={style}>
      <summary>
        <Icon.info />
        <span style={{ flex: 1 }}>{title}</span>
        <span className="gt-hide" style={{ fontSize: 12, fontWeight: 500, color: '#93C5FD' }}>Hide</span>
        <span className="gt-show" style={{ fontSize: 12, fontWeight: 500, color: '#93C5FD' }}>Show</span>
        <Icon.chevron className="chev" />
      </summary>
      {children || (
        <div className="gbody">
          {items.map(([k, v]) => (
            <div key={k}><span className="gk">{k}</span><p className="gv">{v}</p></div>
          ))}
          {terms && <div className="gterms">{terms}</div>}
        </div>
      )}
    </details>
  );
}

export function Hint({ children }) {
  return <span className="hint"><Icon.info size={14} />{children}</span>;
}
