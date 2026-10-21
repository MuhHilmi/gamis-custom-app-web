"use client";

import Link from "next/link";
import Image from "next/image";
import { productPhotoUrl } from "@/lib/storage";
import GamisSvg from "@/components/landing/GamisSvg";

export default function KoleksiTerbaru({ title, items }) {
  const defaultItems = [
    { imageUrl: null, caption: "Gamis harian", href: "#pilih-model", tall: true },
    { imageUrl: null, caption: "Gamis acara", href: "#pilih-model", tall: false },
    { imageUrl: null, caption: "Gamis seragam", href: "#pilih-model", tall: false },
  ];

  const displayItems = items?.length ? items : defaultItems;

  return (
    <section id="koleksi" className="container section" style={{ paddingBottom: 64 }}>
      <h2 className="h-display h-section" style={{ marginBottom: 40 }}>
        {title}
      </h2>
      <div className="collage">
        {displayItems.map((item, index) => (
          <a key={index} className={`tile ${item.tall ? "tall big" : ""}`} href={item.href}>
            <div className="ph">
              {item.imageUrl ? (
                <Image
                  src={productPhotoUrl(item.imageUrl)}
                  alt={item.caption}
                  fill
                  sizes={item.tall ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              ) : (
                <GamisSvg className="sil" style={{ width: item.tall ? 150 : 96, height: item.tall ? 190 : 120 }} />
              )}
              <span className="ph-label">Foto: {item.caption}</span>
            </div>
            <span className="tile-cap">{item.caption}</span>
          </a>
        ))}
      </div>
      <div className="center mt-36">
        <Link className="btn btn-olive" href="#pilih-model">
          Lihat semua <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}