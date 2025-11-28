/**
 * Mock de dados de clientes/jurados
 */

import { randomInt, randomFloat, randomDate } from '../utils/faker'

// Opções de perfil
const GENEROS = ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']
const FAIXAS_RENDA = [
  'Até R$ 2.000',
  'R$ 2.000 - R$ 5.000',
  'R$ 5.000 - R$ 10.000',
  'R$ 10.000 - R$ 20.000',
  'Acima de R$ 20.000',
]
const FAIXAS_IDADE = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
const CIDADES = ['Bauru', 'Marília', 'Botucatu', 'São José do Rio Preto']

// Lista de badges disponíveis
export const BADGES_DISPONIVEIS = [
  { code: 'first_vote', name: 'Primeira Avaliação', emoji: '🎉', description: 'Fez a primeira avaliação' },
  { code: 'complete_profile', name: 'Perfil Completo', emoji: '⭐', description: 'Preencheu todos os dados do perfil' },
  { code: 'frequent_voter', name: 'Avaliador Frequente', emoji: '🔥', description: 'Fez 10 ou mais avaliações' },
  { code: 'super_voter', name: 'Super Avaliador', emoji: '💎', description: 'Fez 50 ou mais avaliações' },
  { code: 'top_10', name: 'Top 10', emoji: '🏆', description: 'Está entre os 10 primeiros' },
  { code: 'top_3', name: 'Top 3', emoji: '👑', description: 'Está entre os 3 primeiros' },
  { code: 'explorer', name: 'Explorador', emoji: '🧭', description: 'Avaliou 5 categorias diferentes' },
  { code: 'gourmet', name: 'Gourmet', emoji: '🍽️', description: 'Média de notas acima de 4.5' },
]

/**
 * Gera badges baseado em critérios
 */
export function generateBadges(profile) {
  const badges = []
  
  // Badge de primeira avaliação
  if (profile.totalAvaliacoes >= 1) {
    badges.push({
      code: 'first_vote',
      name: 'Primeira Avaliação',
      emoji: '🎉',
      earned: true,
      description: 'Você fez sua primeira avaliação!',
    })
  }
  
  // Badge de perfil completo
  const camposPreenchidos = [
    profile.foto,
    profile.idade,
    profile.genero,
    profile.renda,
    profile.localizacao,
  ].filter(Boolean).length
  
  if (camposPreenchidos === 5) {
    badges.push({
      code: 'complete_profile',
      name: 'Perfil Completo',
      emoji: '⭐',
      earned: true,
      description: 'Você preencheu todos os dados do perfil!',
    })
  }
  
  // Badge de avaliações frequentes
  if (profile.totalAvaliacoes >= 10) {
    badges.push({
      code: 'frequent_voter',
      name: 'Avaliador Frequente',
      emoji: '🔥',
      earned: true,
      description: 'Você fez 10 ou mais avaliações!',
    })
  }
  
  // Badge de top 10
  if (profile.posicaoRanking <= 10 && profile.posicaoRanking > 0) {
    badges.push({
      code: 'top_10',
      name: 'Top 10',
      emoji: '🏆',
      earned: true,
      description: 'Você está entre os 10 primeiros!',
    })
  }
  
  // Badge de top 3
  if (profile.posicaoRanking <= 3 && profile.posicaoRanking > 0) {
    badges.push({
      code: 'top_3',
      name: 'Top 3',
      emoji: '👑',
      earned: true,
      description: 'Você está entre os 3 primeiros!',
    })
  }
  
  return badges
}

/**
 * Calcula pontos do perfil baseado em dados preenchidos
 */
export function calculateProfilePoints(profile) {
  let points = 0
  
  // Pontos por campo preenchido
  if (profile.foto) points += 10
  if (profile.idade) points += 5
  if (profile.genero) points += 5
  if (profile.renda) points += 10
  if (profile.localizacao) points += 10
  
  // Pontos por avaliações
  points += profile.totalAvaliacoes * 20
  
  return points
}

/**
 * Gera perfil mock de cliente
 */
export function generateClienteProfile(userId, cpf, phone) {
  const totalAvaliacoes = randomInt(0, 50)
  const posicaoRanking = totalAvaliacoes > 0 ? randomInt(1, 100) : null
  
  const profile = {
    id: userId,
    cpf: cpf || '000.000.000-00',
    phone: phone || '(00) 00000-0000',
    nome: `Cliente ${userId}`,
    foto: null, // Pode ser preenchido
    idade: null, // Pode ser preenchido
    genero: null, // Pode ser preenchido
    renda: null, // Pode ser preenchido
    localizacao: null, // Pode ser preenchido
    totalAvaliacoes,
    posicaoRanking,
    pontos: 0,
    nivel: totalAvaliacoes >= 50 ? 5 : totalAvaliacoes >= 30 ? 4 : totalAvaliacoes >= 15 ? 3 : totalAvaliacoes >= 5 ? 2 : 1,
    nivelLabel: totalAvaliacoes >= 50 ? 'Mestre' : totalAvaliacoes >= 30 ? 'Expert' : totalAvaliacoes >= 15 ? 'Avançado' : totalAvaliacoes >= 5 ? 'Intermediário' : 'Iniciante',
  }
  
  profile.pontos = calculateProfilePoints(profile)
  profile.badges = generateBadges(profile)
  
  return profile
}

/**
 * Gera ranking de clientes
 */
export function generateRanking(limit = 10) {
  const ranking = []
  
  for (let i = 1; i <= limit; i++) {
    const totalAvaliacoes = randomInt(1, 100)
    const pontos = totalAvaliacoes * 20 + randomInt(0, 100)
    
    ranking.push({
      posicao: i,
      clienteId: i,
      nome: `Cliente ${i}`,
      foto: null,
      totalAvaliacoes,
      pontos,
      nivel: totalAvaliacoes >= 50 ? 5 : totalAvaliacoes >= 30 ? 4 : totalAvaliacoes >= 15 ? 3 : totalAvaliacoes >= 5 ? 2 : 1,
      nivelLabel: totalAvaliacoes >= 50 ? 'Mestre' : totalAvaliacoes >= 30 ? 'Expert' : totalAvaliacoes >= 15 ? 'Avançado' : totalAvaliacoes >= 5 ? 'Intermediário' : 'Iniciante',
    })
  }
  
  return ranking.sort((a, b) => b.pontos - a.pontos).map((item, idx) => ({
    ...item,
    posicao: idx + 1,
  }))
}

/**
 * Gera histórico de avaliações de um cliente
 */
export function generateAvaliacoesHistory(clienteId, limit = 20) {
  const avaliacoes = []
  const pratos = ['Pizza Margherita', 'Hambúrguer Artesanal', 'Sushi Premium', 'Risotto de Camarão', 'Salada Caesar']
  const estabelecimentos = ['Restaurante Sabor', 'Cantina Tradição', 'Bistrô Moderno', 'Casa da Massa', 'Sushi Bar']
  
  for (let i = 0; i < limit; i++) {
    const data = new Date()
    data.setDate(data.getDate() - i)
    
    avaliacoes.push({
      id: `AVAL_${clienteId}_${i}`,
      pratoNome: pratos[randomInt(0, pratos.length - 1)],
      estabelecimentoNome: estabelecimentos[randomInt(0, estabelecimentos.length - 1)],
      data: data.toISOString(),
      apresentacao: randomFloat(3.0, 5.0),
      sabor: randomFloat(3.0, 5.0),
      experiencia: randomFloat(3.0, 5.0),
      notaFinal: randomFloat(3.0, 5.0),
      comentario: i % 3 === 0 ? 'Excelente prato!' : null,
      foto: `https://i.pravatar.cc/150?img=${randomInt(1, 70)}`,
    })
  }
  
  return avaliacoes
}

/**
 * Gera lista completa de clientes para o admin
 */
let clientesCache = null
export function generateClientesList(count = 100) {
  if (clientesCache) return clientesCache
  
  const clientes = []
  const nomes = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Lima',
    'Juliana Souza', 'Ricardo Ferreira', 'Fernanda Alves', 'Bruno Rodrigues', 'Camila Pereira',
    'Lucas Martins', 'Amanda Gomes', 'Rafael Nascimento', 'Beatriz Ribeiro', 'Gustavo Carvalho',
  ]
  
  for (let i = 1; i <= count; i++) {
    const totalAvaliacoes = randomInt(0, 80)
    const perfilCompleto = Math.random() > 0.3
    
    const cliente = {
      id: i,
      nome: nomes[randomInt(0, nomes.length - 1)] + ` ${i}`,
      email: `cliente${i}@email.com`,
      telefone: `(14) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
      cpf: `${randomInt(100, 999)}.${randomInt(100, 999)}.${randomInt(100, 999)}-${randomInt(10, 99)}`,
      foto: perfilCompleto && Math.random() > 0.5 ? '/avatar.jpg' : null,
      idade: perfilCompleto ? FAIXAS_IDADE[randomInt(0, FAIXAS_IDADE.length - 1)] : null,
      genero: perfilCompleto ? GENEROS[randomInt(0, GENEROS.length - 1)] : null,
      renda: perfilCompleto && Math.random() > 0.4 ? FAIXAS_RENDA[randomInt(0, FAIXAS_RENDA.length - 1)] : null,
      localizacao: perfilCompleto ? CIDADES[randomInt(0, CIDADES.length - 1)] : null,
      totalAvaliacoes,
      pontos: totalAvaliacoes * 20 + (perfilCompleto ? 40 : 0) + randomInt(0, 50),
      posicaoRanking: null, // Será calculado depois
      dataCadastro: randomDate(180).toISOString(),
      ultimaAtividade: randomDate(30).toISOString(),
      ativo: Math.random() > 0.1,
      juradoTecnico: Math.random() > 0.95, // 5% são jurados técnicos
      badges: [],
    }
    
    // Gera badges
    cliente.badges = generateBadges(cliente)
    
    clientes.push(cliente)
  }
  
  // Ordena por pontos e atribui posição no ranking
  clientes.sort((a, b) => b.pontos - a.pontos)
  clientes.forEach((c, idx) => {
    c.posicaoRanking = idx + 1
    // Atualiza badges de ranking
    c.badges = generateBadges(c)
  })
  
  clientesCache = clientes
  return clientes
}

/**
 * Retorna estatísticas de clientes
 */
export function getClientesStats(cityId = null, editionId = null) {
  const clientes = generateClientesList()
  
  // Filtro por cidade se necessário
  const filtered = cityId 
    ? clientes.filter(c => c.localizacao === CIDADES[cityId - 1])
    : clientes
  
  // Contagem por gênero
  const porGenero = {}
  GENEROS.forEach(g => porGenero[g] = 0)
  filtered.forEach(c => {
    if (c.genero) porGenero[c.genero]++
  })
  
  // Contagem por faixa etária
  const porIdade = {}
  FAIXAS_IDADE.forEach(f => porIdade[f] = 0)
  filtered.forEach(c => {
    if (c.idade) porIdade[c.idade]++
  })
  
  // Contagem por renda
  const porRenda = {}
  FAIXAS_RENDA.forEach(r => porRenda[r] = 0)
  filtered.forEach(c => {
    if (c.renda) porRenda[c.renda]++
  })
  
  // Badges mais conquistados
  const badgesCount = {}
  BADGES_DISPONIVEIS.forEach(b => badgesCount[b.code] = 0)
  filtered.forEach(c => {
    c.badges.forEach(b => {
      if (b.earned) badgesCount[b.code]++
    })
  })
  const badgesRanking = BADGES_DISPONIVEIS.map(b => ({
    ...b,
    quantidade: badgesCount[b.code],
  })).sort((a, b) => b.quantidade - a.quantidade)
  
  return {
    total: filtered.length,
    ativos: filtered.filter(c => c.ativo).length,
    comPerfilCompleto: filtered.filter(c => c.foto && c.idade && c.genero && c.renda && c.localizacao).length,
    juradosTecnicos: filtered.filter(c => c.juradoTecnico).length,
    totalAvaliacoes: filtered.reduce((sum, c) => sum + c.totalAvaliacoes, 0),
    porGenero: Object.entries(porGenero).map(([nome, quantidade]) => ({ nome, quantidade })),
    porIdade: Object.entries(porIdade).map(([faixa, quantidade]) => ({ faixa, quantidade })),
    porRenda: Object.entries(porRenda).map(([faixa, quantidade]) => ({ faixa, quantidade })),
    badgesRanking,
  }
}

/**
 * Retorna top 10 clientes
 */
export function getTopClientes(limit = 10) {
  const clientes = generateClientesList()
  return clientes.slice(0, limit)
}

/**
 * Busca clientes com filtros
 */
export function searchClientes({ search = '', genero = 'all', idade = 'all', renda = 'all', juradoTecnico = 'all' }) {
  let clientes = generateClientesList()
  
  if (search) {
    const searchLower = search.toLowerCase()
    clientes = clientes.filter(c => 
      c.nome.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.cpf.includes(search)
    )
  }
  
  if (genero !== 'all') {
    clientes = clientes.filter(c => c.genero === genero)
  }
  
  if (idade !== 'all') {
    clientes = clientes.filter(c => c.idade === idade)
  }
  
  if (renda !== 'all') {
    clientes = clientes.filter(c => c.renda === renda)
  }
  
  if (juradoTecnico !== 'all') {
    clientes = clientes.filter(c => c.juradoTecnico === (juradoTecnico === 'true'))
  }
  
  return clientes
}

/**
 * Promove cliente para jurado técnico
 */
export function promoverJuradoTecnico(clienteId) {
  const clientes = generateClientesList()
  const cliente = clientes.find(c => c.id === clienteId)
  if (cliente) {
    cliente.juradoTecnico = true
  }
  return cliente
}

/**
 * Remove status de jurado técnico
 */
export function removerJuradoTecnico(clienteId) {
  const clientes = generateClientesList()
  const cliente = clientes.find(c => c.id === clienteId)
  if (cliente) {
    cliente.juradoTecnico = false
  }
  return cliente
}

export { GENEROS, FAIXAS_RENDA, FAIXAS_IDADE, CIDADES }

