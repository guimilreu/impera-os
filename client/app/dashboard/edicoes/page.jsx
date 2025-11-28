"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, Calendar, Lock, LockOpen, Trophy } from "lucide-react"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { Pagination } from "@/components/dashboard/Pagination"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { getAllCities, editions, getEditionsByCity } from "@/lib/mock/tenants"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

// Mock de dados de edições com estatísticas
function getEdicoesMock() {
  const allEditions = []
  Object.values(editions).forEach(editionList => {
    allEditions.push(...editionList)
  })
  
  const allCities = getAllCities()
  
  return allEditions.map(edition => {
    const city = allCities.find(c => c.id === edition.cityId)
    
    return {
      ...edition,
      cityName: city?.name || 'N/A',
      dataInicio: new Date(edition.year, 0, 1).toISOString(),
      dataFim: new Date(edition.year, 11, 31).toISOString(),
      totalVotos: Math.floor(Math.random() * 5000) + 1000,
      totalEstabelecimentos: Math.floor(Math.random() * 50) + 10,
      status: edition.sigiloAtivo ? 'ativa' : 'encerrada',
    }
  })
}

export default function EdicoesPage() {
  const [loading, setLoading] = useState(true)
  const [edicoes, setEdicoes] = useState([])
  const [filteredEdicoes, setFilteredEdicoes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [stats, setStats] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({ 
    name: "", 
    cityId: "", 
    year: new Date().getFullYear().toString(), 
    sigiloAtivo: false 
  })

  const { city } = useTenantStore()
  const allCities = getAllCities()

  useEffect(() => {
    loadData()
  }, [city])

  useEffect(() => {
    filterEdicoes()
  }, [searchTerm, cityFilter, statusFilter, edicoes])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      let data = getEdicoesMock()
      // Filtra por cidade se tenant selecionado
      if (city?.id) {
        data = data.filter(e => e.cityId === city.id)
      }
      setEdicoes(data)
      
      // Calcula estatísticas
      const totalEdicoes = data.length
      const edicoesAtivas = data.filter(e => e.status === 'ativa').length
      const totalVotos = data.reduce((sum, e) => sum + e.totalVotos, 0)
      const totalEstabelecimentos = data.reduce((sum, e) => sum + e.totalEstabelecimentos, 0)
      
      setStats({
        totalEdicoes,
        edicoesAtivas,
        totalVotos,
        totalEstabelecimentos,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar as edições. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterEdicoes() {
    let filtered = [...edicoes]

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.cityName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por cidade
    if (cityFilter !== "all") {
      filtered = filtered.filter(e => e.cityId === parseInt(cityFilter))
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(e => e.status === statusFilter)
    }

    setFilteredEdicoes(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredEdicoes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEdicoes = filteredEdicoes.slice(startIndex, endIndex)

  async function handleCreate() {
    if (!formData.name.trim()) {
      toast.error("Nome da edição é obrigatório")
      return
    }
    if (!formData.cityId) {
      toast.error("Cidade é obrigatória")
      return
    }
    if (!formData.year || parseInt(formData.year) < 2020) {
      toast.error("Ano inválido")
      return
    }

    setCreating(true)
    try {
      await delay(600)
      toast.success(`Edição "${formData.name}" criada com sucesso!`)
      setDialogOpen(false)
      setFormData({ 
        name: "", 
        cityId: "", 
        year: new Date().getFullYear().toString(), 
        sigiloAtivo: false 
      })
      loadData()
    } catch (error) {
      toast.error("Não foi possível criar a edição. Verifique os dados e tente novamente.")
    } finally {
      setCreating(false)
    }
  }

  function handleEdit(edicao) {
    toast.info(`Editar edição: ${edicao.name} (mock)`)
  }

  function handleView(edicao) {
    toast.info(`Ver detalhes: ${edicao.name} (mock)`)
  }

  function handleToggleSigilo(edicao) {
    toast.success(`Sigilo ${edicao.sigiloAtivo ? 'desativado' : 'ativado'} para ${edicao.name} (mock)`)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edições</h1>
          <p className="text-muted-foreground mt-1">Gerencie as edições da premiação</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Edição
        </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Nova Edição</DialogTitle>
              <DialogDescription>
                Crie uma nova edição da premiação para uma cidade específica.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Edição</Label>
                <Input
                  id="name"
                  placeholder="Ex: Edição 2025"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={creating}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cityId">Cidade</Label>
                <Select 
                  value={formData.cityId} 
                  onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                  disabled={creating}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCities.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Ano</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2025"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  disabled={creating}
                  className="h-11"
                  min="2020"
                  max="2100"
                />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="sigiloAtivo"
                  checked={formData.sigiloAtivo}
                  onCheckedChange={(checked) => setFormData({ ...formData, sigiloAtivo: checked })}
                  disabled={creating}
                />
                <Label htmlFor="sigiloAtivo" className="text-sm font-normal cursor-pointer">
                  Ativar sigilo (ocultar rankings até a premiação)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  setFormData({ 
                    name: "", 
                    cityId: "", 
                    year: new Date().getFullYear().toString(), 
                    sigiloAtivo: false 
                  })
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={creating || !formData.name.trim() || !formData.cityId || !formData.year}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Edição
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Estatísticas */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total de Edições"
            value={formatNumber(stats.totalEdicoes)}
            icon={Calendar}
          />
          <DashboardCard
            title="Edições Ativas"
            value={formatNumber(stats.edicoesAtivas)}
            icon={Trophy}
          />
          <DashboardCard
            title="Total de Votos"
            value={formatNumber(stats.totalVotos)}
            icon={Calendar}
          />
          <DashboardCard
            title="Total de Estabelecimentos"
            value={formatNumber(stats.totalEstabelecimentos)}
            icon={Calendar}
          />
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Edições</CardTitle>
          <CardDescription>
            {filteredEdicoes.length} edição(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar edição ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {allCities.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="encerrada">Encerrada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Data Fim</TableHead>
                  <TableHead>Votos</TableHead>
                  <TableHead>Sigilo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEdicoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Nenhuma edição encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEdicoes.map((edicao) => (
                    <TableRow key={edicao.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{edicao.name}</TableCell>
                      <TableCell>{edicao.cityName}</TableCell>
                      <TableCell>{edicao.year}</TableCell>
                      <TableCell>{formatDateTime(edicao.dataInicio)}</TableCell>
                      <TableCell>{formatDateTime(edicao.dataFim)}</TableCell>
                      <TableCell>{formatNumber(edicao.totalVotos)}</TableCell>
                      <TableCell>
                        <Badge variant={edicao.sigiloAtivo ? 'destructive' : 'default'}>
                          {edicao.sigiloAtivo ? (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <LockOpen className="h-3 w-3 mr-1" />
                              Inativo
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={edicao.status === 'ativa' ? 'default' : 'secondary'}>
                          {edicao.status === 'ativa' ? 'Ativa' : 'Encerrada'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(edicao)}
                            disabled={loading}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleSigilo(edicao)}
                            title={edicao.sigiloAtivo ? 'Desativar sigilo' : 'Ativar sigilo'}
                            disabled={loading}
                            className="h-8 w-8"
                          >
                            {edicao.sigiloAtivo ? (
                              <LockOpen className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(edicao)}
                            disabled={loading}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
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
            totalItems={filteredEdicoes.length}
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
