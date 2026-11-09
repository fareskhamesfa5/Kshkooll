// حارس صفحات Koshkool — يعتمد على جلسة Supabase الحقيقية.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase-config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export async function requireUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    window.location.href = "../auth/login.html";
    return null;
  }
  return user;
}

export async function getMyProfile(user) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, username, role, created_at")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error("Profile read error:", error);
    return null;
  }
  return data;
}

export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "../auth/login.html";
}
