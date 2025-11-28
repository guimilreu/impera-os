"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Building2, Calendar, Tag, Lock } from "lucide-react"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { SigiloBanner } from "@/components/dashboard/SigiloIndicator"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { formatNumber, formatDateTime } from "@/lib/utils/format"
import { toast } from "sonner"

export default function RelatoriosPage() {
  const { role, premiacaoEncerrada, sigiloAtivo } = useAuthStore()
  const { edition } = useTenantStore()
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState(null)
  const [reportData, setReportData] = useState(null)
  const [format, setFormat] = useState("csv")

  // Se for estabelecimento e premiação não encerrada, bloquear
  const isBlocked = role === 'estabelecimento' && !premiacaoEncerrada

  async function handleGenerateReport(type) {
    if (sigiloAtivo && type !== 'categoria') {
      toast.error('Relatórios bloqueados enquanto o sigilo estiver ativo')
      return
    }

    setLoading(true)
    setReportType(type)
    
    try {
      await delay(DEFAULT_DELAY)
      
      // Mock de dados do relatório
      const mockData = {
        estabelecimento: [
          { nome: 'Restaurante Sabor', votos: 450, media: 4.5, posicao: 1 },
          { nome: 'Cantina Tradição', votos: 380, media: 4.3, posicao: 2 },
          { nome: 'Bistrô Gourmet', votos: 320, media: 4.2, posicao: 3 },
        ],
        edicao: [
          { nome: 'Edição 2025', totalVotos: 5000, estabelecimentos: 50, mediaGeral: 4.4 },
          { nome: 'Edição 2024', totalVotos: 4500, estabelecimentos: 45, mediaGeral: 4.3 },
        ],
        categoria: [
          { nome: 'Pratos Principais', votos: 2000, media: 4.5 },
          { nome: 'Sobremesas', votos: 1500, media: 4.3 },
          { nome: 'Bebidas', votos: 1000, media: 4.1 },
        ],
      }
      
      setReportData(mockData[type])
      toast.success(`Relatório ${type} gerado com sucesso (mock)`)
    } catch (error) {
      toast.error('Não foi possível gerar o relatório. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleExportReport() {
    if (!reportData || !reportType) {
      toast.error('Gere um relatório primeiro')
      return
    }

    if (sigiloAtivo && reportType !== 'categoria') {
      toast.error('Exportação bloqueada enquanto o sigilo estiver ativo')
      return
    }

    // Simula exportação
    const headers = Object.keys(reportData[0] || {})
    const rows = reportData.map(item => Object.values(item))
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_${reportType}_${new Date().toISOString().split('T')[0]}.${format}`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success(`Relatório exportado em ${format.toUpperCase()} (mock)`)
  }

  if (isBlocked) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground mt-1">Visualize relatórios detalhados</p>
        </div>

        <Card className="border-yellow-500">
          <CardHeader>
            <CardTitle>Relatório Indisponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <p className="text-lg font-semibold text-yellow-600">
                  Relatório disponível somente após a premiação
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Os relatórios serão liberados após o encerramento da premiação.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground mt-1">Visualize relatórios detalhados</p>
        </div>
        {reportData && (
          <div className="flex gap-2">
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportReport} disabled={sigiloAtivo && reportType !== 'categoria'}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        )}
      </div>

      {/* Banner de Sigilo */}
      {sigiloAtivo && (
        <SigiloBanner 
          title="Relatórios parcialmente bloqueados"
          description="Os relatórios por estabelecimento e edição estão protegidos pelo sigilo. Apenas relatórios por categoria estão disponíveis."
        />
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={sigiloAtivo ? 'opacity-60' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 tracking-tight">
              {sigiloAtivo ? <Lock className="h-5 w-5 text-yellow-600" /> : <Building2 className="h-5 w-5" />}
              Relatório por Estabelecimento
            </CardTitle>
            <CardDescription>Estatísticas por estabelecimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleGenerateReport('estabelecimento')}
              disabled={loading || sigiloAtivo}
            >
              {loading && reportType === 'estabelecimento' ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
            {sigiloAtivo && (
              <p className="text-xs text-yellow-600 text-center flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Bloqueado pelo sigilo
              </p>
            )}
          </CardContent>
        </Card>

        <Card className={sigiloAtivo ? 'opacity-60' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 tracking-tight">
              {sigiloAtivo ? <Lock className="h-5 w-5 text-yellow-600" /> : <Calendar className="h-5 w-5" />}
              Relatório por Edição
            </CardTitle>
            <CardDescription>Estatísticas por edição</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleGenerateReport('edicao')}
              disabled={loading || sigiloAtivo}
            >
              {loading && reportType === 'edicao' ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
            {sigiloAtivo && (
              <p className="text-xs text-yellow-600 text-center flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Bloqueado pelo sigilo
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 tracking-tight">
              <Tag className="h-5 w-5" />
              Relatório por Categoria
            </CardTitle>
            <CardDescription>Estatísticas por categoria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleGenerateReport('categoria')}
              disabled={loading}
            >
              {loading && reportType === 'categoria' ? 'Gerando...' : 'Gerar Relatório'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview do Relatório */}
      {reportData && reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="tracking-tight">Preview do Relatório - {reportType}</CardTitle>
            <CardDescription>
              {reportData.length} registro(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(reportData[0]).map((key) => (
                      <TableHead key={key} className="capitalize">
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((row, idx) => (
                    <TableRow key={idx} className="transition-colors hover:bg-muted/50">
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>
                          {typeof value === 'number' ? formatNumber(value) : value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
