import { DapodikResponse } from './types';

export interface FetchAllOptions {
  /**
   * Jumlah item per request (default: 100)
   */
  limit?: number;

  /**
   * Halaman awal penarikan data (default: 1)
   */
  startPage?: number;

  /**
   * Batas maksimal halaman yang akan ditarik (berguna untuk testing/safety)
   */
  maxPages?: number;

  /**
   * Jeda (delay) antar request dalam milidetik untuk mencegah rate limiting / beban tinggi di server Dapodik
   */
  delayMs?: number;

  /**
   * Callback progress penarikan data
   */
  onProgress?: (page: number, fetchedInPage: number, totalFetched: number) => void;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Menarik seluruh data halaman secara rekursif/iteratif hingga tidak ada data lagi
 */
export async function fetchAllPages<T>(
  fetchPageFn: (page: number, limit: number) => Promise<DapodikResponse<T>>,
  options: FetchAllOptions = {}
): Promise<T[]> {
  const limit = options.limit ?? 100;
  let page = options.startPage ?? 1;
  const maxPages = options.maxPages ?? Infinity;
  const delayMs = options.delayMs ?? 0;

  const allItems: T[] = [];
  let pageCount = 0;

  while (pageCount < maxPages) {
    const response = await fetchPageFn(page, limit);
    const rows = response.rows || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      break;
    }

    allItems.push(...rows);
    pageCount++;

    if (options.onProgress) {
      options.onProgress(page, rows.length, allItems.length);
    }

    // Jika jumlah rows yang dikembalikan kurang dari limit, berarti ini halaman terakhir
    if (rows.length < limit) {
      break;
    }

    page++;

    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }

  return allItems;
}

/**
 * Mengembalikan Async Generator untuk memproses data halaman per halaman (chunk/stream)
 */
export async function* paginateIterator<T>(
  fetchPageFn: (page: number, limit: number) => Promise<DapodikResponse<T>>,
  limit: number = 100,
  startPage: number = 1
): AsyncGenerator<T[], void, unknown> {
  let page = startPage;

  while (true) {
    const response = await fetchPageFn(page, limit);
    const rows = response.rows || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      break;
    }

    yield rows;

    if (rows.length < limit) {
      break;
    }

    page++;
  }
}
