import Link from "next/link";

export default function CategoryFilter({ categories, activeSlug }) {
  const items = [{ slug: null, name: "Semua" }, ...(categories || [])];

  return (
    <nav aria-label="Filter kategori" className="flex gap-2 overflow-x-auto pb-1">
      {items.map((category) => {
        const isActive = (category.slug ?? null) === (activeSlug ?? null);
        const href = category.slug ? `/?kategori=${encodeURIComponent(category.slug)}` : "/";
        return (
          <Link
            key={category.slug ?? "semua"}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={
              "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition " +
              (isActive
                ? "border-zaitun bg-zaitun text-krem"
                : "border-garis-input bg-putih text-teks hover:border-zaitun")
            }
          >
            {category.name}
          </Link>
        );
      })}
    </nav>
  );
}