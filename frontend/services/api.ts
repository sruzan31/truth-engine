import { AnalysisResult, DashboardStats } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const apiService = {
  async analyzeUrl(url: string, userId?: string | null): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/analyze/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, user_id: userId }),
    });
    return handleResponse<AnalysisResult>(response);
  },

  async analyzeText(text: string, userId?: string | null): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/analyze/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, user_id: userId }),
    });
    return handleResponse<AnalysisResult>(response);
  },

  async analyzeEmail(
    subject: string,
    body: string,
    sender?: string,
    headers?: string,
    userId?: string | null
  ): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/analyze/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, body, sender, headers, user_id: userId }),
    });
    return handleResponse<AnalysisResult>(response);
  },

  async analyzeImage(file: File, userId?: string | null): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await fetch(`${API_BASE_URL}/analyze/image`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AnalysisResult>(response);
  },

  async analyzeQr(file: File, userId?: string | null): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await fetch(`${API_BASE_URL}/analyze/qr`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AnalysisResult>(response);
  },

  async analyzePdf(file: File, userId?: string | null): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('user_id', userId);
    }

    const response = await fetch(`${API_BASE_URL}/analyze/pdf`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AnalysisResult>(response);
  },

  async getHistory(userId?: string | null): Promise<AnalysisResult[]> {
    const url = new URL(`${API_BASE_URL}/history`);
    if (userId) {
      url.searchParams.append('user_id', userId);
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
    });
    return handleResponse<AnalysisResult[]>(response);
  },

  async getScanResult(scanId: string): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/history/${scanId}`, {
      method: 'GET',
    });
    return handleResponse<AnalysisResult>(response);
  },

  async getDashboardStats(userId?: string | null): Promise<DashboardStats> {
    const url = new URL(`${API_BASE_URL}/dashboard/stats`);
    if (userId) {
      url.searchParams.append('user_id', userId);
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
    });
    return handleResponse<DashboardStats>(response);
  },
};
export default apiService;
