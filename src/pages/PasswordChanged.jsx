import { Link } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import Logo from '../components/Logo'
import AuthFooter from '../components/AuthFooter'

const PasswordChanged = () => {
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
                    {/* Success Icon */}
                    <div
                        className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6"
                        style={{
                            backgroundColor: 'rgba(5,194,112,0.1)',
                            boxShadow: '0 0 24px rgba(5,194,112,0.15)',
                        }}
                    >
                        <CircleCheck size={28} style={{ color: 'var(--color-success)' }} />
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
                        Senha alterada com<br />sucesso!
                    </h1>

                    <p className="mb-8" style={{ color: 'var(--color-gray-400)', fontSize: 'var(--text-body)' }}>
                        Agora você pode aproveitar todas as funcionalidades do Salehunt!
                    </p>

                    {/* Primary CTA */}
                    <Link to="/login" className="block">
                        <button
                            type="button"
                            className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:opacity-90 cursor-pointer"
                            style={{
                                backgroundColor: 'var(--color-gray-900)',
                                color: 'var(--color-white)',
                            }}
                        >
                            Continuar para o Salehunt
                        </button>
                    </Link>

                    {/* Secondary link */}
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium transition-all hover:opacity-70"
                        style={{ color: 'var(--color-gray-900)' }}
                    >
                        ← Retornar para Login
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 md:px-12 lg:px-24">
                <AuthFooter />
            </div>
        </div>
    )
}

export default PasswordChanged
