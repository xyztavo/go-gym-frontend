"use client";
import { baseUrlRoute } from "@/api/lib/routes";
import { GymDetailsResponse } from "@/types/api-types";
import { useQuery } from "@tanstack/react-query";
import ErrorDiv from "../error";
import Loader from "../loader";
import { getCookie } from "cookies-next";
import { Calendar, DollarSign, Notebook, Timer } from "lucide-react";
import Link from "next/link";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  trailingZeroDisplay: "stripIfInteger",
});

function GymCard() {
  const authToken = getCookie("auth");
  const { data, isLoading, error } = useQuery<GymDetailsResponse>({
    queryKey: ["gym"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/gym/details", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return res.data;
    },
    retry: false,
  });

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      {isLoading && <Loader />}
      {!isLoading && error && (
        <ErrorDiv error={"User does not have a gym"} statusCode={404} />
      )}
      {data?.name == "" && !isLoading && !error && (
        <ErrorDiv error={"User does not have a gym"} statusCode={404} />
      )}
      {data && (
        <>
          {data?.name != "" && (
            <div className="flex flex-col items-center justify-center gap-2 my-4 border border-muted rounded-md p-2">
              <div className="flex flex-col md:flex-row gap-2 items-center justify-center ">
                <div className="flex flex-col items-center justify-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.image}
                    className="object-cover w-52 h-52 rounded-md border border-muted my-4"
                    alt={data.name + " image"}
                  />
                  <h1 className="text-3xl text-center w-52 h-10 overflow-auto font-bold">
                    {data.name}
                  </h1>
                </div>
                <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
                  <div className="flex flex-col items-center justify-center gap-4 flex-wrap">
                    <div className="flex flex-col border rounded-md border-muted p-2 bg-background">
                      <p className="text-center font-bold pb-2">Description:</p>
                      <p className="font-light border-t border-primary pt-2 w-44 h-10 overflow-auto">
                        {data.description}
                      </p>
                    </div>
                    <div className="flex flex-col border rounded-md border-muted p-2 bg-background">
                      <p className="text-center font-bold pb-2">Location:</p>
                      <p className="font-light border-t border-primary pt-2 w-44 h-10 overflow-auto">
                        {data.location}
                      </p>
                    </div>
                    <div className="flex flex-col border rounded-md border-muted p-2 bg-background">
                      <p className="text-center font-bold pb-2">Number:</p>
                      <a
                        href={`tel:${data.number}`}
                        className="font-light border-t border-primary pt-2 w-44 h-10 overflow-auto"
                      >
                        {data.number}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-start justify-center flex-wrap gap-2 border p-2 border-muted rounded-md">
                {data.plans && (
                  <div className="flex flex-col gap-4 items-center justify-center p-2  py-4">
                    <h1 className="text-xl font-semibold flex flex-row gap-2 items-center justify-center">
                      <Notebook className="text-primary" />
                      Plans:
                    </h1>
                    <div className="flex flex-row flex-wrap justify-center items-center gap-4">
                      {data.plans.map((plan, i) => (
                        <div
                          className="border border-muted p-2 rounded-md flex flex-col justify-center items-center gap-2 bg-background"
                          key={i}
                        >
                          <div className="flex flex-col items-center justify-center border-b pb-2 border-primary ">
                            <h1 className="font-semibold">{plan.name}</h1>
                            <p className="text-sm w-44 h-7 overflow-auto">
                              {plan.description}
                            </p>
                          </div>
                          <div className="flex flex-row items-center gap-4 flex-wrap justify-center">
                            <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2">
                              <h2 className="font-semibold border-b border-muted text-center w-16 flex flex-row gap-2 items-center">
                                <DollarSign className="w-4 text-primary" />
                                Price
                              </h2>
                              <p className="text-sm">
                                {formatter.format(plan.price)}
                              </p>
                            </div>
                            <div className="flex flex-col items-center justify-center border border-muted rounded-md p-2">
                              <h2 className="font-semibold border-b border-muted text-center w-18 flex flex-row gap-2 items-center">
                                <Timer className="w-4 text-primary" />
                                Duration
                              </h2>
                              <p className="text-sm">{plan.duration} Days</p>
                            </div>
                          </div>
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
                  <div className="flex flex-col gap-4 items-center justify-center p-2 py-4">
                    <h1 className="text-xl font-semibold flex flex-row gap-2 items-center justify-center">
                      <Calendar className="text-primary" /> Routines:
                    </h1>
                    <div className="flex flex-row flex-wrap justify-center items-center  gap-4">
                      {data.routines.map((routines, i) => (
                        <Link
                          href={`/routines/${routines.id}/collections`}
                          className="bg-background hover:scale-110 transition-transform border border-muted p-2 rounded-md flex flex-col justify-center items-center gap-2"
                          key={i}
                        >
                          <h1 className="font-semibold">{routines.name}</h1>
                          <p className="text-sm border-b border-primary w-44 h-7 overflow-auto">
                            {routines.description}
                          </p>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={routines.img}
                            className="object-cover w-24 h-24 rounded-md border border-muted"
                            alt={routines.name + " image"}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { GymCard };
