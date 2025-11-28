# Especificação de Permissões - ImperaOS

## Resumo do Sistema

O sistema possui 4 roles (papéis) de usuários:
- **Admin**: Acesso total ao sistema
- **Franqueado**: Gerencia operações em sua cidade/edição
- **Estabelecimento**: Visualiza apenas seus dados e checklists
- **Fotógrafo**: Visualiza estabelecimentos e receitas para fotografia

## Permissões por Role

### 🔴 Admin (Administrador)
**Acesso total ao sistema**

| Módulo | Ver | Criar | Editar | Deletar | Aprovar | Exportar |
|--------|-----|-------|--------|---------|---------|----------|
| Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cidades | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Edições | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Estabelecimentos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Receitas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Votos | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Moderação | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Relatórios | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Checklists | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Configurações | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |

**O que o Admin pode fazer:**
- Gerenciar tudo no sistema
- Aprovar/rejeitar estabelecimentos e receitas
- Moderar votos
- Configurar sistema
- Exportar todos os dados

---

### 🟡 Franqueado
**Gerencia operações em sua cidade**

| Módulo | Ver | Criar | Editar | Deletar | Aprovar | Exportar |
|--------|-----|-------|--------|---------|---------|----------|
| Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Cidades | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Edições | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Estabelecimentos | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Receitas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Votos | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Moderação | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Relatórios | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Checklists | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Configurações | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**O que o Franqueado pode fazer:**
- Gerenciar sua cidade/edição
- Cadastrar e gerenciar estabelecimentos
- Aprovar/rejeitar estabelecimentos e receitas
- Moderar votos
- Exportar dados
- **NÃO pode:** acessar configurações globais

---

### 🟢 Estabelecimento
**Visualiza apenas seus próprios dados**

| Módulo | Ver | Criar | Editar | Deletar | Aprovar | Exportar |
|--------|-----|-------|--------|---------|---------|----------|
| Dashboard | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cidades | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edições | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estabelecimentos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Receitas | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Votos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Moderação | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Relatórios | ✅* | ❌ | ❌ | ❌ | ❌ | ✅* |
| Checklists | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Configurações | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

*Apenas se a premiação estiver encerrada

**O que o Estabelecimento pode fazer:**
- Ver e preencher checklists
- Ver relatórios (apenas após premiação encerrada)
- Exportar seus próprios relatórios
- **NÃO pode:** ver ou editar nada além disso

---

### 🔵 Fotógrafo
**Visualiza estabelecimentos e receitas para fotografia**

| Módulo | Ver | Criar | Editar | Deletar | Aprovar | Exportar |
|--------|-----|-------|--------|---------|---------|----------|
| Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Cidades | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edições | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Estabelecimentos | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Receitas | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Votos | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Moderação | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Relatórios | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Checklists | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Configurações | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

**O que o Fotógrafo pode fazer:**
- Ver dashboard com suas tarefas (estabelecimentos e receitas)
- Ver lista de estabelecimentos (apenas leitura - para contato e agendamento)
- Ver lista de receitas (apenas leitura - para saber quais fotografar)
- **NÃO pode:** criar, editar ou deletar NADA
- **NÃO pode:** acessar votos, moderação ou configurações

---

## Implementação

### Como usar no código

```javascript
import { useAuthStore } from '@/lib/state/useAuthStore'
import { usePermissions } from '@/lib/permissions'

function MyComponent() {
  const { role } = useAuthStore()
  const permissions = usePermissions(role)

  return (
    <div>
      {/* Verifica se pode ver */}
      {permissions.canView('estabelecimentos') && (
        <p>Você pode ver estabelecimentos</p>
      )}

      {/* Verifica se pode criar */}
      {permissions.canCreate('estabelecimentos') && (
        <Button>Criar Estabelecimento</Button>
      )}

      {/* Verifica se pode editar */}
      {permissions.canEdit('estabelecimentos') && (
        <Button>Editar</Button>
      )}

      {/* Verifica se pode deletar */}
      {permissions.canDelete('estabelecimentos') && (
        <Button variant="destructive">Deletar</Button>
      )}

      {/* Verifica se pode aprovar */}
      {permissions.canApprove('estabelecimentos') && (
        <Button>Aprovar/Rejeitar</Button>
      )}

      {/* Verifica se pode exportar */}
      {permissions.canExport('estabelecimentos') && (
        <Button>Exportar Dados</Button>
      )}
    </div>
  )
}
```

### Funções disponíveis

- `canView(role, module)` - Pode visualizar a página?
- `canCreate(role, module)` - Pode criar novos registros?
- `canEdit(role, module)` - Pode editar registros?
- `canDelete(role, module)` - Pode deletar registros?
- `canApprove(role, module)` - Pode aprovar/rejeitar?
- `canExport(role, module)` - Pode exportar dados?
- `getModulePermissions(role, module)` - Retorna todas as permissões
- `canDoAnyAction(role, module)` - Tem alguma permissão de ação?

---

## Integração com API

Quando integrar com a API:

1. **Backend deve validar SEMPRE**: Nunca confie apenas no frontend
2. **Use os mesmos roles**: admin, franqueado, estabelecimento, fotografo
3. **Valide cada ação**: Antes de criar/editar/deletar, verifique permissão
4. **Retorne 403 Forbidden**: Se usuário não tiver permissão

Exemplo de endpoint na API:

```javascript
// POST /api/estabelecimentos
async function createEstabelecimento(req, res) {
  const { role } = req.user

  // Verifica permissão
  if (!canCreate(role, 'estabelecimentos')) {
    return res.status(403).json({ error: 'Sem permissão' })
  }

  // Continua com a criação...
}
```

---

## Testes de Permissões

### Usuários de teste

- Admin: `admin@impera.com` / `admin123`
- Franqueado: `franqueado@impera.com` / `franqueado123`
- Estabelecimento: `estabelecimento@impera.com` / `estabelecimento123`
- Fotógrafo: `fotografo@impera.com` / `fotografo123`

### Checklist de testes

Para cada role, verificar:
- [ ] Sidebar mostra apenas os módulos permitidos
- [ ] Botões de ação aparecem apenas se tiver permissão
- [ ] Tentar acessar rota sem permissão redireciona
- [ ] Botões de criar/editar/deletar aparecem apenas para quem pode
- [ ] Exportação funciona apenas para quem pode

