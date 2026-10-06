// Small logos for where buyer comments came from. Simplified marks, drawn inline (no external images).
const MARKS = {
  reddit: (
    <>
      <circle cx="12" cy="12" r="12" fill="#FF4500" />
      <ellipse cx="12" cy="14" rx="6.4" ry="4.4" fill="#fff" />
      <circle cx="17.6" cy="10.2" r="1.5" fill="#fff" />
      <circle cx="6.4" cy="10.2" r="1.5" fill="#fff" />
      <circle cx="16.3" cy="5.6" r="1.3" fill="#fff" />
      <path d="M12 9.6l1-4.2 3.2.4" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="9.6" cy="13.4" r="1" fill="#FF4500" />
      <circle cx="14.4" cy="13.4" r="1" fill="#FF4500" />
      <path d="M9.6 16c1.4.9 3.4.9 4.8 0" stroke="#FF4500" strokeWidth="0.9" fill="none" strokeLinecap="round" />
    </>
  ),
  tiktok: (
    <>
      <rect width="24" height="24" rx="6" fill="#000" />
      <path transform="translate(-0.7 -0.5)" d="M13.6 5h2.3c.2 1.6 1.3 2.8 3 3v2.3c-1.1 0-2.1-.3-3-.9v4.8a4.2 4.2 0 1 1-4.2-4.2v2.4a1.9 1.9 0 1 0 1.9 1.9z" fill="#25F4EE" />
      <path transform="translate(0.7 0.5)" d="M13.6 5h2.3c.2 1.6 1.3 2.8 3 3v2.3c-1.1 0-2.1-.3-3-.9v4.8a4.2 4.2 0 1 1-4.2-4.2v2.4a1.9 1.9 0 1 0 1.9 1.9z" fill="#FE2C55" />
      <path d="M13.6 5h2.3c.2 1.6 1.3 2.8 3 3v2.3c-1.1 0-2.1-.3-3-.9v4.8a4.2 4.2 0 1 1-4.2-4.2v2.4a1.9 1.9 0 1 0 1.9 1.9z" fill="#fff" />
    </>
  ),
  amazon: (
    <>
      <rect width="24" height="24" rx="6" fill="#232F3E" />
      <text x="12" y="14.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="12" fill="#fff">a</text>
      <path d="M6.5 16.4c3.4 2 7.6 2 11 0" stroke="#FF9900" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M15.8 15.4l1.9.9-.5 2" stroke="#FF9900" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  reviews: (
    <>
      <rect width="24" height="24" rx="6" fill="#1F2A1A" />
      <path d="M12 5.2l2 4.2 4.6.6-3.4 3.2.9 4.6L12 15.6l-4.1 2.2.9-4.6-3.4-3.2 4.6-.6z" fill="#FACC15" />
    </>
  ),
  ads: (
    <>
      <rect width="24" height="24" rx="6" fill="#2A1E12" />
      <text x="12" y="15.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="9" fill="#FB923C">AD</text>
    </>
  )
};
const MATCH = [[/reddit/i, 'reddit'], [/tiktok/i, 'tiktok'], [/amazon/i, 'amazon'], [/competitor|ad library|ads/i, 'ads'], [/review/i, 'reviews']];
const NAMES = { reddit: 'Reddit', tiktok: 'TikTok', amazon: 'Amazon', reviews: 'Product reviews', ads: 'Competitor ads' };

export function sourceKey(source) {
  const m = MATCH.find(([re]) => re.test(source));
  return m ? m[1] : 'reviews';
}

export default function SourceLogo({ source, size = 16 }) {
  const key = sourceKey(source);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={NAMES[key]} style={{ flex: 'none', display: 'block' }}>
      <title>{NAMES[key]}</title>
      {MARKS[key]}
    </svg>
  );
}
