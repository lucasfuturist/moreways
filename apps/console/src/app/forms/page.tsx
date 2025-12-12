import { redirect } from 'next/navigation';

export default function FormsIndexPage() {
  // [SECURITY] The separate "My Forms" dashboard is deprecated for standard users.
  // Form management is now exclusively handled in the Admin Ops Center.
  redirect('/admin');
}