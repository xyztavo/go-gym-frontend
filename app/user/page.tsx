import { GymCard } from "@/components/gym/gym-card";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Page() {

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-2 p-2 mt-4">
        <h1 className="font-bold text-2xl">User routes:</h1>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold">Gym:</h1>
          <div className="flex flex-col items-center justify-center flex-wrap gap-4 p-2">
            <GymCard />
            <Button asChild>
              <Link href={"/user/check-in"}>Check In</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold">Explore:</h1>
          <div className="flex flex-row items-center justify-center flex-wrap gap-4 p-2 border border-muted rounded">
            <Link
              className="flex flex-col bg-background hover:scale-110 transition-transform items-center justify-center gap-2 p-2 border border-muted rounded-md"
              href={"/exercises"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/benchPress.gif"
                alt={`barbell bench press gif`}
                className="w-40 h-40 object-cover border border-muted rounded-md"
              />
              <Button>Explore exercises</Button>
            </Link>
            <Link
              className="flex flex-col bg-background hover:scale-110 transition-transform items-center justify-center gap-2 p-2 border border-muted rounded-md"
              href={"/collections"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={"/chestDay.png"}
                alt={`barbell bench press gif`}
                className="w-40 h-40 object-cover border border-muted rounded-md"
              />
              <Button>Explore Collections</Button>
            </Link>
            <Link
              className="flex flex-col bg-background hover:scale-110 transition-transform items-center justify-center gap-2 p-2 border border-muted rounded-md"
              href={"/routines"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={"/300Routine.png"}
                alt={`barbell bench press gif`}
                className="w-40 h-40 object-cover border border-muted rounded-md"
              />
              <Button>Explore Routines</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
