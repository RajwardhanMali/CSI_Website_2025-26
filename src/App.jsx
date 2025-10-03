import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Loader from './components/Loader'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import Event from './components/Event';
import HeroSection from './components/HeroSection';
import './index.css'
import MeetTheTeam from './components/MeetTheTeam';
import Footer from './components/Footer';
import Volunteer from './pages/Volunteer';

function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;


  return (
    <>
      <div id="home">
        <HeroSection />
      </div>
      <Navbar />
      <div id="about">
        <AboutUs />
      </div>
      <div id="events">
        <Event />
      </div>
      <div id="team">
        <MeetTheTeam />
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="*" element={<Navigate to="/volunteer" replace />} />
      </Routes>
    </BrowserRouter>
  )
}