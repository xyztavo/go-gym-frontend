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
import axios, { isAxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import ErrorDiv from "@/components/error";

// Define schema for form validation using zod
const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Routine name must have at least 3 characters.",
    })
    .max(40, {
      message: "40 max characters.",
    }),
  description: z
    .string()
    .min(3, {
      message: "Routine description must have at least 3 characters.",
    })
    .max(200, {
      message: "200 max characters.",
    }),
  img: z
    .string()
    .url({
      message: "Invalid URL format for the image.",
    })
    .min(3, {
      message: "Image URL must have at least 3 characters.",
    })
    .max(200, {
      message: "200 max characters.",
    }),
});
type Res = {
  id: string;
  name: string;
  description: string;
  img: string;
};
export default function Page() {
  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { data, isLoading, error, refetch } = useQuery<Res[]>({
    queryKey: ["/user/routines"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/routines", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });

  const { mutate, isPending } = useMutation<
    Response,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: ({ values }: { values: z.infer<typeof formSchema> }) => {
      return baseUrlRoute.post(
        "/routines",
        {
          name: values.name,
          description: values.description,
          img: values.img,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    },
    onSuccess: () => {
      toast("Routine created successfully");
      refetch();
    },
    onError: (e) => {
      if (axios.isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode === 404) {
          toast.error("user gym not found");
        } else {
          toast.error("could not create routine, reason :" + e.response.data);
        }
      }
    },
  });

  // delete routine
  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation<
    Res,
    Error,
    { id: string }
  >({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await baseUrlRoute.delete(`/routines/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: () => {
      refetch();
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        toast.error(e.response.data);
      } else {
        toast.error(e.message);
      }
    },
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ values });
  }

  return (
    <div className="flex flex-col justify-center items-center my-4">
      <h1 className="text-1xl font-bold">User Routines:</h1>
      <div className="flex flex-row flex-wrap gap-2 border p-2 border-muted rounded-md">
        {error && <ErrorDiv error={error.message} statusCode={500} />}
        {isLoading && <Loader />}
        {data &&
          data.map((routine) => (
            <div
              key={routine.id}
              className="flex flex-col gap-2 p-2 border border-muted rounded-md bg-background"
            >
              <div className="absolute flex flex-row gap-10 justify-between">
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  className="z-50 m-1 border-2 border-muted"
                  disabled={isDeletePending}
                  onClick={() => mutateDelete({ id: routine.id })}
                >
                  <Trash2 />
                </Button>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="z-50 m-1 border-2 border-muted"
                  disabled={isDeletePending}
                  asChild
                >
                  <a href={`/gym-admin/edit-routines/${routine.id}`}>
                    {" "}
                    <Pen />
                  </a>
                </Button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-32 h-32 object-cover border border-muted rounded-md"
                src={routine.img}
                alt={routine.name}
              />
              <h1 className="text-sm font-bold w-32 h-7 overflow-auto">
                {routine.name}
              </h1>
              <p className="text-xs w-32 h-7 overflow-auto">
                {routine.description}
              </p>
            </div>
          ))}
      </div>
      <h1 className="text-1xl font-bold">Create Routine:</h1>
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
                    <Input placeholder="Leg Day Routine" {...field} />
                  </FormControl>
                  <FormDescription>Routine name</FormDescription>
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
                      placeholder="This routine focuses on leg exercises."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Routine description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/routine-image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Image URL for the routine</FormDescription>
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
