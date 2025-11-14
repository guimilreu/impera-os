"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Eye, MapPin, Building2, Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber } from "@/lib/utils/format"
import { getAllCities, getEditionsByCity, DEFAULT_REGION } from "@/lib/mock/tenants"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
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

// Mock de dados de cidades com estatísticas
function getCidadesMock() {
  const allCities = getAllCities()
  
  return allCities.map(city => {
    const editions = getEditionsByCity(city.id) || []
    
    return {
      ...city,
      regionName: DEFAULT_REGION.name,
      totalEdicoes: editions.length,
      totalEstabelecimentos: Math.floor(Math.random() * 50) + 10,
      status: Math.random() > 0.2 ? 'ativa' : 'inativa',
    }
  })
}

export default function CidadesPage() {
  const [loading, setLoading] = useState(true)
  const [cidades, setCidades] = useState([])
  const [filteredCidades, setFilteredCidades] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [stats, setStats] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({ name: "" })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterCidades()
  }, [searchTerm, statusFilter, cidades])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      const data = getCidadesMock()
      setCidades(data)
      
      // Calcula estatísticas
      const totalCidades = data.length
      const cidadesAtivas = data.filter(c => c.status === 'ativa').length
      const totalEstabelecimentos = data.reduce((sum, c) => sum + c.totalEstabelecimentos, 0)
      const totalEdicoes = data.reduce((sum, c) => sum + c.totalEdicoes, 0)
      
      setStats({
        totalCidades,
        cidadesAtivas,
        totalEstabelecimentos,
        totalEdicoes,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar as cidades. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterCidades() {
    let filtered = [...cidades]

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    setFilteredCidades(filtered)
    setCurrentPage(1)
  }

  function validateForm() {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Nome da cidade é obrigatório"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleCreate() {
    if (!validateForm()) {
      return
    }

    setCreating(true)
    try {
      await delay(600)
      toast.success(`Cidade "${formData.name}" criada com sucesso!`)
      setDialogOpen(false)
      setFormData({ name: "" })
      setErrors({})
      loadData()
    } catch (error) {
      toast.error("Não foi possível criar a cidade. Verifique os dados e tente novamente.")
    } finally {
      setCreating(false)
    }
  }

  const totalPages = Math.ceil(filteredCidades.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCidades = filteredCidades.slice(startIndex, endIndex)

  function handleEdit(cidade) {
    toast.info(`Editar cidade: ${cidade.name} (mock)`)
  }

  function handleView(cidade) {
    toast.info(`Ver detalhes: ${cidade.name} (mock)`)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cidades</h1>
          <p className="text-muted-foreground mt-1">Gerencie as cidades participantes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading} className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Nova Cidade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Nova Cidade</DialogTitle>
              <DialogDescription>
                Adicione uma nova cidade ao sistema. A região será automaticamente definida como Sudeste.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Cidade</Label>
                <div className="relative">
                  <Input
                    id="name"
                    placeholder="Ex: Bauru"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) {
                        setErrors({ ...errors, name: null })
                      }
                    }}
                    onBlur={validateForm}
                    disabled={creating}
                    className={cn(
                      "h-11 pr-10 transition-colors",
                      errors.name && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {formData.name && !errors.name && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                  {errors.name && (
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                  )}
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  setFormData({ name: "" })
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={creating || !formData.name.trim()}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Cidade
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
            title="Total de Cidades"
            value={formatNumber(stats.totalCidades)}
            icon={MapPin}
          />
          <DashboardCard
            title="Cidades Ativas"
            value={formatNumber(stats.cidadesAtivas)}
            icon={Building2}
          />
          <DashboardCard
            title="Total de Estabelecimentos"
            value={formatNumber(stats.totalEstabelecimentos)}
            icon={Building2}
          />
          <DashboardCard
            title="Total de Edições"
            value={formatNumber(stats.totalEdicoes)}
            icon={Calendar}
          />
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cidades</CardTitle>
          <CardDescription>
            {filteredCidades.length} cidade(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cidade ou região..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="inativa">Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Edições</TableHead>
                  <TableHead>Estabelecimentos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCidades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <EmptyState 
                        icon={MapPin}
                        title="Nenhuma cidade encontrada"
                        description="Tente ajustar os filtros ou criar uma nova cidade."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCidades.map((cidade) => (
                    <TableRow key={cidade.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{cidade.name}</TableCell>
                      <TableCell>{cidade.totalEdicoes}</TableCell>
                      <TableCell>{formatNumber(cidade.totalEstabelecimentos)}</TableCell>
                      <TableCell>
                        <Badge variant={cidade.status === 'ativa' ? 'default' : 'secondary'}>
                          {cidade.status === 'ativa' ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(cidade)}
                                disabled={loading}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver detalhes</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(cidade)}
                                disabled={loading}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar cidade</p>
                            </TooltipContent>
                          </Tooltip>
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
            totalItems={filteredCidades.length}
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
