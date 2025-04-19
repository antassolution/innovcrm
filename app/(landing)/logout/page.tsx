import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Logout() {
  // Clear cookies on the server side
  const cookieStore = cookies();
  cookieStore.getAll().forEach(({ name }) => {
    cookieStore.set(name, '', { expires: new Date(0) });
  });

  // Redirect to the home page
  redirect('/');

  return null;
}