# Panduan Kontribusi (Contributing Guidelines)

Terima kasih atas minat Anda untuk berkontribusi pada pengembangan **`@smansage/dapodik-sdk`**! Proyek ini bersifat *open-source* dan kami menyambut baik kontribusi dalam bentuk pelaporan bug, usulan fitur, pembaruan dokumentasi, maupun pengiriman kode (*Pull Request*).

---

## 🛠️ Alur Pengembangan Lokal (Local Setup)

### Prasyarat
- [Node.js](https://nodejs.org/) (versi >= 18.0.0)
- npm (atau pnpm / yarn / bun)
- Git

### Langkah Menjalankan Proyek
1. **Fork** repositori ini ke akun GitHub Anda.
2. **Clone** hasil fork ke komputer lokal:
   ```bash
   git clone https://github.com/ardianryan/dapodik-sdk.git
   cd dapodik-sdk
   ```
3. **Instal dependensi**:
   ```bash
   npm install
   ```
4. **Jalankan Unit Test**:
   ```bash
   npm test
   ```
5. **Jalankan Build**:
   ```bash
   npm run build
   ```

---

## 🌿 Standar Branch & Commit

### 1. Penamaan Branch
Gunakan format nama branch yang deskriptif:
- `feat/<nama-fitur>`: Penambahan fitur baru
- `fix/<nama-bug>`: Perbaikan bug
- `docs/<nama-dokumen>`: Perbaikan atau penambahan dokumentasi
- `refactor/<nama-komponen>`: Refaktor kode tanpa mengubah fungsionalitas

### 2. Konvensi Pesan Commit (Conventional Commits)
Kami mengikuti standar [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add getMataPelajaran endpoint helper`
- `fix: handle single object response in getSekolah`
- `docs: update quickstart guide in README`
- `test: add unit test for auto pagination timeout`

---

## 🧪 Aturan Pengujian & Kualitas Kode

Sebelum mengajukan *Pull Request* (PR), pastikan:
1. Kode ditulis menggunakan **TypeScript** yang ketat (*strict mode*).
2. Menambahkan atau memperbarui **Unit Test** di direktori `tests/` jika ada perubahan fungsional.
3. Seluruh pengujian lolos:
   ```bash
   npm test
   ```
4. Proses build menghasilkan artefak tanpa error:
   ```bash
   npm run build
   ```

---

## 📬 Mengajukan Pull Request (PR)

1. Buat PR baru dari branch Anda ke branch `main` repositori utama.
2. Berikan deskripsi yang jelas mengenai:
   - Masalah atau kebutuhan yang diselesaikan.
   - Perubahan utama yang dilakukan.
   - Bukti bahwa pengujian telah lulus.
3. Tunggu proses *Code Review* dari maintainer (**Ryan Ardian** / **smansage team**).

---

## 📜 Lisensi & Hak Cipta

Dengan berkontribusi pada proyek ini, Anda menyetujui bahwa seluruh kontribusi Anda akan dilisensikan di bawah lisensi [MIT License](LICENSE).
