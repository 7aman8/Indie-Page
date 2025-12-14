import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Line-by-Line Text Reveal
      const lines = gsap.utils.toArray('.bio-line');
      gsap.fromTo(lines, 
        { y: 100, opacity: 0, rotateX: -20 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 2. Stats Grid Fade In
      gsap.fromTo(".stat-card",
        { y: 50, opacity: 0 },
        {
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 1, 
          scrollTrigger: {
              trigger: ".stats-grid",
              start: "top 85%"
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-24 md:py-40 px-6 md:px-12 bg-[#09090b] text-white">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Label */}
        <div className="mb-12 flex items-center gap-4 opacity-50">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="font-mono text-sm tracking-widest uppercase">The Context</span>
        </div>

        {/* Main Statement */}
        <div ref={textRef} className="mb-24">
            <h2 className="text-3xl md:text-6xl lg:text-7xl font-gilroy font-bold leading-[1.1] tracking-tight">
                <div className="overflow-hidden"><div className="bio-line">I don't just write code.</div></div>
                <div className="overflow-hidden"><div className="bio-line text-zinc-500">I engineer <span className="text-white italic font-[Georgia]">digital clarity</span></div></div>
                <div className="overflow-hidden"><div className="bio-line">in a chaotic world.</div></div>
            </h2>
            <div className="mt-8 max-w-2xl overflow-hidden">
                <p className="bio-line text-lg md:text-xl text-zinc-400 font-geist leading-relaxed">
                    Based in Bahrain, I operate at the intersection of design systems and full-stack architecture. My goal is simple: build applications that feel inevitable.
                </p>
            </div>
        </div>

        {/* Technical / Bento Grid */}
        <div className="stats-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="stat-card p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                <h3 className="text-zinc-500 font-mono text-xs uppercase mb-4">Core Stack</h3>
                <ul className="space-y-2 font-gilroy font-bold text-xl">
                    <li>React / Next.js</li>
                    <li>TypeScript</li>
                    <li>Node.js / Go</li>
                    <li>PostgreSQL</li>
                </ul>
            </div>

            {/* Card 2 */}
            <div className="stat-card p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                <h3 className="text-zinc-500 font-mono text-xs uppercase mb-4">Design Philosophy</h3>
                <p className="text-lg text-zinc-300 font-geist">
                    Minimalism is not the absence of elements, but the perfection of the essential.
                </p>
            </div>

            {/* Card 3 */}
            <div className="stat-card p-8 rounded-2xl border border-zinc-800 bg-red-900/10 border-red-900/20 hover:bg-red-900/20 transition-colors">
                <h3 className="text-red-400 font-mono text-xs uppercase mb-4">Current Status</h3>
                <div className="flex items-end justify-between h-full pb-2">
                    <span className="text-4xl font-gilroy font-bold text-white">Open for<br/>Business</span>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mb-2"></div>
                </div>
            </div>

        </div>

      </div>
    </section>
  );
};

export default About;