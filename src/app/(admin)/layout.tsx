import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCartCount } from "@/actions/cart";
import { Navbar } from "@/components/layout/navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const cartCount = await getCartCount();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar cartCount={cartCount} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
