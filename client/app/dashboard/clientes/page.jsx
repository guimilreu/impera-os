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
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Users, 
  Search, 
  Trophy, 
  Star,
  Award,
  Crown,
  Eye,
  UserCheck,
  UserX,
  MapPin,
  Calendar,
  Vote,
} from "lucide-react"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { DashboardChart } from "@/components/dashboard/DashboardChart"
import { Pagination } from "@/components/dashboard/Pagination"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { 
  generateClientesList, 
  getClientesStats, 
  getTopClientes,
  searchClientes,
  promoverJuradoTecnico,
  removerJuradoTecnico,
  GENEROS,
  FAIXAS_RENDA,
  FAIXAS_IDADE,
  BADGES_DISPONIVEIS,
} from "@/lib/mock/clientes"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ClientesPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [topClientes, setTopClientes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [generoFilter, setGeneroFilter] = useState("all")
  const [idadeFilter, setIdadeFilter] = useState("all")
  const [rendaFilter, setRendaFilter] = useState("all")
  const [juradoFilter, setJuradoFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterClientes()
  }, [searchTerm, generoFilter, idadeFilter, rendaFilter, juradoFilter, clientes])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      const clientesData = generateClientesList()
      const statsData = getClientesStats()
      const topData = getTopClientes(10)
      
      setClientes(clientesData)
      setStats(statsData)
      setTopClientes(topData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  function filterClientes() {
    const filtered = searchClientes({
      search: searchTerm,
      genero: generoFilter,
      idade: idadeFilter,
      renda: rendaFilter,
      juradoTecnico: juradoFilter,
    })
    setFilteredClientes(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedClientes = filteredClientes.slice(startIndex, endIndex)

  function handlePromoverJurado(cliente) {
    if (cliente.juradoTecnico) {
      removerJuradoTecnico(cliente.id)
      toast.success(`${cliente.nome} removido dos jurados técnicos`)
    } else {
      promoverJuradoTecnico(cliente.id)
      toast.success(`${cliente.nome} promovido a jurado técnico!`)
    }
    // Recarrega dados
    loadData()
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie os clientes e jurados do circuito gastronômico
        </p>
      </div>

      {/* BIG-NUMBERS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Cadastros"
          value={formatNumber(stats?.total || 0)}
          icon={Users}
        />
        <DashboardCard
          title="Clientes Ativos"
          value={formatNumber(stats?.ativos || 0)}
          icon={UserCheck}
        />
        <DashboardCard
          title="Jurados Técnicos"
          value={formatNumber(stats?.juradosTecnicos || 0)}
          icon={Crown}
        />
        <DashboardCard
          title="Total de Avaliações"
          value={formatNumber(stats?.totalAvaliacoes || 0)}
          icon={Vote}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="lista">Lista Completa</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          {/* Gráficos de Perfil */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Gênero */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Gênero</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.porGenero?.filter(g => g.quantidade > 0).map((item) => (
                    <div key={item.nome} className="flex items-center justify-between">
                      <span className="text-sm">{item.nome}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(item.quantidade / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{item.quantidade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Idade */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Idade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.porIdade?.filter(i => i.quantidade > 0).map((item) => (
                    <div key={item.faixa} className="flex items-center justify-between">
                      <span className="text-sm">{item.faixa}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(item.quantidade / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{item.quantidade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Renda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Renda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.porRenda?.filter(r => r.quantidade > 0).map((item) => (
                    <div key={item.faixa} className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[100px]" title={item.faixa}>{item.faixa}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(item.quantidade / stats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{item.quantidade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top 10 Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top 10 Clientes
              </CardTitle>
              <CardDescription>Clientes com maior pontuação no ranking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topClientes.map((cliente, idx) => (
                  <div 
                    key={cliente.id}
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50",
                      idx < 3 && "bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                    )}
                    onClick={() => setSelectedCliente(cliente)}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                      idx === 0 && "bg-yellow-500 text-white",
                      idx === 1 && "bg-gray-400 text-white",
                      idx === 2 && "bg-amber-600 text-white",
                      idx > 2 && "bg-muted text-muted-foreground"
                    )}>
                      {idx + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={cliente.foto} />
                      <AvatarFallback>{cliente.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{cliente.nome}</p>
                        {cliente.juradoTecnico && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Jurado Técnico
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cliente.totalAvaliacoes} avaliações
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatNumber(cliente.pontos)}</p>
                      <p className="text-xs text-muted-foreground">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Lista Completa */}
        <TabsContent value="lista" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>{filteredClientes.length} cliente(s) encontrado(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Buscar por nome, email ou CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={generoFilter} onValueChange={setGeneroFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {GENEROS.map(g => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={idadeFilter} onValueChange={setIdadeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Idade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {FAIXAS_IDADE.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={juradoFilter} onValueChange={setJuradoFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Jurados Técnicos</SelectItem>
                    <SelectItem value="false">Clientes Comuns</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tabela */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead className="text-center">Avaliações</TableHead>
                      <TableHead className="text-center">Pontos</TableHead>
                      <TableHead className="text-center">Badges</TableHead>
                      <TableHead className="text-center">Tipo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClientes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <EmptyState
                            icon={Users}
                            title="Nenhum cliente encontrado"
                            description="Tente ajustar os filtros de busca"
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedClientes.map((cliente) => (
                        <TableRow key={cliente.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {cliente.posicaoRanking}º
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={cliente.foto} />
                                <AvatarFallback className="text-xs">{cliente.nome.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{cliente.nome}</p>
                                <p className="text-xs text-muted-foreground">{cliente.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {cliente.localizacao ? (
                              <div className="flex items-center gap-1 text-sm">
                                <MapPin className="h-3 w-3" />
                                {cliente.localizacao}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {cliente.totalAvaliacoes}
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {formatNumber(cliente.pontos)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-0.5">
                              {cliente.badges.slice(0, 3).map((b, idx) => (
                                <span key={idx} title={b.name}>{b.emoji}</span>
                              ))}
                              {cliente.badges.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{cliente.badges.length - 3}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {cliente.juradoTecnico ? (
                              <Badge className="bg-purple-600 text-white">
                                <Crown className="h-3 w-3 mr-1" />
                                Jurado
                              </Badge>
                            ) : (
                              <Badge variant="outline">Cliente</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedCliente(cliente)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-8 w-8",
                                  cliente.juradoTecnico 
                                    ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                                    : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                )}
                                onClick={() => handlePromoverJurado(cliente)}
                                title={cliente.juradoTecnico ? "Remover jurado técnico" : "Promover a jurado técnico"}
                              >
                                {cliente.juradoTecnico ? <UserX className="h-4 w-4" /> : <Crown className="h-4 w-4" />}
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
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredClientes.length}
                itemsPerPage={itemsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Ranking */}
        <TabsContent value="ranking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Ranking Completo
              </CardTitle>
              <CardDescription>Classificação de todos os clientes por pontuação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Posição</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="text-center">Avaliações</TableHead>
                      <TableHead className="text-center">Pontos</TableHead>
                      <TableHead className="text-center">Badges</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientes.slice(0, 50).map((cliente, idx) => (
                      <TableRow 
                        key={cliente.id} 
                        className={cn(
                          "cursor-pointer hover:bg-muted/50",
                          idx < 3 && "bg-gradient-to-r from-yellow-50 to-transparent dark:from-yellow-950/10"
                        )}
                        onClick={() => setSelectedCliente(cliente)}
                      >
                        <TableCell>
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                            idx === 0 && "bg-yellow-500 text-white",
                            idx === 1 && "bg-gray-400 text-white",
                            idx === 2 && "bg-amber-600 text-white",
                            idx > 2 && "bg-muted"
                          )}>
                            {idx + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={cliente.foto} />
                              <AvatarFallback className="text-xs">{cliente.nome.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{cliente.nome}</p>
                                {cliente.juradoTecnico && (
                                  <Crown className="h-4 w-4 text-purple-600" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{cliente.localizacao || 'Sem localização'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{cliente.totalAvaliacoes}</TableCell>
                        <TableCell className="text-center font-bold">{formatNumber(cliente.pontos)}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-0.5">
                            {cliente.badges.map((b, idx) => (
                              <span key={idx} title={b.name}>{b.emoji}</span>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Badges */}
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                Ranking de Badges
              </CardTitle>
              <CardDescription>Badges mais conquistados pelos clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats?.badgesRanking?.map((badge, idx) => (
                  <Card key={badge.code} className={cn(
                    "transition-all hover:shadow-md",
                    idx === 0 && "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{badge.emoji}</div>
                        <div className="flex-1">
                          <p className="font-semibold">{badge.name}</p>
                          <p className="text-xs text-muted-foreground">{badge.description}</p>
                          <p className="text-lg font-bold mt-1">{formatNumber(badge.quantidade)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Cliente */}
      <Dialog open={!!selectedCliente} onOpenChange={() => setSelectedCliente(null)}>
        <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCliente && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedCliente.foto} />
                    <AvatarFallback>{selectedCliente.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      {selectedCliente.nome}
                      {selectedCliente.juradoTecnico && (
                        <Badge className="bg-purple-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Jurado Técnico
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-normal text-muted-foreground">
                      #{selectedCliente.posicaoRanking} no ranking
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Informações Básicas */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Informações</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> {selectedCliente.email}</p>
                      <p><strong>Telefone:</strong> {selectedCliente.telefone}</p>
                      <p><strong>CPF:</strong> {selectedCliente.cpf}</p>
                      <p><strong>Idade:</strong> {selectedCliente.idade || 'Não informado'}</p>
                      <p><strong>Gênero:</strong> {selectedCliente.genero || 'Não informado'}</p>
                      <p><strong>Renda:</strong> {selectedCliente.renda || 'Não informado'}</p>
                      <p><strong>Localização:</strong> {selectedCliente.localizacao || 'Não informado'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase">Estatísticas</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold">{selectedCliente.totalAvaliacoes}</p>
                        <p className="text-xs text-muted-foreground">Avaliações</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold">{formatNumber(selectedCliente.pontos)}</p>
                        <p className="text-xs text-muted-foreground">Pontos</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold">#{selectedCliente.posicaoRanking}</p>
                        <p className="text-xs text-muted-foreground">Ranking</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-2xl font-bold">{selectedCliente.badges.length}</p>
                        <p className="text-xs text-muted-foreground">Badges</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Badges Conquistados</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCliente.badges.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum badge conquistado ainda</p>
                    ) : (
                      selectedCliente.badges.map((badge, idx) => (
                        <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                          <span className="mr-1">{badge.emoji}</span>
                          {badge.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Datas */}
                <div className="flex gap-4 text-sm text-muted-foreground pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Cadastro: {formatDateTime(selectedCliente.dataCadastro)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Última atividade: {formatDateTime(selectedCliente.ultimaAtividade)}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedCliente(null)}>
                  Fechar
                </Button>
                <Button
                  variant={selectedCliente.juradoTecnico ? "destructive" : "default"}
                  onClick={() => {
                    handlePromoverJurado(selectedCliente)
                    setSelectedCliente(null)
                  }}
                >
                  {selectedCliente.juradoTecnico ? (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Remover Jurado Técnico
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4 mr-2" />
                      Promover a Jurado Técnico
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


