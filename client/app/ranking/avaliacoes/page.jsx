"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Calendar, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime, formatRating } from "@/lib/utils/format"
import { generateClienteProfile, generateAvaliacoesHistory } from "@/lib/mock/clientes"
import { toast } from "sonner"

export default function AvaliacoesHistoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)

      const token = localStorage.getItem("token")
      const cpf = localStorage.getItem("cpf") || null
      const phone = localStorage.getItem("phone") || null
      
      const userId = token ? parseInt(token) || 1 : 1
      const clienteProfile = generateClienteProfile(userId, cpf, phone)
      setProfile(clienteProfile)

      const history = generateAvaliacoesHistory(userId, 50)
      setAvaliacoes(history)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar histórico de avaliações')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative min-h-screen p-4 md:p-6"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "100vw calc(100vw * 9 / 16)",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/ranking')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
              Histórico de Avaliações
            </h1>
            <p className="text-white/90 mt-1">
              {profile && `${formatNumber(profile.totalAvaliacoes)} avaliações realizadas`}
            </p>
          </div>
        </div>

        {/* Lista de Avaliações */}
        {avaliacoes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Você ainda não fez nenhuma avaliação.</p>
              <Button onClick={() => router.push('/votar')} className="mt-4">
                Fazer Primeira Avaliação
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {avaliacoes.map((avaliacao) => (
              <Card key={avaliacao.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16 border-2 border-purple-200 flex-shrink-0">
                      <AvatarImage src={avaliacao.foto || '/prato.jpg'} alt={avaliacao.pratoNome} />
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {avaliacao.pratoNome.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{avaliacao.pratoNome}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {avaliacao.estabelecimentoNome}
                          </p>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {formatRating(avaliacao.notaFinal)}
                        </Badge>
                      </div>

                      {/* Critérios */}
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Apresentação:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{formatRating(avaliacao.apresentacao)}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sabor:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{formatRating(avaliacao.sabor)}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Experiência:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{formatRating(avaliacao.experiencia)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Comentário */}
                      {avaliacao.comentario && (
                        <div className="pt-2 border-t">
                          <p className="text-sm italic text-muted-foreground">"{avaliacao.comentario}"</p>
                        </div>
                      )}

                      {/* Data */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateTime(avaliacao.data)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Botão para voltar */}
        <div className="text-center pb-6">
          <Button onClick={() => router.push('/ranking')} variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
            Voltar para Ranking
          </Button>
        </div>
      </div>
    </div>
  )
}

