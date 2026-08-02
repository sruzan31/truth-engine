import { AnalysisResult, DashboardStats } from '../types';

// Determine the API base URL dynamically without hardcoding localhost inside components
const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (process.env.NODE_ENV === 'production') {
    // In production, only use configuration from env variables.
    return '';
  }
  // Development default
  return 'http://localhost:8000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

// Custom descriptive error class for rich API error details
export class ApiError extends Error {
  status?: number;
  statusText?: string;
  detail?: string;

  constructor(message: string, status?: number, statusText?: string, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.detail = detail;
  }
}

// Helper to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Reusable fetch request client with timeout and retry logic
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const {
    timeoutMs = 15000, // 15 seconds default timeout
    retries = 3,       // Retry 3 times
    retryDelayMs = 1000,
    headers,
    ...fetchOptions
  } = options;

  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      if (attempt > 0) {
        console.warn(`API retry connection to ${url} (Attempt ${attempt}/${retries})`);
        await delay(retryDelayMs * attempt);
      }

      const defaultHeaders: Record<string, string> = {};
      if (!(fetchOptions.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...defaultHeaders,
          ...headers,
        } as Record<string, string>,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let detail = '';
        try {
          const errData = await response.json();
          detail = errData.detail || JSON.stringify(errData);
        } catch {
          // Fallback if response body is not JSON or empty
        }

        const errorMsg = detail || `HTTP error ${response.status}`;
        console.error(`API failure [${response.status}] on ${url}: ${errorMsg}`);

        throw new ApiError(errorMsg, response.status, response.statusText, detail);
      }

      return (await response.json()) as T;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      const err = error as Error;
      if (err.name === 'AbortError') {
        lastError = new ApiError(`Request timeout after ${timeoutMs}ms`, 408, 'Request Timeout');
        console.error(`API request timeout: ${url}`);
      } else {
        lastError = err;
        console.error(`API connection failed for ${url}: ${err.message}`);
      }

      // Do NOT retry for client-side errors (400-499)
      const isClientError =
        error instanceof ApiError &&
        error.status !== undefined &&
        error.status >= 400 &&
        error.status < 500;

      if (isClientError) {
        throw error;
      }

      // Break loop if maximum retries reached
      if (attempt === retries) {
        break;
      }
    }
  }

  throw lastError || new ApiError('Service temporarily unavailable.');
}

export const apiService = {
  async checkHealth(): Promise<{ status: string; api: string }> {
    const rootUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    return request<{ status: string; api: string }>(`${rootUrl}/health`, {
      method: 'GET',
      credentials: 'include',
      timeoutMs: 3000,
      retries: 0,
    });
  },

  async getServerStatus(): Promise<{
    status: string;
    mock_mode: {
      gemini: boolean;
      virustotal: boolean;
      safebrowsing: boolean;
      mongodb: boolean;
    };
  }> {
    const rootUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
    return request<{
      status: string;
      mock_mode: {
        gemini: boolean;
        virustotal: boolean;
        safebrowsing: boolean;
        mongodb: boolean;
      };
    }>(`${rootUrl}/`, {
      method: 'GET',
      credentials: 'include',
      timeoutMs: 3000,
      retries: 0,
    });
  },

  async analyzeUrl(url: string, userId?: string | null): Promise<AnalysisResult> {
    return request<AnalysisResult>('/analyze/url', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ url, user_id: userId }),
    });
  },

  async analyzeText(text: string, userId?: string | null): Promise<AnalysisResult> {
    return request<AnalysisResult>('/analyze/text', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ text, user_id: userId }),
    });
  },

  async analyzeEmail(
    subject: string,
    body: string,
    sender?: string,
    headers?: string,
    userId?: string | null
  ): Promise<AnalysisResult> {
    return request<AnalysisResult>('/analyze/email', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ subject, body, sender, headers, user_id: userId }),
    });
  },

  async analyzeImage(file: File, userId?: string | null): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }
    return request<AnalysisResult>('/analyze/image', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  },

  async analyzeQr(file: File, userId?: string | null): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }
    return request<AnalysisResult>('/analyze/qr', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  },

  async analyzePdf(file: File, userId?: string | null): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }
    return request<AnalysisResult>('/analyze/pdf', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  },

  async getHistory(userId?: string | null): Promise<AnalysisResult[]> {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return request<AnalysisResult[]>(`/history${query}`, {
      method: 'GET',
      credentials: 'include',
    });
  },

  async getScanResult(scanId: string): Promise<AnalysisResult> {
    return request<AnalysisResult>(`/history/${scanId}`, {
      method: 'GET',
      credentials: 'include',
    });
  },

  async getDashboardStats(userId?: string | null): Promise<DashboardStats> {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    return request<DashboardStats>(`/dashboard/stats${query}`, {
      method: 'GET',
      credentials: 'include',
    });
  },
};

export default apiService;
