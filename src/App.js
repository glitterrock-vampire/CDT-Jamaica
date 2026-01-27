import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PageScrollReveal from './components/PageScrollReveal';
import Home from './pages/Home';
import Repertoire from './pages/Repertoire';
import About from './pages/About';
import Company from './pages/Company';
import DanceDetail from './pages/DanceDetail';
import PerformanceDetail from './pages/PerformanceDetail';
import Contact from './pages/Contact';
import Performances from './pages/Performances';
import { getSiteSettings } from './lib/siteSettings';

function App() {
  const [siteSettings, setSiteSettings] = useState(null);

  // Fetch site settings
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };

    fetchSiteSettings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Routes>
        <Route path="/" element={
          <Layout>
            <PageScrollReveal>
              <Home />
            </PageScrollReveal>
          </Layout>
        } />
        <Route path="/repertoire" element={
          <Layout>
            <PageScrollReveal>
              <Repertoire />
            </PageScrollReveal>
          </Layout>
        } />
        <Route path="/dance/:id" element={
          <Layout>
            <PageScrollReveal>
              <DanceDetail />
            </PageScrollReveal>
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <PageScrollReveal>
              <About />
            </PageScrollReveal>
          </Layout>
        } />
        <Route path="/company" element={
          <Layout>
            <PageScrollReveal>
              <Company />
            </PageScrollReveal>
          </Layout>
        } />
        <Route path="/performances" element={
          <Layout>
            <PageScrollReveal>
              <Performances />
            </PageScrollReveal>
          </Layout>
        } />
        <Route path="/performance/:slug" element={
          <Layout>
            <PageScrollReveal>
              <PerformanceDetail />
            </PageScrollReveal>
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <PageScrollReveal>
              <Contact />
            </PageScrollReveal>
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;