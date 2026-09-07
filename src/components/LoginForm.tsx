"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/actions";
import "./forms.css";

const initial: FormState = { ok: false };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  if (state.ok) {
    return (
      <div className="form-confirm" role="status">
        <span className="dot-ring" aria-hidden="true" />
        <h3 className="form-confirm__title">Check your email.</h3>
        <p className="form-confirm__body">
          If <strong>{state.email}</strong> is registered, a secure sign-in link is on its way.
        </p>
        <p className="form-confirm__note">The link expires in 24 hours and can only be used once.</p>
      </div>
    );
  }

  return (
    <form action={action} className="form" noValidate>
      {state.message && <p className="form__error" role="alert">{state.message}</p>}
      <label className="form__field">
        <span className="form__label">Email address</span>
        <input name="email" type="email" required autoComplete="email" autoFocus maxLength={200} />
      </label>
      <button type="submit" className="btn btn--gold" style={{ marginTop: 24 }} disabled={pending}>
        {pending ? "Sending link…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
