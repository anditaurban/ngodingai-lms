import Cookies from 'js-cookie';

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud',
  regionUrl: process.env.NEXT_PUBLIC_REGION_API_URL || 'https://region.katib.cloud',
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
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

  if (service === 'region') {
    url = `${API_CONFIG.regionUrl}/${cleanEndpoint}`;
  } else {
    url = `${API_CONFIG.baseUrl}/${cleanEndpoint}`;
  }

  // --- PERBAIKAN TOKEN AUTHENTICATION ---
  const token = Cookies.get('token');
  const authHeaders: Record<string, string> = {};
  
  if (token) {
    // Pastikan token dikirim sebagai String yang valid
    // Beberapa backend butuh 'Bearer ', beberapa tidak. 
    // Default standar industri adalah 'Bearer <token>'
    authHeaders['Authorization'] = `Bearer ${token}`; 
  } else {
     // Log warning jika mencoba akses endpoint private tanpa token
     console.warn("API Call Warning: No Token found in cookies.");
  }

  const configHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Tambahkan Accept header
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
      if (response.status === 401) {
        console.error("Unauthorized: Token Invalid or Expired");
        // Opsional: window.location.href = '/'; // Auto logout jika token basi
      }
      throw new Error(data.message || `API Error ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Fail [${url}]:`, error);
    throw error;
  }
};