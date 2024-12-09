import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center w-[80%] md:w-1/2 border border-muted rounded-md gap-2 p-2 mt-4">
        <h1 className="font-bold text-2xl">User routes:</h1>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold">Gym:</h1>
          <div className="flex flex-row items-center justify-center flex-wrap gap-4 p-2 border border-muted rounded">
            <Button asChild>
              <Link href={"/user/gym"}>User Gym Details</Link>
            </Button>
            <Button asChild>
              <Link href={"/user/check-in"}>Check In</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold">Explore:</h1>
          <div className="flex flex-row items-center justify-center flex-wrap gap-4 p-2 border border-muted rounded">
            <Button asChild>
              <Link href={"/exercises"}>Explore exercises</Link>
            </Button>
            <Button asChild>
              <Link href={"/collections"}>Explore collections</Link>
            </Button>
            <Button asChild>
              <Link href={"/routines"}>Explore Routines</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
