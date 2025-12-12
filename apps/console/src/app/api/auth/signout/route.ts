import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Clear the session cookie
  cookies().delete("session");
  
  // If you use other cookies (like 'token'), delete them here too
  // cookies().delete("token");

  return NextResponse.json({ success: true });
}