import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Hand,
    Video,
    Briefcase,
    Palette,
    Users,
    MessageSquare,
    Check,
    CloudUpload,
    Plus,
    X,
    Mail,
    ChevronDown
} from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import { HexColorPicker } from 'react-colorful'

const Onboarding = () => {
    const { user, profile, refreshProfile, updateProfile, signOut } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState(profile?.onboarding_step || 1)
    const [loading, setLoading] = useState(false)
    const [initLoading, setInitLoading] = useState(true) // carregando workspace inicial
    const [error, setError] = useState('')
    const colorPickerPopoverRef = useRef(null)
    const logoInputRef = useRef(null)
    const [showColorPicker, setShowColorPicker] = useState(false)

    // Form States
    const [invites, setInvites] = useState(['', ''])

    // Workspace state
    const [workspaceId, setWorkspaceId] = useState(null)
    const [workspaceName, setWorkspaceName] = useState('')
    const [workspaceCnpj, setWorkspaceCnpj] = useState('')
    const [brandColor, setBrandColor] = useState('#12BF7D')
    const [brandLogo, setBrandLogo] = useState(null)
    const [brandLogoPreview, setBrandLogoPreview] = useState(null)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [customColors, setCustomColors] = useState([])

    // Questionnaire states
    const [companySize, setCompanySize] = useState('')
    const [marketSector, setMarketSector] = useState('')
    const [teamSize, setTeamSize] = useState('')

    const sidebarSteps = [
        { id: 1, title: 'Boas vindas ao SaleHunt!', subtitle: 'Comece sua jornada no SaleHunt', icon: Hand, internalSteps: [1] },
        { id: 2, title: 'Vídeos sobre funcionalidades e dicas', subtitle: 'Dicas de como maximizar o uso do SaleHunt', icon: Video, internalSteps: [2] },
        { id: 3, title: 'Criar workspace', subtitle: 'Configure seu primeiro workspace no SaleHunt', icon: Briefcase, internalSteps: [3, 4], subStepCount: 2 },
        { id: 5, title: 'Convidar colaboradores', subtitle: 'Convide seus colaboradores para a plataforma', icon: Users, internalSteps: [5] },
        { id: 6, title: 'Questionários', subtitle: 'Compartilhe informações sobre seu negócio', icon: MessageSquare, internalSteps: [6, 7], subStepCount: 2 },
    ]

    // Na montagem: busca ou cria workspace + carrega cores customizadas
    useEffect(() => {
        // Usuário ainda não carregou — aguarda próximo ciclo sem travar
        if (!user) {
            setInitLoading(false)
            return
        }

        let aborted = false
        const safetyTimer = setTimeout(() => {
            if (!aborted) setInitLoading(false)
        }, 8000)

        const init = async () => {
            setInitLoading(true)
            try {
                // 1. Busca workspace existente
                const { data: existing } = await supabase
                    .from('workspaces')
                    .select('*')
                    .eq('owner_id', user.id)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle()             // não lança erro quando não encontra

                if (existing) {
                    // Workspace encontrado: pré-preenche campos e retoma passo
                    setWorkspaceId(existing.id)
                    setWorkspaceName(existing.name || '')
                    setWorkspaceCnpj(existing.cnpj || '')
                    setBrandColor(existing.brand_color || '#12BF7D')
                    setBrandLogo(existing.brand_logo_url || null)
                    setBrandLogoPreview(existing.brand_logo_url || null)
                    setCompanySize(existing.company_size || '')
                    setMarketSector(existing.market_sector || '')
                    setTeamSize(existing.team_size || '')
                    // Retoma o passo onde parou
                    if (profile?.onboarding_step) setStep(profile.onboarding_step)
                } else {
                    // Cria workspace agora (nome placeholder, will be updated in step 3)
                    const { data: created, error: createErr } = await supabase
                        .from('workspaces')
                        .insert({ owner_id: user.id, name: 'Meu Workspace', brand_color: '#12BF7D' })
                        .select()
                        .single()

                    if (createErr) {
                        console.error('Erro ao criar workspace:', createErr.message)
                    } else {
                        setWorkspaceId(created.id)
                    }
                }

                // 2. Carrega cores customizadas
                const { data: colors } = await supabase
                    .from('custom_brand_colors')
                    .select('hex')
                    .order('created_at', { ascending: true })
                if (colors) setCustomColors(colors.map(c => c.hex))

            } catch (err) {
                console.error('Init error:', err)
            } finally {
                if (!aborted) setInitLoading(false)
            }
        }

        init()
        return () => {
            aborted = true
            clearTimeout(safetyTimer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const handleNext = async () => {
        if (step < 8) {
            const next = step + 1
            setStep(next)

            if (user) {
                // Atualiza onboarding_step no profile
                supabase
                    .from('profiles')
                    .update({ onboarding_step: next })
                    .eq('id', user.id)
                    .then(({ error }) => { if (error) console.error('profile step save:', error.message) })

                // Salva dados do step atual no workspace
                if (workspaceId) {
                    const wsPayload = {}

                    if (step === 3) {
                        wsPayload.name = workspaceName || ''
                        wsPayload.cnpj = workspaceCnpj || null
                    }
                    if (step === 4) {
                        wsPayload.brand_color = brandColor
                        wsPayload.brand_logo_url = brandLogo || null
                    }
                    if (step === 6) {
                        wsPayload.market_sector = marketSector || null
                        wsPayload.company_size = companySize || null
                    }
                    if (step === 7) {
                        wsPayload.team_size = teamSize || null
                    }

                    if (Object.keys(wsPayload).length > 0) {
                        supabase
                            .from('workspaces')
                            .update(wsPayload)
                            .eq('id', workspaceId)
                            .then(({ error }) => { if (error) console.error(`ws step ${step} save:`, error.message) })
                    }
                }
            }
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleLogoUpload = (file) => {
        if (!file || !user) return
        setUploadingLogo(true)

        // Show preview immediately
        setBrandLogoPreview(URL.createObjectURL(file))

        const ext = file.name.split('.').pop()
        const filePath = `${user.id}/logo.${ext}`

        // Upload in background (fire and forget)
        supabase.storage
            .from('brand-logos')
            .upload(filePath, file, { upsert: true })
            .then(({ error: uploadError }) => {
                if (uploadError) {
                    console.error('Upload error:', uploadError.message)
                    setError('Erro ao fazer upload da logo.')
                    setBrandLogoPreview(null)
                } else {
                    const { data: { publicUrl } } = supabase.storage
                        .from('brand-logos')
                        .getPublicUrl(filePath)
                    console.log('Logo uploaded, URL:', publicUrl)
                    setBrandLogo(publicUrl)
                }
            })
            .catch((err) => {
                console.error('Upload catch:', err)
                setError('Erro ao fazer upload da logo.')
                setBrandLogoPreview(null)
            })
            .finally(() => {
                setUploadingLogo(false)
            })
    }

    const handleComplete = () => {
        setLoading(true)

        // Salva dados finais no workspace + marca onboarding concluído no profile
        Promise.all([
            supabase
                .from('profiles')
                .update({ onboarding_completed: true, onboarding_step: 8 })
                .eq('id', user.id),

            workspaceId
                ? supabase
                    .from('workspaces')
                    .update({
                        name: workspaceName || 'Meu Workspace',
                        cnpj: workspaceCnpj || null,
                        brand_color: brandColor || '#12BF7D',
                        brand_logo_url: brandLogo || null,
                        company_size: companySize || null,
                        market_sector: marketSector || null,
                        team_size: teamSize || null,
                    })
                    .eq('id', workspaceId)
                : Promise.resolve({ error: null }),
        ]).then(([profileRes, wsRes]) => {
            if (profileRes.error) console.error('Profile complete error:', profileRes.error.message)
            if (wsRes.error) console.error('Workspace complete error:', wsRes.error.message)
        })

        // Atualiza estado local para OnboardingRoute deixar passar
        updateProfile({
            onboarding_completed: true,
            onboarding_step: 8,
        })

        navigate('/', { replace: true })
    }

    /* ── Sidebar Step Indicator ────────────────────────────────────────────── */
    const SidebarStep = ({ s, isLast }) => {
        const isActive = s.internalSteps.includes(step)
        const Icon = s.icon

        // Sub-step progress: which sub-step are we on?
        const subStepIndex = s.subStepCount ? s.internalSteps.indexOf(step) : -1

        return (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                {/* Square Icon Indicator */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isActive
                            ? '2px solid #12BF7D'
                            : '2px solid #E5E7EB',
                        backgroundColor: '#FFFFFF',
                        transition: 'all 0.3s ease',
                    }}>
                        <Icon
                            size={22}
                            color={isActive ? '#12BF7D' : '#A0ABC0'}
                            strokeWidth={2}
                        />
                    </div>
                    {/* Connecting line */}
                    {!isLast && (
                        <div style={{
                            width: '2px',
                            height: '48px',
                            backgroundColor: '#E5E7EB',
                        }} />
                    )}
                </div>

                {/* Text */}
                <div style={{ paddingTop: '4px' }}>
                    <p style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        lineHeight: '1.4',
                        color: isActive ? '#222222' : '#A0ABC0',
                        margin: 0,
                    }}>
                        {s.title}
                    </p>
                    <p style={{
                        fontSize: '12px',
                        fontWeight: 400,
                        lineHeight: '1.4',
                        color: '#A0ABC0',
                        margin: '4px 0 0 0',
                    }}>
                        {s.subtitle}
                    </p>
                </div>
            </div>
        )
    }

    /* ── Shared button styles ─────────────────────────────────────────────── */
    const btnPrimary = {
        backgroundColor: '#272D3B',
        color: '#FFFFFF',
        border: 'none',
        padding: '14px 32px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
    }

    const btnSecondary = {
        backgroundColor: '#FFFFFF',
        color: '#272D3B',
        border: '1px solid #E5E7EB',
        padding: '14px 32px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'background 0.2s',
    }

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        fontSize: '14px',
        fontWeight: 500,
        color: '#222222',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    }

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        fontWeight: 600,
        color: '#222222',
        marginBottom: '8px',
    }

    /* ── Step icon box (content area) ─────────────────────────────────────── */
    const StepIconBox = ({ Icon }) => (
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#E8F8F1',
            border: '1px solid #C6F0DA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
        }}>
            <Icon size={24} color="#12BF7D" strokeWidth={2} />
        </div>
    )

    /* ── Step Content Renderer ─────────────────────────────────────────────── */
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div style={{ maxWidth: '520px' }}>
                        <StepIconBox Icon={Hand} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Boas-vindas ao SaleHunt!
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 8px 0', fontWeight: 500 }}>
                            Prepare-se para transformar suas propostas em negócios fechados!
                        </p>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 32px 0', fontWeight: 400 }}>
                            Estamos aqui para facilitar a sua jornada. Com o SaleHunt, você terá uma plataforma completa para criar, gerenciar e acompanhar suas propostas comerciais de forma simples e estratégica. Para personalizar ainda mais sua experiência, você passará por tutoriais interativos e questionários rápidos que nos ajudarão a entender melhor suas necessidades.
                        </p>
                        <button onClick={handleNext} style={btnPrimary}>
                            Vamos começar!
                        </button>
                    </div>
                )

            case 2:
                return (
                    <div style={{ maxWidth: '600px' }}>
                        <StepIconBox Icon={Video} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Assista aos vídeos e aprenda a usar nossas ferramentas
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 24px 0', fontWeight: 400 }}>
                            Neste vídeo, você aprenderá a criar propostas comerciais no SaleHunt de forma simples e eficaz, maximizando suas chances de conversão.
                        </p>
                        <div style={{
                            width: '100%',
                            aspectRatio: '16/9',
                            backgroundColor: '#F4F6F9',
                            borderRadius: '16px',
                            border: '1px solid #E5E7EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '32px',
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                cursor: 'pointer',
                            }}>
                                <div style={{
                                    width: 0, height: 0,
                                    borderTop: '10px solid transparent',
                                    borderLeft: '16px solid #272D3B',
                                    borderBottom: '10px solid transparent',
                                    marginLeft: '4px',
                                }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleBack} style={btnSecondary}>Voltar</button>
                            <button onClick={handleNext} style={btnPrimary}>Próxima etapa</button>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div style={{ maxWidth: '480px' }}>
                        <StepIconBox Icon={Briefcase} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Configure seu workspace
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 32px 0', fontWeight: 400 }}>
                            Organize seu ambiente de trabalho e personalize sua experiência no SaleHunt.
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={labelStyle}>Defina o nome do workspace*</label>
                            <input
                                type="text"
                                placeholder="Digite aqui..."
                                style={inputStyle}
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#12BF7D'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                            <p style={{ fontSize: '12px', color: '#A0ABC0', margin: '6px 0 0 0' }}>
                                Nós sugerimos usar o nome da sua empresa ou organização.
                            </p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={labelStyle}>Possui CNPJ? (Opcional)</label>
                            <input
                                type="text"
                                placeholder="Digite aqui..."
                                style={inputStyle}
                                value={workspaceCnpj}
                                onChange={(e) => setWorkspaceCnpj(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#12BF7D'}
                                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleBack} style={btnSecondary}>Voltar</button>
                            <button
                                onClick={handleNext}
                                disabled={!workspaceName}
                                style={{ ...btnPrimary, opacity: !workspaceName ? 0.4 : 1 }}
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div style={{ maxWidth: '480px' }}>
                        <StepIconBox Icon={Palette} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Personalize seu espaço
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 32px 0', fontWeight: 400 }}>
                            Adicione sua identidade visual escolhendo cores e logo para seu workspace.
                        </p>

                        {/* Color Picker */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ ...labelStyle, marginBottom: '16px' }}>Qual a cor da sua marca?</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {['#0F172A', '#6366F1', '#8B5CF6', '#2563EB', '#3B82F6', '#60A5FA', '#0891B2', '#10B981', '#E2E8F0', '#D946EF'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setBrandColor(color)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            border: brandColor === color ? '3px solid #222222' : '2px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'transform 0.15s',
                                            transform: brandColor === color ? 'scale(1.15)' : 'scale(1)',
                                            outline: 'none',
                                            padding: 0,
                                        }}
                                    />
                                ))}
                                {customColors.filter(c => !['#0F172A', '#6366F1', '#8B5CF6', '#2563EB', '#3B82F6', '#60A5FA', '#0891B2', '#10B981', '#E2E8F0', '#D946EF'].includes(c.toUpperCase())).map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setBrandColor(color)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            border: brandColor === color ? '3px solid #222222' : '2px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'transform 0.15s',
                                            transform: brandColor === color ? 'scale(1.15)' : 'scale(1)',
                                            outline: 'none',
                                            padding: 0,
                                        }}
                                    />
                                ))}
                                <div style={{ position: 'relative' }} ref={colorPickerPopoverRef}>
                                    <button
                                        onClick={() => setShowColorPicker(!showColorPicker)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #E5E7EB',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 0,
                                        }}
                                    >
                                        <Plus size={18} color="#A0ABC0" />
                                    </button>
                                    {showColorPicker && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '48px',
                                            left: '0',
                                            zIndex: 10,
                                            backgroundColor: '#FFFFFF',
                                            borderRadius: '16px',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                                            padding: '16px',
                                            border: '1px solid #E5E7EB',
                                        }}>
                                            <HexColorPicker color={brandColor} onChange={setBrandColor} />
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginTop: '12px',
                                            }}>
                                                <div style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '6px',
                                                    backgroundColor: brandColor,
                                                    border: '1px solid #E5E7EB',
                                                    flexShrink: 0,
                                                }} />
                                                <input
                                                    type="text"
                                                    value={brandColor.toUpperCase()}
                                                    onChange={(e) => {
                                                        let val = e.target.value
                                                        if (!val.startsWith('#')) val = '#' + val
                                                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setBrandColor(val)
                                                    }}
                                                    style={{
                                                        fontSize: '13px',
                                                        fontWeight: 600,
                                                        color: '#222',
                                                        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        padding: '6px 10px',
                                                        width: '100%',
                                                        outline: 'none',
                                                    }}
                                                    onFocus={(e) => e.target.style.borderColor = '#12BF7D'}
                                                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={async (e) => {
                                                    e.stopPropagation()
                                                    e.preventDefault()
                                                    const normalizedColor = brandColor.toUpperCase()
                                                    try {
                                                        const allPresets = ['#0F172A', '#6366F1', '#8B5CF6', '#2563EB', '#3B82F6', '#60A5FA', '#0891B2', '#10B981', '#E2E8F0', '#D946EF']
                                                        const isPreset = allPresets.includes(normalizedColor)
                                                        const isAlreadyCustom = customColors.map(c => c.toUpperCase()).includes(normalizedColor)
                                                        if (!isPreset && !isAlreadyCustom && normalizedColor.length === 7) {
                                                            // Optimistic update — add to UI immediately
                                                            setCustomColors(prev => [...prev, normalizedColor])
                                                            // Then persist to DB (fire and forget)
                                                            supabase.from('custom_brand_colors').insert({ hex: normalizedColor, created_by: user.id }).then(({ error }) => {
                                                                if (error) console.error('Insert error:', error.message)
                                                            })
                                                        }
                                                    } catch (err) {
                                                        console.error('Save color error:', err)
                                                    }
                                                    setShowColorPicker(false)
                                                }}
                                                style={{
                                                    marginTop: '12px',
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '10px',
                                                    border: 'none',
                                                    backgroundColor: '#12BF7D',
                                                    color: '#FFFFFF',
                                                    fontWeight: 600,
                                                    fontSize: '14px',
                                                    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Salvar cor da marca
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ ...labelStyle, marginBottom: '16px' }}>Defina sua logo</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '16px',
                                    backgroundColor: '#F9FAFB',
                                    border: '1px dashed #D5DCE9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                }}>
                                    {brandLogoPreview ? (
                                        <img
                                            src={brandLogoPreview}
                                            alt="Logo preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <CloudUpload size={28} color="#D5DCE9" />
                                    )}
                                </div>
                                <div>
                                    <button
                                        onClick={() => logoInputRef.current?.click()}
                                        disabled={uploadingLogo}
                                        style={{
                                            ...btnSecondary,
                                            padding: '10px 20px',
                                            fontSize: '13px',
                                            opacity: uploadingLogo ? 0.5 : 1,
                                        }}
                                    >
                                        {uploadingLogo ? 'Enviando...' : 'Fazer upload'}
                                    </button>
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleLogoUpload(file)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleBack} style={btnSecondary}>Voltar</button>
                            <button onClick={handleNext} style={btnPrimary}>Próximo</button>
                        </div>
                    </div>
                )

            case 5:
                return (
                    <div style={{ maxWidth: '480px' }}>
                        <StepIconBox Icon={Users} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Traga sua equipe para a plataforma e gerencie juntos as propostas
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 32px 0', fontWeight: 400 }}>
                            Convide seus colaboradores para a plataforma e comece a colaborar no processo.
                        </p>

                        <div style={{ marginBottom: '12px' }}>
                            <label style={labelStyle}>Colaboradores</label>
                        </div>

                        {invites.map((email, idx) => (
                            <div key={idx} style={{ position: 'relative', marginBottom: '12px' }}>
                                <input
                                    type="email"
                                    placeholder="Digite aqui..."
                                    style={{ ...inputStyle, paddingRight: '44px' }}
                                    value={email}
                                    onChange={(e) => {
                                        const newInvites = [...invites]
                                        newInvites[idx] = e.target.value
                                        setInvites(newInvites)
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#12BF7D'}
                                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                />
                                <Mail size={18} color="#D5DCE9" style={{
                                    position: 'absolute',
                                    right: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                }} />
                            </div>
                        ))}

                        <button
                            onClick={() => setInvites([...invites, ''])}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#12BF7D',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 0',
                                marginBottom: '32px',
                            }}
                        >
                            <Plus size={16} /> Adicionar outro
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleBack} style={btnSecondary}>Voltar</button>
                            <button onClick={handleNext} style={btnPrimary}>Próxima etapa</button>
                        </div>
                    </div>
                )

            case 6:
                return (
                    <div style={{ maxWidth: '480px' }}>
                        <StepIconBox Icon={MessageSquare} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Selecione o tamanho da sua empresa
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 24px 0', fontWeight: 400 }}>
                            Isso ajudará a ajustar recursos e funcionalidades para seu tipo de negócio.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            {[
                                { id: 'micro', label: 'Micro', desc: '(Até 10 funcionários, iniciante)' },
                                { id: 'pequena', label: 'Pequena', desc: '(10 a 50 funcionários, em fase de crescimento)' },
                                { id: 'media', label: 'Média', desc: '(50 a 200 funcionários, organização consolidada)' },
                                { id: 'grande', label: 'Grande', desc: '(Mais de 200 funcionários, ampla estrutura)' }
                            ].map(option => {
                                const selected = companySize === option.label
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setCompanySize(option.label)}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: selected ? '2px solid #12BF7D' : '1px solid #F0F0F0',
                                            backgroundColor: selected ? '#F0FDF9' : '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#222222' }}>{option.label}</span>
                                            <span style={{ fontWeight: 400, fontSize: '14px', color: '#A0ABC0', marginLeft: '6px' }}>{option.desc}</span>
                                        </div>
                                        <div style={{
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            border: selected ? '2px solid #12BF7D' : '2px solid #E5E7EB',
                                            backgroundColor: selected ? '#12BF7D' : '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {selected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleBack} style={btnSecondary}>Voltar</button>
                            <button
                                onClick={handleNext}
                                disabled={!companySize}
                                style={{ ...btnPrimary, opacity: !companySize ? 0.4 : 1 }}
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                )

            case 7: {
                const sectors = [
                    'Marketing e Publicidade', 'Design', 'Saúde', 'Engenharia',
                    'Consultoria Empresarial', 'Educação', 'Arquitetura', 'Finanças',
                    'Jurídico', 'RH e Recrutamento', 'Eventos e Entretenimento', 'E-commerce',
                    'T.I e Suporte', 'Outro'
                ]
                return (
                    <div style={{ maxWidth: '480px' }}>
                        <StepIconBox Icon={MessageSquare} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Escolha o setor de sua empresa
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 24px 0', fontWeight: 400 }}>
                            Selecione a área em que sua empresa atua para uma experiência ainda mais personalizada.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                            {sectors.map(sector => {
                                const selected = marketSector === sector
                                return (
                                    <button
                                        key={sector}
                                        onClick={() => setMarketSector(sector)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '10px',
                                            border: selected ? '1.5px solid #12BF7D' : '1px solid #F0F0F0',
                                            backgroundColor: selected ? '#F0FDF9' : '#FFFFFF',
                                            color: selected ? '#12BF7D' : '#6B7280',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {sector}
                                    </button>
                                )
                            })}
                        </div>

                        {marketSector === 'Outro' && (
                            <div style={{ marginBottom: '32px' }}>
                                <label style={labelStyle}>Não encontrou o que precisa? Digite seu nicho</label>
                                <input
                                    type="text"
                                    placeholder="Digite aqui..."
                                    style={inputStyle}
                                    onChange={(e) => setMarketSector(e.target.value || 'Outro')}
                                    onFocus={(e) => e.target.style.borderColor = '#12BF7D'}
                                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleBack} style={btnSecondary}>Voltar</button>
                            <button
                                onClick={handleNext}
                                disabled={!marketSector}
                                style={{ ...btnPrimary, opacity: !marketSector ? 0.4 : 1 }}
                            >
                                Concluir
                            </button>
                        </div>
                    </div>
                )
            }

            case 8:
                return (
                    <div style={{ maxWidth: '480px' }}>
                        <StepIconBox Icon={MessageSquare} />
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#222222', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                            Selecione a quantidade de colaboradores
                        </h2>
                        <p style={{ fontSize: '14px', color: '#A0ABC0', lineHeight: 1.6, margin: '0 0 24px 0', fontWeight: 400 }}>
                            Escolha quantos colaboradores farão parte do seu workspace.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                            {[
                                { id: '1-10', label: '1 a 10 colaboradores' },
                                { id: '11-50', label: '11 a 50 colaboradores' },
                                { id: '50+', label: 'Mais de 50 colaboradores' }
                            ].map(option => {
                                const selected = teamSize === option.label
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setTeamSize(option.label)}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            border: selected ? '2px solid #12BF7D' : '1px solid #F0F0F0',
                                            backgroundColor: selected ? '#F0FDF9' : '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#222222' }}>{option.label}</span>
                                        <div style={{
                                            width: '22px',
                                            height: '22px',
                                            borderRadius: '50%',
                                            border: selected ? '2px solid #12BF7D' : '2px solid #E5E7EB',
                                            backgroundColor: selected ? '#12BF7D' : '#FFFFFF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {selected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button onClick={handleBack} style={btnSecondary}>Voltar</button>
                            <button
                                onClick={handleComplete}
                                disabled={!teamSize || loading}
                                style={{ ...btnPrimary, opacity: (!teamSize || loading) ? 0.4 : 1 }}
                            >
                                {loading ? 'Finalizando...' : 'Próximo'}
                            </button>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    /* ── Layout ────────────────────────────────────────────────────────────── */
    if (initLoading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '100vh', backgroundColor: '#FFFFFF',
                fontFamily: "'Inter', system-ui, sans-serif",
            }}>
                <div style={{ textAlign: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <circle cx="16" cy="16" r="12" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                        <path d="M16 4 a12 12 0 0 1 12 12" fill="none" stroke="#12BF7D" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    <p style={{ marginTop: 12, fontSize: 14, color: '#A0ABC0' }}>Carregando...</p>
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
            </div>
        )
    }

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#FFFFFF',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}>
            {/* ── Sidebar ──────────────────────────────────────────────────── */}
            <aside style={{
                width: '472px',
                flexShrink: 0,
                borderRight: '1px solid #F4F6F9',
                padding: '80px 56px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '104px',
                backgroundColor: '#FAFBFC',
            }}>
                <div>
                    {/* Logo — backdoor: click to sign out */}
                    <div
                        style={{ marginBottom: '48px', cursor: 'pointer' }}
                        onClick={async () => {
                            try { await supabase.auth.signOut() } catch (_) { /* ignore */ }
                            window.location.href = '/login'
                        }}
                    >
                        <Logo variant="color-light" height={32} />
                    </div>

                    {/* Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {sidebarSteps.map((s, idx) => (
                            <SidebarStep key={s.id} s={s} isLast={idx === sidebarSteps.length - 1} />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{ paddingTop: '24px' }}>
                    <p style={{ fontSize: '10px', color: '#D5DCE9', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                        SALEHUNT — ONBOARDING
                    </p>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────────── */}
            <main style={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 80px',
                position: 'relative',
                overflowY: 'auto',
            }}>
                {/* Close button */}
                <div style={{ position: 'absolute', top: '32px', right: '32px' }}>
                    <button style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        border: '1px solid #E5E7EB',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#A0ABC0',
                    }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ width: '100%', maxWidth: '544px' }}>
                    {/* Sub-step progress bar */}
                    {(() => {
                        const currentSidebar = sidebarSteps.find(s => s.internalSteps.includes(step))
                        if (!currentSidebar?.subStepCount) return null
                        const subIdx = currentSidebar.internalSteps.indexOf(step)
                        return (
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '64px' }}>
                                {Array.from({ length: currentSidebar.subStepCount }).map((_, i) => (
                                    <div key={i} style={{
                                        width: '40px',
                                        height: '4px',
                                        borderRadius: '8px',
                                        backgroundColor: i <= subIdx ? '#12BF7D' : '#E5E7EB',
                                        transition: 'background-color 0.3s ease',
                                    }} />
                                ))}
                            </div>
                        )
                    })()}
                    {renderStepContent()}
                </div>
            </main>
        </div>
    )
}

export default Onboarding
