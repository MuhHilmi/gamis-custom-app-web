"use client";

import Link from "next/link";
import Image from "next/image";
import { productPhotoUrl } from "@/lib/storage";
import GamisSvg from "@/components/landing/GamisSvg";

export default function PilihanBulanIni({
  title,
  subtitle,
  productName,
  description,
  price,
  buttonText,
  buttonHref,
  imageUrl,
  stats,
}) {
  const defaultStats = [
    { value: "7–14", label: "Hari pengerjaan" },
    { value: "M–XXL", label: "Pilihan ukuran" },
    { value: "Jawa", label: "Area kirim" },
  ];

  const displayStats = stats?.length ? stats : defaultStats;
  const imageSrc = imageUrl ? productPhotoUrl(imageUrl) : null;

  return (
    <section id="unggulan" className="featured on-dark">
      <div className="container section">
        <h2 className="h-display h-section">{title}</h2>
        <div className="feat-in">
          <div className="feat-img relative aspect-square max-h-[520px] w-full">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-2xl object-cover"
                style={{ objectPosition: "center" }}
              />
            ) : (
              <div className="ph aspect-square max-h-[520px] w-full">
                <GamisSvg className="sil" style={{ width: 170, height: 215 }} />
                <span className="ph-label">Foto: produk unggulan</span>
              </div>
            )}
          </div>
          <div className="feat-info">
            <p className="eyebrow">{subtitle}</p>
            <h3>{productName}</h3>
            <p className="feat-desc">{description}</p>
            <p className="feat-price">{price}</p>
            <Link className="btn btn-amber btn-lg" href={buttonHref}>
              {buttonText} <span aria-hidden="true">→</span>
            </Link>
            <p className="feat-label">Yang kamu dapat</p>
            <div className="stats">
              {displayStats.map((stat, index) => (
                <div key={index} className="stat">
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}