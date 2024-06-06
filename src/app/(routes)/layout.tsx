import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { checkSubscription } from "@/lib/check-subscription";
import { ReactNode } from "react";

export default async function RoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isSubscribed = await checkSubscription();

  return (
    <div className="relative overflow-hidden">
      <Navbar isSubscribed={isSubscribed} />
      <div className="flex h-screen">
        <Sidebar isSubscribed={isSubscribed} />
        <main className="flex-1 overflow-x-hidden">
          <div className="flex flex-col h-full justify-between w-full px-4 sm:px-8 pt-6">
            <div className="max-w-7xl w-full mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
