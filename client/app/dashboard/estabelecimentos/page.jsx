"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Edit, Eye, Building2, Star, Trophy, MapPin } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatRating } from "@/lib/utils/format"
import { estabelecimentos, getEstabelecimentosByTenant } from "@/lib/mock/estabelecimentos"
import { getAllCities, getEditionsByCity } from "@/lib/mock/tenants"
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

export default function EstabelecimentosPage() {
  const [loading, setLoading] = useState(true)
  const [estabelecimentosList, setEstabelecimentosList] = useState([])
  const [filteredEstabelecimentos, setFilteredEstabelecimentos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [stats, setStats] = useState(null)
  const { city, edition } = useTenantStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({ 
    name: "", 
    cidadeId: city?.id?.toString() || "", 
    edicaoId: edition?.id?.toString() || "",
    endereco: "",
    telefone: ""
  })
  const { sigiloAtivo } = useAuthStore()
  const allCities = getAllCities()

  useEffect(() => {
    loadData()
  }, [city, edition])

  useEffect(() => {
    filterEstabelecimentos()
  }, [searchTerm, cityFilter, statusFilter, estabelecimentosList])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      const data = getEstabelecimentosByTenant(city?.id, edition?.id)
      setEstabelecimentosList(data)
      
      // Calcula estatísticas
      const totalEstabelecimentos = data.length
      const estabelecimentosAtivos = data.filter(e => e.ativo).length
      const totalVotos = data.reduce((sum, e) => sum + e.totalVotos, 0)
      const mediaGeral = data.length > 0 
        ? data.reduce((sum, e) => sum + e.mediaNota, 0) / data.length 
        : 0
      
      setStats({
        totalEstabelecimentos,
        estabelecimentosAtivos,
        totalVotos,
        mediaGeral,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar os estabelecimentos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterEstabelecimentos() {
    let filtered = [...estabelecimentosList]

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter(e => e.cidadeId === parseInt(cityFilter))
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(e => 
        statusFilter === 'ativo' ? e.ativo : !e.ativo
      )
    }

    setFilteredEstabelecimentos(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredEstabelecimentos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEstabelecimentos = filteredEstabelecimentos.slice(startIndex, endIndex)

  const editionsForSelectedCity = formData.cidadeId 
    ? getEditionsByCity(parseInt(formData.cidadeId))
    : []

  async function handleCreate() {
    if (!formData.name.trim()) {
      toast.error("Nome do estabelecimento é obrigatório")
      return
    }
    if (!formData.cidadeId) {
      toast.error("Cidade é obrigatória")
      return
    }
    if (!formData.edicaoId) {
      toast.error("Edição é obrigatória")
      return
    }

    setCreating(true)
    try {
      await delay(600)
      toast.success(`Estabelecimento "${formData.name}" criado com sucesso!`)
      setDialogOpen(false)
      setFormData({ 
        name: "", 
        cidadeId: city?.id?.toString() || "", 
        edicaoId: edition?.id?.toString() || "",
        endereco: "",
        telefone: ""
      })
      loadData()
    } catch (error) {
      toast.error("Não foi possível criar o estabelecimento. Verifique os dados e tente novamente.")
    } finally {
      setCreating(false)
    }
  }

  function handleEdit(estabelecimento) {
    toast.info(`Editar estabelecimento: ${estabelecimento.name} (mock)`)
  }

  function handleView(estabelecimento) {
    toast.info(`Ver detalhes: ${estabelecimento.name} (mock)`)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estabelecimentos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os estabelecimentos participantes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Estabelecimento
        </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Novo Estabelecimento</DialogTitle>
              <DialogDescription>
                Cadastre um novo estabelecimento participante da premiação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Estabelecimento</Label>
                <Input
                  id="name"
                  placeholder="Ex: Restaurante Sabor & Arte"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={creating}
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidadeId">Cidade</Label>
                  <Select 
                    value={formData.cidadeId} 
                    onValueChange={(value) => setFormData({ ...formData, cidadeId: value, edicaoId: "" })}
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
                  <Label htmlFor="edicaoId">Edição</Label>
                  <Select 
                    value={formData.edicaoId} 
                    onValueChange={(value) => setFormData({ ...formData, edicaoId: value })}
                    disabled={creating || !formData.cidadeId}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione a edição" />
                    </SelectTrigger>
                    <SelectContent>
                      {editionsForSelectedCity.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Ex: Rua das Flores, 123, Centro"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  disabled={creating}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="Ex: (14) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  disabled={creating}
                  className="h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  setFormData({ 
                    name: "", 
                    cidadeId: city?.id?.toString() || "", 
                    edicaoId: edition?.id?.toString() || "",
                    endereco: "",
                    telefone: ""
                  })
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={creating || !formData.name.trim() || !formData.cidadeId || !formData.edicaoId}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Estabelecimento
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
            title="Total de Estabelecimentos"
            value={formatNumber(stats.totalEstabelecimentos)}
            icon={Building2}
          />
          <DashboardCard
            title="Estabelecimentos Ativos"
            value={formatNumber(stats.estabelecimentosAtivos)}
            icon={Building2}
          />
          <DashboardCard
            title="Total de Votos"
            value={formatNumber(stats.totalVotos)}
            icon={Trophy}
          />
          <DashboardCard
            title="Média Geral"
            value={sigiloAtivo ? '***' : formatRating(stats.mediaGeral)}
            icon={Star}
          />
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estabelecimentos</CardTitle>
          <CardDescription>
            {filteredEstabelecimentos.length} estabelecimento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar estabelecimento..."
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
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posição</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Votos</TableHead>
                  <TableHead>Média</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEstabelecimentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <EmptyState 
                        icon={Building2}
                        title="Nenhum estabelecimento encontrado"
                        description="Tente ajustar os filtros ou criar um novo estabelecimento."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEstabelecimentos.map((estabelecimento) => (
                    <TableRow key={estabelecimento.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="font-bold">{estabelecimento.posicao}º</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{estabelecimento.name}</TableCell>
                      <TableCell>{formatNumber(estabelecimento.totalVotos)}</TableCell>
                      <TableCell>
                        {sigiloAtivo ? (
                          <span className="text-muted-foreground">***</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{formatRating(estabelecimento.mediaNota)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={estabelecimento.ativo ? 'default' : 'secondary'}>
                          {estabelecimento.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleView(estabelecimento)}
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
                                onClick={() => handleEdit(estabelecimento)}
                                disabled={loading}
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar estabelecimento</p>
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
            totalItems={filteredEstabelecimentos.length}
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
