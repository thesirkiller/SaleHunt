import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Home,
    Search,
    SlidersHorizontal,
    Plus,
    LayoutGrid,
    List as ListIcon,
    ChevronDown,
    ChevronRight,
    MessageSquare,
    Paperclip,
    MoreVertical,
    Check,
    Users
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import NewProposalModal from '../components/NewProposalModal'
import { useAuth } from '../contexts/AuthContext'

/* ── Design Tokens (Sync with CSS variables) ────────────────────────────────── */
const COLORS = {
    primary: 'var(--color-primary, #437EF7)',
    success: 'var(--color-success, #05C270)',
    warning: 'var(--color-warning, #FFCC01)',
    info: 'var(--color-info, #0163F7)',
    error: 'var(--color-error, #FF3B3B)',
    gray900: 'var(--color-gray-900, #222222)',
    gray400: 'var(--color-gray-400, #A0ABC0)',
    gray300: 'var(--color-gray-300, #D5DCE9)',
    gray100: 'var(--color-gray-100, #F4F6F9)',
}

const TAG_STYLES = {
    'Lead': { bg: '#F5F3FF', color: '#7C3AED' },
    'Blog': { bg: '#F0FDF4', color: '#16A34A' },
    'Landing Page': { bg: '#FDF2F8', color: '#DB2777' },
    'Institucional': { bg: '#EFF6FF', color: '#2563EB' },
    'Urgente': { bg: '#FEF2F2', color: '#EF4444', dot: '#EF4444' },
    'Alta': { bg: '#FFFBEB', color: '#D97706', dot: '#D97706' },
    'Normal': { bg: '#F0F9FF', color: '#0284C7', dot: '#0284C7' },
}

/* ── Mock Data ─────────────────────────────────────────────────────────────── */
const STAGES = [
    { id: 'nao_iniciado', label: 'Não iniciado', color: '#6B7280', icon: 'circle', count: '03' },
    { id: 'enviado', label: 'Enviado para cliente', color: '#2563EB', icon: 'dot', count: '01' },
    { id: 'aguardando', label: 'Aguardando assinatura', color: '#D97706', icon: 'dot', count: '03' },
    { id: 'assinado', label: 'Assinado', color: '#16A34A', icon: 'check', count: '08' },
]

const NEGOTIATIONS = [
    {
        id: 1,
        stage: 'nao_iniciado',
        title: 'Proposta comercial',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        tags: ['Lead', 'Blog'],
        priority: 'Urgente',
        people: ['/avatar1.jpg', '/avatar2.jpg', '/avatar3.jpg'],
        extraPeople: 5,
        attachments: 2,
        messages: 10
    },
    {
        id: 2,
        stage: 'nao_iniciado',
        title: 'Proposta comercial',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
        tags: ['Landing Page'],
        priority: 'Alta',
        people: ['/avatar1.jpg', '/avatar2.jpg', '/avatar3.jpg'],
        attachments: 2,
        messages: 10
    },
    {
        id: 3,
        stage: 'enviado',
        title: 'Proposta comercial',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        tags: ['Lead', 'Blog'],
        priority: 'Urgente',
        people: ['/avatar1.jpg'],
        attachments: 2,
        messages: 10
    },
    {
        id: 4,
        stage: 'aguardando',
        title: 'Proposta comercial',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
        tags: ['Institucional'],
        priority: 'Normal',
        people: ['/avatar1.jpg', '/avatar2.jpg'],
        attachments: 2,
        messages: 10
    },
    {
        id: 5,
        stage: 'aguardando',
        title: 'Proposta comercial',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        tags: ['Lead', 'Blog'],
        priority: 'Urgente',
        people: ['/avatar1.jpg', '/avatar2.jpg', '/avatar3.jpg'],
        extraPeople: 5,
        attachments: 2,
        messages: 10
    },
    ...Array.from({ length: 8 }).map((_, i) => ({
        id: 100 + i,
        stage: 'assinado',
        title: `Proposta comercial ${i + 1}`,
        description: 'Implementação de sistema de vendas e integração com CRM legado.',
        tags: ['Institucional', 'Landing Page'],
        priority: 'Normal',
        people: ['/avatar1.jpg'],
        attachments: 1,
        messages: 5
    }))
]

/* ── Sub-components ────────────────────────────────────────────────────────── */
// ... rest of previous code remains same, just need to update the main layout below

const TagPill = ({ label }) => {
    const style = TAG_STYLES[label] || { bg: '#F3F4F6', color: '#374151' }
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            backgroundColor: style.bg,
            color: style.color,
            whiteSpace: 'nowrap'
        }}>
            {style.dot && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: style.dot }} />}
            {label}
        </span>
    )
}

const Avatars = ({ list, extra }) => (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {list.map((src, i) => (
            <div key={i} style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: '2px solid #FFF',
                backgroundColor: '#E5E7EB',
                marginLeft: i > 0 ? -8 : 0,
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#D1D5DB' }} />
            </div>
        ))}
        {extra && (
            <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 500, marginLeft: 4 }}>+{extra}</span>
        )}
    </div>
)

const KanbanCard = ({ item }) => (
    <div style={{
        backgroundColor: '#FFF',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        width: '100%',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        marginBottom: 10,
        boxShadow: '0px 3px 6.2px 4px #00000008'
    }}>
        <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            {item.tags.map(t => <TagPill key={t} label={t} />)}
            <TagPill label={item.priority} />
        </div>

        <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: COLORS.gray900 }}>{item.title}</h4>
            <p style={{
                margin: 0,
                fontSize: 'var(--text-xs)',
                lineHeight: 'var(--leading)',
                color: '#6B7280'
            }}>
                {item.description}
            </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
            <Avatars list={item.people} extra={item.extraPeople} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#9CA3AF' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--label-sm)' }}>
                    <Paperclip size={14} /> {item.attachments}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--label-sm)' }}>
                    <MessageSquare size={14} /> {item.messages}
                </div>
            </div>
        </div>
    </div>
)

const ListRow = ({ item }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 2fr 100px 140px 120px 100px',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #F3F4F6',
        backgroundColor: '#FFF'
    }}>
        <span style={{ fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: COLORS.gray900 }}>{item.title}</span>

        <p style={{
            margin: 0,
            fontSize: 'var(--text-xs)',
            color: '#64748B',
            paddingRight: 24,
            lineHeight: '1.5'
        }}>{item.description}</p>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {item.tags.map(t => <TagPill key={t} label={t} />)}
        </div>

        <Avatars list={item.people} extra={item.extraPeople} />

        <div style={{ display: 'flex' }}>
            <TagPill label={item.priority} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#64748B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--label-sm)', fontWeight: 'var(--font-medium)' }}>
                <Paperclip size={16} /> {item.attachments}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--label-sm)', fontWeight: 'var(--font-medium)' }}>
                <MessageSquare size={16} /> {item.messages}
            </div>
        </div>
    </div>
)

/* ── Main Page Component ────────────────────────────────────────────────────── */

const Negociacoes = () => {
    const navigate = useNavigate()
    const [view, setView] = useState('kanban') // 'kanban' or 'list'
    const [search, setSearch] = useState('')
    const [openStages, setOpenStages] = useState({
        nao_iniciado: true,
        enviado: true,
        aguardando: true,
        assinado: true,
    })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleStage = (id) => {
        setOpenStages(prev => ({ ...prev, [id]: !prev[id] }))
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
            <Sidebar activeItem="negociacoes" />

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <PageHeader
                    breadcrumb={[{ label: 'Negociações', active: true }]}
                    title="Negociações"
                    description="Veja, crie e gerencie as propostas para seus clientes"
                    searchProps={{
                        value: search,
                        onChange: (e) => setSearch(e.target.value),
                        placeholder: "Pesquisar por nome ou empresa...",
                        width: 260
                    }}
                    actions={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {/* Vertical Separator */}
                            <div style={{
                                width: 0,
                                height: 29,
                                borderLeft: '0.8px solid #E3E3E3',
                                margin: '0 8px'
                            }} />

                            <button style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                                padding: 'var(--space-1) var(--space-2)', borderRadius: 8,
                                border: '1px solid #E5E7EB', backgroundColor: '#FFF',
                                fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: COLORS.gray900, cursor: 'pointer'
                            }}>
                                <SlidersHorizontal size={16} /> Filtros
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
                                    padding: 'var(--space-1) var(--space-2)', borderRadius: 8,
                                    border: 'none', backgroundColor: COLORS.gray900,
                                    fontSize: 'var(--text-small)', fontWeight: 'var(--font-bold)', color: '#FFF', cursor: 'pointer'
                                }}
                            >
                                <Plus size={16} /> Nova proposta
                            </button>
                        </div>
                    }
                    tabs={{
                        items: [
                            {
                                label: 'Kanban',
                                icon: <LayoutGrid size={18} />,
                                active: view === 'kanban',
                                onClick: () => setView('kanban')
                            },
                            {
                                label: 'Lista',
                                icon: <ListIcon size={18} />,
                                active: view === 'list',
                                onClick: () => setView('list')
                            }
                        ],
                        activeColor: '#22c55e'
                    }}
                />

                {/* View Content (Scrollable Area) */}
                <div style={{ flex: 1, overflowY: view === 'list' ? 'auto' : 'hidden', padding: '0 var(--space-5) var(--space-5) var(--space-5)' }}>
                    {view === 'kanban' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, height: '100%', alignItems: 'start' }}>
                            {STAGES.map(stage => (
                                <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: 'calc(100vh - 280px)' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                        height: 46,
                                        padding: '8px 16px',
                                        borderRadius: 8,
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#FFF',
                                        marginBottom: 24,
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        justifyContent: 'space-between',
                                        flexShrink: 0
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {/* Nested Circle Icon */}
                                            <div style={{
                                                width: 16, height: 16, borderRadius: '50%',
                                                border: `1.5px solid ${stage.id === 'nao_iniciado' ? '#F87171' : stage.color}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: '50%',
                                                    backgroundColor: stage.id === 'nao_iniciado' ? '#EF4444' : stage.color
                                                }} />
                                            </div>

                                            <span style={{ fontSize: 'var(--label-md)', fontWeight: 'var(--font-bold)', color: '#1E293B' }}>{stage.label}</span>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{
                                                fontSize: 'var(--label-sm)',
                                                fontWeight: 'var(--font-bold)',
                                                color: '#059669',
                                                backgroundColor: '#ECFDF5',
                                                padding: '2px 10px',
                                                borderRadius: 10
                                            }}>
                                                {stage.count}
                                            </span>

                                            {stage.id === 'nao_iniciado' && <Plus size={18} color="#94A3B8" style={{ cursor: 'pointer' }} />}
                                        </div>
                                    </div>

                                    {/* Column Scrollable Area */}
                                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, scrollbarWidth: 'thin' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            {NEGOTIATIONS.filter(n => n.stage === stage.id).map(n => (
                                                <KanbanCard key={n.id} item={n} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* List View */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {STAGES.map(stage => (
                                <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {/* Stage Header (Standalone) */}
                                    <div
                                        onClick={() => toggleStage(stage.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            height: 46,
                                            padding: '8px 16px',
                                            borderRadius: 8,
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: '#FFF',
                                            cursor: 'pointer',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{ marginRight: 4 }}>
                                                {openStages[stage.id] ? <ChevronDown size={18} color="#9CA3AF" /> : <ChevronRight size={18} color="#9CA3AF" />}
                                            </div>

                                            {/* Nested Circle Icon */}
                                            <div style={{
                                                width: 16, height: 16, borderRadius: '50%',
                                                border: `1.5px solid ${stage.id === 'nao_iniciado' ? '#F87171' : stage.color}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: '50%',
                                                    backgroundColor: stage.id === 'nao_iniciado' ? '#EF4444' : stage.color
                                                }} />
                                            </div>

                                            <span style={{ fontSize: 'var(--label-md)', fontWeight: 'var(--font-bold)', color: '#1E293B' }}>{stage.label}</span>

                                            <span style={{
                                                fontSize: 'var(--label-sm)',
                                                fontWeight: 'var(--font-bold)',
                                                color: '#059669',
                                                backgroundColor: '#ECFDF5',
                                                padding: '2px 10px',
                                                borderRadius: 10
                                            }}>
                                                {stage.count}
                                            </span>
                                        </div>

                                        {stage.id === 'nao_iniciado' && <Plus size={18} color="#94A3B8" />}
                                    </div>

                                    {/* Content Container (Table Header + Rows) */}
                                    {openStages[stage.id] && (
                                        <div style={{
                                            borderRadius: 12,
                                            border: '1px solid #E5E7EB',
                                            overflow: 'hidden',
                                            backgroundColor: '#FFF',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                                        }}>
                                            {/* Table Header Wrapper */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1.5fr 2fr 100px 140px 120px 100px',
                                                height: 48,
                                                alignItems: 'center',
                                                padding: '0 24px',
                                                backgroundColor: '#F6F7F9',
                                                borderBottom: '1px solid #F3F4F6',
                                                opacity: 0.75
                                            }}>
                                                {[
                                                    { label: 'Nome da proposta', icon: <LayoutGrid size={14} /> },
                                                    { label: 'Descrição', icon: <ListIcon size={14} /> },
                                                    { label: 'Tipo', icon: <span style={{ fontSize: 14 }}>#</span> },
                                                    { label: 'Pessoas', icon: <Users size={14} /> },
                                                    { label: 'Prioridade', icon: <SlidersHorizontal size={14} /> },
                                                    { label: 'Interações', icon: <MessageSquare size={14} /> }
                                                ].map((h, i) => (
                                                    <span key={i} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        fontSize: 'var(--label-sm)',
                                                        fontWeight: 'var(--font-bold)',
                                                        color: '#64748B'
                                                    }}>
                                                        {h.icon} {h.label}
                                                    </span>
                                                ))}
                                            </div>
                                            <div>
                                                {NEGOTIATIONS.filter(n => n.stage === stage.id).map(n => (
                                                    <ListRow key={n.id} item={n} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <NewProposalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

export default Negociacoes
