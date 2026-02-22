import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase, sessionReady } from '../services/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [profile, setProfile] = useState(null)
    const [workspace, setWorkspace] = useState(null)
    const [workspaces, setWorkspaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const fetchingRef = useRef(null)

    const fetchProfile = async (userId) => {
        if (fetchingRef.current === userId) return
        fetchingRef.current = userId
        try {
            // 1. Busca perfil (tabela users)
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle()

            if (userError) {
                console.error('[fetchProfile] Erro em "users":', userError)
            } else {
                setProfile(userData)
            }

            // 2. Busca workspaces do usuário
            const { data: wsData, error: wsError } = await supabase
                .from('workspaces')
                .select('*')
                .eq('owner_id', userId)
                .order('created_at', { ascending: true })

            if (wsError) {
                console.error('[fetchProfile] Erro em "workspaces":', wsError)
            } else {
                setWorkspaces(wsData || [])
                setWorkspace(wsData?.[0] || null)
            }

            return userData
        } catch (err) {
            console.error('[fetchProfile] Erro fatal inesperado:', err)
            return null
        } finally {
            fetchingRef.current = null
        }
    }

    useEffect(() => {
        // 1. Monitora mudanças de autenticação (simplificado)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)

                // Reset states on sign out
                if (event === 'SIGNED_OUT') {
                    setProfile(null)
                    setWorkspace(null)
                    setWorkspaces([])
                    setIsPasswordRecovery(false)
                    setIsInitialized(true)
                }

                if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true)
            }
        )

        // 2. Tenta recuperar sessão inicial se o evento não disparar
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session)
                setUser(session.user)
            } else {
                setIsInitialized(true)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    // 3. Efeito dedicado para carregar dados do usuário
    useEffect(() => {
        const load = async () => {
            if (user && !profile) {
                setLoading(true)
                try {
                    await fetchProfile(user.id)
                } finally {
                    setLoading(false)
                    setIsInitialized(true)
                }
            } else if (!user) {
                setLoading(false)
            }
        }
        load()
    }, [user])

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
        workspace,
        workspaces,
        loading,
        isInitialized,
        isPasswordRecovery,
        clearPasswordRecovery,
        signOut,
        refreshProfile: () => user && fetchProfile(user.id),
        updateProfile: (updates) => setProfile(prev => prev ? { ...prev, ...updates } : prev),
        updateWorkspace: (updates) => setWorkspace(prev => prev ? { ...prev, ...updates } : prev),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
