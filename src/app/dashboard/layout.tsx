"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import Providers from "../../../providers";

const Dashboardpage = ({ children }: { children: ReactNode }) => {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [token, isLoading, router]);
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return token ? (
    <>
      <Providers>{children}</Providers>
    </>
  ) : null;
};
export default Dashboardpage;
