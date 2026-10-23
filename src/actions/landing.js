"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeLandingConfig } from "@/lib/landing-config";
import { normalizeWaPhone } from "@/lib/whatsapp";

function value(formData, name) {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw : "";
}

function collectItems(formData, prefix, count, fields) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const item = {};
    for (const [key, formKey] of Object.entries(fields)) {
      item[key] = value(formData, `${prefix}${i}${formKey}`);
    }
    items.push(item);
  }
  return items;
}

function collectStats(formData, prefix, count) {
  const stats = [];
  for (let i = 0; i < count; i++) {
    stats.push({
      value: value(formData, `${prefix}${i}Value`),
      label: value(formData, `${prefix}${i}Label`),
    });
  }
  return stats;
}

export async function saveLandingConfig(prevState, formData) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) return { error: "Belum login" };
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || isAdmin !== true) return { error: "Bukan admin" };

  const formConfig = {
    hero: {
      title: value(formData, "heroTitle"),
      subtitle: value(formData, "heroSubtitle"),
      buttonText: value(formData, "heroButtonText"),
      buttonHref: value(formData, "heroButtonHref"),
      imageUrl: value(formData, "heroImageUrl") || null,
    },
    kenapa: {
      title: value(formData, "kenapaTitle"),
      subtitle: value(formData, "kenapaSubtitle"),
      imageUrl: value(formData, "kenapaImageUrl") || null,
      items: collectItems(formData, "kenapaItem", 4, {
        title: "Title",
        text: "Text",
      }),
    },
    caraPesan: {
      enabled: formData.get("caraPesanEnabled") === "on",
      title: value(formData, "caraPesanTitle"),
      steps: [
        { num: "01", title: value(formData, "step1Title"), desc: value(formData, "step1Desc") },
        { num: "02", title: value(formData, "step2Title"), desc: value(formData, "step2Desc") },
        { num: "03", title: value(formData, "step3Title"), desc: value(formData, "step3Desc") },
      ],
    },
    testimoni: {
      title: value(formData, "testimoniTitle"),
      items: collectItems(formData, "testimoniItem", 3, {
        title: "Title",
        text: "Text",
        author: "Author",
        meta: "Meta",
      }),
    },
    faq: {
      title: value(formData, "faqTitle"),
      subtitle: value(formData, "faqSubtitle"),
      items: collectItems(formData, "faqItem", 6, {
        q: "Q",
        a: "A",
      }),
    },
    cta: {
      title: value(formData, "ctaTitle"),
      subtitle: value(formData, "ctaSubtitle"),
      buttonText: value(formData, "ctaButtonText"),
      buttonHref: value(formData, "ctaButtonHref"),
      waButtonText: value(formData, "ctaWaButtonText"),
    },
    koleksiTerbaru: {
      title: value(formData, "koleksiTerbaruTitle"),
      items: [
        {
          imageUrl: value(formData, "koleksiTerbaruItem0ImageUrl") || null,
          caption: value(formData, "koleksiTerbaruItem0Caption"),
          href: value(formData, "koleksiTerbaruItem0Href"),
          tall: value(formData, "koleksiTerbaruItem0Tall") === "true",
        },
        {
          imageUrl: value(formData, "koleksiTerbaruItem1ImageUrl") || null,
          caption: value(formData, "koleksiTerbaruItem1Caption"),
          href: value(formData, "koleksiTerbaruItem1Href"),
          tall: value(formData, "koleksiTerbaruItem1Tall") === "true",
        },
        {
          imageUrl: value(formData, "koleksiTerbaruItem2ImageUrl") || null,
          caption: value(formData, "koleksiTerbaruItem2Caption"),
          href: value(formData, "koleksiTerbaruItem2Href"),
          tall: value(formData, "koleksiTerbaruItem2Tall") === "true",
        },
      ],
    },
    pilihanBulanIni: {
      title: value(formData, "pilihanBulanIniTitle"),
      subtitle: value(formData, "pilihanBulanIniSubtitle"),
      productName: value(formData, "pilihanBulanIniProductName"),
      description: value(formData, "pilihanBulanIniDescription"),
      price: value(formData, "pilihanBulanIniPrice"),
      buttonText: value(formData, "pilihanBulanIniButtonText"),
      buttonHref: value(formData, "pilihanBulanIniButtonHref"),
      imageUrl: value(formData, "pilihanBulanIniImageUrl") || null,
      stats: collectStats(formData, "pilihanBulanIniStat", 3),
    },
    contact: {
      whatsappPhone: normalizeWaPhone(value(formData, "contactPhone")) || null,
      buttonText: value(formData, "contactButtonText"),
      message: value(formData, "contactMessage"),
    },
    seo: {
      title: value(formData, "seoTitle"),
      description: value(formData, "seoDescription"),
    },
  };

  const config = normalizeLandingConfig(formConfig);

  const { error: upsertError } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: "landing",
        value: config,
        updated_by: claimsData.claims.sub ?? null,
      },
      { onConflict: "key" }
    );

  if (upsertError) {
    console.error("[landing] gagal menyimpan:", upsertError.message);
    return { error: "Gagal menyimpan pengaturan. Pastikan migrasi site_settings sudah dijalankan." };
  }

  revalidatePath("/");
  revalidatePath("/admin/tampilan");

  return { ok: true, message: "Pengaturan tampilan disimpan." };
}