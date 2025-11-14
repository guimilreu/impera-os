# 🧪 Guia Completo de Testes - Dashboard ImperaOS

> **Versão:** Front-end mockado em Next.js 16 + JavaScript  
> **Data:** Guia de testes completo para validação do dashboard

---

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Sistema de Roles](#sistema-de-roles)
3. [Multi-Tenant (Região > Cidade > Edição)](#multi-tenant)
4. [Sistema de Sigilo](#sistema-de-sigilo)
5. [Testes por Página](#testes-por-página)
6. [Testes de Responsividade](#testes-de-responsividade)
7. [Testes de UX](#testes-de-ux)
8. [Checklist Final](#checklist-final)

---

## 🔧 Configuração Inicial

### Sistema de Login

**URL:** `http://localhost:3000/login`

O sistema agora possui uma página de login completa com usuários pré-configurados!

### Usuários Disponíveis para Teste

#### 👑 ADMIN

1. **Admin Padrão**
   - **Email:** `admin@impera.com`
   - **Senha:** `admin123`
   - **Role:** Admin
   - **Sigilo:** Desativado
   - **Premiação:** Não encerrada

2. **Admin com Sigilo**
   - **Email:** `admin.sigilo@impera.com`
   - **Senha:** `admin123`
   - **Role:** Admin
   - **Sigilo:** ✅ Ativado
   - **Premiação:** Não encerrada

#### 🏢 FRANQUEADO

3. **Franqueado Padrão**
   - **Email:** `franqueado@impera.com`
   - **Senha:** `franqueado123`
   - **Role:** Franqueado
   - **Sigilo:** Desativado
   - **Premiação:** Não encerrada

4. **Franqueado com Sigilo**
   - **Email:** `franqueado.sigilo@impera.com`
   - **Senha:** `franqueado123`
   - **Role:** Franqueado
   - **Sigilo:** ✅ Ativado
   - **Premiação:** Não encerrada

#### 🍽️ ESTABELECIMENTO

5. **Estabelecimento (Premiação NÃO Encerrada)**
   - **Email:** `estabelecimento@impera.com`
   - **Senha:** `estabelecimento123`
   - **Role:** Estabelecimento
   - **Estabelecimento ID:** 1
   - **Premiação:** ❌ NÃO encerrada (relatórios bloqueados)

6. **Estabelecimento 2 (Premiação NÃO Encerrada)**
   - **Email:** `estabelecimento2@impera.com`
   - **Senha:** `estabelecimento123`
   - **Role:** Estabelecimento
   - **Estabelecimento ID:** 2
   - **Premiação:** ❌ NÃO encerrada

7. **Estabelecimento (Premiação ENCERRADA)**
   - **Email:** `estabelecimento.finalizado@impera.com`
   - **Senha:** `estabelecimento123`
   - **Role:** Estabelecimento
   - **Estabelecimento ID:** 3
   - **Premiação:** ✅ ENCERRADA (pode ver relatórios)

8. **Estabelecimento (Premiação Encerrada + Sigilo)**
   - **Email:** `estabelecimento.finalizado.sigilo@impera.com`
   - **Senha:** `estabelecimento123`
   - **Role:** Estabelecimento
   - **Estabelecimento ID:** 4
   - **Premiação:** ✅ ENCERRADA
   - **Sigilo:** ✅ Ativado

### Como Fazer Login

1. **Acesse:** `http://localhost:3000/login`
2. **Na página de login, você pode:**
   - Digitar email e senha manualmente
   - **OU** clicar em um dos botões de usuários de teste (preenche automaticamente)
3. **Clique em "Entrar"**
4. **Você será redirecionado para:** `/dashboard`

### Como Fazer Logout

1. **No Header do dashboard**, clique no avatar (canto superior direito)
2. **Clique em "Sair"**
3. **Você será redirecionado para:** `/login`

### Proteção de Rotas

- ✅ Se você tentar acessar `/dashboard` sem estar logado, será redirecionado para `/login`
- ✅ Após fazer login, a sessão persiste no localStorage
- ✅ Ao recarregar a página, você permanece logado

### Como Alterar Tenant (Região/Cidade/Edição)

**Via Interface:**
- Use os 3 dropdowns no Header (navbar)
- Selecione: Região → Cidade → Edição

**Via Código (para testes):**
- Arquivo: `client/lib/state/useTenantStore.js`
- Altere os valores iniciais se necessário

---

## 👤 Sistema de Roles

### Role: ADMIN

**Como Testar:**
1. **Faça login com:** `admin@impera.com` / `admin123`
2. **Ou use o botão de teste na página de login**

**Permissões Esperadas:**
- ✅ Overview (Dashboard principal)
- ✅ Cidades
- ✅ Edições
- ✅ Estabelecimentos
- ✅ Pratos
- ✅ Votos
- ✅ Auditoria
- ✅ Moderação
- ✅ Relatórios (sempre disponível)
- ✅ Checklists (vê todos)
- ✅ Configurações

**Testes:**

1. **Acesse:** `http://localhost:3000/login`
2. **Faça login com credenciais de admin**
3. **Você será redirecionado para:** `/dashboard`
2. **Verifique Sidebar:** Deve mostrar TODOS os itens do menu
3. **Teste cada rota:**
   ```
   /dashboard                    ✅ Deve acessar
   /dashboard/cidades           ✅ Deve acessar
   /dashboard/edicoes           ✅ Deve acessar
   /dashboard/estabelecimentos  ✅ Deve acessar
   /dashboard/pratos            ✅ Deve acessar
   /dashboard/votos             ✅ Deve acessar
   /dashboard/auditoria         ✅ Deve acessar
   /dashboard/moderacao         ✅ Deve acessar
   /dashboard/relatorios        ✅ Deve acessar (sempre)
   /dashboard/checklists        ✅ Deve acessar (vê todos)
   /dashboard/configuracoes     ✅ Deve acessar
   ```

4. **Teste redirecionamento:** Tente acessar diretamente qualquer rota - deve funcionar

---

### Role: FRANQUEADO

**Como Testar:**
1. **Faça logout** (se estiver logado como outro usuário)
2. **Faça login com:** `franqueado@impera.com` / `franqueado123`
3. **Ou use o botão de teste na página de login**

**Permissões Esperadas:**
- ✅ Overview (Dashboard principal)
- ✅ Cidades
- ✅ Edições
- ✅ Estabelecimentos
- ✅ Pratos
- ✅ Votos
- ✅ Auditoria
- ✅ Moderação
- ✅ Relatórios (sempre disponível)
- ✅ Checklists (vê todos)
- ❌ Configurações (BLOQUEADO)

**Testes:**

1. **Acesse:** `http://localhost:3000/login`
2. **Faça login com credenciais de franqueado**
3. **Você será redirecionado para:** `/dashboard`
3. **Verifique Sidebar:** Não deve mostrar "Configurações"
4. **Teste cada rota:**
   ```
   /dashboard                    ✅ Deve acessar
   /dashboard/cidades           ✅ Deve acessar
   /dashboard/edicoes           ✅ Deve acessar
   /dashboard/estabelecimentos  ✅ Deve acessar
   /dashboard/pratos            ✅ Deve acessar
   /dashboard/votos             ✅ Deve acessar
   /dashboard/auditoria         ✅ Deve acessar
   /dashboard/moderacao         ✅ Deve acessar
   /dashboard/relatorios        ✅ Deve acessar (sempre)
   /dashboard/checklists        ✅ Deve acessar (vê todos)
   /dashboard/configuracoes     ❌ Deve REDIRECIONAR para /dashboard
   ```

5. **Teste redirecionamento:** Tente acessar `/dashboard/configuracoes` diretamente - deve redirecionar

---

### Role: ESTABELECIMENTO

**Permissões Esperadas:**
- ❌ Overview (BLOQUEADO)
- ❌ Cidades (BLOQUEADO)
- ❌ Edições (BLOQUEADO)
- ❌ Estabelecimentos (BLOQUEADO)
- ❌ Pratos (BLOQUEADO)
- ❌ Votos (BLOQUEADO)
- ❌ Auditoria (BLOQUEADO)
- ❌ Moderação (BLOQUEADO)
- ✅ Relatórios (APENAS se `premiacaoEncerrada = true`)
- ✅ Checklists (APENAS seu próprio checklist)
- ❌ Configurações (BLOQUEADO)

**Testes:**

#### Cenário 1: Premiação NÃO Encerrada

1. **Faça login com:** `estabelecimento@impera.com` / `estabelecimento123`
2. **Ou use o botão de teste na página de login**
3. **Você será redirecionado para:** `/dashboard`
3. **Verifique Sidebar:** Deve mostrar APENAS:
   - ❌ Overview (não deve aparecer)
   - ✅ Checklists
   - ❌ Relatórios (não deve aparecer, pois premiação não encerrada)

4. **Teste cada rota:**
   ```
   /dashboard                    ❌ Deve REDIRECIONAR (não tem permissão)
   /dashboard/cidades           ❌ Deve REDIRECIONAR
   /dashboard/edicoes           ❌ Deve REDIRECIONAR
   /dashboard/estabelecimentos  ❌ Deve REDIRECIONAR
   /dashboard/pratos            ❌ Deve REDIRECIONAR
   /dashboard/votos             ❌ Deve REDIRECIONAR
   /dashboard/auditoria         ❌ Deve REDIRECIONAR
   /dashboard/moderacao         ❌ Deve REDIRECIONAR
   /dashboard/relatorios        ❌ Deve mostrar card "Bloqueado até premiação"
   /dashboard/checklists        ✅ Deve acessar (mostra apenas seu checklist)
   /dashboard/configuracoes     ❌ Deve REDIRECIONAR
   ```

#### Cenário 2: Premiação Encerrada

1. **Faça login com:** `estabelecimento.finalizado@impera.com` / `estabelecimento123`
2. **Ou use o botão de teste na página de login**
3. **Você será redirecionado para:** `/dashboard`
3. **Verifique Sidebar:** Deve mostrar:
   - ✅ Checklists
   - ✅ Relatórios (agora aparece!)

4. **Teste relatórios:**
   - Acesse `/dashboard/relatorios`
   - ✅ Deve mostrar os cards de relatórios (não deve estar bloqueado)

---

## 🌍 Multi-Tenant (Região > Cidade > Edição)

### Dados Mock Disponíveis

**Regiões:**
- Sudeste (id: 1)
- Sul (id: 2)
- Nordeste (id: 3)
- Norte (id: 4)
- Centro-Oeste (id: 5)

**Cidades (exemplos):**
- Sudeste: São Paulo, Rio de Janeiro, Belo Horizonte, Campinas
- Sul: Curitiba, Porto Alegre, Florianópolis
- E mais...

**Edições:**
- Cada cidade tem pelo menos 1 edição (Edição 2024)
- São Paulo tem 2 edições (2024 e 2023)

### Testes de Multi-Tenant

#### Teste 1: Seleção de Região

1. **Acesse:** `/dashboard`
2. **No Header, clique no dropdown "Selecionar Região"**
3. **Selecione:** "Sudeste"
4. **Verifique:**
   - ✅ Aparece skeleton de loading (300ms)
   - ✅ Dropdown "Cidade" é atualizado automaticamente
   - ✅ Dropdown "Edição" é atualizado automaticamente
   - ✅ Primeira cidade é selecionada automaticamente
   - ✅ Primeira edição é selecionada automaticamente
   - ✅ Dados do dashboard são filtrados

#### Teste 2: Seleção de Cidade

1. **Com região já selecionada, clique no dropdown "Selecionar Cidade"**
2. **Selecione:** "São Paulo"
3. **Verifique:**
   - ✅ Aparece skeleton de loading
   - ✅ Dropdown "Edição" é atualizado
   - ✅ Primeira edição é selecionada automaticamente
   - ✅ Dados são filtrados por cidade

#### Teste 3: Seleção de Edição

1. **Com cidade já selecionada, clique no dropdown "Selecionar Edição"**
2. **Selecione:** "Edição 2024"
3. **Verifique:**
   - ✅ Aparece skeleton de loading
   - ✅ Dados são filtrados por edição

#### Teste 4: Filtros por Tenant em Cada Página

**Página: Dashboard (`/dashboard`)**
- ✅ Cards de indicadores mudam ao trocar tenant
- ✅ Gráficos são atualizados
- ✅ Tabelas (Top Estabelecimentos, Top Pratos) são filtradas
- ✅ Últimos votos são filtrados

**Página: Estabelecimentos (`/dashboard/estabelecimentos`)**
- ✅ Lista de estabelecimentos filtra por cidade/edição
- ✅ Cards de estatísticas são atualizados
- ✅ Tabela mostra apenas estabelecimentos do tenant selecionado

**Página: Pratos (`/dashboard/pratos`)**
- ✅ Lista de pratos filtra por cidade/edição
- ✅ Cards de estatísticas são atualizados
- ✅ Tabela mostra apenas pratos do tenant selecionado

**Página: Votos (`/dashboard/votos`)**
- ✅ Lista de votos filtra por cidade/edição
- ✅ Cards de estatísticas são atualizados
- ✅ Tabela mostra apenas votos do tenant selecionado

**Página: Edições (`/dashboard/edicoes`)**
- ✅ Lista de edições filtra por cidade (quando cidade selecionada)
- ✅ Cards de estatísticas são atualizados

#### Teste 5: Breadcrumb

1. **Acesse qualquer página do dashboard**
2. **Verifique breadcrumb no Header:**
   - Deve mostrar: `Dashboard > [Nome da Página]`
   - Se cidade selecionada e estiver em `/dashboard/cidades`: `Dashboard > Cidades > [Nome da Cidade]`
   - Se edição selecionada e estiver em `/dashboard/edicoes`: `Dashboard > Edições > [Nome da Edição]`

---

## 🔒 Sistema de Sigilo

### Como Ativar/Desativar Sigilo

**Via Código:**
- Arquivo: `client/lib/state/useAuthStore.js`
- Linha 18: `sigiloAtivo: true` ou `false`

**Via Interface:**
- Acesse `/dashboard/configuracoes` (apenas admin)
- Marque/desmarque checkbox "Sigilo Ativo"
- Clique em "Salvar Alterações"

### Comportamento Esperado com Sigilo ATIVO

#### Dashboard (`/dashboard`)

1. **Tabela "Top Estabelecimentos":**
   - ✅ Coluna "Média" deve mostrar `***` (não números)
   - ✅ Ranking parcial deve mostrar card: "🔒 Bloqueado até a premiação"

2. **Tabela "Top Pratos":**
   - ✅ Coluna "Média" deve mostrar `***` (não números)

3. **Cards de Indicadores:**
   - ✅ Card "Média Geral" deve mostrar `***` (se houver)

#### Estabelecimentos (`/dashboard/estabelecimentos`)

1. **Card de Estatísticas:**
   - ✅ Card "Média Geral" deve mostrar `***`

2. **Tabela:**
   - ✅ Coluna "Média" deve mostrar `***` para todos os estabelecimentos

#### Pratos (`/dashboard/pratos`)

1. **Card de Estatísticas:**
   - ✅ Card "Média Geral" deve mostrar `***`

2. **Tabela:**
   - ✅ Coluna "Média" deve mostrar `***` para todos os pratos

#### Votos (`/dashboard/votos`)

1. **Botão "Exportar CSV":**
   - ✅ Deve estar DESABILITADO (disabled)
   - ✅ Não deve funcionar ao clicar

#### Relatórios (`/dashboard/relatorios`)

1. **Cards de Relatórios:**
   - ✅ Botão "Gerar Relatório" (Estabelecimento) deve estar DESABILITADO
   - ✅ Botão "Gerar Relatório" (Edição) deve estar DESABILITADO
   - ✅ Botão "Gerar Relatório" (Categoria) deve estar HABILITADO (exceção)
   - ✅ Texto abaixo: "Bloqueado enquanto sigilo estiver ativo"

2. **Botão "Exportar":**
   - ✅ Deve estar DESABILITADO (se relatório de estabelecimento/edição)
   - ✅ Deve estar HABILITADO (se relatório de categoria)

### Testes de Sigilo

#### Teste 1: Ativar Sigilo

1. **Configure:** `sigiloAtivo: true` em `useAuthStore.js`
2. **Acesse:** `/dashboard`
3. **Verifique:**
   - ✅ Todas as médias mostram `***`
   - ✅ Card de ranking bloqueado aparece
   - ✅ Botões de exportação desabilitados

#### Teste 2: Desativar Sigilo

1. **Configure:** `sigiloAtivo: false` em `useAuthStore.js`
2. **Acesse:** `/dashboard`
3. **Verifique:**
   - ✅ Todas as médias mostram números (ex: 4.5)
   - ✅ Card de ranking bloqueado NÃO aparece
   - ✅ Botões de exportação habilitados

#### Teste 3: Toggle via Configurações (Admin)

1. **Role:** `admin`
2. **Acesse:** `/dashboard/configuracoes`
3. **Marque:** Checkbox "Sigilo Ativo"
4. **Clique:** "Salvar Alterações"
5. **Verifique:** Sigilo é ativado e todas as páginas refletem a mudança

---

## 📄 Testes por Página

### 1. Dashboard Principal (`/dashboard`)

**URL:** `http://localhost:3000/dashboard`

#### Elementos a Verificar:

**Cards de Indicadores (8 cards):**
- ✅ Total de votos
- ✅ Votos válidos
- ✅ Votos suspeitos
- ✅ Taxa de aprovação
- ✅ Total de estabelecimentos
- ✅ Total de pratos
- ✅ Média geral de notas
- ✅ Média bayesiana mock

**Gráficos (5 gráficos):**
- ✅ Votos por dia (line chart)
- ✅ Distribuição de categorias (bar chart)
- ✅ Top pratos mais avaliados (bar chart)
- ✅ Votos válidos vs inválidos (pie chart)
- ✅ Status de GPS (pie chart)

**Tabelas (3 tabelas):**
- ✅ Últimos votos registrados (com foto, GPS, status)
- ✅ Top Estabelecimentos (posição, nome, votos, média)
- ✅ Top Pratos (nome, categoria, votos, média)

**Alertas:**
- ✅ Cards horizontais com alertas (fotos duplicadas, GPS inconsistente, etc.)

**Destaques da Edição:**
- ✅ Categoria mais ativa
- ✅ Estabelecimento mais votado
- ✅ Crescimento diário
- ✅ Ranking parcial (ou bloqueado se sigilo ativo)

**Loading States:**
- ✅ Ao trocar tenant, aparece skeleton
- ✅ Todos os elementos têm skeleton durante loading

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Todos os cards aparecem
3. ✅ Todos os gráficos renderizam
4. ✅ Todas as tabelas têm dados
5. ✅ Ao trocar tenant, dados são atualizados
6. ✅ Skeletons aparecem durante loading

---

### 2. Cidades (`/dashboard/cidades`)

**URL:** `http://localhost:3000/dashboard/cidades`

#### Elementos a Verificar:

**Cards de Estatísticas:**
- ✅ Total de Cidades
- ✅ Cidades Ativas
- ✅ Total de Estabelecimentos
- ✅ Total de Edições

**Filtros:**
- ✅ Busca por nome/região
- ✅ Filtro por região
- ✅ Filtro por status (ativa/inativa)

**Tabela:**
- ✅ Colunas: Nome, Região, Edições, Estabelecimentos, Status, Ações
- ✅ Botões: Ver (Eye), Editar (Edit)

**Paginação:**
- ✅ Botões Anterior/Próxima funcionam
- ✅ Números de página funcionam
- ✅ Mostra "Mostrando X a Y de Z cidades"

**Ações:**
- ✅ Botão "Nova Cidade" (desabilitado durante loading)
- ✅ Botões de ação desabilitados durante loading

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Filtros funcionam
3. ✅ Busca funciona
4. ✅ Paginação funciona
5. ✅ Botões ficam desabilitados durante loading
6. ✅ Ao clicar em ações, mostra toast (mock)

---

### 3. Edições (`/dashboard/edicoes`)

**URL:** `http://localhost:3000/dashboard/edicoes`

#### Elementos a Verificar:

**Cards de Estatísticas:**
- ✅ Total de Edições
- ✅ Edições Ativas
- ✅ Total de Votos
- ✅ Total de Estabelecimentos

**Filtros:**
- ✅ Busca por nome/cidade
- ✅ Filtro por cidade
- ✅ Filtro por status

**Tabela:**
- ✅ Colunas: Nome, Cidade, Ano, Votos, Estabelecimentos, Sigilo, Status, Ações
- ✅ Badge de sigilo (vermelho se ativo)
- ✅ Botões: Ver, Toggle Sigilo (Lock/LockOpen), Editar

**Multi-Tenant:**
- ✅ Filtra automaticamente por cidade quando tenant selecionado

**Ações:**
- ✅ Botão "Nova Edição" (desabilitado durante loading)
- ✅ Toggle sigilo funciona (mock)
- ✅ Botões desabilitados durante loading

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Filtros funcionam
3. ✅ Toggle sigilo mostra toast
4. ✅ Multi-tenant funciona
5. ✅ Botões desabilitados durante loading

---

### 4. Estabelecimentos (`/dashboard/estabelecimentos`)

**URL:** `http://localhost:3000/dashboard/estabelecimentos`

#### Elementos a Verificar:

**Cards de Estatísticas:**
- ✅ Total de Estabelecimentos
- ✅ Estabelecimentos Ativos
- ✅ Total de Votos
- ✅ Média Geral (oculta se sigilo ativo)

**Filtros:**
- ✅ Busca por nome
- ✅ Filtro por cidade
- ✅ Filtro por status

**Tabela:**
- ✅ Colunas: Posição, Nome, Votos, Média, Status, Ações
- ✅ Ícone de troféu na posição
- ✅ Média oculta se sigilo ativo (`***`)

**Multi-Tenant:**
- ✅ Filtra por cidade/edição selecionados

**Ações:**
- ✅ Botão "Novo Estabelecimento" (desabilitado durante loading)
- ✅ Botões desabilitados durante loading

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Filtros funcionam
3. ✅ Multi-tenant funciona
4. ✅ Média oculta quando sigilo ativo
5. ✅ Botões desabilitados durante loading

---

### 5. Pratos (`/dashboard/pratos`)

**URL:** `http://localhost:3000/dashboard/pratos`

#### Elementos a Verificar:

**Cards de Estatísticas:**
- ✅ Total de Pratos
- ✅ Pratos Ativos
- ✅ Total de Votos
- ✅ Média Geral (oculta se sigilo ativo)

**Filtros:**
- ✅ Busca por nome
- ✅ Filtro por categoria
- ✅ Filtro por estabelecimento

**Tabela:**
- ✅ Colunas: Foto, Nome, Categoria, Estabelecimento, Votos, Média, Ações
- ✅ Avatar com foto do prato
- ✅ Média oculta se sigilo ativo (`***`)

**Multi-Tenant:**
- ✅ Filtra por cidade/edição selecionados

**Ações:**
- ✅ Botão "Novo Prato" (desabilitado durante loading)
- ✅ Botões desabilitados durante loading

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Filtros funcionam
3. ✅ Multi-tenant funciona
4. ✅ Média oculta quando sigilo ativo
5. ✅ Botões desabilitados durante loading

---

### 6. Votos (`/dashboard/votos`)

**URL:** `http://localhost:3000/dashboard/votos`

#### Elementos a Verificar:

**Cards de Estatísticas:**
- ✅ Total de Votos
- ✅ Votos Válidos
- ✅ Votos Suspeitos
- ✅ Taxa de Aprovação

**Filtros:**
- ✅ Busca por prato/estabelecimento
- ✅ Filtro por status (válido/suspeito)
- ✅ Filtro por GPS (válido/inválido)
- ✅ Filtro por estabelecimento

**Tabela:**
- ✅ Colunas: Foto, Prato, Estabelecimento, Horário, GPS, Status, Ações
- ✅ Avatar com foto
- ✅ Badge de GPS
- ✅ Badge de status

**Exportação:**
- ✅ Botão "Exportar CSV" (desabilitado se sigilo ativo ou loading)
- ✅ Funciona quando não há sigilo

**Multi-Tenant:**
- ✅ Filtra por cidade/edição selecionados

**Paginação:**
- ✅ Funciona corretamente

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Filtros funcionam
3. ✅ Exportação funciona (quando não há sigilo)
4. ✅ Exportação bloqueada quando sigilo ativo
5. ✅ Multi-tenant funciona
6. ✅ Botões desabilitados durante loading

---

### 7. Auditoria (`/dashboard/auditoria`)

**URL:** `http://localhost:3000/dashboard/auditoria`

#### Elementos a Verificar:

**Cards de Estatísticas:**
- ✅ Total de Itens
- ✅ Pendentes
- ✅ Validados

**Filtros:**
- ✅ Busca por ID, prato ou estabelecimento
- ✅ Filtro por status (todos/suspeito/validado)

**Tabela:**
- ✅ Colunas: ID do Voto, Foto, Prato/Estabelecimento, GPS, Horário, Status, Ações
- ✅ Botões: Ver (Eye), Validar (CheckCircle2 verde), Suspeitar (XCircle vermelho)

**Modal de Detalhes:**
- ✅ Abre ao clicar em "Ver"
- ✅ Mostra foto grande
- ✅ Mostra todas as informações (hash, GPS, distância, device, etc.)
- ✅ Botões de ação no modal

**Ações:**
- ✅ Validar muda status para "validado"
- ✅ Suspeitar muda status para "suspeito"
- ✅ Botões desabilitados quando status já é o selecionado
- ✅ Botões desabilitados durante loading

**Paginação:**
- ✅ Funciona corretamente

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Filtros funcionam
3. ✅ Modal abre e fecha
4. ✅ Ações mudam status
5. ✅ Botões desabilitados durante loading
6. ✅ Paginação funciona

---

### 8. Moderação (`/dashboard/moderacao`)

**URL:** `http://localhost:3000/dashboard/moderacao`

#### Elementos a Verificar:

**Cards de Estatísticas:**
- ✅ Total de Fotos
- ✅ Pendentes
- ✅ Aprovadas
- ✅ Reprovadas

**Filtros:**
- ✅ Filtro por status (todos/pendente/aprovado/reprovado)

**Lista de Fotos:**
- ✅ Cards com foto (avatar), nome do prato, estabelecimento, horário
- ✅ Badge de status
- ✅ Botões: Ver, Aprovar (verde), Reprovar (vermelho)
- ✅ Botões só aparecem se status = "pendente"

**Modal de Visualização:**
- ✅ Abre ao clicar em "Ver"
- ✅ Mostra foto grande
- ✅ Mostra informações completas
- ✅ Botões de aprovar/reprovar no modal
- ✅ Se reprovada, mostra motivo

**Painel de Denúncias:**
- ✅ Lista de denúncias mockadas
- ✅ Botão "Ver detalhes" em cada denúncia

**Ações:**
- ✅ Aprovar muda status para "aprovado"
- ✅ Reprovar muda status para "reprovado" e adiciona motivo
- ✅ Botões desabilitados durante loading

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Filtros funcionam
3. ✅ Modal abre e fecha
4. ✅ Ações mudam status
5. ✅ Botões desabilitados durante loading
6. ✅ Painel de denúncias aparece

---

### 9. Relatórios (`/dashboard/relatorios`)

**URL:** `http://localhost:3000/dashboard/relatorios`

#### Elementos a Verificar:

**Cards de Relatórios (3 cards):**
- ✅ Relatório por Estabelecimento
- ✅ Relatório por Edição
- ✅ Relatório por Categoria

**Geração de Relatórios:**
- ✅ Botão "Gerar Relatório" em cada card
- ✅ Mostra "Gerando..." durante loading
- ✅ Botões desabilitados durante loading
- ✅ Botões desabilitados se sigilo ativo (exceto categoria)

**Preview do Relatório:**
- ✅ Tabela com dados do relatório gerado
- ✅ Aparece após gerar

**Exportação:**
- ✅ Dropdown de formato (CSV, Excel, PDF)
- ✅ Botão "Exportar"
- ✅ Botão desabilitado se sigilo ativo (exceto categoria)
- ✅ Download funciona (mock)

**Bloqueio para Estabelecimento:**
- ✅ Se role = estabelecimento e premiação não encerrada
- ✅ Mostra card: "Relatório disponível somente após a premiação"

**Testes:**

**Cenário 1: Admin/Franqueado**
1. ✅ Página carrega sem erros
2. ✅ Todos os cards aparecem
3. ✅ Geração funciona
4. ✅ Preview aparece
5. ✅ Exportação funciona
6. ✅ Com sigilo ativo, estabelecimento/edição bloqueados, categoria funciona

**Cenário 2: Estabelecimento (Premiação NÃO Encerrada)**
1. ✅ Mostra card de bloqueio
2. ✅ Não mostra cards de relatórios

**Cenário 3: Estabelecimento (Premiação Encerrada)**
1. ✅ Mostra cards de relatórios
2. ✅ Funciona normalmente

---

### 10. Checklists (`/dashboard/checklists`)

**URL:** `http://localhost:3000/dashboard/checklists`

#### Elementos a Verificar:

**Para Admin/Franqueado:**
- ✅ Mostra todos os checklists (múltiplos estabelecimentos)
- ✅ Tabela com checkboxes
- ✅ Itens: Foto oficial, Cadastro completo, Categorias, Cardápio, Dados bancários, Horários

**Para Estabelecimento:**
- ✅ Mostra apenas seu próprio checklist
- ✅ Mesma estrutura de tabela

**Tabela:**
- ✅ Colunas: Checkbox, Item, Status
- ✅ Checkboxes funcionam (mock)

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Admin vê todos os checklists
3. ✅ Estabelecimento vê apenas o seu
4. ✅ Checkboxes funcionam

---

### 11. Configurações (`/dashboard/configuracoes`)

**URL:** `http://localhost:3000/dashboard/configuracoes`  
**Acesso:** Apenas ADMIN

#### Elementos a Verificar:

**Formulário:**
- ✅ Checkbox "Sigilo Ativo"
- ✅ Checkbox "Premiação Encerrada"
- ✅ Botão "Salvar Alterações"
- ✅ Botão desabilitado durante loading
- ✅ Mostra "Salvando..." durante loading

**Ações:**
- ✅ Salvar atualiza `useAuthStore`
- ✅ Mudanças refletem em todas as páginas
- ✅ Toast de sucesso aparece

**Testes:**
1. ✅ Página carrega sem erros
2. ✅ Checkboxes refletem estado atual
3. ✅ Salvar funciona
4. ✅ Mudanças refletem em outras páginas
5. ✅ Botão desabilitado durante loading

---

## 📱 Testes de Responsividade

### Breakpoints a Testar

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Testes por Dispositivo

#### Mobile (< 768px)

**Sidebar:**
- ✅ Deve estar OCULTA por padrão
- ✅ Botão de menu (hamburger) aparece no Header
- ✅ Ao clicar no menu, sidebar aparece como overlay
- ✅ Ao clicar fora ou em um item, sidebar fecha
- ✅ Sidebar ocupa toda a largura quando aberta

**Header:**
- ✅ Breadcrumb deve estar OCULTO (ou muito reduzido)
- ✅ Tenant selectors devem estar visíveis (mas podem estar em dropdown)
- ✅ Avatar e menu de usuário aparecem

**Conteúdo:**
- ✅ Cards de estatísticas em 1 coluna
- ✅ Gráficos são responsivos (scroll horizontal se necessário)
- ✅ Tabelas têm scroll horizontal
- ✅ Botões de ação ficam empilhados verticalmente
- ✅ Filtros ficam empilhados verticalmente

**Páginas Específicas:**
- ✅ Dashboard: Cards em 1 coluna, gráficos responsivos
- ✅ Tabelas: Scroll horizontal funciona
- ✅ Moderação: Cards de fotos em 1 coluna

#### Tablet (768px - 1024px)

**Sidebar:**
- ✅ Pode estar oculta ou visível (depende do design)
- ✅ Menu hamburger funciona

**Conteúdo:**
- ✅ Cards de estatísticas em 2 colunas
- ✅ Gráficos são responsivos
- ✅ Tabelas podem ter scroll horizontal

#### Desktop (> 1024px)

**Sidebar:**
- ✅ Deve estar VISÍVEL sempre
- ✅ Largura fixa (64 = 256px)
- ✅ Não deve colapsar

**Conteúdo:**
- ✅ Cards de estatísticas em 4 colunas (quando possível)
- ✅ Gráficos ocupam espaço adequado
- ✅ Tabelas sem scroll horizontal (quando possível)
- ✅ Layout completo e espaçado

### Testes Específicos

1. **Redimensione a janela do navegador:**
   - ✅ De desktop para mobile
   - ✅ De mobile para desktop
   - ✅ Verifique se não há quebras de layout

2. **Teste em diferentes dispositivos:**
   - ✅ iPhone (375px, 414px)
   - ✅ iPad (768px, 1024px)
   - ✅ Desktop (1280px, 1920px)

3. **Teste orientação:**
   - ✅ Portrait (vertical)
   - ✅ Landscape (horizontal)

---

## 🎨 Testes de UX

### Loading States

**Verificar em TODAS as páginas:**

1. **Ao carregar página inicial:**
   - ✅ Skeleton aparece
   - ✅ Não há layout shift (flickering)
   - ✅ Conteúdo aparece após delay (400-900ms)

2. **Ao trocar tenant:**
   - ✅ Skeleton aparece imediatamente
   - ✅ Dados são atualizados após delay
   - ✅ Não há flickering

3. **Ao clicar em ações:**
   - ✅ Botões ficam desabilitados
   - ✅ Loading spinner aparece (se aplicável)
   - ✅ Feedback visual claro

### Transições

1. **Navegação entre páginas:**
   - ✅ Transição suave
   - ✅ Sem flickering
   - ✅ Loading aparece quando necessário

2. **Mudanças de estado:**
   - ✅ Animações suaves
   - ✅ Feedback visual imediato

### Feedback Visual

1. **Toasts:**
   - ✅ Aparecem ao realizar ações
   - ✅ Mensagem clara
   - ✅ Desaparecem automaticamente

2. **Badges e Status:**
   - ✅ Cores corretas (verde=válido, vermelho=suspeito, etc.)
   - ✅ Textos claros

3. **Botões Desabilitados:**
   - ✅ Visualmente diferentes (opacidade reduzida)
   - ✅ Cursor "not-allowed"
   - ✅ Não respondem a cliques

### Acessibilidade

1. **Navegação por Teclado:**
   - ✅ Tab funciona em todos os elementos interativos
   - ✅ Enter/Space ativam botões
   - ✅ Escape fecha modais

2. **Contraste:**
   - ✅ Textos legíveis
   - ✅ Cores com contraste adequado

3. **Labels:**
   - ✅ Todos os inputs têm labels
   - ✅ Botões têm textos descritivos ou aria-labels

### Performance

1. **Delays:**
   - ✅ Padrão: 400-900ms
   - ✅ Query param `?delay=fast` reduz delay
   - ✅ Query param `?delay=slow` aumenta delay

2. **Renderização:**
   - ✅ Sem erros no console
   - ✅ Sem warnings
   - ✅ Performance adequada

---

## ✅ Checklist Final

### Funcionalidades Principais

- [ ] Sistema de roles funciona (admin, franqueado, estabelecimento)
- [ ] Permissões corretas para cada role
- [ ] Redirecionamento funciona para rotas bloqueadas
- [ ] Multi-tenant funciona (região > cidade > edição)
- [ ] Filtros por tenant funcionam em todas as páginas
- [ ] Sigilo funciona (oculta médias, bloqueia exportação)
- [ ] Loading states funcionam em todas as páginas
- [ ] Botões desabilitados durante loading

### Páginas

- [ ] Dashboard principal completa e funcional
- [ ] Cidades completa e funcional
- [ ] Edições completa e funcional
- [ ] Estabelecimentos completa e funcional
- [ ] Pratos completa e funcional
- [ ] Votos completa e funcional
- [ ] Auditoria completa e funcional
- [ ] Moderação completa e funcional
- [ ] Relatórios completa e funcional
- [ ] Checklists completa e funcional
- [ ] Configurações completa e funcional

### Responsividade

- [ ] Mobile funciona (< 768px)
- [ ] Tablet funciona (768px - 1024px)
- [ ] Desktop funciona (> 1024px)
- [ ] Sidebar colapsa corretamente no mobile
- [ ] Gráficos são responsivos
- [ ] Tabelas têm scroll quando necessário

### UX

- [ ] Loading states adequados
- [ ] Transições suaves
- [ ] Feedback visual claro
- [ ] Toasts funcionam
- [ ] Modais abrem/fecham corretamente
- [ ] Navegação por teclado funciona
- [ ] Sem erros no console

---

## 🐛 Problemas Conhecidos / Limitações

1. **Tudo é mockado:** Nenhuma ação persiste após refresh
2. **Delays simulados:** Não são delays reais de API
3. **Dados estáticos:** Não há criação/edição real de dados
4. **Sem autenticação real:** Role é alterado manualmente no código

---

## 📝 Notas Finais

- **Todos os testes devem ser feitos manualmente**
- **Anote qualquer problema encontrado**
- **Teste em diferentes navegadores (Chrome, Firefox, Safari)**
- **Teste em diferentes dispositivos se possível**
- **Verifique console do navegador para erros**

---

**Boa sorte com os testes! 🚀**

