"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import CommentManager from "@/components/admin/comments/commentManager";
import RouteSelector from "@/components/admin/routeSelector";
import Navbar from "@/components/navbar/Navbar";
import QRCodeGenerator from "@/components/admin/qrCode/qrCodeGenerator";
import PasswordManager from "@/components/admin/user/passwordManager";
import UserManager from "@/components/admin/user/userManager";
import CategoryManager from "@/components/admin/category/categoryManager";
import MenuItemManager from "@/components/admin/menuItem/menuItemManager";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Don't render anything until we check authentication
  if (!isClient || status === "loading") {
    return <AdminSkeleton />;
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <main className="min-h-screen bg-off-white from-amber-50 to-white">
      <Navbar />
      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <Tabs
          defaultValue="categories"
          className="w-full flex flex-col lg:flex-row-reverse gap-6"
        >
          <TabsList className="flex flex-wrap lg:flex-col lg:justify-start h-auto lg:h-[500px] w-full lg:w-48 bg-amber-100 text-text_royal_green p-1 lg:p-2 lg:shrink-0 rounded-lg">
            {isAdmin && (
              <TabsTrigger
                value="categories"
                className="flex-grow px-2 lg:flex-grow-0 lg:justify-end lg:w-full lg:mb-1"
              >
                دسته‌بندی‌ها
              </TabsTrigger>
            )}
            <TabsTrigger
              value="items"
              className="flex-grow px-2 lg:flex-grow-0 lg:justify-end lg:w-full lg:mb-1"
            >
              آیتم‌ها
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="comments"
                className="flex-grow px-2 lg:flex-grow-0 lg:justify-end lg:w-full lg:mb-1"
              >
                نظرات
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger
                value="qr"
                className="flex-grow px-2 lg:flex-grow-0 lg:justify-end lg:w-full lg:mb-1"
              >
                کیوآر
              </TabsTrigger>
            )}
            {isAdmin && (
              <TabsTrigger
                value="users"
                className="flex-grow px-2 lg:flex-grow-0 lg:justify-end lg:w-full lg:mb-1"
              >
                اکانت‌ها
              </TabsTrigger>
            )}
          </TabsList>
          <div className="flex-1">
            {isAdmin && (
              <TabsContent
                value="categories"
                className="space-y-6 data-[state=active]:block"
              >
                <h1 className="text-xl font-bold text-text_royal_green font-doran text-center lg:text-end ">
                  مدیریت دسته‌بندی‌ها
                </h1>
                <Suspense fallback={<CommentSkeleton />}>
                  <CategoryManager />
                </Suspense>
              </TabsContent>
            )}
            <TabsContent
              value="items"
              className="space-y-6 data-[state=active]:block"
            >
              <h1 className="text-xl font-bold text-text_royal_green font-doran text-center lg:text-end ">
                مدیریت آیتم‌ها
              </h1>
              <Suspense fallback={<CommentSkeleton />}>
                <MenuItemManager isAdmin={isAdmin} />
              </Suspense>
            </TabsContent>
            {isAdmin && (
              <TabsContent
                value="comments"
                className="space-y-6 data-[state=active]:block"
              >
                <h1 className="text-xl font-bold text-text_royal_green font-doran text-center lg:text-end ">
                  نظرات
                </h1>
                <Suspense fallback={<CommentSkeleton />}>
                  <CommentManager />
                </Suspense>
              </TabsContent>
            )}
            {isAdmin && (
              <TabsContent
                value="qr"
                className="space-y-6 data-[state=active]:block"
              >
                <h1 className="text-xl font-bold text-text_royal_green font-doran text-center lg:text-end ">
                  کیوآر کد
                </h1>
                <Suspense fallback={<CommentSkeleton />}>
                  <QRCodeGenerator />
                </Suspense>
              </TabsContent>
            )}
            {isAdmin && (
              <TabsContent
                value="users"
                className="space-y-6 data-[state=active]:block"
              >
                <h1 className="text-xl font-bold text-text_royal_green font-doran text-center lg:text-end ">
                  مدیریت اکانت‌ها
                </h1>
                <Suspense fallback={<CommentSkeleton />}>
                  <PasswordManager />
                  <UserManager />
                </Suspense>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </main>
  );
}

function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-full max-w-md mx-auto mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    </div>
  );
}

function CommentSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Skeleton className="h-[400px] rounded-lg" />
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  );
}
