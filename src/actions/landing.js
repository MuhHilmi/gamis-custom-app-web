"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeLandingConfig } from "@/lib/landing-config";
import { normalizeWaPhone } from "@/lib/whatsapp";

function value(formData, name) {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw : "";
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
      images: [
        value(formData, "heroImage1Url") || null,
        value(formData, "heroImage2Url") || null,
        value(formData, "heroImage3Url") || null,
      ],
    },
    catalog: {
      title: value(formData, "catalogTitle"),
      showCategoryFilter: formData.get("catalogShowCategoryFilter") === "on",
      limit: value(formData, "catalogLimit"),
      sort: value(formData, "catalogSort"),
    },
    why: {
      title: value(formData, "whyTitle"),
      subtitle: value(formData, "whySubtitle"),
      imageUrl: value(formData, "whyImageUrl") || null,
    },
    howToOrder: {
      enabled: formData.get("howToOrderEnabled") === "on",
      title: value(formData, "howToOrderTitle"),
      subtitle: value(formData, "howToOrderSubtitle"),
      steps: [
        { t: value(formData, "step1Title"), d: value(formData, "step1Text") },
        { t: value(formData, "step2Title"), d: value(formData, "step2Text") },
        { t: value(formData, "step3Title"), d: value(formData, "step3Text") },
      ],
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
