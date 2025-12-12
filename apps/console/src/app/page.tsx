import { redirect } from 'next/navigation';

export default function Home() {
  // [ROUTING] Default entry point is the Lawyer CRM
  redirect('/crm');
}