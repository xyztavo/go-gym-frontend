'use client';

import { baseUrlRoute } from "@/api/lib/routes";
import Loader from "@/components/loader";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import Link from "next/link";

type Res = {
    id: string
    adminId: string
    name: string
    description: string
    img: string
}

export default function Page() {
  const authToken = getCookie("auth");

  const { data, isLoading, error } = useQuery<Res[]>({
    queryKey: ["/user/routines"],
    queryFn: async () => {
      const res = await baseUrlRoute.get("/user/routines", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return res.data;
    },
  });

  if (error) return <div>something has happened</div>

  return (
    <div className="flex flex-col items-center justify-center my-4 gap-2">
      <div className="flex flex-col items-center justify-center p-2 m-2 gap-2 ">
        <h1 className="text-2xl font-bold">User routines:</h1>
        <div className="flex flex-row items-center justify-center flex-wrap p-2 border border-muted rounded-md gap-2">
            {isLoading ? <Loader /> : 
               <>{data && data.map((routine) => {
                return (
                <Link href={`/gym-admin/edit-routines-collections/${routine.id}`} className="flex bg-background hover:scale-110 transition-transform flex-col items-center justify-center border border-muted rounded-md p-2 gap-2" key={routine.id}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="w-44 h-44 object-cover" src={routine.img} alt={`routine ${routine.name} image`} />
                    <h1 className="text-xl font-semibold">{routine.name}</h1>
                    <p className="text-sm font-thin">{routine.description}</p>
                </Link>)
               })}</> }
        </div>
      </div>
    </div>
  );
}
