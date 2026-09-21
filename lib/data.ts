import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  DEFAULT_CONTENT,
  DEFAULT_SETTINGS,
  type Dog,
  type DogWithMedia,
  type Media,
  type SiteContent,
  type SiteContentKey,
  type SiteSettings,
} from "@/lib/types";
import { imageAlt, mediaPublicUrl, siteMediaUrl } from "@/lib/media";
import { mergeSettings } from "@/lib/utils";

export async function getSettings(): Promise<SiteSettings> {
  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_SETTINGS;

  const { data, error } = await supabase
    .from("site_settings")
    .select("data")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return DEFAULT_SETTINGS;
  return mergeSettings(data.data);
}

export async function getContent(): Promise<SiteContent> {
  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_CONTENT;

  const { data, error } = await supabase.from("site_content").select("key, value");
  if (error || !data) return DEFAULT_CONTENT;

  const mapped = { ...DEFAULT_CONTENT };
  for (const row of data) {
    if (row.key in mapped) {
      mapped[row.key as SiteContentKey] = row.value ?? "";
    }
  }
  return mapped;
}

export async function getBiancaHomePhoto(settings: SiteSettings) {
  const fromPath = siteMediaUrl(settings.biancaPhotoPath);
  if (fromPath) {
    return { url: fromPath, alt: "Bianca" };
  }

  const item = await getMediaById(settings.biancaPhotoId);
  const url = item ? mediaPublicUrl(item) : null;
  if (!url) return null;
  return { url, alt: imageAlt(item?.caption, "Bianca") };
}

export async function getMediaById(id: string | null | undefined) {
  if (!id) return null;
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data } = await supabase.from("media").select("*").eq("id", id).maybeSingle();
  return (data as Media | null) ?? null;
}

export function attachDogMedia(dog: Dog, media: Media[]): DogWithMedia {
  const photos = media.filter((item) => item.media_type === "photo");
  const mainPhoto =
    photos.find((item) => item.id === dog.main_photo_id) ?? photos[0] ?? null;
  return { ...dog, media, mainPhoto };
}

export async function getPublishedDogs(options?: {
  statuses?: Dog["status"][];
  sex?: "male" | "female";
  limit?: number;
}): Promise<DogWithMedia[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("dogs")
    .select("*")
    .eq("published", true)
    .neq("status", "unpublished")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (options?.statuses?.length) {
    query = query.in("status", options.statuses);
  }
  if (options?.sex) {
    query = query.eq("sex", options.sex);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: dogs, error } = await query;
  if (error || !dogs?.length) return [];

  const ids = dogs.map((dog) => dog.id);
  const { data: media } = await supabase
    .from("media")
    .select("*")
    .in("dog_id", ids)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const mediaByDog = new Map<string, Media[]>();
  for (const item of (media as Media[] | null) ?? []) {
    if (!item.dog_id) continue;
    const list = mediaByDog.get(item.dog_id) ?? [];
    list.push(item);
    mediaByDog.set(item.dog_id, list);
  }

  return (dogs as Dog[]).map((dog) =>
    attachDogMedia(dog, mediaByDog.get(dog.id) ?? []),
  );
}

export async function getDogBySlug(
  slug: string,
  { includeUnpublished = false } = {},
): Promise<DogWithMedia | null> {
  const supabase = includeUnpublished ? await createClient() : createPublicClient();
  if (!supabase) return null;

  let query = supabase.from("dogs").select("*").eq("slug", slug);
  if (!includeUnpublished) {
    query = query.eq("published", true).neq("status", "unpublished");
  }

  const { data: dog } = await query.maybeSingle();
  if (!dog) return null;

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("dog_id", dog.id)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return attachDogMedia(dog as Dog, (media as Media[] | null) ?? []);
}

export async function getRecentLifestyleMedia(limit = 8): Promise<Media[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("media")
    .select("*")
    .in("category", ["daily", "bianca"])
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data as Media[] | null) ?? [];
}

export async function getBiancaMedia(): Promise<Media[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("media")
    .select("*")
    .in("category", ["bianca", "daily"])
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (data as Media[] | null) ?? [];
}

export async function getAdminDogs(): Promise<Dog[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("dogs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (data as Dog[] | null) ?? [];
}

export async function getAdminDog(id: string): Promise<DogWithMedia | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: dog } = await supabase.from("dogs").select("*").eq("id", id).maybeSingle();
  if (!dog) return null;

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("dog_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return attachDogMedia(dog as Dog, (media as Media[] | null) ?? []);
}

export async function getAdminMedia(): Promise<(Media & { dog_name?: string | null })[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("media")
    .select("*, dogs(name)")
    .order("created_at", { ascending: false });

  return (
    (data as Array<Media & { dogs: { name: string } | null }> | null)?.map((row) => ({
      ...row,
      dog_name: row.dogs?.name ?? null,
    })) ?? []
  );
}
