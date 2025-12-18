import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const gridRef = useRef(null);
  const headerContainerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      gsap.set(gridRef.current, { y: "35vh" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500", 
          pin: true,
          scrub: 2, 
          anticipatePin: 1,
        }
      });

      tl.to(containerRef.current, { 
          backgroundColor: "#000000", 
          duration: 1, 
          ease: "power2.inOut" 
      }, 0)
      .to(textRef.current, { 
          color: "#ffffff", 
          duration: 1 
      }, 0);

      tl.to(gridRef.current, {
          y: "0vh", 
          duration: 2, 
          ease: "power2.inOut"
      }, 0.2); 

      tl.to(headerContainerRef.current, {
          y: "-30vh",
          opacity: 0,
          duration: 2
      }, 0.2);

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
        ref={containerRef} 
        id='about'
        className="relative w-full h-screen bg-white text-black overflow-hidden flex flex-col font-gilroy"
    >
      
      <div ref={headerContainerRef} className="absolute top-0 left-0 w-full h-[35vh] z-0 flex flex-col justify-end px-4 md:px-8 pb-4">
          
          <div className="w-full overflow-hidden">
            <h1 
                ref={textRef}
                className="text-[18vw] md:text-[23.3vw] leading-[0.8] uppercase font-light tracking-tighter whitespace-nowrap -ml-2 md:-ml-5 transition-colors text-black"
            >
                About Me
            </h1>
          </div>

          <div className="w-full flex justify-between items-end text-[9px] md:text-xs font-bold uppercase tracking-widest opacity-50 mt-4 text-inherit">
            <span>Engineered, Not Decorated</span>
            <div className="flex gap-4 md:gap-32 text-right md:text-left">
              <span>Always Shipping</span>
              <span className="hidden sm:block">/Readable Systems</span>
              <span className="hidden md:block">//No Shortcuts</span>
            </div>
          </div>

      </div>

      <div 
        ref={gridRef} 
        className="absolute left-0 w-full h-screen z-10 grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-2 md:gap-3 px-2 md:px-4 py-2 md:py-4 box-border"
      >

        {/* CARD 1: INDIE DEV */}
        <div className="relative bg-white text-black border border-black/10 rounded-xl md:rounded-2xl p-4 md:p-10 flex flex-col justify-between group overflow-hidden">
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-light tracking-tighter leading-none">
                INDIE DEV
            </h3>
            <div className="mt-2 md:mt-auto">
                <p className="text-sm sm:text-lg md:text-3xl font-medium tracking-tight mb-2 md:mb-6">Projects at ArjBuilds.dev</p>
                <a href="https://arjbuilds.dev/indie" target='_blank' rel="noreferrer">
                    <button className="px-4 py-1.5 md:px-6 md:py-2 bg-black text-white rounded-full text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-red-700 transition-colors w-fit">
                        arjbuilds.dev
                    </button>
                </a>
            </div>
        </div>

        {/* CARD 2: AWARDS */}
        <div className="relative bg-black text-white border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-10 flex flex-col justify-between group overflow-hidden">
            <h3 className="text-4xl sm:text-5xl md:text-8xl font-light tracking-tighter leading-none text-right w-full">
                AWARDS
            </h3>
            <div className="mt-2 md:mt-auto flex flex-col items-end">
                <p className="text-sm sm:text-lg md:text-3xl font-medium tracking-tight mb-2 md:mb-6 text-right">Won As Individual</p>
                <div className="flex gap-1 md:gap-2 flex-wrap justify-end">
                    {['School Comp', 'Best UI'].map((badge) => (
                        <span key={badge} className="px-3 py-1 md:px-4 md:py-2 border border-white/20 rounded-full text-[9px] md:text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-default whitespace-nowrap">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        {/* CARD 3: 100% */}
        <div className="relative bg-red-700 text-white rounded-xl md:rounded-2xl p-4 md:p-10 flex flex-col justify-center overflow-hidden">
            <div className="absolute bottom-[-1vw] left-[-1vw]">
                <h3 className="text-[30vw] md:text-[20vw] font-light tracking-tighter leading-none">
                    100%
                </h3>
            </div>
            <p className="absolute top-4 right-4 md:top-10 md:right-10 bg-red-950 p-1.5 md:p-2 rounded-lg font-mono text-[10px] md:text-sm uppercase tracking-widest opacity-80">
                Commitment Rate
            </p>
        </div>

        {/* CARD 4: HUMAN */}
        <div className="relative bg-white text-black border border-black/10 rounded-xl md:rounded-2xl p-4 md:p-10 flex flex-col items-center justify-center overflow-hidden group text-center">
            <h3 className="relative md:absolute md:top-20 text-4xl sm:text-5xl md:text-8xl font-light tracking-tighter flex items-center justify-center gap-2 md:gap-4">
                I AM HUMAN 
                <span className="inline-block transform group-hover:rotate-12 transition-transform duration-300 font-normal text-red-700">
                    ッ
                </span>
            </h3>

            <div className='mt-2 md:mt-0 md:absolute md:bottom-10 md:left-20 flex items-center justify-center gap-1 md:gap-2 text-lg sm:text-xl md:text-4xl'>
              <span>I</span> 
              <Heart className="inline-block w-4 h-4 sm:w-6 sm:h-6 md:w-10 md:h-10 text-red-600" /> 
              <span>To Learn And Code.</span>
            </div>
        </div>

      </div>

    </section>
  );
};

export default About;