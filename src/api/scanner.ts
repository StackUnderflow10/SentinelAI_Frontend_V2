import { MediaScanResult, NewsResult } from '../types';

const API_BASE = "http://localhost:8000"; // Change this to your deployed URL later

// Helper to grab token if you have a login state
const getHeaders = (isJson = false) => {
  const token = localStorage.getItem("access_token"); // Update based on your auth state
  const headers: HeadersInit = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export async function analyseUpload(file: File): Promise<MediaScanResult> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/analyse/analyse_upload`, {
    method: "POST",
    headers: getHeaders(false),
    body: fd,
  });
  
  if (!res.ok) throw new Error((await res.json()).detail || "Upload failed");
  return res.json();
}

export async function analyseUrl(url: string, type: "image" | "video"): Promise<MediaScanResult> {
  const res = await fetch(`${API_BASE}/analyse/url`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ input: url, type }),
  });
  
  if (!res.ok) throw new Error((await res.json()).detail || "URL analysis failed");
  return res.json();
}

export async function factCheck(headline: string): Promise<NewsResult> {
  const res = await fetch(`${API_BASE}/factcheck`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({ headline }),
  });
  
  if (!res.ok) throw new Error((await res.json()).detail || "Fact check failed");
  return res.json();
}