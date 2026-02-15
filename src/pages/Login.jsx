import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../components/Logo'
import AuthFooter from '../components/AuthFooter'
import { supabase } from '../services/supabase'

const Login = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                setError(signInError.message)
                return
            }

            // Successful login — navigate to dashboard (or home for now)
            navigate('/', { replace: true })
        } catch (err) {
            setError('Ocorreu um erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: 'var(--color-white)' }}>
            {/* ── Left Column — Form ──────────────────────────────── */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-24">
                <div>
                    <div className="mb-16">
                        <Logo variant="color-light" height={32} />
                    </div>

                    <div className="max-w-md">
                        <h1
                            className="mb-8"
                            style={{
                                fontSize: 'var(--text-display-2)',
                                fontWeight: 'var(--font-bold)',
                                color: 'var(--color-gray-900)',
                                lineHeight: 'var(--leading)',
                            }}
                        >
                            Entrar
                        </h1>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium"
                                    style={{ color: 'var(--color-gray-900)' }}
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Insira seu email"
                                    className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2"
                                    style={{
                                        border: '1px solid var(--color-gray-300)',
                                        color: 'var(--color-gray-900)',
                                        fontSize: 'var(--text-body)',
                                    }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium"
                                    style={{ color: 'var(--color-gray-900)' }}
                                >
                                    Senha
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Insira sua senha"
                                        className="w-full px-4 py-3 rounded-lg pr-12 transition-all focus:outline-none focus:ring-2"
                                        style={{
                                            border: '1px solid var(--color-gray-300)',
                                            color: 'var(--color-gray-900)',
                                            fontSize: 'var(--text-body)',
                                        }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        style={{ color: 'var(--color-gray-400)' }}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded"
                                        style={{ borderColor: 'var(--color-gray-300)' }}
                                    />
                                    <span className="text-sm" style={{ color: 'var(--color-gray-400)' }}>
                                        Lembrar de mim
                                    </span>
                                </label>
                                <Link
                                    to="/recuperar-senha"
                                    className="text-sm font-semibold hover:underline"
                                    style={{ color: '#12BF7D' }}
                                >
                                    Esqueceu a senha?
                                </Link>
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
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>

                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full" style={{ borderTop: '1px solid var(--color-gray-300)' }} />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2" style={{ backgroundColor: 'var(--color-white)', color: 'var(--color-gray-400)' }}>
                                        ou
                                    </span>
                                </div>
                            </div>

                            {/* Google */}
                            <button
                                type="button"
                                className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all font-medium cursor-pointer"
                                style={{
                                    border: '1px solid var(--color-gray-300)',
                                    color: 'var(--color-gray-900)',
                                    backgroundColor: 'var(--color-white)',
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Entre com o Google
                            </button>

                            <p className="text-center text-sm mt-8" style={{ color: 'var(--color-gray-400)' }}>
                                Ainda não possui uma conta?{' '}
                                <Link
                                    to="/cadastro"
                                    className="font-bold hover:underline"
                                    style={{ color: '#12BF7D' }}
                                >
                                    Cadastre-se agora
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                <AuthFooter />
            </div>

            {/* ── Right Column — Testimonial + Mockup ────────────── */}
            <div
                className="hidden md:flex w-1/2 flex-col p-8 md:p-12 lg:p-24 relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-gray-100)' }}
            >
                <div className="max-w-xl z-10">
                    <p
                        className="text-xl leading-relaxed mb-8"
                        style={{ color: 'var(--color-gray-400)' }}
                    >
                        Depois que comecei a usar o Salehunt, parei de perder tempo criando propostas em
                        PDF e agora posso medir minha taxa de conversão!
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold" style={{ color: 'var(--color-gray-900)' }}>
                                — Lukas Lemos
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-gray-400)' }}>
                                Fundador, Harpia Digital
                            </p>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-xl" style={{ color: 'var(--color-success)' }}>★</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* App Mockup */}
                <div className="mt-12 relative flex-grow">
                    <div
                        className="absolute top-0 left-0 w-full h-full rounded-tl-2xl shadow-2xl overflow-hidden transform translate-y-12 translate-x-12"
                        style={{
                            backgroundColor: 'var(--color-white)',
                            border: '1px solid var(--color-gray-300)',
                        }}
                    >
                        {/* Browser Chrome */}
                        <div
                            className="h-12 flex items-center px-4 gap-2"
                            style={{ borderBottom: '1px solid var(--color-gray-300)' }}
                        >
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
                            </div>
                            <div
                                className="mx-auto w-64 h-6 rounded-md text-xs flex items-center justify-center"
                                style={{
                                    backgroundColor: 'var(--color-gray-100)',
                                    border: '1px solid var(--color-gray-300)',
                                    color: 'var(--color-gray-400)',
                                }}
                            >
                                salehunt.com
                            </div>
                        </div>

                        {/* Mockup Content */}
                        <div className="flex h-full">
                            <div
                                className="w-16 flex flex-col items-center py-4 gap-4"
                                style={{ borderRight: '1px solid var(--color-gray-300)' }}
                            >
                                <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--color-gray-900)' }} />
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-6 h-6 rounded" style={{ backgroundColor: 'var(--color-gray-100)' }} />
                                ))}
                            </div>
                            <div className="flex-grow p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-48 rounded" style={{ backgroundColor: 'var(--color-gray-300)' }} />
                                    <div className="h-8 w-24 rounded" style={{ backgroundColor: 'rgba(67,126,247,0.1)' }} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="h-4 w-32 rounded" style={{ backgroundColor: 'var(--color-gray-300)' }} />
                                        <div className="h-10 w-full rounded" style={{ backgroundColor: 'var(--color-gray-100)', border: '1px solid var(--color-gray-300)' }} />
                                        <div className="h-4 w-32 rounded" style={{ backgroundColor: 'var(--color-gray-300)' }} />
                                        <div className="h-10 w-full rounded" style={{ backgroundColor: 'var(--color-gray-100)', border: '1px solid var(--color-gray-300)' }} />
                                    </div>
                                    <div
                                        className="rounded-lg flex items-center justify-center"
                                        style={{
                                            backgroundColor: 'var(--color-gray-100)',
                                            border: '1px solid var(--color-gray-300)',
                                        }}
                                    >
                                        <div className="text-4xl" style={{ color: 'var(--color-gray-300)' }}>Image</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative glow */}
                <div
                    className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl -mr-48 -mb-48"
                    style={{ backgroundColor: 'rgba(67,126,247,0.05)' }}
                />
            </div>
        </div>
    )
}

export default Login
