import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession()


  return (
    <main>
      <h1>Profile dashboard</h1>
      {
        status === "authenticated"
          ? <p>
            Signed in as {session.user.email}. <button onClick={() => signOut()}>Sign out</button><br />
            <a href="http://localhost:3000">Task management dashboard</a>
          </p>
          : <a href="/api/auth/signin">Sign in</a>
      }
    </main>
  );
}
