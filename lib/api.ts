import Cookies from 'js-cookie';

// Load Config
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud',
  regionUrl: process.env.NEXT_PUBLIC_REGION_API_URL || 'https://region.katib.cloud',
  // Pastikan ini 4409 sesuai instruksi Anda sebelumnya
  ownerId: process.env.NEXT_PUBLIC_APP_ID || '4409', 
};

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  service?: 'main' | 'region';
}

export const apiCall = async (endpoint: string, options: FetchOptions = {}) => {
  const { method = 'GET', body, headers = {}, service = 'main' } = options;

  let url = '';
  
  if (service === 'region') {
    // FORMULA URL REGION: https://region.katib.cloud/table/region/{ownerId}/1?search={keyword}
    // Kita pastikan tidak ada double slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    url = `${API_CONFIG.regionUrl}/${cleanEndpoint}`;
  } else {
    // API Utama
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    url = `${API_CONFIG.baseUrl}/${cleanEndpoint}`;
  }

  // Ambil token jika ada (untuk API Utama biasanya butuh)
  const token = Cookies.get('token');
  const authHeaders: Record<string, string> = {};
  
  // Region API biasanya public atau pakai ownerId di URL, tapi jika butuh token:
  if (token && service === 'main') {
    authHeaders['Authorization'] = `Bearer ${token}`; 
  }

  const configHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers: configHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Error [${url}]:`, error);
    throw error;
  }
};