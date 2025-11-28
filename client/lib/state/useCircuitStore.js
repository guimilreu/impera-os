import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Store para gerenciar a fase atual do circuito
 * Permite que o admin defina manualmente a fase
 */
export const useCircuitStore = create(
  persist(
    (set, get) => ({
      // Fase atual do circuito (null = automático baseado na data)
      faseManual: null,
      
      // Define a fase manualmente
      setFaseManual: (faseId) => set({ faseManual: faseId }),
      
      // Reseta para modo automático
      resetFaseAutomatica: () => set({ faseManual: null }),
      
      // Verifica se está em modo manual
      isModoManual: () => get().faseManual !== null,
    }),
    {
      name: 'circuit-storage',
      partialize: (state) => ({
        faseManual: state.faseManual,
      }),
    }
  )
)

