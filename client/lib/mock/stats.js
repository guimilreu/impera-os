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
 * Se cityId ou editionId for null, calcula dados agregados de todas as cidades/edições
 */
export function getDashboardStats(cityId = null, editionId = null) {
  // Filtra dados por tenant
  let votosFiltrados = votos
  let estabelecimentosFiltrados = estabelecimentos
  let pratosFiltrados = pratos
  
  if (cityId && editionId) {
    // Filtra por cidade e edição específicas
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
    
    estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
    
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    pratosFiltrados = pratos.filter(p => estabelecimentosIds.includes(p.estabelecimentoId))
  } else if (cityId && !editionId) {
    // Filtra por cidade (todas as edições)
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId
    })
    
    estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId
    )
    
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    pratosFiltrados = pratos.filter(p => estabelecimentosIds.includes(p.estabelecimentoId))
  }
  // Se ambos forem null, usa todos os dados (todas as cidades e edições)
  
  const votosValidos = votosFiltrados.filter(v => v.valido).length
  const votosSuspeitos = votosFiltrados.filter(v => v.suspeito).length
  const votosPendentes = votosFiltrados.filter(v => v.pendente || (!v.valido && !v.suspeito)).length
  const taxaAprovacao = votosFiltrados.length > 0 
    ? ((votosValidos / votosFiltrados.length) * 100).toFixed(1)
    : 0
  
  const mediaGeral = votosFiltrados.length > 0
    ? votosFiltrados.reduce((acc, v) => acc + v.total, 0) / votosFiltrados.length
    : 0
  
  // Média bayesiana mock (simplificada)
  const mediaBayesiana = mediaGeral + randomFloat(-0.2, 0.2)
  
  // Calcula clientes únicos (simula baseado em votos válidos)
  // Cada cliente pode ter votado múltiplas vezes, então estimamos ~70% dos votos válidos são de clientes únicos
  const clientesCadastrados = Math.round(votosValidos * 0.7)
  
  return {
    totalVotos: votosFiltrados.length,
    votosValidos,
    votosSuspeitos,
    votosPendentes,
    taxaAprovacao: parseFloat(taxaAprovacao),
    totalEstabelecimentos: estabelecimentosFiltrados.length,
    totalPratos: pratosFiltrados.length,
    clientesCadastrados,
    avaliacoesTotais: votosValidos, // Avaliações = votos válidos
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
  } else if (cityId && !editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId
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
  } else if (cityId && !editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId
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
  } else if (cityId && !editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId
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
  } else if (cityId && !editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId
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
 * Retorna destaques da edição (filtrados por tenant se fornecido)
 */
export function getDestaquesEdicao(cityId = null, editionId = null) {
  let votosFiltrados = votos
  let estabelecimentosFiltrados = estabelecimentos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
    
    estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
  } else if (cityId && !editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId
    })
    
    estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId
    )
  }
  
  const categoriaMaisAtiva = categorias.reduce((prev, curr) => {
    const votosPrev = votosFiltrados.filter(v => v.categoriaId === prev.id).length
    const votosCurr = votosFiltrados.filter(v => v.categoriaId === curr.id).length
    return votosCurr > votosPrev ? curr : prev
  }, categorias[0])
  
  const estabelecimentoMaisVotado = estabelecimentosFiltrados.length > 0
    ? estabelecimentosFiltrados.sort((a, b) => b.totalVotos - a.totalVotos)[0]
    : estabelecimentos[0]
  
  // Calcula crescimento diário comparando últimos 2 dias
  const hoje = new Date()
  const ontem = new Date(hoje)
  ontem.setDate(ontem.getDate() - 1)
  
  const votosHoje = votosFiltrados.filter(v => {
    const votoDate = new Date(v.horario)
    return votoDate.toDateString() === hoje.toDateString()
  }).length
  
  const votosOntem = votosFiltrados.filter(v => {
    const votoDate = new Date(v.horario)
    return votoDate.toDateString() === ontem.toDateString()
  }).length
  
  const crescimentoDiario = votosOntem > 0
    ? ((votosHoje - votosOntem) / votosOntem) * 100
    : votosHoje > 0 ? 100 : 0
  
  return {
    categoriaMaisAtiva: {
      ...categoriaMaisAtiva,
      votos: votosFiltrados.filter(v => v.categoriaId === categoriaMaisAtiva.id).length,
    },
    estabelecimentoMaisVotado,
    crescimentoDiario: parseFloat(crescimentoDiario.toFixed(1)),
  }
}

/**
 * Retorna ranking de restaurantes por categoria (baseado em nota final dos votos válidos)
 */
export function getRankingPorCategoria(cityId = null, editionId = null) {
  let votosFiltrados = votos
  let estabelecimentosFiltrados = estabelecimentos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
    
    estabelecimentosFiltrados = estabelecimentos.filter(
      e => e.cidadeId === cityId && e.edicaoId === editionId
    )
  }
  
  // Filtra apenas votos válidos
  const votosValidos = votosFiltrados.filter(v => v.valido)
  
  // Peso para jurados técnicos (3x) vs clientes normais (1x)
  const PESO_JURADO = 3
  const PESO_NORMAL = 1
  
  // Agrupa por categoria
  return categorias.map(categoria => {
    // Pega votos válidos desta categoria
    const votosCategoria = votosValidos.filter(v => v.categoriaId === categoria.id)
    
    // Agrupa votos por estabelecimento
    const estabelecimentosComVotos = {}
    
    votosCategoria.forEach(voto => {
      const estabelecimentoId = voto.estabelecimentoId
      
      if (!estabelecimentosComVotos[estabelecimentoId]) {
        estabelecimentosComVotos[estabelecimentoId] = {
          estabelecimentoId,
          estabelecimentoNome: voto.estabelecimentoNome,
          votos: [],
          votosJurados: 0,
          votosNormais: 0,
        }
      }
      
      // Adiciona voto com peso
      const peso = voto.isJuradoTecnico ? PESO_JURADO : PESO_NORMAL
      estabelecimentosComVotos[estabelecimentoId].votos.push({
        nota: voto.total,
        peso,
        isJurado: voto.isJuradoTecnico,
      })
      
      if (voto.isJuradoTecnico) {
        estabelecimentosComVotos[estabelecimentoId].votosJurados++
      } else {
        estabelecimentosComVotos[estabelecimentoId].votosNormais++
      }
    })
    
    // Calcula nota final PONDERADA e quantidade de votos para cada estabelecimento
    const ranking = Object.values(estabelecimentosComVotos)
      .map(item => {
        const quantidadeVotos = item.votos.length
        
        // Calcula nota ponderada: (soma de notas * peso) / (soma dos pesos)
        const somaPonderada = item.votos.reduce((sum, v) => sum + (v.nota * v.peso), 0)
        const somaDosPesos = item.votos.reduce((sum, v) => sum + v.peso, 0)
        const notaFinal = somaDosPesos > 0 ? somaPonderada / somaDosPesos : 0
        
        return {
          estabelecimentoId: item.estabelecimentoId,
          estabelecimentoNome: item.estabelecimentoNome,
          quantidadeVotos,
          votosJurados: item.votosJurados,
          votosNormais: item.votosNormais,
          notaFinal: parseFloat(notaFinal.toFixed(2)),
          // Indica que a nota é ponderada
          notaPonderada: true,
        }
      })
      .sort((a, b) => {
        // Ordena por nota final (decrescente), depois por quantidade de votos (decrescente)
        if (b.notaFinal !== a.notaFinal) {
          return b.notaFinal - a.notaFinal
        }
        return b.quantidadeVotos - a.quantidadeVotos
      })
      .map((item, index) => ({
        ...item,
        colocacao: index + 1,
      }))
    
    return {
      categoria: {
        id: categoria.id,
        name: categoria.name,
        icon: categoria.icon,
      },
      ranking,
    }
  })
}

/**
 * Calcula projeção de votos até o final do circuito
 */
export function getProjecaoVotos(cityId = null, editionId = null) {
  let votosFiltrados = votos
  
  if (cityId && editionId) {
    votosFiltrados = votos.filter(v => {
      const estabelecimento = estabelecimentos.find(e => e.id === v.estabelecimentoId)
      return estabelecimento?.cidadeId === cityId && estabelecimento?.edicaoId === editionId
    })
  }
  
  const votosValidos = votosFiltrados.filter(v => v.valido).length
  
  // Calcula média diária dos últimos 7 dias
  const hoje = new Date()
  const ultimos7Dias = []
  
  for (let i = 6; i >= 0; i--) {
    const data = new Date(hoje)
    data.setDate(data.getDate() - i)
    
    const votosDoDia = votosFiltrados.filter(v => {
      const votoDate = new Date(v.horario)
      return votoDate.toDateString() === data.toDateString() && v.valido
    }).length
    
    ultimos7Dias.push(votosDoDia)
  }
  
  const mediaDiaria = ultimos7Dias.reduce((sum, v) => sum + v, 0) / 7
  
  // Assume que o circuito tem 30 dias restantes (mock)
  const diasRestantes = 30
  const projecao = Math.round(votosValidos + (mediaDiaria * diasRestantes))
  
  return {
    votosAtuais: votosValidos,
    mediaDiaria: parseFloat(mediaDiaria.toFixed(1)),
    diasRestantes,
    projecao,
  }
}

