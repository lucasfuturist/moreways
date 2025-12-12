import { NextResponse } from "next/server";
import { authService } from "@/auth/svc/auth.service";

export async function POST() {
  // Clears the HTTP-only cookie
  await authService.logout();
  return NextResponse.json({ success: true });
}