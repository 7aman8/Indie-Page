import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';

const projects = [
  { id: 1, title: "FinTech Dashboard", category: "Development", src: "/Smiling.webp" }, // Using your existing images as placeholders
  { id: 2, title: "E-Commerce AI", category: "Fullstack", src: "/Portrait.webp" },
  { id: 3, title: "Bahrain Tourism", category: "Design", src: "/Talking.webp" },
  { id: 4, title: "Crypto Portfolio", category: "Web3", src: "/Smiling.webp" },
];

const Work = () => {
  const containerRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const cursorImgRef = useRef(null);
  const [activeProject, setActiveProject] = useState(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // Move the floating image container based on mouse position
      const xMove = gsap.quickTo(cursorImgRef.current, "left", { duration: 0.5, ease: "power3" });
      const yMove = gsap.quickTo(cursorImgRef.current, "top", { duration: 0.5, ease: "power3" });

      window.addEventListener("mousemove", (e) => {
        const { clientX, clientY } = e;
        xMove(clientX);
        yMove(clientY);
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (project) => {
    setActiveProject(project);
    gsap.to(cursorImgRef.current, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
    gsap.to(cursorLabelRef.current, { scale: 1, opacity: 1, duration: 0.4 });
  };

  const handleMouseLeave = () => {
    setActiveProject(null);
    gsap.to(cursorImgRef.current, { scale: 0, opacity: 0, duration: 0.3 });
    gsap.to(cursorLabelRef.current, { scale: 0, opacity: 0, duration: 0.3 });
  };

  return (
    <section ref={containerRef} className="relative w-full py-20 bg-zinc-950 text-white cursor-default">
      
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-end justify-between">
            <h2 className="text-sm font-geist uppercase tracking-widest text-zinc-500">/ Selected Work</h2>
            <span className="text-zinc-600 font-mono text-xs hidden md:block">SCROLL TO EXPLORE</span>
        </div>

        <div className="flex flex-col border-t border-zinc-800">
          {projects.map((project, index) => (
            <div 
              key={project.id}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 md:py-16 border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors duration-300 px-4"
              onMouseEnter={() => handleMouseEnter(project)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center gap-6">
                  <span className="font-mono text-zinc-600 text-sm">0{index + 1}</span>
                  <h3 className="text-3xl md:text-6xl font-gilroy font-bold group-hover:translate-x-4 transition-transform duration-500 ease-out">
                    {project.title}
                  </h3>
              </div>
              
              <div className="mt-4 md:mt-0 overflow-hidden">
                  <span className="text-zinc-500 font-geist uppercase tracking-wide text-sm group-hover:text-red-500 transition-colors">
                    {project.category}
                  </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 flex justify-center">
            <a href="/indie" className="px-8 py-4 border border-zinc-700 rounded-full font-gilroy font-bold uppercase hover:bg-white hover:text-black transition-all duration-300">
                View All Projects
            </a>
        </div>
      </div>

      {/* Floating Image Preview (Follows Cursor) */}
      <div 
        ref={cursorImgRef}
        className="fixed top-0 left-0 z-50 pointer-events-none w-[300px] h-[200px] rounded-lg overflow-hidden -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 hidden md:block shadow-2xl shadow-red-900/20"
      >
        {activeProject && (
             <img 
             src={activeProject.src} 
             alt="Project Preview" 
             className="w-full h-full object-cover"
           />
        )}
      </div>

      {/* Floating "VIEW" Label (Follows Cursor - Optional) */}
      {/* <div 
        ref={cursorLabelRef}
        className="fixed top-0 left-0 z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center font-bold text-white mix-blend-difference opacity-0 scale-0 hidden md:flex"
      >
        VIEW
      </div> */}

    </section>
  );
};

export default Work;