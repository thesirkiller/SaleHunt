import { Home, ChevronRight, Search } from 'lucide-react'

/**
 * PageHeader Component
 * 
 * Props:
 * - breadcrumb: Array of { label, icon, active }
 * - title: string
 * - description: string
 * - actions: ReactNode (Buttons, etc)
 * - primaryAction: { label, icon, onClick }
 * - searchProps: { value, onChange, placeholder, width }
 * - tabs: { items: [{ label, active, onClick }], activeColor }
 */
const PageHeader = ({
    breadcrumb = [],
    title,
    description,
    actions,
    primaryAction, // { label, icon, onClick }
    searchProps,
    tabs
}) => {
    return (
        <div style={{ padding: '32px 40px 0 40px', backgroundColor: '#F9FAFB' }}>
            {/* Breadcrumb Area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Home size={16} color="#94A3B8" />
                {breadcrumb.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ChevronRight size={14} color="#CBD5E1" />
                        <span style={{
                            fontSize: 13,
                            color: item.active ? '#22c55e' : '#94A3B8',
                            fontWeight: item.active ? 500 : 400
                        }}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Main Header + Search & Actions */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ margin: '0 0 4px 0', fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                        {title}
                    </h1>
                    {description && (
                        <p style={{ margin: 0, fontSize: 14, color: '#64748B', maxWidth: 440, lineHeight: 1.5 }}>
                            {description}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 4 }}>
                    {searchProps && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '0 16px', height: 40, width: searchProps.width || 260,
                            backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8,
                            transition: 'border-color 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                        }}>
                            <Search size={16} color="#94A3B8" />
                            <input
                                type="text"
                                placeholder={searchProps.placeholder || "Pesquisar..."}
                                value={searchProps.value}
                                onChange={searchProps.onChange}
                                style={{ border: 'none', outline: 'none', fontSize: 14, color: '#1E293B', width: '100%', background: 'transparent' }}
                            />
                        </div>
                    )}
                    {actions}
                    {primaryAction && (
                        <button
                            onClick={primaryAction.onClick}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                height: 40, padding: '0 16px',
                                backgroundColor: '#111827', border: 'none', borderRadius: 8,
                                fontSize: 14, fontWeight: 600, color: '#FFF', cursor: 'pointer'
                            }}
                        >
                            {primaryAction.icon}
                            {primaryAction.label}
                        </button>
                    )}
                </div>
            </div>

            {/* Optional Tab Navigation */}
            {tabs && (
                <div style={{
                    display: 'flex', gap: 24, marginTop: 24,
                    borderBottom: '1px solid #E5E7EB',
                    height: 48,
                    marginBottom: 32
                }}>
                    {tabs.items.map((tab, idx) => (
                        <div
                            key={idx}
                            onClick={tab.onClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 2px',
                                fontSize: 14,
                                fontWeight: 600,
                                color: tab.active ? '#111827' : '#94A3B8',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'color 0.2s',
                                userSelect: 'none'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.active && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: -1,
                                    left: 0,
                                    right: 0,
                                    height: 2,
                                    backgroundColor: tabs.activeColor || '#22c55e',
                                    zIndex: 2
                                }} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Spacing if no tabs */}
            {!tabs && <div style={{ marginBottom: 32 }} />}
        </div>
    )
}

export default PageHeader
