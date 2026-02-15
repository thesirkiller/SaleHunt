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

const ProtectedRoute = ({ children }) => {
  const { user, profile, loading, isPasswordRecovery } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />

  // If user came from a password recovery link, redirect to reset page
  if (isPasswordRecovery) {
    return <Navigate to="/nova-senha" replace />
  }

  // If user is logged in but hasn't finished onboarding, redirect
  if (profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

const OnboardingRoute = ({ children }) => {
  const { user, profile, loading, isPasswordRecovery } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  if (!user) return <Navigate to="/login" replace />

  // If user came from a password recovery link, redirect to reset page
  if (isPasswordRecovery) {
    return <Navigate to="/nova-senha" replace />
  }

  // If already completed, go to dashboard
  if (profile?.onboarding_completed) {
    return <Navigate to="/" replace />
  }

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

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="p-8">Dashboard (Em breve)</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
