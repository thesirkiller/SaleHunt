import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Home,
    Info,
    SlidersHorizontal,
    Calendar,
    Share2,
    Search,
    MoreVertical,
    Plus,
    Download,
} from 'lucide-react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)
import Sidebar from '../components/Sidebar'
import PageHeader from '../components/PageHeader'
import NewProposalModal from '../components/NewProposalModal'
import { useAuth } from '../contexts/AuthContext'

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const GREEN = '#22c55e'
const GREEN_DARK = '#16a34a'
const BORDER = '#E5E7EB'
const GRAY_TEXT = '#6B7280'
const GRAY_LIGHT = '#9CA3AF'
const TEXT_DARK = '#111827'

/* ── Mock data ─────────────────────────────────────────────────────────────── */
const STATUS_STYLES = {
    'Aprovado': { color: '#16a34a' },
    'Rascunho': { color: '#D97706' },
    'Visualizada': { color: '#2563EB' },
    'Desativada': { color: '#6B7280' },
    'Reprovado': { color: '#EF4444' },
    'Cancelada': { color: '#9CA3AF' },
}

const TAG_STYLES = {
    'Lead': { color: '#7C3AED', borderColor: '#C4B5FD', bg: '#F5F3FF' },
    'Blog': { color: '#16a34a', borderColor: '#86EFAC', bg: '#F0FDF4' },
    'Landing Page': { color: '#EA580C', borderColor: '#FCD34D', bg: '#FFF7ED' },
    '+3': { color: '#6B7280', borderColor: '#D1D5DB', bg: '#F9FAFB' },
}

const STATUSES = ['Aprovado', 'Rascunho', 'Visualizada', 'Desativada', 'Reprovado', 'Cancelada', 'Reprovado', 'Rascunho', 'Visualizada', 'Visualizada']
const TAGS_VARIANTS = [
    [{ l: 'Lead' }, { l: 'Blog' }],
    [{ l: 'Landing Page' }, { l: 'Blog' }, { l: '+3' }],
]

const PROPOSALS = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    name: 'Proposta comercial',
    date: '2 de Fev, 2025',
    value: 'R$10.000,00',
    responsible: 'Lukas Lemos',
    client: i % 2 === 0 ? 'Empresa' : 'Nome da empresa',
    tags: TAGS_VARIANTS[i % 2],
    status: STATUSES[i],
}))

const BAR_DATA = [
    { month: 'Jan', pending: 600, approved: 300, rejected: 100 },
    { month: 'Fev', pending: 750, approved: 200, rejected: 50 },
    { month: 'Mar', pending: 500, approved: 400, rejected: 100 },
    { month: 'Abr', pending: 680, approved: 250, rejected: 70 },
    { month: 'Mai', pending: 720, approved: 280, rejected: 120 },
    { month: 'Jun', pending: 560, approved: 320, rejected: 80 },
    { month: 'Jul', pending: 630, approved: 290, rejected: 90 },
    { month: 'Ago', pending: 710, approved: 310, rejected: 60 },
    { month: 'Set', pending: 580, approved: 260, rejected: 110 },
    { month: 'Out', pending: 650, approved: 330, rejected: 85 },
    { month: 'Nov', pending: 695, approved: 275, rejected: 95 },
    { month: 'Dez', pending: 740, approved: 295, rejected: 75 },
]
const BAR_MAX = 1000

/* ── Sub-components ────────────────────────────────────────────────────────── */

const MetricCard = ({ label, value }) => (
    <div style={{
        flex: 1, backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
        borderRadius: 12, padding: '20px 20px 22px',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: GRAY_TEXT }}>{label}</span>
            <Info size={14} color={GRAY_LIGHT} />
        </div>
        <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: TEXT_DARK, letterSpacing: '-0.5px' }}>
            {value}
        </p>
    </div>
)

const PeriodFilter = ({ active, onSelect }) => {
    const periods = ['12 meses', '3 meses', '30 dias', '7 dias', '24 horas']
    return (
        <div style={{ display: 'flex', gap: 16, borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
            {periods.map(p => (
                <button
                    key={p}
                    onClick={() => onSelect(p)}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        fontSize: 13,
                        fontWeight: active === p ? 700 : 400,
                        color: active === p ? TEXT_DARK : GRAY_LIGHT,
                    }}
                >
                    {p}
                </button>
            ))}
        </div>
    )
}

/* ── Bar Chart (Chart.js) ───────────────────────────────────────────────────── */
const BarChart = ({ data }) => {
    const chartData = {
        labels: data.map(d => d.month),
        datasets: [
            {
                label: 'Pendentes',
                data: data.map(d => d.pending),
                backgroundColor: '#86EFAC',
                borderRadius: 3,
                barThickness: 8,
            },
            {
                label: 'Aprovadas',
                data: data.map(d => d.approved),
                backgroundColor: GREEN_DARK,
                borderRadius: 3,
                barThickness: 8,
            },
            {
                label: 'Reprovadas',
                data: data.map(d => d.rejected),
                backgroundColor: '#D1D5DB',
                borderRadius: 3,
                barThickness: 8,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
            x: { grid: { display: false }, ticks: { color: GRAY_LIGHT, font: { size: 11 } } },
            y: {
                grid: { color: '#F3F4F6' },
                ticks: { color: GRAY_LIGHT, font: { size: 11 }, stepSize: 200 },
                min: 0, max: 1000,
            },
        },
    }

    return <Bar data={chartData} options={options} />
}

/* ── Donut Chart (Chart.js) ─────────────────────────────────────────────────── */
const DonutChart = ({ accepted = 60, rejected = 40 }) => {
    const chartData = {
        labels: ['Aceitas', 'Recusadas'],
        datasets: [{
            data: [accepted, rejected],
            backgroundColor: [GREEN, '#EF4444'],
            borderWidth: 0,
            hoverOffset: 4,
        }],
    }

    const options = {
        responsive: true,
        cutout: '68%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` } } },
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div style={{ width: 160, height: 160, flexShrink: 0 }}>
                <Doughnut data={chartData} options={options} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: GREEN, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: TEXT_DARK }}>Aceitas</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginLeft: 4 }}>{accepted}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: TEXT_DARK }}>Recusadas</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginLeft: 4 }}>{rejected}%</span>
                </div>
            </div>
        </div>
    )
}

/* ── Tag Pill ───────────────────────────────────────────────────────────────── */
const Tag = ({ label }) => {
    const s = TAG_STYLES[label] || TAG_STYLES['+3']
    return (
        <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 500,
            color: s.color,
            border: `1px solid ${s.borderColor}`,
            backgroundColor: s.bg,
            whiteSpace: 'nowrap',
        }}>
            {label}
        </span>
    )
}

/* ── Mini Avatar ────────────────────────────────────────────────────────────── */
const MiniAvatar = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    return (
        <div style={{
            width: 24, height: 24, borderRadius: '50%',
            backgroundColor: '#374151',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 9, fontWeight: 700, color: '#FFFFFF', flexShrink: 0,
        }}>
            {initials}
        </div>
    )
}

/* ── Dashboard Page ─────────────────────────────────────────────────────────── */
const Dashboard = () => {
    const { profile, workspace } = useAuth()
    const navigate = useNavigate()

    const workspaceName = workspace?.name || 'Meu Workspace'

    const [barPeriod, setBarPeriod] = useState('12 meses')
    const [donutPeriod, setDonutPeriod] = useState('12 meses')
    const [search, setSearch] = useState('')
    const [hoveredRow, setHoveredRow] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const th = {
        padding: '10px 14px', textAlign: 'left', fontSize: 12,
        fontWeight: 600, color: GRAY_TEXT,
        borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap',
        backgroundColor: '#FAFAFA',
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <Sidebar activeItem="dashboard" />

            <main style={{ flex: 1, padding: '0', overflowY: 'auto', minWidth: 0 }}>

                <PageHeader
                    breadcrumb={[{ label: 'Dashboard', active: true }]}
                    title="Dashboard"
                    description="Acesse informações principais, resumo das métricas do seu negócio e as últimas atividades das suas propostas."
                    actions={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 14px', border: `1px solid ${BORDER}`, borderRadius: 8,
                                backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13,
                                color: TEXT_DARK, fontWeight: 500,
                            }}>
                                <SlidersHorizontal size={14} color={GRAY_TEXT} />
                                Filtros
                            </button>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '8px 14px', border: `1px solid ${BORDER}`, borderRadius: 8,
                                backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13,
                                color: TEXT_DARK, fontWeight: 500,
                            }}>
                                <Download size={14} color={GRAY_TEXT} />
                                Exportar
                            </button>
                        </div>
                    }
                    primaryAction={{
                        label: 'Nova proposta',
                        icon: <Plus size={16} />,
                        onClick: () => setIsModalOpen(true)
                    }}
                />
                <div style={{ padding: '0 40px 40px 40px' }}>
                    {/* ── METRIC CARDS ── */}
                    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                        <MetricCard label="Valor em negociação" value="R$32.280" />
                        <MetricCard label="Ticket médio" value="R$18.867" />
                        <MetricCard label="Tempo de maturação" value="5.3 dias" />
                        <MetricCard label="Tempo de abertura" value="2.3 dias" />
                    </div>

                    {/* ── CHARTS ROW ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 24 }}>

                        {/* Bar Chart */}
                        <div style={{
                            backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
                            borderRadius: 12, padding: '20px 24px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>
                                    Volume de propostas
                                </h3>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: GREEN, fontWeight: 600, padding: 0 }}>
                                    Ver detalhes
                                </button>
                            </div>
                            {/* Legend */}
                            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                                {[['#86EFAC', 'Pendentes'], [GREEN_DARK, 'Aprovadas'], ['#D1D5DB', 'Reprovadas']].map(([color, label]) => (
                                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: GRAY_TEXT }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
                                        {label}
                                    </div>
                                ))}
                            </div>
                            <BarChart data={BAR_DATA} maxVal={BAR_MAX} />
                            <div style={{ marginTop: 16 }}>
                                <PeriodFilter active={barPeriod} onSelect={setBarPeriod} />
                            </div>
                        </div>

                        {/* Donut Chart */}
                        <div style={{
                            backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
                            borderRadius: 12, padding: '20px 24px',
                            display: 'flex', flexDirection: 'column',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>
                                    Taxa de conversão
                                </h3>
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: GREEN, fontWeight: 600, padding: 0 }}>
                                    Ver detalhes
                                </button>
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <DonutChart accepted={60} rejected={40} />
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <PeriodFilter active={donutPeriod} onSelect={setDonutPeriod} />
                            </div>
                        </div>
                    </div>

                    {/* ── PROPOSALS TABLE ── */}
                    <div style={{
                        backgroundColor: '#FFFFFF', border: `1px solid ${BORDER}`,
                        borderRadius: 12, overflow: 'hidden',
                    }}>
                        {/* Table header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '18px 20px', borderBottom: `1px solid ${BORDER}`,
                        }}>
                            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>
                                Últimas propostas movimentadas
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {/* Search */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    border: `1px solid ${BORDER}`, borderRadius: 8,
                                    padding: '7px 12px', backgroundColor: '#FFFFFF',
                                }}>
                                    <Search size={14} color={GRAY_LIGHT} />
                                    <input
                                        placeholder="Pesquisar..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        style={{
                                            border: 'none', outline: 'none', fontSize: 13,
                                            color: TEXT_DARK, width: 140, background: 'transparent',
                                        }}
                                    />
                                </div>
                                {/* Filtros */}
                                <button style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '7px 14px', border: `1px solid ${BORDER}`, borderRadius: 8,
                                    backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13,
                                    color: TEXT_DARK, fontWeight: 500,
                                }}>
                                    <SlidersHorizontal size={13} color={GRAY_TEXT} />
                                    Filtros
                                </button>
                                {/* Nova proposta */}
                                <button style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '7px 14px', border: 'none', borderRadius: 8,
                                    backgroundColor: TEXT_DARK, cursor: 'pointer', fontSize: 13,
                                    color: '#FFFFFF', fontWeight: 600,
                                }}>
                                    <Plus size={14} color="#FFFFFF" />
                                    Nova proposta
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {['Nome da proposta', 'Data de abertura', 'Valor em negociação', 'Responsável', 'Cliente', 'Tipo', 'Status', ''].map((h, i) => (
                                            <th key={i} style={th}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PROPOSALS.filter(p =>
                                        !search || p.name.toLowerCase().includes(search.toLowerCase())
                                    ).map(row => (
                                        <tr
                                            key={row.id}
                                            onMouseEnter={() => setHoveredRow(row.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            style={{
                                                borderBottom: `1px solid #F3F4F6`,
                                                backgroundColor: hoveredRow === row.id ? '#FAFAFA' : '#FFFFFF',
                                                transition: 'background 0.1s',
                                            }}
                                        >
                                            {/* Nome */}
                                            <td style={{ padding: '12px 14px', fontSize: 13, color: TEXT_DARK, fontWeight: 500, whiteSpace: 'nowrap' }}>
                                                {row.name}
                                            </td>
                                            {/* Data */}
                                            <td style={{ padding: '12px 14px', fontSize: 13, color: GRAY_TEXT, whiteSpace: 'nowrap' }}>
                                                {row.date}
                                            </td>
                                            {/* Valor */}
                                            <td style={{ padding: '12px 14px', fontSize: 13, color: TEXT_DARK, whiteSpace: 'nowrap' }}>
                                                {row.value}
                                            </td>
                                            {/* Responsável */}
                                            <td style={{ padding: '12px 14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <MiniAvatar name={row.responsible} />
                                                    <span style={{ fontSize: 13, color: TEXT_DARK, whiteSpace: 'nowrap' }}>{row.responsible}</span>
                                                </div>
                                            </td>
                                            {/* Cliente */}
                                            <td style={{ padding: '12px 14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <MiniAvatar name={row.client} />
                                                    <span style={{ fontSize: 13, color: TEXT_DARK, whiteSpace: 'nowrap' }}>{row.client}</span>
                                                </div>
                                            </td>
                                            {/* Tags */}
                                            <td style={{ padding: '12px 14px' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                                    {row.tags.map((t, ti) => <Tag key={ti} label={t.l} />)}
                                                </div>
                                            </td>
                                            {/* Status */}
                                            <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                                                <span style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: STATUS_STYLES[row.status]?.color || GRAY_TEXT,
                                                }}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td style={{ padding: '12px 10px' }}>
                                                <button style={{
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    padding: 4, color: GRAY_LIGHT, display: 'flex',
                                                }}>
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table footer */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '14px 20px', borderTop: `1px solid ${BORDER}`,
                        }}>
                            <span style={{ fontSize: 13, color: GRAY_TEXT }}>
                                Mostrando <strong style={{ color: TEXT_DARK }}>10</strong> de <strong style={{ color: TEXT_DARK }}>129</strong> propostas
                            </span>
                            <button style={{
                                padding: '8px 20px', border: `1px solid ${BORDER}`, borderRadius: 8,
                                backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13,
                                color: TEXT_DARK, fontWeight: 500,
                            }}>
                                Carregar mais
                            </button>
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

export default Dashboard
