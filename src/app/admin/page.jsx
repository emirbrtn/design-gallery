import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPanelClient from "@/components/AdminPanelClient";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;

  if (!verifyAdminSessionToken(token)) {
    redirect("/admin-login");
  }

  return <AdminPanelClient />;
}
