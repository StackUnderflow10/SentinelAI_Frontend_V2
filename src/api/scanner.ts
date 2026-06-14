import type { MediaScanResult, NewsResult, LoginCredentials, AuthUser } from "../types";


const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

const TOKEN_KEY = "sentinel_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const formData = new URLSearchParams();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({ email: credentials.username, password: credentials.password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? "Invalid credentials. Please try again.");
  }

  const data = await res.json();
  const token: string = data.access_token ?? data.token;
  setToken(token);
  return { username: credentials.username, token };
}

export async function logout(): Promise<void> {
  clearToken();
}

// ---------------------------------------------------------------------------
// Media analysis
// ---------------------------------------------------------------------------

export async function analyseUpload(file: File): Promise<MediaScanResult> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/analyse/analyse_upload`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: fd,
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Session expired. Please log in again.");
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? "Upload analysis failed. Try again.");
  }

  return res.json();
}

export async function analyseUrl(
  url: string,
  type: "image" | "video"
): Promise<MediaScanResult> {
  const res = await fetch(`${API_BASE}/analyse/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ input: url, type }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Session expired. Please log in again.");
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? "URL analysis failed. Try again.");
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// Fact-checking
// ---------------------------------------------------------------------------

export async function factCheck(headline: string): Promise<NewsResult> {
  const res = await fetch(`${API_BASE}/factcheck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ headline }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Session expired. Please log in again.");
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail ?? "Fact-check failed. Try again.");
  }

  return res.json();
}