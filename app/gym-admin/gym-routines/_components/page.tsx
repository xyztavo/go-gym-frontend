"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { Search } from "lucide-react";
import { FormEvent, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Res = {
  page: number;
  maxPages: number;
  routines: Routine[];
};

type Routine = {
  id: string;
  adminId: string;
  name: string;
  description: string;
  img: string;
};


export default function AddGymRoutine({ refetchRoutines } : { refetchRoutines: () => void}) {
  const authToken = getCookie("auth");

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const { data, isLoading, error, refetch } = useQuery<Res>({
    queryKey: ["/routines", handleSubmit, page],
    queryFn: async () => {
      const res = await baseUrlRoute.get(
        `/routines?query=${query}&page=${page}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
  });

    const {
      mutate,
      error: mutateError,
      isPending,
    } = useMutation({
      mutationFn: async ({ routineId }: { routineId: string }) => {
        const res = await baseUrlRoute.post(
          `/gym/routines/${routineId}`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        return res.data;
      }, onSuccess: () => refetchRoutines()
    });
    if (mutateError) {
        if (isAxiosError(mutateError) && mutateError.response) {
          toast({
            title: mutateError.message,
          });
        }
      }

  
  if (isAxiosError(error) && error.response) {
    const statusCode = error.status;
    if (statusCode == 404) {
      toast({
        title: error.message,
      });
    } else {
      toast({
        title: error.message,
      });
    }
  }

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col items-center justify-center gap-2 m-2 p-2 ">
      <h1 className="font-bold text-2xl">
        Select a routine to add to the gym:
      </h1>
      <div className="flex flex-row flex-wrap items-center justify-center gap-2 p-2 border border-muted rounded-md">
        {data && (
          <>
            {data.routines ? (
              data.routines.map((routine) => {
                return (
                  <div
                    key={routine.id}
                    className="flex flex-col flex-wrap items-center justify-center gap-2 p-2 border border-muted rounded-md"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className=" w-44 h-44 border object-cover border-muted rounded-md"
                      src={routine.img}
                      alt={`collection ${routine.name} image`}
                    />
                    <h1 className="text-xl w-44 h-7 overflow-auto font-semibold">
                      {routine.name}
                    </h1>
                    <p className="text-sm w-44 h-7 overflow-auto font-thin">
                      {routine.description}
                    </p>
                    <Button
                      onClick={() => {
                        mutate({ routineId: routine.id });
                      }}
                      disabled={isPending}
                    >
                      Submit
                    </Button>
                  </div>
                );
              })
            ) : (
              <div> could not find routine</div>
            )}
          </>
        )}
      </div>
      {data?.maxPages && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {page > 0 && (
                <PaginationPrevious onClick={() => setPage(page - 1)} />
              )}
            </PaginationItem>
            {page > 0 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(page - 1)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink isActive>{page + 1}</PaginationLink>
            </PaginationItem>
            {page <= data?.maxPages - 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(page + 1)}>
                  {page + 2}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            {page <= data?.maxPages - 2 && (
              <PaginationItem>
                <PaginationNext onClick={() => setPage(page + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
      <form onSubmit={handleSubmit} className="flex flex-row gap-2">
        <Input
          onChange={(e) => setQuery(e.target.value)}
          placeholder="shoulder day"
        />
        <Button type="submit" size={"icon"}>
          <Search />
        </Button>
      </form>
    </div>
  );
}
