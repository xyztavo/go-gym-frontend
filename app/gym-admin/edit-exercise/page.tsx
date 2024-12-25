"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getCookie } from "cookies-next";
import { Loader2, Pen, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import Link from "next/link";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "exercise name must have at least 3 characters",
    })
    .max(40, {
      message: "40 max characters.",
    }),
  description: z
    .string()
    .min(3, {
      message: "exercise description must have at least 3 characters",
    })
    .max(200, {
      message: "200 max characters.",
    }),
  gifUrl: z
    .string()
    .min(3, {
      message: "gifUrl must have at least 3 characters",
    })
    .max(200, {
      message: "200 max characters.",
    }),
});
type Response = {
  message: string;
};

type Res = {
  id: string;
  name: string;
  description: string;
  gif: string;
};

export default function Page() {
  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // get user exercise
  const { data, isLoading, error, refetch } = useQuery<Res[]>({
    queryKey: ["exercises"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/exercises", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });

  // create exercise
  const { mutate, isPending } = useMutation<
    Response,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: ({ values }: { values: z.infer<typeof formSchema> }) => {
      return baseUrlRoute.post(
        "/exercises",
        {
          name: values.name,
          description: values.description,
          gif: values.gifUrl,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    },
    onSuccess: (data) => {
      toast(data.message);
      refetch();
    },
    onError: (e) => {
      if (axios.isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode == 404) {
          toast.error("user gym not found");
        } else {
          toast.error("could not create exercise, reason :" + e.response.data);
        }
      }
    },
    retry: false,
  });

  // delete exercise
  const { mutate: deleteExercise, isPending: deletePending } = useMutation<
    Response,
    Error,
    { id: string }
  >({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await baseUrlRoute.delete(`/exercises/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast(data.message);
      refetch();
    },
    onError: (e) => {
      if (axios.isAxiosError(e) && e.response) {
        toast.error("could not delete exercise, reason :" + e.response.data);
      }
    },
    retry: false,
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ values });
  }

  return (
    <div className="flex flex-col justify-center items-center my-4 gap-2">
      <h1 className="text-1xl font-bold">User Exercises:</h1>
      {error && <ErrorDiv error={error.message} statusCode={500} />}
      {isLoading && <Loader />}
      <div className="flex flex-wrap flex-row items-center justify-center gap-2 p-2 border border-muted rounded-md">
        {data &&
          data.map((exercise) => {
            return (
              <div
                className="flex flex-col items-center justify-center gap-2 border border-muted rounded-md p-2 bg-background my-2"
                key={exercise.id}
              >
                <div className="absolute">
                  <div className="flex flex-row justify-between gap-12 mt-[-6rem]">
                    <Button
                      className="border-2 border-muted"
                      variant={"outline"}
                      size={"icon"}
                      asChild
                    >
                      <Link href={`/gym-admin/edit-exercise/${exercise.id}`}>
                        <Pen />
                      </Link>
                    </Button>
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      className="border-2 border-muted "
                      onClick={() => deleteExercise({ id: exercise.id })}
                      disabled={deletePending}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="w-28 h-28 object-cover rounded-md border border-muted"
                  src={exercise.gif}
                  alt={`${exercise.name} gif`}
                />
                <h1 className="text-1xl font-bold w-28 h-7 overflow-auto">
                  {exercise.name}
                </h1>
                <p className="w-28 h-7 overflow-auto">{exercise.description}</p>
              </div>
            );
          })}
      </div>
      <h1 className="text-1xl font-bold">Create Exercise:</h1>
      <div className="lg:border lg:p-2 rounded-md lg:border-muted lg:w-96">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Preacher Curl" {...field} />
                  </FormControl>
                  <FormDescription>Plan name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="This exercise targets your biceps brachii"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Plan description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gifUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gif Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://i.pinimg.com/originals/14/49/c1/1449c166c96b868ed52b019d98250987.gif"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A gif URL demonstrating how to do it
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
