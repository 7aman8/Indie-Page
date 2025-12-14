import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =====================================
   PROJECT DATA (ORDER MATTERS)
   TL, TR, BL, BR
===================================== */
const projects = [
  {
    id: 1,
    title: "Fintech Dashboard",
    category: "Fullstack",
    src: "/Talking.webp",
    link: "https://google.com",
  },
  {
    id: 2,
    title: "E-Commerce AI",
    category: "Development",
    src: "/Smiling.webp",
    link: "https://google.com",
  },
  {
    id: 3,
    title: "Bahrain Tourism",
    category: "Design",
    src: "/Portrait.webp",
    link: "https://google.com",
  },
  {
    id: 4,
    title: "Crypto Wallet",
    category: "Web3",
    src: "/Talking.webp",
    link: "https://google.com",
  },
];

const Work = () => {
  const containerRef = useRef(null);

  const cursorRef = useRef(null);
  const previewRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  /* =====================================
     DESKTOP PIN (NO TITLE FADE)
  ===================================== */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "+=1200",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* =====================================
     CURSOR + QUADRANT LOGIC (DESKTOP)
  ===================================== */
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const move = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = e.clientX;
      const y = e.clientY;

      // Circle cursor (fast)
      gsap.to(cursorRef.current, {
        x,
        y,
        duration: 0.15,
        ease: "power3.out",
      });

      // Preview (slower, cinematic)
      gsap.to(previewRef.current, {
        x,
        y,
        duration: 0.35,
        ease: "power3.out",
      });

      // Virtual quadrant math
      let index = 0;
      if (x > innerWidth / 2 && y < innerHeight / 2) index = 1;
      if (x < innerWidth / 2 && y > innerHeight / 2) index = 2;
      if (x > innerWidth / 2 && y > innerHeight / 2) index = 3;

      setActiveIndex(index);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* =====================================
     MAGNETIC CLICK SCALE
  ===================================== */
  const handleClick = () => {
    if (!cursorRef.current) return;

    gsap.fromTo(
      cursorRef.current,
      { scale: 1 },
      { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }
    );

    window.open(activeProject.link, "_blank");
  };

  /* =====================================
     KEYBOARD ACCESSIBILITY (DESKTOP)
     Arrow keys switch quadrants
     Enter opens project
  ===================================== */
  useEffect(() => {
    const handleKey = (e) => {
      if (window.innerWidth < 1024) return;

      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % 4);
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i + 3) % 4);
      if (e.key === "ArrowUp") setActiveIndex((i) => (i < 2 ? i : i - 2));
      if (e.key === "ArrowDown") setActiveIndex((i) => (i < 2 ? i + 2 : i));
      if (e.key === "Enter") handleClick();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeProject]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#09090b] text-white overflow-hidden"
    >
      {/* =====================================================
          DESKTOP EXPERIENCE
      ===================================================== */}
      <div
        className="hidden lg:block w-full h-screen relative cursor-none"
        onClick={handleClick}
        role="button"
        aria-label="Open active project"
        tabIndex={0}
      >
        {/* CENTER TITLE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none select-none">
          <h2 className="text-[12vw] font-gilroy font-bold uppercase tracking-tighter leading-none">
            MY
            <br />
            WORK
          </h2>
          <p className="mt-6 text-zinc-600 font-mono text-xs uppercase tracking-widest">
            Move your cursor · Click to view
          </p>
        </div>

        {/* FLOATING PREVIEW */}
        <div
          ref={previewRef}
          className="fixed top-0 left-0 z-40 pointer-events-none
                     w-[440px] h-[300px]
                     -translate-x-1/2 -translate-y-1/2
                     rounded-2xl overflow-hidden
                     border border-white/10
                     bg-zinc-900 shadow-2xl"
        >
          <img
            src={activeProject.src}
            alt={activeProject.title}
            className="w-full h-full object-cover opacity-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 flex flex-col justify-end">
            <p className="font-mono text-xs uppercase tracking-widest text-red-500 mb-2">
              {activeProject.category}
            </p>
            <h3 className="font-gilroy text-3xl font-bold leading-none">
              {activeProject.title}
            </h3>
          </div>
        </div>

        {/* CIRCULAR VIEW CURSOR */}
        <div
          ref={cursorRef}
          className="fixed top-0 left-0 z-50 pointer-events-none
                     w-24 h-24 rounded-full
                     -translate-x-1/2 -translate-y-1/2
                     bg-white text-black
                     flex items-center justify-center
                     font-gilroy font-bold text-xs uppercase
                     mix-blend-difference"
        >
          View Project
        </div>
      </div>

      {/* =====================================================
          TABLET / MOBILE FALLBACK
      ===================================================== */}
      <div className="lg:hidden w-full px-4 py-20">
        <h2 className="text-5xl font-gilroy font-bold uppercase tracking-tighter text-center mb-12">
          My Work
        </h2>

        <div className="flex flex-col gap-16">
          {projects.map((project, i) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-zinc-800 mb-4">
                <img
                  src={project.src}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-red-500 font-mono text-xs uppercase tracking-widest mb-1">
                {project.category}
              </p>
              <h3 className="text-3xl font-gilroy font-bold">
                {project.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
