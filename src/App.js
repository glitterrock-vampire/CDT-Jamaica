import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PageBounce from './components/PageBounce';
import Home from './pages/Home';
import Repertoire from './pages/Repertoire';
import About from './pages/About';
import DanceDetail from './pages/DanceDetail';
import Contact from './pages/Contact';
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
            <PageBounce>
              <Home />
            </PageBounce>
          </Layout>
        } />
        <Route path="/repertoire" element={
          <Layout>
            <PageBounce>
              <Repertoire />
            </PageBounce>
          </Layout>
        } />
        <Route path="/dance/:id" element={
          <Layout>
            <PageBounce>
              <DanceDetail />
            </PageBounce>
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <PageBounce>
              <About />
            </PageBounce>
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <PageBounce>
              <Contact />
            </PageBounce>
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;