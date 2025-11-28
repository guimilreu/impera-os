/**
 * Sistema de permissões granulares do ImperaOS
 * Define o que cada role pode ver e fazer em cada módulo
 */

/**
 * Definição de permissões por role
 * 
 * Estrutura:
 * {
 *   [role]: {
 *     [module]: {
 *       view: boolean,        // Pode ver a página
 *       create: boolean,      // Pode criar novos registros
 *       edit: boolean,        // Pode editar registros
 *       delete: boolean,      // Pode deletar registros
 *       approve: boolean,     // Pode aprovar/rejeitar (moderação)
 *       export: boolean,      // Pode exportar dados
 *       uploadPhoto: boolean, // Pode fazer upload de fotos (fotógrafo)
 *     }
 *   }
 * }
 */

export const PERMISSIONS = {
  admin: {
    // Admin tem acesso total a tudo
    overview: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    cidades: { view: true, create: true, edit: true, delete: true, approve: false, export: true, uploadPhoto: false },
    edicoes: { view: true, create: true, edit: true, delete: true, approve: false, export: true, uploadPhoto: false },
    estabelecimentos: { view: true, create: true, edit: true, delete: true, approve: true, export: true, uploadPhoto: false },
    pratos: { view: true, create: true, edit: true, delete: true, approve: true, export: true, uploadPhoto: true },
    votos: { view: true, create: false, edit: true, delete: true, approve: true, export: true, uploadPhoto: false },
    avaliacao: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    moderacao: { view: true, create: false, edit: true, delete: true, approve: true, export: true, uploadPhoto: false },
    relatorios: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    checklists: { view: true, create: true, edit: true, delete: true, approve: false, export: true, uploadPhoto: false },
    configuracoes: { view: true, create: false, edit: true, delete: false, approve: false, export: false, uploadPhoto: false },
    treinamentos: { view: true, create: true, edit: true, delete: true, approve: false, export: false, uploadPhoto: false },
    clientes: { view: true, create: false, edit: true, delete: false, approve: true, export: true, uploadPhoto: false },
    // Módulos de gestão
    recados: { view: true, create: true, edit: true, delete: true, approve: false, export: true, uploadPhoto: false },
    convites: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    vendas: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
  },

  estabelecimento: {
    // Estabelecimento só vê seus próprios dados e checklists
    overview: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    cidades: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    edicoes: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    estabelecimentos: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false }, // Não precisa ver esta página
    pratos: { view: true, create: true, edit: true, delete: false, approve: false, export: false, uploadPhoto: false }, // Pode gerenciar seus pratos
    votos: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    avaliacao: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false }, // Pode ver seus votos (após premiação)
    moderacao: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    relatorios: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false }, // Apenas se premiação encerrada
    checklists: { view: true, create: false, edit: true, delete: false, approve: false, export: false, uploadPhoto: false },
    configuracoes: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    // Módulos de gestão para restaurante
    recados: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false }, // Apenas ler
    convites: { view: true, create: true, edit: false, delete: false, approve: false, export: false, uploadPhoto: false }, // Pode comprar
    vendas: { view: true, create: true, edit: true, delete: false, approve: false, export: false, uploadPhoto: false }, // Pode registrar vendas
  },

  fotografo: {
    // Fotógrafo pode ver estabelecimentos e receitas, mas APENAS para visualização e upload de fotos
    overview: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    cidades: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    edicoes: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    estabelecimentos: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    pratos: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: true },
    votos: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    moderacao: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    relatorios: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    checklists: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    configuracoes: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
  },

  socio_local: {
    // Sócio Local gerencia sua cidade/edição específica
    overview: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    cidades: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    edicoes: { view: true, create: false, edit: true, delete: false, approve: false, export: false, uploadPhoto: false },
    estabelecimentos: { view: true, create: true, edit: true, delete: false, approve: true, export: true, uploadPhoto: false },
    pratos: { view: true, create: true, edit: true, delete: false, approve: true, export: true, uploadPhoto: false },
    votos: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    avaliacao: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    moderacao: { view: true, create: false, edit: true, delete: false, approve: true, export: false, uploadPhoto: false },
    relatorios: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    checklists: { view: true, create: true, edit: true, delete: false, approve: false, export: false, uploadPhoto: false },
    configuracoes: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    treinamentos: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    clientes: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    // Módulos específicos do sócio local
    recados: { view: true, create: true, edit: true, delete: true, approve: false, export: false, uploadPhoto: false },
    convites: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
    vendas: { view: true, create: false, edit: false, delete: false, approve: false, export: true, uploadPhoto: false },
  },

  cliente: {
    // Cliente (usuário votante) - acesso apenas às funcionalidades de avaliação
    overview: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    cidades: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    edicoes: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    estabelecimentos: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    pratos: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    votos: { view: false, create: true, edit: false, delete: false, approve: false, export: false, uploadPhoto: false }, // Pode votar
    moderacao: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    relatorios: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    checklists: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    configuracoes: { view: false, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false },
    // Módulos específicos do cliente
    avaliacao: { view: true, create: true, edit: false, delete: false, approve: false, export: false, uploadPhoto: true }, // Pode avaliar e enviar foto
    perfil: { view: true, create: false, edit: true, delete: false, approve: false, export: false, uploadPhoto: true }, // Pode editar seu perfil
    ranking: { view: true, create: false, edit: false, delete: false, approve: false, export: false, uploadPhoto: false }, // Pode ver seu ranking
  },
}

/**
 * Verifica se o role tem permissão para ver um módulo
 */
export function canView(role, module) {
  return PERMISSIONS[role]?.[module]?.view || false
}

/**
 * Verifica se o role tem permissão para criar no módulo
 */
export function canCreate(role, module) {
  return PERMISSIONS[role]?.[module]?.create || false
}

/**
 * Verifica se o role tem permissão para editar no módulo
 */
export function canEdit(role, module) {
  return PERMISSIONS[role]?.[module]?.edit || false
}

/**
 * Verifica se o role tem permissão para deletar no módulo
 */
export function canDelete(role, module) {
  return PERMISSIONS[role]?.[module]?.delete || false
}

/**
 * Verifica se o role tem permissão para aprovar/rejeitar no módulo
 */
export function canApprove(role, module) {
  return PERMISSIONS[role]?.[module]?.approve || false
}

/**
 * Verifica se o role tem permissão para exportar dados do módulo
 */
export function canExport(role, module) {
  return PERMISSIONS[role]?.[module]?.export || false
}

/**
 * Verifica se o role tem permissão para fazer upload de fotos no módulo
 */
export function canUploadPhoto(role, module) {
  return PERMISSIONS[role]?.[module]?.uploadPhoto || false
}

/**
 * Retorna todas as permissões de um role para um módulo
 */
export function getModulePermissions(role, module) {
  return PERMISSIONS[role]?.[module] || {
    view: false,
    create: false,
    edit: false,
    delete: false,
    approve: false,
    export: false,
    uploadPhoto: false,
  }
}

/**
 * Verifica se o role tem qualquer permissão de ação (create, edit, delete, approve)
 */
export function canDoAnyAction(role, module) {
  const perms = getModulePermissions(role, module)
  return perms.create || perms.edit || perms.delete || perms.approve
}

/**
 * Hook para usar permissões no React
 */
export function usePermissions(role) {
  return {
    canView: (module) => canView(role, module),
    canCreate: (module) => canCreate(role, module),
    canEdit: (module) => canEdit(role, module),
    canDelete: (module) => canDelete(role, module),
    canApprove: (module) => canApprove(role, module),
    canExport: (module) => canExport(role, module),
    canUploadPhoto: (module) => canUploadPhoto(role, module),
    getModulePermissions: (module) => getModulePermissions(role, module),
    canDoAnyAction: (module) => canDoAnyAction(role, module),
  }
}

