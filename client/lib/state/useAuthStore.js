import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store de autenticação e roles
 * Simula sistema de permissões
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      // Estado de autenticação
      isAuthenticated: false,
      user: null,

      // Role atual: 'admin' | 'franqueado' | 'estabelecimento'
      role: null,
      
      // ID do estabelecimento (se role = estabelecimento)
      estabelecimentoId: null,
      
      // Se premiação está encerrada (para relatórios)
      premiacaoEncerrada: false,
      
      // Se sigilo está ativo
      sigiloAtivo: false,

      // Login: autentica usuário e atualiza estado
      login: (userData) => {
        set({
          isAuthenticated: true,
          user: userData,
          role: userData.role,
          estabelecimentoId: userData.estabelecimentoId || null,
          premiacaoEncerrada: userData.premiacaoEncerrada || false,
          sigiloAtivo: userData.sigiloAtivo || false,
        })
      },

      // Logout: limpa estado de autenticação
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          role: null,
          estabelecimentoId: null,
          premiacaoEncerrada: false,
          sigiloAtivo: false,
        })
      },

      setRole: (role) => set({ role }),
      
      setEstabelecimentoId: (id) => set({ estabelecimentoId: id }),
      
      setPremiacaoEncerrada: (value) => set({ premiacaoEncerrada: value }),
      
      setSigiloAtivo: (value) => set({ sigiloAtivo: value }),

  // Verifica se tem permissão para módulo
  hasPermission: (module) => {
    const state = useAuthStore.getState()
    const { role, premiacaoEncerrada } = state

    const permissions = {
      overview: ['admin', 'franqueado'],
      cidades: ['admin', 'franqueado'],
      edicoes: ['admin', 'franqueado'],
      estabelecimentos: ['admin', 'franqueado'],
      pratos: ['admin', 'franqueado'],
      votos: ['admin', 'franqueado'],
      auditoria: ['admin', 'franqueado'],
      moderacao: ['admin', 'franqueado'],
      relatorios: role === 'estabelecimento' ? premiacaoEncerrada : ['admin', 'franqueado'],
      checklists: ['admin', 'franqueado', 'estabelecimento'],
      configuracoes: ['admin'],
    }

    const allowedRoles = permissions[module] || []
    
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(role)
    }
    
    return allowedRoles === true
  },
    }),
    {
      name: 'auth-storage', // Nome da chave no localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        role: state.role,
        estabelecimentoId: state.estabelecimentoId,
        premiacaoEncerrada: state.premiacaoEncerrada,
        sigiloAtivo: state.sigiloAtivo,
      }),
    }
  )
)

