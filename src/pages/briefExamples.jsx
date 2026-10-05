import { Link, useSearchParams } from 'react-router-dom';

// Kinds of video a brief can be. Not a fixed list: people can add their own on the Brief screen.
export const VIDEO_TYPES = ['Presenter series', 'Animated story', 'AI drama', 'Singing video', 'Brainrot', 'Skit / comedy', 'Explainer', 'Before & after', 'Street interview', 'ASMR'];

const blankConcepts = [1, 2, 3, 4].map((n) => ({ id: 'c' + n, ep: `IDEA 0${n}`, title: 'Written from your idea', hook: 'The opening line appears here once the brief has an idea.', angle: 'To be decided', fact: 'No claim', factCls: '' }));

// Sample briefs. "blank" is the empty starting point; the rest are samples that only pre-fill the form.
// Replace with saved briefs and team templates from the backend.
export const EXAMPLES = {
  blank: {
    sample: false, label: 'Blank brief',
    client: 'New brief', dot: '#3A3A42',
    name: 'Untitled brief', what: '', link: '', idea: '', format: '',
    style: 'ai', len: 30, place: 'end', must: '', avoid: '',
    beats: [['0–3s', 'Hook: the first line, written from your idea'], ['3–26s', 'Story: changes each episode'], ['26–30s', 'Promo: made once, reused']],
    next1: 'Facts and claims are pulled from the link, if you add one, and checked before use.',
    next3: 'You pick who or what appears, so every video looks like the same world.',
    promo: 'Not written yet. Add what you are promoting on the brief.',
    promoSlot: 'End · 26–30s',
    conceptsTitle: 'Ideas', factsTitle: 'Fact check', factsAbout: 'Nothing to check yet. Facts appear here once the brief has a link or claims.',
    concepts: blankConcepts, defaultPicks: {}, facts: [], empty: true
  },
  dt: {
    sample: true, label: 'Dollar Tree Secrets',
    client: 'Dollar Tree', dot: '#2E7D32', format: 'Presenter series',
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
    sample: true, label: 'Pillow animation',
    client: 'Pillow client', dot: '#7C9CF5', format: 'Animated story',
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
  },
  drama: {
    sample: true, label: 'AI drama series',
    client: 'Sample client', dot: '#C084FC', format: 'AI drama',
    name: 'Office drama, season 1', what: '[Client product, e.g. a coffee brand]', link: '',
    idea: 'A cliffhanger soap opera with AI actors, set in an office. Each episode ends on a twist. The product is part of the story (everyone fights over the last bag of coffee) and gets a short end card.',
    style: 'ai', len: 45, place: 'end',
    must: 'Product name said once, end card with logo.',
    avoid: 'Real company names. Anything mean-spirited about a real job.',
    beats: [['0–3s', '"She knew. She always knew."'], ['3–38s', 'The scene plays out, ends on a twist'], ['38–45s', 'End card with product, "Ep 2 tomorrow"']],
    next1: 'The engine keeps a story bible (characters, who knows what) so episodes stay consistent.',
    next3: 'You cast each role once; the same AI actors appear in every episode.',
    promo: 'Product on the desk, logo and "[Offer]" on screen, 7 seconds.',
    promoSlot: 'End · 38–45s',
    conceptsTitle: 'Episodes', factsTitle: 'Claims check', factsAbout: 'Only product claims are checked. The story itself is fiction.',
    concepts: [
      { id: 'c1', ep: 'EP 01', title: 'The last bag', hook: 'Someone took the last bag. And she has receipts.', angle: 'Cliffhanger', fact: 'No claim', factCls: '' },
      { id: 'c2', ep: 'EP 02', title: 'The new intern', hook: 'The new intern brought his own coffee. Big mistake.', angle: 'Rivalry', fact: 'No claim', factCls: '' },
      { id: 'c3', ep: 'EP 03', title: 'Monday meeting', hook: 'Nobody in this meeting is telling the truth.', angle: 'Ensemble', fact: 'No claim', factCls: '' },
      { id: 'c4', ep: 'EP 04', title: 'The taste test', hook: 'Blindfolds on. Somebody is about to be exposed.', angle: 'Product moment', fact: 'Uses claim', factCls: 'amber' }
    ],
    defaultPicks: { c1: true, c2: true },
    facts: [{ id: 'f1', text: '[Main product claim from client]', source: 'Ask client', status: 'Ask client' }]
  },
  sing: {
    sample: true, label: 'Singing video',
    client: 'Sample client', dot: '#F472B6', format: 'Singing video',
    name: 'Product jingle', what: '[Client product]', link: '',
    idea: 'A catchy 15-second song about the product, sung by an AI character to a trending beat. The lyrics use real lines buyers say in comments, so it feels like a fan made it.',
    style: 'ai', len: 15, place: 'end',
    must: 'Product name in the chorus.',
    avoid: 'Copyrighted melodies. Lyrics that make claims we can\'t check.',
    beats: [['0–3s', 'First line of the chorus, straight in'], ['3–11s', 'Verse with buyer lines'], ['11–15s', 'Chorus again with product on screen']],
    next1: 'Lyrics are drafted from buyer research, then checked for claims.',
    next3: 'You pick a singer and a beat; both stay the same if you make more.',
    promo: 'Product on screen during the last chorus, 4 seconds.',
    promoSlot: 'End · 11–15s',
    conceptsTitle: 'Song options', factsTitle: 'Lyrics check', factsAbout: 'Every claim in the lyrics is checked like a script line.',
    concepts: [
      { id: 'c1', ep: 'SONG 01', title: 'Bedroom pop', hook: '"I don\'t need a salon, I just need five minutes…"', angle: 'Soft and catchy', fact: 'No claim', factCls: '' },
      { id: 'c2', ep: 'SONG 02', title: 'Country ballad', hook: '"My nails were a mess, my wallet was too…"', angle: 'Funny', fact: 'No claim', factCls: '' },
      { id: 'c3', ep: 'SONG 03', title: 'Hyperpop', hook: '"Peel it, press it, done done done"', angle: 'Trend sound', fact: 'No claim', factCls: '' }
    ],
    defaultPicks: { c1: true },
    facts: [{ id: 'f1', text: 'Lasts up to 14 days (used in verse 2).', source: 'Product page', status: 'Needs check' }]
  },
  brainrot: {
    sample: true, label: 'Brainrot edit',
    client: 'Sample client', dot: '#FACC15', format: 'Brainrot',
    name: 'Brainrot edits', what: '[Client product]', link: '',
    idea: 'Chaotic, fast-cut meme edits: split-screen gameplay, loud captions, absurd voiceover. The product is a running joke that keeps popping up. Made to stop the scroll for a Gen Z audience.',
    style: 'anim', len: 15, place: 'both',
    must: 'Product visible at least twice.',
    avoid: 'Slurs or edgy jokes about real people. Flashing faster than platform rules allow.',
    beats: [['0–2s', 'Loud caption: "POV: you found the cheat code"'], ['2–12s', 'Rapid cuts, product keeps appearing'], ['12–15s', 'Product freeze-frame, "link in bio"']],
    next1: 'Captions and jokes are written in batches of 20; you keep the ones that land.',
    next3: 'You approve the meme style and the mascot sheet before videos are made.',
    promo: 'Product freeze-frame with a zoom and sound effect, 3 seconds.',
    promoSlot: 'Middle and end',
    conceptsTitle: 'Edits', factsTitle: 'Claims check', factsAbout: 'Jokes are fine; real claims still get checked.',
    concepts: [
      { id: 'c1', ep: 'EDIT 01', title: 'POV: the cheat code', hook: 'POV: you found the cheat code and it costs £12.', angle: 'POV', fact: 'Uses claim', factCls: 'amber' },
      { id: 'c2', ep: 'EDIT 02', title: 'Skibidi nails', hook: 'Nobody: … Me at 2 AM: *applies nails*', angle: 'Meme format', fact: 'No claim', factCls: '' },
      { id: 'c3', ep: 'EDIT 03', title: 'Subway surfers split', hook: 'Story time while you watch this guy jump trains.', angle: 'Split-screen', fact: 'No claim', factCls: '' },
      { id: 'c4', ep: 'EDIT 04', title: 'NPC reacts', hook: 'NPC sees your nails. NPC has never recovered.', angle: 'Character gag', fact: 'No claim', factCls: '' }
    ],
    defaultPicks: { c2: true, c3: true },
    facts: [{ id: 'f1', text: 'Price shown on screen: £12.', source: 'Product page', status: 'Needs check' }]
  }
};

export const START_ORDER = ['blank', 'dt', 'pl', 'drama', 'sing', 'brainrot'];

// "Start from" row on the Brief screen. Samples only pre-fill the form; nothing is locked to them.
export function StartFrom({ value, onChange }) {
  return (
    <section className="stack" style={{ gap: 12 }}>
      <div className="row wrap between" style={{ gap: 8, alignItems: 'baseline' }}>
        <h2 className="h2">Start from</h2>
        <span className="faint" style={{ fontSize: 13 }}>Samples just fill in the form so you can see a finished brief. Change anything.</span>
      </div>
      <div className="grid-auto" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: 10 }}>
        {START_ORDER.map((id) => {
          const ex = EXAMPLES[id];
          const on = value === id;
          return (
            <button key={id} type="button" className={'pick' + (on ? ' on' : '')} aria-pressed={on} onClick={() => onChange(id)} style={{ padding: 14, gap: 10, borderStyle: ex.sample ? 'solid' : 'dashed' }}>
              <span className="row between">
                <span className="row" style={{ justifyContent: 'center', width: 32, height: 32, borderRadius: 9, background: ex.sample ? ex.dot : 'transparent', border: ex.sample ? 0 : '1.5px dashed #3A3A42', color: ex.sample ? '#0B0B0F' : 'var(--muted)', fontSize: 16, fontWeight: 600 }}>{ex.sample ? ex.label[0] : '+'}</span>
                {ex.sample ? <span className="pill" style={{ fontSize: 11, minHeight: 20 }}>Sample</span> : <span className="pill lime" style={{ fontSize: 11, minHeight: 20 }}>Your own idea</span>}
              </span>
              <span className="stack" style={{ gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{ex.label}</span>
                <span className="faint" style={{ fontSize: 12 }}>{ex.sample ? ex.format : 'Any kind of video'}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Small badge on later brief screens saying which sample (if any) the brief started from.
export function BriefSource({ exId }) {
  const ex = EXAMPLES[exId];
  return (
    <div className="row wrap" style={{ gap: 10 }}>
      {ex.sample ? <span className="pill">Started from sample · {ex.label}</span> : <span className="pill lime">Your own brief</span>}
      <Link to={`/briefs/new?ex=${exId}`} style={{ fontSize: 13, fontWeight: 500 }}>Edit brief</Link>
    </div>
  );
}

// Keeps the chosen starting point in the URL (?ex=dt), so it carries across the three brief screens.
export function useExample() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('ex');
  const id = raw && EXAMPLES[raw] ? raw : 'blank';
  return [id, (next) => setParams({ ex: next }, { replace: true })];
}
