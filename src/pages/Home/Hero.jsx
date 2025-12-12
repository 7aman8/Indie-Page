import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import gsap from 'gsap';

function Hero() {
  const [localTime, setLocalTime] = useState('');
  
  const instagramRef = useRef(null);
  const xRef = useRef(null);
  const linkedinRef = useRef(null);
  const businessRef = useRef(null);
  const heroRef = useRef(null);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-+=[]{}|;:'<>,.?/~`";

  const navClass = "hero-animate hover:translate-x-1 hover:translate-y-1 hover:rotate-1 hover:text-red-500 transition-all duration-100 ease-in-out";

  const scrambleText = (target, newText) => {
    let i = 0;
    gsap.to({}, { 
      duration: 0.5,
      onUpdate: function() {
        let scrambled = "";
        for (let j = 0; j < newText.length; j++) {
          if (j < i) {
            scrambled += newText[j];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        if (target) {
            target.textContent = scrambled;
        }
      },
      onComplete: function() {
        if (target) {
            target.textContent = newText;
        }
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

  // Fade In Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(".hero-animate, p",
            { opacity: 0 },
            { opacity: 1, duration: 1, delay: 0.3, stagger: 0.1, ease: "power4.out" }
        );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Local Time Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Bahrain'
      };
      setLocalTime(now.toLocaleTimeString('en-US', options).toUpperCase());
    };

    updateTime(); 
    const intervalId = setInterval(updateTime, 60000); 

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div ref={heroRef} className="hero-content relative w-full h-screen overflow-hidden bg-white flex flex-col justify-between md:block">

        {/* --- 1. Top Left Nav --- */}
        <nav className="flex flex-col font-gilroy font-bold absolute top-5 left-5 gap-1 text-2xl md:text-4xl z-50">
            <a href="/" className={navClass}>Home</a>
            <a href="#" className={navClass}>Me</a>
            <a href="/indie" className={navClass}>Work</a>
            <a href="/indie" className={navClass}>Contact</a>
        </nav>

        {/* Wrapper for Main Content to handle Mobile Stack vs Desktop Absolute */}
        <div className="flex-grow flex flex-col items-center justify-center gap-10 md:block">
            <div className="relative w-64 h-80 mt-10 md:mt-0 md:w-auto md:h-auto md:absolute md:top-10 md:left-32 z-0">
                
                {/* Smiling Image (Hover) */}
                <img 
                src="/Smiling.png" 
                alt="Smiling IMAGE"
                // Mobile: absolute inset-0. Desktop: absolute w-150.
                className="absolute inset-0 w-full h-full object-cover md:w-150 md:h-auto opacity-0 transition-opacity duration-500 hover:opacity-90 z-10"
                />

                {/* Portrait Image (Default) */}
                <img 
                src="/Portrait.png" 
                alt="Portrait IMAGE"
                className="absolute inset-0 w-full h-full object-cover md:static md:w-150 md:h-auto opacity-100 transition-opacity duration-500 hover:opacity-0"
                />
            </div>

            {/* --- 3. Hero Heading / Content --- */}
            {/* Mobile: Flex Col. Desktop: Absolute Center/Right. */}
            <div className="flex flex-col items-center gap-6 md:absolute md:top-1/2 md:left-1/2 md:ml-10 md:-translate-y-1/2 md:items-start md:gap-10 z-20">
                
                <div className="hero-animate">
                    <DraggableLayer />
                </div>

                <div className="text-center md:text-left text-lg text-black opacity-50 px-6 md:px-0">
                    <p>I'm Abdulrahman Janahi.</p>
                    <p>I build <span className='italic font-[Georgia]'>clean</span>, <span className='italic font-[Georgia]'>modern</span>, and <span className='italic font-[Georgia]'>engaging</span> web apps.</p>
                </div>

                <button className='hero-animate flex flex-row gap-2 border-b-3 text-red-700 text-3xl md:text-4xl font-bold w-fit pr-3 text-start items-center'>
                    <span ref={businessRef} onMouseEnter={() => scrambleText(businessRef.current, "LET'S TALK BUSINESS.")} onMouseLeave={() => businessRef.current.textContent = "LET'S TALK BUSINESS."}>
                        Let's Talk Business.
                    </span> <MessageIcon className="w-6 md:w-8" />
                </button>

            </div>

        </div>

        {/* --- 4. Bottom Bar --- */}
        <div className="w-full p-6 flex justify-between items-end text-black text-sm md:text-md font-geist uppercase md:absolute md:-bottom-3 z-50">
            <div className="whitespace-nowrap">
                <span className='text-red-600 font-bold'>BAHRAIN</span> <span>{localTime}</span>
            </div>

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
    <svg
      viewBox="0 0 24 24"
      className={`${className || "w-8"} text-red-700`}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Thickened version */}
      <path d="M20 14v8h-1v1H2v-1H1V4h1V3h10v2H4v14h14v-5z" />
      <path d="M23 1v9h-3V6h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-3h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1V3h-3V1z" />
    </svg>
  );
}

const DraggableLayer = () => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const controls = useAnimation();

  return (
    <div className="flex items-center justify-center">
      
      <div className="relative w-fit">

        {/* --- BOTTOM LAYER (Static) --- */}
        <div className="absolute inset-0 flex items-center justify-center z-0 select-none">
           <div className="flex flex-row font-gilroy font-bold items-end gap-2 p-4 text-gray-400">
                {/* Scaled for mobile */}
                <h1 className="text-4xl md:text-6xl -translate-x-8 md:-translate-x-12 font-mono leading-none">Indie Hacker</h1>
            </div>
        </div>

        {/* --- TOP LAYER --- */}
        <motion.div
          drag
          dragMomentum={false}
          whileHover={{ cursor: "grab" }}
          whileDrag={{ cursor: "grabbing" }}
          onPointerDown={() => {
                controls.stop();        
                setHasInteracted(true); 
            }}
         
          animate={hasInteracted ? {} : { 
            x: [0, 80, 0],      
            y: [0, 20, 0],      
            rotate: [0, 3, 0]   
          }}
          
          transition={{
            duration: 1.2,    
            delay: 1.5,           
            ease: "easeInOut", 
            times: [0, 0.5, 1],
            repeat: 0,        
          }}

          onDragStart={() => {setHasInteracted(true);}}

          className="relative z-10"
        >
          {/* Figma-style border box */}
          <div className="relative border-2 bg-white border-[#008ef0] p-4 w-fit">
            
            {/* Corner squares */}
            <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>
            <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>
            <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#008ef0]"></span>

            {/* Content */}
            <div className="flex flex-row bg-white font-gilroy font-bold items-end gap-2 pointer-events-none">
              {/* Scaled for mobile */}
              <h1 className="text-4xl md:text-6xl leading-none text-black">Fullstack Developer</h1>
            </div>
            
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;