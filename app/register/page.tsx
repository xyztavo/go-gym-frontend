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
import { baseUrlRoute } from "@/api/lib/routes";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Require full name.",
  }),
  email: z.string().email({
    message: "Email is not valid.",
  }),
  password: z.string().min(5, {
    message: "password must have at least 5 characters.",
  }),
});

export default function ProfileForm() {
  const router = useRouter();
  const authToken = getCookie("auth");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      const res = await baseUrlRoute.post("/users", {
        name: name,
        email: email,
        password: password,
      });
      const authToken = res.data.token;

      setCookie("auth", authToken);
      setCookie("role", "regular");

      toast("User created with ease!");
      router.push("/user");
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        if (statusCode === 500) {
          toast.error(`Error reason: ${error.response.data}`);
        }
        if (statusCode === 409) {
          toast.error(`User email already in use`);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  if (authToken) return <div>Already logged in.</div>;

  return (
    <div className="flex flex-col justify-center items-center my-4">
      <h1 className="text-xl font-bold">Create your account:</h1>
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
                    <Input placeholder="gustavo" {...field} />
                  </FormControl>
                  <FormDescription>Your Full Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormDescription>Pick a strong password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="flex flex-row items-center justify-center"
            >
              {isPending && <Loader2 className="animate-spin" />}Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
