import { describe, it, expect, vi } from 'vitest';
import { DapodikClient, Dapodik } from '../src/client';
import {
  DapodikAuthError,
  DapodikConnectionError,
  DapodikError,
  DapodikHttpError,
} from '../src/errors';
import { fetchAllPages, paginateIterator } from '../src/pagination';

describe('DapodikClient', () => {
  const sampleConfig = {
    baseUrl: 'http://192.168.1.50:5774/WebService',
    npsn: '20300001',
    token: 'secret-token-12345',
  };

  it('harus memvalidasi npsn dan token saat inisialisasi', () => {
    expect(() => new DapodikClient({ npsn: '', token: 'abc' })).toThrow(DapodikError);
    expect(() => new DapodikClient({ npsn: '123', token: '' })).toThrow(DapodikError);
  });

  it('harus mengirim header Authorization Bearer dan npsn query param', async () => {
    let requestedUrl = '';
    let authHeader = '';

    const mockFetch = vi.fn().mockImplementation(async (url: string, init: any) => {
      requestedUrl = url;
      authHeader = init?.headers?.['Authorization'] || '';
      return new Response(
        JSON.stringify({
          status: 'success',
          results: 1,
          rows: [{ sekolah_id: 'abc', nama: 'SMAN 1 Garung', npsn: '20300001' }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    const client = new DapodikClient({
      ...sampleConfig,
      fetch: mockFetch,
    });

    const result = await client.getSekolah();

    expect(requestedUrl).toContain('http://192.168.1.50:5774/WebService/getSekolah');
    expect(requestedUrl).toContain('npsn=20300001');
    expect(authHeader).toBe('Bearer secret-token-12345');
    expect(result.rows[0].nama).toBe('SMAN 1 Garung');
  });

  it('harus menormalisasi respons getSekolah jika rows berupa single object (bukan array)', async () => {
    let requestedUrl = '';
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      requestedUrl = url;
      return new Response(
        JSON.stringify({
          status: 'success',
          rows: { sekolah_id: 'abc-123', nama: 'SMA Negeri 1 Gedeg' },
        }),
        { status: 200 }
      );
    });

    const client = new DapodikClient({ ...sampleConfig, fetch: mockFetch });
    const result = await client.getSekolah('20241');

    expect(requestedUrl).toContain('semester_id=20241');
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].nama).toBe('SMA Negeri 1 Gedeg');
  });

  it('harus menyematkan semester_id pada getRombonganBelajar', async () => {
    let requestedUrl = '';

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      requestedUrl = url;
      return new Response(
        JSON.stringify({
          status: 'success',
          results: 1,
          rows: [{ rombongan_belajar_id: 'r1', nama: 'X-A', semester_id: '20241' }],
        }),
        { status: 200 }
      );
    });

    const client = new DapodikClient({ ...sampleConfig, fetch: mockFetch });
    const result = await client.getRombonganBelajar('20241');

    expect(requestedUrl).toContain('getRombonganBelajar');
    expect(requestedUrl).toContain('semester_id=20241');
    expect(result.rows[0].nama).toBe('X-A');
  });

  it('harus melempar DapodikAuthError saat status 401 atau 403', async () => {
    const mockFetch = vi.fn().mockImplementation(async () => {
      return new Response('Unauthorized', { status: 401 });
    });

    const client = new DapodikClient({ ...sampleConfig, fetch: mockFetch });

    await expect(client.getSekolah()).rejects.toThrow(DapodikAuthError);
  });

  it('harus melempar DapodikHttpError saat status HTTP non-2xx selain 401/403', async () => {
    const mockFetch = vi.fn().mockImplementation(async () => {
      return new Response('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    const client = new DapodikClient({ ...sampleConfig, fetch: mockFetch });

    await expect(client.getPesertaDidik()).rejects.toThrow(DapodikHttpError);
  });

  it('harus melempar DapodikConnectionError saat jaringan error', async () => {
    const mockFetch = vi.fn().mockImplementation(async () => {
      throw new TypeError('fetch failed: ECONNREFUSED');
    });

    const client = new DapodikClient({ ...sampleConfig, fetch: mockFetch });

    await expect(client.getGtk()).rejects.toThrow(DapodikConnectionError);
  });

  it('harus mendukung inisialisasi via Dapodik factory class dan alias PHP (sekolah, pd, gtk, rombel, pengguna)', async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('getSekolah')) {
        return new Response(JSON.stringify({ status: 'success', rows: [{ nama: 'SMA Negeri 1 Gedeg' }] }));
      }
      if (url.includes('getPesertaDidik')) {
        return new Response(JSON.stringify({ status: 'success', rows: [{ nama: 'Budi' }] }));
      }
      if (url.includes('getGtk')) {
        return new Response(JSON.stringify({ status: 'success', rows: [{ nama: 'Pak Guru' }] }));
      }
      if (url.includes('getRombonganBelajar')) {
        return new Response(JSON.stringify({ status: 'success', rows: [{ nama: 'XII MIPA 1' }] }));
      }
      if (url.includes('getPengguna')) {
        return new Response(JSON.stringify({ status: 'success', rows: [{ username: 'ops' }] }));
      }
      return new Response(JSON.stringify({ status: 'success', rows: [] }));
    });

    const dapodik = new Dapodik('127.0.0.1', 5774);
    const api = dapodik.api('my-token', '20300001');
    // Inject mockFetch
    (api as any).customFetch = mockFetch;

    const sekolah = await api.sekolah();
    expect(sekolah.rows[0].nama).toBe('SMA Negeri 1 Gedeg');

    const pd = await api.pd();
    expect(pd.rows[0].nama).toBe('Budi');

    const gtk = await api.gtk();
    expect(gtk.rows[0].nama).toBe('Pak Guru');

    const rombel = await api.rombel('20241');
    expect(rombel.rows[0].nama).toBe('XII MIPA 1');

    const pengguna = await api.pengguna();
    expect(pengguna.rows[0].username).toBe('ops');
  });

  it('harus mendukung getMataPelajaran dan getMatevNilai', async () => {
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('getMataPelajaran')) {
        return new Response(JSON.stringify({ status: 'success', rows: [{ mata_pelajaran_id: 1, nama: 'Matematika' }] }));
      }
      if (url.includes('getMatevNilai')) {
        return new Response(JSON.stringify({ status: 'success', rows: [{ id_evaluasi: 'eval-1', nama_mata_pelajaran: 'Matematika' }] }));
      }
      return new Response(JSON.stringify({ status: 'success', rows: [] }));
    });

    const client = new DapodikClient({ ...sampleConfig, fetch: mockFetch });
    const mapel = await client.getMataPelajaran({ semester_id: '20241' });
    expect(mapel.rows[0].nama).toBe('Matematika');

    const matev = await client.getMatevNilai({ semester_id: '20241', a_dari_template: 1 });
    expect(matev.rows[0].id_evaluasi).toBe('eval-1');
  });

  it('harus mendukung HTTP POST ke WebService serta helper postMatevRapor dan postNilai', async () => {
    let requestedUrl = '';
    let postBody = '';
    const mockFetch = vi.fn().mockImplementation(async (url: string, init: any) => {
      requestedUrl = url;
      postBody = init?.body;
      return new Response(JSON.stringify({ status: 'success', message: 'OK' }), { status: 200 });
    });

    const client = new DapodikClient({ ...sampleConfig, fetch: mockFetch });
    await client.postMatevRapor({ mata_evaluasi: [] }, { semester_id: '20241' });
    expect(requestedUrl).toContain('postMatevRapor');
    expect(requestedUrl).toContain('semester_id=20241');

    await client.postNilai([{ nilai: 90 }], { semester_id: '20241' });
    expect(requestedUrl).toContain('postNilai');
    expect(requestedUrl).toContain('table=rapor');
  });
});

describe('Pagination Helpers', () => {
  it('fetchAllPages harus mengambil semua halaman sampai habis', async () => {
    const mockData = [
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }, { id: 4 }],
      [{ id: 5 }], // total 5 items (limit 2, halaman 3 kurang dari limit -> stop)
    ];

    let pageCallCount = 0;
    const fetchPageFn = vi.fn().mockImplementation(async (page: number) => {
      pageCallCount++;
      const rows = mockData[page - 1] || [];
      return { status: 'success', rows };
    });

    const all = await fetchAllPages(fetchPageFn, { limit: 2 });

    expect(all).toHaveLength(5);
    expect(pageCallCount).toBe(3);
    expect(all.map((item) => item.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('paginateIterator harus meng-yield data per chunk/halaman', async () => {
    const mockData = [
      [{ id: 'a' }, { id: 'b' }],
      [{ id: 'c' }],
    ];

    const fetchPageFn = vi.fn().mockImplementation(async (page: number) => {
      return { status: 'success', rows: mockData[page - 1] || [] };
    });

    const chunks: any[][] = [];
    for await (const chunk of paginateIterator(fetchPageFn, 2)) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(2);
    expect(chunks[1]).toHaveLength(1);
  });
});
