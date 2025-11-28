"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Ticket, QrCode, DollarSign, Building2, TrendingUp, Download, Eye } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { estabelecimentos, getEstabelecimentosByTenant } from "@/lib/mock/estabelecimentos"
import { formatNumber, formatCurrency } from "@/lib/utils/format"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock de vendas de convites
function generateConvites() {
  const convites = []
  const estabelecimentosComConvite = estabelecimentos.filter(e => e.comprouConvite)
  
  estabelecimentosComConvite.forEach((est, idx) => {
    const quantidade = est.quantidadeConvites || Math.floor(Math.random() * 10) + 1
    const precoUnitario = 50
    
    convites.push({
      id: idx + 1,
      estabelecimentoId: est.id,
      estabelecimentoNome: est.name,
      quantidade,
      precoUnitario,
      total: quantidade * precoUnitario,
      dataCompra: new Date(2025, 4, Math.floor(Math.random() * 28) + 1).toISOString(),
      status: Math.random() > 0.2 ? 'pago' : 'pendente',
      cidadeId: est.cidadeId,
      edicaoId: est.edicaoId,
      qrCodes: Array.from({ length: quantidade }, (_, i) => ({
        codigo: `QR-${est.id}-${i + 1}-${Date.now()}`,
        usado: Math.random() > 0.7,
      })),
    })
  })
  
  return convites
}

export default function ConvitesPage() {
  const [loading, setLoading] = useState(true)
  const [convites, setConvites] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedConvite, setSelectedConvite] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [quantidade, setQuantidade] = useState(1)
  const [buying, setBuying] = useState(false)

  const { city, edition } = useTenantStore()
  const { role, estabelecimentoId } = useAuthStore()
  
  // Verifica se é restaurante
  const isRestaurante = role === 'estabelecimento'
  const precoUnitario = 50

  useEffect(() => {
    loadData()
  }, [city, edition])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      let data = generateConvites()
      
      // Filtra por tenant
      if (city?.id) {
        data = data.filter(c => c.cidadeId === city.id)
        if (edition?.id) {
          data = data.filter(c => c.edicaoId === edition.id)
        }
      }
      
      setConvites(data)
    } catch (error) {
      console.error('Erro ao carregar convites:', error)
      toast.error('Não foi possível carregar os convites.')
    } finally {
      setLoading(false)
    }
  }

  // Para restaurante, filtra apenas seus próprios convites
  const convitesExibidos = isRestaurante 
    ? convites.filter(c => c.estabelecimentoId === estabelecimentoId)
    : convites

  // Filtro por busca
  const filteredConvites = convitesExibidos.filter(c =>
    c.estabelecimentoNome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Paginação
  const totalPages = Math.ceil(filteredConvites.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedConvites = filteredConvites.slice(startIndex, endIndex)

  // Estatísticas
  const totalConvitesVendidos = convites.reduce((sum, c) => sum + c.quantidade, 0)
  const totalArrecadado = convites.reduce((sum, c) => sum + c.total, 0)
  const convitesPagos = convites.filter(c => c.status === 'pago').length
  const qrCodesUsados = convites.reduce((sum, c) => 
    sum + c.qrCodes.filter(qr => qr.usado).length, 0
  )

  function handleViewDetails(convite) {
    setSelectedConvite(convite)
    setDetailsOpen(true)
  }

  async function handleComprarConvite() {
    if (quantidade < 1) {
      toast.error("Quantidade inválida")
      return
    }
    
    setBuying(true)
    try {
      await delay(800)
      
      // Simula a compra
      const novoConvite = {
        id: convites.length + 100,
        estabelecimentoId: estabelecimentoId,
        estabelecimentoNome: "Seu Restaurante",
        quantidade,
        precoUnitario,
        total: quantidade * precoUnitario,
        dataCompra: new Date().toISOString(),
        status: 'pendente',
        cidadeId: city?.id || 1,
        edicaoId: edition?.id || 1,
        qrCodes: Array.from({ length: quantidade }, (_, i) => ({
          codigo: `QR-${estabelecimentoId}-${i + 1}-${Date.now()}`,
          usado: false,
        })),
      }
      
      setConvites([novoConvite, ...convites])
      toast.success(`${quantidade} convite(s) comprado(s) com sucesso! Aguardando confirmação de pagamento.`)
      setBuyDialogOpen(false)
      setQuantidade(1)
    } catch (error) {
      toast.error("Erro ao processar compra")
    } finally {
      setBuying(false)
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Convites</h1>
          <p className="text-muted-foreground mt-1">
            {isRestaurante 
              ? "Compre convites para a cerimônia de premiação" 
              : "Acompanhe as vendas de convites dos restaurantes"
            }
          </p>
        </div>
        {isRestaurante ? (
          <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-sm">
                <Ticket className="mr-2 h-4 w-4" />
                Comprar Convites
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Comprar Convites</DialogTitle>
                <DialogDescription>
                  Adquira convites para a cerimônia de premiação do circuito gastronômico.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Preço por convite:</span>
                  <span className="text-lg font-bold">{formatCurrency(precoUnitario)}</span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantidade</label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                      disabled={buying}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center w-20"
                      disabled={buying}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantidade(quantidade + 1)}
                      disabled={buying}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="font-medium">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(quantidade * precoUnitario)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setBuyDialogOpen(false)}
                  disabled={buying}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleComprarConvite}
                  disabled={buying}
                >
                  {buying ? "Processando..." : "Confirmar Compra"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button variant="outline" onClick={() => toast.info("Exportação em desenvolvimento")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        )}
      </div>

      {/* Cards de Estatísticas - Ocultos para estabelecimentos */}
      {!isRestaurante && (
        <div className="grid gap-4 md:grid-cols-4">
          <DashboardCard
            title="Convites Vendidos"
            value={formatNumber(totalConvitesVendidos)}
            icon={Ticket}
          />
          <DashboardCard
            title="Total Arrecadado"
            value={formatCurrency(totalArrecadado)}
            icon={DollarSign}
          />
          <DashboardCard
            title="Restaurantes"
            value={convites.length}
            icon={Building2}
          />
          <DashboardCard
            title="QR Codes Usados"
            value={`${qrCodesUsados}/${totalConvitesVendidos}`}
            icon={QrCode}
          />
        </div>
      )}

      {/* Lista de Convites */}
      <Card>
        <CardHeader>
          <CardTitle>{isRestaurante ? 'Meus Convites' : 'Vendas de Convites'}</CardTitle>
          <CardDescription>
            {isRestaurante 
              ? `${filteredConvites.length} compra(s) de convites`
              : `${filteredConvites.length} restaurante(s) compraram convites`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Busca - oculta para restaurantes */}
          {!isRestaurante && (
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Buscar por restaurante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {!isRestaurante && <TableHead>Restaurante</TableHead>}
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedConvites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isRestaurante ? 5 : 6} className="p-0">
                      <EmptyState
                        icon={Ticket}
                        title={isRestaurante ? "Você ainda não comprou convites" : "Nenhum convite vendido"}
                        description={isRestaurante ? "Compre convites para a cerimônia de premiação." : "Ainda não há vendas de convites registradas."}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedConvites.map((convite) => (
                    <TableRow key={convite.id}>
                      {!isRestaurante && <TableCell className="font-medium">{convite.estabelecimentoNome}</TableCell>}
                      <TableCell className="text-center">{convite.quantidade}</TableCell>
                      <TableCell className="text-right">{formatCurrency(convite.total)}</TableCell>
                      <TableCell>
                        <Badge variant={convite.status === 'pago' ? 'default' : 'secondary'}>
                          {convite.status === 'pago' ? 'Pago' : 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(convite.dataCompra)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(convite)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver QR Codes
                        </Button>
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
            totalItems={filteredConvites.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>QR Codes - {selectedConvite?.estabelecimentoNome}</DialogTitle>
            <DialogDescription>
              {selectedConvite?.quantidade} convite(s) comprado(s)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {selectedConvite?.qrCodes.map((qr, idx) => (
              <div
                key={qr.codigo}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  qr.usado ? 'bg-muted/50' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className={`h-8 w-8 ${qr.usado ? 'text-muted-foreground' : 'text-primary'}`} />
                  <div>
                    <p className="font-mono text-sm">{qr.codigo}</p>
                    <p className="text-xs text-muted-foreground">Convite #{idx + 1}</p>
                  </div>
                </div>
                <Badge variant={qr.usado ? 'secondary' : 'outline'}>
                  {qr.usado ? 'Usado' : 'Disponível'}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

