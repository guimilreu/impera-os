import { create } from 'zustand'
import { DEFAULT_REGION, getAllCities, getEditionsByCity } from '../mock/tenants'

/**
 * Store de multi-tenant (Cidade > Edição)
 * Região fixa: Sudeste
 */
export const useTenantStore = create((set, get) => {
  // Inicializa com primeira cidade e edição
  const cities = getAllCities()
  const initialCity = cities[0] || null
  const initialEditions = initialCity ? getEditionsByCity(initialCity.id) : []
  const initialEdition = initialEditions[0] || null

  return {
    // Região sempre é Sudeste
    region: DEFAULT_REGION,
    city: initialCity,
    edition: initialEdition,
  loading: false,
  
  setCity: async (city) => {
    set({ loading: true })
    // Simula delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 300))
    if (city) {
      const editions = getEditionsByCity(city.id)
      const edition = editions[0] || null
      set({ city, edition, loading: false })
    } else {
      set({ city: null, edition: null, loading: false })
    }
  },
  
  setEdition: async (edition) => {
    set({ loading: true })
    // Simula delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 300))
    set({ edition, loading: false })
  },
  
  // Reseta edição quando cidade muda
  resetEdition: () => set({ edition: null }),
  
  setLoading: (loading) => set({ loading }),
  }
})

