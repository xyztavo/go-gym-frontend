"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { QrReader } from "react-qr-reader";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import Loader from "@/components/loader";
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
          toast({
            variant: "destructive",
            title: "User is not admin",
          });
        } else {
          toast({
            variant: "destructive",
            title: e.response.data,
          });
        }
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Check-in successful",
        description: `Days until plan expires: ${data.daysUntilPlanExpires}`,
      });
    },
  });

  return (
    <div className="w-screen h-screen">
      {isPending ? (
        <Loader />
      ) : (
        <QrReader
          className="w-[80%]"
          constraints={{ facingMode: "environment" }}
          onResult={(result, error) => {
            if (!!result) {
              mutate({ id: result.toString() });
            }

            if (!!error) {
              console.info(error);
            }
          }}
        />
      )}
    </div>
  );
}
