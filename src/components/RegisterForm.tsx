"use client";

import { useActionState } from "react";
import { registerAction, type FormState } from "@/app/actions";
import { CATEGORIES } from "@/lib/categories";
import "./forms.css";

const initial: FormState = { ok: false };

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);

  if (state.ok) {
    return (
      <div className="form-confirm" role="status">
        <span className="dot-ring" aria-hidden="true" />
        <h3 className="form-confirm__title">Check your email to access your dashboard.</h3>
        <p className="form-confirm__body">
          We've sent a confirmation to <strong>{state.email}</strong> with a secure link to your
          personal delegate dashboard, where you can build your schedule for the week.
        </p>
        <p className="form-confirm__note">
          The link expires in 24 hours. If it doesn't arrive, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="form" noValidate>
      {state.message && <p className="form__error" role="alert">{state.message}</p>}

      <div className="form__row">
        <label className="form__field">
          <span className="form__label">Full name</span>
          <input
            name="name" type="text" required autoComplete="name" maxLength={120}
            aria-invalid={Boolean(state.fieldErrors?.name)}
            className={state.fieldErrors?.name ? "is-invalid" : ""}
          />
          {state.fieldErrors?.name && <span className="form__hint">{state.fieldErrors.name}</span>}
        </label>

        <label className="form__field">
          <span className="form__label">Email address</span>
          <input
            name="email" type="email" required autoComplete="email" maxLength={200}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            className={state.fieldErrors?.email ? "is-invalid" : ""}
          />
          {state.fieldErrors?.email && <span className="form__hint">{state.fieldErrors.email}</span>}
        </label>
      </div>

      <div className="form__row">
        <label className="form__field">
          <span className="form__label">Organization</span>
          <input
            name="organization" type="text" required autoComplete="organization" maxLength={200}
            aria-invalid={Boolean(state.fieldErrors?.organization)}
            className={state.fieldErrors?.organization ? "is-invalid" : ""}
          />
          {state.fieldErrors?.organization && <span className="form__hint">{state.fieldErrors.organization}</span>}
        </label>

        <label className="form__field">
          <span className="form__label">Registration category</span>
          <select name="registrationCategory" required defaultValue="DELEGATE">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="btn btn--gold" disabled={pending}>
        {pending ? "Sending confirmation…" : "Register your interest"}
      </button>
    </form>
  );
}
