import { useSyncExternalStore } from 'react';

// The research package a researcher hands to an editor. One per product or brief.
// In the real build this is built from the Brand kit and Research steps.
export const RESEARCH = {
  'red-alert': {
    product: 'Red Alert Gel Nail Strip', brand: 'Moyou London', dot: '#C8102E', kind: 'Product', url: 'moyou.co.uk/products/gel-nail-strip-red-alert',
    summary: 'Salon-look gel strips for people who quit salon gels over cost or damage. Biggest worry: edges lifting. Biggest win: nails are fine after peeling off.',
    price: '£12.99', offer: 'Buy 2, get 1 free', angle: 'Occasion transformation',
    personas: [
      { name: 'The event-week planner', share: 44, wants: 'Nails that look done without booking.', worries: 'Edges lifting in photos.' },
      { name: 'The lapsed salon regular', share: 31, wants: 'The salon look without the bill.', worries: 'Damage at removal.' }
    ],
    hooks: ["My gels look amazing for a week, then I wreck my nails getting them off.", "I can't justify £40 every two weeks at the salon any more.", 'I just want nails that look done for the wedding without booking anything.', 'Peeled them off and my nails were actually fine underneath.'],
    cores: ['Apply on the sofa in 15 minutes, with close-ups of the red', 'Day 7 check: no lifting at the edges', 'Peel-off test: bare nails, no damage'],
    ctas: ['Buy 2, get 1 free this week', 'Tap to get the red', 'Your next event is sorted'],
    mustSay: 'Lasts up to 14 days. Peels off with no soaking.',
    avoid: 'Salon-bashing. "Cheap". Medical claims about nail health.',
    formats: ['ugc', 'broll', 'wot'], signals: '10,482 comments and reviews'
  },
  'too-hot': {
    product: 'Too Hot To Handle', brand: 'Moyou London', dot: '#C8102E', kind: 'Product', url: 'moyou.co.uk/products/too-hot-to-handle',
    summary: 'Flame-tip nail art strips. Buyers love how it looks up close but think nail art is hard to do yourself.',
    price: '£13.99', offer: 'Free shipping over £20', angle: 'Look at the detail',
    personas: [
      { name: 'The nail-art fan on a budget', share: 52, wants: 'Detailed art without a 2-hour appointment.', worries: 'It looks printed and flat.' },
      { name: 'The festival planner', share: 27, wants: 'A statement look for one weekend.', worries: 'It falls off mid-weekend.' }
    ],
    hooks: ['Look at the tips. Just look.', 'My nail tech charges £60 for this design.', 'Nobody believes I did these on the train.'],
    cores: ['Macro shots of the flame detail', 'Apply in 10 minutes, timer on screen', 'Weekend wear test'],
    ctas: ['Free shipping over £20', 'Get the flames'],
    mustSay: 'Real gel finish. No UV lamp needed.',
    avoid: 'Comparing to named salons.',
    formats: ['broll', 'ugc'], signals: '4,210 comments and reviews'
  },
  periwinkle: {
    product: 'Periwinkle', brand: 'Moyou London', dot: '#C8102E', kind: 'Product', url: 'moyou.co.uk/products/periwinkle',
    summary: 'Soft blue-lilac shade. Buyers want a calm, "clean girl" look for work. Price is not on the page yet, so check with the client.',
    price: '[Ask client]', offer: 'None yet', angle: 'Quiet luxury',
    personas: [
      { name: 'The office minimalist', share: 48, wants: 'Neat nails that are allowed at work.', worries: 'Looking too bold.' },
      { name: 'The gift buyer', share: 22, wants: 'A safe present that feels special.', worries: 'Getting the size wrong.' }
    ],
    hooks: ['The only nail colour my boss has ever complimented.', 'This is what "clean girl nails" actually means.', "I wanted salon nails that don't scream salon nails."],
    cores: ['Desk and coffee-cup shots, soft light', 'Sizing explained in 5 seconds'],
    ctas: ['Shop Periwinkle', 'Gift it'],
    mustSay: '[Price and offer from client]',
    avoid: 'Comparing to other colours as "boring".',
    formats: ['ugc', 'native'], signals: '2,960 comments and reviews'
  },
  'dt-secrets': {
    product: 'Dollar Tree Secrets', brand: 'Dollar Tree', dot: '#2E7D32', kind: 'Brief', url: 'Brief: Dollar Tree Secrets',
    summary: 'Presenter series of store secrets. Same presenter (Tasha), gift-card promo locked in the middle.',
    price: 'Gift cards from $5', offer: 'None', angle: 'Insider tips',
    personas: [{ name: 'The bargain hunter', share: 61, wants: 'Tips nobody else knows.', worries: 'Clickbait that wastes their time.' }],
    hooks: ["Dollar Tree workers won't tell you this…", 'Stop walking past this shelf.', 'Teacher gift, $10, looks like $40.'],
    cores: ['Secret with B-roll of the aisle', 'How-to with hands only'],
    ctas: ['"Stuck on a gift? This is mine."', 'Follow for part 10'],
    mustSay: 'Gift cards work in store.',
    avoid: 'Anything not verified. "Cheap". Competitor names.',
    formats: ['ugc'], signals: '41 Reddit posts, 6 employee videos'
  },
  'pillow-02': {
    product: 'Pillow animation', brand: 'Pillow client', dot: '#7C9CF5', kind: 'Brief', url: 'Brief: Pillow animation',
    summary: 'Animated stories with the approved clay pillow. Offer at the end. No health claims.',
    price: '[Ask client]', offer: '[Ask client]', angle: 'Cute hero story',
    personas: [{ name: 'The tired parent', share: 55, wants: 'One good night of sleep.', worries: 'Pillows that go flat.' }],
    hooks: ['Clock says 3:12. Someone is NOT sleeping.', 'The old pillow is tired. Like, really tired.'],
    cores: ['Pillow wakes up and fluffs itself', 'The sleepover with the blanket and eye mask'],
    ctas: ['Product shot and offer on a made bed'],
    mustSay: 'Removable, washable cover.',
    avoid: 'Medical claims like "cures neck pain".',
    formats: ['anim'], signals: 'Product page and 312 reviews'
  },
  'hook-test': {
    product: 'Hook test 4', brand: 'HookLife', dot: '#60A5FA', kind: 'Product', url: 'hooklife.co/hook-test',
    summary: 'Internal test: 8 hooks on the same core to find the strongest opener.',
    price: '-', offer: '-', angle: 'Pattern interrupt',
    personas: [{ name: 'Ad buyers', share: 100, wants: 'Hooks that stop the scroll.', worries: 'Same old openers.' }],
    hooks: ['Stop scrolling if you run ads.', 'This hook made us £40k.', 'Wait for it…'],
    cores: ['Screen recording of the dashboard'],
    ctas: ['Book a call'],
    mustSay: '-', avoid: 'Made-up revenue numbers.',
    formats: ['green', 'ugc'], signals: 'Internal'
  }
};

export const STATUS = {
  todo: { label: 'To do', cls: '' },
  doing: { label: 'In progress', cls: 'lime' },
  review: { label: 'For review', cls: 'amber' },
  approved: { label: 'Approved · ready to send', cls: 'green' },
  client: { label: 'With client', cls: 'violet' },
  fixes: { label: 'Changes requested', cls: 'red' },
  done: { label: 'Approved', cls: 'green' }
};
// Status wording depends on who is looking (e.g. the researcher sees "For review").
export const statusLabel = (status, role) => (role === 'researcher' && STATUS[status].researcher) || STATUS[status].label;

export const PRIORITY = { normal: { label: 'Normal', cls: '' }, high: { label: 'High', cls: 'amber' }, urgent: { label: 'Urgent', cls: 'red' } };

// Sample state. `ready` = researched, waiting for a researcher to hand off. `tasks` = handed to an editor.
// `reviews` = stitched ads an editor sent to the researcher for review (the editor doesn't review their own work).
let state = {
  ready: [
    { id: 'periwinkle', title: 'Batch 1', researchedBy: 'david', finished: 'Today, 9:40' },
    { id: 'dt-secrets', title: 'EP 07–09', researchedBy: 'david', finished: 'Yesterday' },
    { id: 'pillow-02', title: 'Story 02', researchedBy: 'david', finished: 'Mon' }
  ],
  tasks: [
    { id: 't1', research: 'red-alert', title: 'Batch 5', editor: 'renz', from: 'david', status: 'todo', priority: 'high', due: 'Thu 8 Oct', assigned: 'Today', target: 12, formats: ['ugc', 'broll'], note: 'Client loved the event-week angle in Batch 4. Lead with that, and make at least 3 removal-reassurance hooks.' },
    { id: 't2', research: 'too-hot', title: 'Batch 2', editor: 'renz', from: 'david', status: 'doing', priority: 'normal', due: 'Fri 9 Oct', assigned: 'Mon', target: 12, formats: ['broll', 'ugc'], note: 'Macro shots are the hero here. Keep hooks under 2 seconds.', progress: 7 },
    { id: 't3', research: 'red-alert', title: 'Batch 4 fixes', editor: 'renz', from: 'david', status: 'review', priority: 'urgent', due: 'Today', assigned: 'Sat', target: 2, formats: ['ugc', 'broll'], note: 'Sophie asked for a deeper red at 0:07 and a different presenter on "Do they lift?".' },
    { id: 't4', research: 'dt-secrets', title: 'EP 04–06', editor: 'arland', from: 'david', status: 'review', priority: 'normal', due: 'Wed 7 Oct', assigned: 'Fri', target: 3, formats: ['ugc'], note: 'Facts for EP 05 still need checking.', progress: 2 },
    { id: 't5', research: 'hook-test', title: 'Round 3', editor: 'jerome', from: 'david', status: 'client', priority: 'normal', due: 'Wed 7 Oct', assigned: 'Tue 29 Sep', target: 8, formats: ['green'], note: '' },
    { id: 't6', research: 'pillow-02', title: 'Story 01 fixes', editor: 'willem', from: 'david', status: 'fixes', priority: 'high', due: 'Thu 8 Oct', assigned: 'Sun', target: 1, formats: ['anim'], note: 'Client wants the pillow fluffier when it wakes up.' }
  ],
  reviews: [
    { id: 'rv1', task: 't3', editor: 'renz', reviewer: 'david', sent: '25 min ago', status: 'waiting', ads: [
      { label: 'H1 + C1 + T1', text: 'Salon red. Five minutes. (deeper red at 0:07)', secs: 12, bg: '#4A0F18', format: 'Product B-roll' },
      { label: 'H2 + C1 + T1', text: 'You said they lift by day two. (new presenter)', secs: 15, bg: '#33281F', format: 'Before and after' }
    ] },
    { id: 'rv2', task: 't4', editor: 'arland', reviewer: 'david', sent: '2 h ago', status: 'waiting', ads: [
      { label: 'H1 + C1 + T1', text: "Dollar Tree workers won't tell you this…", secs: 30, bg: '#2B3A2E', format: 'UGC talking head' },
      { label: 'H2 + C1 + T1', text: 'Stop walking past this shelf.', secs: 28, bg: '#24302A', format: 'UGC talking head' },
      { label: 'H3 + C2 + T1', text: 'Teacher gift, $10, looks like $40.', secs: 29, bg: '#2E3A24', format: 'UGC talking head' }
    ] }
  ]
};
const listeners = new Set();
const emit = (next) => { state = next; listeners.forEach((l) => l()); };
const sub = (l) => { listeners.add(l); return () => listeners.delete(l); };

// Shared, in-memory work state (lost on page reload). Replace with API calls.
export function useWork() {
  return useSyncExternalStore(sub, () => state);
}

let nextId = 7;
export function assignTask(researchId, { editor, due, priority, target, formats, note, from }) {
  const item = state.ready.find((r) => r.id === researchId);
  const task = { id: 't' + nextId++, research: researchId, title: item ? item.title : 'Batch 1', editor, from, status: 'todo', priority, due, assigned: 'Just now', target, formats, note, fresh: true };
  emit({ ...state, ready: state.ready.filter((r) => r.id !== researchId), tasks: [task, ...state.tasks] });
  return task;
}

export function setTaskStatus(id, status) {
  emit({ ...state, tasks: state.tasks.map((t) => (t.id === id ? { ...t, status, fresh: false } : t)) });
}

let nextReview = 3;
// Editor sends stitched ads to the researcher. `taskId` is null for custom videos (then `title`/`client` describe it).
export function submitForReview({ taskId = null, editor, reviewer = 'david', ads, title, client, dot }) {
  const review = { id: 'rv' + nextReview++, task: taskId, editor, reviewer, sent: 'Just now', status: 'waiting', ads, title, client, dot, fresh: true };
  emit({ ...state, reviews: [review, ...state.reviews], tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status: 'review', fresh: false } : t)) });
  return review;
}

// Researcher finishes a review: kept ads go back to the editor to send to the client.
export function finishReview(reviewId, { kept, skipped, reasons }) {
  const r = state.reviews.find((x) => x.id === reviewId);
  emit({
    ...state,
    reviews: state.reviews.map((x) => (x.id === reviewId ? { ...x, status: 'done', kept, skipped, reasons } : x)),
    tasks: state.tasks.map((t) => (r && t.id === r.task ? { ...t, status: kept > 0 ? 'approved' : 'doing', kept } : t))
  });
}

// Title, client and colour of whatever a review is for (a task or a custom video).
export function reviewSubject(r, tasks) {
  const t = r.task && tasks.find((x) => x.id === r.task);
  if (t) { const rs = RESEARCH[t.research]; return { title: `${rs.product} · ${t.title}`, client: rs.brand, dot: rs.dot }; }
  return { title: r.title || 'Custom video', client: r.client || '', dot: r.dot || '#3A3A42' };
}

export const openTasks = (tasks, editorId) => tasks.filter((t) => t.editor === editorId && t.status !== 'done' && t.status !== 'client');
export const taskName = (t) => `${RESEARCH[t.research].product} · ${t.title}`;
