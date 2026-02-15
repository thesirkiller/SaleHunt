import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

const AuthCallback = () => {
    const navigate = useNavigate()
    const [status, setStatus] = useState('Processando autenticação...')

    useEffect(() => {
        // This page handles generic auth callbacks (email confirmation, OAuth).
        // Password recovery now redirects directly to /nova-senha.
        // The supabase-js client auto-detects hash tokens on page load.

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('[AuthCallback] event:', event)

                if (event === 'PASSWORD_RECOVERY') {
                    // Fallback: if user still lands here for recovery,
                    // redirect to the reset page.
                    navigate('/nova-senha', { replace: true })
                    return
                }

                if (event === 'SIGNED_IN' && session) {
                    navigate('/', { replace: true })
                    return
                }
            }
        )

        // Timeout fallback
        const timeout = setTimeout(() => {
            setStatus('Tempo esgotado. Redirecionando...')
            navigate('/login', { replace: true })
        }, 6000)

        return () => {
            subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [navigate])

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-white)' }}>
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
                <p style={{ color: 'var(--color-gray-400)' }}>{status}</p>
            </div>
        </div>
    )
}

export default AuthCallback
