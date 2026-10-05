import { useSearchParams } from 'react-router-dom';
// Sample briefs used by the three Brief screens. Replace with saved briefs from the backend.
export const EXAMPLES = {
  dt: {
    client: 'Dollar Tree', dot: '#2E7D32',
    name: 'Dollar Tree Secrets', what: 'Dollar Tree gift cards', link: 'https://[gift card page]',
    idea: 'A friendly AI character shares little-known Dollar Tree store secrets, like an insider tip series. Partway through, they mention gift cards as the easy gift that works for anyone.',
    style: 'ai', len: 30, place: 'mid',
    must: 'Gift cards work in store. [Confirm online use and terms with client]',
    avoid: 'Anything we can\'t verify. "Cheap". Competitor names.',
    beats: [
      ['0–3s', '"Dollar Tree workers won\'t tell you this…"'],
      ['3–13s', 'Secret #1 with B-roll of aisles'],
      ['13–17s', 'Gift card plug: "Stuck on a gift? This is mine."'],
      ['17–30s', 'Secret #2, then "Follow for part 3"']
    ],
    next1: 'Store "secrets" are collected from Reddit, employee posts and articles, each with a source, and checked before use.',
    next3: 'You pick or create the presenter, who stays the same across every episode.',
    promo: '"Stuck on a gift? Dollar Tree gift cards. Works for literally anyone." Character holds up card, 4 seconds.',
    promoSlot: 'Middle · 13–17s',
    conceptsTitle: 'Episodes',
    factsTitle: 'Secrets and fact check',
    factsAbout: 'Collected from Reddit, employee TikToks and articles. Only verified items can be scripted.',
    concepts: [
      { id: 'c1', ep: 'EP 01', title: 'The $3 and $5 section', hook: "Dollar Tree workers won't tell you this, but not everything is $1.25 any more…", angle: 'Insider tip', fact: 'Verified', factCls: 'green' },
      { id: 'c2', ep: 'EP 02', title: 'When new stock lands', hook: 'If you shop Dollar Tree on the wrong day, you are missing the good stuff.', angle: 'Timing hack', fact: 'Needs check', factCls: 'amber' },
      { id: 'c3', ep: 'EP 03', title: 'The seasonal aisle swap', hook: 'This aisle changes faster than any other in the store. Here is why.', angle: 'Insider tip', fact: 'Needs check', factCls: 'amber' },
      { id: 'c4', ep: 'EP 04', title: 'Party supplies for less', hook: 'I threw a whole birthday party from one Dollar Tree run.', angle: 'Challenge', fact: 'No claim', factCls: '' },
      { id: 'c5', ep: 'EP 05', title: 'Name brands hiding in plain sight', hook: 'Stop walking past this shelf. Those are real name brands.', angle: 'Insider tip', fact: 'Needs check', factCls: 'amber' },
      { id: 'c6', ep: 'EP 06', title: 'The gift basket trick', hook: 'Teacher gift, $10, looks like $40. Watch.', angle: 'How-to', fact: 'No claim', factCls: '' }
    ],
    defaultPicks: { c1: true, c4: true, c6: true },
    facts: [
      { id: 'f1', text: 'Many stores now carry items above $1.25, in $3 and $5 ranges.', source: 'News articles · 3 sources', status: 'Verified' },
      { id: 'f2', text: 'New stock arrives on the same weekday every week.', source: 'Reddit · 41 posts', status: 'Varies by store' },
      { id: 'f3', text: 'Seasonal aisles change over several weeks before each holiday.', source: 'Employee TikToks · 6', status: 'Needs check' },
      { id: 'f4', text: 'Gift cards can be used online as well as in store.', source: '[Gift card terms page]', status: 'Ask client' },
      { id: 'f5', text: 'Some name-brand products are sold in smaller sizes.', source: 'Reddit · 19 posts', status: 'Needs check' }
    ]
  },
  pl: {
    client: 'Pillow client', dot: '#7C9CF5',
    name: 'Pillow animation', what: 'Memory-foam pillow', link: 'https://[pillow product page]',
    idea: "A short animated story where the pillow is the character. It rescues a tired person from a bad night's sleep. Cute, soft, bedtime-story feel. Product shot and offer at the end.",
    style: 'anim', len: 15, place: 'end',
    must: '[Offer and price from client]',
    avoid: 'Medical claims like "cures neck pain". Scary night imagery.',
    beats: [
      ['0–3s', 'Person tossing in bed, clock reads 3:12 AM'],
      ['3–11s', 'Pillow wakes up, fluffs itself, slides under their head'],
      ['11–15s', 'Morning stretch, product shot and offer']
    ],
    next1: 'Product facts are pulled from the link and anything that sounds like a health claim is flagged.',
    next3: 'You approve the animation style and the pillow character sheet before any video is made.',
    promo: 'Product shot on a made bed, "[Offer]" and "[Price]" on screen, soft chime. 4 seconds.',
    promoSlot: 'End · 11–15s',
    conceptsTitle: 'Story options',
    factsTitle: 'Claims check',
    factsAbout: 'Pulled from the product page. Anything that sounds medical is blocked from scripts.',
    concepts: [
      { id: 'c1', ep: 'STORY 01', title: 'The 3 AM rescue', hook: 'Clock says 3:12. Someone is NOT sleeping. Enter: pillow.', angle: 'Hero story', fact: 'No claim', factCls: '' },
      { id: 'c2', ep: 'STORY 02', title: 'Pillow vs. the flat pillow', hook: 'The old pillow is tired. Like, really tired.', angle: 'Before and after', fact: 'Uses claim', factCls: 'amber' },
      { id: 'c3', ep: 'STORY 03', title: 'Bedtime story for grown-ups', hook: 'Once upon a time, there was a person who woke up with a stiff neck…', angle: 'Storybook', fact: 'Blocked word', factCls: 'red' },
      { id: 'c4', ep: 'STORY 04', title: 'The sleepover', hook: 'Pillow brings its friends. The blanket. The eye mask. Lights out.', angle: 'Cute ensemble', fact: 'No claim', factCls: '' },
      { id: 'c5', ep: 'STORY 05', title: 'Hot sleeper problems', hook: 'Flip it to the cool side. Oh wait, both sides are the cool side.', angle: 'Feature gag', fact: 'Uses claim', factCls: 'amber' },
      { id: 'c6', ep: 'STORY 06', title: 'Morning person, finally', hook: 'Alarm goes off. Person smiles. That has never happened before.', angle: 'Transformation', fact: 'No claim', factCls: '' }
    ],
    defaultPicks: { c1: true, c4: true },
    facts: [
      { id: 'f1', text: 'Memory-foam core that keeps its shape.', source: 'Product page', status: 'Verified' },
      { id: 'f2', text: 'Removable, machine-washable cover.', source: 'Product page', status: 'Verified' },
      { id: 'f3', text: 'Cooling cover fabric.', source: 'Product page', status: 'Needs check' },
      { id: 'f4', text: '"Relieves neck pain"', source: 'Reviews', status: 'Blocked' }
    ]
  }
};

export function ExampleSwitch({ value, onChange }) {
  return (
    <div className="stack" style={{ gap: 6 }}>
      <span className="faint" style={{ fontSize: 12 }}>Example</span>
      <div className="segs" role="group" aria-label="Example brief">
        {[['dt', 'Dollar Tree Secrets'], ['pl', 'Pillow animation']].map(([id, l]) => (
          <button key={id} type="button" className={'seg' + (value === id ? ' on' : '')} onClick={() => onChange(id)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

// Keeps the chosen example in the URL (?ex=pl), so it carries across the three brief screens.
export function useExample() {
  const [params, setParams] = useSearchParams();
  const id = params.get('ex') === 'pl' ? 'pl' : 'dt';
  return [id, (next) => setParams({ ex: next }, { replace: true })];
}
