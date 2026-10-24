"use client";

import { type FormEvent, useState } from "react";

import { trackedComplaintResponseSchema, trackingCodeSchema } from "../schemas/complaint-schemas";

type TrackingResult = {
  createdAt: string;
  status: "RECEIVED";
  trackingCode: string;
};

export function TrackingForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);

  async function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    const parsedCode = trackingCodeSchema.safeParse(code);

    if (!parsedCode.success) {
      setError(parsedCode.error.issues[0]?.message ?? "Periksa kembali kode pengaduan.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(
        `/api/v1/complaints/${encodeURIComponent(parsedCode.data)}`,
        { cache: "no-store" },
      );
      const payload = await response.json();
      const parsedResult = trackedComplaintResponseSchema.safeParse(payload);

      if (!response.ok || !parsedResult.success) {
        setError(
          response.status === 404
            ? "Kode belum dikenali. Periksa kembali karakter yang kamu masukkan."
            : "Status belum dapat diperiksa. Silakan coba kembali nanti.",
        );
        return;
      }

      setResult(parsedResult.data.data);
    } catch {
      setError("Koneksi tidak tersedia. Periksa jaringanmu lalu coba kembali.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="tracking-panel">
      <form className="tracking-form" onSubmit={track}>
        <label htmlFor="tracking-code">Kode pengaduan</label>
        <div className="tracking-input-group">
          <input
            autoComplete="off"
            id="tracking-code"
            maxLength={64}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Contoh: BK-0123…"
            value={code}
          />
          <button className="button button-light" disabled={isPending} type="submit">
            {isPending ? "Memeriksa…" : "Periksa status"}
          </button>
        </div>
      </form>
      <div aria-live="polite">
        {error ? <p className="tracking-message is-error">{error}</p> : null}
        {result ? (
          <div className="tracking-result">
            <span className="status-dot" />
            <div>
              <small>Status saat ini</small>
              <strong>Pengaduan telah diterima</strong>
              <p>
                Diterima {new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short" }).format(new Date(result.createdAt))}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
