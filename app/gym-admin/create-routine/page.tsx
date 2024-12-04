"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { withGymAdminProtectedRoute } from "@/components/auth/gym-admin-protected-route";
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
import { toast } from "@/hooks/use-toast";
import { getCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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

function Page() {
  type Response = {
    message: string;
  };
  const [data, setData] = useState<Response>();
  const [isLoading, setIsLoading] = useState(false);

  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    baseUrlRoute
      .post(
        "/routines",
        {
          name: values.name,
          description: values.description,
          img: values.img,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
        toast({ title: res.data.message });
      })
      .catch((e) => {
        if (axios.isAxiosError(e) && e.response) {
          const statusCode = e.response.status;
          if (statusCode === 404) {
            toast({
              variant: "destructive",
              title: "User gym not found.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Could not create routine. Reason: " + e.response.data,
            });
          }
        }
        setIsLoading(false);
      });
  }
  
  useEffect(() => {
    if (data) {
      toast({
        title: data.message,
      });
    }
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center my-4">
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" />}Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default withGymAdminProtectedRoute(Page);
