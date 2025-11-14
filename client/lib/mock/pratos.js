/**
 * Mock de pratos
 */

import { mockDishName, randomInt, randomFloat } from '../utils/faker'
import { categorias } from './categorias'
import { estabelecimentos } from './estabelecimentos'

export function generatePratos(count = 30) {
  const pratos = []
  
  for (let i = 1; i <= count; i++) {
    pratos.push({
      id: i,
      name: mockDishName(),
      estabelecimentoId: randomInt(1, 20),
      categoriaId: randomInt(1, 7),
      categoria: categorias[randomInt(0, 6)],
      totalVotos: randomInt(20, 300),
      mediaNota: randomFloat(3.0, 5.0),
      posicao: i,
      foto: '/prato.jpg',
      descricao: 'Prato especial preparado com ingredientes selecionados',
      preco: randomFloat(25, 150),
      ativo: true,
    })
  }
  
  return pratos
}

export const pratos = generatePratos(30)

/**
 * Filtra pratos por estabelecimento
 */
export function getPratosByEstabelecimento(estabelecimentoId) {
  return pratos.filter(p => p.estabelecimentoId === estabelecimentoId)
}

/**
 * Retorna top pratos
 */
export function getTopPratos(limit = 10, estabelecimentoId, cityId, editionId) {
  let filtered = pratos
  
  // Filtra por tenant se fornecido
  if (cityId && editionId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(p => estabelecimentosIds.includes(p.estabelecimentoId))
  }
  
  // Filtra por estabelecimento específico se fornecido
  if (estabelecimentoId) {
    filtered = getPratosByEstabelecimento(estabelecimentoId)
  }
  
  return filtered
    .sort((a, b) => b.totalVotos - a.totalVotos)
    .slice(0, limit)
    .map((p, idx) => ({ ...p, posicao: idx + 1 }))
}

/**
 * Retorna pratos por categoria
 */
export function getPratosByCategoria(categoriaId) {
  return pratos.filter(p => p.categoriaId === categoriaId)
}

