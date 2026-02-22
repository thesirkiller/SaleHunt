import { useState, useEffect, useCallback } from 'react'
import {
    Search,
    SlidersHorizontal,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    Building2,
    Loader2
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import NewProposalModal from '../components/NewProposalModal'
import AddClientModal from '../components/AddClientModal'
import ClienteSidePanelModal from '../components/ClienteSidePanelModal'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'

/* ── Design Tokens ─────────────────────────────────────────────────────────── */
const COLORS = {
    primary: '#111827',
    success: '#22c55e',
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

const TAG_STYLES = {
    'VIP': { bg: '#FEF2F2', color: '#EF4444' },
    'Enterprise': { bg: '#EFF6FF', color: '#2563EB' },
    'Startup': { bg: '#FDF2F8', color: '#DB2777' },
    'Recorrente': { bg: '#F0FDF4', color: '#16A34A' },
}


/* ── Sub-components ────────────────────────────────────────────────────────── */

const TagPill = ({ label }) => {
    const style = TAG_STYLES[label] || { bg: '#F3F4F6', color: '#6B7280' }
    return (
        <span style={{
            fontSize: 11,
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

const Avatar = ({ name, size = 32 }) => (
    <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '1px solid #E5E7EB'
    }}>
        <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    </div>
)

/* ── Clientes Page ────────────────────────────────────────────────────────── */

const Clientes = () => {
    const { workspace } = useAuth()
    const [search, setSearch] = useState('')
    const [isPropostaModalOpen, setIsPropostaModalOpen] = useState(false)
    const [isClienteModalOpen, setIsClienteModalOpen] = useState(false)
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadClientes = useCallback(async () => {
        if (!workspace?.id) return
        setLoading(true)
        setError(null)
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('workspace_id', workspace.id)
            .order('nome', { ascending: true })
        if (error) setError(error.message)
        else setClientes(data)
        setLoading(false)
    }, [workspace?.id])

    useEffect(() => { loadClientes() }, [loadClientes])

    const filtered = clientes.filter(c =>
        c.nome?.toLowerCase().includes(search.toLowerCase()) ||
        c.empresa?.toLowerCase().includes(search.toLowerCase())
    )

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
            <Sidebar activeItem="clientes" />

            <main style={{ flex: 1, padding: '0', overflowY: 'auto' }}>

                <PageHeader
                    breadcrumb={[{ label: 'Clientes', active: true }]}
                    title="Clientes"
                    description="Gerencie sua base de clientes, contatos e histórico de interações."
                    searchProps={{
                        value: search,
                        onChange: (e) => setSearch(e.target.value),
                        placeholder: "Pesquisar por nome ou empresa...",
                        width: 320
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
                        label: 'Novo cliente',
                        icon: <Plus size={18} />,
                        onClick: () => setIsClienteModalOpen(true)
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
                                    <th style={tableHeaderStyle}>Nome do cliente</th>
                                    <th style={tableHeaderStyle}>Empresa</th>
                                    <th style={tableHeaderStyle}>Contato</th>
                                    <th style={tableHeaderStyle}>Tipo</th>
                                    <th style={tableHeaderStyle}>Responsável</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                    <th style={{ ...tableHeaderStyle, width: 48 }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>
                                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Carregando...
                                    </td></tr>
                                ) : error ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#EF4444' }}>{error}</td></tr>
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#94A3B8' }}>Nenhum cliente encontrado.</td></tr>
                                ) : filtered.map(client => (
                                    <tr key={client.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <Avatar name={client.nome} size={32} />
                                                <span style={{ fontWeight: 600 }}>{client.nome}</span>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B' }}>
                                                <Building2 size={16} />
                                                <span>{client.empresa || '—'}</span>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12 }}>
                                                    <Mail size={14} /> {client.email || '—'}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12 }}>
                                                    <Phone size={14} /> {client.telefone || '—'}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={tableCellStyle}>{client.cidade || '—'}</td>
                                        <td style={tableCellStyle}>
                                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CBD5E1' }}>
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Footer (Placeholder) */}
                        <div style={{
                            padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            backgroundColor: '#FCFDFF'
                        }}>
                            <span style={{ fontSize: 14, color: '#64748B' }}>
                                Mostrando <strong style={{ color: '#1E293B' }}>{filtered.length}</strong> de <strong style={{ color: '#1E293B' }}>{clientes.length} clientes</strong>
                            </span>
                        </div>
                    </div>



                </div>
            </main>

            <NewProposalModal
                isOpen={isPropostaModalOpen}
                onClose={() => setIsPropostaModalOpen(false)}
            />
            <ClienteSidePanelModal
                isOpen={isClienteModalOpen}
                onClose={() => setIsClienteModalOpen(false)}
                onSuccess={loadClientes}
            />
        </div>
    )
}

export default Clientes
