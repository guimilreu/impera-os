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

  const categorias = [
    { id: 1, nome: 'Brasileira' },
    { id: 2, nome: 'Italiana' },
    { id: 3, nome: 'Japonesa' },
    { id: 4, nome: 'Carnes' },
    { id: 5, nome: 'Frutos do Mar' },
    { id: 6, nome: 'Vegana' },
    { id: 7, nome: 'Sobremesas' },
  ]
  
  for (let i = 1; i <= count; i++) {
    const cidadeId = cities[(i - 1) % cities.length]
    const edicoes = editionsByCity[cidadeId]
    const edicaoId = edicoes[randomInt(0, edicoes.length - 1)]
    const categoriaId = randomInt(1, 7)
    const categoria = categorias.find(c => c.id === categoriaId)
    
    // Status de pagamento e extras
    const pagou = Math.random() > 0.15 // 85% pagou
    const comprouConvite = pagou && Math.random() > 0.4 // 60% dos que pagaram compraram convite
    const comprouDivulgacaoExtra = pagou && Math.random() > 0.7 // 30% comprou divulgação extra
    
    estabelecimentos.push({
      id: i,
      name: mockRestaurantName(),
      cidadeId,
      edicaoId,
      totalVotos: randomInt(50, 500),
      mediaNota: randomFloat(3.5, 5.0),
      posicao: i,
      categoriaMaisVotada: categoriaId,
      categoria: categoria,
      foto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      fotoFachada: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      endereco: `Rua ${randomInt(1, 100)}, ${randomInt(100, 999)}, Centro`,
      telefone: `(14) ${randomInt(3000, 9999)}-${randomInt(1000, 9999)}`,
      email: `contato${i}@restaurante.com.br`,
      horarioFuncionamento: `${randomInt(10, 12)}:00 - ${randomInt(21, 23)}:00`,
      instagram: `@restaurante${i}`,
      ativo: true,
      // Campos para Sócio Local
      pagou,
      comprouConvite,
      quantidadeConvites: comprouConvite ? randomInt(2, 10) : 0,
      comprouDivulgacaoExtra,
      horarioAgendadoFoto: pagou ? new Date(2025, 4, randomInt(1, 31), randomInt(9, 17), 0).toISOString() : null,
      descricao: `Restaurante especializado em culinária ${categoria?.nome || 'variada'} com ambiente acolhedor e pratos exclusivos.`,
    })
  }
  
  return estabelecimentos
}

export const estabelecimentos = generateEstabelecimentos(20)

/**
 * Filtra estabelecimentos por cidade/edição
 */
export function getEstabelecimentosByTenant(cityId, editionId) {
  if (!cityId) return estabelecimentos
  
  if (editionId) {
    return estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
  } else {
    // Apenas cidade (todas as edições)
    return estabelecimentos.filter(
      e => e.cidadeId === cityId
    )
  }
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

