# 🧪 Guia de Testes - ImperaOS

## 📋 Credenciais de Login

### 👑 Administrador
| Email | Senha | Descrição |
|-------|-------|-----------|
| `admin@impera.com` | `admin123` | Admin padrão |
| `admin.sigilo@impera.com` | `admin123` | Admin com sigilo ativo (ranking bloqueado) |

**Permissões:** Acesso total a todas as funcionalidades

---

### 🤝 Sócio Local (Franqueado)
| Email | Senha | Cidade | Edição | Descrição |
|-------|-------|--------|--------|-----------|
| `socio@impera.com` | `socio123` | Bauru | 1 | Sócio Local padrão |
| `socio.sigilo@impera.com` | `socio123` | Bauru | 1 | Sócio Local com sigilo |
| `socio.marilia@impera.com` | `socio123` | Marília | 3 | Sócio Local de outra cidade |

**Permissões:** Gerencia APENAS sua cidade/edição específica
> ⚠️ **Restrição:** Sócios Locais NÃO podem selecionar outras cidades no TenantSelector. A cidade é fixada automaticamente.

---

### 🏪 Estabelecimento (Restaurante)
| Email | Senha | Estabelecimento | Premiação | Descrição |
|-------|-------|-----------------|-----------|-----------|
| `estabelecimento@impera.com` | `estabelecimento123` | Restaurante Sabor (ID: 1) | ❌ Não encerrada | Restaurante padrão |
| `estabelecimento2@impera.com` | `estabelecimento123` | Cantina Tradição (ID: 2) | ❌ Não encerrada | Outro restaurante |
| `estabelecimento.finalizado@impera.com` | `estabelecimento123` | Bistrô Gourmet (ID: 3) | ✅ Encerrada | Pode ver relatórios |
| `estabelecimento.finalizado.sigilo@impera.com` | `estabelecimento123` | Casa do Chef (ID: 4) | ✅ Encerrada | Com sigilo ativo |

**Permissões:** Gerencia próprio estabelecimento e pratos

---

### 📸 Fotógrafo
| Email | Senha | Descrição |
|-------|-------|-----------|
| `fotografo@impera.com` | `fotografo123` | Fotógrafo padrão |

**Permissões:** Visualiza estabelecimentos e receitas, pode fazer upload de fotos

---

### 👤 Cliente (Votante)
| Email | Senha | Tipo | Descrição |
|-------|-------|------|-----------|
| `cliente@impera.com` | `cliente123` | Cliente Normal | Maria Silva |
| `cliente.jurado@impera.com` | `cliente123` | Jurado Técnico | João Santos (peso 3x) |

**Permissões:** Pode votar, ver perfil e ranking

---

## 🗺️ Rotas e Páginas por Role

### 👑 ADMINISTRADOR

#### Dashboard Principal
- **`/dashboard`** - Dashboard com Big Numbers, gráficos e métricas
  - Big Numbers: Clientes, Avaliações, Votos Pendentes, Estabelecimentos, Receitas
  - Gráfico: Votos por Dia
  - Tabelas: Top Pratos, Top Estabelecimentos
  - Destaques: Categoria Mais Ativa, Estabelecimento Mais Votado, Crescimento Diário

#### Gestão
- **`/dashboard/gestao/recados`** - Enviar recados para restaurantes
- **`/dashboard/gestao/convites`** - Ver vendas de convites (QR Codes)
- **`/dashboard/gestao/vendas`** - Ver vendas de pratos por categoria
- **`/dashboard/relatorios`** - Relatórios gerais (dentro de Gestão)
- **`/dashboard/checklists`** - Checklists (dentro de Gestão)

#### Estabelecimentos
- **`/dashboard/estabelecimentos`** - Lista de todos os estabelecimentos
  - Ver perfil completo
  - Editar estabelecimentos
  - Filtrar por cidade/edição

#### Receitas
- **`/dashboard/pratos`** - Lista de todas as receitas
  - Criar/editar receitas
  - Upload de fotos
  - Filtrar por categoria

#### Avaliação
- **`/dashboard/avaliacao`** - Ranking completo por categoria
  - Big Numbers: Total de votos, Projeção
  - Ranking por categoria (Top 5 destacados em verde)
  - Lista completa de votos válidos

#### Moderação
- **`/dashboard/moderacao`** - Moderação de votos
  - Tabs: Votos, Fotos, GPS, IA
  - Aprovar/rejeitar votos
  - Votos aprovados vão para Avaliação

#### Clientes
- **`/dashboard/clientes`** - Gestão de clientes
  - Big Numbers: Total cadastros
  - Gráficos: Idade, Gênero, Renda
  - Ranking Top 10
  - Lista completa de clientes
  - Promover/remover jurado técnico

#### Treinamentos
- **`/dashboard/treinamentos`** - Vídeos e materiais de treinamento

#### Configurações
- **`/dashboard/configuracoes`** - Configurações gerais
- **`/dashboard/cidades`** - Gerenciar cidades (dentro de Configurações)
- **`/dashboard/edicoes`** - Gerenciar edições (dentro de Configurações)

---

### 🤝 SÓCIO LOCAL

#### Dashboard Principal
- **`/dashboard`** - Dashboard específico do Sócio Local
  - Timeline do Circuito
  - Barra de Progresso (Checklist)
  - Big Numbers: Restaurantes, Receitas
  - Treinamentos (últimos 3)
  - Vendas de Convites
  - Recados Enviados
  - Vendas de Pratos

#### Gestão
- **`/dashboard/gestao/recados`** - Enviar recados para restaurantes
- **`/dashboard/gestao/convites`** - Ver vendas de convites
- **`/dashboard/gestao/vendas`** - Ver vendas de pratos
- **`/dashboard/relatorios`** - Relatórios da cidade/edição
- **`/dashboard/checklists`** - Checklist de tarefas

#### Estabelecimentos
- **`/dashboard/estabelecimentos`** - Lista de estabelecimentos da cidade
  - Ver perfil completo
  - Criar/editar estabelecimentos

#### Receitas
- **`/dashboard/pratos`** - Lista de receitas da cidade
  - Big Numbers: Total por categoria
  - Criar/editar receitas

#### Avaliação
- **`/dashboard/avaliacao`** - Ranking da cidade/edição

#### Moderação
- **`/dashboard/moderacao`** - Moderação de votos da cidade

#### Clientes
- **`/dashboard/clientes`** - Clientes da cidade/edição

#### Treinamentos
- **`/dashboard/treinamentos`** - Vídeos de treinamento

---

### 🏪 ESTABELECIMENTO (Restaurante)

#### Dashboard Principal
- **`/dashboard`** - Dashboard do Restaurante
  - Timeline do Circuito
  - Big Numbers (DESATIVADOS até premiação):
    - Total de Votos
    - Média Geral
    - Posição na Categoria
  - Desempenho por Prato (desativado até premiação)
  - Atalhos: Recados, Convites, Vendas
  - Recados da Organização

#### Gestão
- **`/dashboard/gestao/recados`** - Ler recados da organização
  - Marcar como lido
  - Visualizar histórico
- **`/dashboard/gestao/convites`** - Comprar convites para premiação
  - Modal de compra
  - Ver QR Codes dos convites comprados
- **`/dashboard/gestao/vendas`** - Registrar vendas dos pratos
  - Editar quantidade vendida inline
  - Filtrar por categoria

#### Estabelecimentos
- **`/dashboard/estabelecimentos`** - Ver/editar perfil do próprio estabelecimento

#### Receitas
- **`/dashboard/pratos`** - Gerenciar receitas do restaurante
  - Criar/editar receitas
  - Upload de fotos
  - Campos: Nome, Descrição, Preço, Disponibilidade, Instagram

#### Avaliação (Desativado até premiação)
- **`/dashboard/avaliacao`** - Mostra mensagem de bloqueio até premiação
  - Após premiação: mostra votos próprios

#### Relatórios (Apenas se premiação encerrada)
- **`/dashboard/relatorios`** - Relatórios do próprio estabelecimento

#### Checklists
- **`/dashboard/checklists`** - Checklist de tarefas do restaurante

---

### 📸 FOTÓGRAFO

#### Dashboard Principal
- **`/dashboard`** - Dashboard do Fotógrafo
  - Big Numbers: Estabelecimentos Agendados, Receitas sem Foto, Fotos Aprovadas
  - Tabs: Estabelecimentos e Receitas

#### Estabelecimentos
- **`/dashboard/estabelecimentos`** - Lista de estabelecimentos agendados
  - Ver contato, horário agendado
  - Status: Agendado, Pendente, Confirmado

#### Receitas
- **`/dashboard/pratos`** - Lista de receitas para fotografar
  - Status: Foto Pendente, Foto Enviada, Foto Aprovada
  - Upload de fotos

---

### 👤 CLIENTE (Votante)

#### Páginas Públicas
- **`/`** - Página inicial
- **`/login`** - Login
- **`/inscricao`** - Formulário de inscrição do restaurante (público)

#### Perfil
- **`/perfil`** - Perfil editável do cliente
  - Trocar foto
  - Editar: Idade, Gênero, Renda, Localização
  - Sistema de pontos

#### Ranking
- **`/ranking`** - Ranking pessoal
  - Big Numbers: Número no Ranking, Quantidade de Avaliações
  - Badges conquistados
  - Top 10 do ranking

#### Avaliação
- **`/votar`** - Avaliar prato (Jurado)
  - Verificação CPF/Telefone
  - OTP
  - Captura de foto (câmera)
  - Verificação GPS
  - 3 critérios: Apresentação, Sabor, Experiência
  - Comentário opcional

#### Histórico
- **`/ranking/avaliacoes`** - Histórico de avaliações próprias

---

## 🔄 Fluxos de Teste Recomendados

### 1. Fluxo Completo de Inscrição
1. Acessar `/inscricao`
2. Preencher formulário multi-step:
   - Step 1: Dados do Estabelecimento
   - Step 2: Receita Participante
   - Step 3: Agendamento da Foto + Senha
   - Step 4: Pagamento + Termos
   - Step 5: Confirmação
3. Fazer login com email criado

### 2. Fluxo de Moderação → Avaliação
1. Login como Admin: `admin@impera.com`
2. Ir para `/dashboard/moderacao`
3. Aprovar alguns votos pendentes
4. Ir para `/dashboard/avaliacao`
5. Verificar que votos aprovados aparecem no ranking

### 3. Fluxo de Recados
1. Login como Sócio Local: `socio@impera.com`
2. Ir para `/dashboard/gestao/recados`
3. Enviar recado para todos os restaurantes
4. Fazer logout
5. Login como Restaurante: `estabelecimento@impera.com`
6. Ir para `/dashboard/gestao/recados`
7. Ver recado recebido e marcar como lido

### 4. Fluxo de Convites
1. Login como Restaurante: `estabelecimento@impera.com`
2. Ir para `/dashboard/gestao/convites`
3. Clicar em "Comprar Convites"
4. Selecionar quantidade
5. Confirmar compra
6. Ver QR Codes gerados
7. Login como Admin: `admin@impera.com`
8. Ir para `/dashboard/gestao/convites`
9. Ver venda registrada

### 5. Fluxo de Vendas
1. Login como Restaurante: `estabelecimento@impera.com`
2. Ir para `/dashboard/gestao/vendas`
3. Editar quantidade vendida de um prato
4. Salvar
5. Login como Admin: `admin@impera.com`
6. Ir para `/dashboard/gestao/vendas`
7. Ver vendas registradas

### 6. Fluxo de Jurado Técnico
1. Login como Admin: `admin@impera.com`
2. Ir para `/dashboard/clientes`
3. Promover um cliente para jurado técnico
4. Fazer logout
5. Login como Cliente Jurado: `cliente.jurado@impera.com`
6. Ir para `/votar`
7. Avaliar um prato
8. Login como Admin novamente
9. Ir para `/dashboard/avaliacao`
10. Verificar que o voto do jurado tem peso 3x no cálculo

### 7. Teste de Permissões
1. Login como Restaurante: `estabelecimento@impera.com`
2. Tentar acessar `/dashboard/clientes` (deve redirecionar)
3. Tentar acessar `/dashboard/moderacao` (deve redirecionar)
4. Verificar que só vê suas próprias páginas

### 8. Teste de TenantSelector
1. Login como Admin: `admin@impera.com`
2. No header, selecionar "Todas as Cidades"
3. Verificar que dados agregam todas as cidades
4. Selecionar cidade específica
5. Verificar filtro aplicado

### 9. Teste de Premiação Encerrada
1. Login como Restaurante: `estabelecimento.finalizado@impera.com`
2. Ir para `/dashboard`
3. Verificar que Big Numbers estão ATIVOS (não em cinza)
4. Ir para `/dashboard/avaliacao`
5. Verificar que pode ver resultados
6. Ir para `/dashboard/relatorios`
7. Verificar acesso permitido

### 10. Teste de Sigilo Ativo
1. Login como Admin: `admin.sigilo@impera.com`
2. Ir para `/dashboard`
3. Verificar que médias aparecem como `***`
4. Ir para `/dashboard/avaliacao`
5. Verificar ranking bloqueado

---

## ✅ Checklist de Funcionalidades

### Estrutura/Navegação
- [x] Sidebar com seção "Gestão" expansível
- [x] Checklist e Relatórios dentro de Gestão
- [x] TenantSelector com opção "TODAS"

### Dashboard
- [x] Dashboard Admin com Big Numbers e gráficos
- [x] Dashboard Sócio Local com timeline e progresso
- [x] Dashboard Restaurante com Big Numbers desativados
- [x] Dashboard Fotógrafo com estabelecimentos e receitas

### Gestão
- [x] Recados (enviar/ler)
- [x] Convites (comprar/visualizar QR Codes)
- [x] Vendas (registrar/visualizar)

### Avaliação
- [x] Ranking por categoria
- [x] Nota ponderada para jurados técnicos (peso 3x)
- [x] Top 5 destacados em verde

### Moderação
- [x] Aprovar/rejeitar votos
- [x] Votos aprovados vão para Avaliação
- [x] Tabs: Votos, Fotos, GPS, IA

### Formulário de Inscrição
- [x] Multi-step (5 etapas)
- [x] Dados do estabelecimento
- [x] Receita participante
- [x] Agendamento da foto
- [x] Pagamento
- [x] Confirmação

---

## 🐛 Pontos de Atenção para Testes

1. **Permissões:** Verificar que cada role só acessa suas páginas permitidas
2. **Tenant Filter:** Verificar que dados são filtrados por cidade/edição
3. **Premiação Encerrada:** Verificar comportamento diferente quando `premiacaoEncerrada = true`
4. **Sigilo Ativo:** Verificar que médias aparecem como `***` quando `sigiloAtivo = true`
5. **Jurado Técnico:** Verificar que votos têm peso 3x no cálculo da nota
6. **Moderação:** Verificar que votos aprovados somem da lista e aparecem na avaliação
7. **Responsividade:** Testar em mobile/tablet/desktop
8. **Navegação:** Verificar breadcrumbs e links da sidebar

---

## 📝 Notas Importantes

- **Mock Data:** Todos os dados são mockados, então mudanças não persistem após reload
- **Persistência:** Estado de autenticação persiste via Zustand (localStorage)
- **Multi-tenant:** Filtros por cidade/edição funcionam em todas as páginas
- **Permissões:** Sistema de permissões granular em `/lib/permissions/index.js`

---

**Última atualização:** Todos os itens do TODO foram implementados! ✅

