/**
 * Mock de votos
 */

import { randomInt, randomFloat, randomDate, mockHash, mockGPS } from '../utils/faker'
import { pratos } from './pratos'
import { estabelecimentos } from './estabelecimentos'

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
    const valido = gpsOk && Math.random() > 0.1 // 90% válidos
    
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
      foto: '/prato.jpg',
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
      suspeito: !valido,
      motivoSuspeito: !valido ? (gpsOk ? 'Foto duplicada' : 'GPS inconsistente') : null,
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
  }
  
  return filtered.slice(0, limit)
}

/**
 * Retorna votos válidos
 */
export function getVotosValidos() {
  return votos.filter(v => v.valido)
}

/**
 * Retorna votos suspeitos
 */
export function getVotosSuspeitos() {
  return votos.filter(v => v.suspeito)
}

