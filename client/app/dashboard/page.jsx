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
import { useDashboardStore } from "@/lib/state/useDashboardStore"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatPercent, formatDateTime, formatRating } from "@/lib/utils/format"
import {
  getDashboardStats,
  getVotosPorDia,
  getDistribuicaoCategorias,
  getTopPratosAvaliados,
  getVotosValidosVsInvalidos,
  getStatusGPS,
  getDestaquesEdicao,
} from "@/lib/mock/stats"
import { getUltimosVotos } from "@/lib/mock/votos"
import { getTopEstabelecimentos } from "@/lib/mock/estabelecimentos"
import { getTopPratos } from "@/lib/mock/pratos"
import { getAlertas } from "@/lib/mock/alertas"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [votosPorDia, setVotosPorDia] = useState([])
  const [distribuicaoCategorias, setDistribuicaoCategorias] = useState([])
  const [topPratos, setTopPratos] = useState([])
  const [votosValidosVsInvalidos, setVotosValidosVsInvalidos] = useState([])
  const [statusGPS, setStatusGPS] = useState([])
  const [ultimosVotos, setUltimosVotos] = useState([])
  const [topEstabelecimentos, setTopEstabelecimentos] = useState([])
  const [topPratosAvaliados, setTopPratosAvaliados] = useState([])
  const [alertas, setAlertas] = useState([])
  const [destaques, setDestaques] = useState(null)

  const { city, edition, loading: tenantLoading } = useTenantStore()
  const { sigiloAtivo } = useAuthStore()

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

      const cityId = city?.id || null
      const editionId = edition?.id || null

      setStats(getDashboardStats(cityId, editionId))
      setVotosPorDia(getVotosPorDia(cityId, editionId))
      setDistribuicaoCategorias(getDistribuicaoCategorias(cityId, editionId))
      setTopPratosAvaliados(getTopPratosAvaliados(5))
      setVotosValidosVsInvalidos(getVotosValidosVsInvalidos(cityId, editionId))
      setStatusGPS(getStatusGPS(cityId, editionId))
      setUltimosVotos(getUltimosVotos(10, cityId, editionId))
      setTopEstabelecimentos(getTopEstabelecimentos(10, cityId, editionId))
      setTopPratos(getTopPratos(10, null, cityId, editionId))
      setAlertas(getAlertas())
      setDestaques(getDestaquesEdicao())
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!stats) {
    return <div>Erro ao carregar dados</div>
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      {/* Cards de Indicadores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Votos"
          value={formatNumber(stats.totalVotos)}
          change="+12%"
          icon={Vote}
        />
        <DashboardCard
          title="Votos Válidos"
          value={formatNumber(stats.votosValidos)}
          change="+8%"
          icon={CheckCircle2}
        />
        <DashboardCard
          title="Votos Suspeitos"
          value={formatNumber(stats.votosSuspeitos)}
          change="-5%"
          icon={AlertTriangle}
        />
        <DashboardCard
          title="Taxa de Aprovação"
          value={`${stats.taxaAprovacao}%`}
          change="+2%"
          icon={TrendingUp}
        />
        <DashboardCard
          title="Total de Estabelecimentos"
          value={formatNumber(stats.totalEstabelecimentos)}
          change="+3"
          icon={Building2}
        />
        <DashboardCard
          title="Total de Pratos"
          value={formatNumber(stats.totalPratos)}
          change="+5"
          icon={UtensilsCrossed}
        />
        <DashboardCard
          title="Média Geral de Notas"
          value={formatRating(stats.mediaBayesiana)}
          change="+0.2"
          icon={Star}
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardChart
          title="Votos por Dia"
          description="Últimos 7 dias"
          type="line"
          data={votosPorDia}
          dataKey="votos"
          nameKey="data"
        />
        <DashboardChart
          title="Distribuição de Categorias"
          description="Votos por categoria"
          type="bar"
          data={distribuicaoCategorias}
          dataKey="votos"
          nameKey="categoria"
        />
        <DashboardChart
          title="Top Pratos Mais Avaliados"
          description="Pratos com mais votos"
          type="bar"
          data={topPratosAvaliados}
          dataKey="totalVotos"
          nameKey="name"
        />
        <DashboardChart
          title="Votos Válidos vs Inválidos"
          description="Distribuição de votos"
          type="pie"
          data={votosValidosVsInvalidos}
          height={300}
        />
        <DashboardChart
          title="Status de GPS"
          description="Distribuição de GPS"
          type="pie"
          data={statusGPS}
          height={300}
        />
      </div>

      {/* Alertas */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Alertas e Avisos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {alertas.map((alerta) => (
              <Card key={alerta.id} className={alerta.severidade === 'alta' ? 'border-red-500' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{alerta.titulo}</CardTitle>
                    <Badge variant={alerta.severidade === 'alta' ? 'destructive' : 'secondary'}>
                      {alerta.severidade}
                    </Badge>
                  </div>
                  <CardDescription>{alerta.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Quantidade: {alerta.quantidade} • {formatDateTime(alerta.data)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tabelas */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardTable
          title="Últimos Votos Registrados"
          description="Votos mais recentes"
          columns={[
            { key: 'foto', label: 'Foto' },
            { key: 'prato', label: 'Prato' },
            { key: 'estabelecimento', label: 'Estabelecimento' },
            { key: 'horario', label: 'Horário' },
            { key: 'gps', label: 'GPS' },
            { key: 'status', label: 'Status' },
          ]}
          data={ultimosVotos.map(voto => ({
            foto: (
              <Avatar className="h-8 w-8">
                <AvatarImage src={voto.foto || '/prato.jpg'} alt={voto.pratoNome} />
                <AvatarFallback>{voto.pratoNome.charAt(0)}</AvatarFallback>
              </Avatar>
            ),
            prato: voto.pratoNome,
            estabelecimento: voto.estabelecimentoNome,
            horario: formatDateTime(voto.horario),
            gps: (
              <StatusBadge 
                status={voto.gps?.valido ? 'valido' : 'suspeito'} 
                label={voto.gps?.valido ? 'OK' : 'Inválido'}
              />
            ),
            status: <StatusBadge status={voto.valido ? 'valido' : 'suspeito'} />,
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

      <DashboardTable
        title="Top Pratos"
        description="Pratos mais avaliados"
        columns={[
          { key: 'nome', label: 'Nome' },
          { key: 'categoria', label: 'Categoria' },
          { key: 'votos', label: 'Votos' },
          { key: 'media', label: 'Média' },
        ]}
        data={topPratos.map(prato => ({
          nome: prato.name,
          categoria: prato.categoria?.name || 'N/A',
          votos: formatNumber(prato.totalVotos),
          media: sigiloAtivo ? '***' : formatRating(prato.mediaNota),
        }))}
      />

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

