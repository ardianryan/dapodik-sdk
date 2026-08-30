/**
 * Base Error untuk Dapodik SDK
 */
export class DapodikError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = 'DAPODIK_ERROR') {
    super(message);
    this.name = 'DapodikError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error saat HTTP request gagal (status code non-2xx)
 */
export class DapodikHttpError extends DapodikError {
  public readonly statusCode: number;
  public readonly statusText: string;
  public readonly endpoint: string;
  public readonly rawBody?: string;

  constructor(
    statusCode: number,
    statusText: string,
    endpoint: string,
    rawBody?: string
  ) {
    super(
      `Dapodik API HTTP ${statusCode} (${statusText}) saat memanggil endpoint '${endpoint}'`,
      'DAPODIK_HTTP_ERROR'
    );
    this.name = 'DapodikHttpError';
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.endpoint = endpoint;
    this.rawBody = rawBody;
  }
}

/**
 * Error autentikasi (token tidak valid, token belum didaftarkan di WebService Dapodik)
 */
export class DapodikAuthError extends DapodikError {
  constructor(message: string = 'Autentikasi gagal. Pastikan token dan IP client sudah didaftarkan di Pengaturan WebService Dapodik.') {
    super(message, 'DAPODIK_AUTH_ERROR');
    this.name = 'DapodikAuthError';
  }
}

/**
 * Error koneksi jaringan atau timeout saat menghubungi server Dapodik
 */
export class DapodikConnectionError extends DapodikError {
  public readonly originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message, 'DAPODIK_CONNECTION_ERROR');
    this.name = 'DapodikConnectionError';
    this.originalError = originalError;
  }
}
