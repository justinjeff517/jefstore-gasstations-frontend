"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-sm text-muted-foreground">Checking session...</p>;
  }

  if (session) {
    return (
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm">Hi, {session.user?.name || session.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 flex justify-end">
      <button
        onClick={() => signIn("github")}
        className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
      >
        Log In
      </button>
    </div>
  );
}
