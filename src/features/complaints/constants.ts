export const complaintCategories = [
  { description: "Emosi, kepercayaan diri, atau keluarga.", icon: "◌", label: "Masalah pribadi", value: "PERSONAL" },
  { description: "Belajar, motivasi, atau tugas.", icon: "⌁", label: "Masalah akademik", value: "ACADEMIC" },
  { description: "Pertemanan, konflik, atau perundungan.", icon: "⌘", label: "Masalah sosial", value: "SOCIAL" },
  { description: "Stres, cemas, atau kelelahan.", icon: "♡", label: "Kesejahteraan emosional", value: "EMOTIONAL_WELLBEING" },
  { description: "Hal lain terkait layanan BK.", icon: "·", label: "Lainnya", value: "OTHER" },
] as const;

export const reporterAudiences = [
  { label: "Siswa", value: "STUDENT" },
  { label: "Mahasiswa", value: "UNIVERSITY_STUDENT" },
  { label: "Orang tua / wali", value: "PARENT_OR_GUARDIAN" },
  { label: "Lainnya", value: "OTHER" },
] as const;

export const urgencyLevels = [
  { label: "Ingin berkonsultasi", value: "CONSULTATION" },
  { label: "Butuh bantuan dalam waktu dekat", value: "SOON" },
  { label: "Merasa tidak aman saat ini", value: "UNSAFE_NOW" },
] as const;
