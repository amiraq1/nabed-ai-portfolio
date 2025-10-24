import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Spinner from './components/Spinner';

// Lazy load all sections below the fold to improve initial page load time
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const GitHub = lazy(() => import('./components/GitHub'));
const VideoGenerator = lazy(() => import('./components/VideoGenerator'));
const Blog = lazy(() => import('./components/Blog'));
const Contact = lazy(() => import('./components/Contact'));

// A fallback component to show while lazy components are loading
const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-20">
    <Spinner />
    <p className="mr-4 text-slate-300">جاري تحميل المحتوى...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 text-slate-300">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingIndicator />}>
          <About />
          <Skills />
          <Portfolio />
          <GitHub />
          <VideoGenerator />
          <Blog />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Contact />
      </Suspense>
    </div>
  );
};

export default App;