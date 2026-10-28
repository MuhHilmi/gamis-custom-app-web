"use client";

import { useEffect, useRef, useState } from "react";

// Menu navigasi untuk layar kecil. Panel ditutup saat tautan dipilih,
// saat menekan Escape, atau saat menekan di luar menu.
export default function MobileNav({ children }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="mobile-nav" ref={containerRef}>
      <button
        ref={toggleRef}
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="menu-mobile"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div id="menu-mobile" className="mobile-menu">
          <nav aria-label="Navigasi mobile" onClick={() => setOpen(false)}>
            {children}
          </nav>
        </div>
      )}
    </div>
  );
}
