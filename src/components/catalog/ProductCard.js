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
      className="group flex flex-col overflow-hidden rounded-lg bg-putih shadow-sm ring-1 ring-garis focus-visible:outline-zaitun"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-krem-tua">
        <Image
          src={photo}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
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