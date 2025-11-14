/**
 * Gerador simples de dados mock
 * Não usar biblioteca externa, apenas funções simples
 */

/**
 * Gera número aleatório entre min e max
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Gera número decimal aleatório entre min e max
 */
export function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

/**
 * Seleciona item aleatório de array
 */
export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Gera data aleatória nos últimos N dias
 */
export function randomDate(daysAgo = 30) {
  const now = Date.now()
  const daysAgoMs = daysAgo * 24 * 60 * 60 * 1000
  return new Date(now - Math.random() * daysAgoMs)
}

/**
 * Gera hash mock (simples)
 */
export function mockHash(length = 16) {
  const chars = '0123456789abcdef'
  let hash = ''
  for (let i = 0; i < length; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

/**
 * Gera coordenadas GPS mock (Brasil)
 */
export function mockGPS() {
  // Aproximadamente região de São Paulo
  const lat = -23.5505 + randomFloat(-0.5, 0.5)
  const lng = -46.6333 + randomFloat(-0.5, 0.5)
  return { lat, lng }
}

/**
 * Gera nome de estabelecimento mock
 */
export function mockRestaurantName() {
  const prefixes = ['Restaurante', 'Cantina', 'Bistrô', 'Casa', 'Bar']
  const names = ['Bella Vista', 'Sabor Mineiro', 'Cantinho', 'Tradição', 'Família', 'Alegria', 'Sabor', 'Delícia']
  return `${randomItem(prefixes)} ${randomItem(names)}`
}

/**
 * Gera nome de prato mock
 */
export function mockDishName() {
  const dishes = [
    'Feijoada Completa',
    'Picanha na Chapa',
    'Frango Grelhado',
    'Moqueca de Peixe',
    'Risotto de Camarão',
    'Salada Caesar',
    'Hambúrguer Artesanal',
    'Pizza Margherita',
    'Lasanha à Bolonhesa',
    'Salmão Grelhado',
  ]
  return randomItem(dishes)
}

