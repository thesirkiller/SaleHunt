/**
 * @file schema.js
 * @description Referência do schema do banco de dados Supabase (projeto: SaleHunt).
 * Este arquivo é apenas para documentação e controle — NÃO é executado.
 * Última sincronização: 2026-02-21
 *
 * TABELAS:
 *  - users             → auth.users(id) - Espelho central de usuários
 *  - workspaces        → auth.users(id) - Dados operacionais e marca
 *  - colors            → auth.users(id) - Cores customizadas da marca
 */

// ─────────────────────────────────────────────
// TABELA: users (Espelho de auth.users)
// RLS: ativado
// FK: users.id → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_USERS = {
    name: 'users',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, fk: 'auth.users.id' },
        email: { type: 'text' },
        full_name: { type: 'text', nullable: true },
        avatar_url: { type: 'text', nullable: true },
        onboarding_completed: { type: 'boolean', default: false },
        onboarding_step: { type: 'integer', default: 1 },
        created_at: { type: 'timestamp with time zone', default: 'now()' },
        updated_at: { type: 'timestamp with time zone', default: 'now()' },
    },
}

// ─────────────────────────────────────────────
// TABELA: workspaces
// RLS: ativado
// FK: workspaces.owner_id → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_WORKSPACES = {
    name: 'workspaces',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, default: 'gen_random_uuid()' },
        owner_id: { type: 'uuid', fk: 'auth.users.id' },
        name: { type: 'text' },
        cnpj: { type: 'text', nullable: true },
        brand_color: { type: 'text', nullable: true, default: "'#12BF7D'" },
        brand_logo_url: { type: 'text', nullable: true },
        company_size: { type: 'text', nullable: true },
        market_sector: { type: 'text', nullable: true },
        team_size: { type: 'text', nullable: true },
        created_at: { type: 'timestamp with time zone', nullable: true, default: 'now()' },
        updated_at: { type: 'timestamp with time zone', nullable: true, default: 'now()' },
    },
}

// ─────────────────────────────────────────────
// TABELA: colors (antiga custom_brand_colors)
// RLS: ativado
// FK: colors.created_by → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_COLORS = {
    name: 'colors',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, default: 'gen_random_uuid()' },
        hex: { type: 'text', unique: true },
        created_by: { type: 'uuid', nullable: true, fk: 'auth.users.id' },
        created_at: { type: 'timestamp with time zone', nullable: true, default: 'now()' },
    },
}

// ─────────────────────────────────────────────
// MAPA GERAL DE TABELAS
// ─────────────────────────────────────────────
export const SCHEMA = {
    users: TABLE_USERS,
    workspaces: TABLE_WORKSPACES,
    colors: TABLE_COLORS,
}
