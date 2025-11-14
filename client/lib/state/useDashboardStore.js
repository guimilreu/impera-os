import { create } from 'zustand'

/**
 * Store do dashboard (filtros, loading, etc)
 */
export const useDashboardStore = create((set) => ({
  isLoading: false,
  filters: {},
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  setFilters: (filters) => set({ filters }),
  
  updateFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),
  
  clearFilters: () => set({ filters: {} }),
}))

