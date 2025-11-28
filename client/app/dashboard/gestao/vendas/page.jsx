"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, TrendingUp, UtensilsCrossed, Building2, Download, BarChart3 } from "lucide-react"
import { EmptyState } from "@/components/dashboard/EmptyState"
import { Breadcrumb } from "@/components/dashboard/Breadcrumb"
import { Pagination } from "@/components/dashboard/Pagination"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DashboardChart } from "@/components/dashboard/DashboardChart"
import { DashboardSkeleton } from "@/components/dashboard/Skeletons"
import { useTenantStore } from "@/lib/state/useTenantStore"
import { useAuthStore } from "@/lib/state/useAuthStore"
import { delay, DEFAULT_DELAY } from "@/lib/utils/delay"
import { estabelecimentos, getEstabelecimentosByTenant } from "@/lib/mock/estabelecimentos"
import { pratos } from "@/lib/mock/pratos"
import { categorias } from "@/lib/mock/categorias"
import { formatNumber } from "@/lib/utils/format"
import { randomInt } from "@/lib/utils/faker"
import { toast } from "sonner"

// Mock de vendas de pratos
function generateVendasPratos() {
  const vendas = []
  
  pratos.forEach((prato) => {
    const est = estabelecimentos.find(e => e.id === prato.estabelecimentoId)
    if (!est) return
    
    const quantidadeVendida = randomInt(10, 200)
    
    vendas.push({
      id: prato.id,
      pratoId: prato.id,
      pratoNome: prato.name,
      estabelecimentoId: est.id,
      estabelecimentoNome: est.name,
      categoriaId: prato.categoriaId,
      categoria: prato.categoria?.name || 'N/A',
      quantidadeVendida,
      cidadeId: est.cidadeId,
      edicaoId: est.edicaoId,
    })
  })
  
  return vendas.sort((a, b) => b.quantidadeVendida - a.quantidadeVendida)
}

export default function VendasPage() {
  const [loading, setLoading] = useState(true)
  const [vendas, setVendas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState("")

  const { city, edition } = useTenantStore()
  const { role, estabelecimentoId } = useAuthStore()
  
  // Verifica se é restaurante
  const isRestaurante = role === 'estabelecimento'

  useEffect(() => {
    loadData()
  }, [city, edition])

  async function loadData() {
    setLoading(true)
    try {
      await delay(DEFAULT_DELAY)
      let data = generateVendasPratos()
      
      // Filtra por tenant
      if (city?.id) {
        data = data.filter(v => v.cidadeId === city.id)
        if (edition?.id) {
          data = data.filter(v => v.edicaoId === edition.id)
        }
      }
      
      // Se for restaurante, filtra apenas seus pratos
      if (isRestaurante && estabelecimentoId) {
        data = data.filter(v => v.estabelecimentoId === estabelecimentoId)
      }
      
      setVendas(data)
    } catch (error) {
      console.error('Erro ao carregar vendas:', error)
      toast.error('Não foi possível carregar as vendas.')
    } finally {
      setLoading(false)
    }
  }

  function handleStartEdit(venda) {
    setEditingId(venda.id)
    setEditValue(venda.quantidadeVendida.toString())
  }

  function handleSaveEdit(vendaId) {
    const novaQuantidade = parseInt(editValue) || 0
    setVendas(vendas.map(v => 
      v.id === vendaId ? { ...v, quantidadeVendida: novaQuantidade } : v
    ))
    setEditingId(null)
    setEditValue("")
    toast.success("Quantidade atualizada com sucesso!")
  }

  function handleCancelEdit() {
    setEditingId(null)
    setEditValue("")
  }

  // Filtros
  let filteredVendas = vendas.filter(v =>
    v.pratoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.estabelecimentoNome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (categoriaFilter !== "all") {
    filteredVendas = filteredVendas.filter(v => v.categoriaId === parseInt(categoriaFilter))
  }

  // Paginação
  const totalPages = Math.ceil(filteredVendas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVendas = filteredVendas.slice(startIndex, endIndex)

  // Estatísticas
  const totalPratosVendidos = vendas.reduce((sum, v) => sum + v.quantidadeVendida, 0)
  const mediaVendasPorPrato = vendas.length > 0 ? Math.round(totalPratosVendidos / vendas.length) : 0
  const pratoMaisVendido = vendas[0]
  const estabelecimentosUnicos = new Set(vendas.map(v => v.estabelecimentoId)).size

  // Dados para gráfico de vendas por categoria
  const vendasPorCategoria = categorias.map(cat => {
    const vendasCat = vendas.filter(v => v.categoriaId === cat.id)
    const total = vendasCat.reduce((sum, v) => sum + v.quantidadeVendida, 0)
    return {
      name: cat.name,
      value: total,
    }
  }).sort((a, b) => b.value - a.value)

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas de Pratos</h1>
          <p className="text-muted-foreground mt-1">
            {isRestaurante 
              ? "Registre a quantidade vendida de cada prato durante o circuito" 
              : "Acompanhe as vendas dos pratos no circuito"
            }
          </p>
        </div>
        {!isRestaurante && (
          <Button variant="outline" onClick={() => toast.info("Exportação em desenvolvimento")}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard
          title="Total Vendido"
          value={formatNumber(totalPratosVendidos)}
          icon={ShoppingCart}
          description="unidades"
        />
        <DashboardCard
          title="Média por Prato"
          value={formatNumber(mediaVendasPorPrato)}
          icon={TrendingUp}
          description="unidades"
        />
        <DashboardCard
          title="Pratos Cadastrados"
          value={vendas.length}
          icon={UtensilsCrossed}
        />
        <DashboardCard
          title="Estabelecimentos"
          value={estabelecimentosUnicos}
          icon={Building2}
        />
      </div>

      {/* Gráfico e Top Prato */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardChart
          title="Vendas por Categoria"
          data={vendasPorCategoria}
          type="bar"
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Prato Mais Vendido
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pratoMaisVendido ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UtensilsCrossed className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{pratoMaisVendido.pratoNome}</h3>
                    <p className="text-sm text-muted-foreground">{pratoMaisVendido.estabelecimentoNome}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Vendas</p>
                    <p className="text-2xl font-bold">{formatNumber(pratoMaisVendido.quantidadeVendida)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="text-lg font-semibold">{pratoMaisVendido.categoria}</p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={ShoppingCart}
                title="Sem dados"
                description="Nenhuma venda registrada ainda."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Prato</CardTitle>
          <CardDescription>
            {filteredVendas.length} prato(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar por prato ou restaurante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Prato</TableHead>
                  {!isRestaurante && <TableHead>Restaurante</TableHead>}
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Vendas</TableHead>
                  {isRestaurante && <TableHead className="text-right w-32">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVendas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isRestaurante ? 5 : 5} className="p-0">
                      <EmptyState
                        icon={ShoppingCart}
                        title="Nenhuma venda encontrada"
                        description={isRestaurante 
                          ? "Registre a quantidade vendida de cada prato." 
                          : "Ajuste os filtros ou aguarde o registro de vendas."
                        }
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVendas.map((venda, idx) => (
                    <TableRow key={venda.id}>
                      <TableCell className="font-medium text-muted-foreground">
                        {startIndex + idx + 1}º
                      </TableCell>
                      <TableCell className="font-medium">{venda.pratoNome}</TableCell>
                      {!isRestaurante && <TableCell>{venda.estabelecimentoNome}</TableCell>}
                      <TableCell>
                        <Badge variant="outline">{venda.categoria}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {editingId === venda.id ? (
                          <Input
                            type="number"
                            min="0"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 text-right ml-auto"
                            autoFocus
                          />
                        ) : (
                          formatNumber(venda.quantidadeVendida)
                        )}
                      </TableCell>
                      {isRestaurante && (
                        <TableCell className="text-right">
                          {editingId === venda.id ? (
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveEdit(venda.id)}
                              >
                                Salvar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEdit(venda)}
                            >
                              Editar
                            </Button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredVendas.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}

