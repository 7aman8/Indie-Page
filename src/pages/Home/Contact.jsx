import React, { useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { color } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // State for form interaction
  const [topic, setTopic] = useState('');
  const [contactMethod, setContactMethod] = useState('email');

  const inputTextClass = "text-lg md:text-2xl lg:text-3xl";

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",   // Start when top of section hits top of viewport
          end: "+=2000",      // Pin for 2000px of scrolling
          pin: true,          // Lock the screen
          scrub: 1,           // Smooth scrubbing
          anticipatePin: 1
        }
      });

      // 1. Reveal Lines One by One
      const lines = gsap.utils.toArray('.contact-line');
      lines.forEach((line) => {
        tl.fromTo(line, 
          { opacity: 0, y: 30, filter: "blur(10px)" }, 
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 }
        );
      });

      // 2. Add a small pause for user to read/interact visually
      tl.to({}, { duration: 0.5 });

      // 3. THEME SWITCH (Dark -> Light)
      // Change Background to White
      tl.to(containerRef.current, { 
        backgroundColor: "#ffffff", 
        duration: 1.5,
        ease: "power2.inOut" 
      }, "switch");

      // Change Text and Inputs to Black
      tl.to([".contact-text", ".contact-input"], { 
        color: "#000000", 
        borderColor: "rgba(0,0,0,0.2)",
        placeholderColor: "rgba(0,0,0,0.4)",
        duration: 1.5,
        ease: "power2.inOut"
      }, "switch");

    // Change Buttons to Red Theme
    tl.fromTo(
    ".contact-btn", 
    { 
        color: "#ffffff",         
        borderColor: "#ffffff"    
    },
    { 
        color: "#fb2c36",          
        borderColor: "#fb2c36",
        duration: 1.5,
        ease: "power2.inOut"
    },
    "switch"
    );
      
      // Specifically fix input border colors separately to be safe
      tl.to("input, textarea", {
        borderBottomColor: "rgba(0,0,0,0.2)",
        duration: 1.5
      }, "switch");

      // 4. Reveal Huge Send Button
      tl.fromTo(buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      id='contact'
      className="relative w-full h-screen bg-[#09090b] font-gsans text-white flex mx-auto items-center justify-center overflow-hidden"
    >
      
      <div className="w-[90vw] h-[70vh] max-w-6xl px-6 md:px-0">
        
        <form ref={formRef} className="flex flex-col gap-10 md:gap-10 font-gilroy text-2xl md:text-4xl lg:text-5xl leading-tight">
            
            {/* --- LINE 1 --- */}
            <div className="contact-line flex flex-col md:flex-row md:items-baseline flex-wrap gap-4 md:gap-6 opacity-0">
                <span className="contact-text font-normal">Hey, Abdulrahman! My name is</span>
                <input 
                    type="text" 
                    placeholder="Your Name" 
                    className={`contact-input ${inputTextClass} bg-transparent border-b border-white/20 focus:border-red-500 outline-none placeholder:text-inherit placeholder:opacity-30 px-2 py-1 w-full md:w-auto md:min-w-[300px] transition-colors`}
                />
            </div>

            {/* --- LINE 2 --- */}
            <div className="contact-line flex flex-col md:flex-row md:items-baseline flex-wrap gap-4 md:gap-6 opacity-0">
                <span className="contact-text font-normal">and I am from</span>
                <input 
                    type="text" 
                    placeholder="Country" 
                    className={`contact-input ${inputTextClass} bg-transparent border-b border-white/20 focus:border-red-500 outline-none placeholder:text-inherit placeholder:opacity-30 px-2 py-1 w-full md:w-auto md:min-w-[200px] transition-colors`}
                />
            </div>

            {/* --- LINE 3: Topic --- */}
            <div className="contact-line flex flex-col md:flex-row md:items-baseline flex-wrap gap-6 opacity-0">
                <span className="contact-text font-normal whitespace-nowrap">Let's connect about</span>
                <div className="flex flex-wrap gap-3">
                    {['Collaboration', 'Potential Project', 'Networking'].map((item) => (
                        <button
                        key={item}
                        type="button"
                        onClick={() => setTopic(item)}
                        style={topic === item ? { color: "#ffffff" } : {color: "#fb2c36"}}
                        className={`contact-btn px-6 py-2 rounded-full border text-xl md:text-2xl transition-all duration-300
                            ${
                            topic === item
                                ? 'bg-red-600 border-red-600 shadow-md shadow-red-300'
                                : 'hover:bg-white/10 hover:border-white/40'
                            }
                        `}
                        >
                        {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- LINE 4: Contact Method --- */}
            <div className="contact-line flex flex-col md:flex-row md:items-baseline flex-wrap gap-6 opacity-0">
                <span className="contact-text font-normal">We can talk at</span>
                <input 
                    type="email" 
                    placeholder="name@website.com" 
                    className={`contact-input ${inputTextClass} bg-transparent border-b border-white/20 focus:border-red-500 outline-none placeholder:text-inherit placeholder:opacity-30 px-2 py-1 flex-grow md:max-w-md transition-colors`}
                />
            </div>

            {/* --- LINE 5: Message --- */}
            <div className="contact-line flex flex-col md:flex-row md:items-baseline gap-6 opacity-0">
                <span className="contact-text font-normal whitespace-nowrap">In short,</span>
                <textarea 
                    rows={1}
                    placeholder="Type your message..." 
                    className={`contact-input ${inputTextClass} bg-transparent border-b border-white/20 focus:border-red-500 outline-none placeholder:text-inherit placeholder:opacity-30 px-2 py-1 w-full resize-none overflow-hidden`}
                    onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                />
            </div>

            {/* --- LINE 6: Submit --- */}
            <div className="flex font-gilroy absolute bottom-15 mx-auto left-1/2 -translate-x-1/2 justify-center">
                <button 
                    ref={buttonRef}
                    type="submit"
                    className="contact-text group justify-center flex items-center gap-4 text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter opacity-0"
                >
                    <span>Send it</span>
                    <span className="group-hover:-translate-y-4 group-hover:translate-x-4 transition-transform duration-500 text-red-600">
                        <ArrowIcon className="w-16 h-16 md:w-24 md:h-24" />
                    </span>
                </button>
            </div>

        </form>
      </div>

    </section>
  );
};

function ArrowIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default Contact;