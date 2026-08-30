/**
 * Konfigurasi koneksi ke WebService Dapodik
 */
export interface DapodikConfig {
  /**
   * Host server Dapodik (default: '127.0.0.1' atau 'localhost')
   */
  host?: string;

  /**
   * Port server Dapodik (default: '5774')
   */
  port?: string | number;

  /**
   * Base URL WebService Dapodik.
   * Default: 'http://localhost:5774/WebService' atau dibangun otomatis dari host & port.
   */
  baseUrl?: string;

  /**
   * Nomor Pokok Sekolah Nasional (NPSN) 8 digit.
   */
  npsn: string;

  /**
   * Token autentikasi yang didapatkan dari menu Pengaturan > WebService di Dapodik.
   */
  token: string;

  /**
   * Request timeout dalam milidetik.
   * Default: 30000 (30 detik)
   */
  timeout?: number;

  /**
   * Custom fetch implementation (opsional, berguna untuk mocking atau proxy)
   */
  fetch?: typeof fetch;
}

/**
 * Struktur standar respons WebService Dapodik
 */
export interface DapodikResponse<T = any> {
  status: string;
  message?: string;
  results?: number;
  rows: T[];
  [key: string]: any;
}

/**
 * Parameter umum untuk query pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Parameter query untuk endpoint Rombongan Belajar
 */
export interface RombelParams extends PaginationParams {
  semester_id?: string;
}

/**
 * Parameter query untuk endpoint Anggota Rombel
 */
export interface AnggotaRombelParams extends PaginationParams {
  rombongan_belajar_id?: string;
  semester_id?: string;
}

/**
 * Parameter query untuk endpoint Pembelajaran
 */
export interface PembelajaranParams extends PaginationParams {
  rombongan_belajar_id?: string;
  semester_id?: string;
}

/**
 * Skema entitas Sekolah
 */
export interface DapodikSekolah {
  sekolah_id?: string;
  nama?: string;
  npsn?: string;
  nss?: string;
  bentuk_pendidikan_id?: number;
  bentuk_pendidikan_id_str?: string;
  status_sekolah?: string;
  status_sekolah_str?: string;
  alamat_jalan?: string;
  rt?: string;
  rw?: string;
  dusun?: string;
  desa_kelurahan?: string;
  kecamatan?: string;
  kabupaten_kota?: string;
  provinsi?: string;
  kode_pos?: string;
  nomor_telepon?: string;
  nomor_fax?: string;
  email?: string;
  website?: string;
  [key: string]: any;
}

/**
 * Skema entitas Pengguna / Operator
 */
export interface DapodikPengguna {
  pengguna_id?: string;
  sekolah_id?: string;
  username?: string;
  nama?: string;
  peran_id?: number;
  peran_id_str?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Skema entitas GTK (Guru dan Tenaga Kependidikan)
 */
export interface DapodikGtk {
  ptk_id?: string;
  tahun_ajaran_id?: string;
  ptk_terdaftar_id?: string;
  ptk_induk?: number;
  nama?: string;
  jenis_kelamin?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  nik?: string;
  no_kk?: string;
  niy_nigk?: string;
  nuptk?: string;
  nipy?: string;
  status_kepegawaian_id?: number;
  status_kepegawaian_id_str?: string;
  jenis_ptk_id?: number;
  jenis_ptk_id_str?: string;
  agama_id?: number;
  agama_id_str?: string;
  alamat_jalan?: string;
  email?: string;
  nomor_hp?: string;
  [key: string]: any;
}

/**
 * Skema entitas Peserta Didik (Siswa)
 */
export interface DapodikPesertaDidik {
  peserta_didik_id?: string;
  registrasi_id?: string;
  nama?: string;
  jenis_kelamin?: string;
  nisn?: string;
  nik?: string;
  no_kk?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  agama_id?: number;
  nipd?: string;
  agama_id_str?: string;
  alamat_jalan?: string;
  nomor_telepon_seluler?: string;
  email?: string;
  nama_ibu_kandung?: string;
  nama_ayah?: string;
  nama_wali?: string;
  anak_keberapa?: number;
  sekolah_asal?: string;
  tanggal_masuk_sekolah?: string;
  tingkat_pendidikan_id?: number;
  tingkat_pendidikan_id_str?: string;
  rombongan_belajar_id?: string;
  anggota_rombel_id?: string;
  nama_rombel?: string;
  [key: string]: any;
}

/**
 * Skema entitas Rombongan Belajar (Kelas)
 */
export interface DapodikRombonganBelajar {
  rombongan_belajar_id?: string;
  sekolah_id?: string;
  semester_id?: string;
  nama?: string;
  tingkat_pendidikan_id?: number;
  tingkat_pendidikan_id_str?: string;
  jurusan_id?: string;
  jurusan_id_str?: string;
  kurikulum_id?: number;
  kurikulum_id_str?: string;
  ptk_id?: string;
  nama_wali_kelas?: string;
  jenis_rombel?: number;
  jenis_rombel_str?: string;
  /**
   * Daftar siswa yang tergabung di rombel ini (jika build Dapodik me-nesting data)
   */
  anggota_rombel?: DapodikAnggotaRombel[];
  /**
   * Daftar mata pelajaran / jadwal pembelajaran di rombel ini (jika build Dapodik me-nesting data)
   */
  pembelajaran?: DapodikPembelajaran[];
  [key: string]: any;
}

/**
 * Skema entitas Anggota Rombel (Anggota Kelas)
 */
export interface DapodikAnggotaRombel {
  anggota_rombel_id?: string;
  rombongan_belajar_id?: string;
  peserta_didik_id?: string;
  nama?: string;
  nisn?: string;
  jenis_kelamin?: string;
  [key: string]: any;
}

/**
 * Skema entitas Pembelajaran (Mata Pelajaran & Guru Pengampu di Rombel)
 */
export interface DapodikPembelajaran {
  pembelajaran_id?: string;
  rombongan_belajar_id?: string;
  ptk_id?: string;
  nama_ptk?: string;
  mata_pelajaran_id?: number;
  nama_mata_pelajaran?: string;
  sk_mengajar?: string;
  tanggal_sk_mengajar?: string;
  jam_mengajar_per_minggu?: number;
  status_di_kurikulum?: number;
  status_di_kurikulum_str?: string;
  [key: string]: any;
}

/**
 * Skema entitas Referensi Mata Pelajaran Nasional
 */
export interface DapodikMataPelajaran {
  mata_pelajaran_id?: number;
  nama?: string;
  jurusan_id?: string;
  pilihan_sekolah?: string;
  pilihan_buku?: string;
  pilihan_kepengawasan?: string;
  pilihan_evaluasi?: string;
  [key: string]: any;
}

/**
 * Skema entitas Mata Evaluasi Nilai (Matev)
 */
export interface DapodikMatevNilai {
  id_evaluasi?: string;
  pembelajaran_id?: string;
  mata_pelajaran_id?: number | string;
  nama_mata_pelajaran?: string;
  [key: string]: any;
}
