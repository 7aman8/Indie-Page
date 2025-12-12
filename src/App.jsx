import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Indie from "./pages/indie"; 

import { ReactLenis } from 'lenis/react'

// Geist font
// import { GeistSans } from 'geist/font/sans';

function App() {

  return (
    <BrowserRouter>
      <ReactLenis
        smooth={true}
        smoothTouch={false}
        touchMultiplier={2}
        autoRaf={true}
        autoResize={true}
        normalizeWheel={true}
        gestureDirection="vertical"
        scrollingClass="scrolling"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/indie" element={<Indie />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ReactLenis>
    </BrowserRouter>
  )
}

export default App

