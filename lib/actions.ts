"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { DEFAULT_SETTINGS, type DogSex, type DogStatus, type MediaCategory, type MediaType, type SiteContentKey, type SiteSettings } from "@/lib/types";

async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) {
    return { supabase: null, error: "Supabase n’est pas encore configuré." as const };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase: null, error: "Vous devez être connecté." as const };
  }
  return { supabase, error: null };
}

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) {
    return { error: "Supabase n’est pas encore configuré. Renseignez le fichier .env.local." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "L’adresse e-mail ou le mot de passe est incorrect." };
  }

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

export type DogFormState = { error?: string; success?: string; id?: string };

export async function saveDogAction(
  _prev: DogFormState,
  formData: FormData,
): Promise<DogFormState> {
  const { supabase, error } = await requireAdmin();
  if (!supabase) return { error: error ?? "Les modifications n’ont pas pu être enregistrées." };

  const id = emptyToNull(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Le prénom est obligatoire." };

  let slug = String(formData.get("slug") ?? "").trim() || slugify(name);
  if (!slug) return { error: "Le slug est obligatoire." };

  const payload = {
    name,
    slug,
    sex: (emptyToNull(formData.get("sex")) as DogSex | null) ?? "unknown",
    birth_date: emptyToNull(formData.get("birth_date")),
    birth_date_approximate: formData.get("birth_date_approximate") === "on",
    status: (emptyToNull(formData.get("status")) as DogStatus | null) ?? "available",
    adoption_date: emptyToNull(formData.get("adoption_date")),
    current_location: emptyToNull(formData.get("current_location")),
    estimated_size: emptyToNull(formData.get("estimated_size")),
    estimated_weight: emptyToNull(formData.get("estimated_weight")),
    short_summary: emptyToNull(formData.get("short_summary")),
    story: emptyToNull(formData.get("story")),
    is_vaccinated: formData.get("is_vaccinated") === "on",
    is_dewormed: formData.get("is_dewormed") === "on",
    is_identified: formData.get("is_identified") === "on",
    is_parasite_treated: formData.get("is_parasite_treated") === "on",
    additional_info: emptyToNull(formData.get("additional_info")),
    main_photo_id: emptyToNull(formData.get("main_photo_id")),
    sort_order: Number(formData.get("sort_order") || 0),
    published: formData.get("published") === "on",
  };

  if (id) {
    const { error: updateError } = await supabase.from("dogs").update(payload).eq("id", id);
    if (updateError) {
      if (updateError.code === "23505") {
        return { error: "Ce slug est déjà utilisé par un autre chien." };
      }
      return { error: "Les modifications n’ont pas pu être enregistrées." };
    }
    revalidatePublic();
    return { success: "Les modifications ont été enregistrées.", id };
  }

  const { data, error: insertError } = await supabase
    .from("dogs")
    .insert(payload)
    .select("id")
    .single();

  if (insertError || !data) {
    if (insertError?.code === "23505") {
      return { error: "Ce slug est déjà utilisé par un autre chien." };
    }
    return { error: "Les modifications n’ont pas pu être enregistrées." };
  }

  revalidatePublic();
  redirect(`/admin/chiens/${data.id}`);
}

export async function deleteDogAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: media } = await supabase.from("media").select("id, storage_path").eq("dog_id", id);

  await supabase.from("dogs").update({ main_photo_id: null }).eq("id", id);

  if (media?.length) {
    const paths = media
      .map((item) => item.storage_path)
      .filter((path): path is string => Boolean(path));
    if (paths.length) {
      await supabase.storage.from("dog-media").remove(paths);
    }
    await supabase.from("media").delete().eq("dog_id", id);
  }

  const { error: deleteError } = await supabase.from("dogs").delete().eq("id", id);
  if (deleteError) return;

  revalidatePublic();
  redirect("/admin/chiens");
}

export async function saveContentAction(formData: FormData) {
  const { supabase, error } = await requireAdmin();
  if (!supabase) return { error: error ?? "Les modifications n’ont pas pu être enregistrées." };

  const keys: SiteContentKey[] = [
    "hero_title",
    "hero_slogan",
    "hero_intro",
    "home_intro",
    "bianca_section_title",
    "bianca_excerpt",
    "bianca_presentation",
    "help_text",
    "adoption_text",
    "footer_text",
    "adopted_intro",
  ];

  const rows = keys.map((key) => ({
    key,
    value: String(formData.get(key) ?? ""),
  }));

  const { error: upsertError } = await supabase.from("site_content").upsert(rows);
  if (upsertError) {
    return { error: "Les modifications n’ont pas pu être enregistrées." };
  }

  revalidatePublic();
  return { success: "Les textes ont été enregistrés." };
}

export async function saveSettingsAction(formData: FormData) {
  const { supabase, error } = await requireAdmin();
  if (!supabase) return { error: error ?? "Les modifications n’ont pas pu être enregistrées." };

  const { data: current } = await supabase
    .from("site_settings")
    .select("data")
    .eq("id", 1)
    .maybeSingle();

  const next: SiteSettings = {
    ...DEFAULT_SETTINGS,
    ...((current?.data as SiteSettings) ?? {}),
    associationName: String(formData.get("associationName") ?? "").trim(),
    slogan: String(formData.get("slogan") ?? "").trim(),
    logoPath: emptyToNull(formData.get("logoPath")),
    heroMediaId: emptyToNull(formData.get("heroMediaId")),
    biancaPhotoId: emptyToNull(formData.get("biancaPhotoId")),
    email: emptyToNull(formData.get("email")),
    facebookUrl: emptyToNull(formData.get("facebookUrl")),
    instagramUrl: emptyToNull(formData.get("instagramUrl")),
    partnerAssociationName: String(formData.get("partnerAssociationName") ?? "").trim(),
    adoptionFormUrl: emptyToNull(formData.get("adoptionFormUrl")),
    donationUrl: emptyToNull(formData.get("donationUrl")),
    donationsActive: formData.get("donationsActive") === "on",
    sponsorshipUrl: emptyToNull(formData.get("sponsorshipUrl")),
    sponsorshipActive: formData.get("sponsorshipActive") === "on",
    supportUrl: emptyToNull(formData.get("supportUrl")),
    supportActive: formData.get("supportActive") === "on",
    donationButtonText:
      String(formData.get("donationButtonText") ?? "").trim() || "Faire un don",
    sponsorshipButtonText:
      String(formData.get("sponsorshipButtonText") ?? "").trim() ||
      "Parrainer / aider un protégé",
    supportButtonText:
      String(formData.get("supportButtonText") ?? "").trim() || "Soutenir l’association",
    adoptionLegalText: String(formData.get("adoptionLegalText") ?? "").trim(),
    rna: String(formData.get("rna") ?? "").trim(),
    maxPhotoSizeMb: Number(formData.get("maxPhotoSizeMb") || 10),
    maxVideoSizeMb: Number(formData.get("maxVideoSizeMb") || 80),
  };

  const { error: upsertError } = await supabase
    .from("site_settings")
    .upsert({ id: 1, data: next });

  if (upsertError) {
    return { error: "Les modifications n’ont pas pu être enregistrées." };
  }

  revalidatePublic();
  return { success: "Les paramètres ont été enregistrés." };
}

export async function saveMediaMetaAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const caption = emptyToNull(formData.get("caption"));
  const category = (emptyToNull(formData.get("category")) as MediaCategory | null) ?? "other";
  const dogId = emptyToNull(formData.get("dog_id"));
  const sortOrder = Number(formData.get("sort_order") || 0);

  const { error: updateError } = await supabase
    .from("media")
    .update({
      caption,
      category,
      dog_id: dogId,
      sort_order: sortOrder,
    })
    .eq("id", id);

  if (updateError) return;
  revalidatePublic();
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const { data: item } = await supabase
    .from("media")
    .select("id, storage_path, dog_id")
    .eq("id", id)
    .maybeSingle();

  if (!item) return;

  await supabase.from("dogs").update({ main_photo_id: null }).eq("main_photo_id", id);

  if (item.storage_path) {
    await supabase.storage.from("dog-media").remove([item.storage_path]);
  }

  const { error: deleteError } = await supabase.from("media").delete().eq("id", id);
  if (deleteError) return;

  revalidatePublic();
}

export async function setMainPhotoAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!supabase) return;

  const dogId = String(formData.get("dog_id") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const { error: updateError } = await supabase
    .from("dogs")
    .update({ main_photo_id: mediaId })
    .eq("id", dogId);

  if (updateError) return;
  revalidatePublic();
}

export async function reorderDogMediaAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!supabase) return;

  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const dogId = String(formData.get("dog_id") ?? "");

  const { data: items } = await supabase
    .from("media")
    .select("id, sort_order")
    .eq("dog_id", dogId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!items?.length) return;

  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return;

  const current = items[index];
  const other = items[target];
  await supabase.from("media").update({ sort_order: target }).eq("id", current.id);
  await supabase.from("media").update({ sort_order: index }).eq("id", other.id);

  revalidatePublic();
}

export async function createExternalVideoAction(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  if (!supabase) return;

  const url = String(formData.get("external_url") ?? "").trim();
  if (!url) return;

  const payload = {
    media_type: "video" as MediaType,
    external_url: url,
    storage_path: null,
    caption: emptyToNull(formData.get("caption")),
    category: (emptyToNull(formData.get("category")) as MediaCategory | null) ?? "other",
    dog_id: emptyToNull(formData.get("dog_id")),
    sort_order: Number(formData.get("sort_order") || 0),
    published: true,
  };

  const { error: insertError } = await supabase.from("media").insert(payload);
  if (insertError) return;

  revalidatePublic();
}

function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/nos-proteges");
  revalidatePath("/adoptes");
  revalidatePath("/bianca");
  revalidatePath("/nous-aider");
  revalidatePath("/admin");
  revalidatePath("/admin/chiens");
  revalidatePath("/admin/medias");
  revalidatePath("/admin/contenus");
  revalidatePath("/admin/parametres");
}
