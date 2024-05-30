import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Images } from "lucide-react"
import { ThemeToggler } from "./theme-toggler"
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs"

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-2 bg-zinc-950 border-b border-b-primary-foreground">
      <Link className="flex items-center gap-2" href="/">
        <Images className="h-6 w-6" />
        <span className="text-lg font-medium">Picsel</span>
      </Link>
      <div className="flex gap-3 items-center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ThemeToggler />
      </div>
    </header>
  )
}
