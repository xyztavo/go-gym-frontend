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
  FormLabel,
  FormDescription,
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
                    <div key={exercise.id} className="space-y-6">
                      <FormField
                        control={form.control}
                        name={`exercise_${exercise.id}_selected`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-muted p-4 shadow">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{exercise.name}</FormLabel>
                              <FormDescription>
                                <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2 w-56 gap-2">
                                  <img
                                    className="w-56 h-40 object-cover rounded-md border border-muted"
                                    src={exercise.gif}
                                    alt={exercise.name + " gif"}
                                  />
                                  <p className="font-sm h-10 overflow-y-scroll">
                                    {exercise.description}
                                  </p>
                                </div>
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      {form.watch(`exercise_${exercise.id}_selected`) && (
                        <>
                          <FormField
                            control={form.control}
                            name={`exercise_${exercise.id}_reps`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-muted p-4 shadow">
                                <FormLabel>Reps</FormLabel>
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
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-muted p-4 shadow">
                                <FormLabel>Sets</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="Sets"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </>
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
            <Button type="submit" className="mt-4">
              Submit Selected Exercises
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
