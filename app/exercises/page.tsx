"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { Search } from "lucide-react";
import { useState } from "react";

type res = {
  id: string;
  name: string;
  description: string;
  gif: string;
};
export default function Page() {
  const authToken = getCookie("auth");
  const [query, setQuery] = useState("");
  const handleSubmit = () => {
    refetch();
  };
  const { data, error, isLoading, refetch } = useQuery<res[]>({
    queryKey: ["exercises", handleSubmit],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/exercises?query=" + query, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
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
        {data == null && <div>No exercises were found</div>}
        {isLoading ? (
          <div>loading...</div>
        ) : (
          <div className="flex flex-row items-center justify-center flex-wrap gap-4">
            {data &&
              data.map((exercise) => (
                <div
                  className="flex flex-col items-center justify-center border border-muted rounded-md p-2 w-56"
                  key={exercise.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="w-56 h-40 object-cover rounded-md border border-muted"
                    src={exercise.gif}
                    alt={exercise.name + "gif"}
                  />
                  <h1 className="font-semibold text-xl">{exercise.name}</h1>
                  <p className="font-sm h-10 overflow-y-scroll">
                    {exercise.description}
                  </p>
                </div>
              ))}
          </div>
        )}
          <form onSubmit={(e) => {
            e.preventDefault() 
            handleSubmit()}} className="flex flex-row gap-2 items-center" >
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
