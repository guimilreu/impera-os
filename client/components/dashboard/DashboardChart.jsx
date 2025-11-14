"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  defs,
  linearGradient,
  stop,
} from "recharts"

// Paleta de cores Impera - mesh gradients sutis
const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  // Paleta Impera com ajustes para legibilidade em dark mode
  imperaOrange: "#e56d21",
  imperaRed: "#ba3316",
  imperaTeal: "#60a38b",
  imperaPurple: "#473987",
  imperaAmber: "#d69241",
  imperaGreen: "#509c87",
}

// Cores padrão para diferentes tipos de gráfico usando paleta Impera
const DEFAULT_COLORS = {
  line: [CHART_COLORS.imperaOrange, CHART_COLORS.imperaTeal, CHART_COLORS.imperaPurple],
  bar: [CHART_COLORS.imperaOrange, CHART_COLORS.imperaTeal, CHART_COLORS.imperaPurple, CHART_COLORS.imperaAmber],
  pie: [
    CHART_COLORS.imperaOrange,
    CHART_COLORS.imperaTeal,
    CHART_COLORS.imperaPurple,
    CHART_COLORS.imperaAmber,
    CHART_COLORS.imperaGreen,
    CHART_COLORS.imperaRed,
  ],
}

// Tooltip customizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function DashboardChart({ 
  title, 
  description, 
  type = "line", 
  data = [], 
  dataKey = "value",
  nameKey = "name",
  height = 300,
  colors,
  ...props 
}) {
  // Usar cores padrão se não fornecidas
  const chartColors = colors || DEFAULT_COLORS[type] || DEFAULT_COLORS.line

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart 
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                {chartColors.map((color, idx) => (
                  <linearGradient key={idx} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey={nameKey} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {dataKey.split(',').map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key.trim()}
                  stroke={chartColors[idx % chartColors.length]}
                  strokeWidth={3}
                  dot={{ fill: chartColors[idx % chartColors.length], r: 4 }}
                  activeDot={{ r: 6 }}
                  animationDuration={800}
                  animationBegin={0}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )
      
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                {chartColors.map((color, idx) => (
                  <linearGradient key={idx} id={`barGradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey={nameKey} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
              />
              {dataKey.split(',').map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key.trim()}
                  fill={`url(#barGradient-${idx})`}
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationBegin={idx * 100}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )
      
      case "pie":
        const pieColors = data.map((entry, index) => 
          entry.color || chartColors[index % chartColors.length]
        )
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <defs>
                {pieColors.map((color, idx) => (
                  <linearGradient key={idx} id={`pieGradient-${idx}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={Math.min(height * 0.25, 100)}
                fill="#8884d8"
                dataKey="value"
                animationDuration={800}
                animationBegin={0}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieGradient-${index})`}
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md mesh-card-top mesh-accent-hover" {...props}>
      <CardHeader>
        <CardTitle className="tracking-tight">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="relative">
        {/* Mesh gradient sutil atrás do gráfico */}
        <div className="absolute inset-0 mesh-accent-bg opacity-20 rounded-lg pointer-events-none"></div>
        <div className="relative z-10">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  )
}

