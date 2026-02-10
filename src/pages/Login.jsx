import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Column - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 lg:p-24">
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-1 mb-16">
                        <span className="text-[#00A78E] text-2xl font-bold">$aleHunt</span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-4xl font-bold text-[#0F172A] mb-8">Entrar</h1>

                        <form className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="Insira seu email"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A78E]/20 focus:border-[#00A78E] transition-all"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Senha */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Senha</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Insira sua senha"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A78E]/20 focus:border-[#00A78E] transition-all pr-12"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Extra options */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer transition-all hover:opacity-80">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-[#00A78E] focus:ring-[#00A78E]"
                                    />
                                    <span className="text-sm text-gray-500">Lembrar de mim</span>
                                </label>
                                <a href="#" className="text-sm font-semibold text-[#00A78E] hover:underline">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#0F172A] text-white rounded-lg font-bold text-lg hover:bg-[#1E293B] transition-all"
                            >
                                Entrar
                            </button>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">ou</span>
                                </div>
                            </div>

                            {/* Google Button */}
                            <button
                                type="button"
                                className="w-full py-3 px-4 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-medium text-gray-700"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Entre com o Google
                            </button>

                            <p className="text-center text-sm text-gray-600 mt-8">
                                Ainda não possui uma conta?{' '}
                                <a href="#" className="text-[#00A78E] font-bold hover:underline">
                                    Cadastre-se agora
                                </a>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Footer Left */}
                <div className="flex justify-between text-xs text-gray-400 mt-8">
                    <span>© SaleHunt 2025</span>
                    <div className="flex items-center gap-1">
                        <Mail size={12} />
                        <span>ajuda@salehunt.com</span>
                    </div>
                </div>
            </div>

            {/* Right Column - Media/Testimonial */}
            <div className="hidden md:flex w-1/2 bg-[#F8FAFC] flex-col p-8 md:p-12 lg:p-24 relative overflow-hidden">
                <div className="max-w-xl z-10">
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        Depois que comecei a usar o SaleHunt, parei de perder tempo criando propostas em PDF e agora posso medir minha taxa de conversão!
                    </p>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-[#0F172A]">— Lukas Lemos</p>
                            <p className="text-sm text-gray-500">Fundador, Harpia Digital</p>
                        </div>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-[#00A78E] text-xl">★</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* App Mockup Placeholder */}
                <div className="mt-12 relative flex-grow">
                    <div className="absolute top-0 left-0 w-full h-full bg-white rounded-tl-2xl shadow-2xl overflow-hidden border border-gray-100 transform translate-y-12 translate-x-12">
                        {/* Header Mockup */}
                        <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="mx-auto w-64 h-6 bg-gray-50 rounded-md border border-gray-100 text-[10px] flex items-center justify-center text-gray-400">
                                salehunt.com
                            </div>
                        </div>

                        {/* Sidebar Mockup */}
                        <div className="flex h-full">
                            <div className="w-16 border-r border-gray-100 flex flex-col items-center py-4 gap-4">
                                <div className="w-8 h-8 rounded-lg bg-[#0F172A]"></div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-6 h-6 rounded bg-gray-50"></div>
                                ))}
                            </div>

                            {/* Content Mockup */}
                            <div className="flex-grow p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-48 bg-gray-100 rounded"></div>
                                    <div className="h-8 w-24 bg-[#00A78E]/10 rounded"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="h-4 w-32 bg-gray-100 rounded"></div>
                                        <div className="h-10 w-full bg-gray-50 rounded border border-gray-100"></div>
                                        <div className="h-4 w-32 bg-gray-100 rounded"></div>
                                        <div className="h-10 w-full bg-gray-50 rounded border border-gray-100"></div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center">
                                        <div className="text-gray-300 text-4xl">Image</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-4 w-40 bg-gray-100 rounded"></div>
                                    <div className="grid grid-cols-6 gap-2">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="h-10 rounded bg-gray-200"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00A78E]/5 rounded-full blur-3xl -mr-48 -mb-48"></div>
            </div>
        </div>
    )
}

export default Login
