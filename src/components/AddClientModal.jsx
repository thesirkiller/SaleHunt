import { useState } from 'react'
import { X, User, Loader2 } from 'lucide-react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

const AddClientModal = ({ isOpen, onClose, onSuccess }) => {
    const { workspace } = useAuth()
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        nome: '', empresa: '', email: '', telefone: '', endereco: '', cidade: ''
    })

    if (!isOpen) return null

    const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

    const handleSubmit = async () => {
        if (!form.nome.trim()) return
        setSaving(true)
        const { error } = await supabase
            .from('clientes')
            .insert([{ ...form, workspace_id: workspace.id }])
        setSaving(false)
        if (!error) {
            setForm({ nome: '', empresa: '', email: '', telefone: '', endereco: '', cidade: '' })
            onSuccess?.()
            onClose()
        }
    }

    const backdropStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 20000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
    }

    const modalStyle = {
        width: '100%',
        maxWidth: 535,
        height: 'auto',
        maxHeight: '90vh',
        borderRadius: '24px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E3E3E3',
        boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
        position: 'relative'
    }

    const headerStyle = {
        padding: '24px 32px',
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    }

    const bodyStyle = {
        padding: '32px',
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
    }

    const footerStyle = {
        padding: '24px 32px',
        borderTop: '1px solid #F3F4F6',
        display: 'flex',
        gap: 16
    }

    const labelStyle = {
        display: 'block',
        fontSize: 14,
        fontWeight: 600,
        color: '#374151',
        marginBottom: 8
    }

    const inputStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: 8,
        border: '1px solid #E5E7EB',
        fontSize: 14,
        color: '#111827',
        outline: 'none',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit'
    }

    const primaryButtonStyle = {
        flex: 1,
        height: 48,
        backgroundColor: '#111827',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer'
    }

    const secondaryButtonStyle = {
        flex: 1,
        height: 48,
        backgroundColor: '#FFFFFF',
        color: '#111827',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer'
    }

    return (
        <div style={backdropStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>Adicionar cliente</h2>
                        <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#9CA3AF' }}>Complete as informações para adicionar um novo cliente</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={bodyStyle}>
                    {/* Profile Photo */}
                    <div>
                        <label style={labelStyle}>Defina uma foto de perfil</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                                <User size={32} />
                            </div>
                            <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: 13, fontWeight: 600, color: '#111827', cursor: 'pointer' }}>
                                Fazer upload
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Nome completo*</label>
                        <input style={inputStyle} placeholder="Digite aqui..." value={form.nome} onChange={set('nome')} />
                    </div>

                    <div>
                        <label style={labelStyle}>Empresa</label>
                        <input style={inputStyle} placeholder="Digite aqui..." value={form.empresa} onChange={set('empresa')} />
                    </div>

                    <div>
                        <label style={labelStyle}>E-mail*</label>
                        <input style={inputStyle} placeholder="Digite aqui..." value={form.email} onChange={set('email')} />
                    </div>

                    <div>
                        <label style={labelStyle}>Telefone*</label>
                        <input style={inputStyle} placeholder="Digite aqui..." value={form.telefone} onChange={set('telefone')} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Endereço*</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.endereco} onChange={set('endereco')} />
                        </div>
                        <div>
                            <label style={labelStyle}>Cidade</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={form.cidade} onChange={set('cidade')} />
                        </div>
                    </div>
                </div>

                <div style={footerStyle}>
                    <button style={secondaryButtonStyle} onClick={onClose}>Cancelar</button>
                    <button style={primaryButtonStyle} onClick={handleSubmit} disabled={saving}>
                        {saving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Criar cliente'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddClientModal
