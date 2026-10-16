"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { productPhotoUrl } from "@/lib/storage";
import { saveLandingConfig } from "@/actions/landing";
import { LANDING_SORT_OPTIONS } from "@/lib/landing-config";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

async function uploadImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Tipe gambar tidak didukung. Pakai JPEG, PNG, atau WebP.");
  }
  if (file.size === 0) throw new Error("Berkas kosong.");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Ukuran gambar melebihi 2 MB.");
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/photos", { method: "POST", body: formData });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || "Gagal mengunggah gambar.");
  if (!data?.path) throw new Error("Path gambar tidak diterima.");
  return data.path;
}

export default function LandingSettingsForm({ config }) {
  const initialImages = [0, 1, 2].map((index) =>
    typeof config?.hero?.images?.[index] === "string"
      ? config.hero.images[index]
      : ""
  );
  const [imagePaths, setImagePaths] = useState(initialImages);
  const fileInputs = useRef([]);
  const [uploading, setUploading] = useState([false, false, false]);
  const [uploadErrors, setUploadErrors] = useState(["", "", ""]);
  const [whyImagePath, setWhyImagePath] = useState(
    typeof config?.why?.imageUrl === "string" ? config.why.imageUrl : ""
  );
  const whyFileInput = useRef(null);
  const [whyUploading, setWhyUploading] = useState(false);
  const [whyUploadError, setWhyUploadError] = useState("");

  const [state, formAction, pending] = useActionState(saveLandingConfig, null);

  async function handleWhyImageSelect(file) {
    if (!file) return;
    setWhyUploading(true);
    setWhyUploadError("");
    try {
      const path = await uploadImage(file);
      setWhyImagePath(path);
    } catch (error) {
      setWhyUploadError(error?.message || "Gagal mengunggah gambar.");
    } finally {
      setWhyUploading(false);
      if (whyFileInput.current) whyFileInput.current.value = "";
    }
  }

  async function handleImageSelect(index, file) {
    if (!file) return;
    setUploading((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
    setUploadErrors((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
    try {
      const path = await uploadImage(file);
      setImagePaths((prev) => {
        const next = [...prev];
        next[index] = path;
        return next;
      });
    } catch (error) {
      setUploadErrors((prev) => {
        const next = [...prev];
        next[index] = error?.message || "Gagal mengunggah gambar.";
        return next;
      });
    } finally {
      setUploading((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
      if (fileInputs.current[index]) fileInputs.current[index].value = "";
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Pengaturan tampilan landing page</h1>
          <p className="mt-1 text-sm text-teks-sekunder">
            Atur hero, katalog, langkah pemesanan, kontak, dan SEO. Perubahan langsung tampil di beranda.
          </p>
        </div>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover">
          Lihat beranda
        </Link>
      </div>

      {state?.ok ? (
        <div role="status" className="rounded-lg bg-ok-bg px-4 py-3 text-sm text-ok">
          {state.message || "Pengaturan disimpan."}
        </div>
      ) : null}
      {state?.error ? (
        <div role="alert" className="rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah">
          {state.error}
        </div>
      ) : null}

      <form action={formAction} className="space-y-6">
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Hero / bagian pembuka</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul utama</span>
            <input name="heroTitle" defaultValue={config.hero.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Subjudul</span>
            <textarea name="heroSubtitle" rows={3} defaultValue={config.hero.subtitle} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Teks tombol hero</span>
              <input name="heroButtonText" defaultValue={config.hero.buttonText} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Tautan tombol hero</span>
              <input name="heroButtonHref" defaultValue={config.hero.buttonHref} placeholder="#koleksi" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
          </div>
          <div className="space-y-3">
            <span className="text-sm font-medium">Gambar hero (3 slot)</span>
            <p className="text-xs text-teks-sekunder">
              Slot 1: gambar utama (portrait), slot 2: detail kain (persegi), slot 3: proses (persegi). Gunakan file JPEG/PNG/WebP maks. 2 MB.
            </p>
            {[0, 1, 2].map((index) => {
              const preview = imagePaths[index]
                ? productPhotoUrl(imagePaths[index])
                : null;
              const labels = ["Gambar utama", "Detail kain", "Proses ukur"];
              return (
                <div key={index} className="rounded-lg border border-garis p-3">
                  <div className="mb-2 text-xs font-medium text-teks-sekunder">
                    Slot {index + 1}: {labels[index]}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={preview}
                        alt={`Pratinjau slot ${index + 1}`}
                        className="h-24 w-24 rounded-lg object-cover ring-1 ring-garis"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-krem-tua text-center text-xs text-teks-sekunder">
                        Belum ada gambar
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2">
                      <input
                        ref={(el) => {
                          fileInputs.current[index] = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) handleImageSelect(index, file);
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputs.current[index]?.click()}
                          disabled={uploading[index]}
                          className={
                            "inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium " +
                            (uploading[index]
                              ? "cursor-wait bg-zaitun/60 text-krem"
                              : "bg-zaitun text-krem hover:bg-zaitun-hover")
                          }
                        >
                          {uploading[index]
                            ? "Mengunggah..."
                            : imagePaths[index]
                              ? "Ganti gambar"
                              : "Pilih & unggah"}
                        </button>
                        {imagePaths[index] ? (
                          <button
                            type="button"
                            onClick={() =>
                              setImagePaths((prev) => {
                                const next = [...prev];
                                next[index] = "";
                                return next;
                              })
                            }
                            className="inline-flex min-h-11 items-center rounded-lg border border-merah px-3 py-2 text-sm font-medium text-merah hover:bg-merah-bg"
                          >
                            Hapus
                          </button>
                        ) : null}
                      </div>
                      {uploadErrors[index] ? (
                        <p className="text-xs text-merah">{uploadErrors[index]}</p>
                      ) : null}
                      {imagePaths[index] ? (
                        <p className="text-xs text-teks-sekunder">
                          Path: {imagePaths[index]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <input type="hidden" name={`heroImage${index + 1}Url`} value={imagePaths[index] || ""} />
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Bagian “Kenapa pilih kami”</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul bagian</span>
            <input name="whyTitle" defaultValue={config.why.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Subjudul</span>
            <textarea name="whySubtitle" rows={2} defaultValue={config.why.subtitle} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="space-y-2 rounded-lg border border-garis p-3">
            <span className="text-sm font-medium">Gambar bagian “Kenapa pilih kami”</span>
            <p className="text-xs text-teks-sekunder">
              Gunakan foto proses/produk (JPEG/PNG/WebP, maks. 2 MB).
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {whyImagePath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={productPhotoUrl(whyImagePath)}
                  alt="Pratinjau gambar kenapa pilih kami"
                  className="h-24 w-24 rounded-lg object-cover ring-1 ring-garis"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-krem-tua text-center text-xs text-teks-sekunder">
                  Belum ada gambar
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <input
                  ref={whyFileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleWhyImageSelect(file);
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => whyFileInput.current?.click()}
                    disabled={whyUploading}
                    className={
                      "inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium " +
                      (whyUploading
                        ? "cursor-wait bg-zaitun/60 text-krem"
                        : "bg-zaitun text-krem hover:bg-zaitun-hover")
                    }
                  >
                    {whyUploading ? "Mengunggah..." : whyImagePath ? "Ganti gambar" : "Pilih & unggah"}
                  </button>
                  {whyImagePath ? (
                    <button
                      type="button"
                      onClick={() => setWhyImagePath("")}
                      className="inline-flex min-h-11 items-center rounded-lg border border-merah px-3 py-2 text-sm font-medium text-merah hover:bg-merah-bg"
                    >
                      Hapus
                    </button>
                  ) : null}
                </div>
                {whyUploadError ? <p className="text-xs text-merah">{whyUploadError}</p> : null}
                {whyImagePath ? (
                  <p className="text-xs text-teks-sekunder">Path: {whyImagePath}</p>
                ) : null}
              </div>
            </div>
            <input type="hidden" name="whyImageUrl" value={whyImagePath || ""} />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Bagian katalog</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul seksi</span>
            <input name="catalogTitle" defaultValue={config.catalog.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="catalogShowCategoryFilter" defaultChecked={config.catalog.showCategoryFilter} className="h-5 w-5" />
            Tampilkan filter kategori
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Jumlah produk ditampilkan</span>
              <select name="catalogLimit" defaultValue={config.catalog.limit} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm">
                {[4, 8, 12, 16, 24].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Urutan produk</span>
              <select name="catalogSort" defaultValue={config.catalog.sort} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm">
                {LANDING_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Bagian “Cara pesan”</legend>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="howToOrderEnabled" defaultChecked={config.howToOrder.enabled} className="h-5 w-5" />
            Tampilkan bagian cara pesan
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Judul bagian</span>
              <input name="howToOrderTitle" defaultValue={config.howToOrder.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Subjudul</span>
              <input name="howToOrderSubtitle" defaultValue={config.howToOrder.subtitle} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
          </div>
          <div className="space-y-4">
            {[0, 1, 2].map((index) => (
              <div key={index} className="rounded-lg border border-garis p-3">
                <p className="mb-2 text-xs font-medium text-teks-sekunder">Langkah {index + 1}</p>
                <label className="block">
                  <span className="text-sm font-medium">Judul</span>
                  <input name={`step${index + 1}Title`} defaultValue={config.howToOrder.steps[index]?.t || ""} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
                <label className="mt-3 block">
                  <span className="text-sm font-medium">Deskripsi</span>
                  <textarea name={`step${index + 1}Text`} rows={2} defaultValue={config.howToOrder.steps[index]?.d || ""} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Kontak admin</legend>
          <label className="block">
            <span className="text-sm font-medium">Nomor WhatsApp (format 628...)</span>
            <input name="contactPhone" defaultValue={config.contact.whatsappPhone || ""} placeholder="6281234567890" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Teks tombol kontak</span>
              <input name="contactButtonText" defaultValue={config.contact.buttonText} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Pesan awal WhatsApp</span>
              <input name="contactMessage" defaultValue={config.contact.message} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">SEO dasar</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul halaman</span>
            <input name="seoTitle" defaultValue={config.seo.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Deskripsi halaman</span>
            <textarea name="seoDescription" rows={3} defaultValue={config.seo.description} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
        </fieldset>

        <button type="submit" disabled={pending} className={"inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-krem transition " + (pending ? "cursor-wait bg-zaitun/60" : "bg-zaitun hover:bg-zaitun-hover")}>
          {pending ? "Menyimpan..." : "Simpan pengaturan"}
        </button>
      </form>
    </section>
  );
}
