"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { QRCodeSVG } from "qrcode.react";

type token = {
  id: string;
};

type Res = {
  message: string;
  daysUntilPlanExpires: number;
};
export default function Page() {
  const authToken = getCookie("auth");

  const { data, isLoading, error } = useQuery<Res>({
    queryKey: ["/usr/gym/check-in"],
    queryFn: async () => {
      const res = await baseUrlRoute.post(
        "/user/gym/check-in",
        {},
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return res.data;
    }, retry: false,
  });

  if (error) {
    if (isAxiosError(error) && error.response) {
      return <ErrorDiv error={error.response.data} statusCode={error.response.status} />;
    }
    return <ErrorDiv error="Something went wrong" statusCode={500} />;;
  }

  if (isLoading) return <Loader />;

  if (authToken) {
    const decoded = jwtDecode<token>(authToken.toString());
    return (
      <div className="flex flex-col items-center justify-center gap-2 my-4">
        <h1 className="font-semibold text-xl">{data?.message}!</h1>
        <div className="flex flex-row border items-center justify-center border-muted rounded-md p-2 gap-2 ">
          <h1 className="font-semibold">Days until plan expires: </h1>
          <h2 className="font-semibold bg-muted p-2 rounded-md border border-muted-foreground">{data?.daysUntilPlanExpires}</h2>
        </div>
        <h1 className="text-xl font-semibold">
          This is your check-in qr code:
        </h1>
        <QRCodeSVG
          className="w-60 h-60 rounded-md border border-muted"
          value={decoded.id}
        />
      </div>
    );
  }

  return <ErrorDiv error="Something went wrong" statusCode={500} />;
}
