/**
 * Mock de alertas e warnings
 */

import { randomInt, randomDate } from '../utils/faker'

export const alertas = [
  {
    id: 1,
    tipo: 'foto_duplicada',
    titulo: 'Fotos duplicadas detectadas',
    descricao: '3 votos com fotos idênticas foram identificados',
    severidade: 'alta',
    quantidade: 3,
    data: randomDate(2).toISOString(),
    acao: 'Revisar votos suspeitos',
  },
  {
    id: 2,
    tipo: 'gps_inconsistente',
    titulo: 'GPS inconsistente',
    descricao: '5 votos com localização fora do raio permitido',
    severidade: 'media',
    quantidade: 5,
    data: randomDate(1).toISOString(),
    acao: 'Verificar geofence',
  },
  {
    id: 3,
    tipo: 'pico_anormal',
    titulo: 'Pico anormal de votos',
    descricao: 'Detectado aumento de 200% nos votos nas últimas 2 horas',
    severidade: 'alta',
    quantidade: 50,
    data: randomDate(0.5).toISOString(),
    acao: 'Investigar origem',
  },
  {
    id: 4,
    tipo: 'horario_suspeito',
    titulo: 'Horários suspeitos',
    descricao: '8 votos registrados entre 2h e 5h da manhã',
    severidade: 'baixa',
    quantidade: 8,
    data: randomDate(1).toISOString(),
    acao: 'Revisar padrão',
  },
]

export function getAlertas() {
  return alertas
}

