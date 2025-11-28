"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function AuditTag({ status, ...props }) {
  const configs = {
    validado: {
      label: 'Validado',
      className: 'bg-green-500 hover:bg-green-600',
    },
    pendente: {
      label: 'Pendente',
      className: 'bg-yellow-500 hover:bg-yellow-600',
    },
    suspeito: {
      label: 'Suspeito',
      className: 'bg-orange-500 hover:bg-orange-600',
    },
    rejeitado: {
      label: 'Rejeitado',
      className: 'bg-red-500 hover:bg-red-600',
    },
    invalido: {
      label: 'Inválido',
      className: 'bg-red-500 hover:bg-red-600',
    },
  }

  const config = configs[status] || configs.validado

  return (
    <Badge className={cn(config.className)} {...props}>
      {config.label}
    </Badge>
  )
}

