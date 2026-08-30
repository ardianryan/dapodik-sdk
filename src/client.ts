import {
  DapodikConfig,
  DapodikResponse,
  PaginationParams,
  RombelParams,
  AnggotaRombelParams,
  PembelajaranParams,
  DapodikSekolah,
  DapodikPengguna,
  DapodikGtk,
  DapodikPesertaDidik,
  DapodikRombonganBelajar,
  DapodikAnggotaRombel,
  DapodikPembelajaran,
} from './types';
import {
  DapodikError,
  DapodikHttpError,
  DapodikAuthError,
  DapodikConnectionError,
} from './errors';
import { fetchAllPages, paginateIterator, FetchAllOptions } from './pagination';

/**
 * Client utama untuk berinteraksi dengan WebService Dapodik
 */
export class DapodikClient {
  public readonly baseUrl: string;
  public readonly npsn: string;
  public readonly token: string;
  public readonly timeout: number;
  private readonly customFetch: typeof fetch;

  constructor(config: DapodikConfig) {
    if (!config.npsn || typeof config.npsn !== 'string') {
      throw new DapodikError('NPSN wajib diisi berupa string angka (contoh: "12345678")', 'INVALID_CONFIG');
    }

    if (!config.token || typeof config.token !== 'string') {
      throw new DapodikError('Token WebService wajib diisi', 'INVALID_CONFIG');
    }

    this.npsn = config.npsn.trim();
    this.token = config.token.trim();
    this.timeout = config.timeout ?? 30000;
    this.customFetch = config.fetch || globalThis.fetch;

    if (config.baseUrl) {
      this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    } else {
      const host = config.host || '127.0.0.1';
      const port = config.port || 5774;
      const normalizedHost = host.startsWith('http://') || host.startsWith('https://')
        ? host
        : `http://${host}`;
      this.baseUrl = `${normalizedHost}:${port}/WebService`;
    }
  }

  /**
   * Mengirim HTTP GET request ke WebService Dapodik
   */
  public async request<T = any>(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<DapodikResponse<T>> {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const url = new URL(`${this.baseUrl}/${cleanEndpoint}`);

    // Set NPSN sebagai parameter default
    url.searchParams.set('npsn', this.npsn);

    // Tambahkan parameter query tambahan
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }

    // Controller untuk timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;
    try {
      response = await this.customFetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': '@smansage/dapodik-sdk',
        },
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new DapodikConnectionError(
          `Request timeout setelah ${this.timeout}ms saat memanggil '${cleanEndpoint}' di ${this.baseUrl}`,
          err
        );
      }
      throw new DapodikConnectionError(
        `Gagal terhubung ke server Dapodik di ${this.baseUrl}: ${err.message || String(err)}`,
        err
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 401 || response.status === 403) {
      throw new DapodikAuthError(
        `Akses ditolak (${response.status}). Periksa kembali token Anda atau whitelist IP client di Pengaturan WebService Dapodik.`
      );
    }

    const rawText = await response.text();

    if (!response.ok) {
      throw new DapodikHttpError(
        response.status,
        response.statusText,
        cleanEndpoint,
        rawText
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      throw new DapodikError(
        `Respons dari server Dapodik bukan format JSON valid: ${rawText.slice(0, 200)}`,
        'INVALID_JSON'
      );
    }

    // Standardisasi respons jika server mengembalikan array langsung
    if (Array.isArray(parsed)) {
      return {
        status: 'success',
        results: parsed.length,
        rows: parsed,
      };
    }

    // Jika format respons membungkus rows
    if (!parsed.rows && Array.isArray(parsed.data)) {
      parsed.rows = parsed.data;
    } else if (parsed.rows && !Array.isArray(parsed.rows) && typeof parsed.rows === 'object') {
      // getSekolah mengembalikan rows sebagai objek tunggal { ... }, bungkus ke array
      parsed.rows = [parsed.rows];
    } else if (!parsed.rows) {
      parsed.rows = [];
    }

    return parsed as DapodikResponse<T>;
  }

  /**
   * Menarik data profil dan identitas sekolah
   * @param params Opsional semester_id (misal '20241') atau objek parameter
   */
  async getSekolah(params?: string | { semester_id?: string }): Promise<DapodikResponse<DapodikSekolah>> {
    const query = typeof params === 'string' ? { semester_id: params } : params;
    return this.request<DapodikSekolah>('getSekolah', query);
  }

  /**
   * Menarik data pengguna / akun operator Dapodik
   */
  async getPengguna(params?: PaginationParams): Promise<DapodikResponse<DapodikPengguna>> {
    return this.request<DapodikPengguna>('getPengguna', params);
  }

  /**
   * Menarik data Guru dan Tenaga Kependidikan (GTK / PTK)
   */
  async getGtk(params?: PaginationParams): Promise<DapodikResponse<DapodikGtk>> {
    return this.request<DapodikGtk>('getGtk', params);
  }

  /**
   * Menarik data Peserta Didik (Siswa)
   */
  async getPesertaDidik(params?: PaginationParams): Promise<DapodikResponse<DapodikPesertaDidik>> {
    return this.request<DapodikPesertaDidik>('getPesertaDidik', params);
  }

  /**
   * Menarik data Rombongan Belajar (Kelas)
   * @param params String semester_id (misal '20241') atau objek RombelParams
   */
  async getRombonganBelajar(
    params?: string | RombelParams
  ): Promise<DapodikResponse<DapodikRombonganBelajar>> {
    const query = typeof params === 'string' ? { semester_id: params } : params;
    return this.request<DapodikRombonganBelajar>('getRombonganBelajar', query);
  }

  /**
   * Menarik data Anggota Rombel (Daftar Siswa di Rombel Tertentu)
   * @param params String rombongan_belajar_id atau objek AnggotaRombelParams
   */
  async getAnggotaRombel(
    params?: string | AnggotaRombelParams
  ): Promise<DapodikResponse<DapodikAnggotaRombel>> {
    const query = typeof params === 'string' ? { rombongan_belajar_id: params } : params;
    return this.request<DapodikAnggotaRombel>('getAnggotaRombel', query);
  }

  /**
   * Menarik data Pembelajaran (Mata Pelajaran & Guru Pengampu di Rombel)
   * @param params String rombongan_belajar_id atau objek PembelajaranParams
   */
  async getPembelajaran(
    params?: string | PembelajaranParams
  ): Promise<DapodikResponse<DapodikPembelajaran>> {
    const query = typeof params === 'string' ? { rombongan_belajar_id: params } : params;
    return this.request<DapodikPembelajaran>('getPembelajaran', query);
  }

  /**
   * Menarik data Referensi Mata Pelajaran Nasional
   */
  async getMataPelajaran(params?: PaginationParams & { semester_id?: string }): Promise<DapodikResponse<any>> {
    return this.request('getMataPelajaran', params);
  }

  /**
   * Menarik data Mata Evaluasi Nilai (Matev)
   */
  async getMatevNilai(params?: PaginationParams & { semester_id?: string; a_dari_template?: number }): Promise<DapodikResponse<any>> {
    return this.request('getMatevNilai', params);
  }

  /**
   * Mengirim HTTP POST request ke WebService Dapodik (misal: pengiriman nilai rapor)
   */
  async post<T = any>(
    endpoint: string,
    body: any,
    params: Record<string, any> = {}
  ): Promise<DapodikResponse<T>> {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const url = new URL(`${this.baseUrl}/${cleanEndpoint}`);
    url.searchParams.set('npsn', this.npsn);

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;
    try {
      response = await this.customFetch(url.toString(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': '@smansage/dapodik-sdk',
        },
        body: typeof body === 'string' ? body : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new DapodikConnectionError(`Request timeout saat POST ke '${cleanEndpoint}'`, err);
      }
      throw new DapodikConnectionError(`Koneksi gagal ke ${this.baseUrl}: ${err.message}`, err);
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 401 || response.status === 403) {
      throw new DapodikAuthError('Akses ditolak saat POST ke WebService Dapodik.');
    }

    const rawText = await response.text();
    if (!response.ok) {
      throw new DapodikHttpError(response.status, response.statusText, cleanEndpoint, rawText);
    }

    try {
      const parsed = JSON.parse(rawText);
      return Array.isArray(parsed) ? { status: 'success', rows: parsed } : parsed;
    } catch {
      return { status: 'success', raw: rawText, rows: [] };
    }
  }

  /**
   * Mengirim data Mata Evaluasi Rapor (POST /WebService/postMatevRapor)
   */
  async postMatevRapor(body: any, params?: { semester_id?: string }): Promise<DapodikResponse<any>> {
    return this.post('postMatevRapor', body, params);
  }

  /**
   * Mengirim data Nilai Rapor (POST /WebService/postNilai)
   */
  async postNilai(
    body: any,
    params?: { semester_id?: string; table?: 'rapor' | string }
  ): Promise<DapodikResponse<any>> {
    return this.post('postNilai', body, { table: 'rapor', ...params });
  }

  /**
   * Memanggil endpoint kustom/tambahan WebService Dapodik
   */
  async customRequest<T = any>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<DapodikResponse<T>> {
    return this.request<T>(endpoint, params);
  }

  /**
   * Menarik seluruh data Peserta Didik secara otomatis dengan paging
   */
  async fetchAllPesertaDidik(options?: FetchAllOptions): Promise<DapodikPesertaDidik[]> {
    return fetchAllPages<DapodikPesertaDidik>(
      (page, limit) => this.getPesertaDidik({ page, limit }),
      options
    );
  }

  /**
   * Menarik seluruh data GTK secara otomatis dengan paging
   */
  async fetchAllGtk(options?: FetchAllOptions): Promise<DapodikGtk[]> {
    return fetchAllPages<DapodikGtk>(
      (page, limit) => this.getGtk({ page, limit }),
      options
    );
  }

  /**
   * Mengembalikan Async Iterator untuk streaming data Peserta Didik per-halaman
   */
  iteratePesertaDidik(limit: number = 100): AsyncGenerator<DapodikPesertaDidik[], void, unknown> {
    return paginateIterator<DapodikPesertaDidik>(
      (page, lim) => this.getPesertaDidik({ page, limit: lim }),
      limit
    );
  }

  /**
   * Mengembalikan Async Iterator untuk streaming data GTK per-halaman
   */
  iterateGtk(limit: number = 100): AsyncGenerator<DapodikGtk[], void, unknown> {
    return paginateIterator<DapodikGtk>(
      (page, lim) => this.getGtk({ page, limit: lim }),
      limit
    );
  }

  // =========================================================================
  // PHP SDK Aliases (Kompatibilitas dengan adereksisusanto/dapodik-api-php)
  // =========================================================================

  /**
   * Alias untuk `getSekolah()` (kompatibel dengan versi PHP `$dapodik->sekolah()`)
   */
  sekolah(params?: string | { semester_id?: string }): Promise<DapodikResponse<DapodikSekolah>> {
    return this.getSekolah(params);
  }

  /**
   * Alias untuk `getPengguna()` (kompatibel dengan versi PHP `$dapodik->pengguna()`)
   */
  pengguna(params?: PaginationParams): Promise<DapodikResponse<DapodikPengguna>> {
    return this.getPengguna(params);
  }

  /**
   * Alias untuk `getRombonganBelajar()` (kompatibel dengan versi PHP `$dapodik->rombel()`)
   */
  rombel(params?: string | RombelParams): Promise<DapodikResponse<DapodikRombonganBelajar>> {
    return this.getRombonganBelajar(params);
  }

  /**
   * Alias untuk `getPesertaDidik()` (kompatibel dengan versi PHP `$dapodik->pd()`)
   */
  pd(params?: PaginationParams): Promise<DapodikResponse<DapodikPesertaDidik>> {
    return this.getPesertaDidik(params);
  }

  /**
   * Alias untuk `getGtk()` (kompatibel dengan versi PHP `$dapodik->gtk()`)
   */
  gtk(params?: PaginationParams): Promise<DapodikResponse<DapodikGtk>> {
    return this.getGtk(params);
  }

  /**
   * Alias untuk `getMataPelajaran()`
   */
  mataPelajaran(params?: PaginationParams & { semester_id?: string }): Promise<DapodikResponse<any>> {
    return this.getMataPelajaran(params);
  }

  /**
   * Alias untuk `getMatevNilai()`
   */
  matevNilai(params?: PaginationParams & { semester_id?: string; a_dari_template?: number }): Promise<DapodikResponse<any>> {
    return this.getMatevNilai(params);
  }
}

/**
 * Factory class Dapodik (mirip pola penggunaan pada PHP SDK `new Dapodik($host, $port)->api($token, $npsn)`)
 */
export class Dapodik {
  public readonly host: string;
  public readonly port: string | number;
  public readonly timeout?: number;

  constructor(host?: string, port?: string | number, timeout?: number) {
    this.host = host || '127.0.0.1';
    this.port = port || 5774;
    this.timeout = timeout;
  }

  /**
   * Membuat instance WebService client dengan Token dan NPSN
   */
  api(token: string, npsn: string): DapodikClient {
    return new DapodikClient({
      host: this.host,
      port: this.port,
      token,
      npsn,
      timeout: this.timeout,
    });
  }
}

