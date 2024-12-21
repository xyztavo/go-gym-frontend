"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { Search } from "lucide-react";
import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define the response type from the query
type Res = {
  exercises: Exercises[];
  pages: number;
  maxPages: number;
};

type Exercises = {
  id: string;
  name: string;
  description: string;
  gif: string;
};

export default function Page() {
  const authToken = getCookie("auth");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const handleSubmit = () => {
    refetch();
  };
  const { data, error, isLoading, refetch } = useQuery<Res>({
    queryKey: ["exercises", page, handleSubmit],
    queryFn: async () => {
      const res = await baseUrlRoute.get(
        `/exercises?query=${query}&page=${page}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return res.data;
    },
    retry: false,
  });
  if (error) {
    if (isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      if (statusCode == 401) {
        return <div>User not logged in</div>;
      }
    }
    return <div>Could not get exercises for some reason</div>;
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center border border-muted rounded-md w-[95%] md:w-[80%] my-4 p-4 gap-4">
        <h1 className="font-semibold text-2xl">Exercises:</h1>
        {isLoading ? (
          <div>loading...</div>
        ) : (
          <div className="flex flex-row items-center justify-center flex-wrap gap-4">
            {data?.exercises ? (
              data.exercises.map((exercise) => (
                <div
                  className="flex flex-col items-center justify-center border border-muted rounded-md p-2 w-56 bg-background"
                  key={exercise.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-[200px] h-[200px] object-cover rounded-md border border-muted"
                    src={exercise.gif}
                    alt={exercise.name + "gif"}
                  />
                  <div className="flex flex-col rounded-md">
                    <h1 className="font-semibold text-lg text-center h-8 overflow-auto">
                      {exercise.name}
                    </h1>
                    <p className="text-sm h-10 overflow-y-scroll">
                      {exercise.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center">
                no exercises were found{" "}
                <Button
                  onClick={() => {
                    location.reload();
                  }}
                >
                  Refresh
                </Button>
              </div>
            )}
          </div>
        )}
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
              {page <= data?.maxPages - 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page + 1)}>
                    {page + 2}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              {page <= data?.maxPages - 1 && (
                <PaginationItem>
                  <PaginationNext onClick={() => setPage(page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-row gap-2 items-center"
        >
          <Input
            placeholder="Search: Triceps pushdown"
            onChange={(value) => setQuery(value.target.value)}
            value={query}
          />
          <Button onClick={handleSubmit}>
            <Search />
          </Button>
        </form>
      </div>
    </div>
  );
}
