import React, { useRef, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';

const SuccessMessage = ({ onReset }) => {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // 1. Marquee Infinite Scroll (Immediate)
      gsap.to(".marquee-text", {
        xPercent: -50,
        repeat: -1,
        duration: 10,
        ease: "linear",
      });

      // 2. Entrance Sequence
      tl.fromTo(containerRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      )
      
      // Giant Text Stagger
      .fromTo(".success-char", 
        { y: "100%" },
        { y: "0%", duration: 1, stagger: 0.05, ease: "power4.out" }
      )

      // The "Receipt" Card
      .fromTo(".receipt-card",
        { y: 100, opacity: 0, rotation: 5 },
        { y: 0, opacity: 1, rotation: 0, duration: 1, ease: "back.out(1.7)" },
        "-=0.5"
      )

      // The Button
      .fromTo(".reset-btn",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.5"
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-50 w-full h-full bg-white text-black flex flex-col font-gsans items-center justify-center overflow-hidden"
    >
      
      {/* --- BACKGROUND MARQUEE --- */}
      <div className="absolute top-10 left-0 w-full overflow-hidden opacity-10 pointer-events-none select-none">
        <div className="marquee-text flex whitespace-nowrap gap-10">
            {Array(10).fill("RECEIVED SUCCESSFULLY /// ").map((text, i) => (
                <span key={i} className="text-8xl font-black font-gilroy uppercase tracking-tighter">
                    {text}
                </span>
            ))}
        </div>
      </div>

      {/* --- GIANT CENTER TEXT --- */}
      <div className="relative z-10 text-center mb-10 mix-blend-difference text-black">
        <div className="overflow-hidden">
            <h1 className="text-[12vw] font-gilroy font-black leading-[0.8] tracking-tighter flex justify-center">
                {"MESSAGE".split('').map((char, i) => (
                    <span key={i} className="success-char inline-block">{char}</span>
                ))}
            </h1>
        </div>
        <div className="overflow-hidden">

        </div>
      </div>

      {/* --- RECEIPT CARD --- */}
      <div className="receipt-card relative bg-[#f4f4f5] border border-zinc-200 p-6 md:p-8 rounded-2xl w-[90%] max-w-md shadow-2xl rotate-3">
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-red-600/20 backdrop-blur-sm -rotate-2"></div>
        
        <div className="flex justify-between items-center mb-6 border-b border-zinc-300 pb-4">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Status: Delivered</span>
            </div>
            <span className="font-mono text-xs text-zinc-400">{new Date().toLocaleTimeString()}</span>
        </div>

        <div className="space-y-4 mb-8">
            <p className="font-gilroy font-bold text-2xl text-center">Thank you for reaching out.</p>
            <p className="font-geist text-zinc-600 text-center text-sm">
                I have received your inquiry and will get back to you soon.
            </p>
        </div>

        <button 
            onClick={onReset}
            className="reset-btn w-full py-4 bg-black text-white rounded-xl font-gilroy font-bold uppercase tracking-widest hover:bg-red-600 transition-colors duration-300"
        >
            Send Another
        </button>
      </div>

      <p className="absolute mx-auto bottom-6 text-md font-mono text-zinc-400 italic">
          Continue on scrolling to explore more.
      </p>

    </div>
  );
};

export default SuccessMessage;