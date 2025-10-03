import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
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
            <Home />
          </Layout>
        } />
        <Route path="/repertoire" element={
          <Layout>
            <Repertoire />
          </Layout>
        } />
        <Route path="/dance/:id" element={
          <Layout>
            <DanceDetail />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
      </Routes>
    </div>
  );
}

export default App;