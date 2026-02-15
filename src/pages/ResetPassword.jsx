import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import Logo from '../components/Logo'
import AuthFooter from '../components/AuthFooter'
import PasswordInput from '../components/PasswordInput'
import PasswordStrength from '../components/PasswordStrength'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext'

const ResetPassword = () => {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { clearPasswordRecovery } = useAuth()

    const passwordsMatch = password && confirmPassword && password === confirmPassword
    const showMismatch = confirmPassword && !passwordsMatch

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!passwordsMatch) return
        setError('')
        setLoading(true)

        try {
            // Check session from context — don't call getSession() which can abort
            const { data: { session: currentSession } } = await supabase.auth.getSession()

            if (!currentSession) {
                setError('Sessão expirada. Solicite um novo link de recuperação.')
                setLoading(false)
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            })

            if (updateError) {
                setError(updateError.message)
                return
            }

            clearPasswordRecovery()
            navigate('/senha-alterada')
        } catch (err) {
            console.error('[ResetPassword] Error:', err)
            // AbortError from React strict mode — retry once
            if (err?.name === 'AbortError') {
                try {
                    const { error: retryError } = await supabase.auth.updateUser({
                        password: password,
                    })
                    if (retryError) {
                        setError(retryError.message)
                        return
                    }
                    clearPasswordRecovery()
                    navigate('/senha-alterada')
                    return
                } catch (retryErr) {
                    console.error('[ResetPassword] Retry failed:', retryErr)
                }
            }
            setError(err?.message || 'Ocorreu um erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--color-white)' }}
        >
            {/* Logo */}
            <div className="p-8 md:p-12 lg:px-24 lg:pt-12">
                <Logo variant="color-light" height={32} />
            </div>

            {/* Content */}
            <div className="flex-grow flex items-center justify-center px-8">
                <div className="w-full max-w-md text-center">
                    {/* Icon */}
                    <div
                        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
                        style={{
                            backgroundColor: 'rgba(5,194,112,0.1)',
                            boxShadow: '0 0 24px rgba(5,194,112,0.15)',
                        }}
                    >
                        <KeyRound size={24} style={{ color: 'var(--color-success)' }} />
                    </div>

                    <h1
                        className="mb-3"
                        style={{
                            fontSize: 'var(--text-display-2)',
                            fontWeight: 'var(--font-bold)',
                            color: 'var(--color-gray-900)',
                            lineHeight: 'var(--leading)',
                        }}
                    >
                        Definir nova senha
                    </h1>

                    <p className="mb-8" style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-body)' }}>
                        Insira sua nova senha abaixo.
                    </p>

                    <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                        {/* New Password */}
                        <PasswordInput
                            id="new-password"
                            label="Criar senha"
                            placeholder=""
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError('') }}
                        />

                        {/* Strength Indicator */}
                        <PasswordStrength password={password} />

                        {/* Confirm Password */}
                        <PasswordInput
                            id="confirm-password"
                            label="Confirmar senha"
                            placeholder=""
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                            error={showMismatch ? 'As senhas não batem' : ''}
                        />

                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || !passwordsMatch}
                                className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 cursor-pointer disabled:opacity-50"
                                style={{
                                    backgroundColor: 'var(--color-gray-900)',
                                    color: 'var(--color-white)',
                                }}
                            >
                                {loading ? 'Salvando...' : 'Concluir'}
                            </button>
                        </div>

                        {/* Back */}
                        <Link to="/login" className="block">
                            <button
                                type="button"
                                className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:opacity-80 cursor-pointer"
                                style={{
                                    border: '1px solid var(--color-gray-300)',
                                    backgroundColor: 'var(--color-white)',
                                    color: 'var(--color-gray-900)',
                                }}
                            >
                                Voltar
                            </button>
                        </Link>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 md:px-12 lg:px-24">
                <AuthFooter />
            </div>
        </div>
    )
}

export default ResetPassword
