import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout, { PageHead, BRANDS } from '../components/Layout.jsx';
import { Icon } from '../components/Icons.jsx';

// Every product in the workspace. Sample data; replace with the products table from the backend.
// status: researching (setup running) · ready (researched, waiting for an editor) · editing (with an editor) · live (videos delivered) · paused
const RAW = [
  ['Red Alert Gel Nail Strip', 'Moyou London', '#C8102E', '£12.99', 'editing', 128, 0],
  ['Too Hot To Handle', 'Moyou London', '#E4572E', '£13.99', 'editing', 46, 0],
  ['Periwinkle', 'Moyou London', '#8C9EE8', '[Ask client]', 'ready', 0, 0],
  ['Velvet Matte Set', 'Moyou London', '#7A3B4B', '£14.99', 'researching', 0, 0],
  ['Nude Edit', 'Moyou London', '#D9B8A3', '£12.99', 'live', 64, 3],
  ['Cherry Chrome', 'Moyou London', '#9B1B30', '£13.99', 'live', 52, 4],
  ['French Tip Classic', 'Moyou London', '#F2E6DF', '£11.99', 'live', 88, 5],
  ['Midnight Glitter', 'Moyou London', '#1E1B3A', '£13.99', 'live', 40, 6],
  ['Lilac Haze', 'Moyou London', '#B9A6D9', '£12.99', 'live', 36, 8],
  ['Coral Crush', 'Moyou London', '#F07D5E', '£12.99', 'live', 30, 9],
  ['Mocha Latte', 'Moyou London', '#8A5A44', '£12.99', 'live', 28, 11],
  ['Ice Blue', 'Moyou London', '#A7D3F0', '£12.99', 'paused', 12, 14],
  ['Golden Hour', 'Moyou London', '#D9A441', '£13.99', 'live', 33, 15],
  ['Jungle Print', 'Moyou London', '#3E6B3A', '£14.99', 'live', 21, 16],
  ['Barely Pink', 'Moyou London', '#F2C6CF', '£11.99', 'live', 57, 18],
  ['Electric Lime', 'Moyou London', '#C6F432', '£12.99', 'paused', 8, 20],
  ['Toe Strips Red', 'Moyou London', '#B0102A', '£9.99', 'live', 19, 22],
  ['Milky White', 'Moyou London', '#F4F1EC', '£11.99', 'live', 44, 23],
  ['Ombre Sunset', 'Moyou London', '#E97451', '£14.99', 'live', 26, 25],
  ['Black Cat', 'Moyou London', '#151515', '£12.99', 'live', 38, 27],
  ['Rose Gold Foil', 'Moyou London', '#C99A86', '£14.99', 'live', 24, 29],
  ['Sage Green', 'Moyou London', '#9CAF88', '£12.99', 'live', 18, 31],
  ['Cuticle Oil Pen', 'Moyou London', '#E8D8B0', '£7.99', 'paused', 4, 34],
  ['Starter Kit', 'Moyou London', '#C8102E', '£24.99', 'live', 61, 36],
  ['Gift Set Trio', 'Moyou London', '#7C2D3A', '£29.99', 'live', 15, 40],
  ['Holiday Sparkle', 'Moyou London', '#B8860B', '£14.99', 'paused', 22, 60],
  ['Dollar Tree Secrets', 'Dollar Tree', '#2E7D32', 'Series', 'editing', 36, 0],
  ['Gift Cards', 'Dollar Tree', '#3F8F43', 'From $5', 'live', 18, 4],
  ['Party Aisle', 'Dollar Tree', '#4CAF50', 'Various', 'live', 12, 9],
  ['Back to School', 'Dollar Tree', '#2F6B33', 'Various', 'paused', 10, 45],
  ['Seasonal Decor', 'Dollar Tree', '#5C9E5F', 'Various', 'live', 14, 12],
  ['Teacher Gifts', 'Dollar Tree', '#1F5E24', 'Various', 'live', 9, 19],
  ['Crafts Corner', 'Dollar Tree', '#6FBF73', 'Various', 'ready', 0, 1],
  ['Hook test 4', 'HookLife', '#60A5FA', '-', 'editing', 8, 0],
  ['Hook test 5', 'HookLife', '#3B82F6', '-', 'researching', 0, 0],
  ['Hook test 3', 'HookLife', '#93C5FD', '-', 'live', 8, 7],
  ['Hook test 2', 'HookLife', '#2563EB', '-', 'live', 8, 14],
  ['Hook test 1', 'HookLife', '#1D4ED8', '-', 'live', 8, 21],
  ['Course launch', 'HookLife', '#60A5FA', '£297', 'live', 20, 10],
  ['Webinar invite', 'HookLife', '#7DB3F5', 'Free', 'live', 12, 17],
  ['Agency audit offer', 'HookLife', '#4F86D9', '£0', 'paused', 6, 33],
  ['Podcast clips', 'HookLife', '#A5C8FA', '-', 'live', 16, 24],
  ['Case study reels', 'HookLife', '#3D6FBF', '-', 'live', 10, 28],
  ['Pillow animation', 'Pillow client', '#7C9CF5', '[Ask client]', 'editing', 4, 0],
  ['Memory-foam pillow', 'Pillow client', '#9AB0F7', '£49', 'live', 22, 6],
  ['Cooling cover', 'Pillow client', '#B9C7F7', '£19', 'researching', 0, 0],
  ['Pillow bundle', 'Pillow client', '#6A86E0', '£89', 'paused', 6, 38],
  ['Travel pillow', 'Pillow client', '#8FA6F2', '£29', 'live', 11, 13]
];
const PRODUCTS = RAW.map(([name, client, color, price, status, videos, daysAgo], i) => ({ id: 'p' + i, name, client, color, price, status, videos, daysAgo }));
const STATUS = {
  researching: { label: 'Researching', cls: '' },
  ready: { label: 'Ready to assign', cls: 'lime' },
  editing: { label: 'With editors', cls: 'amber' },
  live: { label: 'Live', cls: 'green' },
  paused: { label: 'Paused', cls: '' }
};
const SORTS = { updated: 'Recently updated', name: 'Name A–Z', videos: 'Most videos' };
const PER_PAGE = 12;
const ago = (d) => (d === 0 ? 'Today' : d === 1 ? 'Yesterday' : d < 7 ? `${d} days ago` : d < 30 ? `${Math.round(d / 7)} wk ago` : `${Math.round(d / 30)} mo ago`);
// Where a product row leads: researching → setup, ready → assign to an editor, otherwise its brand kit.
const linkFor = (p) => (p.status === 'ready' ? '/editors' : p.status === 'researching' ? '/product/research' : '/product/brand-kit');

export default function Products() {
  const [q, setQ] = useState('');
  const [client, setClient] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('updated');
  const [page, setPage] = useState(0);
  const query = q.trim().toLowerCase();
  const reset = (fn) => (v) => { fn(v); setPage(0); };

  const shown = PRODUCTS
    .filter((p) => (client === 'all' || p.client === client) && (status === 'all' || p.status === status) && (!query || `${p.name} ${p.client}`.toLowerCase().includes(query)))
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'videos' ? b.videos - a.videos : a.daysAgo - b.daysAgo));
  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const rows = shown.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const count = (s) => PRODUCTS.filter((p) => p.status === s).length;

  return (
    <Layout section="Products" crumbs={['Visionary Studios', 'Products']} screen="Products">
      <PageHead
        title="Products"
        lede={`${PRODUCTS.length} products across ${BRANDS.length - 1} clients.`}
        right={<Link className="btn primary" to="/product/new"><Icon.plus />Add product</Link>}
      />

      <div className="row wrap" role="group" aria-label="Filter by status" style={{ gap: 8 }}>
        {[['all', 'All', PRODUCTS.length], ...Object.keys(STATUS).map((k) => [k, STATUS[k].label, count(k)])].map(([k, l, n]) => (
          <button key={k} type="button" className={'chip' + (status === k ? ' on' : '')} style={{ minHeight: 36 }} onClick={() => reset(setStatus)(k)}>{l} <span className="mono" style={{ opacity: 0.6, marginLeft: 4 }}>{n}</span></button>
        ))}
      </div>

      <section className="card" style={{ overflow: 'hidden' }}>
        <div className="row wrap" style={{ gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
          <div className="field" style={{ flex: '1 1 260px', minHeight: 40, borderRadius: 10 }}>
            <Icon.search style={{ color: 'var(--faint)' }} />
            <input value={q} onChange={(e) => reset(setQ)(e.target.value)} placeholder="Search products or clients" aria-label="Search products" style={{ minHeight: 38, fontSize: 14 }} />
          </div>
          <select className="in" value={client} onChange={(e) => reset(setClient)(e.target.value)} aria-label="Client" style={{ minHeight: 40, width: 'auto', fontSize: 13 }}>
            <option value="all">All clients</option>
            {BRANDS.filter((b) => b.name !== 'All brands').map((b) => <option key={b.name} value={b.name}>{b.name}</option>)}
          </select>
          <select className="in" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" style={{ minHeight: 40, width: 'auto', fontSize: 13 }}>
            {Object.entries(SORTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 620 }}>
            <div className="th" style={{ gridTemplateColumns: PROD_COLS }}><span>Product</span><span>Client</span><span>Status</span><span style={{ textAlign: 'right' }}>Videos</span><span>Updated</span></div>
            <div key={`${page}${client}${status}${sort}${query}`} className="stagger">
              {rows.map((p) => (
                <Link key={p.id} to={linkFor(p)} className="list-row" style={{ gridTemplateColumns: PROD_COLS, textDecoration: 'none', padding: '10px 18px' }}>
                  <span className="row" style={{ gap: 12, minWidth: 0 }}>
                    <span style={{ flex: 'none', width: 28, height: 28, borderRadius: 8, background: p.color, border: '1px solid var(--line-3)' }} />
                    <span className="stack" style={{ gap: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                      <span className="faint mono" style={{ fontSize: 11 }}>{p.price}</span>
                    </span>
                  </span>
                  <span className="muted" style={{ fontSize: 13 }}>{p.client}</span>
                  <span><span className={'pill ' + STATUS[p.status].cls} style={{ fontSize: 11, minHeight: 22 }}>{STATUS[p.status].label}</span></span>
                  <span className="mono" style={{ fontSize: 13, textAlign: 'right', color: p.videos ? 'var(--text)' : 'var(--faint)' }}>{p.videos || '-'}</span>
                  <span className="faint" style={{ fontSize: 12 }}>{ago(p.daysAgo)}</span>
                </Link>
              ))}
              {rows.length === 0 && <div className="faint" style={{ padding: '18px', fontSize: 14, borderTop: '1px solid var(--line)' }}>No products match. <button type="button" className="mini" style={{ marginLeft: 8 }} onClick={() => { setQ(''); setClient('all'); setStatus('all'); setPage(0); }}>Clear filters</button></div>}
            </div>
          </div>
        </div>

        <div className="row wrap between" style={{ gap: 10, padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
          <span className="faint" style={{ fontSize: 12 }}>{shown.length ? `${page * PER_PAGE + 1}–${Math.min(shown.length, (page + 1) * PER_PAGE)} of ${shown.length}` : '0 products'}</span>
          {pages > 1 && (
            <div className="row" style={{ gap: 4 }}>
              <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} disabled={page === 0} aria-label="Previous page" onClick={() => setPage(page - 1)}><Icon.chevron style={{ transform: 'rotate(90deg)' }} /></button>
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} type="button" className={'page-btn' + (i === page ? ' on' : '')} aria-current={i === page ? 'page' : undefined} onClick={() => setPage(i)}>{i + 1}</button>
              ))}
              <button type="button" className="icon-btn" style={{ width: 32, height: 32 }} disabled={page >= pages - 1} aria-label="Next page" onClick={() => setPage(page + 1)}><Icon.chevron style={{ transform: 'rotate(-90deg)' }} /></button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

const PROD_COLS = 'minmax(0, 2fr) minmax(0, 1fr) 150px 70px 100px';
