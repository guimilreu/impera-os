"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Edit, Eye, UtensilsCrossed, Star, Trophy, Camera, Upload, Lock } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { usePermissions } from "@/lib/permissions"
import { PhotoUploadModal } from "@/components/dashboard/PhotoUploadModal"
import { SigiloBanner, SigiloValue } from "@/components/dashboard/SigiloIndicator"
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
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [selectedReceita, setSelectedReceita] = useState(null)
  const [formData, setFormData] = useState({ 
    name: "", 
    categoriaId: "", 
    estabelecimentoId: "",
    descricao: "",
    preco: "",
    disponibilidade: "",
    instagram: ""
  })
  
  const disponibilidadeOpcoes = [
    'Almoço',
    'Jantar',
    'Almoço e Jantar',
    'Café da Manhã',
    'Todos os Horários',
    'Apenas Finais de Semana',
  ]

  const { city, edition } = useTenantStore()
  const { sigiloAtivo, role, estabelecimentoId } = useAuthStore()
  const permissions = usePermissions(role)
  
  // Verifica se é restaurante (vê apenas seus próprios pratos)
  const isRestaurante = role === 'estabelecimento'
  
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
      
      // Se for restaurante, filtra apenas os pratos do próprio estabelecimento
      if (isRestaurante && estabelecimentoId) {
        data = data.filter(p => p.estabelecimentoId === estabelecimentoId)
      }
      
      setPratosList(data)
      
      // Calcula estatísticas
      const totalPratos = data.length
      const pratosAtivos = data.filter(p => p.ativo).length
      const totalVotos = data.reduce((sum, p) => sum + p.totalVotos, 0)
      const mediaGeral = data.length > 0 
        ? data.reduce((sum, p) => sum + p.mediaNota, 0) / data.length 
        : 0
      
      // Calcula receitas por categoria
      const receitasPorCategoria = categorias.map(cat => ({
        ...cat,
        quantidade: data.filter(p => p.categoriaId === cat.id).length
      }))
      
      setStats({
        totalPratos,
        pratosAtivos,
        totalVotos,
        mediaGeral,
        receitasPorCategoria,
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar as receitas. Tente novamente.')
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
      toast.error("Nome da receita é obrigatório")
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
      toast.success(`Receita "${formData.name}" criada com sucesso!`)
      setDialogOpen(false)
      setFormData({ 
        name: "", 
        categoriaId: "", 
        estabelecimentoId: "",
        descricao: "",
        preco: "",
        disponibilidade: "",
        instagram: ""
      })
      loadData()
    } catch (error) {
      toast.error("Não foi possível criar a receita. Verifique os dados e tente novamente.")
    } finally {
      setCreating(false)
    }
  }

  function handleEdit(prato) {
    toast.info(`Editar prato: ${prato.name} (mock)`)
  }

  function handleUploadPhoto(prato) {
    setSelectedReceita(prato)
    setPhotoModalOpen(true)
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
          <h1 className="text-3xl font-bold tracking-tight">Receitas</h1>
          <p className="text-muted-foreground mt-1">Gerencie as receitas participantes</p>
        </div>
        {permissions.canCreate('pratos') && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={loading} className="shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                Nova Receita
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Nova Receita</DialogTitle>
              <DialogDescription>
                Cadastre uma nova receita para participação na premiação.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Receita</Label>
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
                  placeholder="Descreva a receita..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  disabled={creating}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="disponibilidade">Disponibilidade</Label>
                  <Select 
                    value={formData.disponibilidade} 
                    onValueChange={(value) => setFormData({ ...formData, disponibilidade: value })}
                    disabled={creating}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Quando está disponível" />
                    </SelectTrigger>
                    <SelectContent>
                      {disponibilidadeOpcoes.map((opcao) => (
                        <SelectItem key={opcao} value={opcao}>
                          {opcao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram do Prato</Label>
                <Input
                  id="instagram"
                  placeholder="Ex: @prato_especial"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  disabled={creating}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  Instagram específico para divulgação deste prato (opcional)
                </p>
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
                    preco: "",
                    disponibilidade: "",
                    instagram: ""
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
                    Criar Receita
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Banner de Sigilo */}
      {sigiloAtivo && (
        <SigiloBanner 
          title="Médias e notas bloqueadas"
          description="As médias e notas das receitas estão protegidas pelo sigilo e serão liberadas após a premiação."
        />
      )}

      {/* Cards de Estatísticas */}
      {stats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title="Total de Receitas"
              value={formatNumber(stats.totalPratos)}
              icon={UtensilsCrossed}
            />
            <DashboardCard
              title="Receitas Ativas"
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
              value={sigiloAtivo ? '🔒 ***' : formatRating(stats.mediaGeral)}
              icon={sigiloAtivo ? Lock : Star}
            />
          </div>

          {/* Receitas por Categoria */}
          {stats.receitasPorCategoria && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg tracking-tight">Receitas por Categoria</CardTitle>
                <CardDescription>Distribuição das receitas cadastradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-7">
                  {stats.receitasPorCategoria.map((cat) => (
                    <div 
                      key={cat.id} 
                      className="flex flex-col items-center p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setCategoriaFilter(cat.id.toString())}
                    >
                      <span className="text-2xl mb-1">{cat.icon}</span>
                      <span className="text-xs text-muted-foreground text-center">{cat.name}</span>
                      <span className="text-lg font-bold mt-1">{cat.quantidade}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
          <CardDescription>
            {filteredPratos.length} receita(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar receita..."
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
            {/* Filtro de estabelecimento - oculto para restaurantes */}
            {!isRestaurante && (
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
            )}
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  {!isRestaurante && <TableHead>Estabelecimento</TableHead>}
                  <TableHead>Votos</TableHead>
                  <TableHead>Média</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPratos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isRestaurante ? 6 : 7} className="p-0">
                      <EmptyState 
                        icon={UtensilsCrossed}
                        title="Nenhuma receita encontrada"
                        description={isRestaurante ? "Você ainda não tem receitas cadastradas." : "Tente ajustar os filtros ou criar uma nova receita."}
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
                      {!isRestaurante && <TableCell>{getEstabelecimentoName(prato.estabelecimentoId)}</TableCell>}
                      <TableCell>{formatNumber(prato.totalVotos)}</TableCell>
                      <TableCell>
                        {sigiloAtivo ? (
                          <SigiloValue />
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
                          {permissions.canEdit('pratos') && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(prato)}
                                  disabled={loading}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Editar receita</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {permissions.canUploadPhoto('pratos') && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUploadPhoto(prato)}
                                  disabled={loading}
                                  className="h-8 w-8 text-purple-600 hover:text-purple-700"
                                >
                                  <Camera className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Fazer upload de foto</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
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

      {/* Modal de Upload de Foto */}
      <PhotoUploadModal 
        open={photoModalOpen}
        onOpenChange={setPhotoModalOpen}
        receita={selectedReceita}
      />
    </div>
  )
}
