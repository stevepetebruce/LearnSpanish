"use client"

import { BrainCircuit, LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton, useClerk } from "@clerk/nextjs"
import Link from "next/link"
import {UserAvatar} from "@/features/users/components/UserAvatar"

export function Navbar({user}: {user: { name: string , imageUrl?: string }}) {
    const { openUserProfile } = useClerk()

    return (
        <nav className="h-header border-b flex items-center justify-between px-4">
            {/* Left side - Logo and brand name */}
            <Link href="/app" className="flex items-center gap-2">
                <BrainCircuit className="size-8 text-primary" />
                <span className="text-xl font-semibold">Spanglish</span>
            </Link>

            {/* Right side - Theme toggle and user dropdown */}
            <div className="flex items-center gap-4">
                <ThemeToggle />
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <UserAvatar user={user} className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openUserProfile()} className="cursor-pointer">
                            <User className="mr-2" />
                            Profile
                        </DropdownMenuItem>
                        <SignOutButton>
                            <DropdownMenuItem className="cursor-pointer">
                                <LogOut className="mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </SignOutButton>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}