"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { toast } from "sonner"
import { Save, Settings, Lock, Trophy, MapPin, Bell, Calendar, ChevronRight } from "lucide-react"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import Link from "next/link"

export default function ConfiguracoesPage() {
  const { sigiloAtivo, premiacaoEncerrada, setSigiloAtivo, setPremiacaoEncerrada } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sigiloAtivo: false,
    premiacaoEncerrada: false,
    geofenceRaio: 0.5,
    notificacoes: true,
  })

  useEffect(() => {
    setFormData({
      sigiloAtivo,
      premiacaoEncerrada,
      geofenceRaio: 0.5,
      notificacoes: true,
    })
  }, [sigiloAtivo, premiacaoEncerrada])

  async function handleSave() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      
      // Atualiza store
      setSigiloAtivo(formData.sigiloAtivo)
      setPremiacaoEncerrada(formData.premiacaoEncerrada)
      
      toast.success('Configurações salvas com sucesso (mock)')
    } catch (error) {
      toast.error('Não foi possível salvar as configurações. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie as configurações do sistema</p>
      </div>

      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 tracking-tight">
            <Settings className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>Configurações principais do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sigilo"
                checked={formData.sigiloAtivo}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, sigiloAtivo: checked })
                }
              />
              <Label htmlFor="sigilo" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Sigilo Ativo
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Ative o sigilo para ocultar rankings e valores médios até a premiação.
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="premiacao"
                checked={formData.premiacaoEncerrada}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, premiacaoEncerrada: checked })
                }
              />
              <Label htmlFor="premiacao" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Premiação Encerrada
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Marque quando a premiação for encerrada para liberar relatórios.
            </p>
          </div>

          <Separator />

          <Button onClick={handleSave} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardContent>
      </Card>

      {/* Configurações de Geofence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Configurações de Geofence
          </CardTitle>
          <CardDescription>Configure o raio permitido para votos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="geofence">Raio Permitido (km)</Label>
            <Input
              id="geofence"
              type="number"
              step="0.1"
              min="0.1"
              max="5"
              value={formData.geofenceRaio}
              onChange={(e) =>
                setFormData({ ...formData, geofenceRaio: parseFloat(e.target.value) || 0.5 })
              }
            />
            <p className="text-sm text-muted-foreground">
              Votos fora deste raio serão marcados como suspeitos.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Configurações de Notificações
          </CardTitle>
          <CardDescription>Configure as notificações do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notificacoes"
                checked={formData.notificacoes}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, notificacoes: checked })
                }
              />
              <Label htmlFor="notificacoes">Receber notificações</Label>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Receba notificações sobre votos suspeitos, denúncias e atualizações.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gestão de Cidades e Edições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 tracking-tight">
            <Settings className="h-5 w-5" />
            Gestão de Cidades e Edições
          </CardTitle>
          <CardDescription>Gerencie cidades e edições do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/dashboard/cidades">
            <Button variant="outline" className="w-full justify-between group">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Cidades</span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard/edicoes">
            <Button variant="outline" className="w-full justify-between group">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Edições</span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Essas seções são pouco utilizadas e foram movidas para Configurações.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
