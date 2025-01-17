"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CookieValueTypes, deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { verifyToken } from "@/utils/auth";
import { useEffect } from "react";

export function Navbar() {
  const authToken = getCookie("auth");
  const userRole = getCookie("role"); // Assuming the role is stored in a cookie named "role"
  const router = useRouter();

  // Verify token on component mount
  useEffect(() => {
    if (authToken && !verifyToken()) {
      router.push("/login");
      router.refresh();
    }
  }, [authToken, router]);

  const getRedirectPath = (role: CookieValueTypes) => {
    switch (role) {
      case "regular":
        return "/user";
      case "admin":
        return "/admin";
      case "gym-admin":
        return "/gym-admin";
      default:
        return "/";
    }
  };

  return (
    <div className="flex justify-between items-center border-b border-muted p-1">
      <Button
        className="font-bold text-xl gap-4"
        variant={"ghost"}
        size={"lg"}
        asChild
      >
        <Link href={authToken ? getRedirectPath(userRole) : "/"} className="">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" className="w-32" alt="" />
        </Link>
      </Button>
      {/* if user auth: */}
      {authToken != null ? (
        <div>
          {/* if user desktop auth: */}
          <div className="hidden md:flex flex-row justify-center items-center gap-4">
            <Button
              onClick={() => {
                deleteCookie("auth");
                deleteCookie("role"); // Clear role cookie as well
                router.push("/");
                router.refresh();
              }}
            >
              Log out
            </Button>
            <ModeToggle />
          </div>

          {/* if user mobile auth: */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size={"icon"} variant={"secondary"}>
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="border-muted bg-background">
                <SheetHeader>
                  <SheetTitle>User route:</SheetTitle>
                  <SheetDescription className="flex flex-col gap-2 items-center justify-center">
                    <div className="flex flex-row gap-2 items-center justify-center">
                      <SheetClose asChild>
                        <Button
                          onClick={() => {
                            deleteCookie("auth");
                            deleteCookie("role"); // Clear role cookie as well
                            router.push("/");
                            router.refresh();
                          }}
                        >
                          Log out
                        </Button>
                      </SheetClose>
                      <ModeToggle />
                    </div>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      ) : (
        <div>
          {/* if user not auth: */}
          <div className="md:hidden">
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
