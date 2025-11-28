/**
 * Mock de pratos
 */

import { mockDishName, randomInt, randomFloat } from '../utils/faker'
import { categorias } from './categorias'
import { estabelecimentos } from './estabelecimentos'

// Opções de disponibilidade do prato
const disponibilidadeOpcoes = [
  'Almoço',
  'Jantar',
  'Almoço e Jantar',
  'Café da Manhã',
  'Todos os Horários',
  'Apenas Finais de Semana',
]

// URLs de imagens de comida para pratos
const PRATO_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
]

export function generatePratos(count = 30) {
  const pratos = []
  
  for (let i = 1; i <= count; i++) {
    const estabelecimentoId = randomInt(1, 20)
    pratos.push({
      id: i,
      name: mockDishName(),
      estabelecimentoId,
      categoriaId: randomInt(1, 7),
      categoria: categorias[randomInt(0, 6)],
      totalVotos: randomInt(20, 300),
      mediaNota: randomFloat(3.0, 5.0),
      posicao: i,
      foto: PRATO_IMAGES[i % PRATO_IMAGES.length],
      descricao: 'Prato especial preparado com ingredientes selecionados',
      preco: randomFloat(25, 150),
      ativo: true,
      // Novos campos conforme requisito
      disponibilidade: disponibilidadeOpcoes[randomInt(0, disponibilidadeOpcoes.length - 1)],
      instagram: `@prato_especial_${i}`,
      ingredientes: [
        'Ingrediente principal',
        'Temperos especiais',
        'Acompanhamento',
      ],
      restricoes: Math.random() > 0.7 ? ['Contém glúten', 'Contém lactose'] : [],
    })
  }
  
  return pratos
}

// Array mutável de pratos (pode ser modificado)
export let pratos = generatePratos(30)

// Contador global de IDs de pratos (para evitar conflitos)
let nextPratoId = pratos.length + 1

/**
 * Gera pratos mockados iniciais para um estabelecimento no primeiro login
 */
export function initializePratosForEstabelecimento(estabelecimentoId) {
  // Verifica se já existem pratos para este estabelecimento
  const pratosExistentes = pratos.filter(p => p.estabelecimentoId === estabelecimentoId)
  if (pratosExistentes.length > 0) {
    return // Já tem pratos, não precisa criar
  }

  // Pratos mockados iniciais para o estabelecimento (um por categoria)
  const pratosIniciais = [
    {
      id: nextPratoId++,
      name: 'Caipirinha Especial',
      estabelecimentoId,
      categoriaId: 1, // Drinks
      categoria: categorias[0],
      totalVotos: 0,
      mediaNota: 0,
      posicao: 1,
      foto: PRATO_IMAGES[0],
      descricao: 'Caipirinha preparada com cachaça premium, limão e açúcar',
      preco: 18.90,
      ativo: true,
      disponibilidade: 'Todos os Horários',
      instagram: '@caipirinha_especial',
      ingredientes: ['Cachaça premium', 'Limão', 'Açúcar', 'Gelo'],
      restricoes: ['Contém álcool'],
    },
    {
      id: nextPratoId++,
      name: 'Hambúrguer Artesanal',
      estabelecimentoId,
      categoriaId: 2, // Burguer
      categoria: categorias[1],
      totalVotos: 0,
      mediaNota: 0,
      posicao: 2,
      foto: PRATO_IMAGES[1],
      descricao: 'Hambúrguer artesanal com carne selecionada, queijo e molho especial',
      preco: 32.50,
      ativo: true,
      disponibilidade: 'Almoço e Jantar',
      instagram: '@burger_artesanal',
      ingredientes: ['Carne bovina', 'Queijo', 'Alface', 'Tomate', 'Molho especial'],
      restricoes: ['Contém glúten', 'Contém lactose'],
    },
    {
      id: nextPratoId++,
      name: 'Prato do Dia',
      estabelecimentoId,
      categoriaId: 5, // Prato
      categoria: categorias[4],
      totalVotos: 0,
      mediaNota: 0,
      posicao: 3,
      foto: PRATO_IMAGES[2],
      descricao: 'Prato especial preparado com ingredientes frescos do dia',
      preco: 45.90,
      ativo: true,
      disponibilidade: 'Almoço',
      instagram: '@prato_do_dia',
      ingredientes: ['Ingredientes frescos', 'Temperos especiais', 'Acompanhamentos'],
      restricoes: [],
    },
    {
      id: nextPratoId++,
      name: 'Tiramisu Artesanal',
      estabelecimentoId,
      categoriaId: 7, // Sobremesas
      categoria: categorias[6],
      totalVotos: 0,
      mediaNota: 0,
      posicao: 4,
      foto: PRATO_IMAGES[3],
      descricao: 'Tiramisu tradicional italiano preparado com café expresso e mascarpone',
      preco: 22.50,
      ativo: true,
      disponibilidade: 'Todos os Horários',
      instagram: '@tiramisu_artesanal',
      ingredientes: ['Biscoito champanhe', 'Café expresso', 'Mascarpone', 'Cacau'],
      restricoes: ['Contém glúten', 'Contém lactose'],
    },
  ]

  // Adiciona os pratos ao array global (mantém a mesma referência)
  pratos.push(...pratosIniciais)
  
  return pratosIniciais
}

/**
 * Filtra pratos por estabelecimento
 */
export function getPratosByEstabelecimento(estabelecimentoId) {
  return pratos.filter(p => p.estabelecimentoId === estabelecimentoId)
}

/**
 * Retorna top pratos
 */
export function getTopPratos(limit = 10, estabelecimentoId, cityId, editionId) {
  let filtered = pratos
  
  // Filtra por tenant se fornecido
  if (cityId) {
    let estabelecimentosFiltrados
    if (editionId) {
      estabelecimentosFiltrados = estabelecimentos.filter(
        e => e.cidadeId === cityId && e.edicaoId === editionId
      )
    } else {
      // Apenas cidade (todas as edições)
      estabelecimentosFiltrados = estabelecimentos.filter(
        e => e.cidadeId === cityId
      )
    }
    const estabelecimentosIds = estabelecimentosFiltrados.map(e => e.id)
    filtered = filtered.filter(p => estabelecimentosIds.includes(p.estabelecimentoId))
  }
  
  // Filtra por estabelecimento específico se fornecido
  if (estabelecimentoId) {
    filtered = getPratosByEstabelecimento(estabelecimentoId)
  }
  
  return filtered
    .sort((a, b) => b.totalVotos - a.totalVotos)
    .slice(0, limit)
    .map((p, idx) => ({ ...p, posicao: idx + 1 }))
}

/**
 * Retorna pratos por categoria
 */
export function getPratosByCategoria(categoriaId) {
  return pratos.filter(p => p.categoriaId === categoriaId)
}

