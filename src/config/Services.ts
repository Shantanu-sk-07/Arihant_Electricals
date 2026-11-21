import type {
  ApiResponse,
  CalculatorRequest,
  CalculatorResult,
  CalculatorSettings,
  ContentSection,
  ContentUpdateRequest,
  Lead,
  LeadRequest,
  LoginRequest,
  LoginResponse,
  MediaAsset,
  SectionContent,
  SiteContent,
} from "../types";

const API_BASE: string =
  (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";

const TOKEN_KEY = "arihant_admin_token";

export const tokenStore = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
  isForm?: boolean;
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, auth = false, isForm = false } = options;

  const headers: Record<string, string> = {};
  if (!isForm) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = tokenStore.get();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body:
      body === undefined
        ? undefined
        : isForm
        ? (body as FormData)
        : JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const err = (await response.json()) as { message?: string };
      if (err?.message) {
        message = err.message;
      }
    } catch { /* empty */ }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function fetchPublicContent<T extends SectionContent>(
  section: ContentSection
): Promise<T> {
  const res = await request<ApiResponse<SiteContent>>(
    `/public/content/${section}`
  );
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load content");
  }
  return res.data.content as T;
}

export async function calculateSavings(
  payload: CalculatorRequest
): Promise<CalculatorResult> {
  const res = await request<ApiResponse<CalculatorResult>>("/calculator", {
    method: "POST",
    body: payload,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Calculation failed");
  }
  return res.data;
}

export async function submitLead(payload: LeadRequest): Promise<Lead> {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mljbwwra";

  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: payload.name,
        phone: payload.phone,
        message: payload.message,
      }),
    });
  } catch{
    console.warn("Formspree failed, but proceeding to WhatsApp.");
  }

  const vendorNumber = "917774855501";
  
  const formattedMessage = 
    `*Name:* ${payload.name}\n` +
    `*Phone:* ${payload.phone}\n` +
    `*Msg:* ${payload.message || "N/A"}`;

  const textMessage = encodeURIComponent(formattedMessage);

  window.open(`https://wa.me/${vendorNumber}?text=${textMessage}`, "_blank");

  return {
    ...payload,
    id: Date.now(),
    status: "new",
    createdAt: new Date().toISOString(),
  } as unknown as Lead;
}

export async function fetchMedia(): Promise<MediaAsset[]> {
  const res = await request<ApiResponse<MediaAsset[]>>("/public/media");
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load media");
  }
  return res.data;
}

export async function adminLogin(
  payload: LoginRequest
): Promise<LoginResponse> {
  const res = await request<ApiResponse<LoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Login failed");
  }
  tokenStore.set(res.data.token);
  return res.data;
}

export function adminLogout(): void {
  tokenStore.clear();
}

export async function fetchAllAdminContent(): Promise<SiteContent[]> {
  const res = await request<ApiResponse<SiteContent[]>>("/admin/content", {
    auth: true,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load content");
  }
  return res.data;
}

export async function updateContent(
  payload: ContentUpdateRequest
): Promise<SiteContent> {
  const res = await request<ApiResponse<SiteContent>>(
    `/admin/content/${payload.section}`,
    { method: "PUT", body: { content: payload.content }, auth: true }
  );
  if (!res.success || !res.data) {
    throw new Error(res.message || "Update failed");
  }
  return res.data;
}

export async function fetchAdminMedia(): Promise<MediaAsset[]> {
  const res = await request<ApiResponse<MediaAsset[]>>("/admin/media", {
    auth: true,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load media");
  }
  return res.data;
}

export async function uploadMedia(
  file: File,
  title: string
): Promise<MediaAsset> {
  const form = new FormData();
  form.append("file", file);
  form.append("title", title);
  const res = await request<ApiResponse<MediaAsset>>("/admin/media/upload", {
    method: "POST",
    body: form,
    auth: true,
    isForm: true,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Upload failed");
  }
  return res.data;
}

export async function deleteMedia(id: number): Promise<void> {
  const res = await request<ApiResponse<null>>(`/admin/media/${id}`, {
    method: "DELETE",
    auth: true,
  });
  if (!res.success) {
    throw new Error(res.message || "Delete failed");
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  const res = await request<ApiResponse<Lead[]>>("/admin/leads", {
    auth: true,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load leads");
  }
  return res.data;
}

export async function deleteLead(id: number): Promise<void> {
  const res = await request<ApiResponse<null>>(`/admin/leads/${id}`, {
    method: "DELETE",
    auth: true,
  });
  if (!res.success) {
    throw new Error(res.message || "Delete failed");
  }
}

export async function updateLeadStatus(
  id: number,
  status: Lead["status"]
): Promise<Lead> {
  const res = await request<ApiResponse<Lead>>(`/admin/leads/${id}/status`, {
    method: "PUT",
    body: { status },
    auth: true,
  });
  if (!res.success || !res.data) {
    throw new Error(res.message || "Status update failed");
  }
  return res.data;
}

export function leadsExportUrl(): string {
  return `${API_BASE}/admin/leads/export`;
}

export async function fetchCalculatorSettings(): Promise<CalculatorSettings> {
  const res = await request<ApiResponse<CalculatorSettings>>(
    "/admin/calculator-settings",
    { auth: true }
  );
  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to load settings");
  }
  return res.data;
}

export async function updateCalculatorSettings(
  payload: CalculatorSettings
): Promise<CalculatorSettings> {
  const res = await request<ApiResponse<CalculatorSettings>>(
    "/admin/calculator-settings",
    { method: "PUT", body: payload, auth: true }
  );
  if (!res.success || !res.data) {
    throw new Error(res.message || "Settings update failed");
  }
  return res.data;
}