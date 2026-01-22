export const dynamic = "force-dynamic";

import { requireAuth  } from "@/lib/session";
import UserProvider from "@/context/UserContext";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAuth();
  return (
    <UserProvider user={user}>
      {children}
    </UserProvider>
  );
}