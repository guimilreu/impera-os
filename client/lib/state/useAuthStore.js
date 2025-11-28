import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { canView } from '../permissions'

/**
 * Store de autenticação e roles
 * Simula sistema de permissões
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado de autenticação
      isAuthenticated: false,
      user: null,

      // Role atual: 'admin' | 'socio_local' | 'estabelecimento' | 'fotografo' | 'cliente'
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

      // Verifica se tem permissão para visualizar módulo
      // Usa o estado atual do store
      hasPermission: (module) => {
        const state = get()
        const role = state.role
        const premiacaoEncerrada = state.premiacaoEncerrada
        
        if (!role) return false
        
        // Caso especial: relatorios para estabelecimento depende de premiacaoEncerrada
        if (module === 'relatorios' && role === 'estabelecimento') {
          return premiacaoEncerrada && canView(role, module)
        }

        const result = canView(role, module)
        return result
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

