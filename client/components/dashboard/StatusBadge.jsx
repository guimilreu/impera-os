"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react"

export function StatusBadge({ status, label, ...props }) {
  const configs = {
    valido: {
      label: 'Válido',
      variant: 'default',
      icon: CheckCircle2,
      className: 'bg-green-500 hover:bg-green-600',
    },
    suspeito: {
      label: 'Suspeito',
      variant: 'destructive',
      icon: AlertTriangle,
      className: '',
    },
    invalido: {
      label: 'Inválido',
      variant: 'destructive',
      icon: XCircle,
      className: '',
    },
  }

  const config = configs[status] || configs.valido
  const Icon = config.icon
  const displayLabel = label || config.label

  return (
    <Badge variant={config.variant} className={config.className} {...props}>
      <Icon className="h-3 w-3 mr-1" />
      {displayLabel}
    </Badge>
  )
}

