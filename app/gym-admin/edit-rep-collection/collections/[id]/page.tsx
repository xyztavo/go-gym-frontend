"use client";
import { baseUrlRoute } from "@/api/lib/routes";
import AddExerciseReps from "@/app/gym-admin/edit-rep-collection/collections/[id]/_components/add-exercises-reps";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { Loader2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

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

  // delete exercise rep
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

  // get exercises reps
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

  if (isLoading) return <Loader />;

  return data ? (
    <div className="flex flex-col items-center justify-center my-2 gap-2">
      {error && <ErrorDiv error="something happened" statusCode={500} />}
      <h1>Collection exercise reps:</h1>
      <div className="flex flex-row flex-wrap items-center justify-center gap-2">
        {data.map((exercise) => (
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
              alt={exercise.name + " gif"}
              className="w-12 h-12 rounded-md object-cover border border-muted"
            />
            </div>
            <h1 className="font-semibold w-44 text-center h-6 overflow-auto">
              {exercise.name}
            </h1>
            <p className="font-light text-sm w-44 h-6 overflow-auto">
              {exercise.description}
            </p>
            <div className="flex flex-row gap-2">
            <div className="flex flex-row border border-muted rounded-md p-2 gap-2">
              <h1 className="font-semibold border-muted">Reps</h1>
              <h1>{exercise.reps}</h1>
            </div>
            <div className="flex flex-row border border-muted rounded-md p-2 gap-2">
              <h1 className="font-semibold border-muted">Sets</h1>
              <h1>{exercise.sets}</h1>
            </div>
            </div>
          </div>
        ))}
      </div>
      <AddExerciseReps
        collectionId={params.id}
        refetchExercisesCollection={refetch}
      />
    </div>
  ) : (
    <div>
      No Exercises reps found in collection
      {error && <ErrorDiv error="something happened" statusCode={500} />}
      <AddExerciseReps
        collectionId={params.id}
        refetchExercisesCollection={refetch}
      />
    </div>
  );
}
