"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Header } from "@/components/dashboard/Header"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { useAuthStore } from "@/lib/state/useAuthStore"

export function DashboardLayoutClient({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, hasPermission } = useAuthStore()

  // Verifica autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  // Verifica permissões para rotas protegidas
  useEffect(() => {
    if (!isAuthenticated) return
    
    const route = pathname.replace('/dashboard', '').replace('/', '') || 'overview'
    const module = route === '' ? 'overview' : route

    if (!hasPermission(module)) {
      router.push('/dashboard')
    }
  }, [pathname, hasPermission, router, isAuthenticated])

  // Não renderiza se não autenticado
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mesh gradient sutil nos cantos do layout */}
      <div className="fixed inset-0 mesh-accent-bg opacity-5 pointer-events-none -z-10"></div>
      <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
      
      <div className="flex">
        <Sidebar 
          mobileOpen={mobileOpen} 
          onClose={() => setMobileOpen(false)} 
        />
        
        <main className="flex-1 md:ml-64">
          <div className="container py-6 px-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

