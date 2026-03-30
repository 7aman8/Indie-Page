import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Home from './pages/Home/Home'
import Indie from './pages/indie'

import Preloader from './components/Prelaoder'
import CustomCursor from './components/CustomCursor'

gsap.registerPlugin(ScrollTrigger)

function LenisGSAPSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    let pointerTimer;
    const handleScroll = () => {
      ScrollTrigger.update();
      document.body.style.pointerEvents = 'none';
      clearTimeout(pointerTimer);
      pointerTimer = setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 50);
    };

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', handleScroll)

    const raf = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.off('scroll', handleScroll)
      clearTimeout(pointerTimer);
      document.body.style.pointerEvents = '';
    }
  }, [lenis])

  return null
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <CustomCursor />
      <BrowserRouter>
        <ReactLenis
          root
          smooth
          lerp={0.1}
          smoothTouch={false}
        >
          <LenisGSAPSync />

          <div className="min-h-screen w-full bg-[#09090b]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/indie" element={<Indie />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ReactLenis>
      </BrowserRouter>
    </>
  )
}

export default App
