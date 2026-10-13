// Pembangun URL publik untuk foto di bucket Supabase Storage.
// Pembangun URL foto produk.
// - URL penuh (http/https) atau path web (diawali "/"), mis. foto lokal di
//   public/, dikembalikan apa adanya.
// - Path lain dianggap kunci objek di bucket Supabase Storage "product-photos".
export function productPhotoUrl(path) {
  if (!path) return null;
  const value = String(path).trim();
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("/")) {
    return value;
  }
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  if (!base) return null;
  const clean = value.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/product-photos/${clean}`;
}

export const PRODUCT_PHOTO_BUCKET = "product-photos";