import Logo from './Logo'
import StepIndicator from './StepIndicator'

/**
 * OnboardingLayout
 * Layout 40/60 usado no fluxo de criação de workspace.
 *
 * Props:
 *   step     {number} — step atual 1-4, passado para o StepIndicator
 *   children {node}   — conteúdo da coluna esquerda (formulário da etapa)
 */
const OnboardingLayout = ({ step = 1, children }) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#FFFFFF',
        }}>
            {/* ── Coluna Esquerda (40%) ─────────────────────────────────── */}
            <div style={{
                width: '40%',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '48px 64px',
                boxSizing: 'border-box',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Logo */}
                <div style={{ marginBottom: '64px' }}>
                    <Logo variant="color-light" height={28} />
                </div>

                {/* Step Progress */}
                <div style={{ marginBottom: '40px' }}>
                    <StepIndicator total={4} current={step} />
                </div>

                {/* Conteúdo da etapa */}
                <div style={{ flex: 1 }}>
                    {children}
                </div>
            </div>

            {/* ── Coluna Direita (60%) — Decorativa ─────────────────────── */}
            <div
                aria-hidden="true"
                style={{
                    width: '60%',
                    minHeight: '100vh',
                    backgroundColor: '#F4F7FB',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '48px 64px',
                    boxSizing: 'border-box',
                    opacity: 0.6,
                }}
            >
                {/* Hero Text */}
                <div style={{ marginBottom: '40px', maxWidth: '520px' }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#222222',
                        margin: '0 0 12px 0',
                        lineHeight: 1.3,
                    }}>
                        Transforme propostas em negócios
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: '#A0ABC0',
                        lineHeight: 1.6,
                        margin: 0,
                    }}>
                        A solução inteligente para freelancers e prestadores de serviço
                        que querem vender com estratégia e eficiência.
                    </p>
                </div>

                {/* Dashboard Mockup */}
                <div style={{
                    flex: 1,
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: '-64px',
                        bottom: '-48px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px 0 0 0',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                        border: '1px solid #E5E7EB',
                        overflow: 'hidden',
                        display: 'flex',
                    }}>
                        {/* Sidebar do dashboard */}
                        <div style={{
                            width: '220px',
                            borderRight: '1px solid #F0F0F0',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px 16px',
                            gap: '4px',
                            flexShrink: 0,
                        }}>
                            {/* Workspace selector */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                            }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#22c55e', flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ height: '8px', width: '80px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '4px' }} />
                                    <div style={{ height: '6px', width: '50px', backgroundColor: '#F0F0F0', borderRadius: '4px' }} />
                                </div>
                            </div>

                            {/* Seção MENU */}
                            <div style={{ height: '8px', width: '32px', backgroundColor: '#F0F0F0', borderRadius: '4px', marginBottom: '8px', marginLeft: '8px' }} />

                            {/* Nav items */}
                            {[
                                { active: true, label: 'Dashboard', w: 70 },
                                { active: false, label: 'Propostas', w: 60 },
                                { active: false, label: 'Negociações', w: 80 },
                                { active: false, label: 'Clientes', w: 55 },
                                { active: false, label: 'Automações', w: 75 },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    backgroundColor: item.active ? '#F0FDF4' : 'transparent',
                                }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: item.active ? '#22c55e' : '#E5E7EB', flexShrink: 0 }} />
                                    <div style={{ height: '7px', width: `${item.w}px`, backgroundColor: item.active ? '#22c55e' : '#E5E7EB', borderRadius: '4px', opacity: item.active ? 0.7 : 1 }} />
                                </div>
                            ))}

                            {/* Seção RECURSOS */}
                            <div style={{ height: '8px', width: '50px', backgroundColor: '#F0F0F0', borderRadius: '4px', margin: '16px 0 8px 8px' }} />
                            {[50, 65, 55, 60].map((w, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#F0F0F0', flexShrink: 0 }} />
                                    <div style={{ height: '7px', width: `${w}px`, backgroundColor: '#F0F0F0', borderRadius: '4px' }} />
                                </div>
                            ))}

                            {/* User */}
                            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#D5DCE9', flexShrink: 0 }} />
                                <div>
                                    <div style={{ height: '7px', width: '70px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '4px' }} />
                                    <div style={{ height: '6px', width: '100px', backgroundColor: '#F0F0F0', borderRadius: '4px' }} />
                                </div>
                            </div>
                        </div>

                        {/* Main content do dashboard */}
                        <div style={{ flex: 1, backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
                            {/* Breadcrumb */}
                            <div style={{ height: '40px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '6px' }}>
                                <div style={{ height: '7px', width: '14px', backgroundColor: '#E5E7EB', borderRadius: '3px' }} />
                                <div style={{ height: '7px', width: '6px', backgroundColor: '#D5DCE9', borderRadius: '2px' }} />
                                <div style={{ height: '7px', width: '60px', backgroundColor: '#22c55e', borderRadius: '3px', opacity: 0.7 }} />
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, padding: '24px', overflowY: 'hidden' }}>
                                {/* Title */}
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ height: '18px', width: '100px', backgroundColor: '#222222', borderRadius: '4px', marginBottom: '8px' }} />
                                    <div style={{ height: '8px', width: '280px', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
                                </div>

                                {/* KPI Cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                    {[
                                        { label: 'Valor em negociação', value: 'R$32,280' },
                                        { label: 'Ticket médio', value: 'R$18.867' },
                                    ].map((kpi, i) => (
                                        <div key={i} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #F0F0F0', padding: '16px' }}>
                                            <div style={{ height: '7px', width: '80px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '12px' }} />
                                            <div style={{ height: '20px', width: '90px', backgroundColor: '#222222', borderRadius: '4px', opacity: 0.85 }} />
                                        </div>
                                    ))}
                                </div>

                                {/* Chart area */}
                                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #F0F0F0', padding: '16px', marginBottom: '16px' }}>
                                    <div style={{ height: '8px', width: '120px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
                                    {/* Bar chart skeleton */}
                                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '80px' }}>
                                        {[60, 80, 65, 90, 75, 85].map((h, i) => (
                                            <div key={i} style={{ flex: 1, borderRadius: '4px 4px 0 0', overflow: 'hidden' }}>
                                                <div style={{ height: `${h * 0.4}px`, backgroundColor: '#22c55e', borderRadius: '4px 4px 0 0', opacity: 0.3 }} />
                                                <div style={{ height: `${h * 0.2}px`, backgroundColor: '#22c55e', borderRadius: '4px 4px 0 0' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Table skeleton */}
                                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #F0F0F0', padding: '16px' }}>
                                    <div style={{ height: '8px', width: '150px', backgroundColor: '#E5E7EB', borderRadius: '4px', marginBottom: '16px' }} />
                                    {[1, 2].map((_, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: i === 0 ? '1px solid #F0F0F0' : 'none', marginBottom: i === 0 ? '12px' : 0 }}>
                                            <div style={{ height: '7px', width: '120px', backgroundColor: '#E5E7EB', borderRadius: '4px' }} />
                                            <div style={{ height: '7px', width: '80px', backgroundColor: '#F0F0F0', borderRadius: '4px' }} />
                                            <div style={{ height: '7px', width: '70px', backgroundColor: '#F0F0F0', borderRadius: '4px' }} />
                                            <div style={{ marginLeft: 'auto', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#D5DCE9' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OnboardingLayout
