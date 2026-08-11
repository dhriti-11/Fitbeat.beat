"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[100] h-[3px] w-full bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-[#1E6FD9] via-[#F5821F] to-[#FFA94D] transition-[width] duration-75"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
