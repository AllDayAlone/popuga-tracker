import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return <p>Signed in as {session.user.email}. <button onClick={() => signOut()}>Sign out</button></p>
  }

  return <a href="/api/auth/signin">Sign in</a>
}
