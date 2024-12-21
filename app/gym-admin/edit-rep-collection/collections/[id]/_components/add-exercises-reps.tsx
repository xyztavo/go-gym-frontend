"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { Search } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";

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

type ExerciseRep = {
  exerciseId: string;
  reps: number | boolean;
  sets: number | boolean;
};

type FormValues = {
  [key in `exercise_${string}_selected`]: boolean;
} & {
  [key in `exercise_${number}_reps`]: number;
} & {
  [key in `exercise_${number}_sets`]: number;
} & {
  [key: string]: string;
};

export default function AddExerciseReps({
  collectionId,
  refetchExercisesCollection,
}: {
  collectionId: string;
  refetchExercisesCollection: () => void;
}) {
  const authToken = getCookie("auth");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const form = useForm<FormValues>({
    defaultValues: {},
  });

  const { data, error, isLoading, refetch } = useQuery<Res>({
    queryKey: ["exercises", setQuery, page],
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

  const mutation = useMutation({
    mutationFn: async ({
      exerciseReps,
      collectionId,
    }: {
      exerciseReps: ExerciseRep[];
      collectionId: string;
    }) => {
      const res = await baseUrlRoute.post(
        "/exercises-reps/collections/multiple",
        { collectionId, exerciseReps },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      refetchExercisesCollection();
      toast({
        title: "Exercises Updated",
        description: "Your exercises were successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "There was an error updating the exercises.",
      });
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (formData) => {
    const exerciseReps: ExerciseRep[] = [];
    for (const key in formData) {
      if (key.startsWith("exercise_") && key.includes("_selected")) {
        const match = key.match(/^exercise_([^_]+(?:_[^_]+)*)_selected$/);
        if (match) {
          const exerciseId = match[1];

          const repsKey = `exercise_${exerciseId}_reps`;
          const setsKey = `exercise_${exerciseId}_sets`;
          if (formData[key]) {
            const reps = Number(formData[repsKey]) || 0;
            const sets = Number(formData[setsKey]) || 0;
            exerciseReps.push({
              exerciseId,
              reps,
              sets,
            });
          }
        }
      }
    }

    mutation.mutate({ exerciseReps, collectionId });
   // Reset the form
   const resetValues = Object.keys(formData).reduce((acc, key) => {
    if (key.startsWith("exercise_") && key.includes("_selected")) {
      acc[key] = false as unknown as string; // Cast boolean to string for TypeScript compatibility
    } else if (key.startsWith("exercise_") && (key.includes("_reps") || key.includes("_sets"))) {
      acc[key] = "0"; // Reset numeric fields as strings
    } else {
      acc[key] = ""; // Reset other fields to empty strings
    }
    return acc;
  }, {} as FormValues);

  form.reset(resetValues);
  };

  if (error) {
    if (isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      if (statusCode === 401) {
        return <div>User not logged in</div>;
      }
    }
    return <div>Could not get exercises for some reason</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center border border-muted rounded-md my-4 p-4 gap-4">
            <h1 className="font-semibold text-2xl">Add Exercises Reps:</h1>
            {data == null && <div>No exercises were found</div>}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="flex flex-row items-center justify-center flex-wrap gap-4">
                {data?.exercises &&
                  data.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex flex-row items-center justify-center">
                      <FormField
                        control={form.control}
                        name={`exercise_${exercise.id}_selected`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col items-center justify-center rounded-md border border-muted p-4">
                            <div className="flex flex-row gap-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                              <h1 className="w-40 text-sm h-7 overflow-y-scroll">
                                {exercise.name}
                              </h1>
                            </div>
                            <div className="leading-none">
                              <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2 w-56 gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  className="w-56 h-40 object-cover rounded-md border border-muted"
                                  src={exercise.gif}
                                  alt={exercise.name + " gif"}
                                />
                                <p className="font-sm h-10 text-sm overflow-y-scroll">
                                  {exercise.description}
                                </p>
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                      {form.watch(`exercise_${exercise.id}_selected`) && (
                        <div className="flex flex-col items-center w-56 justify-center border border-muted rounded-md absolute z-50 bg-background mt-44">
                          <FormField
                            control={form.control}
                            name={`exercise_${exercise.id}_reps`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-center rounded-md gap-2 p-2">
                                <h2 className="text-sm font-semibold">Reps</h2>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="Reps"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`exercise_${exercise.id}_sets`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-center rounded-md gap-2 p-2">
                                <h2 className="text-sm font-semibold">Sets</h2>
                                <FormControl className="flex flex-row items-center justify-center m-0">
                                  <Input
                                    type="number"
                                    className="m-0"
                                    {...field}
                                    placeholder="Sets"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                refetch();
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
            <Button type="submit" className="mt-4">
              Submit Selected Exercises
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
