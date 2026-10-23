"use client";

import Link from "next/link";
import Image from "next/image";
import { productPhotoUrl } from "@/lib/storage";
import GamisSvg from "@/components/landing/GamisSvg";

export default function Hero({ title, subtitle, buttonText, buttonHref, imageUrl }) {
  const imageSrc = imageUrl ? productPhotoUrl(imageUrl) : null;

  return (
    <section className="hero" id="atas">
      <div className="container hero-in">
        <div className="hero-text">
          <h1 className="h-display">
            <span>Gamis pria</span>
            <span>sesuai</span>
            <span className="accent">ukuranmu</span>
          </h1>
          <p>{subtitle}</p>
          <div className="hero-cta">
            <span className="dots" aria-hidden="true">
              <i></i>
              <i></i>
            </span>
            <span className="hero-tag">
              Koleksi<br />terbaru
            </span>
            <Link className="btn btn-olive btn-lg" href={buttonHref}>
              {buttonText} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="hero-art">
          {imageSrc ? (
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              <Image
                src={imageSrc}
                alt={title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-2xl object-cover"
                style={{ objectPosition: "center" }}
              />
            </div>
          ) : (
            <>
              <div className="b1" />
              <div className="b2" />
              <div className="ph">
                <GamisSvg className="sil" style={{ width: 150, height: 190 }} />
                <span className="ph-label">Foto: model memakai gamis</span>
              </div>
              <div className="badge" aria-hidden="true">
                <svg className="ring" viewBox="0 0 124 124">
                  <defs>
                    <path
                      id="ring"
                      d="M62 62 m-48 0 a48 48 0 1 1 96 0 a48 48 0 1 1 -96 0"
                    />
                  </defs>
                  <circle cx="62" cy="62" r="60" fill="#F7F2E8" />
                  <text
                    fontFamily="DM Sans, sans-serif"
                    fontSize="12.5"
                    fontWeight="700"
                    letterSpacing="3"
                    fill="#1B2620"
                  >
                    <textPath href="#ring">DIJAHIT CUSTOM • UKURAN PAS • DIJAHIT CUSTOM • </textPath>
                  </text>
                </svg>
                <span className="core">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 17 17 3l4 4L7 21z" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m7 13 2 2M10 10l2 2M13 7l2 2" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}