import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef(null);
  const footerRef = useRef(null);
  const [time, setTime] = useState('');

  // --- TIME LOGIC ---
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bahrain',
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- ANIMATION ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Reveal Footer Background
      gsap.fromTo(footerRef.current,
        { backgroundColor: '#ffffff', opacity: 1 },
        {
          backgroundColor: '#000',
          ease: 'none',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          },
        }
      );

      // 2. Stagger in Bento Boxes
      gsap.fromTo('.bento-item',
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      );

    }, footerRef);
    return () => ctx.revert();
  }, []);

    const scrollToContact = () => {
    gsap.to(window, { 
      duration: 2, 
      scrollTo: "#contact",
      ease: "power4.inOut" 
    });
  };

  const socialLinks = [
    { name: 'INSTAGRAM', url: 'https://instagram.com/arj08._' },
    { name: 'X', url: 'https://x.com/ArjBuilds' },
    { name: 'LINKEDIN', url: 'https://linkedin.com/in/arj11' },
  ];

  // Shared Class for standard cards
  const cardClass = "bento-item bg-[#111] hover:bg-[#1a1a1a] rounded-xl sm:rounded-[2rem] p-3 sm:p-8 flex flex-col justify-between transition-all duration-500 border border-white/5 min-h-0 h-auto";
  const navClass = "bento-item bg-[#111] hover:bg-white hover:text-black rounded-xl sm:rounded-[2rem] p-3 sm:p-8 flex flex-col justify-between transition-all duration-300 border border-white/5 group cursor-pointer min-h-0 h-auto";

  return (
    <footer ref={footerRef} className="relative w-full min-h-screen bg-black flex flex-col justify-center py-3 px-1 sm:px-4 md:px-8 lg:h-screen lg:py-8 lg:overflow-hidden">
      
      <div ref={containerRef} className="w-full h-full max-w-[2000px] mx-auto flex flex-col gap-2 sm:gap-4 max-h-[100svh] overflow-y-auto">
        
        {/* --- MAIN GRID (Fills remaining height) --- */}
        <div className="flex-grow grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 min-h-0 h-auto">
          {/* 1. LOGO (Top Left - Wide) */}
          <div className={`${cardClass} col-span-1 md:col-span-2 lg:col-span-2`}>
            <div className="flex items-center gap-3">
                <span className="absolute top-5 right-5 w-10 h-10 rounded-full bg-red-500 animate-pulse"></span>
                {/* <span className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Available for work</span> */}
            </div>
            <h2 className="text-3xl sm:text-6xl md:text-8xl lg:text-9xl font-gilroy font-bold text-white tracking-tighter leading-[0.8] mt-2 sm:mt-4">
                A.JANAHI
            </h2>
          </div>

          {/* 2. NAV: HOME */}
          <a href="/" className={navClass}>
              <span className="self-end text-zinc-600 text-xl group-hover:text-black transition-colors">01</span>
              <span className="font-gilroy font-bold text-xl sm:text-3xl uppercase group-hover:translate-x-2 transition-transform">Home</span>
          </a>

          {/* 3. NAV: ME */}
          <a href="#about" className={navClass}>
              <span className="self-end text-zinc-600 text-xl group-hover:text-black transition-colors">02</span>
              <span className="font-gilroy font-bold text-xl sm:text-3xl uppercase group-hover:translate-x-2 transition-transform">Me</span>
          </a>

          {/* 5. NAV: WORK (Now always after Home and Me) */}
          <a href="#work" className={navClass}>
              <span className="self-end text-zinc-600 text-xl group-hover:text-black transition-colors">03</span>
              <span className="font-gilroy font-bold text-xl sm:text-3xl uppercase group-hover:translate-x-2 transition-transform">Work</span>
          </a>

          {/* 4. RED CTA: LET'S WORK (Wide) */}
          <a
            onClick={() => scrollToContact()}
            className="bento-item col-span-1 md:col-span-2 lg:col-span-2 bg-[#b91c1c] hover:bg-[#dc2626] rounded-xl sm:rounded-[2rem] p-3 sm:p-8 flex flex-col justify-between text-white group cursor-pointer transition-colors duration-300 min-h-0 h-auto"
          >
              <div className="flex justify-between items-start">
                  <p className="font-mono text-sm uppercase tracking-widest opacity-70">Collaboration</p>
                  <span className="text-2xl group-hover:rotate-45 transition-transform duration-300">↗</span>
              </div>
              <div>
                  <h3 className="font-gilroy font-black text-2xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-tighter mb-2">
                      LET'S WORK <br/> TOGETHER
                  </h3>
              </div>
          </a>

          {/* 6. SAY HELLO (Tall - Spans 2 Rows on Desktop, improved mobile fit) */}
          <a
            href="mailto:arjanahi2008@gmail.com"
            className="bento-item col-span-1 md:col-span-1 lg:row-span-2 bg-white hover:scale-[0.98] rounded-xl sm:rounded-[2rem] p-2 sm:p-8 flex flex-col justify-between text-black transition-transform duration-300 cursor-pointer min-h-0 h-auto"
          >
              <div className="flex justify-end mb-2 sm:mb-4">
                  <span className="text-red-600 text-4xl sm:text-7xl animate-spin-slow">❋</span>
              </div>
              <div>
                  <p className="font-mono text-xs sm:text-sm uppercase tracking-widest text-zinc-500 mb-1 sm:mb-2">Say</p>
                  <h3 className="font-gilroy font-black text-2xl sm:text-6xl lg:text-8xl tracking-tighter leading-none break-words">
                      مرحبا
                  </h3>
              </div>
          </a>

          {/* --- ROW 3 --- */}

          {/* 7. LOCATION (Wide) */}
          <div className={`${cardClass} col-span-1 md:col-span-2 lg:col-span-2`}>
            <div className="flex flex-col h-full justify-between gap-6">

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <h3 className="text-2xl sm:text-5xl lg:text-6xl font-gilroy font-bold text-white mb-2">
                    Bahrain
                  </h3>
                  <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
                    Middle East
                  </p>
                </div>

                <div className="align-middle -translate-y-5 text-left md:text-right">
                  <p className="font-mono text-sm sm:text-xl text-zinc-300 mb-1">
                    {time} GMT+3
                  </p>
                  <p className="text-zinc-500 font-mono text-sm">
                    Local Time
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-6 font-mono text-xs sm:text-sm md:text-md uppercase tracking-widest text-zinc-500">
                <span>Lat 26.0667° N</span>
                <span>Lng 50.5577° E</span>
              </div>

            </div>
          </div>

          {/* 8. SOCIALS (1 Col) */}
          <div className={`${cardClass} gap-1 sm:gap-4`}>
            {socialLinks.map((social) => (
              <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center group/link w-full border-b border-zinc-800 pb-2 last:border-0 hover:border-white transition-colors">
                <span className="font-gilroy font-bold text-base sm:text-lg text-zinc-400 group-hover/link:text-white transition-colors">{social.name}</span>
                <span className="text-white opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="bento-item h-auto lg:h-[60px] bg-[#111] rounded-xl sm:rounded-[2rem] px-3 sm:px-8 py-2 sm:py-4 flex flex-col md:flex-row items-center justify-between text-zinc-500 font-mono text-xs uppercase tracking-widest border border-white/5 mt-2 sm:mt-4">
            <span className="text-zinc-600">Magician</span>
            <span className="text-zinc-400">Designed & Built by ARJ.</span>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </footer>
  );
};

export default Footer;