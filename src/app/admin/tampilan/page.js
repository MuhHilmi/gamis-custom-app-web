import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeLandingConfig, DEFAULT_LANDING_CONFIG } from "@/lib/landing-config";
import LandingSettingsForm from "@/components/admin/LandingSettingsForm";

export default async function AdminLandingPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const { data: row } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "landing")
    .maybeSingle();

  const config = normalizeLandingConfig(row?.value || DEFAULT_LANDING_CONFIG);

  return <LandingSettingsForm config={config} />;
}
