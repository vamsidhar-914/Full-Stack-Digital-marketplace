"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "@/payload-types";
import { useAuth } from "@/hooks/use-auth";
import { AreaChart, LogOut } from "lucide-react";
import Link from "next/link";

const UserAccountNav = ({ user }: { user: User }) => {
  const { signOut, loading } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>My Account</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AreaChart className='mr-2 h-4 w-4' />
          <span>
            <Link href='/sell'>Seller Dashboard</Link>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer'>
          <Button
            onClick={signOut}
            className='w-full'
            isLoading={loading}
          >
            logOut
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
