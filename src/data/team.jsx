import { useSyncExternalStore } from 'react';

// Who does what at Visionary Studios. Clients are not users: they only open review links.
export const ROLES = {
  researcher: { label: 'Researcher', about: 'Picks the products and clients to work on, researches each product, then hands it to an editor with everything they need.' },
  editor: { label: 'Editor', about: 'Gets researched products as tasks, generates and edits the videos, then sends them to the client for review.' }
};

// Sample team. Replace with real accounts once login exists.
export const TEAM = [
  { id: 'david', name: 'David', initials: 'D', role: 'researcher', email: 'david@vznry.com', color: '#A78BFA' },
  { id: 'renz', name: 'Renz', initials: 'R', role: 'editor', email: 'renz@vznry.com', color: '#C6F432' },
  { id: 'arland', name: 'Arland', initials: 'A', role: 'editor', email: 'arland@vznry.com', color: '#FB923C' },
  { id: 'jerome', name: 'Jerome', initials: 'J', role: 'editor', email: 'jerome@vznry.com', color: '#4ADE80' },
  { id: 'willem', name: 'Willem', initials: 'W', role: 'editor', email: 'willem@vznry.com', color: '#F87171' }
];
export const EDITORS = TEAM.filter((u) => u.role === 'editor');
export const person = (id) => TEAM.find((u) => u.id === id) || TEAM[0];

// The signed-in person. Mocked: the account menu lets you switch to see each role's view.
// Remembered in this browser only; in the real build this comes from login.
const KEY = 'vznry.user';
let current = 'david';
try { const saved = localStorage.getItem(KEY); if (saved && TEAM.some((u) => u.id === saved)) current = saved; } catch { /* storage blocked */ }
// Demo shortcut: ?as=renz in any URL opens the app as that person.
try { const as = new URLSearchParams(window.location.search).get('as'); if (as && TEAM.some((u) => u.id === as)) current = as; } catch { /* no window */ }
const listeners = new Set();
const store = {
  get: () => current,
  set: (id) => { current = id; try { localStorage.setItem(KEY, id); } catch { /* storage blocked */ } listeners.forEach((l) => l()); },
  sub: (l) => { listeners.add(l); return () => listeners.delete(l); }
};

export function useCurrentUser() {
  const id = useSyncExternalStore(store.sub, store.get);
  return person(id);
}
export const switchUser = store.set;

export function Avatar({ user, size = 30 }) {
  return (
    <span className="avatar" title={`${user.name} · ${ROLES[user.role].label}`} style={{ width: size, height: size, fontSize: Math.round(size * 0.4), background: user.color }}>{user.initials}</span>
  );
}
