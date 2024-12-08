import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center w-[80%] md:w-1/2 border border-muted rounded-md my-4 p-2">
        <h1 className="font-bold text-2xl">This is the user page.</h1>
        <div className="flex flex-row items-center justify-center flex-wrap gap-4">
          <Button asChild>
            <Link href={"/user/gym"}>User Gym Details</Link>
          </Button>
          <Button asChild>
            <Link href={"/exercises"}>Explore exercises</Link>
          </Button>
          <Button asChild>
            <Link href={"/user/check-in"}>Check In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
