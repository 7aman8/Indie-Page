import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


import About from '@/pages/Home/About';
import Work from '@/pages/Home/Work';

gsap.registerPlugin(ScrollTrigger);

const StackingFlow = () => {
  const containerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500", // Scroll distance for the transition
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });


      gsap.set(card2Ref.current, { y: "100%" });


      tl.to(card1Ref.current, {
        scale: 0.9,
        filter: "brightness(0.5)",
        transformOrigin: "center top",
        borderRadius: "40px", 
        duration: 1,
        ease: "power2.inOut"
      }, 0);


      tl.to(card2Ref.current, {
        y: "0%",
        borderRadius: "0px", 
        duration: 1,
        ease: "power2.inOut"
      }, 0);

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#09090b] overflow-hidden">
      
      {/* --- CARD 1: ABOUT --- */}
      <div 
        ref={card1Ref} 
        className="absolute top-0 left-0 w-full h-full bg-white overflow-hidden z-10 origin-top will-change-transform"
      >
        {/* We pass a prop to disable internal scrolling in About if needed */}
        <About isStatic={true} /> 
      </div>

      {/* --- CARD 2: WORK --- */}
      <div 
        ref={card2Ref} 
        className="absolute top-0 left-0 w-full h-full bg-[#09090b] z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.5)] will-change-transform"
      >
        <Work isStatic={true} />
      </div>

    </div>
  );
};

export default StackingFlow;