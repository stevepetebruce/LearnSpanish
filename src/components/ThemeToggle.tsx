"use client"
import {useState, useEffect} from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"



export function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { setTheme, theme, resolvedTheme } = useTheme()

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	   const themes = [
		   {
			   value: "light",
			   label: "Light",
			   icon: <Sun className="mr-2" />, 
		   },
		   {
			   value: "dark",
			   label: "Dark",
			   icon: <Moon className="mr-2" />, 
		   },
		   {
			   value: "system",
			   label: "System",
			   icon: <Monitor className="mr-2" />, 
		   },
	   ] as const;


	let current;
	if (theme === "system" || (!theme && resolvedTheme)) {
		// Show sun or moon icon based on resolvedTheme
		if (resolvedTheme === "dark") {
			current = themes[1]; // dark
		} else {
			current = themes[0]; // light
		}
	} else {
		current = themes.find(t => t.value === theme) || themes[2];
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="Toggle theme" className="cursor-pointer">
					{current.icon}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{themes.map((t) => (
					<DropdownMenuItem
						key={t.value}
						onClick={() => setTheme(t.value)}
						className={cn('cursor-pointer', theme === t.value &&  "bg-accent text-accent-foreground" )}
						aria-checked={theme === t.value || resolvedTheme === t.value}
					>
						{t.icon}
						<span>{t.label}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
