"use client"
import { signOut } from "@/actions/auth"

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="text-sm font-medium text-destructive hover:text-destructive/80 transition-colors cursor-pointer">
        تسجيل الخروج
      </button>
    </form>
  )
}
