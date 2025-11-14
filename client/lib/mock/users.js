/**
 * Mock de usuários para login
 * Usuários pré-configurados para testes
 */

export const mockUsers = [
  // ========== ADMIN ==========
  {
    id: 1,
    email: 'admin@impera.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: false,
  },
  {
    id: 2,
    email: 'admin.sigilo@impera.com',
    password: 'admin123',
    name: 'Admin com Sigilo',
    role: 'admin',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: true, // Sigilo ativo para testes
  },

  // ========== FRANQUEADO ==========
  {
    id: 3,
    email: 'franqueado@impera.com',
    password: 'franqueado123',
    name: 'Franqueado',
    role: 'franqueado',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: false,
  },
  {
    id: 4,
    email: 'franqueado.sigilo@impera.com',
    password: 'franqueado123',
    name: 'Franqueado com Sigilo',
    role: 'franqueado',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: true,
  },

  // ========== ESTABELECIMENTO (Premiação NÃO Encerrada) ==========
  {
    id: 5,
    email: 'estabelecimento@impera.com',
    password: 'estabelecimento123',
    name: 'Restaurante Sabor',
    role: 'estabelecimento',
    estabelecimentoId: 1,
    premiacaoEncerrada: false, // Premiação NÃO encerrada
    sigiloAtivo: false,
  },
  {
    id: 6,
    email: 'estabelecimento2@impera.com',
    password: 'estabelecimento123',
    name: 'Cantina Tradição',
    role: 'estabelecimento',
    estabelecimentoId: 2,
    premiacaoEncerrada: false,
    sigiloAtivo: false,
  },

  // ========== ESTABELECIMENTO (Premiação ENCERRADA) ==========
  {
    id: 7,
    email: 'estabelecimento.finalizado@impera.com',
    password: 'estabelecimento123',
    name: 'Bistrô Gourmet',
    role: 'estabelecimento',
    estabelecimentoId: 3,
    premiacaoEncerrada: true, // Premiação ENCERRADA - pode ver relatórios
    sigiloAtivo: false,
  },
  {
    id: 8,
    email: 'estabelecimento.finalizado.sigilo@impera.com',
    password: 'estabelecimento123',
    name: 'Casa do Chef',
    role: 'estabelecimento',
    estabelecimentoId: 4,
    premiacaoEncerrada: true,
    sigiloAtivo: true, // Com sigilo ativo
  },
]

/**
 * Busca usuário por email e senha
 */
export function findUserByCredentials(email, password) {
  return mockUsers.find(
    user => user.email === email && user.password === password
  )
}

/**
 * Busca usuário por email
 */
export function findUserByEmail(email) {
  return mockUsers.find(user => user.email === email)
}

