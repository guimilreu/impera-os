"use client"

import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTenantStore } from "@/lib/state/useTenantStore"
import Link from "next/link"

export function Breadcrumb() {
  const pathname = usePathname()
  const { city, edition } = useTenantStore()

  const getBreadcrumb = () => {
    const path = pathname.replace('/dashboard', '').replace('/', '') || 'overview'
    
    const breadcrumb = [
      { label: 'Dashboard', href: '/dashboard' }
    ]
    
    if (path !== 'overview' && path !== '') {
      const moduleNames = {
        cidades: 'Cidades',
        edicoes: 'Edições',
        estabelecimentos: 'Estabelecimentos',
        pratos: 'Pratos',
        votos: 'Votos',
        auditoria: 'Auditoria',
        moderacao: 'Moderação',
        relatorios: 'Relatórios',
        checklists: 'Checklists',
        configuracoes: 'Configurações',
      }
      
      breadcrumb.push({
        label: moduleNames[path] || path,
        href: `/dashboard/${path}`
      })
      
      // Se tem tenant selecionado, adiciona ao breadcrumb
      if (city && path === 'cidades') {
        breadcrumb.push({ label: city.name, href: null })
      } else if (edition && path === 'edicoes') {
        breadcrumb.push({ label: edition.name, href: null })
      }
    }
    
    return breadcrumb
  }

  const breadcrumb = getBreadcrumb()

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      {breadcrumb.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground/60" />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                "truncate transition-colors hover:text-foreground",
                index === breadcrumb.length - 1 && 'text-foreground font-semibold pointer-events-none'
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                "truncate",
                index === breadcrumb.length - 1 && 'text-foreground font-semibold'
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

