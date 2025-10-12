'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/reception')
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="text-lg">Cargando...</span>
      </div>
    </div>
  )
}
