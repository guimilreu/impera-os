/**
 * Mock de usuários para login
 * Usuários pré-configurados para testes
 */

export const mockUsers = [
  // ========== ADMIN (sempre vê tudo, sem sigilo) ==========
  {
    id: 1,
    email: 'admin@impera.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: false, // Admin NUNCA tem sigilo - vê tudo sempre
  },

  // ========== SÓCIO LOCAL ==========
  {
    id: 3,
    email: 'socio@impera.com',
    password: 'socio123',
    name: 'Sócio Local - Bauru',
    role: 'socio_local',
    estabelecimentoId: null,
    cidadeId: 1, // Bauru
    edicaoId: 1,
    premiacaoEncerrada: false,
    sigiloAtivo: true, // Sigilo ATIVO por padrão
  },
  {
    id: 4,
    email: 'socio.semsigilo@impera.com',
    password: 'socio123',
    name: 'Sócio Local sem Sigilo',
    role: 'socio_local',
    estabelecimentoId: null,
    cidadeId: 1,
    edicaoId: 1,
    premiacaoEncerrada: false,
    sigiloAtivo: false, // Sigilo desativado para testes
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
    sigiloAtivo: true, // Sigilo ATIVO - comportamento padrão durante o circuito
  },
  {
    id: 6,
    email: 'estabelecimento2@impera.com',
    password: 'estabelecimento123',
    name: 'Cantina Tradição',
    role: 'estabelecimento',
    estabelecimentoId: 2,
    premiacaoEncerrada: false,
    sigiloAtivo: true, // Sigilo ATIVO
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

  // ========== FOTÓGRAFO ==========
  {
    id: 9,
    email: 'fotografo@impera.com',
    password: 'fotografo123',
    name: 'Fotógrafo',
    role: 'fotografo',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: false,
  },

  // ========== SÓCIO LOCAL (Marília) ==========
  {
    id: 10,
    email: 'socio.marilia@impera.com',
    password: 'socio123',
    name: 'Sócio Local - Marília',
    role: 'socio_local',
    estabelecimentoId: null,
    cidadeId: 2, // Marília
    edicaoId: 3,
    premiacaoEncerrada: false,
    sigiloAtivo: false,
  },

  // ========== CLIENTE (Votante) ==========
  {
    id: 12,
    email: 'cliente@impera.com',
    password: 'cliente123',
    name: 'Maria Silva',
    role: 'cliente',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: false,
    // Dados específicos do cliente
    cpf: '123.456.789-00',
    telefone: '(14) 99999-1234',
    genero: 'feminino',
    idade: 32,
    faixaRenda: '3000-5000',
    cidade: 'Bauru',
    juradoTecnico: false,
  },
  {
    id: 13,
    email: 'cliente.jurado@impera.com',
    password: 'cliente123',
    name: 'João Santos',
    role: 'cliente',
    estabelecimentoId: null,
    premiacaoEncerrada: false,
    sigiloAtivo: false,
    // Dados específicos do cliente
    cpf: '987.654.321-00',
    telefone: '(14) 99888-5678',
    genero: 'masculino',
    idade: 45,
    faixaRenda: '5000-10000',
    cidade: 'Bauru',
    juradoTecnico: true, // É jurado técnico
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

