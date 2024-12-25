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
import { isAxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import ErrorDiv from "@/components/error";
import Link from "next/link";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "gym name must have at least 3 characters",
    })
    .max(40, {
      message: "40 max characters.",
    }),
  description: z
    .string()
    .min(3, {
      message: "gym description must have at least 3 characters",
    })
    .max(200, {
      message: "200 max characters.",
    }),
  imageUrl: z
    .string()
    .min(3, {
      message: "imageUrl must have at least 3 characters",
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
  type Response = {
    message: string;
  };

  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // get user collections
  const { data, isLoading, error, refetch } = useQuery<Res[]>({
    queryKey: ["/user/collections"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/collections", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });

  // create collection
  const { mutate, isPending } = useMutation<
    Response,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: async ({ values }: { values: z.infer<typeof formSchema> }) => {
      const res = await baseUrlRoute.post(
        "/collections",
        {
          name: values.name,
          description: values.description,
          img: values.imageUrl,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast(data.message);
      refetch();
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
  });

  // delete collection
  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation<
    Response,
    Error,
    { id: string }
  >({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await baseUrlRoute.delete(`/collections/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast(data.message);
      refetch();
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
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ values });
  }

  return (
    <div className="flex flex-col justify-center items-center my-4 gap-2">
      <h1 className="text-1xl font-bold">User Collections:</h1>
      <div className="flex flex-row items-center justify-center flex-wrap gap-4 p-2 border border-muted rounded">
        {error && <ErrorDiv error={error.message} statusCode={500} />}
        {isLoading && <Loader />}
        {!data && !isLoading && (
          <ErrorDiv error="No user collections" statusCode={404} />
        )}
        {data &&
          data.map((collection) => (
            <div
              key={collection.id}
              className="flex flex-col items-center justify-center gap-2 p-2 border border-muted rounded-md bg-background"
            >
              <div className="absolute flex flex-row justify-between mt-[-14rem] gap-28">
                <Button className="border-2 border-muted" variant={"outline"} size={"icon"} asChild>
                  <Link href={`/gym-admin/edit-collection/${collection.id}`}>
                    <Pen />
                  </Link>
                </Button>
                <Button
                  variant={"destructive"}
                  size={"icon"}
                  className="border-2 border-muted"
                  onClick={() => mutateDelete({ id: collection.id })}
                  disabled={isDeletePending}
                >
                  <Trash2 />
                </Button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-48 h-48 rounded-md border border-muted object-cover"
                src={collection.img}
                alt={`${collection.name} img`}
              />
              <h1 className="w-48 h-7 overflow-auto text-lg font-bold">
                {collection.name}
              </h1>
              <h1 className="w-48 h-7 overflow-auto text-sm">
                {collection.description}
              </h1>
            </div>
          ))}
      </div>
      <h1 className="text-1xl font-bold">Create Collection:</h1>
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
                    <Input placeholder="shoulder day" {...field} />
                  </FormControl>
                  <FormDescription>Collection name</FormDescription>
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
                      placeholder="This will target your front delts..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Collection description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Image Url</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiDZxQfY5I4t3TrgiIfevE_aBfI7Mdf1O05A&s"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Collection image (if possible a square one)
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
