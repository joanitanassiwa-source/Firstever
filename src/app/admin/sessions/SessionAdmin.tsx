"use client";

import { useActionState, useState } from "react";
import { saveSession, deleteSession, type AdminState } from "../actions";
import { SESSION_TYPE_LABEL, DAY_LABEL } from "@/lib/categories";
import "@/components/forms.css";

export type SessionRow = {
  id: string; day: number; time: string; title: string; description: string;
  type: string; capacity: number | null; order: number; rsvpCount: number;
};

const initial: AdminState = { ok: false };
const TYPES = ["PLENARY", "BREAKOUT", "WORKSHOP", "MARKETPLACE", "NETWORKING", "CEREMONY"];

export function SessionAdmin({ sessions }: { sessions: SessionRow[] }) {
  const [editing, setEditing] = useState<SessionRow | null>(null);
  const [adding, setAdding] = useState(false);
  const [saveState, saveAction, saving] = useActionState(saveSession, initial);
  const [delState, delAction, deleting] = useActionState(deleteSession, initial);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const open = adding || editing !== null;
  const msg = saveState.message ?? delState.message;
  const isError = (saveState.message && !saveState.ok) || (delState.message && !delState.ok);

  return (
    <>
      {msg && <p className={`aform__msg${isError ? " aform__msg--err" : ""}`} role="status">{msg}</p>}

      <section className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 22, flexWrap: "wrap" }}>
          <h2 className="panel__title" style={{ margin: 0 }}>Programme ({sessions.length})</h2>
          {!open && (
            <button type="button" className="abtn abtn--primary" onClick={() => { setEditing(null); setAdding(true); }}>
              Add session
            </button>
          )}
        </div>

        {open && (
          <form action={saveAction} className="form form--light" style={{ maxWidth: "none", marginBottom: 30, paddingBottom: 30, borderBottom: "1px solid var(--line-light)" }}>
            {editing && <input type="hidden" name="id" value={editing.id} />}
            <div className="aform__grid">
              <label className="form__field">
                <span className="form__label">Day</span>
                <select name="day" defaultValue={String(editing?.day ?? 0)} required>
                  {[0, 1, 2, 3, 4].map((d) => <option key={d} value={d}>{DAY_LABEL[d]}</option>)}
                </select>
              </label>
              <label className="form__field">
                <span className="form__label">Time</span>
                <input name="time" defaultValue={editing?.time ?? ""} required maxLength={60} placeholder="09:00–10:30" />
              </label>
              <label className="form__field aform__full">
                <span className="form__label">Title</span>
                <input name="title" defaultValue={editing?.title ?? ""} required maxLength={200} />
              </label>
              <label className="form__field aform__full">
                <span className="form__label">Description</span>
                <textarea name="description" defaultValue={editing?.description ?? ""} required rows={3} maxLength={2000} />
              </label>
              <label className="form__field">
                <span className="form__label">Type</span>
                <select name="type" defaultValue={editing?.type ?? "PLENARY"} required>
                  {TYPES.map((t) => <option key={t} value={t}>{SESSION_TYPE_LABEL[t]}</option>)}
                </select>
              </label>
              <label className="form__field">
                <span className="form__label">Capacity (blank = unlimited)</span>
                <input name="capacity" type="number" min={1} defaultValue={editing?.capacity ?? ""} placeholder="Unlimited" />
                {editing && editing.rsvpCount > 0 && (
                  <span className="form__hint" style={{ color: "var(--grey-text)" }}>
                    {editing.rsvpCount} delegate{editing.rsvpCount === 1 ? " has" : "s have"} already booked this session.
                  </span>
                )}
              </label>
              <label className="form__field">
                <span className="form__label">Display order within the day</span>
                <input name="order" type="number" min={0} max={999} defaultValue={editing?.order ?? sessions.length} required />
              </label>
            </div>
            <div className="aform__actions">
              <button type="submit" className="abtn abtn--primary" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Add session"}
              </button>
              <button type="button" className="abtn" onClick={() => { setAdding(false); setEditing(null); }}>Cancel</button>
            </div>
          </form>
        )}

        <div className="atable__scroll">
          <table className="atable">
            <thead>
              <tr><th>Day</th><th>Time</th><th>Session</th><th>Type</th><th>Booked</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id}>
                  <td>{DAY_LABEL[s.day]}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.time}</td>
                  <td className="atable__strong" style={{ maxWidth: 340 }}>{s.title}</td>
                  <td>{SESSION_TYPE_LABEL[s.type]}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {s.rsvpCount}{s.capacity === null ? " / ∞" : ` / ${s.capacity}`}
                  </td>
                  <td>
                    <div className="arow-actions">
                      <button type="button" className="abtn" onClick={() => { setAdding(false); setEditing(s); }}>Edit</button>
                      {confirmId === s.id ? (
                        <form action={delAction} style={{ display: "flex", gap: 8 }}>
                          <input type="hidden" name="id" value={s.id} />
                          <button type="submit" className="abtn abtn--danger" disabled={deleting}>
                            {deleting ? "Deleting…" : `Confirm${s.rsvpCount ? ` (drops ${s.rsvpCount} RSVP${s.rsvpCount === 1 ? "" : "s"})` : ""}`}
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
