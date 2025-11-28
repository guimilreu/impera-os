/**
 * Mock de dados do fotógrafo
 */

import { randomInt, randomFloat } from '../utils/faker'
import { estabelecimentos } from './estabelecimentos'
import { pratos } from './pratos'

/**
 * Gera lista de estabelecimentos que se inscreveram para fotografia
 */
export function generateEstabelecimentosFotografo() {
  const estabelecimentosList = []
  
  // Pega alguns estabelecimentos e adiciona informações de contato e horário
  estabelecimentos.slice(0, 10).forEach((estabelecimento, idx) => {
    const dataAgendamento = new Date()
    dataAgendamento.setDate(dataAgendamento.getDate() + idx)
    dataAgendamento.setHours(9 + idx % 8, 0, 0, 0)
    
    estabelecimentosList.push({
      id: estabelecimento.id,
      nome: estabelecimento.name,
      endereco: estabelecimento.endereco,
      telefone: estabelecimento.telefone,
      email: `contato@${estabelecimento.name.toLowerCase().replace(/\s+/g, '')}.com.br`,
      horarioAgendado: dataAgendamento.toISOString(),
      status: idx < 3 ? 'agendado' : idx < 6 ? 'pendente' : 'confirmado',
      observacoes: idx % 2 === 0 ? 'Preferência por horário da manhã' : null,
    })
  })
  
  return estabelecimentosList
}

/**
 * Gera lista de receitas prontas para fotografia
 */
export function generateReceitasParaFoto() {
  const receitasList = []
  
  // Pega alguns pratos e adiciona informações de status de foto
  pratos.slice(0, 15).forEach((prato, idx) => {
    const estabelecimento = estabelecimentos.find(e => e.id === prato.estabelecimentoId)
    
    receitasList.push({
      id: prato.id,
      nome: prato.name,
      estabelecimentoId: prato.estabelecimentoId,
      estabelecimentoNome: estabelecimento?.name || 'Restaurante',
      categoriaId: prato.categoriaId,
      descricao: prato.descricao,
      preco: prato.preco,
      disponivel: prato.ativo,
      foto: idx < 5 ? null : `https://images.unsplash.com/photo-${1546069901 + idx}?w=800&h=600&fit=crop`, // Primeiros 5 sem foto
      fotoStatus: idx < 5 ? 'pendente' : idx < 10 ? 'enviada' : 'aprovada',
      dataCadastro: new Date(Date.now() - idx * 86400000).toISOString(),
      observacoesRestaurante: idx % 3 === 0 ? 'Prato deve ser fotografado com iluminação natural' : null,
    })
  })
  
  return receitasList
}

/**
 * Filtra receitas por status
 */
export function filterReceitasByStatus(receitas, status) {
  if (!status || status === 'todas') return receitas
  return receitas.filter(r => r.fotoStatus === status)
}

/**
 * Filtra estabelecimentos por status
 */
export function filterEstabelecimentosByStatus(estabelecimentos, status) {
  if (!status || status === 'todos') return estabelecimentos
  return estabelecimentos.filter(e => e.status === status)
}

