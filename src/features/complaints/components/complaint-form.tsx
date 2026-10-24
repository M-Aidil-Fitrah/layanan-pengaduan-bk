"use client";

import { FormEvent, useState } from "react";

import { complaintCategories, reporterAudiences, urgencyLevels } from "../constants";
import { complaintCreatedResponseSchema, complaintSubmissionSchema } from "../schemas/complaint-schemas";

type FormValues = { audience: string; category: string; consent: boolean; contact: string; details: string; isAnonymous: boolean; name: string; title: string; urgency: string };
const initialValues: FormValues = { audience: "", category: "", consent: false, contact: "", details: "", isAnonymous: false, name: "", title: "", urgency: "" };

export function ComplaintForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");

  function update<Key extends keyof FormValues>(key: Key, value: FormValues[Key]) { setValues((current) => ({ ...current, [key]: value })); }
  function toggleAnonymous() { setValues((current) => ({ ...current, contact: current.isAnonymous ? current.contact : "", isAnonymous: !current.isAnonymous, name: current.isAnonymous ? current.name : "" })); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const parsed = complaintSubmissionSchema.safeParse(values);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Periksa kembali isian pengaduan."); return; }
    setIsPending(true);
    try {
      const response = await fetch("/api/v1/complaints", { body: JSON.stringify(parsed.data), headers: { "content-type": "application/json" }, method: "POST" });
      const payload = await response.json();
      const result = complaintCreatedResponseSchema.safeParse(payload);
      if (!response.ok || !result.success) { setError("Pengaduan belum dapat dikirim. Silakan coba kembali."); return; }
      setTrackingCode(result.data.data.trackingCode);
    } catch { setError("Koneksi tidak tersedia. Periksa jaringanmu lalu coba kembali."); }
    finally { setIsPending(false); }
  }

  if (trackingCode) return <section className="success" aria-live="polite"><span>✓</span><p className="eyebrow">PENGADUAN DITERIMA</p><h2>Terima kasih sudah berani bercerita.</h2><p>Simpan kode berikut untuk memeriksa perkembangan pengaduanmu.</p><output>{trackingCode}</output><button className="button" onClick={() => navigator.clipboard?.writeText(trackingCode)} type="button">Salin kode</button></section>;

  return <form className="complaint-form" noValidate onSubmit={submit}>
    <div className="form-note"><strong>◌ Kamu berada di ruang yang suportif.</strong><span>Bagikan secukupnya dan hindari menuliskan kata sandi atau data yang tidak diperlukan.</span></div>
    <label>Kategori pengaduan<select onChange={(event) => update("category", event.target.value)} required value={values.category}><option value="">Pilih topik</option>{complaintCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
    <label className="check"><input checked={values.isAnonymous} onChange={toggleAnonymous} type="checkbox" /><span><strong>Kirim secara anonim</strong><small>Nama dan kontak tidak akan dikirim.</small></span></label>
    {!values.isAnonymous ? <div className="form-grid"><label>Nama panggilan <small>(opsional)</small><input maxLength={120} onChange={(event) => update("name", event.target.value)} value={values.name} /></label><label>Kontak <small>(opsional)</small><input maxLength={120} onChange={(event) => update("contact", event.target.value)} value={values.contact} /></label></div> : null}
    <div className="form-grid"><label>Kamu adalah<select onChange={(event) => update("audience", event.target.value)} required value={values.audience}><option value="">Pilih status</option>{reporterAudiences.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label>Kebutuhan bantuan<select onChange={(event) => update("urgency", event.target.value)} required value={values.urgency}><option value="">Pilih tingkat kebutuhan</option>{urgencyLevels.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label></div>
    <label>Judul singkat<input maxLength={100} onChange={(event) => update("title", event.target.value)} placeholder="Contoh: Kesulitan beradaptasi di kelas" required value={values.title} /></label>
    <label>Ceritakan masalahmu<textarea maxLength={2000} minLength={10} onChange={(event) => update("details", event.target.value)} placeholder="Ceritakan secukupnya, sesuai kenyamananmu..." required rows={7} value={values.details} /><small>{values.details.length}/2.000 karakter</small></label>
    <label className="check"><input checked={values.consent} onChange={(event) => update("consent", event.target.checked)} required type="checkbox" /><span><strong>Saya memahami pengaduan akan diproses sesuai kebijakan layanan.</strong><small>Kebijakan resmi dilengkapi pengelola sebelum penggunaan publik.</small></span></label>
    {error ? <p className="form-error" role="alert">{error}</p> : null}<button className="button" disabled={isPending} type="submit">{isPending ? "Mengirim…" : "Kirim pengaduan →"}</button>
  </form>;
}
