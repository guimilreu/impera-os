"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Users, TrendingUp, User, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { generateClienteProfile, generateRanking, generateAvaliacoesHistory } from "@/lib/mock/clientes"
import { toast } from "sonner"
import Link from "next/link"

export default function RankingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [ranking, setRanking] = useState([])
  const [avaliacoesHistory, setAvaliacoesHistory] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)

      // Simula busca de perfil do cliente logado (via token/localStorage)
      const token = localStorage.getItem("token")
      const cpf = localStorage.getItem("cpf") || null
      const phone = localStorage.getItem("phone") || null
      
      // Gera perfil mock baseado no token
      const userId = token ? parseInt(token) || 1 : 1
      const clienteProfile = generateClienteProfile(userId, cpf, phone)
      setProfile(clienteProfile)

      // Gera ranking dos top 10
      const rankingData = generateRanking(10)
      setRanking(rankingData)

      // Gera histórico de avaliações
      const history = generateAvaliacoesHistory(userId, 20)
      setAvaliacoesHistory(history)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados do ranking')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Erro ao carregar perfil</CardTitle>
            <CardDescription>Não foi possível carregar seus dados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/votar')} className="w-full">
              Voltar para votação
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat p-4 md:p-6"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            Ranking de Jurados
          </h1>
          <p className="text-white/90 text-lg">Veja sua posição e compare com outros jurados</p>
        </div>

        {/* Seu Perfil - Card Principal */}
        <Card className="border-2 border-purple-500 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Trophy className="h-6 w-6 text-purple-600" />
              Seu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-purple-500">
                <AvatarImage src={profile.foto || '/avatar-placeholder.png'} alt={profile.nome} />
                <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                  {profile.nome.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{profile.nome}</h3>
                <p className="text-sm text-muted-foreground">Nível {profile.nivel}: {profile.nivelLabel}</p>
                {profile.posicaoRanking && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="default" className="bg-purple-600 text-white">
                      #{profile.posicaoRanking} no Ranking
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <Link href="/ranking/avaliacoes" className="block hover:opacity-80 transition-opacity">
                  <div className="text-3xl font-bold text-purple-600">{formatNumber(profile.totalAvaliacoes)}</div>
                  <div className="text-sm text-muted-foreground">Avaliações</div>
                </Link>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{formatNumber(profile.pontos)}</div>
                <div className="text-sm text-muted-foreground">Pontos</div>
              </div>
            </div>

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Seus Badges
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.badges.map((badge) => (
                    <Badge
                      key={badge.code}
                      variant="secondary"
                      className="text-sm py-1 px-3 bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      <span className="mr-1">{badge.emoji}</span>
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Botão para editar perfil */}
            <div className="pt-4 border-t">
              <Link href="/perfil">
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ranking Top 10 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top 10 Jurados
            </CardTitle>
            <CardDescription>Ranking dos jurados mais ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ranking.map((item, idx) => {
                const isCurrentUser = item.clienteId === profile.id
                return (
                  <div
                    key={item.posicao}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                      isCurrentUser
                        ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-500'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white font-bold text-lg">
                      {item.posicao <= 3 ? (
                        <Trophy className="h-6 w-6" />
                      ) : (
                        item.posicao
                      )}
                    </div>
                    <Avatar className="h-12 w-12 border-2 border-purple-200">
                      <AvatarImage src={item.foto || '/avatar-placeholder.png'} alt={item.nome} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {item.nome.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.nome}</p>
                        {isCurrentUser && (
                          <Badge variant="default" className="bg-purple-600 text-white text-xs">
                            Você
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(item.totalAvaliacoes)} avaliações • {item.nivelLabel}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">{formatNumber(item.pontos)}</div>
                      <div className="text-xs text-muted-foreground">pontos</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Botão para voltar */}
        <div className="text-center pb-6">
          <Button onClick={() => router.push('/votar')} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            Voltar para Votação
          </Button>
        </div>
      </div>
    </div>
  )
}

