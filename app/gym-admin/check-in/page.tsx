"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/loader";
import { Scanner } from "@yudiel/react-qr-scanner";

type Res = {
  daysUntilPlanExpires: number;
};
export default function Page() {
  const authToken = getCookie("auth");
  const { mutate, isPending } = useMutation<Res, Error, { id: string }>({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await baseUrlRoute.post(
        `/gym/user/check-in/${id}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode === 401) {
          toast.error("User is not admin");
        } else {
         toast.error("destructive")
        }
      }
    },
    onSuccess: (data) => {
      toast.error(`Days until plan expires: ${data.daysUntilPlanExpires}`)
    },
    retry: false,
  });

  return (
    <div className="w-screen h-screen">
      {isPending ? (
        <Loader />
      ) : (
        <div>
          <div className="scale-[0.25] flex flex-col items-center justify-center">
            <Scanner
              constraints={{ facingMode: "environment" }}
              onScan={(result) => {
                if (result != null) {
                  mutate({ id: result.toString() });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
