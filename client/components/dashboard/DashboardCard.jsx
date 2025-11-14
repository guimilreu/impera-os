"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Paleta de cores Impera para ícones
const IMPERA_ICON_COLORS = [
  { bg: "rgba(229, 109, 33, 0.15)", icon: "rgba(229, 109, 33, 0.9)", border: "rgba(229, 109, 33, 0.25)" }, // Orange
  { bg: "rgba(96, 163, 139, 0.15)", icon: "rgba(96, 163, 139, 0.9)", border: "rgba(96, 163, 139, 0.25)" }, // Teal
  { bg: "rgba(71, 57, 135, 0.15)", icon: "rgba(71, 57, 135, 0.9)", border: "rgba(71, 57, 135, 0.25)" }, // Purple
  { bg: "rgba(214, 146, 65, 0.15)", icon: "rgba(214, 146, 65, 0.9)", border: "rgba(214, 146, 65, 0.25)" }, // Amber
  { bg: "rgba(80, 156, 135, 0.15)", icon: "rgba(80, 156, 135, 0.9)", border: "rgba(80, 156, 135, 0.25)" }, // Green
  { bg: "rgba(186, 51, 22, 0.15)", icon: "rgba(186, 51, 22, 0.9)", border: "rgba(186, 51, 22, 0.25)" }, // Red
]

// Função para gerar uma cor baseada no título do card
function getIconColor(title) {
  if (!title) return IMPERA_ICON_COLORS[0]
  
  // Hash simples baseado no título para consistência
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % IMPERA_ICON_COLORS.length
  return IMPERA_ICON_COLORS[index]
}

export function DashboardCard({ title, value, change, icon: Icon, className, iconColor, ...props }) {
  // Usa cor passada como prop ou gera uma baseada no título
  const color = iconColor || getIconColor(title)
  
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md hover:shadow-primary/5 border-border/50 mesh-card-top mesh-accent-hover", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground tracking-tight">
          {title}
        </CardTitle>
        {Icon && (
          <div 
            className="h-9 w-9 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: color.bg,
              border: `1px solid ${color.border}`,
            }}
          >
            <Icon className="h-4 w-4" style={{ color: color.icon }} />
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        {change && (
          <p className={cn(
            "text-xs font-medium mt-2 flex items-center gap-1",
            change.startsWith('+') ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          )}>
            <span>{change}</span>
            <span className="text-muted-foreground">em relação ao período anterior</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

