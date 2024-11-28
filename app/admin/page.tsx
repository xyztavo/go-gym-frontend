import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center my-4 gap-4">
      <h1 className="font-bold text-2xl">Admin routes:</h1>
      <Button variant={"outline"} asChild>
        <Link href={"/admin/set-gym-admin"}>Set gym admin</Link>
      </Button>
    </div>
  );
}
