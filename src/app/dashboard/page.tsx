import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin");

  return <div>Welcome, {session.user?.name}!</div>;
}
