"use client"

import { Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Componente para indicar que dados estão bloqueados devido ao sigilo
 * Usado em células de tabela, cards, ou como banner
 */

// Versão inline para células de tabela
export function SigiloValue({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 text-muted-foreground ${className}`}>
      <Lock className="h-3 w-3" />
      <span>***</span>
    </span>
  )
}

// Versão banner para exibir no topo de páginas/seções
export function SigiloBanner({ 
  title = "Dados bloqueados", 
  description = "Estes dados estão protegidos pelo sigilo e serão liberados após a premiação.",
  className = ""
}) {
  return (
    <Card className={`border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/10 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <Lock className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-700 dark:text-yellow-500">
              {title}
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-600">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Versão compacta para indicar em cards de estatísticas
export function SigiloCard({ value = "***", className = "" }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Lock className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

