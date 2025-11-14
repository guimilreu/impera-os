/**
 * Mock de dados multi-tenant (Cidade > Edição)
 * Região fixa: Sudeste (regionId: 1)
 */

// Região fixa: Sudeste
export const DEFAULT_REGION = { id: 1, name: 'Sudeste' }

// Apenas 4 cidades específicas
export const cities = [
  { id: 1, name: 'Bauru', regionId: 1 },
  { id: 2, name: 'Marília', regionId: 1 },
  { id: 3, name: 'Botucatu', regionId: 1 },
  { id: 4, name: 'São José do Rio Preto', regionId: 1 },
]

export const editions = {
  1: [ // Bauru
    { id: 1, name: 'Edição 2024', cityId: 1, year: 2024, sigiloAtivo: true },
    { id: 2, name: 'Edição 2023', cityId: 1, year: 2023, sigiloAtivo: false },
  ],
  2: [ // Marília
    { id: 3, name: 'Edição 2024', cityId: 2, year: 2024, sigiloAtivo: false },
    { id: 4, name: 'Edição 2023', cityId: 2, year: 2023, sigiloAtivo: false },
  ],
  3: [ // Botucatu
    { id: 5, name: 'Edição 2024', cityId: 3, year: 2024, sigiloAtivo: true },
  ],
  4: [ // São José do Rio Preto
    { id: 6, name: 'Edição 2024', cityId: 4, year: 2024, sigiloAtivo: false },
  ],
}

/**
 * Retorna todas as cidades (sempre Sudeste)
 */
export function getAllCities() {
  return cities
}

/**
 * Retorna edições de uma cidade
 */
export function getEditionsByCity(cityId) {
  return editions[cityId] || []
}

