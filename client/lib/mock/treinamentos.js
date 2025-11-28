/**
 * Mock de vídeos e textos de treinamentos para Sócios Locais
 */

export const treinamentos = [
  {
    id: 1,
    tipo: 'video',
    titulo: 'Bem-vindo ao Prêmio Impera',
    descricao: 'Introdução ao sistema e primeiros passos como Sócio Local',
    duracao: '12:34',
    thumbnail: '/video-thumb.jpg',
    url: 'https://youtube.com/watch?v=exemplo1',
    categoria: 'introducao',
    ordem: 1,
  },
  {
    id: 2,
    tipo: 'video',
    titulo: 'Como prospectar restaurantes',
    descricao: 'Técnicas e abordagens para captar novos estabelecimentos',
    duracao: '18:45',
    thumbnail: '/video-thumb.jpg',
    url: 'https://youtube.com/watch?v=exemplo2',
    categoria: 'vendas',
    ordem: 2,
  },
  {
    id: 3,
    tipo: 'video',
    titulo: 'Gestão de patrocinadores',
    descricao: 'Como abordar e fechar parcerias com patrocinadores locais',
    duracao: '22:10',
    thumbnail: '/video-thumb.jpg',
    url: 'https://youtube.com/watch?v=exemplo3',
    categoria: 'vendas',
    ordem: 3,
  },
  {
    id: 4,
    tipo: 'texto',
    titulo: 'Manual do Sócio Local',
    descricao: 'Guia completo com todas as informações necessárias para operar sua franquia',
    conteudo: `
# Manual do Sócio Local

## 1. Introdução
Bem-vindo à família Prêmio Impera! Este manual contém todas as informações necessárias para você operar sua franquia com sucesso.

## 2. Cronograma Anual
- **Agosto a Fevereiro**: Captação de patrocinadores
- **Março e Abril**: Inscrições de restaurantes
- **Maio**: Produção de fotos
- **Junho**: Produção de materiais
- **Julho**: Circuito gastronômico
- **Agosto**: Finalizações e premiação

## 3. Responsabilidades
- Prospectar e cadastrar restaurantes
- Captar patrocinadores locais
- Coordenar produção de fotos
- Gerenciar materiais de divulgação
- Acompanhar o circuito
- Organizar evento de premiação

## 4. Contatos Importantes
- Suporte: suporte@premioimpera.com.br
- Comercial: comercial@premioimpera.com.br
    `,
    categoria: 'documentacao',
    ordem: 4,
  },
  {
    id: 5,
    tipo: 'video',
    titulo: 'Usando o sistema de gestão',
    descricao: 'Tutorial completo do painel administrativo',
    duracao: '25:00',
    thumbnail: '/video-thumb.jpg',
    url: 'https://youtube.com/watch?v=exemplo4',
    categoria: 'sistema',
    ordem: 5,
  },
  {
    id: 6,
    tipo: 'texto',
    titulo: 'FAQ - Perguntas Frequentes',
    descricao: 'Respostas para as dúvidas mais comuns',
    conteudo: `
# FAQ - Perguntas Frequentes

## Como cadastrar um novo restaurante?
Acesse Estabelecimentos > Novo Estabelecimento e preencha todos os campos obrigatórios.

## Como funciona a votação?
O público vota através do app ou site, avaliando cada prato em 3 critérios: Apresentação, Sabor e Experiência.

## Como é calculada a nota final?
A nota final é a média dos 3 critérios de todos os votos válidos.

## Quando posso ver os resultados?
Os resultados parciais ficam disponíveis durante o circuito. Os resultados finais são revelados na premiação.
    `,
    categoria: 'documentacao',
    ordem: 6,
  },
]

export const categoriasTreinamento = [
  { id: 'introducao', nome: 'Introdução', icon: '🎓' },
  { id: 'vendas', nome: 'Vendas', icon: '💼' },
  { id: 'sistema', nome: 'Sistema', icon: '💻' },
  { id: 'documentacao', nome: 'Documentação', icon: '📄' },
]

export function getTreinamentos() {
  return [...treinamentos].sort((a, b) => a.ordem - b.ordem)
}

export function getTreinamentosByCategoria(categoria) {
  if (!categoria || categoria === 'todos') return getTreinamentos()
  return treinamentos.filter(t => t.categoria === categoria).sort((a, b) => a.ordem - b.ordem)
}

export function getTreinamentoById(id) {
  return treinamentos.find(t => t.id === id)
}

/**
 * Adiciona um novo treinamento
 */
export function addTreinamento(novoTreinamento) {
  const maxId = Math.max(...treinamentos.map(t => t.id), 0)
  const maxOrdem = Math.max(...treinamentos.map(t => t.ordem), 0)
  
  const treinamento = {
    ...novoTreinamento,
    id: maxId + 1,
    ordem: maxOrdem + 1,
  }
  
  treinamentos.push(treinamento)
  return treinamento
}

/**
 * Atualiza um treinamento existente
 */
export function updateTreinamento(id, dadosAtualizados) {
  const index = treinamentos.findIndex(t => t.id === id)
  if (index === -1) return null
  
  treinamentos[index] = {
    ...treinamentos[index],
    ...dadosAtualizados,
    id, // Garante que o ID não mude
  }
  
  return treinamentos[index]
}

/**
 * Remove um treinamento
 */
export function deleteTreinamento(id) {
  const index = treinamentos.findIndex(t => t.id === id)
  if (index === -1) return false
  
  treinamentos.splice(index, 1)
  return true
}

