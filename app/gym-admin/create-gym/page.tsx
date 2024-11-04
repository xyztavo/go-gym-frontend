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
  location: z
    .string()
    .min(3, {
      message: "gym location must have at least 3 characters",
    })
    .max(40, {
      message: "40 max characters.",
    }),
  number: z
    .string()
    .min(3, {
      message: "gym number must have at least 3 characters",
    })
    .max(40, {
      message: "40 max characters.",
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
        "/gym",
        {
          name: values.name,
          description: values.description,
          location: values.location,
          number: values.number,
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
      if (statusCode == 400) {
        toast({
          variant: "destructive",
          title: "user already has a gym",
        });
      } else {
        toast({
          variant: "destructive",
          title: "could not create gym",
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
                    <Input placeholder="Waltuh Gym" {...field} />
                  </FormControl>
                  <FormDescription>The gym name</FormDescription>
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
                    <Input placeholder="this gym very cool..." {...field} />
                  </FormControl>
                  <FormDescription>The gym description</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="308 Negra Arroyo Lane..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Location where your gym resides
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+55 11 00000-0000" {...field} />
                  </FormControl>
                  <FormDescription>The gym phone number</FormDescription>
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
                    Gym url logo (if possible a square one)
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
