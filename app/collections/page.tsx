'use client'

import { baseUrlRoute } from "@/api/lib/routes";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
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
import { Input } from "@/components/ui/input";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

  

type Res = {
    maxPages: number;
    page: number;
    collections: Collection[]
}
type Collection = {
    id: string;
    adminId: string;
    name: string;
    description: string;
    img: string;
}
export default function Page() {
    const authToken = getCookie("auth");
    
    const [page, setPage] = useState(0);
    const [query, setQuery] = useState("");

    const { data, isLoading, error, refetch } = useQuery<Res>({
        queryKey: ["/collections"],
        queryFn: async () => {
            const res = await baseUrlRoute.get(`/collections?query=${query}&page=${page}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            return res.data;
        },
    })
    
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
        <div className="flex flex-col items-center justify-center my-4 gap-2">
            <h1 className="text-2xl font-bold">Collections:</h1>
            <div className="flex flex-row items-center justify-center flex-wrap border border-muted rounded-md p-4 gap-2">
                {isLoading ? <Loader /> : 
                <>{data?.collections && data.collections.map((collection) => {
                    return (
                        <Link href={`/collections/${collection.id}/exercises-reps`}
                         className="flex flex-col bg-background hover:scale-110 transition-transform items-center justify-center p-2 border border-muted rounded-md" key={collection.id}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img className="w-44 h-44 object-cover" src={collection.img} alt={`routine ${collection.name} image`} />
                            <h1 className="w-44 h-7 overflow-auto text-xl font-semibold">{collection.name}</h1>
                            <p className="w-44 h-7 overflow-auto text-sm font-thin">{collection.description}</p>
                        </Link>
                    )
                })}</>}
            </div>
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
    )
}