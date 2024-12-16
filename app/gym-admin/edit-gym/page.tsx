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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "@/components/loader";
import { useEffect } from "react";

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
  img: z
    .string()
    .min(3, {
      message: "imageUrl must have at least 3 characters",
    })
    .max(200, {
      message: "200 max characters.",
    }),
});
type Response = {
  message: string;
};

type GymResponse = {
  name: string;
  description: string;
  location: string;
  number: string;
  img: string;
};

function Page() {
  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { data, isLoading, refetch } = useQuery<GymResponse>({
    queryKey: ["/user/gym"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/gym", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    }, retry: false
  });

  useEffect(() => {
    if (data) {
      form.reset(data); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // update gym
  const { mutate: updateGym, isPending: isUpdatePending } = useMutation<
    Response,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: async ({ values }: { values: z.infer<typeof formSchema> }) => {
      const res = await baseUrlRoute.put<Response>(`/gym`, values, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: async () => {
      toast({
        title: "Gym updated successfully!",
      });
      await refetch();
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        toast({
          title: e.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });

  // create gym 
  const { mutate, isPending } = useMutation<
    Response,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: async ({ values }: { values: z.infer<typeof formSchema> }) => {
      const res = await baseUrlRoute.post<Response>(`/gym`, values, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Gym created successfully!",
      });
      refetch();
      form.reset();
    },
    onError: (e) => {
      if (isAxiosError(e)) {
        toast({
          title: e.response?.data.message,
          variant: "destructive",
        });
      }
    },
  });
  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ values });
  }

  async function UpdateOnSubmit(values: z.infer<typeof formSchema>) {
    updateGym({ values });
  }

  return (
    <div className="flex flex-col justify-center items-center my-4">
      {isLoading && <Loader />}
      {data && data.name ? (
        <div className="flex flex-col items-center justify-center gap-4 my-4">
          <div className="flex flex-col gap-2 items-center justify-center border rounded-md p-2 border-muted">
            <h1 className="text-xl font-bold">{data.name}</h1>
            <p>description: {data.description}</p>
            <p>location: {data.location}</p>
            <p>number: {data.number}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.img}
              className="w-44 h-44 object-cover rounded-md border border-muted"
              loading="lazy"
              alt=""
            />
          </div>
          <h1 className="text-xl font-bold">Update gym:</h1>
          <div className="lg:border lg:p-2 rounded-md lg:border-muted lg:w-96">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(UpdateOnSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  defaultValue={data.name}
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
                  defaultValue={data.description}
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
                  defaultValue={data.location}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="308 Negra Arroyo Lane..."
                          {...field}
                        />
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
                  defaultValue={data.number}
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
                        Gym url logo (if possible a square one)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isUpdatePending}>
                  {isUpdatePending && <Loader2 className="animate-spin" />}
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-1xl font-bold">Create gym:</h1>
          <div className="lg:border lg:p-2 rounded-md lg:border-muted lg:w-96">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(OnSubmit)}
                className="space-y-8"
              >
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
                        <Input
                          placeholder="308 Negra Arroyo Lane..."
                          {...field}
                        />
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
                  name="img"
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
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="animate-spin" />}Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}

export default withGymAdminProtectedRoute(Page);
