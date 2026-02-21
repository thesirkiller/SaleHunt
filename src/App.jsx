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
  const { user, profile, loading, isPasswordRecovery } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (isPasswordRecovery) return <Navigate to="/nova-senha" replace />
  if (!profile || !profile.onboarding_completed) return <Navigate to="/onboarding" replace />

  return children
}

// Rota de onboarding: só para usuários que ainda não concluíram o onboarding
const OnboardingRoute = ({ children }) => {
  const { user, profile, loading, isPasswordRecovery } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />
  if (isPasswordRecovery) return <Navigate to="/nova-senha" replace />
  if (profile?.onboarding_completed) return <Navigate to="/" replace />

  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
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
