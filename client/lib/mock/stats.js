/**
 * Mock de estatísticas e dados para gráficos
 */

import { randomInt, randomFloat, randomDate } from '../utils/faker'
import { votos } from './votos'
import { estabelecimentos } from './estabelecimentos'
import { pratos } from './pratos'
import { categorias } from './categorias'

/**
 * Retorna estatísticas gerais do dashboard (filtradas por tenant se fornecido)
 */
export function getDashboardStats(cityId = null, editionId = null) {
  // Filtra dados por tenant
  let votosFiltrados = votos
  let estabelecimentosFiltrados = estabelecimentos
  let pratosFiltrados = pratos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
    
    estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
    
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    pratosFiltrados = pratos.filter(p => estabelecimentosIds.includes(p.estabelecimentoId))
  }
  
  const votosValidos = votosFiltrados.filter(v => v.valido).length
  const votosSuspeitos = votosFiltrados.filter(v => v.suspeito).length
  const taxaAprovacao = votosFiltrados.length > 0 
    ? ((votosValidos / votosFiltrados.length) * 100).toFixed(1)
    : 0
  
  const mediaGeral = votosFiltrados.length > 0
    ? votosFiltrados.reduce((acc, v) => acc + v.total, 0) / votosFiltrados.length
    : 0
  
  // Média bayesiana mock (simplificada)
  const mediaBayesiana = mediaGeral + randomFloat(-0.2, 0.2)
  
  return {
    totalVotos: votosFiltrados.length,
    votosValidos,
    votosSuspeitos,
    taxaAprovacao: parseFloat(taxaAprovacao),
    totalEstabelecimentos: estabelecimentosFiltrados.length,
    totalPratos: pratosFiltrados.length,
    mediaGeral: parseFloat(mediaGeral.toFixed(2)),
    mediaBayesiana: parseFloat(mediaBayesiana.toFixed(2)),
  }
}

/**
 * Retorna dados para gráfico de votos por dia (últimos 7 dias, filtrados por tenant)
 */
export function getVotosPorDia(cityId = null, editionId = null) {
  let votosFiltrados = votos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
  }
  
  const dias = []
  const hoje = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const data = new Date(hoje)
    data.setDate(data.getDate() - i)
    
    const votosDoDia = votosFiltrados.filter(v => {
      const votoDate = new Date(v.horario)
      return votoDate.toDateString() === data.toDateString()
    }).length
    
    dias.push({
      data: data.toISOString().split('T')[0],
      votos: votosDoDia || randomInt(5, 25),
    })
  }
  
  return dias
}

/**
 * Retorna distribuição de votos por categoria (filtrados por tenant)
 */
export function getDistribuicaoCategorias(cityId = null, editionId = null) {
  let votosFiltrados = votos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
  }
  
  return categorias.map(cat => {
    const votosCategoria = votosFiltrados.filter(
      v => v.categoriaId === cat.id
    ).length
    
    return {
      categoria: cat.name,
      votos: votosCategoria || randomInt(10, 50),
      icon: cat.icon,
    }
  })
}

/**
 * Retorna top pratos mais avaliados
 */
export function getTopPratosAvaliados(limit = 5) {
  const pratosComVotos = pratos.map(p => {
    const votosPrato = votos.filter(v => v.pratoId === p.id)
    return {
      ...p,
      totalVotos: votosPrato.length,
      media: votosPrato.length > 0
        ? votosPrato.reduce((acc, v) => acc + v.total, 0) / votosPrato.length
        : 0,
    }
  })
  
  return pratosComVotos
    .sort((a, b) => b.totalVotos - a.totalVotos)
    .slice(0, limit)
}

/**
 * Retorna distribuição de votos válidos vs inválidos (filtrados por tenant)
 */
export function getVotosValidosVsInvalidos(cityId = null, editionId = null) {
  let votosFiltrados = votos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
  }
  
  const validos = votosFiltrados.filter(v => v.valido).length
  const invalidos = votosFiltrados.filter(v => !v.valido).length
  
  return [
    { name: 'Válidos', value: validos, color: '#22c55e' },
    { name: 'Inválidos', value: invalidos, color: '#ef4444' },
  ]
}

/**
 * Retorna status de GPS (filtrado por tenant)
 */
export function getStatusGPS(cityId = null, editionId = null) {
  let votosFiltrados = votos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
  }
  
  const gpsOk = votosFiltrados.filter(v => v.gps?.valido).length
  const gpsErro = votosFiltrados.filter(v => !v.gps?.valido).length
  
  return [
    { name: 'GPS OK', value: gpsOk, color: '#22c55e' },
    { name: 'GPS Erro', value: gpsErro, color: '#ef4444' },
  ]
}

/**
 * Retorna destaques da edição
 */
export function getDestaquesEdicao() {
  const categoriaMaisAtiva = categorias.reduce((prev, curr) => {
    const votosPrev = votos.filter(v => v.categoriaId === prev.id).length
    const votosCurr = votos.filter(v => v.categoriaId === curr.id).length
    return votosCurr > votosPrev ? curr : prev
  }, categorias[0])
  
  const estabelecimentoMaisVotado = estabelecimentos
    .sort((a, b) => b.totalVotos - a.totalVotos)[0]
  
  const crescimentoDiario = randomFloat(5, 25)
  
  return {
    categoriaMaisAtiva: {
      ...categoriaMaisAtiva,
      votos: votos.filter(v => v.categoriaId === categoriaMaisAtiva.id).length,
    },
    estabelecimentoMaisVotado,
    crescimentoDiario: parseFloat(crescimentoDiario.toFixed(1)),
  }
}

