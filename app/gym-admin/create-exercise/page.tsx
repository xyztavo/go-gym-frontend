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
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

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

export default function Page() {
  type Response = {
    message: string;
  };


  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation<Response, Error, { values: z.infer<typeof formSchema>}>({
    mutationFn: ({values} : {values: z.infer<typeof formSchema>}) => {
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
      toast(data.message)
    },
    onError: (e) => {
      if (axios.isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode == 404) {
         toast.error("user gym not found")
        } else {
         toast.error("could not create exercise, reason :" + e.response.data)
        }
      }
    },
  })

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({values});
  }
  
  return (
    <div className="flex flex-col justify-center items-center my-4">
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
                    <Input  placeholder="https://i.pinimg.com/originals/14/49/c1/1449c166c96b868ed52b019d98250987.gif" {...field} />
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
