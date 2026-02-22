import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import Login from './pages/Login'
import RecoverPassword from './pages/RecoverPassword'
import ResetPassword from './pages/ResetPassword'
import PasswordChanged from './pages/PasswordChanged'
import Register from './pages/Register'
import SetPassword from './pages/SetPassword'
import VerifyEmail from './pages/VerifyEmail'
import EmailVerified from './pages/EmailVerified'
import AuthCallback from './pages/AuthCallback'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import WorkspaceSetup from './pages/WorkspaceSetup'

// Rota protegida: exige autenticação + onboarding concluído
const ProtectedRoute = ({ children }) => {
  const { user, profile, loading, isInitialized, isPasswordRecovery } = useAuth()

  if (loading || !isInitialized) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (isPasswordRecovery) return <Navigate to="/nova-senha" replace />

  // Se logado mas sem perfil carregado no context, espera um pouco mais (evita flash pro onboarding)
  if (user && !profile) {
    return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>
  }

  // SE COMPLETOU: Prossegue. SE NÃO: Vai pro onboarding.
  const isComplete = profile?.onboarding_completed === true || profile?.onboarding_step === 8

  if (!isComplete) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

const OnboardingRoute = ({ children }) => {
  const { user, profile, loading, isInitialized, isPasswordRecovery } = useAuth()

  if (loading || !isInitialized) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (isPasswordRecovery) return <Navigate to="/nova-senha" replace />

  // SE COMPLETOU: bloqueia acesso ao onboarding e joga pro dashboard
  const isComplete = profile?.onboarding_completed === true || profile?.onboarding_step === 8

  if (isComplete) {
    return <Navigate to="/" replace />
  }

  return children
}

// Rota para quem NÃO está logado (Login, Cadastro). Se logar, é expulso daqui.
const PublicRoute = ({ children }) => {
  const { user, profile, loading, isInitialized } = useAuth()

  if (loading || !isInitialized) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  if (user) {
    // Só redireciona se o perfil já estiver disponível para sabermos o destino
    if (!profile) return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>

    const isComplete = profile?.onboarding_completed === true || profile?.onboarding_step === 8
    return <Navigate to={isComplete ? "/" : "/onboarding"} replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/cadastro" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/definir-senha" element={<SetPassword />} />
          <Route path="/verificar-email" element={<VerifyEmail />} />
          <Route path="/email-verificado" element={<EmailVerified />} />
          <Route path="/recuperar-senha" element={<RecoverPassword />} />
          <Route path="/nova-senha" element={<ResetPassword />} />
          <Route path="/senha-alterada" element={<PasswordChanged />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="/onboarding"
            element={
              <OnboardingRoute>
                <Onboarding />
              </OnboardingRoute>
            }
          />

          {/* WorkspaceSetup: rota protegida para criar workspaces adicionais */}
          <Route
            path="/workspace/criar"
            element={
              <ProtectedRoute>
                <WorkspaceSetup />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
