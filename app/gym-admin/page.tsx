import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 p-2 my-2 border border-muted rounded-md w-[95%] md:w-1/2">
        <h1 className="text-2xl font-bold border-b border-muted m-2 p-2">
          Gym Admin Routes:
        </h1>
        <h1 className="text-xl font-semibold">Gym related stuff:</h1>
        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/edit-gym"}>Edit or Create Gym</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/edit-gym-plans"}>Edit Gym Plans</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/gym-routines"}>Edit Gym-Routines</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/set-gym-user"}>Add user to gym by email</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/check-in"}>Check in user</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/set-user-plan"}>Add plan to user</Link>
          </Button>
        </div>
        <h1 className="text-xl font-semibold">Global:</h1>
        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/create-exercise"}>Create Exercise</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/edit-collection"}>Edit Collection</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/edit-rep-collection/collections"}>
              Edit exercises reps in collection
            </Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/edit-routines"}>Edit Routines</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/edit-routines-collections"}>
              Edit routine collections
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
