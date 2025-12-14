import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const contentRef = useRef(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          onComplete(); 
        }
      });

      // --- COUNTER ANIMATION ---
      const counterObj = { value: 0 };
      tl.to(counterObj, {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
            setCounter(Math.floor(counterObj.value));
        }
      });

      // --- EXIT SEQUENCE ---
      
      tl.to(contentRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
      });

      const startPath = "M0,0 L100,0 L100,100 Q50,150 0,100 Z"; 
      const endPath = "M0,0 L100,0 L100,0 Q50,0 0,0 Z";

      tl.to(svgRef.current, {
        attr: { d: endPath },
        duration: 0.8,
        ease: "power2.inOut"
      }, "<"); 

      tl.to(containerRef.current, {
        y: "-100vh",
        duration: 0.8,
        ease: "power2.inOut"
      }, "<");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#000000] text-white w-full h-screen"
    >
      
      <div ref={contentRef} className="w-full h-full relative">
        
        {/* Added subtle tracking to text and decreased base size */}
        <div className="absolute inset-0 h-[100vh] flex items-center justify-center">
            <h2 className="text-2xl md:text-4xl font-h font-light tracking-[0.05em] text-white opacity-70">
                Your Vision &mdash; My Execution
            </h2>
        </div>

        {/* Made the counter pure white, same size and position */}
        <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 overflow-hidden">
            <h1 className="text-[15vw] opacity-70 md:text-[12vw] font-h font-normal leading-none tracking-tighter tabular-nums text-white">
                {counter}%
            </h1>
        </div>

      </div>

      <svg 
        className="absolute top-full left-0 w-full h-[30vh] fill-black" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        <path 
            ref={svgRef} 
            d="M0,0 L100,0 L100,100 Q50,150 0,100 Z" 
            vectorEffect="non-scaling-stroke"
        />
      </svg>

    </div>
  );
};

export default Preloader;