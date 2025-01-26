"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

// theme toggle button
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { setTheme } = useTheme();
  const { data: session, status } = useSession();
  const user: User = session?.user;

  return (
    <nav className="flex items-center justify-between p-5 bg-[#1F2937] border-b border-gray-600 shadow-md w-full">
      <a href="#" className="text-3xl font-extrabold text-white hover:text-gray-300 transition-all">
        Mystery Message 
      </a>

      <div className="flex items-center space-x-4">
        {status === "authenticated" ? (
          <>
            <span className="text-lg font-medium text-white">
              Welcome, {user.username || user.email}
            </span>
            <Button onClick={() => signOut()} className="bg-red-700 hover:bg-red-600 text-white rounded-md transition-all">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all">
              Login
            </Button>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-lg rounded-md">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
