import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center my-4 gap-4 p-2">
      <h1 className="font-bold text-2xl">Admin routes:</h1>
      <div className="flex flex-row flex-wrap border border-muted rounded-md p-2">
        <Button variant={"outline"} asChild>
          <Link href={"/admin/set-gym-admin"}>Set gym admin</Link>
        </Button>
      </div>
      <h1 className="text-xl font-semibold">Global:</h1>
        <div className="flex flex-row flex-wrap items-center border border-muted rounded-md p-2 justify-center gap-4">
          <Button variant={"outline"} asChild>
            <Link href={"/gym-admin/edit-exercise"}>Edit Exercise</Link>
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
  );
}
