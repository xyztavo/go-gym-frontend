"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/loader";

type Res = {
  id: string;
  name: string;
  description: string;
  reps: number;
  sets: number;
  gif: string;
};
export default function Page() {
  const params = useParams<{ id: string }>();
  const authToken = getCookie("auth");

  const { data, error, isLoading } = useQuery<Res[]>({
    queryKey: ["/collection/id/exercises-reps"],
    queryFn: async () => {
      const res = await baseUrlRoute.get(
        `/collections/${params.id}/exercises-reps`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return res.data;
    },
  });
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
    <div className="flex flex-col justify-center items-center my-4 gap-4">
      <h1 className="font-bold text-2xl">Collection Exercises Reps:</h1>
      <div className="flex flex-row items-center justify-center flex-wrap md:border border-muted rounded-md md:p-4 gap-2">
        {isLoading && <Loader />}
        {data &&
          data.map((exercise) => {
            return (
                <Drawer  key={exercise.id}>
                    <Checkbox className="w-6 h-6" />
                  <DrawerTrigger>
                    <div className="flex bg-background hover:scale-110 transition-transform flex-row items-center justify-center border border-muted rounded-md pr-2 gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-12 h-12 md:w-24 md:h-24 object-cover rounded-l-md border-r border-muted"
                        src={exercise.gif}
                        alt={`exercise ${exercise.name} image`}
                      />
                      <h1 className="flex items-center justify-center text-xl md:w-44 md:h-24 overflow-auto font-semibold">
                        {exercise.name}
                      </h1>
                      <p className="hidden md:flex items-center justify-center text-sm md:w-44 md:h-24 text-center overflow-auto">
                        {exercise.description}
                      </p>
                      <div className="flex flex-row gap-2">
                        <p className="text-sm border border-muted rounded-md p-2">
                          Reps: {exercise.reps}
                        </p>
                        <p className="text-sm border border-muted rounded-md p-2">
                          Sets: {exercise.sets}
                        </p>
                      </div>
                    </div>
                  </DrawerTrigger>
                  <DrawerContent className="border border-muted">
                    <DrawerHeader>
                      <DrawerTitle>{exercise.name}</DrawerTitle>
                      <DrawerDescription className="flex flex-col gap-2">
                        {exercise.description}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="rounded-md w-96 h-98 object-cover border border-muted"
                          src={exercise.gif}
                          alt={`${exercise.name} gif`}
                        />
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                      <div className="flex flex-row gap-2 items-center justify-center border border-muted rounded-md">
                        <p className="flex flex-row items-center gap-2">
                          Reps:{" "}
                          <span className="font-bold border-x px-2 border-muted bg-muted">
                            {" "}
                            {exercise.reps}
                          </span>
                        </p>
                        <p className="flex flex-row items-center gap-2">
                          Sets:{" "}
                          <span className="font-bold border-x px-2 border-muted bg-muted">
                            {exercise.sets}
                          </span>
                        </p>
                      </div>
                      <DrawerClose>
                        <Button variant={"outline"}>Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
            );
          })}
      </div>
    </div>
  );
}
