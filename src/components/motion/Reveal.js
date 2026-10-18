"use client";

import { useEffect, useRef } from "react";

// Pembungkus "muncul saat masuk viewport" untuk landing page.
// Gaya awalnya berasal dari kelas .reveal di globals.css, yang hanya aktif
// bila JavaScript tersedia dan pengguna tidak meminta gerak dikurangi.
// Kelas .is-visible ditambahkan langsung ke elemen lewat IntersectionObserver,
// sehingga tidak ada state React yang memicu render ulang.
// Anak server (mis. ProductCard) bisa dilewatkan sebagai children.
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => element.classList.add("is-visible");

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Tanpa animasi (reduced motion) atau tanpa IntersectionObserver:
    // langsung tampilkan agar konten tidak pernah tersembunyi.
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ ...style, "--reveal-delay": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
