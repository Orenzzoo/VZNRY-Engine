import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Home from './pages/Home.jsx';
import NewProduct from './pages/NewProduct.jsx';
import BrandKit from './pages/BrandKit.jsx';
import Research from './pages/Research.jsx';
import Formats from './pages/Formats.jsx';
import Director from './pages/Director.jsx';
import Review from './pages/Review.jsx';
import Deliver from './pages/Deliver.jsx';
import Publish from './pages/Publish.jsx';
import Recipes from './pages/Recipes.jsx';
import PromptEditor from './pages/PromptEditor.jsx';
import Characters from './pages/Characters.jsx';
import Brief from './pages/Brief.jsx';
import Concepts from './pages/Concepts.jsx';
import Cast from './pages/Cast.jsx';
import ReviewQueue from './pages/ReviewQueue.jsx';
import ClientReviews from './pages/ClientReviews.jsx';
import Library from './pages/Library.jsx';
import ClientReview from './pages/ClientReview.jsx';

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

        {/* Product flow, steps 1–7 */}
        <Route path="/product/new" element={<NewProduct />} />
        <Route path="/product/brand-kit" element={<BrandKit />} />
        <Route path="/product/research" element={<Research />} />
        <Route path="/product/formats" element={<Formats />} />
        <Route path="/product/director" element={<Director />} />
        <Route path="/product/review" element={<Review />} />
        <Route path="/product/deliver" element={<Deliver />} />
        <Route path="/product/publish" element={<Publish />} />

        {/* Briefs: custom ads with no product page */}
        <Route path="/briefs/new" element={<Brief />} />
        <Route path="/briefs/concepts" element={<Concepts />} />
        <Route path="/briefs/cast" element={<Cast />} />

        {/* Workspace pages */}
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/editor" element={<PromptEditor />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/review-queue" element={<ReviewQueue />} />
        <Route path="/client-reviews" element={<ClientReviews />} />
        <Route path="/library" element={<Library />} />
        <Route path="/buyers" element={<Research standalone />} />

        {/* What the client sees from a review link (no sidebar) */}
        <Route path="/review/:roundId" element={<ClientReview />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
