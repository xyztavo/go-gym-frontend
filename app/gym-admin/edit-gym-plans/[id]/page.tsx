"use client";
import { baseUrlRoute } from "@/api/lib/routes";
import ErrorDiv from "@/components/error";
import Loader from "@/components/loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
  name: string;
  description: string;
  price: number;
  duration: number;
  img: string;
};
export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const params = useParams<{ id: string }>();
  const authToken = getCookie("auth");

  const { data, isLoading, error, refetch } = useQuery<Res>({
    queryKey: [`/gym/plans/${params.id}`],
    queryFn: async () => {
      const res = await baseUrlRoute.get(`/gym/plans/${params.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return res.data;
    },
  });

  const { mutate, isPending } = useMutation<
    Res,
    Error,
    { values: z.infer<typeof formSchema> }
  >({
    mutationFn: async ({ values }: { values: z.infer<typeof formSchema> }) => {
      const res = await baseUrlRoute.put(`/gym/plans/${params.id}`, values, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
    onSuccess: () => {
      form.reset();
      toast("Plan updated successfully!");
      refetch();
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        toast.error(e.response.data)
      }
      toast("Error updating plan.");
    },
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ values });
  }

  if (error) {
    if (isAxiosError(error) && error.response) {
      return (
        <ErrorDiv
          error={error.response.data}
          statusCode={error.response.status}
        />
      );
    }
  }

  if (isLoading) return <Loader />;

  if (data)
    return (
      <div className="flex flex-col items-center justify-center my-4 gap-2">
        <h1 className="text-2xl font-bold">Plan:</h1>
        <div className="flex flex-col bg-background border border-muted rounded-md p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.img}
            className="w-44 h-44 object-cover rounded-md border border-muted"
            alt={`plan ${data.name} image`}
          />
          <h1 className="w-44 h-7 overflow-auto font-semibold">{data.name}</h1>
          <div className="flex flex-col gap-2">
            <p className="w-44 h-7 overflow-auto">{data.description}</p>
            <div className="flex flex-row gap-2 border border-muted rounded-md">
              <h1 className="border-r pr-2 border-muted">Price</h1>
              <p>${data.price}</p>
            </div>
            <div className="flex flex-row gap-2 border border-muted rounded-md">
              <h1 className="border-r pr-2 border-muted">Duration</h1>
              <p>{data.duration} Days</p>
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Edit plan:</h1>
        <div className="flex flex-col items-center justify-center p-2 border rounded-md border-muted">
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
                name="price"
                defaultValue={data.price}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="10" type="number" {...field} />
                    </FormControl>
                    <FormDescription>The price of the plan</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                defaultValue={data.duration}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="30" {...field} type="number" />
                    </FormControl>
                    <FormDescription>The duration in days</FormDescription>
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
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
}
