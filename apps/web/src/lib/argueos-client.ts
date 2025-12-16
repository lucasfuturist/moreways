import { PublicFormResponse } from "@/lib/types/argueos-types";

const SERVER_API_BASE =
  process.env.SERVER_API_BASE || "http://localhost:3001/api/public/v1";
const SERVER_API_KEY = process.env.ARGUEOS_API_KEY_PUBLIC || "";

class ArgueOSClient {
  /**
   * [SERVER SIDE] Fetch a single published form by slug.
   */
  async getFormBySlug(slug: string): Promise<PublicFormResponse | null> {
    try {
      const res = await fetch(`${SERVER_API_BASE}/forms?slug=${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SERVER_API_KEY,
        },
        cache: "no-store",
      });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to fetch form: ${res.statusText}`);

      return await res.json();
    } catch (error) {
      console.error("[ArgueOSClient] getFormBySlug error:", error);
      return null;
    }
  }

  /**
   * [SERVER SIDE] Fetch global published form catalog.
   * Used by chat router.
   */
  async listForms(): Promise<
    { id: string; slug: string | null; name: string }[]
  > {
    const res = await fetch(`${SERVER_API_BASE}/forms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SERVER_API_KEY,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch form catalog");
    }

    return await res.json();
  }

  /**
   * [CLIENT SIDE] Submit form via local proxy.
   */
  async submitForm(payload: { formId: string; orgId: string; data: any }) {
    const res = await fetch(`/api/intake/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Submission failed");
    }

    return await res.json();
  }
}

export const argueosClient = new ArgueOSClient();
