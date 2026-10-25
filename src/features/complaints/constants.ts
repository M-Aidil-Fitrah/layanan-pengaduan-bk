export const complaintCategories = [
  { description: "Emosi, kepercayaan diri, atau situasi keluarga.", icon: "spark", label: "Masalah pribadi", value: "PERSONAL" },
  { description: "Belajar, motivasi, tugas, atau adaptasi akademik.", icon: "book", label: "Masalah akademik", value: "ACADEMIC" },
  { description: "Pertemanan, konflik, perundungan, atau lingkungan.", icon: "people", label: "Masalah sosial", value: "SOCIAL" },
  { description: "Stres, cemas, lelah, atau perasaan yang mengganggu.", icon: "heart", label: "Kesejahteraan emosional", value: "EMOTIONAL_WELLBEING" },
  { description: "Hal lain yang ingin kamu sampaikan kepada layanan BK.", icon: "dots", label: "Lainnya", value: "OTHER" },
] as const;

export type ComplaintCategoryValue = (typeof complaintCategories)[number]["value"];

export const reporterAudiences = [
  { description: "Pelajar pada jenjang sekolah.", label: "Siswa", value: "STUDENT" },
  { description: "Pelajar pada jenjang perguruan tinggi.", label: "Mahasiswa", value: "UNIVERSITY_STUDENT" },
  { description: "Orang tua atau wali dari pelajar.", label: "Orang tua / wali", value: "PARENT_OR_GUARDIAN" },
  { description: "Peran lain yang tidak tercantum.", label: "Lainnya", value: "OTHER" },
] as const;

export const urgencyLevels = [
  { description: "Saya ingin membicarakan situasi ini dengan layanan BK.", label: "Ingin berkonsultasi", value: "CONSULTATION" },
  { description: "Saya membutuhkan tindak lanjut dalam waktu dekat.", label: "Butuh bantuan dalam waktu dekat", value: "SOON" },
  { description: "Saya merasa keselamatan saya sedang terancam.", label: "Merasa tidak aman saat ini", value: "UNSAFE_NOW" },
] as const;
