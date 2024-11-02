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
import { setCookie } from "cookies-next";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Email is not valid.",
  }),
  password: z.string().min(5, {
    message: "password must have at least 5 characters.",
  }),
});

export default function ProfileForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post("http://localhost:8000/auth", {
        email: values.email,
        password: values.password,
      });
      const authToken = res.data.token;
      setCookie("auth", authToken);
      toast({ title: "User logged in!" });
      router.push("/user");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle known errors returned by the server
        const statusCode = error.response.status;
        if (statusCode == 401) {
          toast({
            variant: "destructive",
            title: `Password does not match`,
          });
        }
        if (statusCode == 404) {
          toast({
            variant: "destructive",
            title: `User does not exists`,
          });
        }
      } else {
        // Handle other types of errors (like network errors)
        toast({
          variant: "destructive",
          title: "An unexpected error occurred.",
        });
      }
    }
  }
  return (
    <div className="flex flex-col justify-center items-center my-4">
      <div className="lg:border lg:p-2 rounded-md lg:border-muted lg:w-96">
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
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormDescription>Pick a strong password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
