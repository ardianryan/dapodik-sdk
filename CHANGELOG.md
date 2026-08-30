# Changelog

Semua perubahan penting pada proyek **`@smansage/dapodik-sdk`** akan didokumentasikan di file ini.

Format changelog ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/), dan proyek ini mematuhi [Semantic Versioning](https://semver.org/lang/id/).

---

## [1.0.0] - 2026-08-30

### Ditambahkan
- **Inisialisasi Project**: Setup SDK TypeScript modern dengan dukungan dual build **ES Module (ESM)** dan **CommonJS (CJS)** via `tsup`.
- **DapodikClient Core**:
  - Implementasi komunikasi HTTP berbasis *native fetch* (zero external HTTP dependencies) dengan integrasi `AbortController` timeout (default 30 detik).
  - Autentikasi otomatis menggunakan header `Authorization: Bearer <token>` dan query parameter `npsn`.
  - Normalisasi otomatis respons envelope Dapodik (array, wrapped `data`, dan single object `rows`).
- **Dukungan Endpoint Resmi (GET)**:
  - `getSekolah(params?)`: Penarikan profil & izin operasional sekolah (termasuk parameter `semester_id`).
  - `getPengguna(params?)`: Penarikan akun operator/pengguna Dapodik.
  - `getGtk(params?)`: Penarikan data Guru dan Tenaga Kependidikan (GTK).
  - `getRombonganBelajar(params)`: Penarikan data rombongan belajar (kelas) dengan skema bersarang (*nested relations*: `anggota_rombel` dan `pembelajaran`).
  - `getPesertaDidik(params?)`: Penarikan data siswa/peserta didik lengkap.
  - `getMataPelajaran(params?)`: Penarikan data referensi mata pelajaran nasional.
  - `getMatevNilai(params?)`: Penarikan data mata evaluasi nilai.
  - `getAnggotaRombel(params)` & `getPembelajaran(params)`: Endpoint fallback untuk instalasi khusus.
- **Dukungan Operasi Tulis (POST)**:
  - `post(endpoint, body, params)`: Generic HTTP POST handler.
  - `postMatevRapor(body, params)`: Pengiriman data mata evaluasi rapor.
  - `postNilai(body, params)`: Pengiriman data nilai rapor ke tabel `rapor`.
- **Fitur Auto-Pagination & Streaming**:
  - `fetchAllPesertaDidik(options)`: Penarikan otomatis seluruh data siswa tanpa perlu manual looping.
  - `fetchAllGtk(options)`: Penarikan otomatis seluruh data PTK.
  - `iteratePesertaDidik(limit)` & `iterateGtk(limit)`: Async Generator untuk streaming data batch per-halaman.
- **Kompatibilitas Sintaks PHP**:
  - Class factory `Dapodik` (`new Dapodik(host, port).api(token, npsn)`).
  - Method aliases: `sekolah()`, `pd()`, `gtk()`, `rombel()`, `pengguna()`, `mataPelajaran()`, `matevNilai()`.
- **Error Handling Terstruktur**:
  - Hierarki error: `DapodikError`, `DapodikAuthError`, `DapodikConnectionError`, `DapodikHttpError`.
- **Pengujian & CI/CD**:
  - 12 unit tests berbasis `vitest` dengan 100% kelulusan.
  - Workflow GitHub Actions untuk CI (uji otomatis) dan rilis publikasi otomatis ke npmjs.
