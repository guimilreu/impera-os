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

  // Redireciona auditoria para moderação
  useEffect(() => {
    if (pathname === '/dashboard/auditoria') {
      router.replace('/dashboard/moderacao')
    }
  }, [pathname, router])

  // Verifica permissões para rotas protegidas
  useEffect(() => {
    if (!isAuthenticated) return
    
    // Extrai os segmentos da rota
    const segments = pathname.replace('/dashboard', '').split('/').filter(Boolean)
    
    // Determina o módulo baseado na rota
    let module = 'overview'
    
    if (segments.length === 0) {
      module = 'overview'
    } else if (segments[0] === 'gestao' && segments[1]) {
      // Para rotas como /dashboard/gestao/recados, usa o segundo segmento
      module = segments[1]
    } else {
      // Para outras rotas, usa o primeiro segmento
      module = segments[0]
    }
    
    // Mapeia aliases de módulos
    if (module === 'avaliacao') module = 'votos'
    if (module === 'auditoria') module = 'moderacao'
    if (module === 'pratos') module = 'pratos'

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

