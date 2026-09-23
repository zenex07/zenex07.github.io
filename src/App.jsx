import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger, useSmoothScroll } from './hooks/useMotion.js';

import Preloader from './components/Preloader.jsx';
import Cursor from './components/Cursor.jsx';
import Grain from './components/Grain.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Work from './components/Work.jsx';
import Approach from './components/Approach.jsx';
import About from './components/About.jsx';
import Journey from './components/Journey.jsx';
import Research from './components/Research.jsx';
import Credentials from './components/Credentials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [ready, setReady] = useState(false);
  useSmoothScroll();

  const handleDone = useCallback(() => setReady(true), []);

  // Web fonts change every line box; recalculate triggers once they land.
  useEffect(() => {
    if (!document.fonts?.ready) return;
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <Preloader onDone={handleDone} />
      <Cursor />
      <Grain />
      <Nav />

      <main>
        <Hero ready={ready} />
        <Marquee />
        <Work />
        <Approach />
        <About />
        <Journey />
        <Research />
        <Credentials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
