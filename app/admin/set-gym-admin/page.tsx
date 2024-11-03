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
import { getCookie } from "cookies-next";
import { toast } from "@/hooks/use-toast";
import { withAdminProtectedRoute } from "@/components/auth/admin-protected-route";
import { baseUrlRoute } from "@/api/lib/routes";

const formSchema = z.object({
  email: z.string().email({
    message: "Email is not valid.",
  }),
});

function Page() {
  const authToken = getCookie("auth");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function OnSubmit(values: z.infer<typeof formSchema>) {
    try {
      await baseUrlRoute.post(
        "/users/gym-admin/email",
        {
          email: values.email,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast({
        title: `user with email ${values.email} is now a gym admin`,
      });
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
            title: `User with email ${values.email} does not exists`,
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
      <h1 className="text-1xl font-bold">Set user gym admin by email:</h1>
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
                  <FormDescription>The email of the user you want to turn into a gym admin</FormDescription>
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

export default withAdminProtectedRoute(Page);
