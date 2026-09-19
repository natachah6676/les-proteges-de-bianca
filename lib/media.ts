const SUPABASE_HOST =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^https?:\/\//, "") ?? "";

export function publicMediaUrl(
  storagePath: string | null | undefined,
  bucket: "dog-media" | "site-media" = "dog-media",
) {
  if (!storagePath) return null;
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/${bucket}/${storagePath}`;
}

export function siteMediaUrl(storagePath: string | null | undefined) {
  if (!storagePath) return null;
  if (storagePath.startsWith("site-media/")) {
    return publicMediaUrl(storagePath.replace(/^site-media\//, ""), "site-media");
  }
  if (storagePath.startsWith("dog-media/")) {
    return publicMediaUrl(storagePath.replace(/^dog-media\//, ""), "dog-media");
  }
  if (storagePath.includes("/")) {
    return publicMediaUrl(storagePath, "site-media");
  }
  return publicMediaUrl(storagePath, "site-media");
}

export function mediaPublicUrl(item: {
  storage_path: string | null;
  external_url: string | null;
}) {
  if (item.storage_path) {
    return publicMediaUrl(item.storage_path, "dog-media");
  }
  return item.external_url;
}

export function youtubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace("/", "") || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      return parsed.searchParams.get("v");
    }
  } catch {
    return null;
  }
  return null;
}

export function vimeoId(url: string) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("vimeo.com")) return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[0] ?? null;
  } catch {
    return null;
  }
}

export function isExternalVideoPage(url: string) {
  return Boolean(youtubeId(url) || vimeoId(url));
}

export function imageAlt(
  caption: string | null | undefined,
  fallback: string,
) {
  const trimmed = caption?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export { SUPABASE_HOST };
