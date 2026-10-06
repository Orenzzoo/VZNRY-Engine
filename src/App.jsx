import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './pages/Home.jsx';
import NewProduct from './pages/NewProduct.jsx';
import BrandKit from './pages/BrandKit.jsx';
import Research from './pages/Research.jsx';
import Generate from './pages/Generate.jsx';
import Tasks from './pages/Tasks.jsx';
import Editors from './pages/Editors.jsx';
import Products from './pages/Products.jsx';
import Clients from './pages/Clients.jsx';
import Director from './pages/Director.jsx';
import Review from './pages/Review.jsx';
import Deliver from './pages/Deliver.jsx';
import Publish from './pages/Publish.jsx';
import Recipes from './pages/Recipes.jsx';
import PromptEditor from './pages/PromptEditor.jsx';
import Characters from './pages/Characters.jsx';
import Brief from './pages/Brief.jsx';
import CustomGenerate from './pages/CustomGenerate.jsx';
import Concepts from './pages/Concepts.jsx';
import Cast from './pages/Cast.jsx';
import ReviewQueue from './pages/ReviewQueue.jsx';
import ClientReviews from './pages/ClientReviews.jsx';
import Library from './pages/Library.jsx';
import ClientReview from './pages/ClientReview.jsx';

// The old hand-off pages now open the hand-off form on the Editors page.
function ToHandoff() {
  const [params] = useSearchParams();
  return <Navigate to={`/editors?handoff=${params.get('pkg') || ''}`} replace />;
}

// Old /briefs/* links keep working (with their ?ex= sample).
function KeepQuery({ to }) {
  const { search } = useLocation();
  return <Navigate to={to + search} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Researcher: product link → brand kit → research → hand off */}
        <Route path="/products" element={<Products />} />
        <Route path="/product/new" element={<NewProduct />} />
        <Route path="/product/brand-kit" element={<BrandKit />} />
        <Route path="/product/research" element={<Research />} />
        <Route path="/product/handoff" element={<ToHandoff />} />

        {/* Editor: assigned tasks → generate → review → deliver */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/product/formats" element={<Navigate to="/generate" replace />} />
        <Route path="/product/director" element={<Director />} />
        <Route path="/product/review" element={<Review />} />
        <Route path="/product/deliver" element={<Deliver />} />
        <Route path="/product/publish" element={<Publish />} />

        {/* Custom videos (editor): ads with no product page */}
        <Route path="/custom/new" element={<Brief />} />
        <Route path="/custom/episodes" element={<Concepts />} />
        <Route path="/custom/cast" element={<Cast />} />
        <Route path="/custom/generate" element={<CustomGenerate />} />
        <Route path="/briefs/new" element={<KeepQuery to="/custom/new" />} />
        <Route path="/briefs/concepts" element={<KeepQuery to="/custom/episodes" />} />
        <Route path="/briefs/cast" element={<KeepQuery to="/custom/cast" />} />

        {/* Workspace pages */}
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/editor" element={<PromptEditor />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/review-queue" element={<ReviewQueue />} />
        <Route path="/client-reviews" element={<ClientReviews />} />
        <Route path="/library" element={<Library />} />
        <Route path="/buyers" element={<Research standalone />} />
        <Route path="/editors" element={<Editors />} />
        <Route path="/assign" element={<ToHandoff />} />
        <Route path="/clients" element={<Clients />} />

        {/* What the client sees from a review link (no sidebar) */}
        <Route path="/review/:roundId" element={<ClientReview />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
