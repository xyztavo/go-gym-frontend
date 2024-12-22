"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";

type Result = {
  id: string;
  name: string;
  description: string;
  img: string;
};

export default function Page() {
  const authToken = getCookie("auth");
  const { data, isLoading, error } = useQuery<Result[]>({
    queryKey: ["/collections"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/collections", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return res.data;
    },
  });

  if (error) {
    if (isAxiosError(error) && error.response) {
      if (error.status == 401) {
        return <div>User not authenticated</div>;
      }
    } else {
      return <div>Something has happened, reason: {error.message}</div>;
    }
    return <div>Something has happened, reason: {error.response.data}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 my-2">
      <h1 className="text-2xl font-semibold">
        Select a collection to add exercise reps:
      </h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          {data ? (
            <div className="flex flex-row items-center justify-center flex-wrap border border-muted rounded-md p-4 gap-2">
              {data.map((collection) => (
                <Link
                  href={`/gym-admin/edit-rep-collection/collections/${collection.id}`}
                  key={collection.id}
                  className="flex flex-col bg-background hover:scale-110 transition-transform items-center justify-center p-2 border border-muted rounded-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-44 h-44 object-cover border border-muted rounded-md"
                    src={collection.img}
                    alt={`routine ${collection.name} image`}
                  />
                  <h1 className="w-44 h-7 overflow-auto text-xl font-semibold">
                    {collection.name}
                  </h1>
                  <p className="w-44 h-7 overflow-auto text-sm font-thin">
                    {collection.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <ErrorDiv error={"No collections found"} statusCode={404} />
          )}
        </>
      )}
    </div>
  );
}
