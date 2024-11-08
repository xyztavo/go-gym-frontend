import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 p-2 my-2 border border-muted rounded-md w-[95%] md:w-1/2">
        <h1 className="text-2xl font-bold">Routes:</h1>
        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/create-gym"}>Create Gym</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/create-plan"}>Create Plan</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/create-exercise"}>Create Exercise</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
