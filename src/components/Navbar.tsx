"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const user: User = session?.user as User;

  return (
    <nav className="w-full p-4  shadow-[0px_0px_8px_silver] flex items-center justify-between sm:flex-row flex-col gap-4 sm:px-12 ">
      <h1

        className="cursor-pointer animate-pulse relative z-10 text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold"
      >
        Genuine Feedback
      </h1>

      {/* buttons box  */}
      <div className="flex justify-center items-center gap-2">
        {session && status === "authenticated" && (
          <div className=" flex justify-center items-center gap-4">
            <h2 className="text-md font-sans from-neutral-500">
              Hello, {user?.username}
            </h2>

            <Button onClick={() => signOut()} variant={"destructive"}>
              Logout
            </Button>
          </div>
        ) 
        
          
        }

        {
          !session && status === "unauthenticated" && (
            <div className="flex justify-center items-center gap-5">
            <Button
              onClick={() => {
                router.push("/sign-in");
              }}
              variant={"outline"}
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                router.push("/sign-up");
              }}
              variant={"default"}
            >
              Sign Up
            </Button>
          </div>
          )
        }
        
        

        <span className="ml-12">
          {" "}
          <ThemeToggle />
        </span>
      </div>
    </nav>
  );
}
