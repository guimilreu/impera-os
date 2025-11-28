"use client"

import { useState, useEffect } from "react"
import { 
  Vote, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Building2, 
  UtensilsCrossed,
  Star,
  Users,
  Clock,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardChart } from "@/components/dashboard/DashboardChart"
import { DashboardTable } from "@/components/dashboard/DashboardTable"
import { StatusBadge } from "@/components/dashboard/StatusBadge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/lib/state/useDashboardStore"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatPercent, formatDateTime, formatRating, formatCurrency } from "@/lib/utils/format"
import {
  getDashboardStats,
  getVotosPorDia,
  getDestaquesEdicao,
} from "@/lib/mock/stats"
import { getTopEstabelecimentos } from "@/lib/mock/estabelecimentos"
import { getTopPratos } from "@/lib/mock/pratos"
import { generateEstabelecimentosFotografo, generateReceitasParaFoto, filterReceitasByStatus, filterEstabelecimentosByStatus } from "@/lib/mock/fotografo"
import { CircuitTimeline } from "@/components/dashboard/CircuitTimeline"
import { TaskProgressBar } from "@/components/dashboard/TaskProgressBar"
import { getTreinamentos } from "@/lib/mock/treinamentos"
import { getRecados, createRecado, tiposRecado } from "@/lib/mock/recados"
import { getVendasConvites, getResumoVendasCidade } from "@/lib/mock/vendas"
import { toast } from "sonner"
import Link from "next/link"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [votosPorDia, setVotosPorDia] = useState([])
  const [topPratos, setTopPratos] = useState([])
  const [topEstabelecimentos, setTopEstabelecimentos] = useState([])
  const [destaques, setDestaques] = useState(null)
  
  // Estados para fotógrafo
  const [estabelecimentosFotografo, setEstabelecimentosFotografo] = useState([])
  const [receitasFotografo, setReceitasFotografo] = useState([])
  const [searchEstabelecimento, setSearchEstabelecimento] = useState("")
  const [searchReceita, setSearchReceita] = useState("")
  const [filterEstabelecimentoStatus, setFilterEstabelecimentoStatus] = useState("todos")
  const [filterReceitaStatus, setFilterReceitaStatus] = useState("todas")

  // Estados para Sócio Local
  const [treinamentos, setTreinamentos] = useState([])
  const [recados, setRecados] = useState([])
  const [vendasConvites, setVendasConvites] = useState(null)
  const [vendasCidade, setVendasCidade] = useState(null)
  const [checklistProgress, setChecklistProgress] = useState({ total: 12, completed: 5 }) // Mock
  const [novoRecado, setNovoRecado] = useState({ titulo: '', mensagem: '', tipo: 'info' })

  const { city, edition, loading: tenantLoading } = useTenantStore()
  const { sigiloAtivo, role } = useAuthStore()

  useEffect(() => {
    if (tenantLoading) {
      setLoading(true)
    } else {
      loadData()
    }
  }, [city, edition, tenantLoading])

  async function loadData() {
    setLoading(true)
    
    try {
      await delay(DEFAULT_DELAY)

      // Se for fotógrafo, carrega dados específicos
      if (role === 'fotografo') {
        const estabelecimentosData = generateEstabelecimentosFotografo()
        setEstabelecimentosFotografo(estabelecimentosData)

        const receitasData = generateReceitasParaFoto()
        setReceitasFotografo(receitasData)
      } else if (role === 'socio_local') {
        // Carrega dados do Sócio Local
        const cityId = city?.id === 'all' || !city?.id ? null : city.id
        const editionId = edition?.id === 'all' || !edition?.id ? null : edition.id

        setStats(getDashboardStats(cityId, editionId))
        setTreinamentos(getTreinamentos().slice(0, 3)) // Últimos 3
        setRecados(getRecados())
        setVendasConvites(getVendasConvites(cityId, editionId))
        setVendasCidade(getResumoVendasCidade(cityId, editionId))
      } else {
        // Converte 'all' para null para indicar "todas as cidades/edições"
        const cityId = city?.id === 'all' || !city?.id ? null : city.id
        const editionId = edition?.id === 'all' || !edition?.id ? null : edition.id

        setStats(getDashboardStats(cityId, editionId))
        setVotosPorDia(getVotosPorDia(cityId, editionId))
        setTopEstabelecimentos(getTopEstabelecimentos(10, cityId, editionId))
        setTopPratos(getTopPratos(10, null, cityId, editionId))
        setDestaques(getDestaquesEdicao(cityId, editionId))
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  // Dashboard do Fotógrafo
  if (role === 'fotografo') {
    const filteredEstabelecimentos = estabelecimentosFotografo.filter(e => {
      const matchesStatus = filterEstabelecimentosByStatus([e], filterEstabelecimentoStatus).length > 0
      const matchesSearch = e.nome.toLowerCase().includes(searchEstabelecimento.toLowerCase()) ||
                           e.endereco.toLowerCase().includes(searchEstabelecimento.toLowerCase())
      return matchesStatus && matchesSearch
    })

    const filteredReceitas = receitasFotografo.filter(r => {
      const matchesStatus = filterReceitasByStatus([r], filterReceitaStatus).length > 0
      const matchesSearch = r.nome.toLowerCase().includes(searchReceita.toLowerCase()) ||
                         r.estabelecimentoNome.toLowerCase().includes(searchReceita.toLowerCase())
      return matchesStatus && matchesSearch
    })

    const getStatusBadge = (status) => {
      const variants = {
        agendado: { variant: 'default', label: 'Agendado', icon: Calendar },
        pendente: { variant: 'secondary', label: 'Pendente', icon: AlertCircle },
        confirmado: { variant: 'default', label: 'Confirmado', icon: CheckCircle2 },
      }
      return variants[status] || variants.pendente
    }

    const getFotoStatusBadge = (status) => {
      const variants = {
        pendente: { variant: 'destructive', label: 'Foto Pendente', icon: XCircle },
        enviada: { variant: 'secondary', label: 'Foto Enviada', icon: Clock },
        aprovada: { variant: 'default', label: 'Foto Aprovada', icon: CheckCircle2 },
      }
      return variants[status] || variants.pendente
    }

    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Fotógrafo</h1>
          <p className="text-muted-foreground mt-1">Gerencie estabelecimentos e receitas para fotografia</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estabelecimentos Agendados</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(estabelecimentosFotografo.filter(e => e.status === 'agendado').length)}</div>
              <p className="text-xs text-muted-foreground">Com horário marcado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas sem Foto</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(receitasFotografo.filter(r => r.fotoStatus === 'pendente').length)}</div>
              <p className="text-xs text-muted-foreground">Aguardando fotografia</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fotos Aprovadas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(receitasFotografo.filter(r => r.fotoStatus === 'aprovada').length)}</div>
              <p className="text-xs text-muted-foreground">Fotos já aprovadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="estabelecimentos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="estabelecimentos">Estabelecimentos</TabsTrigger>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
          </TabsList>

          {/* Tab Estabelecimentos */}
          <TabsContent value="estabelecimentos">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="tracking-tight">Estabelecimentos para Fotografia</CardTitle>
                    <CardDescription>{filteredEstabelecimentos.length} estabelecimento(s) encontrado(s)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar estabelecimento..."
                      value={searchEstabelecimento}
                      onChange={(e) => setSearchEstabelecimento(e.target.value)}
                      className="w-64"
                    />
                    <Select value={filterEstabelecimentoStatus} onValueChange={setFilterEstabelecimentoStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="agendado">Agendado</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredEstabelecimentos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum estabelecimento encontrado
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estabelecimento</TableHead>
                          <TableHead>Contato</TableHead>
                          <TableHead>Horário Agendado</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEstabelecimentos.map((estabelecimento) => {
                          const statusBadge = getStatusBadge(estabelecimento.status)
                          const StatusIcon = statusBadge.icon
                          return (
                            <TableRow key={estabelecimento.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{estabelecimento.nome}</p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {estabelecimento.endereco}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    {estabelecimento.telefone}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    {estabelecimento.email}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {formatDateTime(estabelecimento.horarioAgendado)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={statusBadge.variant}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusBadge.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Ver Detalhes
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Receitas */}
          <TabsContent value="receitas">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="tracking-tight">Receitas para Fotografia</CardTitle>
                    <CardDescription>{filteredReceitas.length} receita(s) encontrada(s)</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buscar receita..."
                      value={searchReceita}
                      onChange={(e) => setSearchReceita(e.target.value)}
                      className="w-64"
                    />
                    <Select value={filterReceitaStatus} onValueChange={setFilterReceitaStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="pendente">Foto Pendente</SelectItem>
                        <SelectItem value="enviada">Foto Enviada</SelectItem>
                        <SelectItem value="aprovada">Foto Aprovada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredReceitas.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma receita encontrada
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredReceitas.map((receita) => {
                      const fotoStatusBadge = getFotoStatusBadge(receita.fotoStatus)
                      const StatusIcon = fotoStatusBadge.icon
                      return (
                        <Card key={receita.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{receita.nome}</CardTitle>
                                <CardDescription className="mt-1">{receita.estabelecimentoNome}</CardDescription>
                              </div>
                              <Badge variant={fotoStatusBadge.variant}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {fotoStatusBadge.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {receita.foto ? (
                              <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                <img
                                  src={receita.foto}
                                  alt={receita.nome}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/20">
                                <div className="text-center">
                                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground">Foto pendente</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {receita.descricao}
                              </p>
                              <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-sm font-semibold">
                                  {formatCurrency(receita.preco)}
                                </span>
                                <Badge variant={receita.disponivel ? 'default' : 'secondary'}>
                                  {receita.disponivel ? 'Disponível' : 'Indisponível'}
                                </Badge>
                              </div>
                            </div>

                            {receita.observacoesRestaurante && (
                              <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">
                                  <strong>Observações:</strong> {receita.observacoesRestaurante}
                                </p>
                              </div>
                            )}

                            <div className="pt-2 border-t">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => {
                                  const input = document.createElement('input')
                                  input.type = 'file'
                                  input.accept = 'image/*'
                                  input.onchange = async (e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      toast.success(`Foto de "${receita.nome}" enviada com sucesso! Aguardando aprovação.`)
                                      // Aqui na API real, faria o upload da foto
                                    }
                                  }
                                  input.click()
                                }}
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                {receita.foto ? 'Atualizar Foto' : 'Adicionar Foto'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Dashboard do Sócio Local (Franqueado)
  if (role === 'socio_local') {
    const handleEnviarRecado = () => {
      if (!novoRecado.titulo || !novoRecado.mensagem) {
        toast.error('Preencha título e mensagem')
        return
      }
      createRecado(novoRecado)
      setRecados(getRecados())
      setNovoRecado({ titulo: '', mensagem: '', tipo: 'info' })
      toast.success('Recado enviado para todos os restaurantes!')
    }

    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Sócio Local</h1>
          <p className="text-muted-foreground mt-1">Gestão da sua cidade e edição</p>
        </div>

        {/* Timeline do Circuito */}
        <Card>
          <CardHeader>
            <CardTitle className="tracking-tight">Timeline do Circuito</CardTitle>
            <CardDescription>Acompanhe em tempo real a fase atual do circuito gastronômico</CardDescription>
          </CardHeader>
          <CardContent>
            <CircuitTimeline />
          </CardContent>
        </Card>

        {/* Barra de Progresso + BIG-NUMBERS */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="tracking-tight text-base">Progresso das Tarefas</CardTitle>
              <CardDescription>Vinculado ao seu checklist</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskProgressBar 
                total={checklistProgress.total} 
                completed={checklistProgress.completed} 
              />
              <Link href="/dashboard/checklists">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  Ver Checklist Completo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restaurantes Cadastrados</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats?.totalEstabelecimentos || 0)}</div>
              <p className="text-xs text-muted-foreground">Na sua cidade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Cadastradas</CardTitle>
              <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats?.totalPratos || 0)}</div>
              <p className="text-xs text-muted-foreground">Participando do circuito</p>
            </CardContent>
          </Card>
        </div>

        {/* Vídeos de Treinamento */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="tracking-tight">Treinamentos</CardTitle>
                <CardDescription>Vídeos e materiais de capacitação</CardDescription>
              </div>
              <Link href="/dashboard/treinamentos">
                <Button variant="outline" size="sm">Ver Todos</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {treinamentos.map((treinamento) => (
                <div key={treinamento.id} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-lg bg-muted overflow-hidden mb-2">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/40 transition-colors">
                      {treinamento.tipo === 'video' ? (
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-800 border-b-8 border-b-transparent ml-1" />
                        </div>
                      ) : (
                        <div className="text-4xl">📄</div>
                      )}
                    </div>
                    {treinamento.tipo === 'video' && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {treinamento.duracao}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-sm line-clamp-1">{treinamento.titulo}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{treinamento.descricao}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendas de Convites */}
        {vendasConvites && (
          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">Vendas de Convites</CardTitle>
              <CardDescription>Acompanhe as vendas para o evento de premiação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4 mb-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{vendasConvites.vendidos}</p>
                  <p className="text-xs text-muted-foreground">Vendidos</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{vendasConvites.reservados}</p>
                  <p className="text-xs text-muted-foreground">Reservados</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{vendasConvites.disponiveis}</p>
                  <p className="text-xs text-muted-foreground">Disponíveis</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold">{formatCurrency(vendasConvites.faturamentoAtual)}</p>
                  <p className="text-xs text-muted-foreground">Faturamento</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Meta: {vendasConvites.metaVendas} convites</span>
                  <span className="font-semibold">{vendasConvites.porcentagemMeta}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${vendasConvites.porcentagemMeta}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recados para Restaurantes */}
        <Card>
          <CardHeader>
            <CardTitle className="tracking-tight">Recados para Restaurantes</CardTitle>
            <CardDescription>Envie comunicados para todos os estabelecimentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Formulário de novo recado */}
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <h4 className="font-medium text-sm">Novo Recado</h4>
              <Input
                placeholder="Título do recado"
                value={novoRecado.titulo}
                onChange={(e) => setNovoRecado(prev => ({ ...prev, titulo: e.target.value }))}
              />
              <textarea
                placeholder="Mensagem..."
                value={novoRecado.mensagem}
                onChange={(e) => setNovoRecado(prev => ({ ...prev, mensagem: e.target.value }))}
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border bg-background resize-none"
              />
              <div className="flex items-center justify-between">
                <Select 
                  value={novoRecado.tipo} 
                  onValueChange={(v) => setNovoRecado(prev => ({ ...prev, tipo: v }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposRecado.map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.icon} {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleEnviarRecado}>
                  Enviar Recado
                </Button>
              </div>
            </div>

            {/* Lista de recados enviados */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recados Enviados</h4>
              {recados.slice(0, 3).map((recado) => {
                const tipo = tiposRecado.find(t => t.id === recado.tipo)
                return (
                  <div key={recado.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span>{tipo?.icon}</span>
                        <span className="font-medium text-sm">{recado.titulo}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {recado.lido}/{recado.total} leram
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{recado.mensagem}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enviado em {formatDateTime(recado.dataEnvio)}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Vendas de Pratos (após circuito) */}
        {vendasCidade && (
          <Card>
            <CardHeader>
              <CardTitle className="tracking-tight">Resumo de Vendas do Circuito</CardTitle>
              <CardDescription>Vendas de pratos durante o período do circuito</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-3xl font-bold text-emerald-600">{formatNumber(vendasCidade.totalPratosVendidos)}</p>
                  <p className="text-sm text-muted-foreground">Pratos Vendidos</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(vendasCidade.faturamentoTotal)}</p>
                  <p className="text-sm text-muted-foreground">Faturamento Total</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(vendasCidade.ticketMedio)}</p>
                  <p className="text-sm text-muted-foreground">Ticket Médio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Dashboard do Estabelecimento (Restaurante)
  if (role === 'estabelecimento') {
    const { premiacaoEncerrada, estabelecimentoId } = useAuthStore.getState()
    
    // Mock de dados do estabelecimento
    const dadosEstabelecimento = {
      totalVotos: 127,
      mediaGeral: 4.2,
      votosCategoria: 45,
      posicaoCategoria: 3,
      pratos: [
        { id: 1, nome: 'Risotto de Camarão', votos: 52, media: 4.5 },
        { id: 2, nome: 'Filé ao Molho', votos: 45, media: 4.1 },
        { id: 3, nome: 'Sobremesa Especial', votos: 30, media: 3.9 },
      ],
      recadosNaoLidos: 2,
    }

    // Mock de recados da organização
    const recadosOrganizacao = [
      {
        id: 1,
        titulo: 'Lembrete: Sessão de Fotos',
        mensagem: 'Não esqueça de confirmar o horário da sessão de fotos do seu prato.',
        data: new Date(2025, 4, 20).toISOString(),
        lido: false,
      },
      {
        id: 2,
        titulo: 'Atualização do Regulamento',
        mensagem: 'O regulamento foi atualizado. Confira as mudanças.',
        data: new Date(2025, 4, 18).toISOString(),
        lido: true,
      },
    ]

    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard do Restaurante</h1>
          <p className="text-muted-foreground mt-1">Acompanhe o desempenho do seu estabelecimento</p>
        </div>

        {/* Timeline do Circuito */}
        <Card>
          <CardHeader>
            <CardTitle className="tracking-tight">Timeline do Circuito</CardTitle>
            <CardDescription>Acompanhe em tempo real a fase atual do circuito gastronômico</CardDescription>
          </CardHeader>
          <CardContent>
            <CircuitTimeline showPatrocinadores={false} />
          </CardContent>
        </Card>

        {/* Big Numbers - Desativados até premiação */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className={!premiacaoEncerrada ? 'opacity-50 grayscale' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Votos</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {premiacaoEncerrada ? formatNumber(dadosEstabelecimento.totalVotos) : '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                {premiacaoEncerrada ? 'Votos recebidos no circuito' : 'Disponível após premiação'}
              </p>
            </CardContent>
          </Card>

          <Card className={!premiacaoEncerrada ? 'opacity-50 grayscale' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {premiacaoEncerrada ? formatRating(dadosEstabelecimento.mediaGeral) : '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                {premiacaoEncerrada ? 'Nota de 0 a 5' : 'Disponível após premiação'}
              </p>
            </CardContent>
          </Card>

          <Card className={!premiacaoEncerrada ? 'opacity-50 grayscale' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posição na Categoria</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {premiacaoEncerrada ? `${dadosEstabelecimento.posicaoCategoria}º` : '---'}
              </div>
              <p className="text-xs text-muted-foreground">
                {premiacaoEncerrada ? `${dadosEstabelecimento.votosCategoria} votos na categoria` : 'Disponível após premiação'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Aviso de dados bloqueados */}
        {!premiacaoEncerrada && (
          <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardContent className="flex items-center gap-4 py-4">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Dados bloqueados até a premiação</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Os resultados de votação serão liberados após o encerramento do circuito e a cerimônia de premiação.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Desempenho por Prato - Desativado até premiação */}
        <Card className={!premiacaoEncerrada ? 'opacity-50 grayscale pointer-events-none' : ''}>
          <CardHeader>
            <CardTitle className="tracking-tight">Desempenho por Prato</CardTitle>
            <CardDescription>
              {premiacaoEncerrada ? 'Votos e média de cada prato' : 'Disponível após premiação'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {premiacaoEncerrada ? (
              <div className="space-y-4">
                {dadosEstabelecimento.pratos.map((prato, idx) => (
                  <div key={prato.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold">
                        {idx + 1}º
                      </div>
                      <div>
                        <p className="font-medium">{prato.nome}</p>
                        <p className="text-sm text-muted-foreground">{prato.votos} votos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{formatRating(prato.media)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Vote className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Os dados de votação serão exibidos aqui após a premiação</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atalhos Rápidos */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/gestao/recados">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Recados da Organização</h4>
                  <p className="text-sm text-muted-foreground">
                    {dadosEstabelecimento.recadosNaoLidos} não lido(s)
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/gestao/convites">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Comprar Convites</h4>
                  <p className="text-sm text-muted-foreground">Para a premiação</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/gestao/vendas">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Registrar Vendas</h4>
                  <p className="text-sm text-muted-foreground">Quantidade vendida dos pratos</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recados da Organização */}
        <Card>
          <CardHeader>
            <CardTitle className="tracking-tight">Recados da Organização</CardTitle>
            <CardDescription>Comunicados importantes do circuito</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recadosOrganizacao.map((recado) => (
                <div 
                  key={recado.id} 
                  className={`p-4 rounded-lg border ${!recado.lido ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {!recado.lido && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      <h4 className="font-medium">{recado.titulo}</h4>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(recado.data)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{recado.mensagem}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard padrão (admin)
  if (!stats) {
    return <div>Erro ao carregar dados</div>
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      {/* Cards de Indicadores (BIG-NUMBERS) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <DashboardCard
          title="Clientes Cadastrados"
          value={formatNumber(stats.clientesCadastrados)}
          icon={Users}
        />
        <DashboardCard
          title="Avaliações Totais"
          value={formatNumber(stats.avaliacoesTotais)}
          icon={CheckCircle2}
        />
        <DashboardCard
          title="Votos Pendentes"
          value={formatNumber(stats.votosPendentes)}
          icon={Clock}
        />
        <DashboardCard
          title="Estabelecimentos Cadastrados"
          value={formatNumber(stats.totalEstabelecimentos)}
          icon={Building2}
        />
        <DashboardCard
          title="Receitas Cadastradas"
          value={formatNumber(stats.totalPratos)}
          icon={UtensilsCrossed}
        />
      </div>

      {/* Gráfico: Votos por Dia */}
      <DashboardChart
        title="Votos por Dia"
        description="Últimos 7 dias"
        type="line"
        data={votosPorDia}
        dataKey="votos"
        nameKey="data"
      />

      {/* Tabelas: Top Pratos e Top Estabelecimentos */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardTable
          title="Top Pratos"
          description="Pratos mais avaliados"
          columns={[
            { key: 'posicao', label: 'Posição' },
            { key: 'nome', label: 'Nome' },
            { key: 'categoria', label: 'Categoria' },
            { key: 'votos', label: 'Votos' },
            { key: 'media', label: 'Média' },
          ]}
          data={topPratos.map((prato, idx) => ({
            posicao: idx + 1,
            nome: prato.name,
            categoria: prato.categoria?.name || 'N/A',
            votos: formatNumber(prato.totalVotos),
            media: sigiloAtivo ? '***' : formatRating(prato.mediaNota),
          }))}
        />

        <DashboardTable
          title="Top Estabelecimentos"
          description="Estabelecimentos mais votados"
          columns={[
            { key: 'posicao', label: 'Posição' },
            { key: 'nome', label: 'Nome' },
            { key: 'votos', label: 'Votos' },
            { key: 'media', label: 'Média' },
          ]}
          data={topEstabelecimentos.map(est => ({
            posicao: est.posicao,
            nome: est.name,
            votos: formatNumber(est.totalVotos),
            media: sigiloAtivo ? '***' : formatRating(est.mediaNota),
          }))}
        />
      </div>

      {/* Destaques da Edição */}
      {destaques && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Categoria Mais Ativa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{destaques.categoriaMaisAtiva.icon}</span>
                <div>
                  <p className="font-semibold">{destaques.categoriaMaisAtiva.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(destaques.categoriaMaisAtiva.votos)} votos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estabelecimento Mais Votado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{destaques.estabelecimentoMaisVotado.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(destaques.estabelecimentoMaisVotado.totalVotos)} votos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Crescimento Diário</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {formatPercent(destaques.crescimentoDiario)}
              </p>
              <p className="text-sm text-muted-foreground">em relação ao dia anterior</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ranking Parcial com Sigilo */}
      {sigiloAtivo && (
        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle>Ranking Parcial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-lg font-semibold text-yellow-600">
                  🔒 Bloqueado até a premiação
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  O ranking será liberado após o encerramento da premiação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

