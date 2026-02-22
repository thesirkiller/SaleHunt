import { useState, useRef } from 'react'
import { X, User, Loader2, Upload } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

/**
 * ClienteSidePanelModal
 *
 * Slide-in side panel (direita da tela) para cadastrar clientes.
 * Mantém o AddClientModal original para uso no NewProposalModal.
 *
 * Props:
 *  isOpen   {boolean}
 *  onClose  {() => void}
 *  onSuccess {() => void}  — chamado após salvar com sucesso
 */
const ClienteSidePanelModal = ({ isOpen, onClose, onSuccess }) => {
    const { workspace } = useAuth()
    const fileInputRef = useRef(null)

    const [saving, setSaving] = useState(false)
    const [photoPreview, setPhotoPreview] = useState(null)
    const [photoFile, setPhotoFile] = useState(null)

    const emptyForm = {
        nome: '', sobrenome: '', cpf_cnpj: '',
        empresa: '', email: '', telefone: '',
        cep: '', rua_avenida: '', numero: '',
        complemento: '', estado: '', bairro: '',
    }
    const [form, setForm] = useState(emptyForm)

    if (!isOpen) return null

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setPhotoFile(file)
        setPhotoPreview(URL.createObjectURL(file))
    }

    const reset = () => {
        setForm(emptyForm)
        setPhotoPreview(null)
        setPhotoFile(null)
    }

    const handleSave = async () => {
        if (!form.nome.trim()) return
        setSaving(true)

        let foto_url = null

        // Upload da foto se houver
        if (photoFile && workspace?.id) {
            const ext = photoFile.name.split('.').pop()
            const path = `clientes/${workspace.id}/${Date.now()}.${ext}`
            const { data: uploadData } = await supabase.storage
                .from('avatars')
                .upload(path, photoFile, { upsert: true })

            if (uploadData) {
                const { data: urlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(uploadData.path)
                foto_url = urlData?.publicUrl ?? null
            }
        }

        const { error } = await supabase
            .from('clientes')
            .insert([{ ...form, foto_url, workspace_id: workspace?.id }])

        setSaving(false)
        if (!error) {
            reset()
            onSuccess?.()
            onClose()
        }
    }

    /* ─── Styles ───────────────────────────────────────────────────────────── */

    const backdropStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 10000,
    }

    const panelStyle = {
        position: 'fixed',
        top: 0,
        right: 0,
        width: 482,
        height: '100vh',
        backgroundColor: '#FFFFFF',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
    }

    const labelStyle = {
        display: 'block', fontSize: 13, fontWeight: 600,
        color: '#374151', marginBottom: 6,
    }

    const inputStyle = {
        width: '100%', padding: '11px 14px',
        border: '1px solid #E5E7EB', borderRadius: 8,
        fontSize: 14, color: '#111827', outline: 'none',
        fontFamily: 'inherit', boxSizing: 'border-box',
        backgroundColor: '#FAFAFA',
    }

    const grid2 = {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14
    }

    return (
        <>
            {/* Backdrop */}
            <div style={backdropStyle} onClick={onClose} />

            {/* Side Panel */}
            <div style={panelStyle}>
                {/* Header */}
                <div style={{
                    padding: '28px 32px 20px',
                    borderBottom: '1px solid #F1F5F9',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>
                                Adicionar cliente
                            </h2>
                            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#9CA3AF' }}>
                                Conte sobre você para seu cliente
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, marginTop: -2 }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Foto de Perfil */}
                    <div>
                        <label style={{ ...labelStyle, marginBottom: 12 }}>Defina uma foto de perfil</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: '50%',
                                backgroundColor: '#F3F4F6',
                                border: '1px solid #E5E7EB',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', flexShrink: 0,
                            }}>
                                {photoPreview
                                    ? <img src={photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    : <User size={28} color="#D1D5DB" />
                                }
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 20px', backgroundColor: '#FFFFFF',
                                    border: '1px solid #E5E7EB', borderRadius: 8,
                                    fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer',
                                }}
                            >
                                <Upload size={16} /> Fazer upload
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handlePhotoChange}
                            />
                        </div>
                    </div>

                    {/* Nome / Sobrenome */}
                    <div style={grid2}>
                        <div>
                            <label style={labelStyle}>Nome*</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.nome} onChange={set('nome')} />
                        </div>
                        <div>
                            <label style={labelStyle}>Sobrenome*</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.sobrenome} onChange={set('sobrenome')} />
                        </div>
                    </div>

                    {/* CPF/CNPJ */}
                    <div>
                        <label style={labelStyle}>CPF/CNPJ*</label>
                        <input style={inputStyle} placeholder="Digite aqui..." value={form.cpf_cnpj} onChange={set('cpf_cnpj')} />
                    </div>

                    {/* Empresa */}
                    <div>
                        <label style={labelStyle}>Empresa</label>
                        <input style={inputStyle} placeholder="Digite aqui..." value={form.empresa} onChange={set('empresa')} />
                    </div>

                    {/* E-mail */}
                    <div>
                        <label style={labelStyle}>E-mail*</label>
                        <input style={inputStyle} placeholder="Digite aqui..." type="email" value={form.email} onChange={set('email')} />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label style={labelStyle}>Telefone*</label>
                        <input style={inputStyle} placeholder="Digite aqui..." value={form.telefone} onChange={set('telefone')} />
                    </div>

                    {/* CEP / Rua */}
                    <div style={grid2}>
                        <div>
                            <label style={labelStyle}>CEP</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.cep} onChange={set('cep')} />
                        </div>
                        <div>
                            <label style={labelStyle}>Rua/avenida</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.rua_avenida} onChange={set('rua_avenida')} />
                        </div>
                    </div>

                    {/* Complemento / Número */}
                    <div style={grid2}>
                        <div>
                            <label style={labelStyle}>Complemento</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.complemento} onChange={set('complemento')} />
                        </div>
                        <div>
                            <label style={labelStyle}>Número</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.numero} onChange={set('numero')} />
                        </div>
                    </div>

                    {/* Estado / Bairro */}
                    <div style={grid2}>
                        <div>
                            <label style={labelStyle}>Estado</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.estado} onChange={set('estado')} />
                        </div>
                        <div>
                            <label style={labelStyle}>Bairro</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.bairro} onChange={set('bairro')} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 32px',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex', gap: 12, flexShrink: 0,
                }}>
                    <button
                        onClick={() => { reset(); onClose() }}
                        style={{
                            flex: 1, height: 48, backgroundColor: '#FFFFFF',
                            color: '#374151', border: '1px solid #E5E7EB',
                            borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            flex: 1, height: 48, backgroundColor: '#111827',
                            color: '#FFFFFF', border: 'none',
                            borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            opacity: saving ? 0.7 : 1,
                        }}
                    >
                        {saving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : 'Salvar'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default ClienteSidePanelModal
