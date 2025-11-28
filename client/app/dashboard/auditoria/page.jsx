"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, XCircle, Eye, Search, Shield } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { AuditTag } from "@/components/dashboard/AuditTag"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { mockHash, randomFloat, randomDate } from "@/lib/utils/faker"
import { toast } from "sonner"

// URLs de imagens de comida para mock
const FOOD_IMAGES_AUDIT = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
]

// Gera mais itens mockados
function generateAuditoriaItems(count = 15) {
  const items = []
  const statuses = ['pendente', 'validado', 'suspeito']
  
  for (let i = 1; i <= count; i++) {
    const gps = { lat: -23.5505 + randomFloat(-0.1, 0.1), lng: -46.6333 + randomFloat(-0.1, 0.1) }
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    items.push({
      id: i,
      votoId: `VOTE_${String(i).padStart(3, '0')}`,
      foto: FOOD_IMAGES_AUDIT[i % FOOD_IMAGES_AUDIT.length],
      hash: mockHash(32),
      gps,
      distancia: randomFloat(0, 1),
      horario: randomDate(30).toISOString(),
      deviceInfo: ['iPhone 13', 'Samsung Galaxy S21', 'Xiaomi Mi 11', 'Google Pixel 6'][Math.floor(Math.random() * 4)],
      status,
      motivoSuspeito: status === 'suspeito' ? ['GPS inconsistente', 'Foto duplicada', 'Horário suspeito'][Math.floor(Math.random() * 3)] : null,
    })
  }
  
  return items
}

export default function AuditoriaPage() {
  const [loading, setLoading] = useState(true)
  const [auditoriaItems, setAuditoriaItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterItems()
  }, [searchTerm, statusFilter, auditoriaItems])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      const data = generateAuditoriaItems(15)
      setAuditoriaItems(data)
      
      // Calcula estatísticas
      const total = data.length
      const pendentes = data.filter(i => i.status === 'pendente').length
      const validados = data.filter(i => i.status === 'validado').length
      const suspeitos = data.filter(i => i.status === 'suspeito').length
      
      setStats({
        total,
        pendentes,
        validados,
        suspeitos,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar os itens de auditoria. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterItems() {
    let filtered = [...auditoriaItems]

    if (searchTerm) {
      filtered = filtered.filter(i =>
        i.votoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.deviceInfo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(i => i.status === statusFilter)
    }

    setFilteredItems(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  function handleValidate(item) {
    toast.success(`Voto ${item.votoId} validado (mock)`)
    // Atualiza status localmente
    setAuditoriaItems(items =>
      items.map(i => i.id === item.id ? { ...i, status: 'validado' } : i)
    )
  }

  function handleSuspect(item) {
    toast.error(`Voto ${item.votoId} marcado como suspeito (mock)`)
    // Atualiza status localmente
    setAuditoriaItems(items =>
      items.map(i => i.id === item.id ? { ...i, status: 'suspeito' } : i)
    )
  }

  function handleViewDetails(item) {
    setSelectedItem(item)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
        <p className="text-muted-foreground mt-1">Revise e valide votos suspeitos</p>
      </div>

      {/* Cards de Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total de Itens"
            value={formatNumber(stats.total)}
            icon={Shield}
          />
          <DashboardCard
            title="Pendentes"
            value={formatNumber(stats.pendentes)}
            icon={Shield}
          />
          <DashboardCard
            title="Validados"
            value={formatNumber(stats.validados)}
            icon={CheckCircle2}
          />
          <DashboardCard
            title="Suspeitos"
            value={formatNumber(stats.suspeitos)}
            icon={XCircle}
          />
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="tracking-tight">Votos para Auditoria</CardTitle>
          <CardDescription>
            {filteredItems.length} item(ns) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ID do voto ou device..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

          {/* Tabela */}
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
                {paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="p-0">
                      <EmptyState 
                        icon={Shield}
                        title="Nenhum item encontrado"
                        description="Tente ajustar os filtros para encontrar itens para auditoria."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{item.votoId}</TableCell>
                      <TableCell>
                        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-border" onClick={() => handleViewDetails(item)}>
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
                            onClick={() => handleViewDetails(item)}
                            disabled={loading}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600"
                            onClick={() => handleValidate(item)}
                            disabled={loading || item.status === 'validado'}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleSuspect(item)}
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

          {/* Paginação */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="!max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Voto - {selectedItem?.votoId}</DialogTitle>
            <DialogDescription>
              Informações completas para auditoria
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Foto</p>
                  <img
                    src={selectedItem.foto}
                    alt="Foto do voto"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Hash</p>
                    <p className="text-xs font-mono break-all">{selectedItem.hash}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">GPS</p>
                    <p className="text-xs">{selectedItem.gps.lat.toFixed(6)}, {selectedItem.gps.lng.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Distância</p>
                    <p className="text-xs">{selectedItem.distancia.toFixed(2)} km</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Device</p>
                    <p className="text-xs">{selectedItem.deviceInfo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Horário</p>
                    <p className="text-xs">{formatDateTime(selectedItem.horario)}</p>
                  </div>
                  {selectedItem.motivoSuspeito && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Motivo Suspeito</p>
                      <p className="text-xs text-red-600">{selectedItem.motivoSuspeito}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
