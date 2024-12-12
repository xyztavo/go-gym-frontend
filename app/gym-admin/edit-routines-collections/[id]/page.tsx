"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import Loader from "@/components/loader";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import AddCollectionToRoutine from "./_components/add-collection-to-routines";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Res = {
  id: string;
  adminId: string;
  name: string;
  description: string;
  img: string;
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const authToken = getCookie("auth");

  // delete collection
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await baseUrlRoute.delete(
        `/routines/${params.id}/collections/${id}`,
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
    onSuccess: () => {
      refetch();
    },
  });
  const { data, isLoading, error, refetch } = useQuery<Res[]>({
    queryKey: ["/routines/id/collections"],
    queryFn: async () => {
      const res = await baseUrlRoute.get(`/routines/${params.id}/collections`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });
  if (isAxiosError(error) && error.response) {
    if ((error.status = 404)) {
      toast({
        title: error.message,
      });
    } else {
      toast({
        title: error.message,
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center my-4 gap-2">
      <div className="flex flex-col items-center justify-center p-2 m-2 gap-2 ">
        <h1 className="text-2xl font-bold">Routine collections:</h1>
        <div className="flex flex-row items-center justify-center flex-wrap p-2 border border-muted rounded-md gap-2">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {data ? (
                data.map((collection) => {
                  return (
                    <div
                      className="flex bg-background flex-col items-center justify-center border border-muted rounded-md p-2 gap-2"
                      key={collection.id}
                    >
                      <Button
                        variant={"destructive"}
                        onClick={() => mutate({ id: collection.id })}
                        disabled={isPending}
                      >
                        {isPending ? <Loader2 className="animate-spin"/> :  <Trash2 />}
                      </Button>

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-44 h-44 object-cover"
                        src={collection.img}
                        alt={`routine ${collection.name} image`}
                      />
                      <h1 className="text-xl w-44 h-7 overflow-auto font-semibold">
                        {collection.name}
                      </h1>
                      <p className="text-sm w-44 h-7 overflow-auto font-thin">
                        {collection.description}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div>no colletions found in routine</div>
              )}
            </>
          )}
        </div>
        <AddCollectionToRoutine
          routineId={params.id}
          refetchCollections={refetch}
        />
      </div>
    </div>
  );
}
