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
    .max(40, {
      message: "40 max characters.",
    }),
  price: z.coerce.number().max(10000, {
    message: "10000 max price.",
  }),
  duration: z.coerce
    .number({
      message: "gym plan duration must be a number",
    })
    .max(10000, {
      message: "10000 max duration.",
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

function Page() {
  type Response = {
    message: string;
  };
  const [data, setData] = useState<Response>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    baseUrlRoute
      .post(
        "/gym/plans",
        {
          name: values.name,
          description: values.description,
          price: values.price,
          duration: values.duration,
          img: values.imageUrl,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      )
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
      })
      .catch((e) => setError(e));
  }
  useEffect(() => {
    if (axios.isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      if (statusCode == 404) {
        toast({
          variant: "destructive",
          title: "user gym not found",
        });
      } else {
        toast({
          variant: "destructive",
          title: "could not create gym plan, reason : " + error.response.data,
        });
      }
      setIsLoading(false);
    }
    if (data) {
      toast({
        title: data.message,
      });
    }
  }, [data, error]);
  return (
    <div className="flex flex-col justify-center items-center my-4">
      <h1 className="text-1xl font-bold">Create gym:</h1>
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
                    <Input placeholder="Monthly Bodybuilding" {...field} />
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
                      placeholder="This plan grants you access to..."
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormDescription>
                    The plan price, accepts float numbers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="30" {...field} />
                  </FormControl>
                  <FormDescription>The plan duration in days</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
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
                    plan image (if possible a square one)
                  </FormDescription>
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
