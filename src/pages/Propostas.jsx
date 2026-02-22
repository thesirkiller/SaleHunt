import { useState, useEffect, useCallback } from 'react'
import {
    Search,
    SlidersHorizontal,
    Plus,
    MoreVertical,
    FileEdit,
    Loader2,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import NewProposalModal from '../components/NewProposalModal'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'


/* ── Design Tokens ─────────────────────────────────────────────────────────── */
const COLORS = {
    primary: '#111827',
    success: '#22c55e', // Sync with Dashboard
    warning: '#F59E0B',
    info: '#3B82F6',
    error: '#EF4444',
    gray900: '#111827',
    gray600: '#4B5563',
    gray400: '#9CA3AF',
    gray100: '#F3F4F6',
    border: '#E5E7EB',
    bg: '#F9FAFB',
}

const STATUS_STYLES = {
    'Aprovado': { color: '#16A34A' },
    'Racunho': { color: '#D97706' }, // Matching typo in image "Racunho"
    'Visualizada': { color: '#2563EB' },
    'Desativada': { color: '#EF4444' },
    'Reprovado': { color: '#EF4444' },
    'Cancelada': { color: '#9CA3AF' },
}

const TAG_STYLES = {
    'Lead': { bg: '#F5F3FF', color: '#7C3AED' },
    'Blog': { bg: '#F0FDF4', color: '#16A34A' },
    'Landing Page': { bg: '#FDF2F8', color: '#DB2777' },
    'Notícias': { bg: '#EFF6FF', color: '#2563EB' },
    '+3': { bg: '#F9FAFB', color: '#6B7280' },
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */
const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (val) => {
    if (val == null) return '—'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
}

/* ── Sub-components ────────────────────────────────────────────────────────── */

const TagPill = ({ label }) => {
    const style = TAG_STYLES[label] || TAG_STYLES['+3']
    return (
        <span style={{
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 12,
            backgroundColor: style.bg,
            color: style.color,
            whiteSpace: 'nowrap'
        }}>
            {label}
        </span>
    )
}

const Avatar = ({ name, size = 24 }) => (
    <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid #FFF'
    }}>
        <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    </div>
)

const ModelCard = ({ model }) => (
    <div style={{
        flex: 1,
        backgroundColor: '#FFF',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        minWidth: 260
    }}>
        <div style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: '#F0FDF4', color: '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #DCFCE7'
        }}>
            <FileEdit size={16} />
        </div>

        <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: 16, fontWeight: 700, color: '#111827' }}>{model.title}</h4>
            <p style={{ margin: 0, fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{model.description}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
                {model.tags.map(t => <TagPill key={t} label={t} />)}
            </div>
            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{model.pages}</span>
        </div>

        <button style={{
            marginTop: 8,
            width: '100%',
            height: 40,
            backgroundColor: '#111827',
            color: '#FFF',
            borderRadius: 8,
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
        }}>
            Usar modelo
        </button>
    </div>
)

/* ── Propostas Page ────────────────────────────────────────────────────────── */

const Propostas = () => {
    const { workspace } = useAuth()
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [propostas, setPropostas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadPropostas = useCallback(async () => {
        if (!workspace?.id) return
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase
                .from('propostas')
                .select(`
                    *,
                    modelo:modelo_id (id, nome),
                    clientes:proposta_clientes (
                        cliente:cliente_id (id, nome, empresa, foto_url, email)
                    ),
                    tags (id, texto, cor_hex)
                `)
                .eq('workspace_id', workspace.id)
                .order('created_at', { ascending: false })


            if (error) throw error

            setPropostas(data.map(p => ({
                ...p,
                clientes: p.clientes?.map(pc => pc.cliente) ?? []
            })))
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [workspace?.id])


    useEffect(() => { loadPropostas() }, [loadPropostas])

    const tableHeaderStyle = {
        padding: '12px 24px',
        fontSize: 12,
        fontWeight: 600,
        color: '#94A3B8',
        textAlign: 'left',
        borderBottom: '1px solid #F1F5F9'
    }

    const tableCellStyle = {
        padding: '16px 24px',
        fontSize: 13,
        color: '#1E293B',
        borderBottom: '1px solid #F1F5F9'
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Sidebar activeItem="propostas" />

            <main style={{ flex: 1, padding: '0', overflowY: 'auto' }}>

                <PageHeader
                    breadcrumb={[{ label: 'Propostas', active: true }]}
                    title="Propostas"
                    description="Veja, crie e gerencie as propostas para seus clientes"
                    searchProps={{
                        value: search,
                        onChange: (e) => setSearch(e.target.value),
                        placeholder: "Pesquisar...",
                        width: 260
                    }}
                    actions={
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            height: 40, padding: '0 16px',
                            backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8,
                            fontSize: 14, fontWeight: 600, color: '#1E293B', cursor: 'pointer'
                        }}>
                            <SlidersHorizontal size={16} />
                            Filtros
                        </button>
                    }
                    primaryAction={{
                        label: 'Nova proposta',
                        icon: <Plus size={18} />,
                        onClick: () => setIsModalOpen(true)
                    }}
                />

                <div style={{ padding: '0 40px 40px 40px' }}>
                    {/* Table Section */}
                    <div style={{
                        backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: 12, overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)', marginBottom: 48
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#FCFDFF' }}>
                                    <th style={tableHeaderStyle}>Nome da proposta</th>
                                    <th style={tableHeaderStyle}>Data de abertura</th>
                                    <th style={tableHeaderStyle}>Valor em negociação</th>
                                    <th style={tableHeaderStyle}>Responsável</th>
                                    <th style={tableHeaderStyle}>Cliente</th>
                                    <th style={tableHeaderStyle}>Tipo</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                    <th style={{ ...tableHeaderStyle, width: 48 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>
                                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', verticalAlign: 'middle' }} /> Carregando...
                                    </td></tr>
                                ) : error ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: '#EF4444' }}>{error}</td></tr>
                                ) : propostas.length === 0 ? (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>Nenhuma proposta encontrada.</td></tr>
                                ) : propostas
                                    .filter(p => p.nome?.toLowerCase().includes(search.toLowerCase()))
                                    .map(prop => (
                                        <tr key={prop.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ ...tableCellStyle, fontWeight: 600 }}>{prop.nome}</td>
                                            <td style={{ ...tableCellStyle, color: '#64748B' }}>{formatDate(prop.data_abertura || prop.created_at)}</td>
                                            <td style={tableCellStyle}>{formatCurrency(prop.valor_negociacao)}</td>
                                            <td style={tableCellStyle}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <Avatar name={prop.responsavel?.full_name || '?'} />
                                                    <span>{prop.responsavel?.full_name || '—'}</span>
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                {prop.clientes?.length > 0 ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <Avatar name={prop.clientes[0].nome || '?'} />
                                                        <span>{prop.clientes[0].nome}</span>
                                                    </div>
                                                ) : <span style={{ color: '#94A3B8' }}>—</span>}
                                            </td>
                                            <td style={tableCellStyle}>
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                    {(prop.tags || []).map(tag => (
                                                        <span key={tag.id} style={{
                                                            fontSize: 11, fontWeight: 600,
                                                            padding: '2px 8px', borderRadius: 12,
                                                            backgroundColor: (tag.cor_hex || '#6B7280') + '22',
                                                            color: tag.cor_hex || '#6B7280',
                                                            whiteSpace: 'nowrap'
                                                        }}>{tag.texto}</span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <span style={{
                                                    fontWeight: 600,
                                                    color: STATUS_STYLES[prop.status]?.color || '#94A3B8'
                                                }}>
                                                    {prop.status}
                                                </span>
                                            </td>
                                            <td style={tableCellStyle}>
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1' }}>
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                        {/* Pagination Footer */}
                        <div style={{
                            padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: '#FCFDFF'
                        }}>
                            <span style={{ fontSize: 14, color: '#64748B' }}>
                                Mostrando <strong style={{ color: '#1E293B' }}>{propostas.length}</strong> <strong style={{ color: '#1E293B' }}>propostas</strong>
                            </span>
                        </div>
                    </div>


                </div>
            </main>

            <NewProposalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

export default Propostas
