"use client";

import { baseUrlRoute } from "@/api/lib/routes";
import { getCookie } from "cookies-next";
import { Calendar, Loader2, Notebook } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const authToken = getCookie("auth");
  const [data, setData] = useState<Response>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  type Response = {
    name: string;
    description: string;
    location: string;
    number: string;
    image: string;
    plans: Plan[];
    routines: Routine[];
  };
  type Plan = {
    name: string;
    description: string;
    price: number;
    duration: number;
    img: string;
  };
  type Routine = {
    name: string;
    description: string;
    img: string;
  };
  useEffect(() => {
    baseUrlRoute
      .get("/user/gym/details", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
        setIsLoading(false);
      });
  }, [authToken]);

  if (error) return <div>User gym not found </div>;

  return (
    <div className="flex flex-col justify-center items-center">
      {isLoading && (
        <div className="flex flex-row gap-2 items-center justify-center text-2xl my-4">
          <Loader2 className="animate-spin" />
          Loading...
        </div>
      )}
      {data && (
        <div className="flex flex-col border border-muted rounded-md items-center justify-center gap-2 my-4 md:w-1/2">
          <img
            src={data.image}
            className="object-cover w-52 h-52 rounded-md border border-muted my-4"
          />
          <h1 className="text-2xl font-bold">{data.name}</h1>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
            <div className="flex flex-col border rounded-md border-muted p-2">
              <p className="text-center font-bold pb-2">Description:</p>
              <p className="font-light border-t border-muted pt-2">
                {data.description}
              </p>
            </div>
            <div className="flex flex-col border rounded-md border-muted p-2">
              <p className="text-center font-bold pb-2">Location:</p>
              <p className="font-light border-t border-muted pt-2">
                {data.location}
              </p>
            </div>
            <div className="flex flex-col border rounded-md border-muted p-2">
              <p className="text-center font-bold pb-2">Number:</p>
              <a
                href={`tel:${data.number}`}
                className="font-light border-t border-muted pt-2"
              >
                {data.number}
              </a>
            </div>
            {data.plans && (
              <div className="flex flex-col gap-4 items-center justify-center border-t border-muted py-4">
                <h1 className="text-xl font-semibold flex flex-row gap-2 items-center justify-center">
                  <Notebook />
                  Plans:
                </h1>
                <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                  {data.plans.map((plan, i) => (
                    <div
                      className="border border-muted p-2 rounded-md flex flex-col justify-center items-center"
                      key={i}
                    >
                      <h1 className="font-semibold">{plan.name}</h1>
                      <p className="text-sm">{plan.description}</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={plan.img}
                        className="object-cover w-24 h-24 rounded-md border border-muted"
                        alt={plan.name + " image"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.routines && (
              <div className="flex flex-col gap-4 items-center justify-center border-t border-muted py-4">
                <h1 className="text-xl font-semibold flex flex-row gap-2 items-center justify-center">
                  <Calendar /> Routines:
                </h1>
                <div className="flex flex-row flex-wrap items-center justify-center gap-4">
                  {data.plans.map((routines, i) => (
                    <div
                      className="border border-muted p-2 rounded-md flex flex-col justify-center items-center"
                      key={i}
                    >
                      <h1 className="font-semibold">{routines.name}</h1>
                      <p className="text-sm">{routines.description}</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={routines.img}
                        className="object-cover w-24 h-24 rounded-md border border-muted"
                        alt={routines.name + " image"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
