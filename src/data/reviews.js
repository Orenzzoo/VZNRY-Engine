// Client review rounds: every link we sent, the videos in it, and what the client decided and said.
// Sample data. In the real build this comes from the ReviewRound / ClientDecision / ClientComment tables.

const v = (id, title, caption, recipe, len, bg, decision = null, comments = []) => ({ id, title, caption, recipe, len, bg, decision, comments });
const c = (t, who, text, us = false) => ({ t, who, text, us });

const RED_ALERT = (decisions = {}, comments = {}) => [
  v('v1', 'Red before the event', "Wedding's Saturday. Zero appointments.", 'AI UGC', 18, '#3B2A22', decisions.v1, comments.v1),
  v('v2', 'My nails after gels', 'Nobody warned me about the removal…', 'Wall of text', 9, '#24252C', decisions.v2, comments.v2),
  v('v3', 'Salon red, five minutes', 'Salon red. Five minutes.', 'Product B-roll', 12, '#4A0F18', decisions.v3, comments.v3),
  v('v4', 'Do they lift? Day 7', 'You said they lift by day two.', 'Before and after', 15, '#33281F', decisions.v4, comments.v4),
  v('v5', '£40 every two weeks', 'I did the maths on my salon habit', 'AI UGC', 20, '#3A2E2B', decisions.v5, comments.v5),
  v('v6', 'Group chat: help', 'me: party in 3 hrs, nails are tragic', 'Native story', 11, '#1E2638', decisions.v6, comments.v6)
];

export const ROUNDS = [
  {
    id: 'r1', client: 'Moyou London', reviewer: 'Sophie', dot: '#C8102E', product: 'Red Alert', round: 'Round 2', dates: 'sent Mon 5 Oct · due Thu 8 Oct', kind: 'waiting', status: 'Waiting on client', statusCls: '', activity: 'Link opened 2 h ago', task: 't3',
    videos: RED_ALERT({}, { v3: [c(7, 'Renz', 'Round 2: red colour corrected after your note.', true)], v4: [c(2, 'Renz', 'New presenter, as you asked.', true)] })
  },
  {
    id: 'r3', client: 'Dollar Tree', reviewer: 'Mark', dot: '#2E7D32', product: 'Secrets EP 01–03', round: 'Round 1', dates: 'sent Fri 2 Oct · was due Mon 5 Oct', kind: 'overdue', status: 'Overdue', statusCls: 'red', activity: 'Not opened yet', task: 't4',
    videos: [
      v('d1', 'Secret #1: the $5 aisle', "Workers won't tell you this…", 'AI UGC series', 30, '#2B3A2E'),
      v('d2', 'Secret #2: new stock day', 'Wrong day = wrong stuff', 'AI UGC series', 30, '#24302A'),
      v('d3', 'Secret #3: the seasonal swap', 'This aisle changes fastest', 'AI UGC series', 30, '#2E3A24')
    ]
  },
  {
    id: 'r2', client: 'Moyou London', reviewer: 'Sophie', dot: '#C8102E', product: 'Red Alert', round: 'Round 1', dates: 'sent Sat 3 Oct', kind: 'fix', status: 'Needs our fixes', statusCls: 'amber', activity: 'Fixes sent as round 2', task: 't3',
    videos: RED_ALERT(
      { v1: 'ok', v2: 'ok', v3: 'no', v4: 'no' },
      {
        v1: [c(3, 'Sophie', 'Love this opening, keep it.'), c(14, 'Sophie', 'The product close-up here is perfect.')],
        v3: [c(7, 'Sophie', 'Red looks a bit orange here.'), c(10, 'Sophie', 'Can the end card stay on screen a bit longer?')],
        v4: [c(2, 'Sophie', 'Can we use a different presenter?')]
      }
    )
  },
  {
    id: 'r5', client: 'Pillow client', reviewer: 'Dan', dot: '#7C9CF5', product: 'Story 01', round: 'Round 1', dates: 'sent Sun 4 Oct', kind: 'fix', status: 'Needs our fixes', statusCls: 'amber', activity: 'Reviewed yesterday', task: 't6',
    videos: [v('p1', 'The 3 AM rescue', '3:12 AM. Not sleeping.', 'Animation', 15, '#2B2440', 'no', [c(5, 'Dan', 'Can the pillow look a bit fluffier when it wakes up?'), c(12, 'Dan', 'Offer text is great.')])]
  },
  {
    id: 'r6', client: 'Moyou London', reviewer: 'Sophie', dot: '#C8102E', product: 'Too Hot To Handle', round: 'Round 1', dates: 'sent Thu 1 Oct', kind: 'fix', status: 'Needs our fixes', statusCls: 'amber', activity: 'Reviewed Fri', task: 't2',
    videos: [
      v('h1', 'Flame tips up close', 'Look at the tips. Just look.', 'Product B-roll', 12, '#3A1F12', 'ok'),
      v('h2', 'My nail tech charges £60', 'My nail tech charges £60 for this', 'AI UGC', 16, '#2E2420', 'ok', [c(4, 'Sophie', 'Ha, love this one.')]),
      v('h3', 'Did these on the train', 'Nobody believes I did these on the train', 'AI UGC', 14, '#4A2410', 'ok'),
      v('h4', 'Festival-proof', 'Three days. Zero chips.', 'Before and after', 15, '#33231A', 'ok'),
      v('h5', 'Ten-minute flames', 'Ten minutes. Timer on.', 'Product B-roll', 13, '#2A1E1A', 'no', [c(0, 'Sophie', 'Love these. Just swap the music on the last one.')])
    ]
  },
  {
    id: 'r4', client: 'HookLife', reviewer: 'Kim', dot: '#60A5FA', product: 'Hook test', round: 'Round 3', dates: 'sent Tue 29 Sep', kind: 'done', status: 'All approved', statusCls: 'green', activity: 'Downloaded Wed', task: 't5',
    videos: Array.from({ length: 8 }, (_, i) => v('k' + (i + 1), `Hook test 0${i + 1}`, ['Stop scrolling if you run ads.', 'This hook made us £40k.', 'Wait for it…', 'You are doing hooks wrong.', 'Three words: pattern interrupt.', 'Stop scrolling.', 'Read this before your next ad.', 'Nobody tells you this.'][i], 'Green-screen', 11, ['#1F2A33', '#22283A', '#1E2638', '#2A2E3A'][i % 4], 'ok', i === 5 ? [c(1, 'Kim', 'This one is going straight into our ads.')] : []))
  }
];

export const DECISION = {
  ok: { label: 'Approved', cls: 'green', color: 'var(--green)' },
  no: { label: 'Changes requested', cls: 'red', color: 'var(--red)' },
  none: { label: 'Not reviewed yet', cls: '', color: '#3A3A42' }
};
export const decisionOf = (video) => DECISION[video.decision || 'none'];

export const roundCounts = (r) => ({
  videos: r.videos.length,
  ok: r.videos.filter((x) => x.decision === 'ok').length,
  no: r.videos.filter((x) => x.decision === 'no').length,
  wait: r.videos.filter((x) => !x.decision).length,
  comments: r.videos.reduce((a, x) => a + x.comments.filter((m) => !m.us).length, 0)
});

// Latest thing the client said in a round, for summaries.
export const latestComment = (r) => {
  for (let i = r.videos.length - 1; i >= 0; i--) {
    const m = r.videos[i].comments.filter((x) => !x.us);
    if (m.length) return m[m.length - 1].text;
  }
  return '';
};

export const fmtTime = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
