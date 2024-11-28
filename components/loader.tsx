import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-row items-center justify-center gap-2 my-4">
      <Loader2 className="animate-spin" />{" "}
      <p className="font-semibold text-2xl">Loading...</p>
    </div>
  );
}
