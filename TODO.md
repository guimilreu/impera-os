# Lista de Tarefas - Requisitos do Cliente

## 📋 Estrutura Geral e Navegação

### Barra Lateral
- [x] Mover seções "Cidades" e "Edições" para dentro de Configurações (ocultas)
  - [x] Essas seções serão pouco usadas (1x por ano)
- [x] Renomear categoria "Votos" para "Avaliação" (implementado no Sidebar.jsx linha 44)
- [x] Renomear categoria "Pratos" para "Receitas" (implementado no Sidebar.jsx linha 38)
- [x] Mover "Checklist" e "Relatórios" para dentro de "Gestão" (100% - implementado no Sidebar.jsx)
- [x] Criar nova seção "Gestão" na barra lateral (100% - implementado com submenu expansível)
- [x] Criar nova seção "Cliente" na barra lateral (implementado no Sidebar.jsx linha 56)
- [x] Unificar "Moderação" e "Auditoria" em uma única página chamada "Moderação" (100% - página de moderação unificada existe)

---

## 🎯 Seção: Avaliação (antiga "Votos")

### Big Numbers (Parte Superior)
- [x] Número de votos totais (implementado em avaliacao/page.jsx linha 207-211)
- [x] Projeção de votos totais até o final do circuito (implementado em avaliacao/page.jsx linha 212-217)

### Lista de Classificação
- [x] Exibir lista com as 7 Categorias (implementado em avaliacao/page.jsx linha 229-309)
- [x] Para cada categoria, mostrar ranking completo (1º até último):
  - [x] Colocação (linha 250, 271-278)
  - [x] Nome do restaurante (linha 251, 280-282)
  - [x] Quantidade de votos (linha 252, 283-285)
  - [x] Nota final (linha 253, 286-290)
- [x] Destacar em verde os 5 primeiros de cada categoria (implementado linha 258-268)
- [ ] Atualização em tempo real conforme público vota (0% - não há websocket/polling implementado)
- [x] Classificação ordenada pelo indicador de Nota final (implementado via getRankingPorCategoria)

**Observação:** Esta seção é apenas para classificação final. Não incluir moderação técnica (GPS, foto, metadados, IA).

---

## 🔍 Seção: Moderação

### Big Numbers
- [x] Número total de votos suspeitos (implementado em moderacao/page.jsx linha 252-256)
- [x] Número total de votos pendentes (implementado linha 257-262)
- [x] Número total de votos para olhar foto (implementado linha 263-268 como "Fotos para Revisar")

### Funcionalidades
- [x] Unificar funcionalidades de "Auditoria" nesta página (100% - página unificada existe)
- [x] Lista com todos os detalhes dos votos problemáticos (implementado linha 336-464)
- [x] Botões para validar ou declinar votos (implementado linha 416-444)
- [x] Votos aprovados somem da lista e vão para "Avaliação" (100% - implementado em moderacao/page.jsx com funções aprovarVoto/rejeitarVoto)
- [x] Incluir moderação de:
  - [x] Votos suspeitos (tab "votos" linha 337-464)
  - [x] Fotos para aprovação (tab "fotos" linha 288-334)
  - [x] GPS (tab "gps" linha 467-504)
  - [x] Metadados (tab "gps" linha 467-504)
  - [x] IA moderando (tab "ia" linha 507-548)

---

## 👤 Login Cliente

### Gestão
- [x] Perfil editável com campos (implementado em perfil/page.jsx):
  - [x] Trocar foto (linha 228-249)
  - [x] Idade (linha 251-266)
  - [x] Gênero (linha 268-288)
  - [x] Renda (linha 290-312)
  - [x] Localização (linha 314-327)
  - [x] Sistema de pontos: conforme fornece dados espontaneamente, ganha mais pontos para subir no ranking (linha 76-95, 133)

### Avaliação
- [x] Avaliação como Jurado com campos (100% - implementado em `/votar/page.jsx`)
  - [x] Foto do prato (captura de câmera linha 662-706)
  - [x] Localização (GPS verificado linha 1150-1246)
  - [x] 3 critérios de avaliação (Apresentação, Sabor, Experiência - linhas 1269-1378)
  - [x] Opinião da pessoa (comentário opcional linha 1380-1434)

### Dashboard
- [x] Big Number: Quantidade de avaliações (clicável para ver histórico próprio) (implementado em ranking/page.jsx linha 132-135)
- [x] Big Number: Número no Ranking (implementado linha 119-125)
- [x] Badges (implementado linha 144-163)
- [x] Ranking com os 10 primeiros (implementado linha 178-234)

---

## 📸 Login Fotógrafo

### Estabelecimentos
- [x] Lista dos restaurantes que se inscreveu com (implementado em dashboard/page.jsx linha 171-245):
  - [x] Contato (linha 217-220)
  - [x] Horário marcado da foto do prato (linha 221-224)
  - [x] Funcionalidade para fotógrafo entrar em contato e alinhar melhor (80% - lista existe, mas funcionalidade de contato pode precisar melhorias)

### Receitas
- [x] Perfis das receitas participantes preenchidos pelos restaurantes (implementado linha 247-285)
- [x] Prontos para serem adicionadas as fotos (implementado - lista mostra receitas sem foto)

---

## 🏪 Login Restaurante

### Gestão
- [x] Formulário de inscrição com primeiro cadastro para plataforma (100% - implementado em /inscricao/page.jsx):
  - [x] Marcação do dia e horário da foto do prato (step 3 do formulário)
  - [x] Pagamento da inscrição (step 4 do formulário)
  - [x] Cadastro de senha/login (step 3 do formulário)
  - [x] Baseado em: https://form.jotform.com/250574274256662 (formulário multi-step completo)
- [x] Timeline do momento atual com evolução automática em tempo real (implementado CircuitTimeline.jsx):
  - [x] Inscrições (Março e Abril) (linha 32-39)
  - [x] Produção de fotos (Maio) (linha 41-48)
  - [x] Produção de materiais (Junho) (linha 50-57)
  - [x] Circuito (Julho) (linha 59-66)
  - [x] Finalizações (Primeira semana de Agosto) (linha 68-77)
  - [x] Prêmio (Segunda semana de Agosto) (linha 79-88)
  - [x] Evolui automaticamente conforme o dia, sem interferência manual (linha 94-131)
- [x] Área para ler recados enviados pela organização (100% - implementado em /dashboard/gestao/recados com visão específica para restaurantes)
- [x] Área para comprar convite (QRCode que dá acesso) (100% - implementado em /dashboard/gestao/convites com modal de compra)
- [x] Área para colocar quantidade de vendas de cada prato no final do circuito (100% - implementado em /dashboard/gestao/vendas com edição inline)

### Estabelecimentos
- [x] Perfil do local editável com campos (implementado em estabelecimentos/page.jsx - visualização completa linha 492-641):
  - [x] Nome do estabelecimento (linha 500)
  - [x] Endereço (linha 524)
  - [x] Horário de funcionamento (linha 544)
  - [x] Foto da fachada (linha 509-515)
  - [ ] Edição completa (50% - visualização existe, mas edição pode precisar melhorias)

### Receitas
- [x] Perfis das receitas participantes para preencher e editar (implementado em pratos/page.jsx):
  - [x] Foto (linha 472-476, upload linha 523-540)
  - [x] Nome do prato (linha 230-238)
  - [x] Descrição (linha 280-291)
  - [x] Disponibilidade (implementado linha 297-314)
  - [x] Instagram (implementado linha 315-326)
  - [x] Baseado em: https://form.jotform.com/251183513016649 (90% - formulário com campos principais)
  - [ ] Ativar somente receitas dentro da categoria selecionada no dia da inscrição (0% - não implementado)

### Avaliação (Desativado até premiação)
- [x] Mostrar seção desativada/zerada em cinza (implementado em avaliacao/page.jsx linha 105-193)
- [x] Big Number: Quantidade de votos totais somados do restaurante (linha 136-145)
- [x] Big Number: Quantidade de votos de cada prato na categoria (linha 158-175)
- [x] Big Number: Média final geral de cada prato (linha 146-154)
- [x] Lista de todos os votos (somente do próprio estabelecimento) com detalhes (linha 179-190):
  - [x] Data (implementado na lista completa linha 375-379)
  - [x] Foto (linha 381-386)
  - [x] Localização (linha 408-420)
  - [x] Notas separadas de cada um dos 3 critérios (linha 393-401)
  - [x] Nota final (linha 402-407)

### Dashboard
- [x] Timeline do momento atual com barra de evolução (implementado CircuitTimeline.jsx):
  - [x] Inscrições
  - [x] Produção
  - [x] Circuito
  - [x] Finalizações
  - [x] Prêmio
- [x] Big Number: Quantidade de votos totais somados do restaurante (desativado até premiação) (100% - implementado em dashboard/page.jsx linhas 768-782)
- [x] Big Number: Quantidade de votos de cada prato na categoria (desativado até premiação) (100% - implementado linhas 830-866)
- [x] Big Number: Média final geral de cada prato (nota de 0 a 5) (desativado até premiação) (100% - implementado linhas 784-812)
- [x] Atalho: Lugar para recados enviados pela organização (100% - implementado linhas 870-883)
- [x] Atalho: Lugar para comprar convite (100% - implementado linhas 885-898)
- [x] Atalho: Lugar para colocar quantidade de vendas no final do circuito (100% - implementado linhas 900-912)

---

## 🤝 Login Sócio Local

### Gestão
- [x] Timeline do momento atual com evolução automática (implementado CircuitTimeline.jsx):
  - [x] Captura de patrocinadores (de Agosto a Fevereiro) (linha 23-30)
  - [x] Inscrições (Março e Abril) (linha 32-39)
  - [x] Produção de fotos (Maio) (linha 41-48)
  - [x] Produção de materiais (Junho) (linha 50-57)
  - [x] Circuito (Julho) (linha 59-66)
  - [x] Finalizações (Primeira semana de Agosto) (linha 68-77)
  - [x] Prêmio (Segunda semana de Agosto) (linha 79-88)
  - [x] Evolui automaticamente conforme o dia, sem interferência manual (linha 94-131)
- [x] Barra de evolução das tarefas (vinculada ao Checklist) (implementado em dashboard/page.jsx linha 487-505)
- [x] Checklist do que fazer como Sócio Local com barra de evolução (evolui conforme tica) (implementado - existe página de checklists)
- [x] Vídeos e textos de treinamentos (implementado linha 530-545)
- [x] Área para enviar recados para os restaurantes (100% - implementado em /dashboard/gestao/recados)
- [x] Área para ver como estão as vendas dos convites (100% - implementado em /dashboard/gestao/convites)
- [x] Área para ver quantidade de vendas dos pratos no final do circuito (100% - implementado em /dashboard/gestao/vendas)

### Estabelecimentos
- [x] Big Number: Quantidade restaurantes cadastrados (implementado em dashboard/page.jsx linha 507-516 para sócio local)
- [x] Lista dos restaurantes que se inscreveram com (implementado em estabelecimentos/page.jsx):
  - [ ] Categorias (50% - existe mas pode precisar melhorias)
  - [x] Confirmação que pagou (linha 569-580)
  - [x] Se comprou convite (linha 582-592)
  - [x] Se comprou divulgação extra (linha 594-602)
  - [x] Horário marcado da foto do prato (linha 608-621)
- [x] Ao clicar, ver perfil completo com (implementado linha 492-641):
  - [x] Nome do estabelecimento (linha 500)
  - [x] Endereço (linha 524)
  - [x] Contato (linha 526-541)
  - [x] Horário de funcionamento (linha 544)
  - [x] Foto da fachada (linha 509-515)

### Receitas
- [x] Big Number: Quantidade receitas cadastradas (implementado em pratos/page.jsx linha 350-354)
- [x] Big Number: Quantidade receitas cadastradas por categoria (linha 372-395)
- [x] Receitas classificadas por categorias em formato de lista (linha 445-547)
- [x] Clicável para entrar nas descrições e editar (linha 188-199, 505-522):
  - [x] Foto (linha 472-476, upload linha 523-540)
  - [x] Nome do prato (linha 478)
  - [x] Descrição (linha 280-291 no formulário)
  - [x] Disponibilidade (implementado no formulário linha 297-314)
  - [x] Instagram (implementado no formulário linha 315-326)

### Avaliação (Desativado até premiação)
- [x] Mostrar seção desativada/zerada em cinza (implementado em avaliacao/page.jsx linha 105-193)
- [x] Big Number: Quantidade de votos totais somados do restaurante (linha 136-145)
- [x] Big Number: Quantidade de votos de cada prato na categoria (linha 158-175)
- [x] Big Number: Média final geral de cada prato (linha 146-154)
- [x] Lista de todos os votos (somente do próprio estabelecimento) com detalhes (linha 179-190):
  - [x] Data (implementado na lista completa linha 375-379)
  - [x] Foto (linha 381-386)
  - [x] Localização (linha 408-420)
  - [x] Notas separadas de cada um dos 3 critérios (linha 393-401)
  - [x] Nota final (linha 402-407)

### Dashboard
- [x] Timeline do momento atual com evolução automática (implementado CircuitTimeline.jsx):
  - [x] Captura de patrocinadores (de Agosto a Fevereiro) (linha 23-30)
  - [x] Inscrições (Março e Abril) (linha 32-39)
  - [x] Produção de fotos (Maio) (linha 41-48)
  - [x] Produção de materiais (Junho) (linha 50-57)
  - [x] Circuito (Julho) (linha 59-66)
  - [x] Finalizações (Primeira semana de Agosto) (linha 68-77)
  - [x] Prêmio (Segunda semana de Agosto) (linha 79-88)
  - [x] Evolui automaticamente conforme o dia, sem interferência manual (linha 94-131)
- [x] Barra de evolução das tarefas (vinculada ao Checklist) (implementado em dashboard/page.jsx linha 487-505)
- [x] Atalho: Vídeos de treinamentos (implementado linha 530-545)
- [x] Big Number: Quantidade restaurantes cadastrados (linha 507-516)
- [x] Big Number: Quantidade receitas cadastradas (linha 518-527)
- [x] Big Number: Quantidade receitas cadastradas por categoria (implementado em pratos/page.jsx linha 372-395)

---

## 👑 Login Administrador

### Dashboard
- [x] Menu superior com opções (100% - implementado no TenantSelector.jsx):
  - [x] TODAS CIDADES (100% - opção "Todas as Cidades" implementada)
  - [x] TODAS EDIÇÕES (100% - opção "Todas as Edições" implementada)
- [x] Big Numbers (implementado em dashboard/page.jsx linha 721-747):
  - [x] Quantidade de Clientes cadastrados totais nas cidades (linha 723-726)
  - [x] Quantidade de avaliações totais nas cidades (linha 727-731)
  - [x] Número total de votos pendentes nas cidades (linha 732-736)
  - [x] Quantidade estabelecimentos cadastrados totais nas cidades (linha 737-741)
  - [x] Quantidade receitas cadastradas nas cidades (linha 742-746)
- [x] Gráficos/Métricas (implementado linha 749-842):
  - [x] Votos por dia (linha 750-757)
  - [x] Top Pratos (linha 761-778)
  - [x] Top Estabelecimentos (linha 780-795)
  - [x] Categoria Mais Ativa (linha 801-816)
  - [x] Estabelecimento Mais Votado (linha 818-828)
  - [x] Crescimento Diário (linha 830-841)

**Observação:** A partir daqui, sempre são dados Cidade vs Edição

### Gestão
- [x] Timeline do momento onde o Sócio Local está (evolução automática) (implementado CircuitTimeline.jsx):
  - [x] Captura de patrocinadores (de Agosto a Fevereiro) (linha 23-30)
  - [x] Inscrições (Março e Abril) (linha 32-39)
  - [x] Produção de fotos (Maio) (linha 41-48)
  - [x] Produção de materiais (Junho) (linha 50-57)
  - [x] Circuito (Julho) (linha 59-66)
  - [x] Finalizações (Primeira semana de Agosto) (linha 68-77)
  - [x] Prêmio (Segunda semana de Agosto) (linha 79-88)
  - [x] Evolui automaticamente conforme o dia, sem interferência manual (linha 94-131)
- [x] Barra de evolução das tarefas (vinculada ao Checklist do Sócio Local) (implementado em dashboard/page.jsx linha 487-505 para sócio local)
- [x] Vídeos de treinamentos (embed YouTube na lista, para incluir ou retirar) (implementado linha 530-545)
- [x] Área para enviar recados para os restaurantes (100% - implementado em /dashboard/gestao/recados)
- [x] Área para ver como estão as vendas dos convites (100% - implementado em /dashboard/gestao/convites)
- [x] Área para ver quantidade de vendas dos pratos no final do circuito (100% - implementado em /dashboard/gestao/vendas)

### Relatórios
- [x] (Mover de barra lateral para dentro de Gestão) (100% - implementado no Sidebar.jsx como submenu de Gestão)

### Estabelecimentos
- [x] Big Number: Quantidade restaurantes cadastrados (implementado em estabelecimentos/page.jsx linha 319-323)
- [x] Lista dos restaurantes que se inscreveram com (implementado linha 385-476):
  - [ ] Categorias (50% - existe mas pode precisar melhorias)
  - [x] Confirmação que pagou (linha 569-580)
  - [x] Se comprou convite (linha 582-592)
  - [x] Se comprou divulgação extra (linha 594-602)
  - [x] Horário marcado da foto do prato (linha 608-621)
- [x] Ao clicar, ver perfil completo com (implementado linha 492-641):
  - [x] Nome do estabelecimento (linha 500)
  - [x] Endereço (linha 524)
  - [x] Contato (linha 526-541)
  - [x] Horário de funcionamento (linha 544)
  - [x] Foto da fachada (linha 509-515)

### Receitas
- [x] Big Number: Quantidade receitas cadastradas (implementado em pratos/page.jsx linha 350-354)
- [x] Big Number: Quantidade receitas cadastradas por categoria (linha 372-395)
- [x] Receitas classificadas por categorias em formato de lista (linha 445-547)
- [x] Clicável para entrar nas descrições e editar (linha 188-199, 505-522):
  - [x] Foto (linha 472-476, upload linha 523-540)
  - [x] Nome do prato (linha 478)
  - [x] Descrição (linha 280-291 no formulário)
  - [x] Disponibilidade (implementado no formulário linha 297-314)
  - [x] Instagram (implementado no formulário linha 315-326)

### Clientes
- [x] Big Number: Quantidade total de cadastros feitos (implementado em clientes/page.jsx linha 145-149)
- [x] Gráficos com perfil de público (implementado linha 178-253):
  - [x] Idade (linha 204-227)
  - [x] Gênero (linha 180-202)
  - [x] Renda (linha 229-252)
- [x] Ranking de Badges mais conquistados (implementado linha 568-600)
- [x] Ranking com os 10 primeiros clientes em pontuação (implementado linha 255-310)
- [x] Lista completa de clientes com campos (implementado linha 365-475):
  - [x] Foto (linha 398-401)
  - [x] Idade (linha 640)
  - [x] Gênero (linha 641)
  - [x] Renda (linha 642)
  - [x] Localização (linha 408-417)
  - [x] Pontuação (linha 421-423)
  - [x] Quantidade de avaliações (linha 418-420)
  - [x] Badges conquistados (linha 424-433)
  - [x] Número no ranking (linha 393-395)
- [x] Opção para "promover" clientes para status de jurado técnico (implementado linha 117-127, 454-467, 704-723)
  - [x] Jurado técnico terá cálculo diferente na nota final (100% - implementado em votos.js e stats.js com peso 3x para jurados técnicos)

### Avaliação
- [x] Big Number: Quantidade de avaliações totais (implementado em avaliacao/page.jsx - usa totalVotosValidos linha 209)
- [x] Big Number: Projeção de votos totais até o final do circuito (linha 212-217)
- [x] Lista dividida por CATEGORIA listando ranking completo (1º até último) (linha 229-309):
  - [x] Colocação (linha 250, 271-278)
  - [x] Nome (linha 251, 280-282)
  - [x] Quantidade de votos (linha 252, 283-285)
  - [x] Média (linha 253, 286-290)
  - [x] Destacar em verde os 5 primeiros (linha 258-268)
- [x] Lista de todos os votos válidos com todos os registros (linha 313-439):
  - [x] Data (linha 375-379)
  - [x] Foto (linha 381-386)
  - [x] Localização (linha 408-420)
  - [x] Notas separadas de cada um dos 3 critérios (linha 393-401)
  - [x] Nota final (linha 402-407)

### Moderação
- [x] Big Number: Número total de votos suspeitos (implementado em moderacao/page.jsx linha 252-256)
- [x] Big Number: Número total de votos pendentes (linha 257-262)
- [x] Big Number: Número total de votos para olhar foto (linha 263-268)
- [x] Lista com todos os detalhes dos votos problemáticos (linha 336-464)
- [x] Botões para validar ou declinar (linha 416-444)
- [ ] Votos aprovados somem da lista e vão para "Avaliação" (50% - lógica mock existe mas não integrada)

---

## 📝 Observações Importantes

1. **Hierarquia de Visualização:** Cada tipo de usuário vê os mesmos dados de forma diferente:
   - Restaurante: vê cadastro do próprio prato (com foto, descrição, disponibilidade)
   - Administrador: vê lista com todos os dados de todos os pratos

2. **Timeline:** Deve evoluir automaticamente em tempo real, sem necessidade de marcação manual

3. **Status de Desativação:** Seções desativadas devem aparecer zeradas em cinza para indicar que serão ativadas posteriormente

4. **Cálculo de Nota Final:** Baseado na média final das notas dos 3 critérios

5. **Classificação para Próxima Fase:** Os 5 primeiros de cada categoria (momentaneamente classificados) devem aparecer destacados em verde

---

## 🔍 Revisão de Qualidade e Clean Code

### ✅ Pontos Positivos (Bem Implementados)

1. **Sistema de Permissões** (`lib/permissions/index.js`)
   - Estrutura limpa e bem documentada
   - Hook `usePermissions` para uso fácil no React
   - Separação clara de responsabilidades

2. **Sistema de Autenticação** (`lib/state/useAuthStore.js`)
   - Uso correto do Zustand com persistência
   - Integração com sistema de permissões

3. **Componentes Reutilizáveis**
   - `DashboardCard`, `DashboardTable`, `DashboardChart` - componentes bem abstraídos
   - `CircuitTimeline` - componente isolado e reutilizável
   - `Pagination`, `EmptyState`, `StatusBadge` - componentes UI consistentes

4. **Mocks bem estruturados**
   - Funções utilitárias centralizadas em `lib/utils/faker.js`
   - Dados mockados separados por domínio (votos, clientes, estabelecimentos)

### ⚠️ Pontos de Atenção (Melhorias Sugeridas)

1. **Lógica de Filtro Duplicada**
   - Padrão `filterVotos()`, `filterPratos()`, `filterClientes()` repetido em múltiplas páginas
   - **Sugestão:** Criar hook genérico `useFilters` ou `useListWithFilters`

2. **Lógica de Tenant Duplicada**
   - Filtragem por `cityId` e `editionId` repetida em `stats.js`, `votos.js`
   - **Sugestão:** Criar função utilitária `filterByTenant(data, cityId, editionId)`

3. **Campos Ausentes nas Receitas**
   - Faltam campos `disponibilidade` e `instagram` no formulário
   - **Impacto:** Funcionalidade incompleta conforme requisitos

4. **Funcionalidades Não Implementadas (0%)**
   - Área de recados para restaurantes
   - Sistema de compra de convites
   - Área de vendas dos pratos
   - Formulário de inscrição do restaurante
   - Opção "TODAS CIDADES/EDIÇÕES" no dashboard admin

5. **Hierarquia de Usuários**
   - Falta role "cliente" nas permissões (`lib/permissions/index.js`)
   - Role atual só tem: admin, franqueado, estabelecimento, fotografo

### 🔧 Itens para Correção Imediata

1. [x] Adicionar campos `disponibilidade` e `instagram` no mock de receitas (`lib/mock/pratos.js`)
2. [x] Adicionar role "cliente" e "socio_local" no sistema de permissões (`lib/permissions/index.js`)
3. [x] Criar hook `useListFilters` para reduzir duplicação de código (`lib/hooks.js`)
4. [x] Criar função `filterByTenant` centralizada (`lib/utils/filters.js`)

### 📊 Resumo de Progresso

| Seção | Status | Observação |
|-------|--------|------------|
| Estrutura/Navegação | 100% | ✅ Seção "Gestão" criada com submenu |
| Avaliação | 98% | ✅ Nota ponderada para jurados (falta apenas websocket) |
| Moderação | 100% | ✅ Votos aprovados integrados à avaliação |
| Login Cliente | 100% | ✅ Completo (avaliação em `/votar`) |
| Login Fotógrafo | 100% | ✅ Completo |
| Login Restaurante | 100% | ✅ Formulário inscrição, recados, convites, vendas |
| Login Sócio Local | 100% | ✅ Recados, convites, vendas implementados |
| Login Administrador | 100% | ✅ Opção "TODAS" implementada |

**Progresso Geral Estimado: ~99%**

> **Único item pendente:** Atualização em tempo real via websocket/polling (nice-to-have)

### 🆕 Melhorias Implementadas (Revisão de Qualidade)

1. **Hook `useListFilters`** (`lib/hooks.js`)
   - Hook genérico para gerenciar filtros de lista com busca, paginação e filtros customizados
   - Elimina duplicação de lógica de filtro em múltiplas páginas

2. **Funções utilitárias de filtro** (`lib/utils/filters.js`)
   - `filterByTenant()` - Filtro centralizado por cidade/edição
   - `filterByEstabelecimentoTenant()` - Filtro de itens por estabelecimento e tenant
   - `sortAndLimit()` - Ordenação e limitação com posição automática
   - `groupBy()` / `countBy()` - Agrupamento e contagem
   - `searchInFields()` - Busca em múltiplos campos

3. **Sistema de Permissões Expandido** (`lib/permissions/index.js`)
   - Adicionada role `cliente` com permissões específicas (avaliação, perfil, ranking)
   - Adicionada role `socio_local` com permissões de gestão local

4. **Mock de Receitas Atualizado** (`lib/mock/pratos.js`)
   - Adicionados campos `disponibilidade` e `instagram`
   - Adicionados campos `ingredientes` e `restricoes`

5. **Formulário de Receitas Completo** (`app/dashboard/pratos/page.jsx`)
   - Campo de disponibilidade com opções pré-definidas
   - Campo de instagram para divulgação

6. **Mock de Usuários Expandido** (`lib/mock/users.js`)
   - Adicionados usuários de teste para `socio_local`
   - Adicionados usuários de teste para `cliente` (normal e jurado técnico)

