import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    FileText,
    HandshakeIcon,
    Users,
    Bot,
    HelpCircle,
    Newspaper,
    Send,
    Bug,
    Settings,
    Bell,
    CreditCard,
    LogOut,
    MoreVertical,
    Check,
    ChevronsUpDown,
    ArrowUpDown,
    PanelLeftClose,
    PanelLeft,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import Logo from './Logo'

/* ── Local helpers ─────────────────────────────────────────────────────────── */

const WorkspaceIcon = ({ name, size = 32 }) => {
    const initials = name ? name.charAt(0).toUpperCase() : 'W'
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: '#111827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: size * 0.4,
            fontWeight: 700,
            color: '#FFFFFF',
        }}>
            {initials}
        </div>
    )
}

const UserAvatar = ({ name, avatarUrl, size = 32 }) => {
    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={name}
                style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
        )
    }
    const initials = name
        ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '?'
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: size * 0.35,
            fontWeight: 700,
            color: '#FFFFFF',
        }}>
            {initials}
        </div>
    )
}

/* ── Constants ─────────────────────────────────────────────────────────────── */

const MENU_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, path: '/' },
    { id: 'propostas', label: 'Propostas', Icon: FileText, path: '/propostas', badge: 15 },
    { id: 'negociacoes', label: 'Negociações', Icon: HandshakeIcon, path: '/negociacoes' },
    { id: 'clientes', label: 'Clientes', Icon: Users, path: '/clientes' },
    { id: 'automacoes', label: 'Automações', Icon: Bot, path: '/automacoes', disabled: true, soon: true },
]

const RESOURCE_ITEMS = [
    { id: 'faqs', label: 'FAQs', Icon: HelpCircle, path: '/faqs' },
    { id: 'novidades', label: 'Novidades', Icon: Newspaper, path: '/novidades' },
    { id: 'sugestao', label: 'Enviar sugestão', Icon: Send, path: '/sugestao' },
    { id: 'bug', label: 'Reportar bug', Icon: Bug, path: '/bug' },
]

/* ── Sidebar Component ─────────────────────────────────────────────────────── */

const Sidebar = ({
    activeItem = 'dashboard',
}) => {
    const { user, profile, workspace, workspaces, signOut, updateWorkspace } = useAuth()
    const navigate = useNavigate()

    const workspaceName = workspace?.name || 'Meu Workspace'

    const userName = profile?.full_name || user?.email?.split('@')[0] || 'Usuário'
    const userEmail = user?.email || ''
    const avatarUrl = profile?.avatar_url || null

    const [collapsed, setCollapsed] = useState(false)
    const [wsDropOpen, setWsDropOpen] = useState(false)
    const [userDropOpen, setUserDropOpen] = useState(false)
    const [hoveredItem, setHoveredItem] = useState(null)

    const wsDropRef = useRef(null)
    const userDropRef = useRef(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handle = (e) => {
            if (wsDropRef.current && !wsDropRef.current.contains(e.target))
                setWsDropOpen(false)
            if (userDropRef.current && !userDropRef.current.contains(e.target))
                setUserDropOpen(false)
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [])

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    /* ── Styles ──────────────────────────────────────────────────────────── */
    const sidebarWidth = collapsed ? 64 : 220
    const sidebar = {
        width: sidebarWidth,
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        overflow: 'visible',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }

    const navItem = (id, disabled) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 8,
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 14,
        fontWeight: activeItem === id ? 600 : 500,
        color: disabled ? '#D1D5DB' : (activeItem === id ? '#FFFFFF' : (hoveredItem === id ? '#111827' : '#374151')),
        backgroundColor: activeItem === id ? '#111827' : (hoveredItem === id && !disabled ? '#F3F4F6' : 'transparent'),
        transition: 'background 0.15s, color 0.15s',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        marginBottom: 2,
        userSelect: 'none',
    })

    const sectionLabel = {
        fontSize: 11,
        fontWeight: 600,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 6,
        marginTop: 4,
        paddingLeft: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    }

    return (
        <aside style={sidebar}>

            {/* ── TOPO: Logo + Collapse ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                {!collapsed && (
                    <Logo variant="color-dark" height={24} />
                )}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: 4, borderRadius: 6, color: '#9CA3AF',
                        display: 'flex', alignItems: 'center',
                        marginLeft: collapsed ? 'auto' : 0,
                    }}
                    title={collapsed ? 'Expandir' : 'Recolher'}
                >
                    {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
                </button>
            </div>

            {/* ── WORKSPACE SELECTOR ── */}
            <div ref={wsDropRef} style={{ position: 'relative', marginBottom: 20 }}>
                <button
                    onClick={() => !collapsed && setWsDropOpen(o => !o)}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 10px',
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        backgroundColor: '#FFFFFF',
                        cursor: collapsed ? 'default' : 'pointer',
                        textAlign: 'left',
                        overflow: 'hidden',
                    }}
                >
                    <WorkspaceIcon name={workspaceName} size={24} />
                    {!collapsed && (
                        <>
                            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {workspaceName}
                            </span>
                            <ChevronsUpDown size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                        </>
                    )}
                </button>

                {/* Dropdown */}
                {wsDropOpen && (
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        zIndex: 50,
                        overflow: 'hidden',
                    }}>
                        {/* Current workspace (active) */}
                        <div style={{ padding: '6px 4px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '8px 10px', borderRadius: 6,
                                backgroundColor: '#F9FAFB',
                            }}>
                                <WorkspaceIcon name={workspaceName} size={28} />
                                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111827' }}>{workspaceName}</span>
                                <Check size={14} color="#22c55e" />
                            </div>

                            {/* Additional workspaces */}
                            {workspaces.filter(w => w.id !== workspace?.id).map(ws => (
                                <div
                                    key={ws.id}
                                    onClick={() => {
                                        updateWorkspace(ws)
                                        setWsDropOpen(false)
                                    }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '8px 10px', borderRadius: 6,
                                        cursor: 'pointer',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <WorkspaceIcon name={ws.name} size={28} />
                                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#111827' }}>{ws.name}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid #F3F4F6', padding: '6px 4px' }}>
                            <button
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '8px 10px', border: '1px solid #E5E7EB', borderRadius: 6,
                                    backgroundColor: '#FFFFFF', cursor: 'pointer', fontSize: 13,
                                    color: '#6B7280', fontWeight: 500,
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                                onClick={() => { setWsDropOpen(false); navigate('/workspace/criar') }}
                            >
                                <ArrowUpDown size={14} color="#6B7280" />
                                Trocar workspace
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── MENU ── */}
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
                {!collapsed && <p style={sectionLabel}>MENU</p>}

                {MENU_ITEMS.map(item => (
                    <div
                        key={item.id}
                        style={navItem(item.id, item.disabled)}
                        onClick={() => !item.disabled && navigate(item.path)}
                        onMouseEnter={() => !item.disabled && setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.Icon
                            size={18}
                            style={{ flexShrink: 0 }}
                            color={
                                item.disabled ? '#D1D5DB'
                                    : activeItem === item.id ? '#FFFFFF'
                                        : hoveredItem === item.id ? '#111827'
                                            : '#6B7280'
                            }
                        />
                        {!collapsed && (
                            <>
                                <span style={{ flex: 1 }}>{item.label}</span>
                                {item.badge && (
                                    <span style={{
                                        backgroundColor: '#EF4444', color: '#FFFFFF',
                                        borderRadius: 20, fontSize: 11, fontWeight: 700,
                                        padding: '1px 6px', flexShrink: 0,
                                    }}>
                                        {item.badge}
                                    </span>
                                )}
                                {item.soon && (
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', flexShrink: 0 }}>
                                        Em breve
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                ))}

                {/* Separator */}
                <div style={{ borderTop: '1px solid #F3F4F6', margin: '12px 0' }} />

                {!collapsed && <p style={sectionLabel}>RECURSOS</p>}

                {RESOURCE_ITEMS.map(item => (
                    <div
                        key={item.id}
                        style={navItem(item.id, false)}
                        onClick={() => navigate(item.path)}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        title={collapsed ? item.label : undefined}
                    >
                        <item.Icon
                            size={18}
                            style={{ flexShrink: 0 }}
                            color={hoveredItem === item.id ? '#111827' : '#6B7280'}
                        />
                        {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                    </div>
                ))}
            </div>

            {/* ── RODAPÉ: Usuário ── */}
            <div ref={userDropRef} style={{ position: 'relative', borderTop: '1px solid #F3F4F6', paddingTop: 12, marginTop: 12, flexShrink: 0 }}>

                {/* User dropdown (opens upward) */}
                {userDropOpen && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 'calc(100% + 20px)',
                        width: 240,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: 8,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        zIndex: 50,
                        overflow: 'hidden',
                        padding: '6px 4px',
                    }}>
                        {/* User info header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', marginBottom: 4 }}>
                            <UserAvatar name={userName} avatarUrl={avatarUrl} size={32} />
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</p>
                                <p style={{ margin: 0, fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #F3F4F6', marginBottom: 4 }} />

                        {[
                            { Icon: Settings, label: 'Configurações', path: '/configuracoes', red: false },
                            { Icon: Bell, label: 'Notificações', path: '/notificacoes', red: false },
                            { Icon: CreditCard, label: 'Assinatura', path: '/assinatura', red: false },
                        ].map(({ Icon, label, path, red }) => (
                            <div
                                key={label}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '9px 10px', borderRadius: 6,
                                    cursor: 'pointer', fontSize: 13,
                                    color: red ? '#EF4444' : '#374151', fontWeight: 500,
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => { setUserDropOpen(false); navigate(path) }}
                            >
                                <Icon size={15} color={red ? '#EF4444' : '#6B7280'} />
                                {label}
                            </div>
                        ))}

                        <div style={{ borderTop: '1px solid #F3F4F6', margin: '4px 0' }} />

                        <div
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 10px', borderRadius: 6,
                                cursor: 'pointer', fontSize: 13, color: '#EF4444', fontWeight: 500,
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            onClick={handleSignOut}
                        >
                            <LogOut size={15} color="#EF4444" />
                            Sair
                        </div>
                    </div>
                )}

                {/* Footer row */}
                <div
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        cursor: 'pointer', borderRadius: 8, padding: '4px 4px',
                    }}
                    onClick={() => setUserDropOpen(o => !o)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <UserAvatar name={userName} avatarUrl={avatarUrl} size={32} />
                    {!collapsed && (
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {userName}
                            </p>
                            <p style={{ margin: 0, fontSize: 11, color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {userEmail}
                            </p>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#9CA3AF', display: 'flex' }}
                            onClick={e => { e.stopPropagation(); setUserDropOpen(o => !o) }}
                        >
                            <MoreVertical size={16} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
