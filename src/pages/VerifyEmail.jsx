import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail } from 'lucide-react'
import CenteredLayout from '../components/CenteredLayout'
import { supabase } from '../services/supabase'

const VerifyEmail = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const userEmail = location.state?.email || ''

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resendCooldown, setResendCooldown] = useState(0)

    // Redirect if no email in state
    useEffect(() => {
        if (!userEmail) {
            navigate('/cadastro', { replace: true })
        }
    }, [userEmail, navigate])

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000)
        return () => clearTimeout(timer)
    }, [resendCooldown])

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        setError('')

        if (value && index < 5) {
            inputRefs[index + 1].current.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pastedData.length === 0) return

        const newOtp = [...otp]
        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newOtp[i] = pastedData[i]
        }
        setOtp(newOtp)
        setError('')

        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs[nextIndex].current.focus()
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        setError('')

        const otpString = otp.join('')
        if (otpString.length !== 6) {
            setError('Digite o código completo de 6 dígitos.')
            return
        }

        setLoading(true)

        try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email: userEmail,
                token: otpString,
                type: 'signup',
            })

            if (verifyError) {
                setError(verifyError.message)
                return
            }

            navigate('/email-verificado')
        } catch (err) {
            setError('Ocorreu um erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (resendCooldown > 0) return
        setError('')

        try {
            const { error: resendError } = await supabase.auth.resend({
                type: 'signup',
                email: userEmail,
            })

            if (resendError) {
                setError(resendError.message)
                return
            }

            setResendCooldown(60)
        } catch (err) {
            setError('Não foi possível reenviar o código.')
        }
    }

    return (
        <CenteredLayout>
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-8"
                style={{ backgroundColor: '#E7F9F0', color: '#05C270' }}
            >
                <Mail size={32} />
            </div>

            <h1 className="text-display-3 font-bold mb-4 text-center text-gray-900">
                Verifique seu email
            </h1>
            <p className="text-center mb-12 text-gray-400">
                Nós enviamos um código de verificação no email <br />
                <span className="font-medium text-gray-600">{userEmail}</span>
            </p>

            <form className="w-full space-y-8" onSubmit={handleVerify}>
                <div className="flex justify-center gap-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            className="w-14 h-18 text-center text-2xl font-bold rounded-xl focus:outline-none transition-all"
                            style={{
                                border: `2px solid ${digit ? '#05C270' : '#D5DCE9'}`,
                                backgroundColor: '#FFFFFF',
                                color: digit ? '#05C270' : '#222222',
                                height: '72px',
                            }}
                        />
                    ))}
                </div>

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <p className="text-center text-sm text-gray-400">
                    Não recebeu o código?{' '}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendCooldown > 0}
                        className="font-bold hover:underline disabled:opacity-50"
                        style={{ color: '#05C270' }}
                    >
                        {resendCooldown > 0 ? `Reenviar (${resendCooldown}s)` : 'Reenviar'}
                    </button>
                </p>

                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-bold text-lg text-white bg-gray-900 hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Verificando...' : 'Verificar email'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/definir-senha')}
                        className="w-full py-4 rounded-xl font-bold border border-gray-200 text-gray-900 bg-white hover:bg-gray-50 transition-all cursor-pointer"
                    >
                        Voltar
                    </button>
                </div>
            </form>
        </CenteredLayout>
    )
}

export default VerifyEmail
