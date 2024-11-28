"use client";
import { baseUrlRoute } from "@/api/lib/routes";
import AddExerciseReps from "@/components/add-exercises-reps";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
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

  const { data, isLoading, error, refetch } = useQuery<ExerciseRepsResult[]>({
    queryKey: ["/collection/id/exercise-reps"],
    queryFn: async () => {
        const res = await baseUrlRoute.get(
            `/collections/${params.id}/exercises-reps`, 
            {
              headers: {
                "Authorization": `Bearer ${authToken}`,
                "Content-Type": "application/json", 
              },
            }
          );
          return res.data; 
    },
    retry: false,
  });

  if (isLoading) return <Loader />;

  if (error) {
    if (isAxiosError(error) && error.response) {
      if (error.status == 401) {
        return <div>User not authenticated</div>;
      }
    } else {
      return <div>Something has happened, reason: {error.message}</div>;
    }
    return <div>Something has happened, reason: {error.response.data}</div>;
  }

  if (data == null) return <div>No exercise reps were found</div>;

  if (data)
    return (
      <div className="flex flex-col items-center justify-center my-2 gap-2">
        <h1>Collection exercise reps:</h1>
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
          {data.map((exercise) => (
            <div
              key={exercise.id}
              className="flex flex-col md:flex-row items-center justify-center border border-muted rounded-md gap-2 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exercise.gif}
                alt={exercise.name + " gif"}
                className="w-12 h-12 object-cover border-r border-muted"
              />
              <h1 className="font-semibold">{exercise.name}</h1>
              <p className="font-light text-sm h-6 overflow-y-auto">{exercise.description}</p>
              <div className="flex flex-row border border-muted rounded-md p-2 gap-2">
                <h1 className="font-semibold border-muted">Reps</h1>
                <h1>{exercise.reps}</h1>
              </div>
              <div className="flex flex-row border border-muted rounded-md p-2 gap-2">
                <h1 className="font-semibold border-muted">Sets</h1>
                <h1>{exercise.sets}</h1>
              </div>
            </div>
          ))}
        </div>
        <AddExerciseReps collectionId={params.id} refetchExercisesCollection={refetch} />
      </div>
    );
}
