'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function NavActions() {
  const router = useRouter()

  function handleLogout() {
    sessionStorage.clear()
    router.push('/')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="gap-1.5 min-h-[36px] text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
      title="Logout"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  )
}
