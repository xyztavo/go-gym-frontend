'use client'

import { baseUrlRoute } from "@/api/lib/routes"
import { useQuery } from "@tanstack/react-query"
import { getCookie } from "cookies-next"
import AddGymRoutine from "./_components/page"
import Loader from "@/components/loader"

type Res = {
    id: string
    name: string
    description: string
    img: string
}

export default function Page() {
    const authToken = getCookie('auth')

    const {data, isLoading, error, refetch } = useQuery<Res[]>({ queryKey: ['/user/gym/routines'], queryFn: async () => {
        const res = await baseUrlRoute.get('/user/gym/routines', { headers: { Authorization: `Bearer ${authToken}`}})
        return res.data
    }})

    return (
        <div className="flex flex-col items-center justify-center my-4 gap-2 p-2">
            <h1 className="font-bold text-2xl">User gym routines:</h1>
            {isLoading && <Loader />}
            {error && <div>{error.message}</div>}
            {data ? <div className="flex flex-row flex-wrap items-center justify-center gap-2 p-2 border border-muted rounded-md">
                {data.map((routine) => {
                    return (
                        <div key={routine.id} className="flex flex-col items-center justify-center p-2 border border-muted rounded-md">
                            {/*  eslint-disable-next-line @next/next/no-img-element */}
                            <img className="border border-muted rounded-md w-44 h-44 object-cover" src={routine.img} alt={`gym routine ${routine.name} image`} />
                            <h1 className="font-semibold text-xl w-44 h-7 overflow-auto">{routine.name}</h1>
                            <p className="font-thin text-sm w-44 h-7 overflow-auto">{routine.description}</p>
                        </div>
                    )
                })}
                </div> : <div> No gym routine was found</div>}
                <AddGymRoutine refetchRoutines={refetch} />
        </div>
    )
}