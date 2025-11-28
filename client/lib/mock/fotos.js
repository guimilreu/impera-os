/**
 * Mock de fotos enviadas por fotógrafos
 */

import { randomInt, randomDate } from '../utils/faker'
import { pratos } from './pratos'
import { estabelecimentos } from './estabelecimentos'

/**
 * URLs de imagens de comida do Unsplash para mock
 */
const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop', // Prato principal
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop', // Pizza
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop', // Comida italiana
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop', // Hambúrguer
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', // Comida gourmet
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop', // Prato brasileiro
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop', // Comida caseira
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop', // Prato elaborado
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop', // Comida artesanal
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop', // Prato sofisticado
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop', // Comida tradicional
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop', // Prato gourmet
  'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&h=600&fit=crop', // Hambúrguer artesanal
  'https://images.unsplash.com/photo-1563379091339-03246963d47b?w=800&h=600&fit=crop', // Comida brasileira
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&h=600&fit=crop', // Prato italiano
  'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop', // Comida caseira
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop', // Prato tradicional
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop', // Comida elaborada
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop', // Prato sofisticado
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop', // Comida artesanal
]

/**
 * Gera fotos enviadas por fotógrafos para aprovação
 */
export function generateFotosReceitas() {
  const fotos = []
  const fotografos = ['João Silva', 'Maria Santos', 'Carlos Oliveira', 'Ana Costa', 'Pedro Alves']
  
  // Para cada prato, gera algumas fotos enviadas
  pratos.slice(0, 15).forEach((prato, pratoIndex) => {
    const estabelecimento = estabelecimentos.find(e => e.id === prato.estabelecimentoId)
    const numFotos = randomInt(1, 4) // 1 a 4 fotos por prato
    
    for (let i = 0; i < numFotos; i++) {
      const dataEnvio = randomDate(15)
      const statusRandom = Math.random()
      let status = 'pendente' // 50% pendente
      if (statusRandom > 0.5 && statusRandom < 0.75) status = 'aprovada' // 25% aprovada
      if (statusRandom >= 0.75) status = 'rejeitada' // 25% rejeitada
      
      const imageIndex = (pratoIndex * numFotos + i) % FOOD_IMAGES.length
      const imageUrl = FOOD_IMAGES[imageIndex]
      
      fotos.push({
        id: `FOTO_${prato.id}_${i}`,
        pratoId: prato.id,
        pratoNome: prato.name,
        estabelecimentoId: estabelecimento?.id,
        estabelecimentoNome: estabelecimento?.name,
        categoriaId: prato.categoriaId,
        url: imageUrl,
        thumbnailUrl: imageUrl + '&w=300&h=300&fit=crop',
        fotografoId: randomInt(1, 5),
        fotografoNome: fotografos[randomInt(0, fotografos.length - 1)],
        dataEnvio: dataEnvio.toISOString(),
        status, // pendente | aprovada | rejeitada
        moderadoPor: status !== 'pendente' ? ['Admin', 'Moderador', 'Sócio Local'][randomInt(0, 2)] : null,
        dataModeração: status !== 'pendente' ? new Date(dataEnvio.getTime() + randomInt(1, 3) * 86400000).toISOString() : null,
        motivoRejeicao: status === 'rejeitada' ? ['Iluminação ruim', 'Fora de foco', 'Ângulo inadequado', 'Foto não corresponde ao prato', 'Qualidade insuficiente'][randomInt(0, 4)] : null,
        observacoes: i === 0 ? ['Foto tirada com luz natural', 'Sessão realizada no restaurante', 'Foto profissional com equipamento DSLR', 'Iluminação artificial controlada'][randomInt(0, 3)] : null,
      })
    }
  })
  
  return fotos.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
}

export const fotosReceitas = generateFotosReceitas()

/**
 * Filtra fotos por status
 */
export function filterFotosByStatus(status = 'todas') {
  if (status === 'todas') return fotosReceitas
  return fotosReceitas.filter(f => f.status === status)
}

/**
 * Filtra fotos por prato
 */
export function getFotosByPrato(pratoId) {
  return fotosReceitas.filter(f => f.pratoId === pratoId)
}

/**
 * Retorna estatísticas de fotos
 */
export function getFotosStats() {
  return {
    total: fotosReceitas.length,
    pendentes: fotosReceitas.filter(f => f.status === 'pendente').length,
    aprovadas: fotosReceitas.filter(f => f.status === 'aprovada').length,
    rejeitadas: fotosReceitas.filter(f => f.status === 'rejeitada').length,
  }
}

