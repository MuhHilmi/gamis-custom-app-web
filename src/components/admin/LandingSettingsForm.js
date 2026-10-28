"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { productPhotoUrl } from "@/lib/storage";
import { saveLandingConfig } from "@/actions/landing";

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
  // Support both old (data.path) and new (data.paths[]) response format
  const path = data?.path || (Array.isArray(data?.paths) && data.paths[0]);
  if (!path) throw new Error("Path gambar tidak diterima.");
  return path;
}

export default function LandingSettingsForm({ config }) {
  const [heroImagePath, setHeroImagePath] = useState(
    typeof config?.hero?.imageUrl === "string" ? config.hero.imageUrl : ""
  );
  const heroFileInput = useRef(null);
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadError, setHeroUploadError] = useState("");

  const initialKoleksiImages = [0, 1, 2].map((index) =>
    typeof config?.koleksiTerbaru?.items?.[index]?.imageUrl === "string"
      ? config.koleksiTerbaru.items[index].imageUrl
      : ""
  );
  const [koleksiImagePaths, setKoleksiImagePaths] = useState(initialKoleksiImages);
  const koleksiFileInputs = useRef([]);
  const [koleksiUploading, setKoleksiUploading] = useState([false, false, false]);
  const [koleksiUploadErrors, setKoleksiUploadErrors] = useState(["", "", ""]);

  const [kenapaImagePath, setKenapaImagePath] = useState(
    typeof config?.kenapa?.imageUrl === "string" ? config.kenapa.imageUrl : ""
  );
  const kenapaFileInput = useRef(null);
  const [kenapaUploading, setKenapaUploading] = useState(false);
  const [kenapaUploadError, setKenapaUploadError] = useState("");

  const [pilihanBulanIniImagePath, setPilihanBulanIniImagePath] = useState(
    typeof config?.pilihanBulanIni?.imageUrl === "string" ? config.pilihanBulanIni.imageUrl : ""
  );
  const pilihanBulanIniFileInput = useRef(null);
  const [pilihanBulanIniUploading, setPilihanBulanIniUploading] = useState(false);
  const [pilihanBulanIniUploadError, setPilihanBulanIniUploadError] = useState("");

  const [state, formAction, pending] = useActionState(saveLandingConfig, null);

  async function handleImageUpload(file, setter, setUploading, setError, fileInputRef) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const path = await uploadImage(file);
      setter(path);
    } catch (error) {
      setError(error?.message || "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Pengaturan tampilan landing page</h1>
          <p className="mt-1 text-sm text-teks-sekunder">
            Atur copywriting, gambar, dan SEO. Perubahan langsung tampil di beranda.
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
        {/* Hero */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Hero / bagian pembuka</legend>
          
          {/* Hero Image Upload */}
          <div className="space-y-2 rounded-lg border border-garis p-3">
            <span className="text-sm font-medium">Gambar Hero (opsional)</span>
            <p className="text-xs text-teks-sekunder">Ditampilkan di sisi kanan hero (rasio 4:5). JPEG/PNG/WebP, maks. 2 MB.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {heroImagePath ? (
                <img src={productPhotoUrl(heroImagePath)} alt="Pratinjau gambar hero" className="h-24 w-24 rounded-lg object-cover ring-1 ring-garis" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-krem-tua text-center text-xs text-teks-sekunder">Belum ada gambar</div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <input ref={heroFileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f=e.target.files?.[0]; if(f) handleImageUpload(f, setHeroImagePath, setHeroUploading, setHeroUploadError, heroFileInput); }} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => heroFileInput.current?.click()} disabled={heroUploading} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium bg-zaitun text-krem hover:bg-zaitun-hover disabled:cursor-wait disabled:bg-zaitun/60">
                    {heroUploading ? "Mengunggah..." : heroImagePath ? "Ganti gambar" : "Pilih & unggah"}
                  </button>
                  {heroImagePath && <button type="button" onClick={() => setHeroImagePath("")} className="inline-flex min-h-11 items-center rounded-lg border border-merah px-3 py-2 text-sm font-medium text-merah hover:bg-merah-bg">Hapus</button>}
                </div>
                {heroUploadError && <p className="text-xs text-merah">{heroUploadError}</p>}
                {heroImagePath && <p className="break-all text-xs text-teks-sekunder">Path: {heroImagePath}</p>}
              </div>
            </div>
            <input type="hidden" name="heroImageUrl" value={heroImagePath || ""} />
          </div>

          {/* Hero Copy */}
          <div className="space-y-4">
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
                <input name="heroButtonHref" defaultValue={config.hero.buttonHref} placeholder="#pilih-model" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
              </label>
            </div>
          </div>
        </fieldset>

        {/* Koleksi Terbaru */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Bagian “Koleksi terbaru”</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul bagian</span>
            <input name="koleksiTerbaruTitle" defaultValue={config.koleksiTerbaru.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="space-y-3">
            <p className="text-xs text-teks-sekunder">
              Slot 1: Gambar utama (tall), Slot 2 & 3: Gambar samping (kotak). JPEG/PNG/WebP, maks. 2 MB.
            </p>
            {config.koleksiTerbaru.items.map((item, index) => {
              const preview = koleksiImagePaths[index] ? productPhotoUrl(koleksiImagePaths[index]) : null;
              const labels = ["Slot 1 (Utama - Tall)", "Slot 2 (Samping)", "Slot 3 (Samping)"];
              return (
                <div key={index} className="rounded-lg border border-garis p-3">
                  <div className="mb-2 text-xs font-medium text-teks-sekunder">
                    {labels[index]}
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {preview ? (
                      <img src={preview} alt={`Pratinjau ${labels[index]}`} className="h-24 w-24 rounded-lg object-cover ring-1 ring-garis" />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-krem-tua text-center text-xs text-teks-sekunder">
                        Belum ada gambar
                      </div>
                    )}
                    <div className="flex flex-1 flex-col gap-2">
                      <input
                        ref={(el) => { koleksiFileInputs.current[index] = el; }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) handleImageUpload(file, (p) => setKoleksiImagePaths(prev => { const n=[...prev]; n[index]=p; return n; }), () => setKoleksiUploading(prev => { const n=[...prev]; n[index]=true; return n; }), (e) => setKoleksiUploadErrors(prev => { const n=[...prev]; n[index]=e; return n; }), koleksiFileInputs);
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => koleksiFileInputs.current[index]?.click()}
                          disabled={koleksiUploading[index]}
                          className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium bg-zaitun text-krem hover:bg-zaitun-hover disabled:cursor-wait disabled:bg-zaitun/60"
                        >
                          {koleksiUploading[index] ? "Mengunggah..." : koleksiImagePaths[index] ? "Ganti gambar" : "Pilih & unggah"}
                        </button>
                        {koleksiImagePaths[index] && (
                          <button
                            type="button"
                            onClick={() => setKoleksiImagePaths(prev => { const n=[...prev]; n[index]=""; return n; })}
                            className="inline-flex min-h-11 items-center rounded-lg border border-merah px-3 py-2 text-sm font-medium text-merah hover:bg-merah-bg"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      {koleksiUploadErrors[index] && <p className="text-xs text-merah">{koleksiUploadErrors[index]}</p>}
                      {koleksiImagePaths[index] && <p className="break-all text-xs text-teks-sekunder">Path: {koleksiImagePaths[index]}</p>}
                    </div>
                  </div>
                  <input type="hidden" name={`koleksiTerbaruItem${index}ImageUrl`} value={koleksiImagePaths[index] || ""} />
                  <input type="hidden" name={`koleksiTerbaruItem${index}Caption`} value={item.caption} />
                  <input type="hidden" name={`koleksiTerbaruItem${index}Href`} value={item.href} />
                  <input type="hidden" name={`koleksiTerbaruItem${index}Tall`} value={item.tall ? "true" : "false"} />
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Kenapa Kami */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Bagian “Kenapa pilih kami”</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul bagian</span>
            <input name="kenapaTitle" defaultValue={config.kenapa.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Subjudul</span>
            <textarea name="kenapaSubtitle" rows={2} defaultValue={config.kenapa.subtitle} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>

          {/* Kenapa Image Upload */}
          <div className="space-y-2 rounded-lg border border-garis p-3">
            <span className="text-sm font-medium">Gambar bagian “Kenapa pilih kami” (opsional)</span>
            <p className="text-xs text-teks-sekunder">Ditampilkan di atas keunggulan. JPEG/PNG/WebP, maks. 2 MB.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {kenapaImagePath ? (
                <img src={productPhotoUrl(kenapaImagePath)} alt="Pratinjau gambar kenapa pilih kami" className="h-24 w-24 rounded-lg object-cover ring-1 ring-garis" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-krem-tua text-center text-xs text-teks-sekunder">Belum ada gambar</div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <input ref={kenapaFileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f=e.target.files?.[0]; if(f) handleImageUpload(f, setKenapaImagePath, setKenapaUploading, setKenapaUploadError, kenapaFileInput); }} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => kenapaFileInput.current?.click()} disabled={kenapaUploading} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium bg-zaitun text-krem hover:bg-zaitun-hover disabled:cursor-wait disabled:bg-zaitun/60">
                    {kenapaUploading ? "Mengunggah..." : kenapaImagePath ? "Ganti gambar" : "Pilih & unggah"}
                  </button>
                  {kenapaImagePath && <button type="button" onClick={() => setKenapaImagePath("")} className="inline-flex min-h-11 items-center rounded-lg border border-merah px-3 py-2 text-sm font-medium text-merah hover:bg-merah-bg">Hapus</button>}
                </div>
                {kenapaUploadError && <p className="text-xs text-merah">{kenapaUploadError}</p>}
                {kenapaImagePath && <p className="break-all text-xs text-teks-sekunder">Path: {kenapaImagePath}</p>}
              </div>
            </div>
            <input type="hidden" name="kenapaImageUrl" value={kenapaImagePath || ""} />
          </div>

          <div className="space-y-4">
            {config.kenapa.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-garis p-3">
                <p className="mb-2 text-xs font-medium text-teks-sekunder">Keunggulan {index + 1}</p>
                <label className="block">
                  <span className="text-sm font-medium">Judul</span>
                  <input name={`kenapaItem${index}Title`} defaultValue={item.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
                <label className="mt-3 block">
                  <span className="text-sm font-medium">Deskripsi</span>
                  <textarea name={`kenapaItem${index}Text`} rows={2} defaultValue={item.text} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Cara Pesan */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Bagian “Cara pesan”</legend>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="caraPesanEnabled" defaultChecked={config.caraPesan.enabled} className="h-5 w-5" />
            Tampilkan bagian cara pesan
          </label>
          <label className="block">
            <span className="text-sm font-medium">Judul bagian</span>
            <input name="caraPesanTitle" defaultValue={config.caraPesan.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="space-y-4">
            {config.caraPesan.steps.map((step, index) => (
              <div key={index} className="rounded-lg border border-garis p-3">
                <p className="mb-2 text-xs font-medium text-teks-sekunder">Langkah {step.num}</p>
                <label className="block">
                  <span className="text-sm font-medium">Judul</span>
                  <input name={`step${index + 1}Title`} defaultValue={step.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
                <label className="mt-3 block">
                  <span className="text-sm font-medium">Deskripsi</span>
                  <textarea name={`step${index + 1}Desc`} rows={2} defaultValue={step.desc} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Testimoni */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Testimoni</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul bagian</span>
            <input name="testimoniTitle" defaultValue={config.testimoni.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="space-y-4">
            {config.testimoni.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-garis p-3">
                <p className="mb-2 text-xs font-medium text-teks-sekunder">Testimoni {index + 1}</p>
                <label className="block">
                  <span className="text-sm font-medium">Judul singkat</span>
                  <input name={`testimoniItem${index}Title`} defaultValue={item.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
                <label className="mt-3 block">
                  <span className="text-sm font-medium">Isi testimoni</span>
                  <textarea name={`testimoniItem${index}Text`} rows={3} defaultValue={item.text} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium">Nama pembeli</span>
                    <input name={`testimoniItem${index}Author`} defaultValue={item.author} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Kota & model</span>
                    <input name={`testimoniItem${index}Meta`} defaultValue={item.meta} placeholder="Jakarta · Gamis Harian Klasik" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        {/* FAQ */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">FAQ (Pertanyaan umum)</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul bagian</span>
            <input name="faqTitle" defaultValue={config.faq.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Subjudul</span>
            <input name="faqSubtitle" defaultValue={config.faq.subtitle} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="space-y-4">
            {config.faq.items.map((item, index) => (
              <div key={index} className="rounded-lg border border-garis p-3">
                <p className="mb-2 text-xs font-medium text-teks-sekunder">Pertanyaan {index + 1}</p>
                <label className="block">
                  <span className="text-sm font-medium">Pertanyaan</span>
                  <input name={`faqItem${index}Q`} defaultValue={item.q} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
                <label className="mt-3 block">
                  <span className="text-sm font-medium">Jawaban</span>
                  <textarea name={`faqItem${index}A`} rows={3} defaultValue={item.a} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Pilihan Bulan Ini */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">Bagian “Pilihan bulan ini” (Produk Unggulan)</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul bagian</span>
            <input name="pilihanBulanIniTitle" defaultValue={config.pilihanBulanIni.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Subjudul (eyebrow)</span>
            <input name="pilihanBulanIniSubtitle" defaultValue={config.pilihanBulanIni.subtitle} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Nama produk</span>
            <input name="pilihanBulanIniProductName" defaultValue={config.pilihanBulanIni.productName} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Deskripsi produk</span>
            <textarea name="pilihanBulanIniDescription" rows={3} defaultValue={config.pilihanBulanIni.description} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Harga (tampilan)</span>
              <input name="pilihanBulanIniPrice" defaultValue={config.pilihanBulanIni.price} placeholder="Mulai Rp 650.000" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Teks tombol</span>
              <input name="pilihanBulanIniButtonText" defaultValue={config.pilihanBulanIni.buttonText} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Tautan tombol</span>
              <input name="pilihanBulanIniButtonHref" defaultValue={config.pilihanBulanIni.buttonHref} placeholder="#pilih-model" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
          </div>

          {/* Stats */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Stat cards (3 item)</span>
            {config.pilihanBulanIni.stats.map((stat, index) => (
              <div key={index} className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium">Nilai (contoh: 7–14)</span>
                  <input name={`pilihanBulanIniStat${index}Value`} defaultValue={stat.value} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Label (contoh: Hari pengerjaan)</span>
                  <input name={`pilihanBulanIniStat${index}Label`} defaultValue={stat.label} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
                </label>
              </div>
            ))}
          </div>

          {/* Pilihan Bulan Ini Image Upload */}
          <div className="space-y-2 rounded-lg border border-garis p-3">
            <span className="text-sm font-medium">Gambar produk unggulan (opsional)</span>
            <p className="text-xs text-teks-sekunder">Ditampilkan di sisi kiri section (rasio 1:1). JPEG/PNG/WebP, maks. 2 MB.</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {pilihanBulanIniImagePath ? (
                <img src={productPhotoUrl(pilihanBulanIniImagePath)} alt="Pratinjau gambar produk unggulan" className="h-24 w-24 rounded-lg object-cover ring-1 ring-garis" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-krem-tua text-center text-xs text-teks-sekunder">Belum ada gambar</div>
              )}
              <div className="flex flex-1 flex-col gap-2">
                <input ref={pilihanBulanIniFileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f=e.target.files?.[0]; if(f) handleImageUpload(f, setPilihanBulanIniImagePath, setPilihanBulanIniUploading, setPilihanBulanIniUploadError, pilihanBulanIniFileInput); }} />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => pilihanBulanIniFileInput.current?.click()} disabled={pilihanBulanIniUploading} className="inline-flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium bg-zaitun text-krem hover:bg-zaitun-hover disabled:cursor-wait disabled:bg-zaitun/60">
                    {pilihanBulanIniUploading ? "Mengunggah..." : pilihanBulanIniImagePath ? "Ganti gambar" : "Pilih & unggah"}
                  </button>
                  {pilihanBulanIniImagePath && <button type="button" onClick={() => setPilihanBulanIniImagePath("")} className="inline-flex min-h-11 items-center rounded-lg border border-merah px-3 py-2 text-sm font-medium text-merah hover:bg-merah-bg">Hapus</button>}
                </div>
                {pilihanBulanIniUploadError && <p className="text-xs text-merah">{pilihanBulanIniUploadError}</p>}
                {pilihanBulanIniImagePath && <p className="break-all text-xs text-teks-sekunder">Path: {pilihanBulanIniImagePath}</p>}
              </div>
            </div>
            <input type="hidden" name="pilihanBulanIniImageUrl" value={pilihanBulanIniImagePath || ""} />
          </div>
        </fieldset>

        {/* CTA Penutup */}
        <fieldset className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <legend className="font-serif text-lg font-semibold">CTA penutup</legend>
          <label className="block">
            <span className="text-sm font-medium">Judul CTA</span>
            <input name="ctaTitle" defaultValue={config.cta.title} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Subjudul CTA</span>
            <textarea name="ctaSubtitle" rows={2} defaultValue={config.cta.subtitle} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Teks tombol utama</span>
              <input name="ctaButtonText" defaultValue={config.cta.buttonText} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Tautan tombol utama</span>
              <input name="ctaButtonHref" defaultValue={config.cta.buttonHref} placeholder="#pilih-model" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Teks tombol WhatsApp</span>
              <input name="ctaWaButtonText" defaultValue={config.cta.waButtonText} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
            </label>
          </div>
        </fieldset>

        {/* Kontak Admin */}
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

        {/* SEO */}
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