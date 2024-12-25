"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import {  useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import EditCollection from "./_components/update-collection";

type Res = {
  id: string;
  name: string;
  description: string;
  img: string;
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const authToken = getCookie("auth");
  const { data, isLoading, error, refetch } = useQuery<Res>({
    queryKey: [`/collections/${params.id}`],
    queryFn: async () => {
      const res = await baseUrlRoute.get(`/collections/${params.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });

  return (
    <div className="flex flex-col items-center justify-center my-4 gap-4 ">
      <h1 className="text-xl font-semibold">Collection:</h1>
      {error && <ErrorDiv error={error.message} statusCode={500} />}
      {isLoading && <Loader />}
      {data && (
        <div className="flex flex-col items-center justify-center gap-2 border rounded-md border-muted p-2 bg-background">
          <h1 className="text-xl font-semibold w-48 h-7 overflow-auto">
            {data.name}
          </h1>
          {/*  eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-48 h-48 rounded-md border border-muted "
            src={data.img}
            alt={`${data.name} img`}
          />
          <p className="w-48 h-7 overflow-auto">{data.description}</p>
        </div>
      )}
      <h1 className="text-xl font-semibold">Edit Collection:</h1>
      <div className="flex flex-col items-center justify-center gap-2 border border-muted rounded-md p-2">
        <EditCollection data={data} refetch={refetch} id={params.id} />
      </div>
    </div>
  );
}
