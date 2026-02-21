import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, sessionReady } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                return null
            }
            setProfile(data)
            return data
        } catch (err) {
            console.error('Unexpected error fetching profile:', err)
            return null
        }
    }

    useEffect(() => {
        // Use the pre-initialized sessionReady promise from supabase.js
        // This avoids React 18 StrictMode double-mount issues with hash token detection
        sessionReady.then(({ data: { session } }) => {
            setSession(session)
            const currentUser = session?.user ?? null
            setUser(currentUser)

            if (currentUser) {
                fetchProfile(currentUser.id).finally(() => setLoading(false))
            } else {
                setLoading(false)
            }
        }).catch((err) => {
            // AbortError is harmless — React 18 strict mode double-mounts
            if (err?.name !== 'AbortError') {
                console.error('Error getting session:', err)
            }
            setLoading(false)
        })

        // Safety: never let loading hang more than 3 seconds
        const safetyTimeout = setTimeout(() => setLoading(false), 3000)

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[AuthContext] event:', event)

                // Detect password recovery event
                if (event === 'PASSWORD_RECOVERY') {
                    console.log('[AuthContext] PASSWORD_RECOVERY detected!')
                    setIsPasswordRecovery(true)
                }

                setSession(session)
                const currentUser = session?.user ?? null
                setUser(currentUser)
                console.log('[Auth]', currentUser ? `✅ Logado como ${currentUser.email}` : '❌ Deslogado')

                if (currentUser) {
                    await fetchProfile(currentUser.id)
                } else {
                    setProfile(null)
                }
                setLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
            clearTimeout(safetyTimeout)
        }
    }, [])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setProfile(null)
        setIsPasswordRecovery(false)
    }

    const clearPasswordRecovery = () => setIsPasswordRecovery(false)

    const value = {
        user,
        session,
        profile,
        loading,
        isPasswordRecovery,
        clearPasswordRecovery,
        signOut,
        refreshProfile: () => user && fetchProfile(user.id),
        updateProfile: (updates) => setProfile(prev => prev ? { ...prev, ...updates } : prev),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
