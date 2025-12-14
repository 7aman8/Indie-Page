import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Home from './pages/Home/Home'
import Indie from './pages/indie'

gsap.registerPlugin(ScrollTrigger)

function LenisGSAPSync() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    // Sync Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.off('scroll', ScrollTrigger.update)
    }
  }, [lenis])

  return null
}

function App() {
  return (
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
  )
}

export default App
