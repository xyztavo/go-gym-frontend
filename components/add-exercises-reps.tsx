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

// Define the response type from the query
type Res = {
  id: string;
  name: string;
  description: string;
  gif: string;
  reps: number;  // Default reps value
  sets: number;  // Default sets value
};

// Define the type for the exerciseRep object
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
  // Allow indexing with string keys to avoid the "no index signature" error
  [key: string]: string;  // Index signature to allow any string key
};

export default function AddExerciseReps({ collectionId, refetchExercisesCollection }: { collectionId: string, refetchExercisesCollection: () => void  }) {
  const authToken = getCookie("auth");
  const [query, setQuery] = useState("");

  // React Hook Form setup
  const form = useForm<FormValues>({
    defaultValues: {},
  });

  const { data, error, isLoading, refetch } = useQuery<Res[]>({
    queryKey: ["exercises", query],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/exercises?query=" + query, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    retry: false,
  });

  // Mutation for POST request
  const mutation = useMutation({
    mutationFn: async ({ exerciseReps, collectionId }: { exerciseReps: ExerciseRep[]; collectionId: string }) => {
      const res = await baseUrlRoute.post(
        "/exercises-reps/collections/multiple",
        { collectionId, exerciseReps },  // Include collectionId in the payload
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
      refetchExercisesCollection()
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

  // Handle form submission and prepare data for mutation
  const handleFormSubmit: SubmitHandler<FormValues> = (formData) => {
    const exerciseReps: ExerciseRep[] = [];

    // Loop through each exercise and gather the selected reps and sets
    for (const key in formData) {
      if (key.startsWith("exercise_") && key.includes("_selected")) {
        const exerciseId = key.split("_")[1]; // Extract the exercise ID from the key
        const repsKey = `exercise_${exerciseId}_reps`;
        const setsKey = `exercise_${exerciseId}_sets`;

        // Check if the exercise is selected and get its reps and sets values
        if (formData[key]) {
          // Convert reps and sets values to numbers before adding them to the exerciseReps array
          const reps = Number(formData[repsKey as keyof FormValues]) || 0;  // Ensure it's a number, default to 0
          const sets = Number(formData[setsKey as keyof FormValues]) || 0;  // Ensure it's a number, default to 0

          // Correctly format the data as per the expected structure
          exerciseReps.push({
            exerciseId,
            reps,  // Use number for reps
            sets,  // Use number for sets
          });
        }
      }
    }

    // Call mutation to send data to the server, including collectionId
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
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)} // Submit handler that collects the data and triggers the mutation
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center border border-muted rounded-md w-[95%] md:w-[80%] my-4 p-4 gap-4">
            <h1 className="font-semibold text-2xl">Add Exercises Reps:</h1>
            {data == null && <div>No exercises were found</div>}
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <div className="flex flex-row items-center justify-center flex-wrap gap-4">
                {data &&
                  data.map((exercise) => (
                    <div key={exercise.id} className="space-y-6">
                      <FormField
                        control={form.control}
                        name={`exercise_${exercise.id}_selected`} // Checkbox to select the exercise
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
                                <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2 w-56">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

                      {/* Only show rep and set inputs if the exercise is checked */}
                      {form.watch(`exercise_${exercise.id}_selected`) && (
                        <>
                          <FormField
                            control={form.control}
                            name={`exercise_${exercise.id}_reps`}  // Reps input for selected exercise
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-muted p-4 shadow">
                                <FormLabel>Reps</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    defaultValue={exercise.reps}  // Prefill with fetched reps
                                    placeholder="Reps"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`exercise_${exercise.id}_sets`}  // Sets input for selected exercise
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-muted p-4 shadow">
                                <FormLabel>Sets</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    defaultValue={exercise.sets}  // Prefill with fetched sets
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

            {/* Submit button */}
            <Button type="submit" className="mt-4">
              Submit Selected Exercises
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
