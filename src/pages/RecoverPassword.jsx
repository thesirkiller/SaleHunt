import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import Logo from '../components/Logo'
import AuthFooter from '../components/AuthFooter'
import { supabase } from '../services/supabase'

const RecoverPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/nova-senha`,
            })

            if (resetError) {
                setError(resetError.message)
                return
            }

            setSuccess(true)
        } catch (err) {
            setError('Ocorreu um erro inesperado. Tente novamente.')
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
                        Recuperar senha
                    </h1>

                    <p className="mb-8" style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-body)' }}>
                        Esqueceu sua senha? Insira seu e-mail e<br />
                        redefina agora mesmo.
                    </p>

                    {success ? (
                        <div className="space-y-6">
                            <div
                                className="p-4 rounded-lg text-sm"
                                style={{
                                    backgroundColor: 'rgba(5,194,112,0.1)',
                                    color: 'var(--color-success)',
                                }}
                            >
                                E-mail enviado! Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                            </div>
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
                                    Voltar ao login
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="recover-email"
                                    className="block text-sm font-medium"
                                    style={{ color: 'var(--color-gray-900)' }}
                                >
                                    E-mail
                                </label>
                                <input
                                    id="recover-email"
                                    type="email"
                                    placeholder="Insira seu e-mail"
                                    className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        border: '1px solid var(--color-gray-300)',
                                        color: 'var(--color-gray-900)',
                                        fontSize: 'var(--text-body)',
                                    }}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 text-center">{error}</p>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 cursor-pointer disabled:opacity-50"
                                style={{
                                    backgroundColor: 'var(--color-gray-900)',
                                    color: 'var(--color-white)',
                                }}
                            >
                                {loading ? 'Enviando...' : 'Enviar e-mail'}
                            </button>

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
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 md:px-12 lg:px-24">
                <AuthFooter />
            </div>
        </div>
    )
}

export default RecoverPassword
