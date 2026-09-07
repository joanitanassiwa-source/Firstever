"use client";

type Row = { name: string; email: string; organization: string; category: string; sessions: number; registered: string };

const HEADERS = ["Name", "Email", "Organization", "Category", "Sessions booked", "Registered"];

/** RFC 4180 escaping: wrap in quotes and double any embedded quote. */
function cell(value: string | number) {
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function ExportCsvButton({ rows }: { rows: Row[] }) {
  function download() {
    const csv = [
      HEADERS.join(","),
      ...rows.map((r) => [r.name, r.email, r.organization, r.category, r.sessions, r.registered].map(cell).join(",")),
    ].join("\r\n");

    // Prefixed with a BOM so Excel opens UTF-8 names correctly.
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avc2026-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="abtn abtn--primary" onClick={download} disabled={rows.length === 0}>
      Export CSV ({rows.length})
    </button>
  );
}
