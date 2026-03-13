import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🌸`)
      navigate(user.role === 'ADMIN' ? '/admin' : from, { replace: true })
    } catch {
      toast.error('Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--cream)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 20
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 52 }}>🌸</div>
          <h1 style={{ color: 'var(--green)', marginTop: 8 }}>Blooms</h1>
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>B2B Wholesale Flower Platform</p>
        </div>
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ marginBottom: 22 }}>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input"
                placeholder="you@company.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required />
            </div>
            <button className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14, color: 'var(--text3)' }}>
            New here? <Link to="/register" style={{ color: 'var(--green)', fontWeight: 600 }}>Register your business →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
