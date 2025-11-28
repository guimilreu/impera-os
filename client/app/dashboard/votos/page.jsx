"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Search, Download, Eye, CheckCircle2, XCircle, MapPin, Vote, Lock } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { SigiloBanner, SigiloValue } from "@/components/dashboard/SigiloIndicator"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { votos, getVotosByTenant } from "@/lib/mock/votos"
import { estabelecimentos } from "@/lib/mock/estabelecimentos"
import { toast } from "sonner"

export default function VotosPage() {
  const [loading, setLoading] = useState(true)
  const [votosList, setVotosList] = useState([])
  const [filteredVotos, setFilteredVotos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gpsFilter, setGpsFilter] = useState("all")
  const [estabelecimentoFilter, setEstabelecimentoFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [stats, setStats] = useState(null)

  const { city, edition } = useTenantStore()
  const { sigiloAtivo } = useAuthStore()

  useEffect(() => {
    loadData()
  }, [city, edition])

  useEffect(() => {
    filterVotos()
  }, [searchTerm, statusFilter, gpsFilter, estabelecimentoFilter, votosList])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      // Filtra votos por tenant se necessário
      let data = getVotosByTenant(city?.id, edition?.id)
      setVotosList(data)
      
      // Calcula estatísticas
      const totalVotos = data.length
      const votosValidos = data.filter(v => v.valido).length
      const votosSuspeitos = data.filter(v => v.suspeito).length
      const taxaAprovacao = totalVotos > 0 ? (votosValidos / totalVotos) * 100 : 0
      
      setStats({
        totalVotos,
        votosValidos,
        votosSuspeitos,
        taxaAprovacao,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar os votos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterVotos() {
    let filtered = [...votosList]

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.pratoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.estabelecimentoNome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(v => 
        statusFilter === 'valido' ? v.valido : v.suspeito
      )
    }

    if (gpsFilter !== "all") {
      filtered = filtered.filter(v => 
        gpsFilter === 'valido' ? v.gps?.valido : !v.gps?.valido
      )
    }

    if (estabelecimentoFilter !== "all") {
      filtered = filtered.filter(v => v.estabelecimentoId === parseInt(estabelecimentoFilter))
    }

    setFilteredVotos(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredVotos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVotos = filteredVotos.slice(startIndex, endIndex)

  function handleExportCSV() {
    if (sigiloAtivo) {
      toast.error('Exportação bloqueada enquanto o sigilo estiver ativo')
      return
    }

    // Simula exportação CSV
    const headers = ['ID', 'Prato', 'Estabelecimento', 'Horário', 'Status', 'GPS', 'Nota Total']
    const rows = filteredVotos.map(v => [
      v.id,
      v.pratoNome,
      v.estabelecimentoNome,
      formatDateTime(v.horario),
      v.valido ? 'Válido' : 'Suspeito',
      v.gps?.valido ? 'OK' : 'Inválido',
      v.total.toFixed(2)
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `votos_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('CSV exportado com sucesso (mock)')
  }

  function handleView(voto) {
    toast.info(`Ver detalhes do voto #${voto.id} (mock)`)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Votos</h1>
          <p className="text-muted-foreground mt-1">Visualize e gerencie todos os votos</p>
        </div>
        <Button 
          onClick={handleExportCSV}
          disabled={sigiloAtivo || loading}
          className="shadow-sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Banner de Sigilo */}
      {sigiloAtivo && (
        <SigiloBanner 
          title="Notas e exportação bloqueadas"
          description="As notas dos votos estão protegidas pelo sigilo. A exportação CSV também está desabilitada até a premiação."
        />
      )}

      {/* Cards de Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total de Votos"
            value={formatNumber(stats.totalVotos)}
            icon={Search}
          />
          <DashboardCard
            title="Votos Válidos"
            value={formatNumber(stats.votosValidos)}
            icon={CheckCircle2}
          />
          <DashboardCard
            title="Votos Suspeitos"
            value={formatNumber(stats.votosSuspeitos)}
            icon={XCircle}
          />
          <DashboardCard
            title="Taxa de Aprovação"
            value={`${stats.taxaAprovacao.toFixed(1)}%`}
            icon={CheckCircle2}
          />
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="tracking-tight">Lista de Votos</CardTitle>
          <CardDescription>
            {filteredVotos.length} voto(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por prato ou estabelecimento..."
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
                <SelectItem value="valido">Válido</SelectItem>
                <SelectItem value="suspeito">Suspeito</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gpsFilter} onValueChange={setGpsFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por GPS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="valido">GPS OK</SelectItem>
                <SelectItem value="invalido">GPS Inválido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estabelecimentoFilter} onValueChange={setEstabelecimentoFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estabelecimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estabelecimentos</SelectItem>
                {estabelecimentos.map((e) => (
                  <SelectItem key={e.id} value={e.id.toString()}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={itemsPerPage.toString()} onValueChange={(v) => setItemsPerPage(parseInt(v))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="20">20 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Foto</TableHead>
                  <TableHead>Prato</TableHead>
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Nota Total</TableHead>
                  <TableHead>GPS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVotos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="p-0">
                      <EmptyState 
                        icon={Vote}
                        title="Nenhum voto encontrado"
                        description="Tente ajustar os filtros para encontrar votos."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVotos.map((voto) => (
                    <TableRow key={voto.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">#{voto.id}</TableCell>
                      <TableCell>
                        <Avatar className="h-8 w-8 ring-2 ring-border">
                          <AvatarImage src={voto.foto || '/prato.jpg'} alt={voto.pratoNome} />
                          <AvatarFallback>{voto.pratoNome.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{voto.pratoNome}</TableCell>
                      <TableCell>{voto.estabelecimentoNome}</TableCell>
                      <TableCell className="text-sm">{formatDateTime(voto.horario)}</TableCell>
                      <TableCell>
                        {sigiloAtivo ? (
                          <SigiloValue />
                        ) : (
                          <span className="font-medium">{voto.total.toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={voto.gps?.valido ? 'valido' : 'suspeito'} 
                          label={voto.gps?.valido ? 'OK' : 'Inválido'}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={voto.valido ? 'valido' : 'suspeito'} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleView(voto)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
            totalItems={filteredVotos.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
