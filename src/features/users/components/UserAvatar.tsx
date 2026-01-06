"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ComponentProps } from "react"

export function UserAvatar({ user, ...props}: { user: { imageUrl?: string; name: string } } & ComponentProps<typeof Avatar>) {
    const initials = user.name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2);

    return (
        <Avatar {...props}>
            <AvatarImage src={user.imageUrl} alt={user.name} />
            <AvatarFallback className="uppercase">{initials}</AvatarFallback>
        </Avatar>
    );
}   