/**
 * Mock de votos
 * 
 * Sistema de avaliação:
 * - Votos de clientes normais: peso 1
 * - Votos de jurados técnicos: peso 3 (contam 3x mais na nota final)
 * 
 * A nota final de um prato é calculada como:
 * (soma de notas * peso) / (total de votos * peso)
 */

import { randomInt, randomFloat, randomDate, mockHash, mockGPS } from '../utils/faker'
import { pratos } from './pratos'
import { estabelecimentos } from './estabelecimentos'

// Peso do voto de jurado técnico (vale 3x mais)
export const PESO_JURADO_TECNICO = 3
export const PESO_CLIENTE_NORMAL = 1

export function generateVotos(count = 100) {
  const votos = []
  
  for (let i = 1; i <= count; i++) {
    const prato = pratos[randomInt(0, pratos.length - 1)]
    const estabelecimento = estabelecimentos.find(
      e => e.id === prato.estabelecimentoId
    )
    
    const dataVoto = randomDate(30)
    const apresentacao = randomFloat(3.0, 5.0)
    const sabor = randomFloat(3.0, 5.0)
    const experiencia = randomFloat(3.0, 5.0)
    const total = (apresentacao + sabor + experiencia) / 3
    
    const gps = mockGPS()
    const gpsOk = Math.random() > 0.15 // 85% válidos
    // 60% válidos, 20% suspeitos, 20% pendentes
    const statusRandom = Math.random()
    const valido = statusRandom < 0.6 && gpsOk
    const suspeito = statusRandom >= 0.6 && statusRandom < 0.8
    
    // 5% dos votos são de jurados técnicos
    const isJuradoTecnico = Math.random() > 0.95
    
    votos.push({
      id: i,
      pratoId: prato.id,
      pratoNome: prato.name,
      estabelecimentoId: estabelecimento?.id || 1,
      estabelecimentoNome: estabelecimento?.name || 'Restaurante',
      categoriaId: prato.categoriaId,
      apresentacao,
      sabor,
      experiencia,
      total,
      comentario: i % 3 === 0 ? 'Excelente prato!' : null,
      foto: `https://images.unsplash.com/photo-${1546069901 + (i % 20)}?w=800&h=600&fit=crop`,
      fotoHash: mockHash(32),
      gps: {
        lat: gps.lat,
        lng: gps.lng,
        distancia: randomFloat(0, 0.5),
        valido: gpsOk,
      },
      deviceInfo: {
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        platform: 'iOS',
      },
      horario: dataVoto.toISOString(),
      valido,
      suspeito,
      pendente: !valido && !suspeito,
      motivoSuspeito: suspeito ? (gpsOk ? 'Foto duplicada' : 'GPS inconsistente') : null,
      // Dados do jurado técnico
      clienteId: randomInt(1, 100),
      clienteNome: `Cliente ${randomInt(1, 100)}`,
      isJuradoTecnico,
      peso: isJuradoTecnico ? PESO_JURADO_TECNICO : PESO_CLIENTE_NORMAL,
    })
  }
  
  return votos.sort((a, b) => new Date(b.horario) - new Date(a.horario))
}

export const votos = generateVotos(100)

/**
 * Filtra votos por tenant
 */
export function getVotosByTenant(cityId, editionId) {
  if (!cityId || !editionId) return votos
  
  // Filtra votos por estabelecimentos que pertencem à cidade e edição
  const estabelecimentosFiltrados = estabelecimentos.filter(
    e => e.cidadeId === cityId && e.edicaoId === editionId
  )
  const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
  
  return votos.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
}

/**
 * Retorna últimos votos (filtrados por tenant se fornecido)
 */
export function getUltimosVotos(limit = 10, cityId = null, editionId = null) {
  let filtered = votos
  
  if (cityId && editionId) {
    filtered = getVotosByTenant(cityId, editionId)
  } else if (cityId && !editionId) {
    // Apenas cidade (todas as edições)
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = votos.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
  }
  
  return filtered.slice(0, limit)
}

/**
 * Retorna votos válidos (filtrados por tenant se fornecido)
 */
export function getVotosValidos(cityId = null, editionId = null) {
  let filtered = votos.filter(v => v.valido)
  
  if (cityId && editionId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
  } else if (cityId && !editionId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
  }
  
  // Adiciona campos extras para exibição
  return filtered.map(v => ({
    ...v,
    dataVoto: v.horario,
    notaFinal: v.total,
    clienteNome: `Cliente ${v.id}`,
  }))
}

/**
 * Retorna votos válidos filtrados por estabelecimento específico
 */
export function getVotosValidosByEstabelecimento(estabelecimentoId, cityId = null, editionId = null) {
  let filtered = getVotosValidos(cityId, editionId)
  
  if (estabelecimentoId) {
    filtered = filtered.filter(v => v.estabelecimentoId === estabelecimentoId)
  }
  
  return filtered
}

/**
 * Retorna votos suspeitos (filtrados por tenant se fornecido)
 */
export function getVotosSuspeitos(cityId = null, editionId = null) {
  let filtered = votos.filter(v => v.suspeito)
  
  if (cityId && editionId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
  } else if (cityId && !editionId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
  }
  
  return filtered
}

/**
 * Retorna votos pendentes (filtrados por tenant se fornecido)
 */
export function getVotosPendentes(cityId = null, editionId = null) {
  let filtered = votos.filter(v => v.pendente)
  
  if (cityId && editionId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
  } else if (cityId && !editionId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId
    )
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(v => estabelecimentosIds.includes(v.estabelecimentoId))
  }
  
  return filtered
}

/**
 * Retorna estatísticas de votos para moderação
 */
export function getVotosStatsModeracao(cityId = null, editionId = null) {
  const suspeitos = getVotosSuspeitos(cityId, editionId)
  const pendentes = getVotosPendentes(cityId, editionId)
  const validos = getVotosValidos(cityId, editionId)
  
  // Votos que precisam de revisão de foto
  const precisaFoto = votos.filter(v => !v.foto || v.foto.includes('/prato.jpg'))
  
  return {
    totalSuspeitos: suspeitos.length,
    totalPendentes: pendentes.length,
    totalValidos: validos.length,
    totalPrecisaFoto: precisaFoto.length,
  }
}

/**
 * Calcula a nota final ponderada de um prato considerando:
 * - Votos de clientes normais: peso 1
 * - Votos de jurados técnicos: peso 3
 * 
 * Fórmula: (soma de notas * peso) / (soma dos pesos)
 * 
 * @param {number} pratoId - ID do prato
 * @param {number|null} cityId - ID da cidade (opcional)
 * @param {number|null} editionId - ID da edição (opcional)
 * @returns {object} { notaFinal, totalVotos, votosNormais, votosJurados, pesoTotal }
 */
export function calcularNotaFinalPonderada(pratoId, cityId = null, editionId = null) {
  let votosValidos = getVotosValidos(cityId, editionId)
  
  // Filtra votos do prato
  const votosPrato = votosValidos.filter(v => v.pratoId === pratoId)
  
  if (votosPrato.length === 0) {
    return {
      notaFinal: 0,
      totalVotos: 0,
      votosNormais: 0,
      votosJurados: 0,
      pesoTotal: 0,
    }
  }
  
  // Separa votos normais e de jurados
  const votosNormais = votosPrato.filter(v => !v.isJuradoTecnico)
  const votosJurados = votosPrato.filter(v => v.isJuradoTecnico)
  
  // Calcula soma ponderada
  const somaNormais = votosNormais.reduce((sum, v) => sum + (v.total * PESO_CLIENTE_NORMAL), 0)
  const somaJurados = votosJurados.reduce((sum, v) => sum + (v.total * PESO_JURADO_TECNICO), 0)
  
  // Calcula peso total
  const pesoNormais = votosNormais.length * PESO_CLIENTE_NORMAL
  const pesoJurados = votosJurados.length * PESO_JURADO_TECNICO
  const pesoTotal = pesoNormais + pesoJurados
  
  // Nota final ponderada
  const notaFinal = pesoTotal > 0 ? (somaNormais + somaJurados) / pesoTotal : 0
  
  return {
    notaFinal: Math.round(notaFinal * 100) / 100, // 2 casas decimais
    totalVotos: votosPrato.length,
    votosNormais: votosNormais.length,
    votosJurados: votosJurados.length,
    pesoTotal,
  }
}

/**
 * Retorna ranking de pratos com nota ponderada
 * 
 * @param {number|null} categoriaId - ID da categoria (opcional, filtra por categoria)
 * @param {number|null} cityId - ID da cidade (opcional)
 * @param {number|null} editionId - ID da edição (opcional)
 * @param {number} limit - Limite de resultados
 * @returns {array} Array de pratos com ranking
 */
export function getRankingPonderado(categoriaId = null, cityId = null, editionId = null, limit = 50) {
  let pratosParaRanking = [...pratos]
  
  // Filtra por categoria se fornecida
  if (categoriaId) {
    pratosParaRanking = pratosParaRanking.filter(p => p.categoriaId === categoriaId)
  }
  
  // Filtra por tenant se fornecido
  if (cityId) {
    const estabelecimentosFiltrados = estabelecimentos.filter(e => {
      if (editionId) {
        return e.cidadeId === cityId && e.edicaoId === editionId
      }
      return e.cidadeId === cityId
    })
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    pratosParaRanking = pratosParaRanking.filter(p => estabelecimentosIds.includes(p.estabelecimentoId))
  }
  
  // Calcula nota ponderada para cada prato
  const pratosComNota = pratosParaRanking.map(prato => {
    const calculo = calcularNotaFinalPonderada(prato.id, cityId, editionId)
    const estabelecimento = estabelecimentos.find(e => e.id === prato.estabelecimentoId)
    
    return {
      ...prato,
      estabelecimentoNome: estabelecimento?.name || 'Desconhecido',
      notaPonderada: calculo.notaFinal,
      totalVotos: calculo.totalVotos,
      votosNormais: calculo.votosNormais,
      votosJurados: calculo.votosJurados,
      pesoTotal: calculo.pesoTotal,
    }
  })
  
  // Ordena por nota ponderada (maior primeiro)
  const ranking = pratosComNota
    .filter(p => p.totalVotos > 0) // Apenas pratos com votos
    .sort((a, b) => {
      // Primeiro por nota ponderada
      if (b.notaPonderada !== a.notaPonderada) {
        return b.notaPonderada - a.notaPonderada
      }
      // Desempate por total de votos
      return b.totalVotos - a.totalVotos
    })
    .slice(0, limit)
    .map((prato, idx) => ({
      ...prato,
      posicao: idx + 1,
      classificado: idx < 5, // Top 5 são classificados
    }))
  
  return ranking
}

/**
 * Estatísticas de jurados técnicos
 */
export function getEstatisticasJurados(cityId = null, editionId = null) {
  const votosValidos = getVotosValidos(cityId, editionId)
  
  const votosJurados = votosValidos.filter(v => v.isJuradoTecnico)
  const votosNormais = votosValidos.filter(v => !v.isJuradoTecnico)
  
  return {
    totalVotosJurados: votosJurados.length,
    totalVotosNormais: votosNormais.length,
    totalVotos: votosValidos.length,
    percentualJurados: votosValidos.length > 0 
      ? Math.round((votosJurados.length / votosValidos.length) * 100) 
      : 0,
    mediaNotaJurados: votosJurados.length > 0
      ? Math.round((votosJurados.reduce((sum, v) => sum + v.total, 0) / votosJurados.length) * 100) / 100
      : 0,
    mediaNotaNormais: votosNormais.length > 0
      ? Math.round((votosNormais.reduce((sum, v) => sum + v.total, 0) / votosNormais.length) * 100) / 100
      : 0,
  }
}

/**
 * Aprova um voto pendente/suspeito, tornando-o válido
 * O voto passa a ser contabilizado na avaliação
 * 
 * @param {number} votoId - ID do voto
 * @returns {boolean} - Se a operação foi bem sucedida
 */
export function aprovarVoto(votoId) {
  const voto = votos.find(v => v.id === votoId)
  if (!voto) return false
  
  // Atualiza o status do voto
  voto.valido = true
  voto.suspeito = false
  voto.pendente = false
  voto.motivoSuspeito = null
  voto.dataAprovacao = new Date().toISOString()
  
  return true
}

/**
 * Rejeita um voto, tornando-o inválido
 * O voto NÃO será contabilizado na avaliação
 * 
 * @param {number} votoId - ID do voto
 * @param {string} motivo - Motivo da rejeição
 * @returns {boolean} - Se a operação foi bem sucedida
 */
export function rejeitarVoto(votoId, motivo = 'Rejeitado pela moderação') {
  const voto = votos.find(v => v.id === votoId)
  if (!voto) return false
  
  // Atualiza o status do voto
  voto.valido = false
  voto.suspeito = true
  voto.pendente = false
  voto.motivoSuspeito = motivo
  voto.dataRejeicao = new Date().toISOString()
  
  return true
}

/**
 * Marca um voto como suspeito para análise posterior
 * 
 * @param {number} votoId - ID do voto
 * @param {string} motivo - Motivo da suspeita
 * @returns {boolean} - Se a operação foi bem sucedida
 */
export function marcarSuspeito(votoId, motivo = 'Marcado para revisão') {
  const voto = votos.find(v => v.id === votoId)
  if (!voto) return false
  
  voto.valido = false
  voto.suspeito = true
  voto.pendente = false
  voto.motivoSuspeito = motivo
  
  return true
}

/**
 * Retorna estatísticas de moderação
 */
export function getEstatisticasModeracao(cityId = null, editionId = null) {
  const todoVotos = cityId ? getVotosByTenant(cityId, editionId) : votos
  
  const validos = todoVotos.filter(v => v.valido)
  const suspeitos = todoVotos.filter(v => v.suspeito)
  const pendentes = todoVotos.filter(v => v.pendente)
  
  // Votos aprovados hoje
  const hoje = new Date().toISOString().split('T')[0]
  const aprovadosHoje = validos.filter(v => 
    v.dataAprovacao && v.dataAprovacao.startsWith(hoje)
  )
  
  return {
    totalVotos: todoVotos.length,
    validos: validos.length,
    suspeitos: suspeitos.length,
    pendentes: pendentes.length,
    aprovadosHoje: aprovadosHoje.length,
    taxaAprovacao: todoVotos.length > 0 
      ? Math.round((validos.length / todoVotos.length) * 100) 
      : 0,
  }
}

