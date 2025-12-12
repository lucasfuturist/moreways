// src/app/api/intake/forms/from-prompt/route.ts

import { createFormFromPromptRoute } from "@/intake/api/intake.api.createFormFromPromptRoute";
import { GetCurrentUserAsync } from "@/auth/svc/auth.svc.GetCurrentUserAsync";

export async function POST(req: Request) {
  // Inject the real (or stub) auth resolver here
  return createFormFromPromptRoute(req, {
    getCurrentUser: GetCurrentUserAsync
  });
}