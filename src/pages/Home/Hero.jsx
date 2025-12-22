import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; 

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function Hero() {
  const [localTime, setLocalTime] = useState('');
  const [hovered, setHovered] = useState(false);

  const mainContainerRef = useRef(null);
  const heroContentRef = useRef(null);
  const imageContainerRef = useRef(null);
  const navRef = useRef(null);
  const bottomBarRef = useRef(null);

  const instagramRef = useRef(null);
  const xRef = useRef(null);
  const linkedinRef = useRef(null);
  const businessRef = useRef(null);

  const navClass = "hero-animate hover:translate-x-1 hover:translate-y-1 hover:rotate-1 hover:text-red-500 transition-all duration-100 ease-in-out";

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+=[]{}|;:'<>,.?/~`";
  const scrambleText = (target, newText) => {
    let i = 0;
    gsap.to({}, { 
      duration: 0.5,
      onUpdate: function() {
        let scrambled = "";
        for (let j = 0; j < newText.length; j++) {
          if (j < i) scrambled += newText[j];
          else scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
        if (target) target.textContent = scrambled;
      },
      onComplete: function() {
        if (target) target.textContent = newText;
      },
    });

    let progress = { value: 0 };
    gsap.to(progress, { 
      value: newText.length, 
      duration: 0.5, 
      roundProps: "value",
      onUpdate: () => i = progress.value
    });
  };

  // --- PARALLAX SCROLL TRIGGER ---
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        ScrollTrigger.create({
            trigger: mainContainerRef.current,
            start: "top top",
            end: "bottom top",
            pin: true, 
            pinSpacing: false, 
            scrub: true,
        });

        gsap.to(heroContentRef.current, {
            scale: 0.95,
            opacity: 0.5,
            ease: "none",
            scrollTrigger: {
                trigger: mainContainerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });

    }, mainContainerRef);
    return () => ctx.revert();
  }, []);


//Initial Hero Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-animate, p",
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.3, stagger: 0.1, ease: "power4.out" }
      );
    }, mainContainerRef);
    return () => ctx.revert();
  }, []);

  const scrollTo = (section) => {
    gsap.to(window, { 
      duration: 2, 
      scrollTo: `#${section}`,
      ease: "power4.inOut" 
    });
  };

// Local Time Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Bahrain'
      }).toUpperCase());
    };
    updateTime(); 
    const intervalId = setInterval(updateTime, 60000); 
    return () => clearInterval(intervalId);
  }, []);

//   The nav magnetic effect
  useLayoutEffect(() => {
    const items = navRef.current.querySelectorAll(".magnetic");

    const radius = 50;    
    const strength = 0.35;  

    const handleMouseMove = (e) => {
        items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
            const pull = (1 - distance / radius) * strength;

            gsap.to(el, {
            x: dx * pull,
            y: dy * pull,
            duration: 0.3,
            // rotate: Math.atan2(dy, dx) * 57.2958, --> clunky roration
            rotate: 5 * pull,
            ease: "power3.out",
            });
        } else {
            gsap.to(el, {
            x: 0,
            y: 0,
            rotate: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
            });
        }
        });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={mainContainerRef} className="relative w-full h-[100vh]  lg:h-screen overflow-hidden bg-white text-black">

      <nav ref={navRef} className="flex flex-col font-gilroy font-bold absolute top-5 left-5 gap-1 text-xl md:text-3xl lg:text-4xl z-50">
        <a href="/" className={`magnetic inline-block ${navClass}`}>Home</a>
        <a href="#about" onClick={() => scrollTo("about")} className={`magnetic inline-block ${navClass}`}>Me</a>
        <a onClick={() => scrollTo("work")} className={`magnetic inline-block ${navClass}`}>Work</a>
        <a onClick={() => scrollTo("contact")} className={`magnetic inline-block ${navClass}`}>Contact</a>
      </nav>

      <div className="w-full h-full flex flex-col lg:block">

    {/* Images */}
        <div ref={imageContainerRef} className="relative z-10 w-64 h-80 mt-10 mx-auto md:w-150 md:h-auto lg:absolute lg:top-10 lg:left-32 lg:m-0 lg:w-150 lg:h-auto">
          <img 
            src="/Money.webp" 
            alt="Talking Money"
            className={`absolute inset-0 w-full h-full object-cover md:w-150 md:h-auto ${hovered ? "opacity-100" : "opacity-0"} transition-opacity duration-500 z-20`}
          />
          <img 
            src="/Smiling.webp" 
            alt="Smiling"
            className={`absolute inset-0 top-3 w-full h-full object-cover md:w-150 md:h-auto opacity-0 transition-opacity duration-500 hover:opacity-100 z-20`}
          />
          <img 
            src="/Talking.webp" 
            alt="Talking"
            className="absolute inset-0 w-full h-full object-cover md:w-150 md:h-auto opacity-100 transition-opacity duration-500 hover:opacity-0 z-10"
          />

        {/* Old Images */}
        {/* <div ref={imageContainerRef} className="relative z-10 w-64 h-80 mt-10 mx-auto md:w-150 md:h-auto lg:absolute lg:top-10 lg:left-32 lg:m-0 lg:w-150 lg:h-auto">
          <img 
            src="/Talking.webp" 
            alt="Talking"
            className={`absolute inset-0 w-full h-full object-cover md:w-150 md:h-auto ${hovered ? "opacity-100" : "opacity-0"} transition-opacity duration-500 z-20`}
          />
          <img 
            src="/Smiling.webp" 
            alt="Smiling"
            className={`absolute inset-0 top-3 w-full h-full object-cover md:w-150 md:h-auto opacity-0 transition-opacity duration-500 hover:opacity-100 z-20`}
          />
          <img 
            src="/Portrait.webp" 
            alt="Portrait"
            className="absolute inset-0 w-full h-full object-cover md:w-150 md:h-auto opacity-100 transition-opacity duration-500 hover:opacity-0 z-10"
          />
        </div> */}
          
        </div>


    {/* Hero Content */}
        <div ref={heroContentRef} className="relative z-20 flex flex-col items-center gap-6 mt-10 lg:absolute lg:top-1/2 lg:left-1/2 lg:ml-20 lg:-translate-y-1/2 lg:items-start lg:gap-10 lg:mt-0">
          <div className="hero-animate">
            <DraggableLayer />
          </div>
          <div className="hero-text-p text-center lg:text-left text-lg opacity-50 px-6 lg:px-0">
            <p>I'm Abdulrahman Janahi.</p>
            <p>I build <span className='italic font-[Georgia]'>clean</span>, <span className='italic font-[Georgia]'>modern</span>, and <span className='italic font-[Georgia]'>engaging</span> web apps.</p>
          </div>
          <button className='hero-animate flex flex-row gap-2 border-b-3 border-red-700 text-red-700 text-3xl md:text-4xl font-bold font-gilroy w-fit pr-3 text-start items-center'>
            <span onClick={() => scrollTo("contact")} ref={businessRef} onMouseEnter={() => {scrambleText(businessRef.current, "LET'S TALK BUSINESS."); setHovered(true)}} onMouseLeave={() =>{ businessRef.current.textContent = "LET'S TALK BUSINESS."; setHovered(false)}}>
              Let's Talk Business.
            </span> <MessageIcon className="w-6 md:w-8" />
          </button>
        </div>

      </div>

    {/* Bottom Bar */}
      <div ref={bottomBarRef} className="w-full p-6 flex justify-between items-end text-sm font-geist uppercase lg:absolute lg:-bottom-3 z-50">
        {/* Location and Time */}
        <div className="whitespace-nowrap space-x-1">
          <span className='text-red-600 font-bold'>
            <a href="https://en.wikipedia.org/wiki/Bahrain" target='_blank' >Bahrain</a>
          </span> 
          <span>{localTime}</span>
        </div>

        {/* Social Links */}
        <div className="flex md:absolute md:justify-end md:mx-auto md:right-10 space-x-2 gap-1 text-black">
          <a 
            ref={instagramRef} 
            href="https://www.instagram.com/arj08._/" 
            target='_blank'
            className="hover:text-red-950 hover:font-semibold transition"
            onMouseEnter={() => scrambleText(instagramRef.current, 'INSTAGRAM')}
            onMouseLeave={() => instagramRef.current.textContent = 'INSTAGRAM'}
          >
            INSTAGRAM
          </a>

          <span className='opacity-50'>/</span>
          <a 
            ref={xRef} 
            href="https://x.com/ArjBuilds/" 
            target='_blank'
            className="hover:text-red-950 hover:font-semibold transition"
            onMouseEnter={() => scrambleText(xRef.current, 'X')}
            onMouseLeave={() => xRef.current.textContent = 'X'}
          >
            X
          </a> 
          <span className='opacity-50'>/</span>

          <a 
            ref={linkedinRef} 
            href="https://www.linkedin.com/in/arj11/" 
            target='_blank'
            className="hover:text-red-950 hover:font-semibold transition"
            onMouseEnter={() => scrambleText(linkedinRef.current, 'LINKEDIN')}
            onMouseLeave={() => linkedinRef.current.textContent = 'LINKEDIN'}
          >
            LINKEDIN
          </a>
        </div>

      </div>
    </div>
  );
}

function MessageIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className || "w-8"} text-red-700`} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 14v8h-1v1H2v-1H1V4h1V3h10v2H4v14h14v-5z" />
      <path d="M23 1v9h-3V6h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-3h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V3h-3V1z" />
    </svg>
  );
}

const DraggableLayer = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const controls = useAnimation();

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-fit">
        <div className="absolute inset-0 flex items-center justify-center z-0 select-none">
          <div className="flex flex-row font-gilroy font-bold items-end gap-2 p-4 text-gray-400">
            <h1 className="text-4xl md:text-6xl -translate-x-8 md:-translate-x-12 font-mono leading-none">Indie Hacker</h1>
          </div>
        </div>
        <motion.div
          drag
          dragMomentum={false}
          whileHover={{ cursor: "grab" }}
          whileDrag={{ cursor: "grabbing" }}
          onPointerDown={() => { controls.stop(); setHasInteracted(true); }}
          animate={hasInteracted ? {} : { x: [0, 80, 0], y: [0, 20, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 1.2, delay: 5, ease: "easeInOut", times: [0, 0.5, 1], repeat: 0 }}
          onDragStart={() => {setHasInteracted(true);}}
          className="relative z-10"
        >
          <div className="relative border-2 bg-white border-[#008ef0] p-4 w-fit">
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>
            <div className="flex flex-row bg-white font-gilroy font-bold items-end gap-2 pointer-events-none">
              <h1 className="text-4xl md:text-6xl font-gsans leading-none text-black">Fullstack Developer</h1>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
