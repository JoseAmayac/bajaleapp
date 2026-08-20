import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const { error } = isRegister
      ? await signUp(email, password)
      : await signIn(email, password)

    if (error) {
      setError(error.message)
    } else if (isRegister) {
      setMessage('Revisa tu correo para confirmar tu cuenta.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
            <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">BajaleApp</h1>
        <p className="text-gray-400 text-sm mt-1">Tu progreso, tu ritmo</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <p className="text-base font-semibold text-gray-800 mb-5">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
              <p className="text-sm text-emerald-700">{message}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-1">
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-50 text-center">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); setMessage('') }}
            className="text-sm text-gray-400 hover:text-emerald-600 transition-colors"
          >
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  )
}
