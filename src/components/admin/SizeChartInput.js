"use client";

import { useState } from "react";

const DEFAULT_COLUMNS = [
  { key: "ukuran", label: "Ukuran", type: "text", placeholder: "Contoh: S, M, L, XL" },
  { key: "lingkar_dada_cm", label: "Lingkar Dada (cm)", type: "number", placeholder: "100", min: 0 },
  { key: "lingkar_pinggang_cm", label: "Lingkar Pinggang (cm)", type: "number", placeholder: "90", min: 0 },
  { key: "panjang_badan_cm", label: "Panjang Badan (cm)", type: "number", placeholder: "75", min: 0 },
  { key: "panjang_lengan_cm", label: "Panjang Lengan (cm)", type: "number", placeholder: "55", min: 0 },
  { key: "lingkar_leher_cm", label: "Lingkar Leher (cm)", type: "number", placeholder: "40", min: 0 },
];

export default function SizeChartInput({ name = "sizeChart", initialData = [] }) {
  const [rows, setRows] = useState(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      return initialData.map((row) => ({
        ...Object.fromEntries(DEFAULT_COLUMNS.map((c) => [c.key, ""])),
        ...row,
      }));
    }
    return [Object.fromEntries(DEFAULT_COLUMNS.map((c) => [c.key, ""]))];
  });

  function updateRow(index, key, value) {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, Object.fromEntries(DEFAULT_COLUMNS.map((c) => [c.key, ""]))]);
  }

  function removeRow(index) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  function moveRow(index, direction) {
    setRows((prev) => {
      const newRows = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newRows.length) return prev;
      [newRows[index], newRows[targetIndex]] = [newRows[targetIndex], newRows[index]];
      return newRows;
    });
  }

  const validRows = rows.filter((row) => row.ukuran && String(row.ukuran).trim());

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zaitun/5 text-left">
              <th className="w-8 px-2 py-1 font-medium text-center">#</th>
              {DEFAULT_COLUMNS.map((col) => (
                <th key={col.key} className="px-2 py-1 font-medium">
                  {col.label}
                </th>
              ))}
              <th className="w-24 px-2 py-1 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-garis">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-zaitun/5">
                <td className="px-2 py-1 text-center text-teks-sekunder">{index + 1}</td>
                {DEFAULT_COLUMNS.map((col) => (
                  <td key={col.key} className="px-2 py-1">
                    <input
                      type={col.type}
                      name={`${name}[${index}][${col.key}]`}
                      value={row[col.key] ?? ""}
                      onChange={(e) =>
                        updateRow(index, col.key, col.type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)
                      }
                      placeholder={col.placeholder}
                      min={col.min}
                      className="w-full min-h-10 rounded-lg border border-garis-input bg-putih px-2 py-1.5 text-sm"
                    />
                  </td>
                ))}
                <td className="px-2 py-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveRow(index, -1)}
                        className="p-1 text-teks-sekunder hover:text-zaitun"
                        title="Naikkan"
                      >
                        ▲
                      </button>
                    )}
                    {index < rows.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveRow(index, 1)}
                        className="p-1 text-teks-sekunder hover:text-zaitun"
                        title="Turunkan"
                      >
                        ▼
                      </button>
                    )}
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="p-1 text-merah hover:opacity-70"
                        title="Hapus baris"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 rounded-lg border border-garis-input bg-zaitun text-krem hover:bg-zaitun-hover px-3 py-2 text-sm font-medium"
        >
          <span className="text-lg leading-none">+</span> Tambah ukuran
        </button>
        {validRows.length > 0 && (
          <span className="text-xs text-teks-sekunder">
            {validRows.length} ukuran valid (baris dengan ukuran kosong tidak disimpan)
          </span>
        )}
      </div>

      <p className="text-xs text-teks-sekunder">
        Isi minimal kolom <strong>Ukuran</strong>. Kolom angka boleh dikosongkan. Data dikirim sebagai array JSON ke server.
      </p>
    </div>
  );
}