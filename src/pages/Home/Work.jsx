import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; // Needed for buttons

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const projects = [
  { 
    id: 1, 
    title: "Fintech Dashboard", 
    category: "Fullstack", 
    src: "/Talking.webp", 
    link: "https://google.com",
    description: "A real-time asset management platform allowing users to track stocks, crypto, and NFTs."
  },
  { 
    id: 2, 
    title: "E-Commerce AI", 
    category: "Development", 
    src: "/Smiling.webp", 
    link: "https://google.com",
    description: "AI-powered recommendation engine that increases conversion rates by analyzing user behavior."
  },
  { 
    id: 3, 
    title: "Bahrain Tourism", 
    category: "Design", 
    src: "/Portrait.webp", 
    link: "https://google.com",
    description: "An immersive digital experience showcasing the hidden gems of Bahrain with WebGL maps."
  },
  { 
    id: 4, 
    title: "Crypto Wallet", 
    category: "Web3", 
    src: "/Talking.webp", 
    link: "https://google.com",
    description: "Non-custodial wallet with biometric authentication enabling secure transactions."
  },
];

const Work = () => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const sliderRef = useRef(null);
  const initialTextRef = useRef(null);
  
  const cursorRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Constants for animation timing
  const SCROLL_DURATION = 5000; // Total pixels to pin
  // These ratios determine how much of the scroll is dedicated to each phase
  // 1 unit for text fade out, 2 units for expansion, 6 units for sliding
  const EXPANSION_PHASE = 0.3; // First 30% is expanding
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${SCROLL_DURATION}`, 
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Calculate which slide is currently in view based on scroll progress
            const slideProgress = (self.progress - EXPANSION_PHASE) / (1 - EXPANSION_PHASE);
            if (slideProgress < 0) {
                setCurrentSlide(0);
            } else {
                const index = Math.round(slideProgress * (projects.length - 1));
                setCurrentSlide(Math.min(Math.max(index, 0), projects.length - 1));
            }
          }
        }
      });

      // --- SEQUENCE START ---

      // 1. Initial Text: Visible at start, fades out quickly
      tl.to(initialTextRef.current, { 
          opacity: 0, 
          scale: 0.8, 
          duration: 1, 
          ease: "power2.out" 
      })

      // 2. Video Box: Fades IN (Small Center)
      .fromTo(wrapperRef.current, 
          { width: "0px", height: "0px", opacity: 0, borderRadius: "100px" },
          { width: "300px", height: "400px", opacity: 1, borderRadius: "32px", duration: 1, ease: "power2.out" }
      )

      // 3. Video Box: Expands to Full Screen
      .to(wrapperRef.current, {
        width: "90vw",
        height: "90vh",
        borderRadius: "0px",
        duration: 2, // Gives it weight
        ease: "power2.inOut"
      })

      // 4. Carousel: Slides to the left
      // We use a longer duration so the sliding feels substantial compared to the intro
      .to(sliderRef.current, {
        xPercent: -100 * ((projects.length - 1) / projects.length), 
        ease: "none",
        duration: 8 // Relative duration
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  // --- NAVIGATION LOGIC ---
  const handleNavClick = (direction) => {
    const nextIndex = direction === 'next' 
      ? Math.min(currentSlide + 1, projects.length - 1)
      : Math.max(currentSlide - 1, 0);

    // Calculate the scroll position for this specific slide
    // Formula: StartPos + (TotalDistance * ExpansionRatio) + (TotalDistance * SliderRatio * (Index / TotalSlides))
    
    // 1. Where does the container start?
    const startY = containerRef.current.offsetTop;
    
    // 2. How much scroll is used for the Intro/Expansion?
    const expansionScroll = SCROLL_DURATION * EXPANSION_PHASE;
    
    // 3. How much scroll is left for the slider?
    const sliderScroll = SCROLL_DURATION * (1 - EXPANSION_PHASE);
    
    // 4. Calculate offset per slide
    const scrollPerSlide = sliderScroll / (projects.length - 1);

    // 5. Final Target
    const targetScroll = startY + expansionScroll + (scrollPerSlide * nextIndex);

    // Scroll there smoothly
    gsap.to(window, { scrollTo: targetScroll, duration: 1.5, ease: "power2.inOut" });
  };

  // --- CURSOR LOGIC ---
  useEffect(() => {
    const cursor = cursorRef.current;
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (isHovering) {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
    } else {
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
    }
  }, [isHovering]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#09090b] overflow-hidden flex items-center justify-center">
      
      {/* --- INITIAL TEXT --- */}
      <div 
        ref={initialTextRef} 
        className="absolute z-40 text-center pointer-events-none"
      >
        <h2 className="text-8xl md:text-[10vw] font-gilroy font-bold text-white uppercase tracking-tighter leading-none mb-6">
            My Work
        </h2>
        <p className="text-zinc-500 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
            Scroll to view my projects
        </p>
      </div>

      {/* --- NAVIGATION BUTTONS --- */}
      {/* Only visible when not expanding (could animate opacity based on scroll if desired, keeping simple for now) */}
      <div className="absolute bottom-10 right-10 z-50 flex gap-4 mix-blend-difference">
         <button 
            onClick={() => handleNavClick('prev')}
            disabled={currentSlide === 0}
            className={`w-14 h-14 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed`}
         >
            ←
         </button>
         <button 
            onClick={() => handleNavClick('next')}
            disabled={currentSlide === projects.length - 1}
            className={`w-14 h-14 rounded-full border border-white flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed`}
         >
            →
         </button>
      </div>

      {/* --- CUSTOM CURSOR --- */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-32 h-32 bg-red-600 rounded-full flex items-center justify-center z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-difference opacity-0 scale-0"
      >
        <span ref={cursorLabelRef} className="text-white font-gilroy font-bold text-sm uppercase tracking-widest animate-pulse">
            Visit Site ↗
        </span>
      </div>

      {/* --- THE CLIPPED WINDOW --- */}
      <div 
        ref={wrapperRef} 
        className="relative overflow-hidden shadow-2xl bg-zinc-900"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        // Initial styles handled by GSAP fromTo, but safe defaults here:
        style={{ width: 0, height: 0, opacity: 0 }} 
      >
         
         {/* --- HORIZONTAL TRACK --- */}
         <div 
            ref={sliderRef}
            className="h-full flex"
            style={{ width: `${projects.length * 100}%` }}
         >
            {projects.map((project) => (
                <div 
                    key={project.id} 
                    className="relative w-screen h-full flex-shrink-0 border-r border-white/10 group cursor-pointer"
                    onClick={() => window.open(project.link, "_blank")}
                >
                    {/* VIDEO/IMAGE */}
                    <div className="absolute inset-0 w-full h-full">
                         <img 
                            src={project.src} 
                            alt={project.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                    </div>

                    {/* PROJECT INFO */}
                    <div className="absolute bottom-10 left-6 md:bottom-20 md:left-20 z-20 text-white max-w-2xl pr-10">
                        <p className="font-mono text-xs md:text-sm text-red-500 mb-2 uppercase tracking-widest">
                            {project.category}
                        </p>
                        <h3 className="text-4xl md:text-7xl font-gilroy font-bold leading-none mb-2">
                            {project.title}
                        </h3>
                        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                            <div className="overflow-hidden">
                                <p className="pt-4 text-lg md:text-xl text-zinc-300 font-geist leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    {project.description}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            ))}
         </div>

      </div>

    </section>
  );
};

export default Work;