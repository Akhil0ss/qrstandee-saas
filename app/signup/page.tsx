import { redirect } from 'next/navigation';

export default function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const redirectUrl = searchParams.redirect ? `&redirect=${encodeURIComponent(String(searchParams.redirect))}` : '';
  redirect(`/login?tab=signup${redirectUrl}`);
}
