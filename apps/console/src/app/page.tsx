import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root traffic to the login page
  redirect("/login");
}