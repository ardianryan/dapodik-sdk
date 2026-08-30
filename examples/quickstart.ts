import { DapodikClient } from '../src';

async function run() {
  // Inisialisasi client
  const client = new DapodikClient({
    baseUrl: process.env.DAPODIK_BASE_URL || 'http://localhost:5774/WebService',
    npsn: process.env.DAPODIK_NPSN || '20300001',
    token: process.env.DAPODIK_TOKEN || 'YOUR_WEBSERVICE_TOKEN',
  });

  console.log('--- 1. Menarik Profil Sekolah ---');
  try {
    const sekolah = await client.getSekolah();
    console.log('Sekolah:', sekolah.rows[0]?.nama || 'Tidak ada data');

    console.log('\n--- 2. Menarik Data GTK (Guru & Tendik) ---');
    const gtk = await client.getGtk({ page: 1, limit: 10 });
    console.log(`Ditemukan ${gtk.rows.length} GTK (Page 1)`);

    console.log('\n--- 3. Menarik Data Peserta Didik (Auto Pagination) ---');
    const semuaSiswa = await client.fetchAllPesertaDidik({
      limit: 100,
      maxPages: 3, // batasi untuk demo
      onProgress: (page, fetched, total) => {
        console.log(`Page ${page}: +${fetched} siswa (Total: ${total})`);
      },
    });
    console.log(`Total siswa ditarik: ${semuaSiswa.length}`);
  } catch (err: any) {
    console.error('Terjadi kesalahan:', err.message);
  }
}

run();
