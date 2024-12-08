"use client";
import { baseUrlRoute } from "@/api/lib/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
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
import { isAxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Email is not valid.",
    })
    .min(3, {
      message: "exercise name must have at least 3 characters",
    })
    .max(40, {
      message: "40 max characters.",
    }),
});

export default function Page() {
  const authToken = getCookie("auth");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ email: values.email });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await baseUrlRoute.post(
        `/gym/user/email`,
        { email: email },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: `User with email ${form.getValues("email")} is now a gym user!`,
      });
      form.reset();
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode === 401) {
          toast({
            variant: "destructive",
            title: "User is not admin",
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

  return (
    <div className="flex flex-col items-center justify-center my-4 gap-4">
      <h1 className="text-2xl font-bold">Set gym user by email:</h1>
      <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@email.com" {...field} />
                  </FormControl>
                  <FormDescription>The gym name</FormDescription>
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
