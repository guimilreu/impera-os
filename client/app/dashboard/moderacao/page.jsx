"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PhotoModerationItem } from "@/components/dashboard/PhotoModerationItem"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { randomDate } from "@/lib/utils/faker"
import { CheckCircle2, XCircle, Image } from "lucide-react"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { toast } from "sonner"

// Gera mais fotos mockadas
function generateFotos(count = 12) {
  const fotos = []
  const statuses = ['pendente', 'aprovado', 'reprovado']
  const pratos = ['Feijoada Completa', 'Picanha na Chapa', 'Moqueca de Peixe', 'Risotto de Camarão', 'Salada Caesar', 'Hambúrguer Artesanal']
  const estabelecimentos = ['Restaurante Sabor', 'Cantina Tradição', 'Bistrô Gourmet', 'Casa do Chef', 'Sabor Brasileiro']
  
  for (let i = 1; i <= count; i++) {
    fotos.push({
      id: i,
      url: '/prato.jpg',
      pratoNome: pratos[Math.floor(Math.random() * pratos.length)],
      estabelecimentoNome: estabelecimentos[Math.floor(Math.random() * estabelecimentos.length)],
      horario: randomDate(30).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      motivoReprovacao: Math.random() > 0.7 ? 'Foto não corresponde ao prato' : null,
    })
  }
  
  return fotos
}

export default function ModeracaoPage() {
  const [loading, setLoading] = useState(true)
  const [fotos, setFotos] = useState([])
  const [filteredFotos, setFilteredFotos] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterFotos()
  }, [statusFilter, fotos])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      const data = generateFotos(12)
      setFotos(data)
      
      // Calcula estatísticas
      const total = data.length
      const pendentes = data.filter(f => f.status === 'pendente').length
      const aprovadas = data.filter(f => f.status === 'aprovado').length
      const reprovadas = data.filter(f => f.status === 'reprovado').length
      
      setStats({
        total,
        pendentes,
        aprovadas,
        reprovadas,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar as fotos para moderação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterFotos() {
    let filtered = [...fotos]

    if (statusFilter !== "all") {
      filtered = filtered.filter(f => f.status === statusFilter)
    }

    setFilteredFotos(filtered)
  }

  function handleApprove(photo) {
    toast.success(`Foto aprovada: ${photo.pratoNome} (mock)`)
    setFotos(fotos =>
      fotos.map(f => f.id === photo.id ? { ...f, status: 'aprovado' } : f)
    )
  }

  function handleReject(photo) {
    toast.error(`Foto reprovada: ${photo.pratoNome} (mock)`)
    setFotos(fotos =>
      fotos.map(f => f.id === photo.id ? { ...f, status: 'reprovado', motivoReprovacao: 'Foto não corresponde ao prato' } : f)
    )
  }

  function handleView(photo) {
    setSelectedPhoto(photo)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderação</h1>
        <p className="text-muted-foreground mt-1">Aprove ou reprove fotos enviadas</p>
      </div>

      {/* Cards de Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total de Fotos"
            value={formatNumber(stats.total)}
            icon={Image}
          />
          <DashboardCard
            title="Pendentes"
            value={formatNumber(stats.pendentes)}
            icon={Image}
          />
          <DashboardCard
            title="Aprovadas"
            value={formatNumber(stats.aprovadas)}
            icon={CheckCircle2}
          />
          <DashboardCard
            title="Reprovadas"
            value={formatNumber(stats.reprovadas)}
            icon={XCircle}
          />
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="tracking-tight">Fotos para Moderação</CardTitle>
          <CardDescription>
            {filteredFotos.length} foto(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="reprovado">Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredFotos.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma foto encontrada
              </p>
            ) : (
              filteredFotos.map((foto) => (
                <PhotoModerationItem
                  key={foto.id}
                  photo={foto}
                  status={foto.status}
                  onApprove={() => handleApprove(foto)}
                  onReject={() => handleReject(foto)}
                  onView={() => handleView(foto)}
                  disabled={loading}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Painel de Denúncias */}
      <Card>
        <CardHeader>
          <CardTitle>Denúncias</CardTitle>
          <CardDescription>Denúncias recebidas sobre fotos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">Foto #123 - Conteúdo inadequado</p>
                <p className="text-sm text-muted-foreground">Denunciada em {formatDateTime(new Date().toISOString())}</p>
              </div>
              <Button variant="outline" size="sm">Ver detalhes</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <p className="font-medium">Foto #456 - Foto duplicada</p>
                <p className="text-sm text-muted-foreground">Denunciada em {formatDateTime(new Date().toISOString())}</p>
              </div>
              <Button variant="outline" size="sm">Ver detalhes</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Visualização */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Visualizar Foto - {selectedPhoto?.pratoNome}</DialogTitle>
            <DialogDescription>
              {selectedPhoto?.estabelecimentoNome} • {selectedPhoto && formatDateTime(selectedPhoto.horario)}
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.pratoNome}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Prato</p>
                  <p className="text-sm">{selectedPhoto.pratoNome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Estabelecimento</p>
                  <p className="text-sm">{selectedPhoto.estabelecimentoNome}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Status</p>
                  <p className="text-sm capitalize">{selectedPhoto.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Horário</p>
                  <p className="text-sm">{formatDateTime(selectedPhoto.horario)}</p>
                </div>
                {selectedPhoto.motivoReprovacao && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium mb-1 text-red-600">Motivo da Reprovação</p>
                    <p className="text-sm text-red-600">{selectedPhoto.motivoReprovacao}</p>
                  </div>
                )}
              </div>
              {selectedPhoto.status === 'pendente' && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedPhoto)
                      setSelectedPhoto(null)
                    }}
                    disabled={loading}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reprovar
                  </Button>
                  <Button
                    onClick={() => {
                      handleApprove(selectedPhoto)
                      setSelectedPhoto(null)
                    }}
                    disabled={loading}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
