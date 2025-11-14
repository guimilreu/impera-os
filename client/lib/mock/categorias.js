/**
 * Mock de categorias de pratos
 */

export const categorias = [
  { id: 1, name: 'Drinks', icon: '🍹' },
  { id: 2, name: 'Burguer', icon: '🍔' },
  { id: 3, name: 'Sanduiche', icon: '🥪' },
  { id: 4, name: 'Boteco', icon: '🍻' },
  { id: 5, name: 'Prato', icon: '🍽️' },
  { id: 6, name: 'Pizza', icon: '🍕' },
  { id: 7, name: 'Sobremesas', icon: '🍰' },
]

export function getCategoriaById(id) {
  return categorias.find(c => c.id === id) || categorias[0]
}

