"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import {  Search } from "lucide-react";
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
import Link from "next/link";

type Res = {
  maxPages: number;
  page: number;
  routines: Routine[];
};

type Routine = {
  id: string;
  adminId: string;
  name: string;
  description: string;
  img: string;
};

export default function Page() {
  const authToken = getCookie("auth");
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");

  const { data, error, isLoading, refetch } = useQuery<Res>({
    queryKey: ["/routines"],
    queryFn: async () => {
      const res = await baseUrlRoute.get(
        `/routines?query=${query}&page=${page}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
  });

  return (
    <div className="flex flex-col justify-center items-center my-4 gap-4">
      <h1 className="font-bold text-2xl">Routine routes:</h1>
      {isLoading && <Loader />}
      {error && <div>{error.message}</div>}
      {data?.routines ? (
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 p-2 border border-muted rounded-md">
          {data.routines.map((routine) => {
            return (
              <Link
                href={`/routines/${routine.id}/collections`}
                key={routine.id}
                className="flex flex-col bg-background hover:scale-110 transition-transform items-center justify-center p-2 border border-muted rounded-md"
              >
                {/*  eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="border border-muted rounded-md w-44 h-44 object-cover"
                  src={routine.img}
                  alt={`routine ${routine.name} image`}
                />
                <h1 className="font-semibold text-xl w-44 h-7 overflow-auto">
                  {routine.name}
                </h1>
                <p className="font-thin text-sm w-44 h-7 overflow-auto">
                  {routine.description}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div>No routine was found for this query</div>
      )}
      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          refetch(); // Trigger search when form is submitted
        }}
        className="flex flex-row gap-2 items-center"
      >
        <Input
          placeholder="Search: Triceps pushdown"
          onChange={(value) => setQuery(value.target.value)}
          value={query}
        />
        <Button type="button" onClick={() => refetch()}>
          <Search />
        </Button>
      </form>
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
    </div>
  );
}
