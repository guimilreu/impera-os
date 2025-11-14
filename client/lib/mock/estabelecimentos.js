/**
 * Mock de estabelecimentos
 */

import { mockRestaurantName, randomInt, randomFloat } from '../utils/faker'

export function generateEstabelecimentos(count = 20) {
  const estabelecimentos = []
  // Distribui estabelecimentos entre as 4 cidades (1-4)
  const cities = [1, 2, 3, 4]
  // Cada cidade tem edições diferentes
  const editionsByCity = {
    1: [1, 2], // Bauru
    2: [3, 4], // Marília
    3: [5],    // Botucatu
    4: [6],    // São José do Rio Preto
  }
  
  for (let i = 1; i <= count; i++) {
    const cidadeId = cities[(i - 1) % cities.length]
    const edicoes = editionsByCity[cidadeId]
    const edicaoId = edicoes[randomInt(0, edicoes.length - 1)]
    
    estabelecimentos.push({
      id: i,
      name: mockRestaurantName(),
      cidadeId,
      edicaoId,
      totalVotos: randomInt(50, 500),
      mediaNota: randomFloat(3.5, 5.0),
      posicao: i,
      categoriaMaisVotada: randomInt(1, 7),
      foto: '/prato.jpg',
      endereco: `Rua ${randomInt(1, 100)}, Centro`,
      telefone: `(11) ${randomInt(3000, 9999)}-${randomInt(1000, 9999)}`,
      ativo: true,
    })
  }
  
  return estabelecimentos
}

export const estabelecimentos = generateEstabelecimentos(20)

/**
 * Filtra estabelecimentos por cidade/edição
 */
export function getEstabelecimentosByTenant(cityId, editionId) {
  if (!cityId || !editionId) return estabelecimentos
  
  return estabelecimentos.filter(
    e => e.cidadeId === cityId && e.edicaoId === editionId
  )
}

/**
 * Retorna top estabelecimentos
 */
export function getTopEstabelecimentos(limit = 10, cityId, editionId) {
  const filtered = getEstabelecimentosByTenant(cityId, editionId)
  return filtered
    .sort((a, b) => b.totalVotos - a.totalVotos)
    .slice(0, limit)
    .map((e, idx) => ({ ...e, posicao: idx + 1 }))
}

