/**
 * Utilitários centralizados para filtros de tenant e listas
 * Evita duplicação de lógica de filtro por cidade/edição em múltiplos arquivos
 */

/**
 * Filtra array de itens por tenant (cidade e edição)
 * @param {Array} items - Array de itens a filtrar
 * @param {number|null} cityId - ID da cidade (null = todas)
 * @param {number|null} editionId - ID da edição (null = todas)
 * @param {Object} options - Opções de configuração
 * @param {string} options.cityKey - Nome do campo de cidade no item (default: 'cidadeId')
 * @param {string} options.editionKey - Nome do campo de edição no item (default: 'edicaoId')
 * @returns {Array} - Array filtrado
 */
export function filterByTenant(items, cityId = null, editionId = null, options = {}) {
  const { cityKey = 'cidadeId', editionKey = 'edicaoId' } = options
  
  if (!cityId) return items
  
  return items.filter(item => {
    const matchCity = item[cityKey] === cityId
    if (!editionId) return matchCity
    return matchCity && item[editionKey] === editionId
  })
}

/**
 * Filtra itens por estabelecimento, considerando tenant
 * @param {Array} items - Array de itens a filtrar
 * @param {Array} estabelecimentos - Array de estabelecimentos para cruzamento
 * @param {number|null} cityId - ID da cidade
 * @param {number|null} editionId - ID da edição
 * @param {Object} options - Opções de configuração
 * @param {string} options.estabelecimentoKey - Nome do campo de estabelecimento no item (default: 'estabelecimentoId')
 * @returns {Array} - Array filtrado
 */
export function filterByEstabelecimentoTenant(items, estabelecimentos, cityId = null, editionId = null, options = {}) {
  const { estabelecimentoKey = 'estabelecimentoId' } = options
  
  if (!cityId) return items
  
  const estabelecimentosFiltrados = filterByTenant(estabelecimentos, cityId, editionId)
  const estabelecimentosIds = new Set(estabelecimentosFiltrados.map(e => e.id))
  
  return items.filter(item => estabelecimentosIds.has(item[estabelecimentoKey]))
}

/**
 * Ordena e limita um array, adicionando posição
 * @param {Array} items - Array de itens
 * @param {Object} options - Opções de ordenação
 * @param {string} options.sortBy - Campo para ordenar (default: 'totalVotos')
 * @param {string} options.order - Ordem: 'desc' ou 'asc' (default: 'desc')
 * @param {number} options.limit - Limite de itens (default: 10)
 * @param {boolean} options.addPosition - Adicionar campo 'posicao' (default: true)
 * @returns {Array} - Array ordenado e limitado
 */
export function sortAndLimit(items, options = {}) {
  const { 
    sortBy = 'totalVotos', 
    order = 'desc', 
    limit = 10, 
    addPosition = true 
  } = options
  
  const sorted = [...items].sort((a, b) => {
    const aVal = a[sortBy] ?? 0
    const bVal = b[sortBy] ?? 0
    return order === 'desc' ? bVal - aVal : aVal - bVal
  })
  
  const limited = sorted.slice(0, limit)
  
  if (!addPosition) return limited
  
  return limited.map((item, idx) => ({ ...item, posicao: idx + 1 }))
}

/**
 * Agrupa itens por um campo específico
 * @param {Array} items - Array de itens
 * @param {string} key - Campo para agrupar
 * @returns {Object} - Objeto com chaves sendo os valores do campo
 */
export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const groupKey = item[key]
    if (!acc[groupKey]) acc[groupKey] = []
    acc[groupKey].push(item)
    return acc
  }, {})
}

/**
 * Conta itens por um campo específico
 * @param {Array} items - Array de itens
 * @param {string} key - Campo para contar
 * @returns {Object} - Objeto com chaves sendo os valores e valores sendo as contagens
 */
export function countBy(items, key) {
  return items.reduce((acc, item) => {
    const groupKey = item[key]
    acc[groupKey] = (acc[groupKey] || 0) + 1
    return acc
  }, {})
}

/**
 * Filtra lista por termo de busca em múltiplos campos
 * @param {Array} items - Array de itens
 * @param {string} searchTerm - Termo de busca
 * @param {Array<string>} fields - Campos para buscar
 * @returns {Array} - Array filtrado
 */
export function searchInFields(items, searchTerm, fields) {
  if (!searchTerm || !searchTerm.trim()) return items
  
  const term = searchTerm.toLowerCase().trim()
  
  return items.filter(item => 
    fields.some(field => {
      const value = item[field]
      if (value == null) return false
      return String(value).toLowerCase().includes(term)
    })
  )
}

