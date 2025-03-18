import { Sidebar } from "@/components/sidebar/index";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const domains = user
    ? await prisma.domain.findMany({
        where: {
          user: {
            clerkId: user.id,
          },
        },
        select: {
          id: true,
          name: true,
          icon: true,
        },
      })
    : [];

  return (
    <div className="flex h-screen w-full">
      <Sidebar domains={domains} />
      <main className="w-full h-screen flex flex-col pl-20 md:pl-4">
        {children}
      </main>
    </div>
  );
}
