import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // Parallax Text Effect
      // The text moves slightly to the left as you scroll to the very bottom
      gsap.to(textRef.current, {
        xPercent: -10, // Slight horizontal shift
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom", // Start when top of footer hits bottom of viewport
          end: "bottom bottom",
          scrub: 1,
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="relative w-full h-[80vh] md:h-screen bg-[#F4F4F5] text-[#1c1c1c] flex flex-col justify-between overflow-hidden">
      
      {/* 1. TOP SPACE (Optional, keeps text at bottom) */}
      <div className="flex-grow"></div>

      {/* 2. THE GIANT TEXT */}
      {/* Centered vertically in the available space, overflowing horizontally */}
      <div className="relative w-full flex items-end justify-center pb-20 md:pb-0">
        <h1 
            ref={textRef}
            className="font-gilroy font-black text-[28vw] leading-[0.8] tracking-tighter whitespace-nowrap select-none pointer-events-none translate-y-[5%]"
        >
            JANAHI
        </h1>
      </div>

      {/* 3. BOTTOM BAR (The pills and credits) */}
      <div className="w-full px-4 md:px-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-xs md:text-sm font-mono uppercase z-10">
        
        {/* Left: Utility Links */}
        <div className="flex flex-wrap justify-center gap-2">
            {['Licensing', 'T&Cs', 'Privacy', 'Cookies'].map((text) => (
                <a 
                    key={text} 
                    href="#" 
                    className="bg-[#1c1c1c] text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                >
                    {text}
                </a>
            ))}
        </div>

        {/* Center: Copyright */}
        <div className="text-zinc-500 font-bold tracking-widest order-3 md:order-2">
            © {currentYear} Abdulrahman Janahi
        </div>

        {/* Right: Credits */}
        <div className="flex items-center gap-2 order-2 md:order-3">
            <span className="text-zinc-500 font-bold">Created by</span>
            <div className="flex gap-1">
                <span className="bg-[#6366f1] text-white px-3 py-1 rounded-full font-bold">ARJ</span>
                <span className="bg-[#8b5cf6] text-white px-3 py-1 rounded-full font-bold">DEV</span>
            </div>
        </div>

      </div>

    </footer>
  );
};

export default Footer;