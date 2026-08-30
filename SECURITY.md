# Kebijakan Keamanan & Kepatuhan Perlindungan Data (Security & Data Protection Policy)

Kami memprioritaskan keamanan perangkat lunak serta perlindungan data pribadi dalam ekosistem pendidikan Indonesia. Dokumen ini menjelaskan kebijakan penanganan kerentanan keamanan dan kepatuhan hukum atas penggunaan SDK ini.

---

## ⚖️ Kepatuhan UU Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022)

Aplikasi Dapodik memuat **Data Pribadi Spesifik dan Umum** (seperti Nomor Induk Kependudukan / NIK, NISN, nama lengkap, riwayat pendidikan, nomor kontak, serta data orang tua/wali siswa dan guru).

Setiap pengguna atau pengembang yang memanfaatkan pustaka **`@smansage/dapodik-sdk`** diwajibkan:
1. **Menghormati Dasar Pemrosesan Data**: Mengakses dan memproses data entitas Dapodik hanya untuk kepentingan sah institusi pendidikan/sekolah terkait dengan persetujuan atau mandat yang sah.
2. **Menjaga Kerahasiaan Token & Kredensial**: Tidak memublikasikan token WebService atau menaruh kredensial ke dalam repositori publik (*hardcoded secrets*).
3. **Mencegah Pengungkapan Tanpa Izin**: Dilarang menyebarluaskan atau memperjualbelikan data individu Dapodik kepada pihak ketiga tanpa hak.

> [!CAUTION]
> **Sanksi Hukum**: Segala bentuk penyalahgunaan, pembocoran, atau pemrosesan data pribadi secara melawan hukum dapat dikenakan sanksi pidana dan denda administratif sesuai ketentuan **UU Perlindungan Data Pribadi No. 27 Tahun 2022 Pasal 67**.

---

## 🛡️ Versi yang Didukung (Supported Versions)

Pembaruan keamanan dan perbaikan bug (*security patches*) secara aktif diberikan untuk versi-versi berikut:

| Versi SDK | Status Pemeliharaan Keamanan |
| :--- | :--- |
| **`1.x.x`** | ✅ Didukung Secara Penuh (*Active Support*) |
| `< 1.0.0` | ❌ Tidak Didukung |

---

## 🚨 Melaporkan Kerentanan Keamanan (Reporting a Vulnerability)

Jika Anda menemukan potensi celah keamanan (*vulnerability*) atau kebocoran data pada SDK ini, mohon **JANGAN** membuat *public issue* di GitHub.

Silakan laporkan secara privat melalui salah satu kanal berikut:

1. **Email Pengembang**: Kontak langsung ke [inisaya@ardianryan.com](mailto:inisaya@ardianryan.com) atau DM resmi via Instagram [@smansagewithai](https://www.instagram.com/smansagewithai/).
2. **GitHub Security Advisory**: Gunakan fitur *Report a vulnerability* di tab **Security** repositori GitHub kami.

### Informasi yang Perlu Disertakan:
- Deskripsi kerentanan atau bug keamanan.
- Langkah-langkah reproduksi (*proof of concept*).
- Dampak potensial terhadap data atau sistem.

Tim pemelihara akan merespons laporan dalam waktu maksimal **2 x 24 jam** dan segera merilis perbaikan (*patch*) pada versi rilis berikutnya.
