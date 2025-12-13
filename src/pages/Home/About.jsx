import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. Marquee Animation (Continuous loop)
      const loops = gsap.utils.toArray('.marquee-text').map((line, i) => {
        const links = line.querySelectorAll(".js-text");
        return gsap.to(links, {
          xPercent: -100,
          repeat: -1,
          duration: 15,
          ease: "none",
        });
      });

      // 2. Text Reveal Animation (Split line effect)
      gsap.fromTo(".about-line", 
        { y: 100, opacity: 0, rotateX: -45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%", // Starts when top of text hits 80% of viewport height
            toggleActions: "play none none reverse"
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-20 md:py-32 overflow-hidden bg-zinc-950 rounded-t-[3rem] -mt-10 border-t border-white/10">
      
      {/* Background Grid Pattern (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Label */}
        <div className="mb-10 md:mb-20 overflow-hidden">
             <h2 className="text-sm font-geist uppercase tracking-widest text-zinc-500 mb-2">/ Who I Am</h2>
             <div className="w-full h-[1px] bg-zinc-800"></div>
        </div>

        {/* Huge Scrolling Marquee */}
        <div className="w-full overflow-hidden flex whitespace-nowrap mb-16 select-none opacity-20 pointer-events-none">
            <div className="marquee-text flex gap-8 text-[10vh] md:text-[15vh] font-gilroy font-bold uppercase leading-none text-transparent stroke-text">
                {[...Array(4)].map((_, i) => (
                    <span key={i} className="js-text flex gap-8">
                        <span>Creative</span>
                        <span className="text-red-700">Developer</span>
                        <span>Designer</span>
                        <span className="text-zinc-700">—</span>
                    </span>
                ))}
            </div>
        </div>

        {/* Bio Text */}
        <div ref={textRef} className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-gilroy font-bold leading-tight">
                <div className="overflow-hidden"><div className="about-line">I craft digital experiences</div></div>
                <div className="overflow-hidden"><div className="about-line">that blend <span className="text-red-600">technical depth</span></div></div>
                <div className="overflow-hidden"><div className="about-line">with <span className="italic font-[Georgia]">artistic precision.</span></div></div>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16 font-geist text-zinc-400 text-lg md:text-xl">
                <div className="about-line">
                    <p>Based in Bahrain, I bridge the gap between design and engineering. I don't just write code; I solve problems using visual language and interactive systems.</p>
                </div>
                <div className="about-line">
                    <p>Currently obsessed with micro-interactions, WebGL, and building accessible applications that feel alive.</p>
                </div>
            </div>
        </div>

      </div>

      {/* Add this style for the outlined text in marquee */}
      <style jsx>{`
        .stroke-text {
            -webkit-text-stroke: 2px #3f3f46; 
        }
      `}</style>
    </section>
  );
};

export default About;