import type { InquiryPostResult } from "@/types/catalog";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

const FETCH_INIT: RequestInit = {
  cache: "no-store",
  headers: { Accept: "application/json" },
};

export class ApiDownError extends Error {
  constructor(message = "The travel desk could not be reached.") {
    super(message);
    this.name = "ApiDownError";
  }
}

export async function apiGetJson(path: string, init: RequestInit = {}) {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...FETCH_INIT,
      ...init,
      headers: {
        ...(FETCH_INIT.headers as Record<string, string>),
        ...(init.headers as Record<string, string> | undefined),
      },
    });
  } catch {
    throw new ApiDownError();
  }
  const json = await res.json().catch(() => null);
  return { res, json };
}

export async function postInquiry(payload: Record<string, unknown>): Promise<InquiryPostResult> {
  const paths = ["/pub/inquiries", "/pub/trip-requests", "/inquiries"];
  let sawNetwork = false;
  for (const path of paths) {
    let res: Response;
    try {
      res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        cache: "no-store",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      sawNetwork = true;
    } catch {
      continue;
    }
    if (res.ok) {
      return { status: "sent" };
    }
    if (res.status === 404 || res.status === 405) {
      continue;
    }
    const json = await res.json().catch(() => null);
    return {
      status: "error",
      message: json?.message || "The desk could not take that note.",
    };
  }
  if (!sawNetwork) {
    return { status: "error", message: "The travel desk could not be reached." };
  }
  return {
    status: "pending",
    message:
      "No public inquiry endpoint is on the API yet. Your note was validated here and was not sent.",
  };
}
