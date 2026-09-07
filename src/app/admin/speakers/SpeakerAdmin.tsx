"use client";

import { useActionState, useState } from "react";
import { saveSpeaker, deleteSpeaker, type AdminState } from "../actions";
import "@/components/forms.css";

export type SpeakerRow = {
  id: string; name: string; title: string; bio: string;
  avatarColor: string; initials: string; order: number;
};

const initial: AdminState = { ok: false };
const BRAND_COLORS = ["#B4A269", "#348F41", "#1A5632", "#9F2241"];

export function SpeakerAdmin({ speakers }: { speakers: SpeakerRow[] }) {
  const [editing, setEditing] = useState<SpeakerRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saveState, saveAction, saving] = useActionState(saveSpeaker, initial);
  const [delState, delAction, deleting] = useActionState(deleteSpeaker, initial);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const open = adding || editing !== null;
  const msg = saveState.message ?? delState.message;
  const isError = (saveState.message && !saveState.ok) || (delState.message && !delState.ok);

  function startAdd() { setEditing(null); setAdding(true); }
  function startEdit(s: SpeakerRow) { setAdding(false); setEditing(s); }
  function close() { setAdding(false); setEditing(null); }

  return (
    <>
      {msg && <p className={`aform__msg${isError ? " aform__msg--err" : ""}`} role="status">{msg}</p>}

      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
          <h2 className="panel__title" style={{ margin: 0 }}>Speakers ({speakers.length})</h2>
          {!open && <button type="button" className="abtn abtn--primary" onClick={startAdd}>Add speaker</button>}
        </div>

        {open && (
          <form action={saveAction} className="form form--light" style={{ maxWidth: "none", marginBottom: 30, paddingBottom: 30, borderBottom: "1px solid var(--line-light)" }}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="aform__grid">
              <label className="form__field">
                <span className="form__label">Name</span>
                <input name="name" defaultValue={editing?.name ?? ""} required maxLength={120} />
              </label>
              <label className="form__field">
                <span className="form__label">Title / role</span>
                <input name="title" defaultValue={editing?.title ?? ""} required maxLength={200} />
              </label>
              <label className="form__field aform__full">
                <span className="form__label">Biography</span>
                <textarea name="bio" defaultValue={editing?.bio ?? ""} required rows={4} maxLength={2000} />
              </label>
              <label className="form__field">
                <span className="form__label">Initials (shown in the avatar)</span>
                <input name="initials" defaultValue={editing?.initials ?? ""} required maxLength={3} />
              </label>
              <label className="form__field">
                <span className="form__label">Avatar colour</span>
                <input name="avatarColor" defaultValue={editing?.avatarColor ?? BRAND_COLORS[0]} required pattern="#[0-9a-fA-F]{6}" />
                <span className="form__hint" style={{ color: "var(--grey-text)" }}>
                  Brand palette: {BRAND_COLORS.join("  ·  ")}
                </span>
              </label>
              <label className="form__field">
                <span className="form__label">Display order</span>
                <input name="order" type="number" min={0} max={999} defaultValue={editing?.order ?? speakers.length} required />
              </label>
            </div>
            <div className="aform__actions">
              <button type="submit" className="abtn abtn--primary" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Add speaker"}
              </button>
              <button type="button" className="abtn" onClick={close}>Cancel</button>
            </div>
          </form>
        )}

        <div className="atable__scroll">
          <table className="atable">
            <thead>
              <tr><th>Order</th><th>Speaker</th><th>Title</th><th>Colour</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {speakers.map((s) => (
                <tr key={s.id}>
                  <td>{s.order}</td>
                  <td className="atable__strong">{s.name}</td>
                  <td style={{ maxWidth: 320 }}>{s.title}</td>
                  <td><span className="swatch" style={{ background: s.avatarColor }} aria-hidden="true" />{s.avatarColor}</td>
                  <td>
                    <div className="arow-actions">
                      <button type="button" className="abtn" onClick={() => startEdit(s)}>Edit</button>
                      {confirmId === s.id ? (
                        <form action={delAction} style={{ display: "flex", gap: 8 }}>
                          <input type="hidden" name="id" value={s.id} />
                          <button type="submit" className="abtn abtn--danger" disabled={deleting}>
                            {deleting ? "Deleting…" : "Confirm delete"}
                          </button>
                          <button type="button" className="abtn" onClick={() => setConfirmId(null)}>Cancel</button>
                        </form>
                      ) : (
                        <button type="button" className="abtn abtn--danger" onClick={() => setConfirmId(s.id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
