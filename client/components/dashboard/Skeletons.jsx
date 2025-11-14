"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Animação shimmer para skeletons
const shimmerStyle = {
  background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted)) 40%, hsl(var(--muted)) / 0.5 50%, hsl(var(--muted)) 60%, hsl(var(--muted)) 100%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
}

// Adicionar keyframe shimmer ao CSS global (será adicionado via className)
const ShimmerSkeleton = ({ className, ...props }) => {
  return (
    <div className="relative overflow-hidden">
      <Skeleton 
        className={cn("relative", className)} 
        {...props}
      />
      <div 
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }}
      />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <Card className="transition-all duration-200">
      <CardHeader>
        <ShimmerSkeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <ShimmerSkeleton className="h-8 w-32 mb-2" />
        <ShimmerSkeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-2">
      <ShimmerSkeleton className="h-10 w-full rounded-md" />
      {Array.from({ length: rows }).map((_, i) => (
        <ShimmerSkeleton key={i} className="h-12 w-full rounded-md" />
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 300 }) {
  return (
    <Card className="transition-all duration-200">
      <CardHeader>
        <ShimmerSkeleton className="h-6 w-48" />
        <ShimmerSkeleton className="h-4 w-32 mt-2" />
      </CardHeader>
      <CardContent>
        <ShimmerSkeleton 
          className="w-full rounded-md" 
          style={{ height: `${height}px` }} 
        />
      </CardContent>
    </Card>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TableSkeleton rows={5} />
        <TableSkeleton rows={5} />
      </div>
    </div>
  )
}

