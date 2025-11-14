"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Edit, Eye, UtensilsCrossed, Star, Trophy } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatRating } from "@/lib/utils/format"
import { pratos, getTopPratos } from "@/lib/mock/pratos"
import { categorias } from "@/lib/mock/categorias"
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
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function PratosPage() {
  const [loading, setLoading] = useState(true)
  const [pratosList, setPratosList] = useState([])
  const [filteredPratos, setFilteredPratos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("all")
  const [estabelecimentoFilter, setEstabelecimentoFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [stats, setStats] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({ 
    name: "", 
    categoriaId: "", 
    estabelecimentoId: "",
    descricao: "",
    preco: ""
  })

  const { city, edition } = useTenantStore()
  const { sigiloAtivo } = useAuthStore()
  
  const estabelecimentosFiltrados = city?.id && edition?.id
    ? getEstabelecimentosByTenant(city.id, edition.id)
    : estabelecimentos

  useEffect(() => {
    loadData()
  }, [city, edition])

  useEffect(() => {
    filterPratos()
  }, [searchTerm, categoriaFilter, estabelecimentoFilter, pratosList])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      // Filtra pratos por tenant se necessário
      let data = [...pratos]
      if (city?.id && edition?.id) {
        const estabelecimentosFiltrados = estabelecimentos.filter(
          e => e.cidadeId === city.id && e.edicaoId === edition.id
        )
        const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
        data = data.filter(p => estabelecimentosIds.includes(p.estabelecimentoId))
      }
      
      setPratosList(data)
      
      // Calcula estatísticas
      const totalPratos = data.length
      const pratosAtivos = data.filter(p => p.ativo).length
      const totalVotos = data.reduce((sum, p) => sum + p.totalVotos, 0)
      const mediaGeral = data.length > 0 
        ? data.reduce((sum, p) => sum + p.mediaNota, 0) / data.length 
        : 0
      
      setStats({
        totalPratos,
        pratosAtivos,
        totalVotos,
        mediaGeral,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar os pratos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterPratos() {
    let filtered = [...pratosList]

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoriaFilter !== "all") {
      filtered = filtered.filter(p => p.categoriaId === parseInt(categoriaFilter))
    }

    if (estabelecimentoFilter !== "all") {
      filtered = filtered.filter(p => p.estabelecimentoId === parseInt(estabelecimentoFilter))
    }

    setFilteredPratos(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredPratos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPratos = filteredPratos.slice(startIndex, endIndex)

  function getEstabelecimentoName(id) {
    return estabelecimentos.find(e => e.id === id)?.name || 'N/A'
  }

  async function handleCreate() {
    if (!formData.name.trim()) {
      toast.error("Nome do prato é obrigatório")
      return
    }
    if (!formData.categoriaId) {
      toast.error("Categoria é obrigatória")
      return
    }
    if (!formData.estabelecimentoId) {
      toast.error("Estabelecimento é obrigatório")
      return
    }

    setCreating(true)
    try {
      await delay(600)
      toast.success(`Prato "${formData.name}" criado com sucesso!`)
      setDialogOpen(false)
      setFormData({ 
        name: "", 
        categoriaId: "", 
        estabelecimentoId: "",
        descricao: "",
        preco: ""
      })
      loadData()
    } catch (error) {
      toast.error("Não foi possível criar o prato. Verifique os dados e tente novamente.")
    } finally {
      setCreating(false)
    }
  }

  function handleEdit(prato) {
    toast.info(`Editar prato: ${prato.name} (mock)`)
  }

  function handleView(prato) {
    toast.info(`Ver detalhes: ${prato.name} (mock)`)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pratos</h1>
          <p className="text-muted-foreground mt-1">Gerencie os pratos participantes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Prato
        </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Novo Prato</DialogTitle>
              <DialogDescription>
                Cadastre um novo prato para participação na premiação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Prato</Label>
                <Input
                  id="name"
                  placeholder="Ex: Risotto de Camarão"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={creating}
                  className="h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoriaId">Categoria</Label>
                  <Select 
                    value={formData.categoriaId} 
                    onValueChange={(value) => setFormData({ ...formData, categoriaId: value })}
                    disabled={creating}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.icon} {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estabelecimentoId">Estabelecimento</Label>
                  <Select 
                    value={formData.estabelecimentoId} 
                    onValueChange={(value) => setFormData({ ...formData, estabelecimentoId: value })}
                    disabled={creating}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o estabelecimento" />
                    </SelectTrigger>
                    <SelectContent>
                      {estabelecimentosFiltrados.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o prato..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  disabled={creating}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  placeholder="Ex: 45.90"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  disabled={creating}
                  className="h-11"
                  min="0"
                  step="0.01"
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
                    categoriaId: "", 
                    estabelecimentoId: "",
                    descricao: "",
                    preco: ""
                  })
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={creating || !formData.name.trim() || !formData.categoriaId || !formData.estabelecimentoId}
              >
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Prato
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
            title="Total de Pratos"
            value={formatNumber(stats.totalPratos)}
            icon={UtensilsCrossed}
          />
          <DashboardCard
            title="Pratos Ativos"
            value={formatNumber(stats.pratosAtivos)}
            icon={UtensilsCrossed}
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
          <CardTitle>Lista de Pratos</CardTitle>
          <CardDescription>
            {filteredPratos.length} prato(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar prato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
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
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estabelecimento</TableHead>
                  <TableHead>Votos</TableHead>
                  <TableHead>Média</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPratos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="p-0">
                      <EmptyState 
                        icon={UtensilsCrossed}
                        title="Nenhum prato encontrado"
                        description="Tente ajustar os filtros ou criar um novo prato."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPratos.map((prato) => (
                    <TableRow key={prato.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <Avatar className="h-10 w-10 ring-2 ring-border">
                          <AvatarImage src={prato.foto || '/prato.jpg'} alt={prato.name} />
                          <AvatarFallback>{prato.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{prato.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{prato.categoria?.name || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>{getEstabelecimentoName(prato.estabelecimentoId)}</TableCell>
                      <TableCell>{formatNumber(prato.totalVotos)}</TableCell>
                      <TableCell>
                        {sigiloAtivo ? (
                          <span className="text-muted-foreground">***</span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{formatRating(prato.mediaNota)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(prato)}
                            disabled={loading}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(prato)}
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
            totalItems={filteredPratos.length}
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
