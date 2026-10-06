// Video formats an editor can generate. Each one is a tested Recipe (see /recipes).
// `bg` and `overlay` are only for the sample thumbnails.
export const FORMATS = [
  { id: 'ugc', name: 'UGC talking head', about: 'A person talks to camera like a real customer', bg: '#2B211C', overlay: 'POV: wedding in 2 days', pass: '86%', cost: 2.4 },
  { id: 'wot', name: 'Wall of text', about: 'One bold paragraph over a looping clip', bg: '#1E1F26', overlay: 'Nobody told me…', pass: '97%', cost: 0.15 },
  { id: 'broll', name: 'Product B-roll', about: 'Close-up product shots, captions and music', bg: '#2E1116', overlay: 'Salon red, 5 min', pass: '81%', cost: 1.1 },
  { id: 'green', name: 'Green-screen reaction', about: 'Creator reacts in front of a post or review', bg: '#1F2A33', overlay: 'Reading the reviews…', pass: '88%', cost: 1.6 },
  { id: 'native', name: 'Native story', about: 'Looks like a notes app or a text thread', bg: '#1A2030', overlay: 'me: help', pass: '93%', cost: 0.6 },
  { id: 'ba', name: 'Before and after', about: 'The problem, the product, the reveal', bg: '#26221C', overlay: 'Before', pass: '78%', cost: 1.3 },
  { id: 'anim', name: 'Animation', about: 'Animated character or mascot story', bg: '#2B2440', overlay: '3:12 AM…', pass: '91%', cost: 1.9 },
  { id: 'static', name: 'Static ad', about: 'Headline, product, proof and offer', bg: '#2A1D1E', overlay: '£12.99', pass: '99%', cost: 0.05 }
];
export const formatById = (id) => FORMATS.find((f) => f.id === id);
// Researchers can suggest formats that aren't in the list yet; those are stored as plain text.
export const formatLabel = (id) => (formatById(id) ? formatById(id).name : id);
