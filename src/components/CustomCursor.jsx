import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;

    // HIDE DEFAULT CURSOR
    document.body.style.cursor = 'none';

    // Move cursor anchor points to center
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    // The cursor moves instantly, the follower has a slight delay (lag)
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });
    const xToFollow = gsap.quickTo(follower, "x", { duration: 0.6, ease: "power3" });
    const yToFollow = gsap.quickTo(follower, "y", { duration: 0.6, ease: "power3" });

    // 3. MOUSE MOVE HANDLER
    const onMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToFollow(e.clientX);
      yToFollow(e.clientY);
    };

    // 4. HOVER DETECTION
    // We attach listeners to all interactive elements automatically
    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    const addListeners = () => {
        const hoverables = document.querySelectorAll('a, button, input, textarea, .hover-trigger');
        hoverables.forEach((el) => {
            el.addEventListener('mouseenter', onMouseEnter);
            el.addEventListener('mouseleave', onMouseLeave);
            // Hide standard cursor on these elements too
            el.style.cursor = 'none'; 
        });
    };

    // 5. CLICK ANIMATION
    const onMouseDown = () => {
        gsap.to([cursor, follower], { scale: 0.5, duration: 0.1 });
    };
    const onMouseUp = () => {
        gsap.to([cursor, follower], { scale: isHovering ? 0.5 : 0.5, duration: 0.1 });
    };

    // Initialize
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    
    // Add listeners initially and whenever DOM changes (simple observer)
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      observer.disconnect();
    };
  }, [isHovering]);

  // --- ANIMATE ON HOVER STATE CHANGE ---
  useEffect(() => {
    if (isHovering) {
        // Expand and fade out the center dot, keep the ring
        gsap.to(cursorRef.current, { scale: 0, duration: 0.3 });
        gsap.to(followerRef.current, { scale: 0.3, borderWidth: 0, backgroundColor: "white", opacity: 0.5, duration: 0.3 });
    } else {
        // Return to normal
        gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
        gsap.to(followerRef.current, { scale: 1, borderWidth: "1px", backgroundColor: "transparent", opacity: 1, duration: 0.3 });
    }
  }, [isHovering]);

  return (
    <div className="custom-cursor">
      {/* The Small Dot (Precise Pointer) */}
      <div 
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
      
      {/* The Following Ring (Lag Effect) */}
      <div 
        ref={followerRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      />
    </div>
  );
};

export default CustomCursor;