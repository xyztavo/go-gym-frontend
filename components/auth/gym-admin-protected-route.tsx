"use client";
import { baseUrlRoute } from "@/api/lib/routes";
import { toast } from "@/hooks/use-toast";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const withGymAdminProtectedRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ProtectedRoute: React.FC<P> = (props) => {
    const [data, setData] = useState("")
    const [error, setError] = useState("")
    const router = useRouter();
    const authToken = getCookie("auth");

    useEffect(() => {
      baseUrlRoute.get("/gym/admin/test-auth", {
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((res) => setData(res.data)).catch((e) => setError(e));
    }, [])
 
    useEffect(() => {
      if (error) {
        if (isAxiosError(error) && error.response) {
          const statusCode = error.response.status;
          if (statusCode === 401) {
            toast({
              variant: "destructive",
              title: "User is not admin",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Unexpected error occurred",
          });
        }
        router.push("/user");
      }
    }, [error, router]);

    return data ? <WrappedComponent {...props} /> : null;
  };

  ProtectedRoute.displayName = `withProtectedRoute(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ProtectedRoute;
};
