"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"

/**
 * Barra de evolução de tarefas vinculada ao Checklist
 */
export function TaskProgressBar({ 
  total = 0, 
  completed = 0, 
  className,
  showDetails = true,
  size = "default" // "sm" | "default" | "lg"
}) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  const getColorClass = () => {
    if (percentage === 100) return "bg-emerald-500"
    if (percentage >= 75) return "bg-emerald-400"
    if (percentage >= 50) return "bg-yellow-500"
    if (percentage >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const sizeClasses = {
    sm: "h-2",
    default: "h-3",
    lg: "h-4",
  }

  return (
    <div className={cn("w-full", className)}>
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {percentage === 100 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              {completed} de {total} tarefas concluídas
            </span>
          </div>
          <span className={cn(
            "text-sm font-bold",
            percentage === 100 && "text-emerald-500",
            percentage >= 75 && percentage < 100 && "text-emerald-400",
            percentage >= 50 && percentage < 75 && "text-yellow-500",
            percentage >= 25 && percentage < 50 && "text-orange-500",
            percentage < 25 && "text-red-500"
          )}>
            {percentage}%
          </span>
        </div>
      )}
      
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            getColorClass()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showDetails && percentage === 100 && (
        <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Todas as tarefas foram concluídas! 🎉
        </p>
      )}
    </div>
  )
}

