"use client";

import { useActionState } from "react";
import { saveContent, type AdminState } from "../actions";
import "@/components/forms.css";

export type ContentRow = { key: string; value: string; label: string; group: string; multiline: boolean };

const initial: AdminState = { ok: false };

function ContentField({ row }: { row: ContentRow }) {
  const [state, action, saving] = useActionState(saveContent, initial);

  return (
    <form action={action} className="form form--light content-item" style={{ maxWidth: "none" }}>
      <input type="hidden" name="key" value={row.key} />
      <label className="form__field">
        <span className="content-item__label">{row.label}</span>
        <span className="content-item__key">{row.key}</span>
        {row.multiline ? (
          <textarea name="value" defaultValue={row.value} rows={3} maxLength={5000} />
        ) : (
          <input name="value" defaultValue={row.value} maxLength={5000} />
        )}
      </label>
      <div className="aform__actions" style={{ marginTop: 12 }}>
        <button type="submit" className="abtn" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
        {state.message && (
          <span style={{ fontSize: 12.5, color: state.ok ? "var(--au-green)" : "var(--au-red)" }} role="status">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

export function ContentAdmin({ groups }: { groups: Array<[string, ContentRow[]]> }) {
  return (
    <section className="panel">
      {groups.map(([group, rows]) => (
        <div key={group}>
          <h2 className="content-group">{group}</h2>
          {rows.map((row) => <ContentField key={row.key} row={row} />)}
        </div>
      ))}
    </section>
  );
}
