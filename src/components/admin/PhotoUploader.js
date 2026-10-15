"use client";

import { useState } from "react";
import { addProductPhoto } from "@/actions/products";

export default function PhotoUploader({ productId }) {
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/photos", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "Gagal mengunggah foto");
      const actionForm = new FormData();
      actionForm.append("productId", productId);
      actionForm.append("path", data.path);
      await addProductPhoto(actionForm);
      setStatus("Foto berhasil diunggah.");
    } catch (err) {
      setStatus(err?.message || "Gagal mengunggah foto");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Unggah foto produk (JPEG/PNG/WebP, maks 2 MB)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={uploading}
          className="mt-2 block w-full text-sm"
        />
      </label>
      {uploading ? <p className="text-xs text-teks-sekunder">Mengunggah...</p> : null}
      {status ? <p className="text-xs text-teks-sekunder">{status}</p> : null}
    </div>
  );
}