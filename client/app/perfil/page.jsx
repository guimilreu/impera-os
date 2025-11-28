"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Camera, Save, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber } from "@/lib/utils/format"
import { generateClienteProfile, calculateProfilePoints } from "@/lib/mock/clientes"
import { toast } from "sonner"

export default function PerfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    foto: null,
    idade: null,
    genero: null,
    renda: null,
    localizacao: null,
  })
  const [pontosGanhos, setPontosGanhos] = useState(0)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)

      const token = localStorage.getItem("token")
      const cpf = localStorage.getItem("cpf") || null
      const phone = localStorage.getItem("phone") || null
      
      const userId = token ? parseInt(token) || 1 : 1
      const clienteProfile = generateClienteProfile(userId, cpf, phone)
      setProfile(clienteProfile)

      setFormData({
        foto: clienteProfile.foto,
        idade: clienteProfile.idade,
        genero: clienteProfile.genero,
        renda: clienteProfile.renda,
        localizacao: clienteProfile.localizacao,
      })
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      toast.error('Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result })
        calculatePointsGain({ ...formData, foto: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  function calculatePointsGain(newData) {
    const camposPreenchidosAntes = [
      profile?.foto,
      profile?.idade,
      profile?.genero,
      profile?.renda,
      profile?.localizacao,
    ].filter(Boolean).length

    const camposPreenchidosDepois = [
      newData.foto,
      newData.idade,
      newData.genero,
      newData.renda,
      newData.localizacao,
    ].filter(Boolean).length

    const novosPontos = (camposPreenchidosDepois - camposPreenchidosAntes) * 10
    setPontosGanhos(novosPontos > 0 ? novosPontos : 0)
  }

  function handleFieldChange(field, value) {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    calculatePointsGain(newData)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await delay(DEFAULT_DELAY)

      // Atualiza perfil mock
      const updatedProfile = {
        ...profile,
        ...formData,
        pontos: calculateProfilePoints({ ...profile, ...formData }),
      }
      setProfile(updatedProfile)

      // Salva no localStorage (mock)
      if (formData.foto) {
        localStorage.setItem('cliente_foto', formData.foto)
      }
      if (formData.idade) {
        localStorage.setItem('cliente_idade', formData.idade)
      }
      if (formData.genero) {
        localStorage.setItem('cliente_genero', formData.genero)
      }
      if (formData.renda) {
        localStorage.setItem('cliente_renda', formData.renda)
      }
      if (formData.localizacao) {
        localStorage.setItem('cliente_localizacao', formData.localizacao)
      }

      toast.success(`Perfil atualizado! ${pontosGanhos > 0 ? `Você ganhou ${pontosGanhos} pontos!` : ''}`)
      setPontosGanhos(0)
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      toast.error('Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white">Carregando perfil...</p>
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
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/ranking')} className="w-full">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const camposPreenchidos = [
    formData.foto,
    formData.idade,
    formData.genero,
    formData.renda,
    formData.localizacao,
  ].filter(Boolean).length

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
      <div className="container mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/ranking')}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">
              Editar Perfil
            </h1>
            <p className="text-white/90 mt-1">Complete seu perfil e ganhe pontos!</p>
          </div>
        </div>

        {/* Card de Pontos */}
        {pontosGanhos > 0 && (
          <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">Você ganhará {pontosGanhos} pontos ao salvar!</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card Principal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Complete seu perfil para ganhar mais pontos no ranking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Foto */}
            <div className="space-y-2">
              <Label>Foto de Perfil</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 border-2 border-purple-500">
                  <AvatarImage src={formData.foto || '/avatar-placeholder.png'} alt="Foto" />
                  <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl">
                    {profile.nome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.foto ? 'Foto selecionada' : 'Selecione uma foto'} • +10 pontos
                  </p>
                </div>
              </div>
            </div>

            {/* Idade */}
            <div className="space-y-2">
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                type="number"
                placeholder="Ex: 25"
                value={formData.idade || ''}
                onChange={(e) => handleFieldChange('idade', e.target.value)}
                min="13"
                max="120"
              />
              <p className="text-xs text-muted-foreground">
                {formData.idade ? 'Idade informada' : 'Informe sua idade'} • +5 pontos
              </p>
            </div>

            {/* Gênero */}
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <Select
                value={formData.genero || ''}
                onValueChange={(value) => handleFieldChange('genero', value)}
              >
                <SelectTrigger id="genero">
                  <SelectValue placeholder="Selecione seu gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                  <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.genero ? 'Gênero informado' : 'Informe seu gênero'} • +5 pontos
              </p>
            </div>

            {/* Renda */}
            <div className="space-y-2">
              <Label htmlFor="renda">Renda Mensal (R$)</Label>
              <Select
                value={formData.renda || ''}
                onValueChange={(value) => handleFieldChange('renda', value)}
              >
                <SelectTrigger id="renda">
                  <SelectValue placeholder="Selecione sua faixa de renda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate_1000">Até R$ 1.000</SelectItem>
                  <SelectItem value="1000_2000">R$ 1.000 - R$ 2.000</SelectItem>
                  <SelectItem value="2000_5000">R$ 2.000 - R$ 5.000</SelectItem>
                  <SelectItem value="5000_10000">R$ 5.000 - R$ 10.000</SelectItem>
                  <SelectItem value="acima_10000">Acima de R$ 10.000</SelectItem>
                  <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.renda ? 'Renda informada' : 'Informe sua faixa de renda'} • +10 pontos
              </p>
            </div>

            {/* Localização */}
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização (Cidade)</Label>
              <Input
                id="localizacao"
                type="text"
                placeholder="Ex: Bauru, SP"
                value={formData.localizacao || ''}
                onChange={(e) => handleFieldChange('localizacao', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {formData.localizacao ? 'Localização informada' : 'Informe sua cidade'} • +10 pontos
              </p>
            </div>

            {/* Progresso */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso do Perfil</span>
                <span className="text-sm text-muted-foreground">
                  {camposPreenchidos} de 5 campos preenchidos
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${(camposPreenchidos / 5) * 100}%` }}
                />
              </div>
              {camposPreenchidos === 5 && (
                <p className="text-xs text-green-600 mt-2 font-medium">
                  ✓ Perfil completo! Você ganhou um badge especial!
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/ranking')}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

