"use client";

import { type FormEvent, useState } from "react";

import {
  complaintCategories,
  type ComplaintCategoryValue,
  reporterAudiences,
  urgencyLevels,
} from "../constants";
import {
  complaintCreatedResponseSchema,
  complaintSubmissionSchema,
} from "../schemas/complaint-schemas";
import { useComplaintJourney } from "./complaint-journey-context";

type AudienceValue = (typeof reporterAudiences)[number]["value"];
type UrgencyValue = (typeof urgencyLevels)[number]["value"];

type FormValues = {
  audience: AudienceValue | "";
  category: ComplaintCategoryValue | "";
  consent: boolean;
  contact: string;
  details: string;
  isAnonymous: boolean;
  name: string;
  title: string;
  urgency: UrgencyValue | "";
};

type FormField = keyof FormValues;
type FormErrors = Partial<Record<FormField, string>>;

const initialValues: FormValues = {
  audience: "",
  category: "",
  consent: false,
  contact: "",
  details: "",
  isAnonymous: false,
  name: "",
  title: "",
  urgency: "",
};

const stepFields: FormField[][] = [
  ["category"],
  ["audience", "urgency"],
  ["title", "details"],
  ["consent"],
];

const stepLabels = ["Topik", "Tentang kamu", "Ceritamu", "Tinjau"] as const;

function labelFor<T extends readonly { label: string; value: string }[]>(
  items: T,
  value: string,
): string {
  return items.find((item) => item.value === value)?.label ?? "Belum dipilih";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span className="field-error" id={id}>{message}</span> : null;
}

function isFormField(field: PropertyKey): field is FormField {
  return field === "audience" ||
    field === "category" ||
    field === "consent" ||
    field === "contact" ||
    field === "details" ||
    field === "isAnonymous" ||
    field === "name" ||
    field === "title" ||
    field === "urgency";
}

export function ComplaintForm() {
  const { selectedCategory, selectCategory } = useComplaintJourney();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState(0);
  const [trackingCode, setTrackingCode] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const currentCategory = selectedCategory || values.category;
  const progress = `${((step + 1) / stepLabels.length) * 100}%`;

  function update<Key extends FormField>(key: Key, value: FormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setFormError("");
  }

  function chooseCategory(category: ComplaintCategoryValue) {
    update("category", category);
    selectCategory(category);
  }

  function toggleAnonymous() {
    setValues((current) => ({
      ...current,
      contact: current.isAnonymous ? current.contact : "",
      isAnonymous: !current.isAnonymous,
      name: current.isAnonymous ? current.name : "",
    }));
  }

  function validateCurrentStep(): boolean {
    const result = complaintSubmissionSchema.safeParse({
      ...values,
      category: currentCategory,
    });
    const nextErrors: FormErrors = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (isFormField(field) && stepFields[step]?.includes(field)) {
          nextErrors[field] = issue.message;
        }
      }
    }

    setErrors((current) => ({ ...current, ...nextErrors }));
    return stepFields[step]?.every((field) => !nextErrors[field]) ?? false;
  }

  function goForward() {
    if (!validateCurrentStep()) {
      setFormError("Lengkapi bagian yang ditandai sebelum melanjutkan.");
      return;
    }

    setFormError("");
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
  }

  function goBack() {
    setFormError("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const parsed = complaintSubmissionSchema.safeParse({
      ...values,
      category: currentCategory,
    });

    if (!parsed.success) {
      const nextErrors: FormErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];

        if (isFormField(field)) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      setFormError("Masih ada isian yang perlu diperbaiki.");
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/v1/complaints", {
        body: JSON.stringify(parsed.data),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const payload = await response.json();
      const result = complaintCreatedResponseSchema.safeParse(payload);

      if (!response.ok || !result.success) {
        setFormError(
          response.status === 503
            ? "Penyimpanan belum tersedia. Pengaduanmu belum terkirim—coba lagi setelah layanan aktif."
            : "Pengaduan belum dapat dikirim. Isianmu tetap tersimpan di halaman ini.",
        );
        return;
      }

      setTrackingCode(result.data.data.trackingCode);
    } catch {
      setFormError("Koneksi tidak tersedia. Periksa jaringanmu lalu coba kembali.");
    } finally {
      setIsPending(false);
    }
  }

  async function copyTrackingCode() {
    try {
      await navigator.clipboard.writeText(trackingCode);
      setCopyStatus("Kode berhasil disalin.");
    } catch {
      setCopyStatus("Salin manual kode yang terlihat di atas.");
    }
  }

  function startAnotherComplaint() {
    setValues(initialValues);
    selectCategory("");
    setErrors({});
    setFormError("");
    setStep(0);
    setTrackingCode("");
    setCopyStatus("");
  }

  if (trackingCode) {
    return (
      <section className="success" aria-live="polite">
        <span className="success-mark" aria-hidden="true">✓</span>
        <p className="eyebrow">PENGADUAN DITERIMA</p>
        <h2>Terima kasih sudah berani bercerita.</h2>
        <p>Simpan kode berikut. Hanya orang yang memiliki kode ini yang dapat memeriksa status publik pengaduan.</p>
        <div className="tracking-code-box">
          <small>Kode pengaduan</small>
          <output>{trackingCode}</output>
        </div>
        <div className="success-actions">
          <button className="button" onClick={copyTrackingCode} type="button">Salin kode</button>
          <a className="button button-ghost" href="#lacak">Lacak status</a>
        </div>
        {copyStatus ? <p className="copy-status">{copyStatus}</p> : null}
        <button className="text-button" onClick={startAnotherComplaint} type="button">Buat pengaduan lain</button>
      </section>
    );
  }

  return (
    <form className="complaint-form" noValidate onSubmit={submit}>
      <div className="stepper-header">
        <div>
          <span>Langkah {step + 1} dari {stepLabels.length}</span>
          <strong>{stepLabels[step]}</strong>
        </div>
        <span className="step-percentage">{Math.round(((step + 1) / stepLabels.length) * 100)}%</span>
      </div>
      <div className="stepper-track" aria-hidden="true"><span style={{ width: progress }} /></div>
      <ol className="stepper" aria-label="Tahapan formulir">
        {stepLabels.map((label, index) => (
          <li className={index === step ? "is-active" : index < step ? "is-complete" : ""} key={label}>
            <span>{index < step ? "✓" : index + 1}</span>
            <small>{label}</small>
          </li>
        ))}
      </ol>

      <div className="form-step" key={step}>
        {step === 0 ? (
          <fieldset>
            <legend>Topik apa yang paling mendekati ceritamu?</legend>
            <p className="field-help">Tidak harus sempurna—pilih yang terasa paling sesuai.</p>
            <div className="option-grid category-options">
              {complaintCategories.map((category) => (
                <label className={currentCategory === category.value ? "option-card is-selected" : "option-card"} key={category.value}>
                  <input checked={currentCategory === category.value} name="category" onChange={() => chooseCategory(category.value)} type="radio" value={category.value} />
                  <span className="radio-indicator" />
                  <strong>{category.label}</strong>
                  <small>{category.description}</small>
                </label>
              ))}
            </div>
            <FieldError id="category-error" message={currentCategory ? undefined : errors.category} />
          </fieldset>
        ) : null}

        {step === 1 ? (
          <div className="form-fields">
            <fieldset>
              <legend>Kamu mengisi sebagai siapa?</legend>
              <div className="choice-row">
                {reporterAudiences.map((audience) => (
                  <label className={values.audience === audience.value ? "choice-pill is-selected" : "choice-pill"} key={audience.value}>
                    <input checked={values.audience === audience.value} name="audience" onChange={() => update("audience", audience.value)} type="radio" value={audience.value} />
                    <span>{audience.label}</span>
                  </label>
                ))}
              </div>
              <FieldError id="audience-error" message={errors.audience} />
            </fieldset>

            <fieldset>
              <legend>Seberapa cepat kamu membutuhkan bantuan?</legend>
              <div className="urgency-options">
                {urgencyLevels.map((urgency) => (
                  <label className={values.urgency === urgency.value ? "urgency-option is-selected" : "urgency-option"} key={urgency.value}>
                    <input checked={values.urgency === urgency.value} name="urgency" onChange={() => update("urgency", urgency.value)} type="radio" value={urgency.value} />
                    <span className="radio-indicator" />
                    <span><strong>{urgency.label}</strong>{urgency.value === "UNSAFE_NOW" ? <small>Pilihan ini tidak mengaktifkan respons darurat otomatis.</small> : null}</span>
                  </label>
                ))}
              </div>
              <FieldError id="urgency-error" message={errors.urgency} />
            </fieldset>

            <div className="identity-panel">
              <label className="switch-row">
                <span><strong>Kirim secara anonim</strong><small>Nama dan kontak akan dikosongkan sebelum dikirim.</small></span>
                <input checked={values.isAnonymous} onChange={toggleAnonymous} role="switch" type="checkbox" />
              </label>
              {!values.isAnonymous ? (
                <div className="form-grid">
                  <label htmlFor="reporter-name">Nama panggilan <small>(opsional)</small>
                    <input id="reporter-name" maxLength={120} onChange={(event) => update("name", event.target.value)} placeholder="Nama yang nyaman digunakan" value={values.name} />
                  </label>
                  <label htmlFor="reporter-contact">Kontak <small>(opsional)</small>
                    <input id="reporter-contact" maxLength={120} onChange={(event) => update("contact", event.target.value)} placeholder="Email atau nomor yang dapat dihubungi" value={values.contact} />
                  </label>
                </div>
              ) : <p className="anonymous-note">Mode anonim aktif. Identitas yang sempat ditulis telah dihapus dari formulir.</p>}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="form-fields">
            <div className="support-note"><span aria-hidden="true">✦</span><p><strong>Ceritakan secukupnya.</strong> Hindari kata sandi, nomor identitas, atau data lain yang tidak diperlukan.</p></div>
            <label htmlFor="complaint-title">Judul singkat
              <input aria-describedby="title-hint title-error" aria-invalid={Boolean(errors.title)} id="complaint-title" maxLength={100} onChange={(event) => update("title", event.target.value)} placeholder="Contoh: Kesulitan beradaptasi di kelas" value={values.title} />
              <span className="input-meta" id="title-hint"><small>Ringkas inti yang ingin disampaikan</small><small>{values.title.length}/100</small></span>
              <FieldError id="title-error" message={errors.title} />
            </label>
            <label htmlFor="complaint-details">Ceritakan masalahmu
              <textarea aria-describedby="details-hint details-error" aria-invalid={Boolean(errors.details)} id="complaint-details" maxLength={2000} minLength={10} onChange={(event) => update("details", event.target.value)} placeholder="Apa yang terjadi dan bagaimana hal itu memengaruhimu?" rows={8} value={values.details} />
              <span className="input-meta" id="details-hint"><small>Minimal 10 karakter</small><small>{values.details.length}/2.000</small></span>
              <FieldError id="details-error" message={errors.details} />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="review-step">
            <div className="review-heading"><div><span aria-hidden="true">✓</span><h3>Periksa sebelum mengirim</h3></div><p>Pastikan informasi sudah sesuai. Kamu masih dapat kembali ke langkah sebelumnya.</p></div>
            <dl className="review-list">
              <div><dt>Topik</dt><dd>{labelFor(complaintCategories, currentCategory)}</dd></div>
              <div><dt>Pelapor</dt><dd>{labelFor(reporterAudiences, values.audience)}</dd></div>
              <div><dt>Kebutuhan</dt><dd>{labelFor(urgencyLevels, values.urgency)}</dd></div>
              <div><dt>Identitas</dt><dd>{values.isAnonymous ? "Anonim" : values.name || "Tanpa nama"}</dd></div>
              <div className="review-full"><dt>Judul</dt><dd>{values.title}</dd></div>
              <div className="review-full"><dt>Uraian</dt><dd>{values.details}</dd></div>
            </dl>
            <label className="consent-card">
              <input aria-describedby="consent-error" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} type="checkbox" />
              <span><strong>Saya memahami pengaduan akan diproses sesuai kebijakan layanan.</strong><small>Kebijakan resmi perlu dilengkapi pengelola sebelum penggunaan publik.</small></span>
            </label>
            <FieldError id="consent-error" message={errors.consent} />
          </div>
        ) : null}
      </div>

      {formError ? <p className="form-error" role="alert">{formError}</p> : null}

      <div className="form-actions">
        {step > 0 ? <button className="button button-ghost" disabled={isPending} onClick={goBack} type="button">← Kembali</button> : <span />}
        {step < stepLabels.length - 1 ? <button className="button" onClick={goForward} type="button">Lanjutkan <span aria-hidden="true">→</span></button> : <button className="button" disabled={isPending} type="submit">{isPending ? "Mengirim…" : "Kirim pengaduan"} <span aria-hidden="true">→</span></button>}
      </div>
    </form>
  );
}
