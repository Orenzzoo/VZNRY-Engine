// Small stroke icons used across the app.
const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

function Svg({ size = 18, sw = 1.8, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={sw} aria-hidden="true" {...base} {...rest}>
      {children}
    </svg>
  );
}

export const Icon = {
  products: (p) => <Svg {...p}><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></Svg>,
  recipes: (p) => <Svg {...p}><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></Svg>,
  briefs: (p) => <Svg {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /><path d="M8 13h8M8 17h5" /></Svg>,
  characters: (p) => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="10" r="3" /><path d="M7 18a5 5 0 0 1 10 0" /></Svg>,
  review: (p) => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 12.5l3 3 5-6" /></Svg>,
  send: (p) => <Svg {...p}><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></Svg>,
  library: (p) => <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></Svg>,
  buyers: (p) => <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M21.5 20a6.5 6.5 0 0 0-4-6" /></Svg>,
  search: (p) => <Svg size={15} sw={2} {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Svg>,
  chevron: (p) => <Svg size={16} sw={2} {...p}><path d="M7 10l5 5 5-5" /></Svg>,
  arrow: (p) => <Svg size={16} sw={2.4} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>,
  check: (p) => <Svg size={16} sw={2.6} {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>,
  x: (p) => <Svg size={16} sw={2.4} {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>,
  plus: (p) => <Svg size={16} sw={2.4} {...p}><path d="M12 5v14M5 12h14" /></Svg>,
  info: (p) => <Svg size={18} sw={2} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></Svg>,
  lock: (p) => <Svg size={16} sw={2} {...p}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>,
  upload: (p) => <Svg size={16} sw={2.2} {...p}><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></Svg>,
  image: (p) => <Svg size={22} {...p}><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-8 9" /></Svg>,
  link: (p) => <Svg size={18} sw={2} {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></Svg>,
  pin: (p) => <Svg size={15} sw={2} {...p}><path d="M12 17v5" /><path d="M8 3h8l-1 6 3 4H6l3-4z" /></Svg>,
  play: ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>,
  sparkle: (p) => <Svg size={16} sw={2} {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" /></Svg>,
  bug: (p) => <Svg {...p}><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M9 3l1.5 3M15 3l-1.5 3M4 11h4M16 11h4M4 17h4M16 17h4M12 10v10" /></Svg>,
  home: (p) => <Svg {...p}><path d="M3 10.5L12 3l9 7.5" /><path d="M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9" /><path d="M10 21v-6h4v6" /></Svg>,
  bell: (p) => <Svg size={17} sw={2} {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></Svg>,
  settings: (p) => <Svg size={16} sw={2} {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></Svg>,
  logout: (p) => <Svg size={16} sw={2} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Svg>,
  user: (p) => <Svg size={16} sw={2} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></Svg>,
  message: (p) => <Svg size={16} sw={2} {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Svg>,
  wand: (p) => <Svg size={16} sw={2} {...p}><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M17.8 6.2L19 5M3 21l9-9M12.2 6.2L11 5" /></Svg>,
  tasks: (p) => <Svg {...p}><rect x="5" y="4" width="14" height="17" rx="2.5" /><path d="M9 4V3h6v1" /><path d="M9 11l2 2 4-4" /><path d="M9 17h6" /></Svg>,
  handoff: (p) => <Svg {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 11-4.7" /><path d="M15 17h7M19 14l3 3-3 3" /></Svg>,
  generate: (p) => <Svg {...p}><rect x="3" y="4" width="7" height="16" rx="2" /><rect x="14" y="4" width="7" height="16" rx="2" /><path d="M6.5 9.5v5M4 12h5" /></Svg>,
  swap: (p) => <Svg size={16} sw={2} {...p}><path d="M7 4L3 8l4 4" /><path d="M3 8h13" /><path d="M17 20l4-4-4-4" /><path d="M21 16H8" /></Svg>,
  pencil: (p) => <Svg size={14} sw={2} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></Svg>,
  calendar: (p) => <Svg size={16} sw={2} {...p}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /></Svg>,
  minus: (p) => <Svg size={16} sw={2.4} {...p}><path d="M5 12h14" /></Svg>,
  download: (p) => <Svg {...p}><path d="M12 4v12M7 11l5 5 5-5" /><path d="M4 20h16" /></Svg>,
  publish: (p) => <Svg {...p}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M12 15V3M7 8l5-5 5 5" /></Svg>,
  hash: (p) => <Svg size={13} sw={2.2} {...p}><path d="M5 9h14M5 15h14M10 3L8 21M16 3l-2 18" /></Svg>
};
