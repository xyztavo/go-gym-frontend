"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { getCookie } from "cookies-next";
import { DollarSign, Timer } from "lucide-react";
import { useState } from "react";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  trailingZeroDisplay: "stripIfInteger",
});

type Res = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  img: string;
};

type MutateRes = {
  message: string;
};
export default function Page() {
  const authToken = getCookie("auth");
  const [email, setEmail] = useState("");

  const { data, error, isLoading } = useQuery<Res[]>({
    queryKey: ["/user/gym/plans"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/gym/plans", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });

  const { mutate, isPending } = useMutation<
    MutateRes,
    Error,
    { email: string; planId: string }
  >({
    mutationFn: async ({
      email,
      planId,
    }: {
      email: string;
      planId: string;
    }) => {
      const res = await baseUrlRoute.patch(
        "/gym/user/plan",
        { email: email, planId: planId },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        const statusCode = e.response.status;
        if (statusCode === 401) {
          toast({
            title: "Unauthorized",
            description: "You are not authorized to access this page",
            variant: "destructive",
          });
        } else {
          toast({
            title: e.response.data,
            description: "Something went wrong",
            variant: "destructive",
          });
        }
      }
    },
  });

  if (error) {
    if (isAxiosError(error) && error.response) {
      const statusCode = error.response.status;
      if (statusCode === 401) {
        toast({
          title: "Unauthorized",
          description: "You are not authorized to access this page",
          variant: "destructive",
        });
      } else {
        toast({
          title: error.response.data,
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-2xl">Gym plans</h1>
      <div className="flex flex-row items-center justify-center flex-wrap gap-4">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {data &&
              data.map((plan) => {
                return (
                  <div
                    className="flex flex-col items-center justify-center gap-2 border border-muted rounded-md p-2"
                    key={plan.id}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 border border-muted rounded-md p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-44 h-44 border border-muted rounded-md object-cover"
                        src={plan.img}
                        alt={`plan ${plan.name} image`}
                      />
                      <h1 className="font-semibold text-xl w-44 h-7 overflow-auto">
                        {plan.name}
                      </h1>
                      <p className="font-thin text-sm w-44 h-7 overflow-auto">
                        {plan.description}
                      </p>
                      <div className="flex flex-row items-center gap-4 flex-wrap justify-center">
                        <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2">
                          <h2 className="font-semibold border-b border-muted text-center w-16 flex flex-row gap-2 items-center">
                            <DollarSign className="w-4" />
                            Price
                          </h2>
                          <p className="text-sm">
                            {formatter.format(plan.price)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2">
                          <h2 className="font-semibold border-b border-muted text-center w-18 flex flex-row gap-2 items-center">
                            <Timer className="w-4" />
                            Duration
                          </h2>
                          <p className="text-sm">{plan.duration} Days</p>
                        </div>
                      </div>
                    </div>
                    <h1 className="font-semibold text-xl">User email:</h1>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        mutate({ email: email, planId: plan.id });
                      }}
                      className="flex flex-col items-center justify-center gap-2"
                    >
                      <Input
                        disabled={isPending}
                        type="email"
                        placeholder="email@email.com"
                        className="border border-muted rounded-md p-2"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button disabled={isPending}>
                        {isPending && <Loader />}
                        Set Plan
                      </Button>
                    </form>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
