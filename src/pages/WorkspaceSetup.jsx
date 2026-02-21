import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import OnboardingLayout from '../components/OnboardingLayout'

/**
 * WorkspaceSetup
 * Fluxo de criação de workspace — separado do onboarding de perfil.
 * Multi-workspace: um usuário pode criar vários workspaces.
 *
 * Steps:
 *   1 — Introdução / CTA "Criar workspace"            (atual)
 *   2-4 — a definir nas próximas etapas
 */
const WorkspaceSetup = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // ── Campos do workspace ──────────────────────────────────────────────────
    const [workspaceName, setWorkspaceName] = useState('')
    const [workspaceCnpj, setWorkspaceCnpj] = useState('')
    const [brandColor, setBrandColor] = useState('#22c55e')
    const [companySize, setCompanySize] = useState('')
    const [marketSector, setMarketSector] = useState('')
    const [teamSize, setTeamSize] = useState('')

    // ── Navegação ────────────────────────────────────────────────────────────
    const goNext = () => setStep(s => Math.min(s + 1, 4))
    const goBack = () => setStep(s => Math.max(s - 1, 1))

    // ── Criação do workspace no Supabase ─────────────────────────────────────
    const handleCreate = async () => {
        if (!user) return
        setLoading(true)
        setError('')

        const { error: wsError } = await supabase.from('workspaces').insert({
            owner_id: user.id,
            name: workspaceName,
            cnpj: workspaceCnpj || null,
            brand_color: brandColor,
            company_size: companySize || null,
            market_sector: marketSector || null,
            team_size: teamSize || null,
        })

        setLoading(false)

        if (wsError) {
            setError('Erro ao criar workspace. Tente novamente.')
            console.error('Workspace insert error:', wsError.message)
            return
        }

        navigate('/')
    }

    // ── Estilos compartilhados ────────────────────────────────────────────────
    const btnPrimary = {
        display: 'inline-block',
        backgroundColor: '#111827',
        color: '#FFFFFF',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'background 0.15s',
    }

    // ── Step 1 ────────────────────────────────────────────────────────────────
    const renderStep1 = () => (
        <div style={{ maxWidth: '420px' }}>
            <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#222222',
                margin: '0 0 12px 0',
                lineHeight: 1.3,
            }}>
                Vamos configurar seu workspace?
            </h2>
            <p style={{
                fontSize: '14px',
                color: '#A0ABC0',
                lineHeight: 1.6,
                margin: '0 0 40px 0',
                fontWeight: 400,
            }}>
                Para começar a criar propostas, você precisa de pelo menos um workspace.
                Isso permitirá que você aproveite ao máximo nossos serviços.
            </p>

            {error && (
                <p style={{ fontSize: '13px', color: '#FF3B3B', marginBottom: '16px' }}>
                    {error}
                </p>
            )}

            <button
                style={btnPrimary}
                onClick={goNext}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0f172a'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
            >
                Criar workspace
            </button>
        </div>
    )

    // ── Step 2-4 (placeholder — serão implementados nos próximos prompts) ─────
    const renderPlaceholder = () => (
        <div style={{ maxWidth: '420px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 12px 0' }}>
                Etapa {step} de 4
            </h2>
            <p style={{ fontSize: '14px', color: '#A0ABC0', margin: '0 0 40px 0' }}>
                Conteúdo desta etapa será definido em breve.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    style={{ ...btnPrimary, backgroundColor: '#FFFFFF', color: '#222222', border: '1px solid #E5E7EB' }}
                    onClick={goBack}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                    Voltar
                </button>
                {step < 4 ? (
                    <button
                        style={btnPrimary}
                        onClick={goNext}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0f172a'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
                    >
                        Próximo
                    </button>
                ) : (
                    <button
                        style={{ ...btnPrimary, opacity: loading ? 0.6 : 1 }}
                        onClick={handleCreate}
                        disabled={loading}
                        onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#0f172a')}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
                    >
                        {loading ? 'Criando...' : 'Criar workspace'}
                    </button>
                )}
            </div>
        </div>
    )

    return (
        <OnboardingLayout step={step}>
            {step === 1 ? renderStep1() : renderPlaceholder()}
        </OnboardingLayout>
    )
}

export default WorkspaceSetup
