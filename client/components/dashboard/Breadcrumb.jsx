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
    // Remove /dashboard do início e divide o path em partes
    const pathParts = pathname.replace('/dashboard', '').split('/').filter(Boolean)
    
    const breadcrumb = [
      { label: 'Dashboard', href: '/dashboard' }
    ]
    
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === '')) {
      return breadcrumb
    }
    
    const moduleNames = {
      cidades: 'Cidades',
      edicoes: 'Edições',
      estabelecimentos: 'Estabelecimentos',
      pratos: 'Receitas',
      votos: 'Votos',
      avaliacao: 'Avaliação',
      auditoria: 'Moderação',
      moderacao: 'Moderação',
      clientes: 'Clientes',
      relatorios: 'Relatórios',
      checklists: 'Checklists',
      treinamentos: 'Treinamentos',
      configuracoes: 'Configurações',
      gestao: 'Gestão',
      convites: 'Convites',
      recados: 'Recados',
      vendas: 'Vendas',
    }
    
    // Constrói o breadcrumb baseado nas partes do path
    let currentPath = '/dashboard'
    
    pathParts.forEach((part, index) => {
      currentPath += `/${part}`
      const isLast = index === pathParts.length - 1
      
      breadcrumb.push({
        label: moduleNames[part] || part,
        href: isLast ? null : currentPath
      })
    })
    
    // Se tem tenant selecionado, adiciona ao breadcrumb
    if (city && pathParts[0] === 'cidades') {
      breadcrumb.push({ label: city.name, href: null })
    } else if (edition && pathParts[0] === 'edicoes') {
      breadcrumb.push({ label: edition.name, href: null })
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

