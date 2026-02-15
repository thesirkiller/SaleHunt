import { useNavigate, Link } from 'react-router-dom'
import { Check, ArrowLeft } from 'lucide-react'
import CenteredLayout from '../components/CenteredLayout'

const EmailVerified = () => {
    const navigate = useNavigate()

    return (
        <CenteredLayout>
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                style={{ backgroundColor: '#E7F9F0', color: '#05C270' }}
            >
                <Check size={32} />
            </div>

            <h1 className="text-display-3 font-bold mb-4 text-center text-gray-900">
                Email verificado!
            </h1>
            <p className="text-center mb-12 text-gray-400">
                Agora você pode aproveitar todas as funcionalidades do Salehunt!
            </p>

            <div className="w-full space-y-8">
                <button
                    onClick={() => navigate('/')}
                    className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gray-900 hover:opacity-90 transition-all cursor-pointer"
                >
                    Continuar para o Salehunt
                </button>

                <div className="flex justify-center">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:underline"
                    >
                        <ArrowLeft size={16} />
                        Ir para o Dashboard
                    </Link>
                </div>
            </div>
        </CenteredLayout>
    )
}

export default EmailVerified
