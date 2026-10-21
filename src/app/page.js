import { createPublicClient } from "@/lib/supabase/public";
import { DEFAULT_LANDING_CONFIG, normalizeLandingConfig } from "@/lib/landing-config";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import KoleksiTerbaru from "@/components/landing/KoleksiTerbaru";
import PilihModel from "@/components/landing/PilihModel";
import PilihanBulanIni from "@/components/landing/PilihanBulanIni";
import KenapaKami from "@/components/landing/KenapaKami";
import CaraPesan from "@/components/landing/CaraPesan";
import Testimoni from "@/components/landing/Testimoni";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";

export async function generateMetadata() {
  let config = DEFAULT_LANDING_CONFIG;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "landing")
      .maybeSingle();
    config = normalizeLandingConfig(data?.value);
  } catch {
    // fallback default
  }
  return {
    title: config.seo.title,
    description: config.seo.description,
  };
}

export default async function LandingPage() {
  let landing = DEFAULT_LANDING_CONFIG;
  let categories = [];
  let products = [];

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createPublicClient();
      const [{ data: settingsData }, { data: categoriesData }, { data: productsData }] = await Promise.all([
        supabase.from("site_settings").select("value").eq("key", "landing").maybeSingle(),
        supabase.from("categories").select("id, name, slug").eq("is_active", true).order("sort_order", { ascending: true }),
        supabase
          .from("products")
          .select("id, slug, name, base_price, lead_time_days, photos, category_id")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
      ]);

      landing = normalizeLandingConfig(settingsData?.value);
      categories = categoriesData || [];
      products = productsData || [];
    } catch {
      landing = DEFAULT_LANDING_CONFIG;
    }
  }

  return (
    <>
      <Hero
        title={landing.hero.title}
        subtitle={landing.hero.subtitle}
        buttonText={landing.hero.buttonText}
        buttonHref={landing.hero.buttonHref}
        imageUrl={landing.hero.imageUrl}
      />
      <Marquee />
      <KoleksiTerbaru
        title={landing.koleksiTerbaru.title}
        items={landing.koleksiTerbaru.items}
      />
      <PilihModel
        categories={categories}
        products={products}
      />
      <PilihanBulanIni
        title={landing.pilihanBulanIni.title}
        subtitle={landing.pilihanBulanIni.subtitle}
        productName={landing.pilihanBulanIni.productName}
        description={landing.pilihanBulanIni.description}
        price={landing.pilihanBulanIni.price}
        buttonText={landing.pilihanBulanIni.buttonText}
        buttonHref={landing.pilihanBulanIni.buttonHref}
        imageUrl={landing.pilihanBulanIni.imageUrl}
        stats={landing.pilihanBulanIni.stats}
      />
      <KenapaKami
        title={landing.kenapa.title}
        subtitle={landing.kenapa.subtitle}
        items={landing.kenapa.items}
        imageUrl={landing.kenapa.imageUrl}
      />
      <CaraPesan
        enabled={landing.caraPesan.enabled}
        title={landing.caraPesan.title}
        steps={landing.caraPesan.steps}
      />
      <Testimoni
        title={landing.testimoni.title}
        items={landing.testimoni.items}
      />
      <FAQ
        title={landing.faq.title}
        subtitle={landing.faq.subtitle}
        items={landing.faq.items}
      />
      <CTA
        title={landing.cta.title}
        subtitle={landing.cta.subtitle}
        buttonText={landing.cta.buttonText}
        buttonHref={landing.cta.buttonHref}
        waButtonText={landing.cta.waButtonText}
      />
    </>
  );
}