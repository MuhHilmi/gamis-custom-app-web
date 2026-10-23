"use client";

import Link from "next/link";

export default function CTA({ title, subtitle, buttonText, buttonHref, waButtonText }) {
  return (
    <section className="cta on-dark">
      <div className="container section cta-in">
        <div className="cta-text">
          <h2 className="h-display">{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="cta-btns">
          <Link className="btn btn-amber btn-lg" href={buttonHref}>
            {buttonText} <span aria-hidden="true">→</span>
          </Link>
          <a
            className="btn btn-outline-light btn-lg"
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {waButtonText}
          </a>
        </div>
      </div>
    </section>
  );
}