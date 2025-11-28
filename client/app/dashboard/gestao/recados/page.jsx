"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Plus, Trash2, Clock, Building2, CheckCircle2 } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { estabelecimentos, getEstabelecimentosByTenant } from "@/lib/mock/estabelecimentos"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

// Mock de recados
const mockRecados = [
  {
    id: 1,
    titulo: "Lembrete: Sessão de Fotos",
    mensagem: "Não esqueça de confirmar o horário da sessão de fotos do seu prato. Entre em contato com nosso fotógrafo.",
    destinatario: "todos", // todos, ou ID do estabelecimento
    dataEnvio: new Date(2025, 4, 15, 10, 30).toISOString(),
    lido: true,
    cidadeId: 1,
    edicaoId: 1,
  },
  {
    id: 2,
    titulo: "Atualização do Regulamento",
    mensagem: "O regulamento do circuito foi atualizado. Por favor, acesse a área de documentos para verificar as mudanças.",
    destinatario: "todos",
    dataEnvio: new Date(2025, 4, 20, 14, 0).toISOString(),
    lido: false,
    cidadeId: 1,
    edicaoId: 1,
  },
  {
    id: 3,
    titulo: "Prazo de Inscrição",
    mensagem: "O prazo para inscrição de pratos termina em 5 dias. Certifique-se de que todas as informações estão corretas.",
    destinatario: 1, // Específico para estabelecimento 1
    dataEnvio: new Date(2025, 4, 22, 9, 0).toISOString(),
    lido: false,
    cidadeId: 1,
    edicaoId: 1,
  },
]

export default function RecadosPage() {
  const [loading, setLoading] = useState(true)
  const [recados, setRecados] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    mensagem: "",
    destinatario: "todos",
  })

  const { city, edition } = useTenantStore()
  const { role, estabelecimentoId } = useAuthStore()
  
  // Verifica se é restaurante (apenas visualiza)
  const isRestaurante = role === 'estabelecimento'
  const canCreate = role === 'admin' || role === 'socio_local'

  const estabelecimentosFiltrados = city?.id && edition?.id
    ? getEstabelecimentosByTenant(city.id, edition.id)
    : estabelecimentos

  useEffect(() => {
    loadData()
  }, [city, edition])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      // Filtra recados por tenant
      let data = [...mockRecados]
      if (city?.id) {
        data = data.filter(r => r.cidadeId === city.id)
        if (edition?.id) {
          data = data.filter(r => r.edicaoId === edition.id)
        }
      }
      
      // Se for restaurante, filtra apenas recados para ele ou para todos
      if (isRestaurante && estabelecimentoId) {
        data = data.filter(r => 
          r.destinatario === "todos" || r.destinatario === estabelecimentoId
        )
      }
      
      setRecados(data)
    } catch (error) {
      console.error('Erro ao carregar recados:', error)
      toast.error('Não foi possível carregar os recados.')
    } finally {
      setLoading(false)
    }
  }

  async function handleEnviar() {
    if (!formData.titulo.trim()) {
      toast.error("Título é obrigatório")
      return
    }
    if (!formData.mensagem.trim()) {
      toast.error("Mensagem é obrigatória")
      return
    }

    setSending(true)
    try {
      await delay(600)
      const novoRecado = {
        id: recados.length + 1,
        titulo: formData.titulo,
        mensagem: formData.mensagem,
        destinatario: formData.destinatario,
        dataEnvio: new Date().toISOString(),
        lido: false,
        cidadeId: city?.id || 1,
        edicaoId: edition?.id || 1,
      }
      setRecados([novoRecado, ...recados])
      toast.success("Recado enviado com sucesso!")
      setDialogOpen(false)
      setFormData({ titulo: "", mensagem: "", destinatario: "todos" })
    } catch (error) {
      toast.error("Não foi possível enviar o recado.")
    } finally {
      setSending(false)
    }
  }

  function handleDelete(id) {
    setRecados(recados.filter(r => r.id !== id))
    toast.success("Recado excluído")
  }

  function getDestinatarioLabel(destinatario) {
    if (destinatario === "todos") return "Todos os restaurantes"
    const est = estabelecimentos.find(e => e.id === destinatario)
    return est?.name || "Desconhecido"
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  const totalRecados = recados.length
  const recadosNaoLidos = recados.filter(r => !r.lido).length
  const recadosParaTodos = recados.filter(r => r.destinatario === "todos").length

  // Função para marcar recado como lido (para restaurantes)
  function handleMarcarLido(id) {
    setRecados(recados.map(r => 
      r.id === id ? { ...r, lido: true } : r
    ))
    toast.success("Recado marcado como lido")
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recados</h1>
          <p className="text-muted-foreground mt-1">
            {isRestaurante 
              ? "Comunicados da organização do circuito" 
              : "Envie comunicados para os restaurantes"
            }
          </p>
        </div>
        {canCreate && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Recado
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Novo Recado</DialogTitle>
              <DialogDescription>
                Envie um comunicado para os restaurantes participantes.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  placeholder="Título do recado"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  disabled={sending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destinatario">Destinatário</Label>
                <Select 
                  value={formData.destinatario} 
                  onValueChange={(value) => setFormData({ ...formData, destinatario: value })}
                  disabled={sending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o destinatário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os restaurantes</SelectItem>
                    {estabelecimentosFiltrados.map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mensagem">Mensagem</Label>
                <Textarea
                  id="mensagem"
                  placeholder="Digite a mensagem..."
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  disabled={sending}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={sending}>
                Cancelar
              </Button>
              <Button onClick={handleEnviar} disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Total de Recados"
          value={totalRecados}
          icon={MessageSquare}
        />
        <DashboardCard
          title="Não Lidos"
          value={recadosNaoLidos}
          icon={Clock}
          className={recadosNaoLidos > 0 ? "border-yellow-500/50" : ""}
        />
        <DashboardCard
          title="Enviados para Todos"
          value={recadosParaTodos}
          icon={Building2}
        />
      </div>

      {/* Lista de Recados */}
      <Card>
        <CardHeader>
          <CardTitle>{isRestaurante ? 'Recados Recebidos' : 'Recados Enviados'}</CardTitle>
          <CardDescription>
            {recados.length} recado(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recados.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={isRestaurante ? "Nenhum recado recebido" : "Nenhum recado enviado"}
              description={isRestaurante ? "Você não tem recados da organização." : "Envie seu primeiro recado para os restaurantes."}
            />
          ) : (
            <div className="space-y-4">
              {recados.map((recado) => (
                <div
                  key={recado.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${recado.lido ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    {recado.lido ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{recado.titulo}</h4>
                      <Badge variant={recado.destinatario === "todos" ? "default" : "secondary"}>
                        {getDestinatarioLabel(recado.destinatario)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {recado.mensagem}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enviado em {formatDate(recado.dataEnvio)}
                    </p>
                  </div>
                  {isRestaurante ? (
                    !recado.lido && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarcarLido(recado.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Marcar como lido
                      </Button>
                    )
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(recado.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

