import { PublicFormResponse } from "@/lib/types/argueos-types";

// Note: For Server Components (fetching the form definition), we still use the direct URL + Key.
// For Client Components (Submitting), we use the local Proxy paths.
const SERVER_API_BASE = process.env.SERVER_API_BASE || "http://localhost:3001/api/public/v1";
const SERVER_API_KEY = process.env.ARGUEOS_API_KEY_PUBLIC || "";

class ArgueOSClient {
  /**
   * [SERVER SIDE] Fetch form definition.
   * This is called by page.tsx (Server Component), so it can access secrets safely.
   */
  async getFormBySlug(slug: string): Promise<PublicFormResponse | null> {
    try {
       console.log("[ArgueOSClient] Attempting to use API Key:", `'${SERVER_API_KEY}'`);
      // Server-to-Server call
      const res = await fetch(`${SERVER_API_BASE}/forms?slug=${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SERVER_API_KEY, 
        },
        // [FIX] Disable cache to prevent stale data (missing 'schema' key) during dev
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
   * [CLIENT SIDE] Submit form.
   * This is called by UnifiedRunner (Client Component).
   * It hits the LOCAL proxy to hide the API Key.
   */
  async submitForm(payload: { formId: string; orgId: string; data: any }) {
    // Call local Next.js API route
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