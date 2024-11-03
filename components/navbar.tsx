"use client"
import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { BicepsFlexed, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
export function Navbar() {
  const authToken = getCookie("auth");
  const router = useRouter()
  return (
    <div className="flex justify-between items-center border-b border-muted p-2">
      <Button
        className="font-bold text-xl gap-4"
        variant={"outline"}
        size={"lg"}
        asChild
      >
        <Link href={"/"}>
          <BicepsFlexed />
          Go Gym
        </Link>
      </Button>
      {authToken != null ?(
        <Button onClick={() => {
          deleteCookie("auth")
          router.push("/")
          router.refresh()
        }}>Log out</Button>
      ) : (
        <div>
          <div className="xl:hidden md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"secondary"}>
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-2">
                  <DropdownMenuItem asChild>
                    <Button size={"lg"} asChild>
                      <Link href={"/register"}>Register</Link>
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button size={"lg"} variant={"outline"} asChild>
                      <Link href={"/login"}>Log in</Link>
                    </Button>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden lg:flex flex-row justify-center items-center gap-4">
            <ModeToggle />
            <Button size={"lg"} asChild>
              <Link href={"/register"}>Register</Link>
            </Button>
            <Button size={"lg"} variant={"outline"} asChild>
              <Link href={"/login"}>Log in</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
