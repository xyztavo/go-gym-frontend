"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { baseUrlRoute } from "@/api/lib/routes";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  email: z.string().email({
    message: "Email is not valid.",
  }),
  password: z.string().min(8, {
    message: "password must have at least 5 characters.",
  }),
});

export default function ProfileForm() {
  const authToken = getCookie("auth");
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await baseUrlRoute.post("/auth", {
        email: email,
        password: password,
      });
      const authToken = res.data.token;
      const role = res.data.role;
      setCookie("auth", authToken);
      setCookie("role", role); // Save the role in a cookie
      toast("User logged in!");

      if (role == "regular") {
        router.push("/user");
      } else if (role == "admin") {
        router.push("/admin");
      } else if (role == "gym-admin") {
        router.push("/gym-admin");
      }
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        if (statusCode == 401) {
          toast.error(`Password does not match`);
        }
        if (statusCode == 404) {
          toast.error(`User does not exists`);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate({ email: values.email, password: values.password });
  }

  if (authToken) return <div>Already logged in.</div>;

  return (
    <div className="flex flex-col justify-center items-center my-4">
      <img src="logo.svg" className="w-64 lg:w-80 my-10" alt="" />
      <div className="lg:p-2 rounded-md lg:border-muted lg:w-96 h-full">
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
                  <FormDescription>Your email</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormDescription>Pick a strong password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
            >
              {isPending && <Loader2Icon className="animate-spin" />}Log In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
