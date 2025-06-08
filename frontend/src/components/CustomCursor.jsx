import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const rippleContainerRef = useRef(null);

  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e) => {
      const ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX - 25}px`;
      ripple.style.top = `${e.clientY - 25}px`;
      rippleContainerRef.current.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    let animationFrame;

    const animate = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        const newX = prev.x + dx * 0.12;
        const newY = prev.y + dy * 0.12;
        trailRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
        return { x: newX, y: newY };
      });

      cursorRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [position]);

  return (
    <>
      <div
        ref={rippleContainerRef}
        className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden"
      ></div>

      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 z-[10001] w-6 h-6 rounded-full bg-primary opacity-40 blur-sm transition-transform duration-100"
      ></div>

      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[10002] w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-white ring-opacity-30"
      ></div>

      <style jsx="true">{`
        .cursor-ripple {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(29, 185, 84, 0.4);
          transform: scale(0);
          animation: rippleAnimation 0.6s ease-out forwards;
          pointer-events: none;
          z-index: 9999;
        }

        @keyframes rippleAnimation {
          to {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
