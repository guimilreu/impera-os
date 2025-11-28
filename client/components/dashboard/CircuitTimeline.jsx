"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { 
  Users, 
  ClipboardList, 
  Camera, 
  Palette, 
  UtensilsCrossed, 
  CheckCircle2, 
  Trophy,
  Settings,
  RotateCcw,
} from "lucide-react"
import { useCircuitStore } from "@/lib/state/useCircuitStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

/**
 * Timeline das fases do circuito gastronômico
 * Evolui automaticamente com o tempo real
 */

// Definição das fases do circuito
const FASES_CIRCUITO = [
  {
    id: 'patrocinadores',
    nome: 'Patrocinadores',
    descricao: 'Captura de patrocinadores',
    icon: Users,
    mesInicio: 8, // Agosto
    mesFim: 2, // Fevereiro
    anoOffset: 0, // Mesmo ano ou próximo
  },
  {
    id: 'inscricoes',
    nome: 'Inscrições',
    descricao: 'Período de inscrição dos restaurantes',
    icon: ClipboardList,
    mesInicio: 3, // Março
    mesFim: 4, // Abril
    anoOffset: 1,
  },
  {
    id: 'producao_fotos',
    nome: 'Fotos',
    descricao: 'Produção de fotos dos pratos',
    icon: Camera,
    mesInicio: 5, // Maio
    mesFim: 5,
    anoOffset: 1,
  },
  {
    id: 'producao_materiais',
    nome: 'Materiais',
    descricao: 'Produção de materiais de divulgação',
    icon: Palette,
    mesInicio: 6, // Junho
    mesFim: 6,
    anoOffset: 1,
  },
  {
    id: 'circuito',
    nome: 'Circuito',
    descricao: 'Período de votação do público',
    icon: UtensilsCrossed,
    mesInicio: 7, // Julho
    mesFim: 7,
    anoOffset: 1,
  },
  {
    id: 'finalizacoes',
    nome: 'Finalizações',
    descricao: 'Primeira semana de Agosto',
    icon: CheckCircle2,
    mesInicio: 8, // Agosto (semana 1)
    mesFim: 8,
    semanaInicio: 1,
    semanaFim: 1,
    anoOffset: 1,
  },
  {
    id: 'premio',
    nome: 'Prêmio',
    descricao: 'Segunda semana de Agosto',
    icon: Trophy,
    mesInicio: 8, // Agosto (semana 2)
    mesFim: 8,
    semanaInicio: 2,
    semanaFim: 2,
    anoOffset: 1,
  },
]

/**
 * Determina a fase atual baseado na data real
 */
function getFaseAtual() {
  const hoje = new Date()
  const mes = hoje.getMonth() + 1 // 1-12
  const dia = hoje.getDate()
  const semana = Math.ceil(dia / 7)

  // Lógica simplificada para determinar fase atual
  // Agosto (semana 2+) até Fevereiro = Patrocinadores
  if ((mes === 8 && semana >= 2) || mes >= 9 || mes <= 2) {
    return 'patrocinadores'
  }
  // Março e Abril = Inscrições
  if (mes === 3 || mes === 4) {
    return 'inscricoes'
  }
  // Maio = Produção de fotos
  if (mes === 5) {
    return 'producao_fotos'
  }
  // Junho = Produção de materiais
  if (mes === 6) {
    return 'producao_materiais'
  }
  // Julho = Circuito
  if (mes === 7) {
    return 'circuito'
  }
  // Agosto semana 1 = Finalizações
  if (mes === 8 && semana === 1) {
    return 'finalizacoes'
  }
  // Agosto semana 2 = Prêmio
  if (mes === 8 && semana >= 2) {
    return 'premio'
  }

  return 'patrocinadores'
}

/**
 * Calcula o progresso dentro da fase atual (0-100)
 */
function getProgressoFase(faseId) {
  const hoje = new Date()
  const mes = hoje.getMonth() + 1
  const dia = hoje.getDate()
  
  const fase = FASES_CIRCUITO.find(f => f.id === faseId)
  if (!fase) return 0

  // Calcula progresso baseado nos dias do mês
  if (fase.mesInicio === fase.mesFim) {
    // Fase de um mês só
    const diasNoMes = new Date(hoje.getFullYear(), mes, 0).getDate()
    return Math.round((dia / diasNoMes) * 100)
  }

  // Fase de múltiplos meses - simplificado
  return 50
}

export function CircuitTimeline({ className, showPatrocinadores = true }) {
  const { faseManual, setFaseManual, resetFaseAutomatica } = useCircuitStore()
  const { role } = useAuthStore()
  const [editMode, setEditMode] = useState(false)
  
  const isAdmin = role === 'admin'
  
  // Usa fase manual se definida, senão usa automática
  const faseAtual = faseManual || getFaseAtual()
  const progressoFase = useMemo(() => getProgressoFase(faseAtual), [faseAtual])

  const faseAtualIndex = FASES_CIRCUITO.findIndex(f => f.id === faseAtual)
  
  // Filtra fases se showPatrocinadores = false
  const fasesExibidas = showPatrocinadores 
    ? FASES_CIRCUITO 
    : FASES_CIRCUITO.filter(f => f.id !== 'patrocinadores')
  
  const faseAtualIndexExibido = fasesExibidas.findIndex(f => f.id === faseAtual)
  
  function handleSetFase(faseId) {
    setFaseManual(faseId)
    setEditMode(false)
    toast.success(`Fase do circuito alterada para: ${FASES_CIRCUITO.find(f => f.id === faseId)?.nome}`)
  }
  
  function handleResetAutomatico() {
    resetFaseAutomatica()
    setEditMode(false)
    toast.success('Fase do circuito voltou para modo automático')
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Controles de Admin */}
      {isAdmin && (
        <div className="flex items-center justify-end gap-2 mb-4">
          {faseManual && (
            <span className="text-xs text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">
              Modo Manual
            </span>
          )}
          {editMode ? (
            <div className="flex items-center gap-2">
              <Select value={faseAtual} onValueChange={handleSetFase}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Selecione a fase" />
                </SelectTrigger>
                <SelectContent>
                  {FASES_CIRCUITO.map((fase) => (
                    <SelectItem key={fase.id} value={fase.id}>
                      {fase.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {faseManual && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={handleResetAutomatico}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Automático
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs"
              onClick={() => setEditMode(true)}
            >
              <Settings className="h-3 w-3 mr-1" />
              Editar Fase
            </Button>
          )}
        </div>
      )}
      
      {/* Timeline horizontal */}
      <div className="relative">
        {/* Linha de fundo */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full" />
        
        {/* Linha de progresso */}
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ 
            width: `${((faseAtualIndexExibido + (progressoFase / 100)) / fasesExibidas.length) * 100}%` 
          }}
        />

        {/* Fases */}
        <div className="relative flex justify-between">
          {fasesExibidas.map((fase, index) => {
            const Icon = fase.icon
            const isAtual = fase.id === faseAtual
            const isPast = index < faseAtualIndexExibido
            const isFuture = index > faseAtualIndexExibido

            return (
              <div 
                key={fase.id} 
                className="flex flex-col items-center"
                style={{ width: `${100 / fasesExibidas.length}%` }}
              >
                {/* Ícone da fase */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                    isAtual && "bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30",
                    isPast && "bg-emerald-100 border-emerald-500 text-emerald-600",
                    isFuture && "bg-muted border-muted-foreground/30 text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {isAtual && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  )}
                </div>

                {/* Nome da fase */}
                <div className="mt-3 text-center">
                  <p className={cn(
                    "text-xs font-medium transition-colors",
                    isAtual && "text-emerald-600 font-semibold",
                    isPast && "text-muted-foreground",
                    isFuture && "text-muted-foreground/60"
                  )}>
                    {fase.nome}
                  </p>
                  {isAtual && (
                    <p className="text-[10px] text-emerald-600 mt-0.5">
                      Em andamento
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Descrição da fase atual */}
      <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
        <div className="flex items-center gap-3">
          {(() => {
            const fase = FASES_CIRCUITO.find(f => f.id === faseAtual)
            const Icon = fase?.icon || Users
            return (
              <>
                <div className="p-2 bg-emerald-500 rounded-lg text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Fase Atual: {fase?.nome}
                  </p>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500">
                    {fase?.descricao}
                  </p>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}

export { FASES_CIRCUITO, getFaseAtual }

