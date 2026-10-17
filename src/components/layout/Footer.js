import Link from "next/link";
import { SITE_NAME, ADMIN_WA_DEFAULT } from "@/lib/constants";

export default function Footer() {
  const wa = process.env.NEXT_PUBLIC_ADMIN_WA || ADMIN_WA_DEFAULT;
  return (
    <footer className="bg-krem-tua text-teks">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm sm:px-6">
        <p className="font-serif text-lg font-semibold">{SITE_NAME}</p>
        <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-5 gap-y-1">
          <a
            href={`https://wa.me/${wa}`}
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition duration-200 hover:-translate-y-0.5 hover:text-zaitun-hover"
          >
            Hubungi via WhatsApp
          </a>
          <Link
            href="/lacak"
            className="inline-flex min-h-11 items-center underline underline-offset-2 transition duration-200 hover:-translate-y-0.5 hover:text-zaitun-hover"
          >
            Lacak pesanan
          </Link>
        </nav>
        <p>Pengiriman ke Pulau Jawa. Kebijakan pembatalan dan pengembalian menyusul.</p>
      </div>
    </footer>
  );
}
