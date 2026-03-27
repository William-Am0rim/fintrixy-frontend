import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function getAuthHeaders(): Promise<HeadersInit> {
  const session = await getServerSession(authOptions);
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const apiToken = (session as any)?.apiToken;
  if (apiToken) {
    headers["Authorization"] = `Bearer ${apiToken}`;
  }

  return headers;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  success?: boolean;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    return { 
      success: false,
      error: data.message || data.error || "Erro na requisição", 
      status: response.status 
    };
  }

  return { 
    success: true,
    data: data.data || data, 
    status: response.status 
  };
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error("API GET Error:", error);
    return { error: "Erro de conexão", status: 500 };
  }
}

export async function apiPost<T, D = unknown>(
  endpoint: string,
  body: D
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error("API POST Error:", error);
    return { error: "Erro de conexão", status: 500 };
  }
}

export async function apiPut<T, D = unknown>(
  endpoint: string,
  body: D
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error("API PUT Error:", error);
    return { error: "Erro de conexão", status: 500 };
  }
}

export async function apiDelete(endpoint: string): Promise<ApiResponse<void>> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, error: data.message || "Erro na requisição", status: response.status };
    }

    return { success: true, status: response.status };
  } catch (error) {
    console.error("API DELETE Error:", error);
    return { error: "Erro de conexão", status: 500 };
  }
}
