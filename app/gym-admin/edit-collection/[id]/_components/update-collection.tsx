"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { baseUrlRoute } from "@/api/lib/routes";
import { getCookie } from "cookies-next";
import axios from "axios";
import { toast } from "sonner";

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
  img: z
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

export default function EditCollection({
  data,
  refetch,
  id,
}: {
  data: Res | undefined;
  refetch: () => void;
  id: string;
}) {
  const authToken = getCookie("auth");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation<
    Res,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: async ({ values }: { values: z.infer<typeof formSchema> }) => {
      const res = await baseUrlRoute.put(`/collections/${id}`, values, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: () => {
      toast("routine updated");
      refetch();
    },
    onError: (e) => {
      if (axios.isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode === 404) {
          toast.error("user gym not found");
        } else {
          toast.error("could not create collection, reason :" + e.response.data);
        }
      }
    },
  });

  function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ values });
  }

  if (data)
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            defaultValue={data.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Arm Day" {...field} />
                </FormControl>
                <FormDescription>The collection name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            defaultValue={data.description}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Arm Day" {...field} />
                </FormControl>
                <FormDescription>The collection description</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="img"
            defaultValue={data.img}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo Image Url</FormLabel>
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
            {isPending && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    );
}
