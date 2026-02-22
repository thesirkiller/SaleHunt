import { useState, useEffect } from 'react'
import { X, ChevronRight, Plus, User, Loader2 } from 'lucide-react'
import AddClientModal from './AddClientModal'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

const NewProposalModal = ({ isOpen, onClose, onSuccess }) => {
    const { workspace, user } = useAuth()

    // ── UI state ──────────────────────────────────────────────────────
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false)
    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    // ── Data ──────────────────────────────────────────────────────────
    const [clientes, setClientes] = useState([])
    const [modelos, setModelos] = useState([])
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedModel, setSelectedModel] = useState(null)

    // ── Form ─────────────────────────────────────────────────────────
    const [nome, setNome] = useState('')
    const [descricao, setDescricao] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [tags, setTags] = useState([])

    // ── Load data from Supabase ───────────────────────────────────────
    const loadData = async () => {
        if (!workspace?.id) return
        const [{ data: cls }, { data: mods }] = await Promise.all([
            supabase.from('clientes').select('id, nome, empresa, foto_url').eq('workspace_id', workspace.id).order('nome'),
            supabase.from('modelos_proposta').select('id, nome').eq('workspace_id', workspace.id).order('nome'),
        ])
        if (cls) setClientes(cls)
        if (mods) setModelos(mods)
    }

    useEffect(() => {
        if (isOpen) loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, workspace?.id])

    // ── Tags ─────────────────────────────────────────────────────────
    const generateColor = () => {
        const hue = Math.floor(Math.random() * 360)
        return `hsl(${hue}, 70%, 45%)`
    }

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            setTags(t => [...t, { texto: tagInput.trim(), cor_hex: generateColor() }])
            setTagInput('')
        }
    }

    const removeTag = (idx) => setTags(t => t.filter((_, i) => i !== idx))

    // ── Save ─────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!nome.trim() || !workspace?.id) return
        setSaving(true)

        // 1. Insert proposta
        const payload = {
            workspace_id: workspace.id,
            responsavel_id: user?.id ?? null,
            modelo_id: selectedModel?.id ?? null,
            nome: nome.trim(),
            descricao: descricao.trim() || null,
            status: 'Rascunho',
        }
        const { data: proposta, error } = await supabase
            .from('propostas')
            .insert([payload])
            .select()
            .single()

        if (error || !proposta) { setSaving(false); return }

        // 2. Link client
        if (selectedClient) {
            await supabase.from('proposta_clientes').insert([{
                proposta_id: proposta.id,
                cliente_id: selectedClient.id,
            }])
        }

        // 3. Insert tags
        if (tags.length > 0) {
            await supabase.from('tags').insert(
                tags.map(t => ({ proposta_id: proposta.id, texto: t.texto, cor_hex: t.cor_hex }))
            )
        }

        setSaving(false)
        // Reset form
        setNome(''); setDescricao(''); setTags([])
        setSelectedClient(null); setSelectedModel(null)
        onSuccess?.()
        onClose()
    }

    if (!isOpen) return null

    // ── Styles ───────────────────────────────────────────────────────
    const backdropStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '24px'
    }

    const modalStyle = {
        width: '100%', maxWidth: 535, height: 'auto', maxHeight: '90vh',
        borderRadius: '24px', backgroundColor: '#FFFFFF',
        border: '1px solid #E3E3E3',
        boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', sans-serif", overflow: 'hidden', position: 'relative'
    }

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: 8,
        border: '1px solid #E5E7EB', fontSize: 14, color: '#111827',
        outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit',
        boxSizing: 'border-box'
    }

    const selectButtonStyle = {
        ...inputStyle, backgroundColor: '#FFFFFF',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', textAlign: 'left'
    }

    const dropdownStyle = {
        marginTop: 8, backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB',
        borderRadius: 12, padding: 8, display: 'flex', flexDirection: 'column',
        gap: 4, boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.05)'
    }

    return (
        <>
            <div style={backdropStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
                <div style={modalStyle}>
                    {/* Header */}
                    <div style={{ padding: '24px 32px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827' }}>Nova proposta</h2>
                            <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#9CA3AF' }}>Crie uma proposta de forma fácil</p>
                        </div>
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4 }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Nome */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Nome da sua proposta*</label>
                            <input style={inputStyle} placeholder="Digite aqui..." value={nome} onChange={e => setNome(e.target.value)} />
                        </div>

                        {/* Descrição */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Descreva sua proposta</label>
                            <textarea
                                style={{ ...inputStyle, height: 120, resize: 'none' }}
                                placeholder="Digite aqui..."
                                value={descricao}
                                onChange={e => setDescricao(e.target.value)}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Adicione tags</label>
                            <input
                                style={inputStyle}
                                placeholder="Pressione Enter para adicionar..."
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                {tags.map((tag, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        padding: '4px 10px', borderRadius: 99,
                                        backgroundColor: tag.cor_hex + '22',
                                        color: tag.cor_hex,
                                        fontSize: 13, fontWeight: 600
                                    }}>
                                        {tag.texto}
                                        <X size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeTag(i)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Modelo */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Selecionar modelo</label>
                            <button style={selectButtonStyle} onClick={() => setIsModelDropdownOpen(o => !o)}>
                                <span style={{ color: selectedModel ? '#111827' : '#9CA3AF' }}>
                                    {selectedModel ? selectedModel.nome : 'Selecionar modelo'}
                                </span>
                                <ChevronRight size={18} color="#9CA3AF" style={{ transform: isModelDropdownOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>
                            {isModelDropdownOpen && (
                                <div style={{ ...dropdownStyle, maxHeight: 180, overflowY: 'auto' }}>
                                    {modelos.length === 0
                                        ? <div style={{ padding: '12px 16px', fontSize: 13, color: '#9CA3AF' }}>Nenhum modelo cadastrado.</div>
                                        : modelos.map(m => (
                                            <div key={m.id} style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#111827', cursor: 'pointer', borderRadius: 8, backgroundColor: selectedModel?.id === m.id ? '#F9FAFB' : 'transparent' }}
                                                onClick={() => { setSelectedModel(m); setIsModelDropdownOpen(false) }}>
                                                {m.nome}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>

                        {/* Cliente */}
                        <div>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Cliente</label>
                            <button style={selectButtonStyle} onClick={() => setIsClientDropdownOpen(o => !o)}>
                                {selectedClient ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <img src={selectedClient.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedClient.nome)}&background=random`}
                                            alt={selectedClient.nome} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                                        <span style={{ color: '#111827' }}>{selectedClient.nome}</span>
                                    </div>
                                ) : (
                                    <span style={{ color: '#9CA3AF' }}>Selecionar cliente</span>
                                )}
                                <ChevronRight size={18} color="#9CA3AF" style={{ transform: isClientDropdownOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                            </button>

                            {isClientDropdownOpen && (
                                <div style={dropdownStyle}>
                                    {clientes.map(c => (
                                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer', backgroundColor: selectedClient?.id === c.id ? '#F3F4F6' : 'transparent' }}
                                            onClick={() => { setSelectedClient(c); setIsClientDropdownOpen(false) }}>
                                            <img src={c.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.nome)}&background=random`}
                                                alt={c.nome} style={{ width: 24, height: 24, borderRadius: '50%' }} />
                                            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{c.nome}</span>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => { setIsClientDropdownOpen(false); setIsAddClientModalOpen(true) }}
                                        style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', backgroundColor: '#111827', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                                        <Plus size={16} /> Adicionar cliente
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '24px 32px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 16 }}>
                        <button style={{ flex: 1, height: 48, backgroundColor: '#FFFFFF', color: '#111827', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }} onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            style={{ flex: 1, height: 48, backgroundColor: '#111827', color: '#FFFFFF', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Salvando...</> : 'Criar proposta'}
                        </button>
                    </div>
                </div>
            </div>

            <AddClientModal
                isOpen={isAddClientModalOpen}
                onClose={() => setIsAddClientModalOpen(false)}
                onSuccess={() => { loadData() }}
            />
        </>
    )
}

export default NewProposalModal
