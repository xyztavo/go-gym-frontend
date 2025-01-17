import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/utils/auth";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!verifyToken()) {
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  return <>{children}</>;
} 