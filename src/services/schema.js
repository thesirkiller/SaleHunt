/**
 * @file schema.js
 * @description Referência do schema do banco de dados Supabase (projeto: testevibe).
 * Este arquivo é apenas para documentação e controle — NÃO é executado.
 * Última sincronização: 2026-02-21
 *
 * TABELAS:
 *  - user
 *  - profiles          → auth.users(id)
 *  - tasks             → auth.users(id)
 *  - transactions      → auth.users(id)
 *  - service_orders    → auth.users(id)
 *  - workspace_invites → profiles(id)
 *  - workspaces        → auth.users(id)
 *  - custom_brand_colors → auth.users(id)
 */

// ─────────────────────────────────────────────
// TABELA: user
// RLS: ativado | Linhas: 0
// ─────────────────────────────────────────────
export const TABLE_USER = {
    name: 'user',
    rls: true,
    columns: {
        id: { type: 'bigint', identity: true, pk: true },
        created_at: { type: 'timestamp with time zone', default: 'now()' },
    },
}

// ─────────────────────────────────────────────
// TABELA: profiles
// RLS: ativado | Linhas: 2
// FK: profiles.id → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_PROFILES = {
    name: 'profiles',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, fk: 'auth.users.id' },
        updated_at: { type: 'timestamp with time zone', nullable: true },
        username: { type: 'text', nullable: true, unique: true, check: 'char_length(username) >= 3' },
        full_name: { type: 'text', nullable: true },
        avatar_url: { type: 'text', nullable: true },
        website: { type: 'text', nullable: true },
        workspace_name: { type: 'text', nullable: true },
        workspace_cnpj: { type: 'text', nullable: true },
        brand_color: { type: 'text', nullable: true },
        brand_logo_url: { type: 'text', nullable: true },
        company_size: { type: 'text', nullable: true },
        market_sector: { type: 'text', nullable: true },
        team_size: { type: 'text', nullable: true },
        onboarding_completed: { type: 'boolean', nullable: true, default: false },
        onboarding_step: { type: 'integer', nullable: true, default: 1 },
    },
}

// ─────────────────────────────────────────────
// TABELA: tasks
// RLS: ativado | Linhas: 0
// FK: tasks.user_id → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_TASKS = {
    name: 'tasks',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, default: 'gen_random_uuid()' },
        created_at: { type: 'timestamp with time zone', nullable: true, default: 'now()' },
        title: { type: 'text' },
        is_completed: { type: 'boolean', nullable: true, default: false },
        user_id: { type: 'uuid', fk: 'auth.users.id' },
    },
}

// ─────────────────────────────────────────────
// TABELA: transactions
// RLS: ativado | Linhas: 0
// FK: transactions.user_id → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_TRANSACTIONS = {
    name: 'transactions',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, default: 'gen_random_uuid()' },
        created_at: { type: 'timestamp with time zone', default: 'now()' },
        user_id: { type: 'uuid', fk: 'auth.users.id' },
        description: { type: 'text' },
        amount: { type: 'numeric' },
        category: { type: 'text' },
        date: { type: 'date', default: 'CURRENT_DATE' },
        type: { type: 'text', default: "'expense'", check: "type = ANY (ARRAY['income', 'expense'])" },
        is_recurring: { type: 'boolean', nullable: true, default: false },
    },
}

// ─────────────────────────────────────────────
// TABELA: service_orders
// RLS: ativado | Linhas: 0
// FK: service_orders.user_id → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_SERVICE_ORDERS = {
    name: 'service_orders',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, default: 'gen_random_uuid()' },
        user_id: { type: 'uuid', fk: 'auth.users.id' },
        customer_name: { type: 'text' },
        customer_phone: { type: 'text', nullable: true },
        device_model: { type: 'text' },
        device_imei: { type: 'text', nullable: true },
        problem_description: { type: 'text', nullable: true },
        service_details: { type: 'text', nullable: true },
        status: { type: 'text', default: "'pending'" },
        total_price: { type: 'numeric', nullable: true, default: 0 },
        parts_cost: { type: 'numeric', nullable: true, default: 0 },
        created_at: { type: 'timestamp with time zone', nullable: true, default: 'now()' },
        updated_at: { type: 'timestamp with time zone', nullable: true, default: 'now()' },
    },
}

// ─────────────────────────────────────────────
// TABELA: workspace_invites
// RLS: ativado | Linhas: 0
// FK: workspace_invites.workspace_id → profiles.id
// ─────────────────────────────────────────────
export const TABLE_WORKSPACE_INVITES = {
    name: 'workspace_invites',
    rls: true,
    columns: {
        id: { type: 'uuid', pk: true, default: 'gen_random_uuid()' },
        workspace_id: { type: 'uuid', nullable: true, fk: 'public.profiles.id' },
        email: { type: 'text' },
        status: { type: 'text', nullable: true, default: "'pending'" },
        created_at: { type: 'timestamp with time zone', nullable: true, default: "timezone('utc', now())" },
    },
}

// ─────────────────────────────────────────────
// TABELA: workspaces
// RLS: ativado | Linhas: 0
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
// TABELA: custom_brand_colors
// RLS: ativado | Linhas: 0
// FK: custom_brand_colors.created_by → auth.users.id
// ─────────────────────────────────────────────
export const TABLE_CUSTOM_BRAND_COLORS = {
    name: 'custom_brand_colors',
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
    user: TABLE_USER,
    profiles: TABLE_PROFILES,
    tasks: TABLE_TASKS,
    transactions: TABLE_TRANSACTIONS,
    service_orders: TABLE_SERVICE_ORDERS,
    workspace_invites: TABLE_WORKSPACE_INVITES,
    workspaces: TABLE_WORKSPACES,
    custom_brand_colors: TABLE_CUSTOM_BRAND_COLORS,
}
