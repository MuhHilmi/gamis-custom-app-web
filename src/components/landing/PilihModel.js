"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { productPhotoUrl } from "@/lib/storage";
import GamisSvg from "@/components/landing/GamisSvg";

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function getProductImage(product) {
  if (product.photos && product.photos.length > 0) {
    return productPhotoUrl(product.photos[0]);
  }
  return null;
}

export default function PilihModel({ categories, products }) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Get unique categories from products
  const productCategories = useMemo(() => {
    const catMap = new Map();
    products.forEach((p) => {
      if (p.category_id) {
        const cat = categories.find((c) => c.id === p.category_id);
        if (cat) catMap.set(cat.slug, cat.name);
      }
    });
    return Array.from(catMap.entries()).map(([slug, label]) => ({ slug, label }));
  }, [categories, products]);

  const allCategories = [{ slug: "Semua", label: "Semua" }, ...productCategories];

  const filteredProducts = useMemo(() => {
    if (activeCategory === "Semua") return products;
    return products.filter((p) => {
      const cat = categories.find((c) => c.id === p.category_id);
      return cat?.slug === activeCategory;
    });
  }, [products, categories, activeCategory]);

  return (
    <section id="pilih-model" className="container section" style={{ paddingTop: 40 }}>
      <h2 className="h-display h-section">Pilih model</h2>
      <p className="lead">
        Pilih model, lalu atur ukuran, bahan, dan warna di halaman produk. Harga langsung terlihat.
      </p>
      <div className="chips" role="group" aria-label="Filter kategori">
        {allCategories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            className="chip"
            data-cat={cat.slug}
            aria-pressed={activeCategory === cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="grid-landing" id="produk-grid">
        {filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-teks-sekunder py-8">Belum ada produk di kategori ini.</p>
        ) : (
          filteredProducts.map((product) => {
            const imageSrc = getProductImage(product);
            return (
              <Link key={product.id} className="card" href={`/produk/${product.slug}`} data-cat={activeCategory}>
                <div className="ph">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <GamisSvg className="sil" />
                  )}
                  <span className="ph-label">Foto produk</span>
                </div>
                <div className="card-body">
                  <p className="card-name">{product.name}</p>
                  <p className="card-price">Mulai {formatPrice(product.base_price)}</p>
                  <p className="card-eta">± {product.lead_time_days || 7}–{product.lead_time_days ? product.lead_time_days + 7 : 14} hari pengerjaan</p>
                  <span className="card-pick">Pilih ukuran</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
      <div className="center" style={{ marginTop: 40 }}>
        <Link className="btn btn-olive" href="/katalog">
          Lihat lainnya <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}