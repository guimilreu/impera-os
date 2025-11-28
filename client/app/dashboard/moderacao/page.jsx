"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { AuditTag } from "@/components/dashboard/AuditTag"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { mockHash, randomFloat, randomDate } from "@/lib/utils/faker"
import { fotosReceitas, filterFotosByStatus, getFotosStats } from "@/lib/mock/fotos"
import { getVotosStatsModeracao, getVotosSuspeitos, getVotosPendentes, aprovarVoto, rejeitarVoto, marcarSuspeito, getEstatisticasModeracao } from "@/lib/mock/votos"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { usePermissions } from "@/lib/permissions"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { CheckCircle2, XCircle, Image, Shield, MapPin, Cpu, AlertTriangle, Clock, Eye as EyeIcon } from "lucide-react"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// URLs de imagens de comida para mock
const FOOD_IMAGES_MOCK = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
]

// Gera fotos mockadas
function generateFotos(count = 12) {
  const fotos = []
  const statuses = ['pendente', 'aprovado', 'reprovado']
  const pratos = ['Feijoada Completa', 'Picanha na Chapa', 'Moqueca de Peixe', 'Risotto de Camarão', 'Salada Caesar', 'Hambúrguer Artesanal']
  const estabelecimentos = ['Restaurante Sabor', 'Cantina Tradição', 'Bistrô Gourmet', 'Casa do Chef', 'Sabor Brasileiro']
  
  for (let i = 1; i <= count; i++) {
    fotos.push({
      id: i,
      url: FOOD_IMAGES_MOCK[i % FOOD_IMAGES_MOCK.length],
      pratoNome: pratos[Math.floor(Math.random() * pratos.length)],
      estabelecimentoNome: estabelecimentos[Math.floor(Math.random() * estabelecimentos.length)],
      horario: randomDate(30).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      motivoReprovacao: Math.random() > 0.7 ? 'Foto não corresponde ao prato' : null,
    })
  }
  
  return fotos
}

// Gera votos suspeitos mockados
function generateVotosSuspeitos(count = 15) {
  const items = []
  const statuses = ['pendente', 'validado', 'suspeito']
  
  for (let i = 1; i <= count; i++) {
    const gps = { lat: -23.5505 + randomFloat(-0.1, 0.1), lng: -46.6333 + randomFloat(-0.1, 0.1) }
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    items.push({
      id: i,
      votoId: `VOTE_${String(i).padStart(3, '0')}`,
      foto: FOOD_IMAGES_MOCK[i % FOOD_IMAGES_MOCK.length],
      hash: mockHash(32),
      gps,
      distancia: randomFloat(0, 1),
      horario: randomDate(30).toISOString(),
      deviceInfo: ['iPhone 13', 'Samsung Galaxy S21', 'Xiaomi Mi 11', 'Google Pixel 6'][Math.floor(Math.random() * 4)],
      status,
      motivoSuspeito: status === 'suspeito' ? ['GPS inconsistente', 'Foto duplicada', 'Horário suspeito', 'IA detectou anomalia'][Math.floor(Math.random() * 4)] : null,
      iaScore: randomFloat(0.3, 0.95), // Score de confiança da IA
    })
  }
  
  return items
}

export default function ModeracaoPage() {
  const [loading, setLoading] = useState(true)
  const [fotos, setFotos] = useState([])
  const [filteredFotos, setFilteredFotos] = useState([])
  const [votosSuspeitos, setVotosSuspeitos] = useState([])
  const [filteredVotos, setFilteredVotos] = useState([])
  const [statusFilterFotos, setStatusFilterFotos] = useState("todas")
  const [statusFilterVotos, setStatusFilterVotos] = useState("all")
  const [searchTermVotos, setSearchTermVotos] = useState("")
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedVoto, setSelectedVoto] = useState(null)
  const [currentPageVotos, setCurrentPageVotos] = useState(1)
  const [itemsPerPage] = useState(10)
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState("fotos")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterFotos()
  }, [statusFilterFotos, fotos])

  useEffect(() => {
    filterVotos()
  }, [searchTermVotos, statusFilterVotos, votosSuspeitos])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      const fotosData = fotosReceitas // Usa dados reais de fotos de receitas
      const votosData = generateVotosSuspeitos(15)
      
      setFotos(fotosData)
      setVotosSuspeitos(votosData)
      
      // Calcula estatísticas usando o sistema novo
      const fotosStats = getFotosStats()
      const votosStats = getVotosStatsModeracao()
      
      setStats({
        // Fotos
        totalFotos: fotosStats.total,
        fotosPendentes: fotosStats.pendentes,
        fotosAprovadas: fotosStats.aprovadas,
        fotosReprovadas: fotosStats.rejeitadas,
        // Votos
        totalSuspeitos: votosStats.totalSuspeitos,
        totalPendentes: votosStats.totalPendentes,
        totalPrecisaFoto: votosStats.totalPrecisaFoto,
        totalVotos: votosData.length,
        votosPendentes: votosData.filter(v => v.status === 'pendente').length,
        votosValidados: votosData.filter(v => v.status === 'validado').length,
        votosSuspeitos: votosData.filter(v => v.status === 'suspeito').length,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar os dados de moderação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterFotos() {
    let filtered = [...fotos]

    if (statusFilterFotos !== "todas" && statusFilterFotos !== "all") {
      filtered = filtered.filter(f => f.status === statusFilterFotos)
    }

    setFilteredFotos(filtered)
  }

  function filterVotos() {
    let filtered = [...votosSuspeitos]

    if (searchTermVotos) {
      filtered = filtered.filter(v =>
        v.votoId.toLowerCase().includes(searchTermVotos.toLowerCase()) ||
        v.deviceInfo.toLowerCase().includes(searchTermVotos.toLowerCase())
      )
    }

    if (statusFilterVotos !== "all") {
      filtered = filtered.filter(v => v.status === statusFilterVotos)
    }

    setFilteredVotos(filtered)
    setCurrentPageVotos(1)
  }

  const totalPagesVotos = Math.ceil(filteredVotos.length / itemsPerPage)
  const startIndexVotos = (currentPageVotos - 1) * itemsPerPage
  const endIndexVotos = startIndexVotos + itemsPerPage
  const paginatedVotos = filteredVotos.slice(startIndexVotos, endIndexVotos)

  function handleApprove(photo) {
    // Quando aprova uma foto, ela se torna a foto oficial do prato
    // Todas as outras fotos aprovadas do mesmo prato voltam para pendente
    toast.success(`✓ Foto aprovada como OFICIAL da receita "${photo.pratoNome}"!`)
    setFotos(fotos =>
      fotos.map(f => {
        if (f.id === photo.id) {
          // Esta foto agora é aprovada e oficial
          return { ...f, status: 'aprovada', moderadoPor: 'Admin', dataModeração: new Date().toISOString() }
        }
        // Se era aprovada do mesmo prato, volta para pendente
        if (f.pratoId === photo.pratoId && f.status === 'aprovada') {
          return { ...f, status: 'pendente', moderadoPor: null, dataModeração: null }
        }
        return f
      })
    )
  }

  function handleReject(photo) {
    const motivo = prompt('Motivo da rejeição (opcional):')
    if (motivo === null) return // Cancelou
    
    toast.error(`✗ Foto rejeitada`)
    setFotos(fotos =>
      fotos.map(f => f.id === photo.id ? { 
        ...f, 
        status: 'rejeitada',
        motivoRejeicao: motivo || 'Não atende aos critérios de qualidade',
        moderadoPor: 'Admin',
        dataModeração: new Date().toISOString(),
      } : f)
    )
  }

  function handleValidateVoto(voto) {
    // Aprova o voto - ele passa a ser contabilizado na avaliação
    const sucesso = aprovarVoto(voto.id)
    
    if (sucesso) {
      toast.success(`Voto ${voto.votoId} aprovado e adicionado à avaliação!`, {
        description: 'O voto agora será contabilizado no ranking.',
      })
      
      // Remove o voto da lista de suspeitos/pendentes
      setVotosSuspeitos(items => items.filter(i => i.id !== voto.id))
      
      // Atualiza as estatísticas
      if (stats) {
        setStats(prev => ({
          ...prev,
          totalSuspeitos: Math.max(0, prev.totalSuspeitos - 1),
          totalValidos: prev.totalValidos + 1,
        }))
      }
    } else {
      toast.error('Erro ao aprovar voto')
    }
  }

  function handleSuspectVoto(voto) {
    // Marca o voto como suspeito/rejeitado
    const sucesso = marcarSuspeito(voto.id, 'Rejeitado pela moderação')
    
    if (sucesso) {
      toast.error(`Voto ${voto.votoId} rejeitado`, {
        description: 'O voto não será contabilizado na avaliação.',
      })
      
      // Atualiza o status na lista
      setVotosSuspeitos(items =>
        items.map(i => i.id === voto.id ? { ...i, status: 'suspeito', motivoSuspeito: 'Rejeitado pela moderação' } : i)
      )
    } else {
      toast.error('Erro ao rejeitar voto')
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Moderação</h1>
        <p className="text-muted-foreground mt-1">
          Moderação técnica de votos: fotos, GPS, metadados e IA
        </p>
      </div>

      {/* BIG-NUMBERS de Moderação */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Votos Suspeitos"
            value={formatNumber(stats.totalSuspeitos)}
            icon={AlertTriangle}
            className="border-red-200 dark:border-red-800"
          />
          <DashboardCard
            title="Votos Pendentes"
            value={formatNumber(stats.totalPendentes)}
            icon={Clock}
            className="border-yellow-200 dark:border-yellow-800"
          />
          <DashboardCard
            title="Fotos para Revisar"
            value={formatNumber(stats.fotosPendentes)}
            icon={Image}
            className="border-blue-200 dark:border-blue-800"
          />
          <DashboardCard
            title="Votos Validados"
            value={formatNumber(stats.votosValidados)}
            icon={CheckCircle2}
            className="border-green-200 dark:border-green-800"
          />
        </div>
      )}

      {/* Tabs para organizar seções */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="fotos">Fotos</TabsTrigger>
          <TabsTrigger value="votos">Votos Suspeitos</TabsTrigger>
          <TabsTrigger value="gps">GPS & Metadados</TabsTrigger>
          <TabsTrigger value="ia">IA Moderando</TabsTrigger>
        </TabsList>

        {/* Tab: Fotos */}
        <TabsContent value="fotos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">Fotos para Moderação</CardTitle>
              <CardDescription>
                {filteredFotos.length} foto(s) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Select value={statusFilterFotos} onValueChange={setStatusFilterFotos}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="aprovada">Aprovada</SelectItem>
                    <SelectItem value="rejeitada">Rejeitada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredFotos.length === 0 ? (
                  <EmptyState
                    icon={Image}
                    title="Nenhuma foto encontrada"
                    description="Tente ajustar os filtros para encontrar fotos."
                  />
                ) : (
                  filteredFotos.map((foto) => (
                    <PhotoModerationItem
                      key={foto.id}
                      photo={foto}
                      status={foto.status}
                      onApprove={() => handleApprove(foto)}
                      onReject={() => handleReject(foto)}
                      onView={() => setSelectedPhoto(foto)}
                      disabled={loading}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Votos Suspeitos */}
        <TabsContent value="votos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">Votos Suspeitos</CardTitle>
              <CardDescription>
                {filteredVotos.length} voto(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por ID do voto ou device..."
                    value={searchTermVotos}
                    onChange={(e) => setSearchTermVotos(e.target.value)}
                  />
                </div>
                <Select value={statusFilterVotos} onValueChange={setStatusFilterVotos}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="validado">Validado</SelectItem>
                    <SelectItem value="suspeito">Suspeito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID do Voto</TableHead>
                      <TableHead>Foto</TableHead>
                      <TableHead>Hash</TableHead>
                      <TableHead>GPS</TableHead>
                      <TableHead>Distância</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedVotos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="p-0">
                          <EmptyState
                            icon={Shield}
                            title="Nenhum voto encontrado"
                            description="Tente ajustar os filtros para encontrar votos suspeitos."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedVotos.map((item) => (
                        <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                          <TableCell className="font-mono text-xs">{item.votoId}</TableCell>
                          <TableCell>
                            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border" onClick={() => setSelectedVoto(item)}>
                              <AvatarImage src={item.foto} />
                              <AvatarFallback>Foto</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="font-mono text-xs max-w-[120px] truncate">{item.hash}</TableCell>
                          <TableCell className="text-xs">
                            {item.gps.lat.toFixed(4)}, {item.gps.lng.toFixed(4)}
                          </TableCell>
                          <TableCell>{item.distancia.toFixed(2)} km</TableCell>
                          <TableCell className="text-xs">
                            {formatDateTime(item.horario)}
                          </TableCell>
                          <TableCell className="text-xs">{item.deviceInfo}</TableCell>
                          <TableCell>
                            <AuditTag status={item.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedVoto(item)}
                                disabled={loading}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-600"
                                onClick={() => handleValidateVoto(item)}
                                disabled={loading || item.status === 'validado'}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                onClick={() => handleSuspectVoto(item)}
                                disabled={loading || item.status === 'suspeito'}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <Pagination
                currentPage={currentPageVotos}
                totalPages={totalPagesVotos}
                totalItems={filteredVotos.length}
                itemsPerPage={itemsPerPage}
                startIndex={startIndexVotos}
                endIndex={endIndexVotos}
                onPageChange={setCurrentPageVotos}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: GPS & Metadados */}
        <TabsContent value="gps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                GPS & Metadados
              </CardTitle>
              <CardDescription>
                Análise de localização e informações técnicas dos votos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {votosSuspeitos.filter(v => v.status === 'suspeito' && v.motivoSuspeito?.includes('GPS')).slice(0, 5).map((voto) => (
                  <div key={voto.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium">{voto.votoId}</p>
                      <p className="text-sm text-muted-foreground">
                        GPS: {voto.gps.lat.toFixed(6)}, {voto.gps.lng.toFixed(6)} • Distância: {voto.distancia.toFixed(2)} km
                      </p>
                      <p className="text-sm text-red-600 mt-1">{voto.motivoSuspeito}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedVoto(voto)}>
                      Ver detalhes
                    </Button>
                  </div>
                ))}
                {votosSuspeitos.filter(v => v.status === 'suspeito' && v.motivoSuspeito?.includes('GPS')).length === 0 && (
                  <EmptyState
                    icon={MapPin}
                    title="Nenhum problema de GPS encontrado"
                    description="Todos os votos têm GPS válido."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: IA Moderando */}
        <TabsContent value="ia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                IA Moderando
              </CardTitle>
              <CardDescription>
                Votos analisados por inteligência artificial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {votosSuspeitos.filter(v => v.iaScore < 0.7).slice(0, 5).map((voto) => (
                  <div key={voto.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium">{voto.votoId}</p>
                      <p className="text-sm text-muted-foreground">
                        Score de confiança da IA: <span className={cn("font-semibold", voto.iaScore < 0.5 ? "text-red-600" : "text-yellow-600")}>
                          {(voto.iaScore * 100).toFixed(0)}%
                        </span>
                      </p>
                      {voto.motivoSuspeito && (
                        <p className="text-sm text-red-600 mt-1">{voto.motivoSuspeito}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedVoto(voto)}>
                      Revisar
                    </Button>
                  </div>
                ))}
                {votosSuspeitos.filter(v => v.iaScore < 0.7).length === 0 && (
                  <EmptyState
                    icon={Cpu}
                    title="Nenhum voto com baixa confiança"
                    description="Todos os votos têm score de confiança da IA acima de 70%."
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Visualização de Foto */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="!max-w-3xl">
          <DialogHeader>
            <DialogTitle>Visualizar Foto - {selectedPhoto?.pratoNome}</DialogTitle>
            <DialogDescription>
              {selectedPhoto?.estabelecimentoNome} • {selectedPhoto && formatDateTime(selectedPhoto.dataEnvio || selectedPhoto.horario)}
            </DialogDescription>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {selectedPhoto.url || selectedPhoto.thumbnailUrl ? (
                  <img
                    src={selectedPhoto.url || selectedPhoto.thumbnailUrl}
                    alt={selectedPhoto.pratoNome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-16 w-16" />
                  </div>
                )}
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
                  <p className="text-sm font-medium mb-1">Data de Envio</p>
                  <p className="text-sm">{formatDateTime(selectedPhoto.dataEnvio || selectedPhoto.horario)}</p>
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

      {/* Modal de Detalhes do Voto */}
      <Dialog open={!!selectedVoto} onOpenChange={() => setSelectedVoto(null)}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Voto - {selectedVoto?.votoId}</DialogTitle>
            <DialogDescription>
              Informações completas para moderação técnica
            </DialogDescription>
          </DialogHeader>
          {selectedVoto && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Foto</p>
                  <img
                    src={selectedVoto.foto}
                    alt="Foto do voto"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Hash</p>
                    <p className="text-xs font-mono break-all">{selectedVoto.hash}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">GPS</p>
                    <p className="text-xs">{selectedVoto.gps.lat.toFixed(6)}, {selectedVoto.gps.lng.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Distância</p>
                    <p className="text-xs">{selectedVoto.distancia.toFixed(2)} km</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Device</p>
                    <p className="text-xs">{selectedVoto.deviceInfo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Horário</p>
                    <p className="text-xs">{formatDateTime(selectedVoto.horario)}</p>
                  </div>
                  {selectedVoto.iaScore !== undefined && (
                    <div>
                      <p className="text-sm font-medium">Score IA</p>
                      <p className={cn("text-xs font-semibold", selectedVoto.iaScore < 0.5 ? "text-red-600" : "text-yellow-600")}>
                        {(selectedVoto.iaScore * 100).toFixed(0)}%
                      </p>
                    </div>
                  )}
                  {selectedVoto.motivoSuspeito && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Motivo Suspeito</p>
                      <p className="text-xs text-red-600">{selectedVoto.motivoSuspeito}</p>
                    </div>
                  )}
                </div>
              </div>
              {selectedVoto.status === 'pendente' && (
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleSuspectVoto(selectedVoto)
                      setSelectedVoto(null)
                    }}
                    disabled={loading}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Marcar como Suspeito
                  </Button>
                  <Button
                    onClick={() => {
                      handleValidateVoto(selectedVoto)
                      setSelectedVoto(null)
                    }}
                    disabled={loading}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Validar
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
