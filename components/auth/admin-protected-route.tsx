import { toast } from "@/hooks/use-toast";
import axios, { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export const withProtectedRoute = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const ProtectedRoute: React.FC<P> = (props) => {
      const router = useRouter();
      const authToken = getCookie("auth");
  
      const { data, isLoading, error } = useSWR(
        authToken ? "/admin/testauth" : null,
        async () => {
          const res = await axios.get("http://localhost:8000/admin/testauth", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          return res.data;
        }
      );
  
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
  
      if (isLoading) return <div>Loading...</div>;
  
      return data ? <WrappedComponent {...props} /> : null;
    }
  
    ProtectedRoute.displayName = `withProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
    return ProtectedRoute;
  };
  