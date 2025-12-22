import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { 
    id: "01", 
    title: "ShareBoard Colloaborative Platform", 
    hook: "shareboard.space",
    category: "Fullstack Development", 
    src: "/Mockups/Shareboard.webp", 
    video: "/videos/Shareboard.mov",
    color: "#e7000b", 
    link: "https://shareboard.space"
  },
  { 
    id: "02", 
    title: "Mahali E-Commerce", 
    hook: "mahali.food",  
    category: "Fullstack Development", 
    src: "/Mockups/Mahali.webp", 
    video: "/videos/Mahali.mov",
    color: "#ea580c", 
    link: "https://mahali.food"
  },
];

const Work = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  
  // Cursor Refs
  const cursorRef = useRef(null);
  const cursorCardRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);


  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      
      mm.add("(min-width: 768px)", () => {
        const sections = gsap.utils.toArray(".work-item");
        
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 2,
          
            end: () => "+=" + (containerRef.current.offsetWidth * (sections.length - 1)),
            anticipatePin: 1,
          },
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);


  useEffect(() => {
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (activeProject) {
        // Expand the card
        gsap.to(cursorCardRef.current, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.4, 
            ease: "back.out(1.2)" 
        });
        // Float the text up
        gsap.to(cursorLabelRef.current, { 
            opacity: 1, 
            y: -15, 
            duration: 0.3, 
            delay: 0.05 
        });
    } else {
        // Shrink away
        gsap.to(cursorCardRef.current, { scale: 0, opacity: 0, duration: 0.3 });
        gsap.to(cursorLabelRef.current, { opacity: 0, y: 10, duration: 0.3 });
    }
  }, [activeProject]);

  // hiding custom-cursor
  addEventListener("mouseenter", () => {
    document.getElementsByClassName('custom-cursor')[0].style.display = 'none';
  });

  return (
    <div id='work' ref={containerRef} className="relative w-full h-screen bg-[#09090b] text-white overflow-x-hidden">
      
      {/* --- DESKTOP HORIZONTAL TRACK --- */}
      <div 
        ref={trackRef} 
        className="hidden md:flex h-full w-fit"
        style={{ width: `${projects.length * 100}vw` }}
      >
        {projects.map((project, i) => (
            <a 
                key={project.id}
                href={project.link}
                target="_blank" 
                rel="noreferrer"
                className="work-item relative w-[100vw] h-full flex-shrink-0 cursor-none group overflow-hidden"
                onMouseEnter={() => setActiveProject(project)}
                onMouseLeave={() => setActiveProject(null)}
            >
                <div className="absolute inset-0 w-full h-full">
                    <img 
                        src={project.src} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-[2s] ease-out"
                    />
                </div>
            </a>
        ))}
      </div>

      {/* --- MOBILE VERTICAL STACK --- */}
      <div className="md:hidden flex flex-col w-full">
        {projects.map((project, i) => (
            <a 
                key={project.id}
                href={project.link}
                className="relative w-full h-[70vh] flex flex-col justify-end p-6 border-b border-white/10"
            >
                <img 
                    src={project.src} 
                    alt={project.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                
                <div className="relative z-10">
                    <span className="font-mono text-xs text-red-500 mb-2 block">{project.category}</span>
                    <h2 className="text-5xl font-gilroy font-bold leading-none mb-4">{project.title}</h2>
                    <button className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">
                        Visit Site
                    </button>
                </div>
            </a>
        ))}
      </div>

      {/* --- THE CURSOR (Desktop Only) --- */}
      <div 
        ref={cursorRef} 
        className="hidden md:block fixed top-0 left-0 z-50 pointer-events-none"
        style={{ x: "-50%", y: "-50%" }}
      >
        
        {/* Floating cursor label */}
        <div 
            ref={cursorLabelRef}
            className="absolute bottom-full left-0 mb-2 whitespace-nowrap opacity-0"
        >
            <div className="flex items-center gap-2 pl-2">
                <span className="flex flex-row text-black font-gsans font-semibold text-md uppercase tracking-wider drop-shadow-md">
                    {activeProject ? activeProject.hook : ""} <ArrowUpRight className="w-6 h-6 translate-y-0.4 text-red-700" />
                </span>
            </div>
        </div>

        {/* Container */}
        <div 
            ref={cursorCardRef}
            className={`relative w-[350px] h-[400px] bg-red-500 rounded-sm overflow-hidden shadow-2xl opacity-0 scale-0 border border-white/20`}
        >
            {activeProject?.video ? (
                <video
                    src={activeProject.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-[300px] h-auto mx-auto my-auto object-cover"
                />
            ) : (
                <img 
                    src={activeProject ? activeProject.src : ""} 
                    alt="Preview Image" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}
            
        </div>

      </div>

      {/* The floating button to /indie */}
      <div className="fixed top-10 right-10 z-40 pointer-events-auto border-b-2 border-zinc-700">
          <Link
              to="/indie"
              className="group relative flex items-center gap-3 px-4 py-1 shadow-2xl transition-all duration-300"
          >
              <span className="font-gsans font-bold text-xs md:text-sm text-black uppercase tracking-widest">
                  Explore All Projects
              </span>
              
              {/* Arrow */}
              <span className="relative flex items-center justify-center w-4 h-4 overflow-hidden">
                  <svg 
                      className="w-4 h-4 text-red-700 absolute transform transition-transform duration-300 group-hover:translate-x-full group-hover:opacity-0" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <svg 
                      className="w-4 h-4 text-red-700 absolute transform -translate-x-full opacity-0 transition-transform duration-300 group-hover:translate-x-0 group-hover:opacity-100" 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                  >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
              </span>
          </Link>
      </div>

    </div>
  );
};

export default Work;

// import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
// import Lottie from 'lottie-react';
// import animationData from '../../assets/Phone-Animation.json'; // Ensure correct path
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);

// const projects = [
//   { 
//     id: 1, 
//     title: "Fintech Dashboard", 
//     category: "Fullstack", 
//     src: "/Talking.webp", 
//     link: "https://google.com"
//   },
//   { 
//     id: 2, 
//     title: "E-Commerce AI", 
//     category: "Development", 
//     src: "/Smiling.webp", 
//     link: "https://google.com"
//   }
// ];

// const Work = ( { isStatic = false } ) => {
//   const mainRef = useRef(null);
//   const lottieSectionRef = useRef(null);
//   const lottieWrapperRef = useRef(null);
//   const workSectionRef = useRef(null);
//   const leftColRef = useRef(null);
//   const rightColRef = useRef(null);
  
//   // Cursor
//   const cursorRef = useRef(null);
//   const [isHovering, setIsHovering] = useState(false);

//   useLayoutEffect(() => {
//     if (isStatic) return; 
//   }, [isStatic]);

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
      
//     // Smooth shrink of Lottie section on scroll
//       ScrollTrigger.create({
//         trigger: lottieSectionRef.current,
//         start: "top top",
//         end: "+=500",
//         pin: true,
//         scrub: 4,
//         animation: gsap.fromTo(lottieWrapperRef.current, 
//           { 
//             width: "100vw", 
//             height: "100vh", 
//             borderRadius: "0px",
//             scale: 1 
//           },
//           { 
//             width: "90vw", 
//             height: "90vh", 
//             borderRadius: "40px",
//             scale: 0.95,
//             ease: "power2.inOut" 
//           }
//         )
//       });


//       const leftCol = leftColRef.current;
//       const rightCol = rightColRef.current;
//       const windowHeight = window.innerHeight;

//       // Calculate total scroll distance for the projects to move from below to above the screen
//       const leftHeight = leftCol.offsetHeight;
//       const rightHeight = rightCol.offsetHeight;
//       const maxDistance = Math.max(leftHeight, rightHeight);


//       gsap.fromTo(
//         leftCol,
//         { y: windowHeight },
//         {
//           y: -leftHeight,
//           ease: "none",
//           scrollTrigger: {
//             trigger: workSectionRef.current,
//             start: "top top",
//             end: () => `+=${windowHeight + leftHeight}`,
//             scrub: 2,
//             pin: true,
//             anticipatePin: 1,
//             invalidateOnRefresh: true,
//           }
//         }
//       );
//       gsap.fromTo(
//         rightCol,
//         { y: windowHeight },
//         {
//           y: -rightHeight,
//           ease: "none",
//           scrollTrigger: {
//             trigger: workSectionRef.current,
//             start: "top top",
//             end: () => `300vh`,
//             scrub: 2,
//             pin: false,
//             anticipatePin: 1,
//             invalidateOnRefresh: true,
//           }
//         }
//       );
//     }, mainRef);
//     return () => ctx.revert();
//   }, []);

//   // --- CURSOR LOGIC ---
//   useEffect(() => {
//     const cursor = cursorRef.current;
//     const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: "power3" });
//     const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: "power3" });
//     const handleMouseMove = (e) => { xTo(e.clientX); yTo(e.clientY); };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   useEffect(() => {
//     if (isHovering) gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
//     else gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
//   }, [isHovering]);

//   return (
//     <div ref={mainRef} className="relative w-full bg-[#09090b] text-white">
//       {/* --- SECTION 1: LOTTIE HERO (Pinned) --- */}
//       <div ref={lottieSectionRef} className="h-screen w-full flex items-center justify-center overflow-hidden z-20 relative">
//         <div 
//             ref={lottieWrapperRef}
//             className="relative overflow-hidden opacity-100 bg-black shadow-2xl z-10"
//         >
//             <Lottie 
//                 animationData={animationData} 
//                 loop={true} 
//                 className="w-full h-full"
//                 rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} 
//             />
//         </div>
//       </div>

//       {/* --- SECTION 2: WORK GALLERY (Flows Below) --- */}
//       <section ref={workSectionRef} className="relative w-full min-h-screen pt-32 pb-40 z-10 px-4 md:px-10">
//         {/* Centered Featured Work Text, moved down */}
//         <div className="flex flex-col items-center justify-center text-center mb-20 md:mb-32 w-full mt-12">
//           <h2 className="text-[12vw] font-gilroy font-bold uppercase leading-[0.8] tracking-tighter">
//             FEATURED<br/>WORK
//           </h2>
//           <p className="font-mono text-zinc-500 uppercase tracking-widest text-sm mb-4 animate-pulse">
//             ( Selected Projects )
//           </p>
//         </div>
//         {/* GALLERY COLUMNS */}
//         <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-20 w-full max-w-[1920px] mx-auto">
//             {/* LEFT COLUMN */}
//             <div ref={leftColRef} className="flex flex-col gap-20 md:w-[40vw]">
//                 {projects.filter((_, i) => i % 2 === 0).map((p) => (
//                     <div 
//                         key={p.id}
//                         onClick={() => window.open(p.link, '_blank')}
//                         onMouseEnter={() => setIsHovering(true)}
//                         onMouseLeave={() => setIsHovering(false)}
//                         className="group w-full cursor-none"
//                     >
//                         <div className="w-full aspect-[3/4] bg-zinc-800 rounded-[2rem] overflow-hidden mb-6 relative">
//                             <img src={p.src} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
//                         </div>
//                         <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
//                             <div>
//                                 <h3 className="text-3xl md:text-4xl font-gilroy font-bold">{p.title}</h3>
//                                 <p className="font-mono text-zinc-500 text-sm mt-1">{p.category}</p>
//                             </div>
//                             <span className="text-zinc-500 group-hover:text-white transition-colors duration-300">↗</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {/* RIGHT COLUMN */}
//             <div ref={rightColRef} className="flex flex-col gap-20 md:w-[40vw] md:mt-40">
//                 {projects.filter((_, i) => i % 2 !== 0).map((p) => (
//                     <div 
//                         key={p.id}
//                         onClick={() => window.open(p.link, '_blank')}
//                         onMouseEnter={() => setIsHovering(true)}
//                         onMouseLeave={() => setIsHovering(false)}
//                         className="group w-full cursor-none"
//                     >
//                         <div className="w-full aspect-[3/4] bg-zinc-800 rounded-[2rem] overflow-hidden mb-6 relative">
//                             <img src={p.src} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
//                         </div>
//                         <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
//                             <div>
//                                 <h3 className="text-3xl md:text-4xl font-gilroy font-bold">{p.title}</h3>
//                                 <p className="font-mono text-zinc-500 text-sm mt-1">{p.category}</p>
//                             </div>
//                             <span className="text-zinc-500 group-hover:text-white transition-colors duration-300">↗</span>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//       </section>
//       {/* --- CUSTOM CURSOR --- */}
//       <div 
//         ref={cursorRef} 
//         className="fixed top-0 left-0 w-28 h-28 bg-white rounded-full flex items-center justify-center z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 shadow-2xl mix-blend-difference"
//       >
//         <div className="relative w-full h-full flex items-center justify-center animate-spin-slow">
//             <svg viewBox="0 0 100 100" className="w-full h-full p-2">
//                 <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
//                 <text className="text-[13px] font-mono font-bold uppercase fill-black tracking-widest">
//                     <textPath xlinkHref="#curve">
//                         View Project • View Project •
//                     </textPath>
//                 </text>
//             </svg>
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-black text-2xl font-bold">↗</span>
//             </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .animate-spin-slow {
//             animation: spin 8s linear infinite;
//         }
//         @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//         }
//       `}</style>

//     </div>
//   );
// };

// export default Work;