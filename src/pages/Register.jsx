import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SplitScreenLayout from '../components/SplitScreenLayout'

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })

    const testimonial = {
        text: 'O Salehunt mudou minha forma de trabalho. Agora consigo acompanhar quem abriu minhas propostas e ajustar minha abordagem com base em dados reais!',
        author: '— Mariana Sanches',
        role: 'Freelancer de Design'
    }

    const maskPhone = (value) => {
        if (!value) return ''
        const cleaned = value.replace(/\D/g, '')
        const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/)
        if (!match) return cleaned

        let masked = ''
        if (match[1]) masked += `(${match[1]}`
        if (match[1].length === 2) masked += ') '
        if (match[2]) masked += match[2]
        if (match[2].length === 5) masked += '-'
        if (match[3]) masked += match[3]

        return masked
    }

    const handleChange = (e) => {
        const { id, value } = e.target
        if (id === 'phone') {
            setFormData(prev => ({ ...prev, [id]: maskPhone(value) }))
        } else {
            setFormData(prev => ({ ...prev, [id]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/definir-senha', { state: { ...formData } })
    }

    return (
        <SplitScreenLayout testimonial={testimonial}>
            <h1 className="text-display-2 font-bold mb-2 text-gray-900">
                Cadastro de usuário
            </h1>
            <p className="mb-8 text-gray-400">
                Crie sua conta no Salehunt e comece a vender mais hoje mesmo!
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                            Nome
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            placeholder="Seu nome"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                            Sobrenome
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            placeholder="Seu sobrenome"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Seu melhor email"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                        Telefone
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-900"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={15}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="flex-1 py-3 px-4 rounded-lg font-bold border border-gray-300 text-gray-900 bg-white hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Voltar
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-gray-900 hover:opacity-90 transition-all cursor-pointer"
                    >
                        Próximo
                    </button>
                </div>
            </form>
        </SplitScreenLayout>
    )
}

export default Register
