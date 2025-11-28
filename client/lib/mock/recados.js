/**
 * Mock de recados enviados para restaurantes
 */

import { randomDate } from '../utils/faker'

export const recadosMock = [
  {
    id: 1,
    titulo: 'Lembrete: Prazo de inscrição',
    mensagem: 'Atenção! O prazo para inscrição termina em 15 dias. Não deixe para última hora!',
    tipo: 'alerta', // alerta | info | sucesso | urgente
    destinatarios: 'todos', // todos | categoria | estabelecimento_id
    dataCriacao: new Date('2025-03-15').toISOString(),
    dataEnvio: new Date('2025-03-15').toISOString(),
    lido: 45,
    total: 52,
    criadoPor: 'Admin',
  },
  {
    id: 2,
    titulo: 'Agendamento de fotos',
    mensagem: 'Entrem em contato com nosso fotógrafo para agendar a sessão de fotos do prato. WhatsApp: (14) 99999-9999',
    tipo: 'info',
    destinatarios: 'todos',
    dataCriacao: new Date('2025-04-20').toISOString(),
    dataEnvio: new Date('2025-04-20').toISOString(),
    lido: 38,
    total: 52,
    criadoPor: 'Sócio Local',
  },
  {
    id: 3,
    titulo: 'Parabéns pela inscrição!',
    mensagem: 'Sua inscrição foi confirmada com sucesso. Bem-vindo ao Prêmio Impera 2025!',
    tipo: 'sucesso',
    destinatarios: 'todos',
    dataCriacao: new Date('2025-04-01').toISOString(),
    dataEnvio: new Date('2025-04-01').toISOString(),
    lido: 52,
    total: 52,
    criadoPor: 'Sistema',
  },
]

export function getRecados() {
  return recadosMock.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
}

export function getRecadoById(id) {
  return recadosMock.find(r => r.id === id)
}

export function createRecado(recado) {
  const newRecado = {
    id: recadosMock.length + 1,
    ...recado,
    dataCriacao: new Date().toISOString(),
    dataEnvio: new Date().toISOString(),
    lido: 0,
    total: 52, // Mock
    criadoPor: 'Sócio Local',
  }
  recadosMock.unshift(newRecado)
  return newRecado
}

export const tiposRecado = [
  { id: 'info', nome: 'Informativo', cor: 'blue', icon: '📢' },
  { id: 'alerta', nome: 'Alerta', cor: 'yellow', icon: '⚠️' },
  { id: 'urgente', nome: 'Urgente', cor: 'red', icon: '🚨' },
  { id: 'sucesso', nome: 'Sucesso', cor: 'green', icon: '✅' },
]

