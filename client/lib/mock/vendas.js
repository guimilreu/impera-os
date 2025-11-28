/**
 * Mock de vendas de convites e pratos
 */

import { randomInt } from '../utils/faker'

// Vendas de convites para o evento de premiação
export function getVendasConvites(cityId = null, editionId = null) {
  return {
    totalConvites: 500,
    vendidos: randomInt(150, 350),
    reservados: randomInt(20, 50),
    disponiveis: randomInt(100, 200),
    valorUnitario: 150.00,
    faturamentoPrevisto: 75000.00,
    faturamentoAtual: randomInt(22500, 52500),
    metaVendas: 400,
    porcentagemMeta: randomInt(40, 85),
    vendasPorDia: [
      { data: '2025-07-01', quantidade: randomInt(5, 15) },
      { data: '2025-07-02', quantidade: randomInt(5, 15) },
      { data: '2025-07-03', quantidade: randomInt(5, 15) },
      { data: '2025-07-04', quantidade: randomInt(5, 15) },
      { data: '2025-07-05', quantidade: randomInt(5, 15) },
      { data: '2025-07-06', quantidade: randomInt(10, 25) },
      { data: '2025-07-07', quantidade: randomInt(10, 25) },
    ],
  }
}

// Vendas de pratos durante o circuito (por estabelecimento)
export function getVendasPratos(estabelecimentoId = null, cityId = null, editionId = null) {
  const pratos = [
    { id: 1, nome: 'Feijoada Completa', categoria: 'Brasileira' },
    { id: 2, nome: 'Picanha na Chapa', categoria: 'Carnes' },
    { id: 3, nome: 'Moqueca de Peixe', categoria: 'Frutos do Mar' },
  ]

  return pratos.map(prato => ({
    ...prato,
    quantidadeVendida: randomInt(50, 300),
    valorUnitario: randomInt(35, 85),
    faturamento: randomInt(2000, 15000),
    mediaVendasDia: randomInt(5, 20),
  }))
}

// Resumo geral de vendas de pratos na cidade
export function getResumoVendasCidade(cityId = null, editionId = null) {
  return {
    totalPratosVendidos: randomInt(5000, 15000),
    faturamentoTotal: randomInt(250000, 750000),
    ticketMedio: randomInt(45, 75),
    estabelecimentoMaisVendeu: {
      id: 1,
      nome: 'Restaurante Sabor Brasileiro',
      quantidade: randomInt(500, 1000),
    },
    pratoMaisVendido: {
      id: 1,
      nome: 'Feijoada Completa',
      quantidade: randomInt(800, 1500),
    },
    categoriasMaisVendidas: [
      { categoria: 'Brasileira', quantidade: randomInt(2000, 4000) },
      { categoria: 'Carnes', quantidade: randomInt(1500, 3000) },
      { categoria: 'Italiana', quantidade: randomInt(1000, 2500) },
    ],
  }
}

