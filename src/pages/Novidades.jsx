import { useState } from 'react'
import { Heart, Send } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'

/* ── Changelog entries ───────────────────────────────────────────────────────
   Adicione novos entries no INÍCIO do array para que apareçam primeiro.
   ─────────────────────────────────────────────────────────────────────────── */
const CHANGELOG = [
    {
        id: 6,
        date: '22/02/2026',
        title: 'Tags estruturadas nas propostas',
        badge: { label: 'Novo', color: '#7C3AED', bg: '#F5F3FF' },
        content: [
            'Tags agora possuem **texto** e **cor personalizada** (hex), armazenadas em tabela própria vinculada à proposta.',
            'No modal de nova proposta, basta pressionar **Enter** para adicionar uma tag — a cor é gerada automaticamente.',
            'As tags aparecem com fundo colorido semi-transparente na listagem de propostas.',
        ],
    },
    {
        id: 5,
        date: '22/02/2026',
        title: 'Modal de cliente como painel lateral',
        badge: { label: 'UI', color: '#2563EB', bg: '#EFF6FF' },
        content: [
            'O botão **"Novo cliente"** na página de Clientes agora abre um painel deslizante pela direita da tela (482px).',
            'O painel possui campos expandidos: Nome, Sobrenome, CPF/CNPJ, Empresa, E-mail, Telefone, CEP, Rua, Complemento, Número, Estado e Bairro.',
            'Suporte a **upload de foto de perfil** com preview circular.',
            'Backdrop com blur e fechar ao clicar fora.',
        ],
    },
    {
        id: 4,
        date: '22/02/2026',
        title: 'Integração real com Supabase — Propostas e Clientes',
        badge: { label: 'Backend', color: '#16A34A', bg: '#F0FDF4' },
        content: [
            'Páginas de **Propostas** e **Clientes** agora buscam dados reais do Supabase — sem mock data.',
            'Propostas incluem join com clientes vinculados (`proposta_clientes`) e tags estruturadas.',
            'Clientes têm busca em tempo real por nome e empresa, com estados de loading, erro e lista vazia.',
            'O modal **"Nova proposta"** carrega clientes e modelos dinamicamente e salva no banco com tags e vínculos.',
            'O modal **"Adicionar cliente"** dentro do fluxo de nova proposta também persiste dados diretamente.',
        ],
    },
    {
        id: 3,
        date: '22/02/2026',
        title: 'Schema do banco de dados — Propostas, Clientes e Tags',
        badge: { label: 'Backend', color: '#16A34A', bg: '#F0FDF4' },
        content: [
            'Criadas tabelas: `clientes`, `modelos_proposta`, `propostas`, `proposta_clientes` (N:N) e `tags`.',
            '`tags` substituiu o campo `lista_tags` (array de texto) por uma tabela com **texto** e **cor_hex** própria.',
            '**RLS (Row Level Security)** ativado em todas as tabelas: cada workspace acede apenas aos seus dados.',
            '`schema.js` atualizado como mapa de referência — evita chamadas desnecessárias ao MCP.',
        ],
    },
    {
        id: 2,
        date: '22/02/2026',
        title: 'Abas com ícones no PageHeader',
        badge: { label: 'UI', color: '#2563EB', bg: '#EFF6FF' },
        content: [
            '`PageHeader` agora suporta **ícones nas abas** via prop `tab.icon`.',
            'Negociações usa `LayoutGrid` (Kanban) e `List` (Lista) nas abas.',
        ],
    },
    {
        id: 1,
        date: '22/02/2026',
        title: 'Modal de nova proposta e seleção de clientes',
        badge: { label: 'Novo', color: '#7C3AED', bg: '#F5F3FF' },
        content: [
            'Modal **"Nova proposta"** com campos: nome, descrição, tags, modelo e cliente.',
            'Dropdown de clientes com avatar e opção de criar novo cliente inline.',
            'Dropdown de modelos lista os templates do workspace.',
            'Backdrop com blur consistente; z-index corrigido para sobreposição correta de modais aninhados.',
        ],
    },
]

/* ── Entry component ──────────────────────────────────────────────────────── */
const parseMarkdown = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**')
            ? <strong key={i}>{p.slice(2, -2)}</strong>
            : p
    )
}

const ChangelogEntry = ({ entry }) => {
    const [liked, setLiked] = useState(false)
    const [likes, setLikes] = useState(Math.floor(Math.random() * 40) + 5)

    const toggleLike = () => {
        setLiked(l => !l)
        setLikes(n => liked ? n - 1 : n + 1)
    }

    return (
        <div style={{
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: 48,
            marginBottom: 48,
        }}>
            {/* Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{
                    fontSize: 11, fontWeight: 700,
                    padding: '3px 10px', borderRadius: 99,
                    backgroundColor: entry.badge.bg,
                    color: entry.badge.color,
                    letterSpacing: 0.5,
                }}>
                    {entry.badge.label}
                </span>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>{entry.date}</span>
            </div>

            {/* Title */}
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1.3 }}>
                {entry.title}
            </h2>

            {/* Content */}
            <ul style={{ margin: '0 0 24px', paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {entry.content.map((line, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                        {parseMarkdown(line)}
                    </li>
                ))}
            </ul>

            {/* Like + CTA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <button
                    onClick={toggleLike}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'none', border: '1px solid ' + (liked ? '#FCA5A5' : '#E5E7EB'),
                        borderRadius: 99, padding: '7px 16px', cursor: 'pointer',
                        fontSize: 14, fontWeight: 600,
                        color: liked ? '#EF4444' : '#64748B',
                        backgroundColor: liked ? '#FEF2F2' : '#FFFFFF',
                        transition: 'all 0.15s',
                    }}
                >
                    <Heart size={16} fill={liked ? '#EF4444' : 'none'} />
                    {likes}
                </button>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 20px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E5E7EB',
                    borderRadius: 12,
                    fontSize: 13, color: '#64748B',
                }}>
                    Notou algo de errado?
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', backgroundColor: '#111827',
                        color: '#FFFFFF', border: 'none', borderRadius: 8,
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}>
                        <Send size={14} /> Envie uma sugestão
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
const Novidades = () => (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        <Sidebar activeItem="novidades" />

        <main style={{ flex: 1, overflowY: 'auto' }}>
            <PageHeader
                breadcrumb={[{ label: 'Novidades', active: true }]}
                title="Changelog"
                description="Atualizações, mudanças e melhorias em andamento."
            />

            <div style={{ padding: '0 40px 64px' }}>
                {CHANGELOG.map(entry => (
                    <ChangelogEntry key={entry.id} entry={entry} />
                ))}
            </div>
        </main>
    </div>
)

export default Novidades
