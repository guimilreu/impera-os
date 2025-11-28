"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Award, TrendingUp, Lock, Vote, Star, Search, MapPin, Calendar, Eye } from "lucide-react"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { Pagination } from "@/components/dashboard/Pagination"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatRating, formatDateTime } from "@/lib/utils/format"
import { getRankingPorCategoria, getProjecaoVotos } from "@/lib/mock/stats"
import { getVotosValidos, getVotosValidosByEstabelecimento } from "@/lib/mock/votos"
import { categorias } from "@/lib/mock/categorias"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function AvaliacaoPage() {
  const [loading, setLoading] = useState(true)
  const [rankingPorCategoria, setRankingPorCategoria] = useState([])
  const [projecao, setProjecao] = useState(null)
  const [totalVotosValidos, setTotalVotosValidos] = useState(0)
  const [votosValidos, setVotosValidos] = useState([])
  const [filteredVotos, setFilteredVotos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [activeTab, setActiveTab] = useState("ranking")

  const { city, edition } = useTenantStore()
  const { premiacaoEncerrada, role, estabelecimentoId } = useAuthStore()
  
  // Verifica se é restaurante
  const isRestaurante = role === 'estabelecimento'
  
  // Para estabelecimento, a avaliação é desativada até a premiação
  const avaliacaoDesativada = isRestaurante && !premiacaoEncerrada

  useEffect(() => {
    loadData()
  }, [city, edition])

  useEffect(() => {
    filterVotos()
  }, [searchTerm, categoriaFilter, votosValidos])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      
      const ranking = getRankingPorCategoria(city?.id, edition?.id)
      const projecaoData = getProjecaoVotos(city?.id, edition?.id)
      
      // Se for restaurante, filtra apenas os votos do próprio estabelecimento
      let votos
      if (isRestaurante && estabelecimentoId) {
        votos = getVotosValidosByEstabelecimento(estabelecimentoId, city?.id, edition?.id)
      } else {
        votos = getVotosValidos(city?.id, edition?.id)
      }
      
      setRankingPorCategoria(ranking)
      setProjecao(projecaoData)
      
      // Se for restaurante, conta apenas os votos do próprio estabelecimento
      if (isRestaurante && estabelecimentoId) {
        setTotalVotosValidos(votos.length)
      } else {
        setTotalVotosValidos(projecaoData.votosAtuais)
      }
      
      setVotosValidos(votos)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Não foi possível carregar os dados de avaliação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function filterVotos() {
    let filtered = [...votosValidos]
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(v => 
        v.pratoNome?.toLowerCase().includes(search) ||
        v.estabelecimentoNome?.toLowerCase().includes(search) ||
        v.clienteNome?.toLowerCase().includes(search)
      )
    }
    
    if (categoriaFilter !== "all") {
      filtered = filtered.filter(v => v.categoriaId === parseInt(categoriaFilter))
    }
    
    setFilteredVotos(filtered)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredVotos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVotos = filteredVotos.slice(startIndex, endIndex)

  if (loading) {
    return <DashboardSkeleton />
  }

  // Se avaliação desativada, mostra versão "cinza" com dados zerados
  if (avaliacaoDesativada) {
    return (
      <div className="space-y-6">
        <Breadcrumb />
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-muted-foreground">Avaliação</h1>
          <p className="text-muted-foreground mt-1">
            Classificação final em tempo real - apenas votos válidos
          </p>
        </div>

        {/* Aviso de bloqueio */}
        <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <Lock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-700 dark:text-yellow-500">
                  Avaliações bloqueadas até a premiação
                </h3>
                <p className="text-sm text-yellow-600 dark:text-yellow-600">
                  Os resultados e rankings serão liberados após o encerramento do circuito gastronômico.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BIG-NUMBERS (desativados) */}
        <div className="grid gap-4 md:grid-cols-2 opacity-50">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Votos Totais do Restaurante</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">---</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Média Final Geral</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">---</div>
            </CardContent>
          </Card>
        </div>

        {/* Categorias (desativadas) */}
        <div className="space-y-4 opacity-50">
          <h3 className="text-lg font-semibold text-muted-foreground">Votos por Prato/Categoria</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {categorias.slice(0, 4).map((cat) => (
              <Card key={cat.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl grayscale">{cat.icon}</span>
                    <div>
                      <p className="font-medium text-muted-foreground">{cat.name}</p>
                      <p className="text-xl font-bold text-muted-foreground">--- votos</p>
                      <p className="text-sm text-muted-foreground">Média: ---</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lista de votos (desativada) */}
        <Card className="opacity-50">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Histórico de Votos</CardTitle>
            <CardDescription>Lista de todos os votos recebidos pelo estabelecimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Os votos detalhados serão exibidos após a premiação</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Avaliação</h1>
        <p className="text-muted-foreground mt-1">
          Classificação final em tempo real - apenas votos válidos
        </p>
      </div>

      {/* BIG-NUMBERS */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Número de Votos Totais"
          value={formatNumber(totalVotosValidos)}
          icon={Award}
        />
        <DashboardCard
          title="Projeção de Votos até o Final do Circuito"
          value={formatNumber(projecao?.projecao || 0)}
          change={`Média diária: ${projecao?.mediaDiaria || 0}`}
          icon={TrendingUp}
        />
      </div>

      {/* Tabs: Ranking e Lista de Votos */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="ranking">Ranking por Categoria</TabsTrigger>
          <TabsTrigger value="votos">Lista de Votos Válidos</TabsTrigger>
        </TabsList>

        {/* Tab: Ranking por Categoria */}
        <TabsContent value="ranking" className="space-y-6">
          {rankingPorCategoria.map((categoriaData) => (
            <Card key={categoriaData.categoria.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 tracking-tight">
                  <span className="text-2xl">{categoriaData.categoria.icon}</span>
                  <span>{categoriaData.categoria.name}</span>
                </CardTitle>
                <CardDescription>
                  Classificação por nota final (média dos 3 critérios)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoriaData.ranking.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum restaurante com votos válidos nesta categoria
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Colocação</TableHead>
                          <TableHead>Nome do Restaurante</TableHead>
                          <TableHead className="text-right">Quantidade de Votos</TableHead>
                          <TableHead className="text-right">Nota Final</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoriaData.ranking.map((item) => {
                          const isClassificado = item.colocacao <= 5
                          
                          return (
                            <TableRow
                              key={item.estabelecimentoId}
                              className={cn(
                                "transition-colors",
                                isClassificado
                                  ? "bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30"
                                  : "hover:bg-muted/50"
                              )}
                            >
                              <TableCell>
                                <Badge
                                  variant={isClassificado ? "default" : "outline"}
                                  className={cn(
                                    isClassificado && "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  )}
                                >
                                  {item.colocacao}º
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {item.estabelecimentoNome}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatNumber(item.quantidadeVotos)}
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="font-semibold">
                                  {formatRating(item.notaFinal)}
                                </span>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {categoriaData.ranking.length > 0 && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded bg-emerald-600"></span>
                      Primeiros 5 classificados para a próxima fase
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab: Lista de Votos Válidos */}
        <TabsContent value="votos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Votos Válidos</CardTitle>
              <CardDescription>
                {filteredVotos.length} voto(s) válido(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Buscar por prato, estabelecimento ou cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categorias.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.icon} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tabela de Votos */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Foto</TableHead>
                      <TableHead>Prato / Estabelecimento</TableHead>
                      <TableHead className="text-center">Apresentação</TableHead>
                      <TableHead className="text-center">Sabor</TableHead>
                      <TableHead className="text-center">Experiência</TableHead>
                      <TableHead className="text-center">Nota Final</TableHead>
                      <TableHead>Localização</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedVotos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8}>
                          <EmptyState
                            icon={Vote}
                            title="Nenhum voto encontrado"
                            description="Tente ajustar os filtros de busca"
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedVotos.map((voto) => (
                        <TableRow key={voto.id} className="hover:bg-muted/50">
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {formatDateTime(voto.dataVoto)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={voto.foto || '/prato.jpg'} />
                              <AvatarFallback>📷</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{voto.pratoNome}</p>
                              <p className="text-sm text-muted-foreground">{voto.estabelecimentoNome}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{formatRating(voto.apresentacao)}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{formatRating(voto.sabor)}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{formatRating(voto.experiencia)}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-emerald-600 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              {formatRating(voto.notaFinal)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {voto.gps?.valido ? (
                              <div className="flex items-center gap-1 text-sm text-green-600">
                                <MapPin className="h-3 w-3" />
                                Válido
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                -
                              </div>
                            )}
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
                totalItems={filteredVotos.length}
                itemsPerPage={itemsPerPage}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={setCurrentPage}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

