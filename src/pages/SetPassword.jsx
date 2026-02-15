import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import SplitScreenLayout from '../components/SplitScreenLayout'
import PasswordInput from '../components/PasswordInput'
import PasswordStrength from '../components/PasswordStrength'
import { supabase } from '../services/supabase'

const SetPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const registrationData = location.state || {}

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const testimonial = {
        text: 'O Salehunt mudou minha forma de trabalho. Agora consigo acompanhar quem abriu minhas propostas e ajustar minha abordagem com base em dados reais!',
        author: '— Mariana Sanches',
        role: 'Freelancer de Design'
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem.')
            return
        }

        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.')
            return
        }

        if (!registrationData.email) {
            setError('Dados de cadastro não encontrados. Volte ao passo anterior.')
            return
        }

        setLoading(true)

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: registrationData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: registrationData.firstName || '',
                        last_name: registrationData.lastName || '',
                        phone: registrationData.phone || '',
                    }
                }
            })

            if (signUpError) {
                setError(signUpError.message)
                return
            }

            // Navigate to email verification, passing the email
            navigate('/verificar-email', {
                state: { email: registrationData.email }
            })
        } catch (err) {
            setError('Ocorreu um erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <SplitScreenLayout testimonial={testimonial}>
            <h1 className="text-display-2 font-bold mb-2 text-gray-900">
                Cadastro de usuário
            </h1>
            <p className="mb-8 text-gray-400">
                Vamos te ajudar a criar sua conta. Agora, escolha uma senha!
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <PasswordInput
                    id="password"
                    label="Definir senha"
                    placeholder="Crie uma senha"
                    value={formData.password}
                    onChange={handleChange}
                />

                <PasswordStrength password={formData.password} />

                <PasswordInput
                    id="confirmPassword"
                    label="Confirmar senha"
                    placeholder="Crie uma senha"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/cadastro')}
                        disabled={loading}
                        className="flex-1 py-3 px-4 rounded-lg font-bold border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
                    >
                        Voltar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-gray-900 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Criando conta...' : 'Próximo'}
                    </button>
                </div>
            </form>
        </SplitScreenLayout>
    )
}

export default SetPassword
