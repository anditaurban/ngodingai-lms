import Cookies from 'js-cookie';

export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dev.katib.cloud',
  regionUrl: process.env.NEXT_PUBLIC_REGION_API_URL || 'https://region.katib.cloud',
  ownerId: process.env.NEXT_PUBLIC_APP_ID || '4409',
};

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  service?: 'main' | 'region'; 
  skipAuth?: boolean;
}

export const apiCall = async (endpoint: string, options: FetchOptions = {}) => {
  // Tambahkan skipAuth ke destrukturisasi (default: false)
  const { method = 'GET', body, headers = {}, service = 'main', skipAuth = false } = options;

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
  
  // LOGIKA EMAS: HANYA pasang token JIKA token ada DAN skipAuth bernilai false
  if (token && !skipAuth) {
    authHeaders['Authorization'] = `Bearer ${token}`; 
  } else if (!token && !skipAuth) {
     console.warn(`API Call Warning: No Token found for protected route [${cleanEndpoint}].`);
  }

  const configHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...authHeaders, 
    ...headers,
  };

  try {
    const response = await fetch(url, {
      method,
      headers: configHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Menangani kasus jika server merespons dengan HTML (bukan JSON) saat error
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      if (response.status === 401) {
        console.error(`Unauthorized [${cleanEndpoint}]: Token Invalid, Expired, or Endpoint requires different Auth.`);
      }
      throw new Error(data.message || `API Error ${response.status}`);
    }

    return data;
  } catch (error: any) {
    console.error(`API Fail [${url}]:`, error);
    throw error;
  }
};