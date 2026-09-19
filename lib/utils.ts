import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/types";

export const PHOTO_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
export const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"] as const;

export const PHOTO_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
export const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"] as const;

export function mergeSettings(data: unknown): SiteSettings {
  if (!data || typeof data !== "object") return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(data as Partial<SiteSettings>) };
}

export { isSupabaseConfigured } from "@/lib/supabase/env";

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatDateFr(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatBirthDate(
  value: string | null | undefined,
  approximate: boolean,
) {
  const formatted = formatDateFr(value);
  if (!formatted) return null;
  return approximate ? `vers le ${formatted}` : formatted;
}

export function sexLabel(sex: string) {
  if (sex === "male") return "Mâle";
  if (sex === "female") return "Femelle";
  return null;
}

export function statusLabel(status: string) {
  switch (status) {
    case "available":
      return "À l’adoption";
    case "reserved":
      return "Réservé";
    case "adopted":
      return "Adopté";
    case "unpublished":
      return "Non publié";
    default:
      return null;
  }
}

export function triStateLabel(value: string) {
  if (value === "yes") return "Oui";
  if (value === "no") return "Non";
  return null;
}

export function interpolatePartner(text: string, partnerName: string) {
  return text.replaceAll("{partner}", partnerName);
}

export function fileExtension(name: string) {
  const match = name.toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}

export function isPhotoFile(file: File) {
  if ((PHOTO_MIME as readonly string[]).includes(file.type)) return true;
  return (PHOTO_EXTENSIONS as readonly string[]).includes(
    fileExtension(file.name),
  );
}

export function isVideoFile(file: File) {
  if ((VIDEO_MIME as readonly string[]).includes(file.type)) return true;
  return (VIDEO_EXTENSIONS as readonly string[]).includes(
    fileExtension(file.name),
  );
}

export function validateMediaFile(
  file: File,
  kind: "photo" | "video",
  maxMb: number,
) {
  const okType = kind === "photo" ? isPhotoFile(file) : isVideoFile(file);
  if (!okType) {
    return kind === "photo"
      ? "Ce format d’image n’est pas accepté. Utilisez JPG, PNG ou WebP."
      : "Ce format de vidéo n’est pas accepté. Utilisez MP4, WebM ou MOV.";
  }
  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return kind === "photo"
      ? "Cette image est trop volumineuse."
      : "Cette vidéo dépasse la taille autorisée.";
  }
  return null;
}

export function traitsFromSummary(summary: string | null | undefined) {
  if (!summary) return [];
  return summary
    .split(/[,\n•]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
