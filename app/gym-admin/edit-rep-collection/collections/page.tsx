"use client";

import { baseUrlRoute } from "@/api/lib/routes";
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

  if (isLoading) return <Loader />;

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

  if (data)
    return (
      <div className="flex flex-col items-center justify-center gap-2 my-2">
        <h1 className="text-2xl font-semibold">Select a collection to add exercise reps:</h1>
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
          {data.map((collection) => (
            <Link
              href={`/gym-admin/edit-rep-collection/collections/${collection.id}`}
              key={collection.id}
              className="flex flex-col gap-2 items-center justify-center p-2 border bg-background border-muted rounded-md hover:scale-[1.1] transition-transform"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collection.img}
                  alt={collection.name + " image"}
                  className="w-48 h-48 object-cover border border-muted rounded-md"
                />
                <h1 className="font-semibold">{collection.name}</h1>
                <p className="font-sm font-light h-6 overflow-y-auto">
                  {collection.description}
                </p>
            </Link>
          ))}
        </div>
      </div>
    );
}
