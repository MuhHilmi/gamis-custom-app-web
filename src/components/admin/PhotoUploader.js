"use client";

import { useState } from "react";
import Image from "next/image";
import { addProductPhotos, removeProductPhoto } from "@/actions/products";
import { productPhotoUrl } from "@/lib/storage";

export default function PhotoUploader({ productId, initialPhotos = [] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleUpload(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("productId", productId);

      const response = await fetch("/api/photos", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data?.error || "Gagal mengunggah foto");

      const newPaths = Array.isArray(data.paths) ? data.paths : [];
      if (newPaths.length > 0) {
        const updatedPhotos = await addProductPhotos({ productId, paths: newPaths });
        setPhotos(updatedPhotos);
        setStatus(`${newPaths.length} foto berhasil diunggah.`);
      }
    } catch (err) {
      setStatus(err?.message || "Gagal mengunggah foto");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleRemove(path) {
    setStatus(null);
    try {
      const updatedPhotos = await removeProductPhoto({ productId, path });
      setPhotos(updatedPhotos);
      setStatus("Foto dihapus.");
    } catch (err) {
      setStatus(err?.message || "Gagal menghapus foto");
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        Foto produk (JPEG/PNG/WebP, maks 2 MB per file)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="mt-2 block w-full text-sm border p-2 rounded-md bg-zaitun hover:bg-zaitun-hover text-krem cursor-pointer"
        />
      </label>

      {uploading && <p className="text-xs text-teks-sekunder">Mengunggah...</p>}
      {status && <p className="text-xs text-teks-sekunder">{status}</p>}

      {photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((path, index) => (
            <div key={`${path}-${index}`} className="relative group">
              <Image
                src={productPhotoUrl(path)}
                alt={`Foto produk ${index + 1}`}
                width={120}
                height={96}
                className="rounded-lg object-cover ring-1 ring-garis"
                sizes="96px"
              />
              <button
                type="button"
                onClick={() => handleRemove(path)}
                className="absolute -top-2 -right-2 hidden group-hover:block rounded-full bg-merah/90 p-1 text-xs text-krem hover:bg-merah"
                title="Hapus foto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}