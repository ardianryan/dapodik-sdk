<p align="center">
  <img src="https://dapo.kemendikdasmen.go.id/assets/logo-dapodik-BZDG7c6h.png" alt="Dapodik Logo" width="140" />
</p>

<h1 align="center">@smansage/dapodik-sdk</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@smansage/dapodik-sdk"><img src="https://img.shields.io/npm/v/@smansage/dapodik-sdk.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License: MIT" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg?style=flat-square" alt="Node.js version" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square" alt="TypeScript Ready" /></a>
  <a href="https://www.instagram.com/smansagewithai/"><img src="https://img.shields.io/badge/Instagram-@smansagewithai-E4405F.svg?style=flat-square&logo=instagram&logoColor=white" alt="Instagram" /></a>
</p>

<p align="center">
  SDK TypeScript & JavaScript modern, ringan, dan <i>type-safe</i> untuk integrasi penarikan data <b>WebService Dapodik Kemendikdasmen</b> (port 5774).
</p>

<p align="center">
  Dipublikasikan dan dikelola oleh <b>SMA Negeri 1 Gedeg (<a href="https://www.instagram.com/smansagewithai/">@smansagewithai</a>)</b><br />
  Dikembangkan oleh <b>Ryan Ardian</b>
</p>

---

> [!IMPORTANT]
> ### 📢 Pernyataan Penyangkalan (Disclaimer) & Misi Terbuka
> **`@smansage/dapodik-sdk` adalah pustaka *Unofficial* (tidak resmi) dan independen.** Pustaka ini dikembangkan sebagai inisiatif komunitas sumber terbuka (*open-source*) oleh **SMA Negeri 1 Gedeg** dan **Ryan Ardian**, tanpa afiliasi langsung secara struktural dengan Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen).
>
> **Tujuan & Misi Pengembangan**:
> Pustaka ini lahir atas semangat memajukan transformasi digital dan interoperabilitas sistem pendidikan di Indonesia. Tujuan utamanya adalah **memberdayakan para pengembang perangkat lunak lintas platform dan multi-bahasa pemrograman** (TypeScript, JavaScript, Node.js, PHP, Laravel, Python, dll.) agar dapat mengintegrasikan sistem informasi sekolah, LMS, E-Rapor, presensi cerdas, serta analitik data pendidikan secara lebih cepat, aman, terstandarisasi, dan terbebas dari kompleksitas teknis protokol WebService lokal Dapodik.
>
> Seluruh hak cipta nama, logo, dan merek dagang **Dapodik (Data Pokok Pendidikan)** adalah milik sah **Kementerian Pendidikan Dasar dan Menengah Republik Indonesia**.

---

## 🏛️ Latar Belakang & Referensi

Pustaka ini merupakan implementasi klien (*client SDK*) berbasis **TypeScript dan JavaScript** modern yang mengadaptasi spesifikasi integrasi WebService Dapodik dari repositori referensi PHP karya **Ade Reksi Susanto** ([`adereksisusanto/dapodik-api-php`](https://github.com/adereksisusanto/dapodik-api-php)).

Pengembangan SDK ini ditujukan untuk memfasilitasi interoperabilitas sistem, otomasi sinkronisasi, serta integrasi data pokok pendidikan ke berbagai infrastruktur backend kontemporer (seperti **Express, Fastify, Next.js, Hono, Elysia, dan NestJS**) dengan mengedepankan jaminan keamanan tipe data (*type-safety*), efisiensi penanganan paginasi data berskala besar (*auto-pagination*), dan performa tinggi berbasis *native fetch*.

---

## ⚡ Perbedaan & Peningkatan dari Versi PHP Asal

Meskipun mempertahankan kompatibilitas gaya sintaks pustaka PHP (`sekolah()`, `pd()`, `gtk()`, `rombel()`, `pengguna()`), SDK TypeScript ini menghadirkan berbagai peningkatan modern untuk mempermudah integrasi:

1. **Jaminan Keamanan Tipe (*Full TypeScript Type-Safety*)**:
   - Setiap respon entitas memiliki skema definisi tipe yang detail (`DapodikSekolah`, `DapodikPesertaDidik`, `DapodikGtk`, `DapodikRombonganBelajar`, dll.) untuk meminimalisasi kesalahan *runtime* dan memberikan *autocomplete (IntelliSense)* lengkap di IDE.
2. **Penanganan Struktur Bersarang (*Nested Relations*)**:
   - Skema rombel secara bawaan mengenali relasi bersarang (`anggota_rombel` dan `pembelajaran`) yang dikembalikan oleh instalasi Dapodik desktop.
3. **Paginasi Otomatis & Streaming Async Generator**:
   - Penarikan ribuan data siswa/guru dapat dilakukan secara otomatis melalui `fetchAllPesertaDidik()` atau di-*stream* bertahap menggunakan Async Generator `iteratePesertaDidik()` tanpa perlu menyusun logika *looping* manual.
4. **Dukungan Operasi Tulis (HTTP POST) & Endpoint Tambahan**:
   - Menyediakan metode pengiriman data via HTTP POST (`postNilai`, `postMatevRapor`, `post`) serta endpoint referensi tambahan seperti `getMataPelajaran` dan `getMatevNilai`.
5. **Zero External Dependencies**:
   - Menggunakan *native fetch* standar JavaScript modern tanpa ketergantungan paket HTTP eksternal, menghasilkan ukuran package yang sangat ringan (< 15 KB) serta kompatibel di Node.js (>= 18), Bun, Deno, maupun Edge/Serverless runtime.
6. **Manajemen Error Hierarkis & Timeout Otomatis**:
   - Error dikelompokkan secara terstruktur (`DapodikAuthError`, `DapodikConnectionError`, `DapodikHttpError`) dan dilengkapi proteksi *timeout AbortController* bawaan agar aplikasi tidak menggantung (*hang*) saat jaringan bermasalah.

---

## ⚠️ Informasi Penting & Kebijakan Privasi
Penggunaan API Dapodik mengakses data entitas dan data pribadi (NIK, NISN, no HP, data siswa & PTK). Pengembang wajib memperhatikan dan mematuhi **UU Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022 Pasal 67)**. Pastikan token dan data yang ditarik dijaga kerahasiaannya dan tidak diekspos ke publik tanpa autentikasi/enkripsi yang memadai.

---

## ✨ Fitur Utama

- 🚀 **Zero External HTTP Dependencies**: Menggunakan native `fetch` modern standar.
- 📦 **Dual Build**: Mendukung **ES Module (ESM)** & **CommonJS (CJS)** secara out-of-the-box.
- 🛡️ **Full TypeScript Types**: Setiap entitas Dapodik (Sekolah, Pengguna, GTK, Siswa, Rombel, dsb.) memiliki *type definition* lengkap.
- 🔄 **Auto-Pagination Helper**: Penarikan otomatis untuk data ribuan siswa/guru (`fetchAllPesertaDidik`, `fetchAllGtk`, `iteratePesertaDidik`).
- 🤝 **Kompatibilitas Sintaks PHP**: Menyediakan class factory `Dapodik` dan method alias (`sekolah()`, `pd()`, `gtk()`, `rombel()`, `pengguna()`) yang identik dengan library PHP.
- ⏱️ **Timeout & Error Handling**: Dilengkapi `AbortController` timeout serta kelas error hierarkis (`DapodikAuthError`, `DapodikConnectionError`, `DapodikHttpError`).

---

## 📥 Instalasi

```bash
# npm
npm install @smansage/dapodik-sdk

# yarn
yarn add @smansage/dapodik-sdk

# pnpm
pnpm add @smansage/dapodik-sdk

# bun
bun add @smansage/dapodik-sdk
```

---

## ⚙️ Persiapan di Aplikasi Dapodik

1. Buka aplikasi Dapodik di komputer/server sekolah (`http://localhost:5774`).
2. Masuk ke menu **Pengaturan** > **WebService**.
3. Klik **Tambah**:
   * **Nama Aplikasi**: Masukkan nama aplikasi Anda (misal: `SIM SMAN 1 Gedeg`).
   * **IP Address**: Masukkan IP komputer pemanggil (atau `*` / IP lokal server backend).
4. Simpan, lalu salin **Token** dan catat **NPSN** sekolah Anda.
5. Pastikan firewall di server Dapodik mengizinkan koneksi port `5774`.

---

## 🚀 Panduan Penggunaan

### Gaya 1: Menggunakan `DapodikClient` (Modern TypeScript)

```typescript
import { DapodikClient } from '@smansage/dapodik-sdk';

const client = new DapodikClient({
  host: '192.168.1.100', // atau baseUrl: 'http://192.168.1.100:5774/WebService'
  port: 5774,
  npsn: '20300001',
  token: 'TOKEN_WEBSERVICE_DAPODIK',
});

async function main() {
  // Profil Sekolah
  const sekolah = await client.getSekolah();
  console.log('Sekolah:', sekolah.rows[0]?.nama);

  // Guru & Tendik (GTK)
  const gtk = await client.getGtk({ page: 1, limit: 50 });
  console.log(`GTK ditarik: ${gtk.rows.length}`);

  // Siswa (Peserta Didik)
  const siswa = await client.getPesertaDidik({ page: 1, limit: 50 });
  console.log(`Siswa ditarik: ${siswa.rows.length}`);

  // Rombel (Kelas)
  const rombel = await client.getRombonganBelajar('20241');
  console.log('Rombel:', rombel.rows);
}

main();
```

---

### Gaya 2: Menggunakan `Dapodik` Factory (Sintaks Mirip PHP SDK)

Bagi pengembang yang terbiasa dengan sintaks PHP `new Dapodik()->api($token, $npsn)`:

```typescript
import { Dapodik } from '@smansage/dapodik-sdk';

// Default host 127.0.0.1 dan port 5774
const dapodik = new Dapodik('192.168.1.100', 5774);
const api = dapodik.api('TOKEN_WEBSERVICE', '20300001');

async function main() {
  const sekolah = await api.sekolah();
  const pd = await api.pd();       // Alias untuk getPesertaDidik()
  const gtk = await api.gtk();     // Alias untuk getGtk()
  const rombel = await api.rombel('20241'); // Alias untuk getRombonganBelajar()
  const pengguna = await api.pengguna(); // Alias untuk getPengguna()

  console.log('Nama Sekolah:', sekolah.rows[0]?.nama);
  console.log('Jumlah Siswa:', pd.rows.length);
}

main();
```

---

## 📋 5 Endpoint Resmi WebService Dapodik

Sesuai dengan spesifikasi resmi Dapodik Kemendikdasmen dan pustaka PHP referensi, berikut adalah 5 endpoint inti yang didukung:

| Endpoint WebService | Method (TypeScript Modern) | Method (PHP Alias) | Return Type | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| **`/getSekolah`** | `client.getSekolah()` | `api.sekolah()` | `DapodikSekolah` | Profil & izin operasional sekolah |
| **`/getPengguna`** | `client.getPengguna(params?)` | `api.pengguna()` | `DapodikPengguna` | Akun operator / pengguna Dapodik |
| **`/getGtk`** | `client.getGtk(params?)` | `api.gtk()` | `DapodikGtk` | Guru dan Tenaga Kependidikan (GTK) |
| **`/getRombonganBelajar`** | `client.getRombonganBelajar(params)` | `api.rombel(sem)` | `DapodikRombonganBelajar` | Rombel / rombongan belajar per semester |
| **`/getPesertaDidik`** | `client.getPesertaDidik(params?)` | `api.pd()` | `DapodikPesertaDidik` | Data seluruh siswa / peserta didik |
| *(Custom Endpoint)* | `client.customRequest(endpoint, params)` | `api.customRequest()` | `any` | Endpoint kustom jika ada modul tambahan |

---

## 🔄 Auto-Pagination (Tarik Ribuan Data Otomatis)

Jika sekolah memiliki ribuan siswa atau PTK, gunakan helper otomatis:

```typescript
// 1. Tarik semua siswa dalam 1 array sekaligus
const semuaSiswa = await client.fetchAllPesertaDidik({
  limit: 100,      // Jumlah baris per request
  delayMs: 150,    // Jeda antar request agar server Dapodik tidak overload
  onProgress: (page, fetched, total) => {
    console.log(`Halaman ${page}: ditarik +${fetched} siswa (Total: ${total})`);
  },
});

console.log(`Total seluruh siswa: ${semuaSiswa.length}`);

// 2. Stream / Batching menggunakan Async Generator
for await (const batchSiswa of client.iteratePesertaDidik(100)) {
  console.log(`Memproses batch ${batchSiswa.length} siswa...`);
  // Simpan ke PostgreSQL / MySQL / Supabase di sini
}
```

---

## 🚨 Error Handling

```typescript
import {
  DapodikAuthError,
  DapodikConnectionError,
  DapodikHttpError,
  DapodikError,
} from '@smansage/dapodik-sdk';

try {
  const data = await client.getSekolah();
} catch (err) {
  if (err instanceof DapodikAuthError) {
    console.error('Token tidak valid atau IP belum didaftarkan di WebService Dapodik');
  } else if (err instanceof DapodikConnectionError) {
    console.error('Gagal terhubung ke host/port Dapodik (cek jaringan/firewall)');
  } else if (err instanceof DapodikHttpError) {
    console.error(`HTTP Error ${err.statusCode}:`, err.message);
  } else {
    console.error('Error:', err);
  }
}
```

---

## 🌐 Contoh Integrasi Backend Modern

### Menggunakan Hono / Express
```typescript
import { Hono } from 'hono';
import { DapodikClient } from '@smansage/dapodik-sdk';

const app = new Hono();
const dapodik = new DapodikClient({
  host: process.env.DAPODIK_HOST || '127.0.0.1',
  port: process.env.DAPODIK_PORT || 5774,
  npsn: process.env.DAPODIK_NPSN!,
  token: process.env.DAPODIK_TOKEN!,
});

app.get('/api/sekolah', async (c) => {
  const data = await dapodik.getSekolah();
  return c.json(data.rows[0] || {});
});

app.get('/api/siswa', async (c) => {
  const page = Number(c.req.query('page') || 1);
  const data = await dapodik.getPesertaDidik({ page, limit: 50 });
  return c.json(data);
});

export default app;
```

---

## ⚖️ Lisensi & Ketentuan Penggunaan Non-Komersial

Proyek ini dirilis di bawah lisensi **[MIT License with Non-Commercial Restriction (MIT-NC)](LICENSE)**.

### 📌 Ketentuan Penggunaan:
1. **100% Gratis untuk Pendidikan**: Pustaka ini sepenuhnya **gratis** digunakan oleh seluruh sekolah, guru, operator, siswa, akademisi, dan lembaga pendidikan di Indonesia.
2. **Dilarang untuk Tujuan Komersial (Non-Commercial Only)**:
   - Dilarang keras memperjualbelikan, memonetisasi, menjual kembali (*reselling*), atau mengemas SDK ini ke dalam produk perangkat lunak berbayar / layanan berbayar pihak ketiga tanpa izin tertulis dari pemegang hak cipta (**Ryan Ardian & SMA Negeri 1 Gedeg**).
3. **Atribusi Hak Cipta**:
   - Hak Cipta &copy; 2026 **Ryan Ardian** ([inisaya@ardianryan.com](mailto:inisaya@ardianryan.com)) & **SMA Negeri 1 Gedeg** ([@smansagewithai](https://www.instagram.com/smansagewithai/)).
   - Inspirasi & Atribusi Dasar: Adaptasi pustaka PHP Dapodik oleh **Ade Reksi Susanto** ([`adereksisusanto/dapodik-api-php`](https://github.com/adereksisusanto/dapodik-api-php)).

---

## 📑 Dokumen Pendukung Repositori

- 📜 [Changelog](CHANGELOG.md) - Catatan riwayat versi dan perubahan.
- 🛡️ [Security Policy & UU PDP](SECURITY.md) - Kebijakan keamanan & kepatuhan perlindungan data pribadi.
- 🤝 [Contributing Guidelines](CONTRIBUTING.md) - Panduan kontribusi kode dan standar Pull Request.
- 📜 [Code of Conduct](CODE_OF_CONDUCT.md) - Kode etik komunitas kontributor.
