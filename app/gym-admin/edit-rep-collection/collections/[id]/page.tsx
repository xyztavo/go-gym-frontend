"use client";
import { baseUrlRoute } from "@/api/lib/routes";
import AddExerciseReps from "@/app/gym-admin/edit-rep-collection/collections/[id]/_components/add-exercises-reps";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { Loader2, Pen, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type ExerciseRepsResult = {
  id: string;
  name: string;
  description: string;
  gif: string;
  reps: number;
  sets: number;
};

export default function Page() {
  const authToken = getCookie("auth");
  const params = useParams<{ id: string }>();

  // Get exercises reps
  const { data, isLoading, error, refetch } = useQuery<ExerciseRepsResult[]>({
    queryKey: ["/collection/id/exercise-reps"],
    queryFn: async () => {
      const res = await baseUrlRoute.get(
        `/collections/${params.id}/exercises-reps`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await baseUrlRoute.delete(
        `/exercises-reps/collections/${id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode === 401) {
          toast.error("User is not admin");
        } else {
          toast.error(e.response.data);
        }
      }
    },
    onSuccess: () => {
      refetch();
    },
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      exerciseRepsId,
      values,
    }: {
      exerciseRepsId: string;
      values: { reps: number; sets: number };
    }) => {
      const res = await baseUrlRoute.put(
        `/exercises-reps/collections/${exerciseRepsId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        toast.error(e.response.data);
      }
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Local state for form values
  const [exerciseForms, setExerciseForms] = useState<Map<string, { reps: number; sets: number }>>(() => {
    const initialFormValues = new Map();
    data?.forEach(exercise => {
      initialFormValues.set(exercise.id, { reps: exercise.reps, sets: exercise.sets });
    });
    return initialFormValues;
  });

  // Handle input changes
  const handleInputChange = (exerciseId: string, field: "reps" | "sets", value: number) => {
    setExerciseForms((prev) => {
      const updatedForms = new Map(prev);
      const formValues = updatedForms.get(exerciseId) || { reps: 0, sets: 0 };
      formValues[field] = value;
      updatedForms.set(exerciseId, formValues);
      return updatedForms;
    });
  };
  

  // Handle form submission
  const handleSubmit = (exerciseId: string) => {
    const values = exerciseForms.get(exerciseId);
    if (values) {
      update({ exerciseRepsId: exerciseId, values });
    }
  };

  if (isLoading) return <Loader />;

  return data ? (
    <div className="flex flex-col items-center justify-center my-2 gap-2">
      {error && <ErrorDiv error="Something happened" statusCode={500} />}
      <h1>Collection exercise reps:</h1>
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        {data.map((exercise) => {
          const formValues = exerciseForms.get(exercise.id) || { reps: exercise.reps, sets: exercise.sets };

          return (
            <div
              key={exercise.id}
              className="flex flex-col md:flex-row items-center justify-center border border-muted rounded-md gap-2 p-2"
            >
              <div className="flex flex-row items-center gap-2">
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  onClick={() => mutate({ id: exercise.id })}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="animate-spin" /> : <Trash2 />}
                </Button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={exercise.gif}
                  alt={`${exercise.name} gif`}
                  className="w-12 h-12 rounded-md object-cover border border-muted"
                />
              </div>
              <h1 className="font-semibold w-44 text-center h-6 overflow-auto">
                {exercise.name}
              </h1>
              <p className="font-light text-sm w-44 h-6 overflow-auto">
                {exercise.description}
              </p>
              <div className="flex flex-row gap-2 items-center justify-center">
                <div className="flex flex-row items-center border border-muted rounded-md p-2 gap-2">
                  <h1 className="font-semibold border-muted">Reps</h1>
                  <Input
                    value={formValues.reps}
                    onChange={(e) =>
                      handleInputChange(exercise.id, "reps", parseInt(e.target.value, 10))
                    }
                    className="w-14"
                    type="number"
                    min="3"
                    max="40"
                  />
                </div>
                <div className="flex flex-row items-center border border-muted rounded-md p-2 gap-2">
                  <h1 className="font-semibold border-muted">Sets</h1>
                  <Input
                    value={formValues.sets}
                    onChange={(e) =>
                      handleInputChange(exercise.id, "sets", parseInt(e.target.value, 10))
                    }
                    className="w-14"
                    type="number"
                    min="3"
                    max="40"
                  />
                </div>
                <Button
                  onClick={() => handleSubmit(exercise.id)}
                  type="button"
                  size={"icon"}
                  disabled={isUpdating}
                >
                  {isUpdating ? <Loader2 className="animate-spin" /> : <Pen />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <AddExerciseReps
        collectionId={params.id}
        refetchExercisesCollection={refetch}
      />
    </div>
  ) : (
    <div>
      No Exercises reps found in collection
      {error && <ErrorDiv error="Something happened" statusCode={500} />}
      <AddExerciseReps
        collectionId={params.id}
        refetchExercisesCollection={refetch}
      />
    </div>
  );
}
