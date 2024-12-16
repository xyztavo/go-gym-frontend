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
type MutationResponse = {
  message: string;
};

type Res = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  img: string;
};

function Page() {
  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // get gym plans
  const { data, isLoading, error, refetch } = useQuery<Res[]>({
    queryKey: ["/gym/plans"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/gym/plans", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });

  // delete gym plan
  const { mutate: mutateDelete, isPending: isDeletePending } = useMutation<
    MutationResponse,
    Error,
    { id: string }
  >({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await baseUrlRoute.delete(`/gym/plans/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
      refetch();
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode == 404) {
          toast({
            variant: "destructive",
            title: "user gym not found",
          });
        } else {
          toast({
            variant: "destructive",
            title: e.response.data,
          });
        }
      }
    },
  });

  // create gym plan
  const { mutate: mutateCreate, isPending: isCreatePending } = useMutation<
    MutationResponse,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: async ({ values }: { values: z.infer<typeof formSchema> }) => {
      const res = await baseUrlRoute.post(
        "/gym/plans",
        {
          name: values.name,
          description: values.description,
          price: values.price,
          duration: values.duration,
          img: values.imageUrl,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
      refetch();
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode == 404) {
          toast({
            variant: "destructive",
            title: "user gym not found",
          });
        } else {
          toast({
            variant: "destructive",
            title: "could not create gym plan, reason : " + e.response.data,
          });
        }
      }
    },
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutateCreate({ values });
  }

  return (
    <div className="flex flex-col justify-center items-center my-4 gap-4">
      <h1 className="text-2xl font-bold">Gym Plans:</h1>
      <div className="flex flex-row items-center justify-center border border-muted rounded-md p-2 gap-2 flex-wrap">
        {error && <ErrorDiv error={error.message} statusCode={500} />}
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {data ? (
              data.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-col bg-background border border-muted rounded-md p-2"
                >
                  <div className="flex flex-row gap-24 p-1 items-center justify-between absolute">
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      className=""
                      onClick={() => mutateDelete({ id: plan.id })}
                      disabled={isDeletePending}
                    >
                      {isDeletePending ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      className=""
                      asChild
                    >
                      <Link href={`/gym-admin/edit-gym-plans/${plan.id}`}>
                        <Pen />
                      </Link>
                    </Button>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={plan.img}
                    className="w-44 h-44 object-cover rounded-md border border-muted"
                    alt={`plan ${plan.name} image`}
                  />
                  <h1 className="w-44 h-7 overflow-auto font-semibold">{plan.name}</h1>
                  <div className="flex flex-col gap-2">
                    <p className="w-44 h-7 overflow-auto">
                      {plan.description}
                    </p>
                    <div className="flex flex-row gap-2 border border-muted rounded-md">
                      <h1 className="border-r pr-2 border-muted">Price</h1>
                      <p>${plan.price}</p>
                    </div>
                    <div className="flex flex-row gap-2 border border-muted rounded-md">
                      <h1 className="border-r pr-2 border-muted">Duration</h1>
                      <p>{plan.duration} Days</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="font-semibold">No plans found</h1>
            )}
          </>
        )}
      </div>
      <h1 className="text-2xl font-bold">Create Plan:</h1>
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
            <Button type="submit" disabled={isCreatePending}>
              {isCreatePending && <Loader2 className="animate-spin" />}Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default withGymAdminProtectedRoute(Page);
