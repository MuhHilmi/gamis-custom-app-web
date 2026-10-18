import Image from "next/image";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { productPhotoUrl } from "@/lib/storage";

export default function ProductCard({ product }) {
  const photo =
    productPhotoUrl(product?.photos?.[0]) || "/product-photos/Gamis.jpg";

  return (
    <Link
      href={`/produk/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg bg-putih shadow-sm ring-1 ring-garis focus-visible:outline-zaitun"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-krem-tua">
        <Image
          src={photo}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Selalu tampil di layar sentuh; muncul saat hover di desktop. */}
        <span className="pointer-events-none absolute inset-x-2 bottom-2 flex min-h-9 items-center justify-center rounded-lg bg-putih/95 text-xs font-semibold text-zaitun opacity-100 shadow transition-all duration-300 lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          Lihat detail
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="line-clamp-2 font-serif text-base font-semibold text-teks">
          {product.name}
        </h2>
        <p className="text-sm font-bold tabular-nums text-zaitun">
          Mulai {formatRupiah(product.base_price)}
        </p>
        <p className="text-xs text-teks-sekunder">
          Perkiraan pengerjaan {product.lead_time_days || 7} hari
        </p>
      </div>
    </Link>
  );
}