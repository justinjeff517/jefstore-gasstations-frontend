"use client";

import { useSession } from "next-auth/react";
import AuthButtons from "@/components/AuthButtons";

export default function SessionInfo() {
  const { data: session } = useSession();

  return (
    <div className="space-y-2">
      <AuthButtons />
      {session?.user && (
        <div className="rounded-md border p-3 text-sm">
          <p><strong>Name:</strong> {session.user.name}</p>
          <p><strong>Email:</strong> {session.user.email}</p>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="mt-2 h-12 w-12 rounded-full border"
            />
          )}
        </div>
      )}
    </div>
  );
}
