import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers"; 
import { env } from "@/infra/config/infra.svc.envConfig";
import { db } from "@/infra/db/infra.repo.dbClient";
import type { User } from "../schema/auth.schema.UserTypes";
import { logger } from "@/infra/logging/infra.svc.logger";

// Initialize Supabase client
const supabase = (env.supabaseUrl && env.supabaseAnonKey) 
  ? createClient(env.supabaseUrl, env.supabaseAnonKey) 
  : null;

export async function GetCurrentUserAsync(req: Request): Promise<User | null> {
  // 1. [DEV FALLBACK]
  if (!supabase) {
    logger.warn("[Auth] Supabase keys missing. Returning Demo User.");
    return {
      id: "dev_user_01",
      organizationId: "org_default_local",
      email: "demo@argueos.com",
      role: "admin", 
    };
  }

  // 2. Extract Token (Priority: Header -> Cookie)
  let token: string | undefined;

  // A. Check Authorization Header
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
    // logger.debug("[Auth] Found token in Header");
  }

  // B. Check Cookies
  if (!token) {
    const cookieStore = cookies();
    const cookie = cookieStore.get("sb-access-token");
    if (cookie) {
        token = cookie.value;
        // logger.debug("[Auth] Found token in Cookie");
    } else {
        logger.warn("[Auth] No 'sb-access-token' cookie found.");
        // Debug: List all available cookies to see if we have a mismatch
        // const allCookies = cookieStore.getAll().map(c => c.name).join(", ");
        // logger.debug(`[Auth] Available cookies: ${allCookies}`);
    }
  }

  if (!token) {
      logger.warn("[Auth] Authentication failed: No token provided.");
      return null;
  }

  // 3. Verify with Supabase
  const { data: { user: sbUser }, error } = await supabase.auth.getUser(token);

  if (error || !sbUser || !sbUser.email) {
    logger.error("[Auth] Supabase Token Validation Failed", { error: error?.message });
    return null;
  }

  // 4. Match with Internal User Table
  const internalUser = await db.user.findUnique({
    where: { email: sbUser.email }
  });

  if (!internalUser) {
    logger.warn("[Auth] User authenticated in Supabase but not found in local DB", { email: sbUser.email });
    return null;
  }

  return {
    id: internalUser.id,
    organizationId: internalUser.organizationId,
    email: internalUser.email,
    role: internalUser.role === "SUPER_ADMIN" ? "admin" : "staff",
  };
}