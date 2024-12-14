"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useParams } from "next/navigation";

type Res = {
  id: string;
  routineCollectionId: string;
  adminId: string;
  name: string;
  description: string;
  img: string;
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const authToken = getCookie("auth");

  const { data, isLoading, error } = useQuery<Res[]>({
    queryKey: [`/routines/${params.id}/collections`],
    queryFn: async () => {
      const res = await baseUrlRoute.get(`/routines/${params.id}/collections`, {
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
      return <div>Could not get routines for some reason</div>;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center my-4 p-2 gap-2">
      <h1 className="text-2xl font-bold">Routine Collections:</h1>
      <div className="flex flex-row items-center justify-center flex-wrap border border-muted rounded-md p-4 gap-2">
        {isLoading ? <Loader /> : <>{data == null && <ErrorDiv error="no collections found in this routine" statusCode={404} />}</>}
        {data &&
          data.map((collection) => {
            return (
              <Link
                href={`/collections/${collection.id}/exercises-reps`}
                className="flex flex-col items-center justify-center border border-muted rounded-md p-2 gap-2 bg-background hover:scale-110 transition-transform"
                key={collection.routineCollectionId}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-44 h-44 object-cover border border-muted rounded-md"
                  src={collection.img}
                  alt={`collection ${collection.name} image`}
                />
                <h1 className="text-xl font-semibold w-44 h-7 overflow-auto text-center">{collection.name}</h1>
                <p className="text-sm font-thin w-44 h-7 overflow-auto">{collection.description}</p>
              </Link>
            );
          }) }
      </div>
    </div>
  );
}
