import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/infra/config/infra.svc.envConfig";
import { db } from "@/infra/db/infra.repo.dbClient";
import type { User } from "../schema/auth.schema.UserTypes";
import { logger } from "@/infra/logging/infra.svc.logger";

// This file-level client is for general use, but NOT for admin actions.
const supabase = (env.supabaseUrl && env.supabaseAnonKey)
  ? createClient(env.supabaseUrl, env.supabaseAnonKey)
  : null;

export async function GetCurrentUserAsync(req: Request): Promise<User | null> {
  // 1. [DEV FALLBACK]
  // This remains the same. If no keys are present, return a mock user.
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
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
  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
  }
  if (!token) {
    const cookieStore = cookies();
    const cookie = cookieStore.get("sb-access-token"); // Ensure this matches your Supabase client settings
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) {
    logger.warn("[Auth] Authentication failed: No token provided.");
    return null;
  }

  // 3. [THE FIX] Verify Token with Supabase using the SERVICE ROLE KEY
  // We create a temporary, privileged client here for this server-side action.
  const supabaseAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey);
  const { data: { user: sbUser }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !sbUser || !sbUser.email) {
    logger.error("[Auth] Supabase Token Validation Failed", { error: error?.message });
    // This is where it was failing before.
    return null;
  }

  // 4. Match with Internal User Table
  // This part of your code was already correct.
  const internalUser = await db.user.findUnique({
    where: { email: sbUser.email }
  });

  if (!internalUser) {
    logger.warn("[Auth] User authenticated in Supabase but not found in local DB", { email: sbUser.email });
    return null;
  }

  // 5. Return the mapped, authorized user context.
  logger.info("[Auth] User successfully authenticated", { email: internalUser.email, role: internalUser.role });
  return {
    id: internalUser.id,
    organizationId: internalUser.organizationId,
    email: internalUser.email,
    // This mapping from your database role to the application role is correct.
    role: internalUser.role === "SUPER_ADMIN" ? "admin" : "staff",
  };
}