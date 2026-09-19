"use client";

import { useActionState } from "react";
import { saveContentAction } from "@/lib/actions";
import { CONTENT_LABELS, type SiteContent, type SiteContentKey } from "@/lib/types";

const fields: Array<{ key: SiteContentKey; rows?: number }> = [
  { key: "hero_title" },
  { key: "hero_slogan" },
  { key: "hero_intro", rows: 4 },
  { key: "home_intro", rows: 6 },
  { key: "bianca_section_title" },
  { key: "bianca_excerpt", rows: 4 },
  { key: "bianca_presentation", rows: 18 },
  { key: "help_text", rows: 5 },
  { key: "adoption_text", rows: 4 },
  { key: "adopted_intro", rows: 4 },
  { key: "footer_text", rows: 3 },
];

export function ContentForm({ content }: { content: SiteContent }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string; success?: string } | null, formData: FormData) => {
      return saveContentAction(formData);
    },
    null,
  );

  return (
    <form action={action} className="space-y-5">
      {fields.map((field) => (
        <div key={field.key} className="photo-frame rounded-2xl p-5">
          <label className="admin-label" htmlFor={field.key}>
            {CONTENT_LABELS[field.key]}
          </label>
          {field.rows ? (
            <textarea
              id={field.key}
              name={field.key}
              rows={field.rows}
              className="admin-textarea"
              defaultValue={content[field.key]}
            />
          ) : (
            <input
              id={field.key}
              name={field.key}
              className="admin-input"
              defaultValue={content[field.key]}
            />
          )}
        </div>
      ))}
      {state?.error ? (
        <p className="text-sm text-[var(--danger)]" role="alert">
          {state.error}
        </p>
      ) : null}
      {state?.success ? <p className="text-sm text-[var(--ok)]">{state.success}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer les textes"}
      </button>
    </form>
  );
}
