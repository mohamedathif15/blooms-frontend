import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    companyName: '', gstNumber: '',
    deliveryAddress: '', city: '', state: '', pincode: ''
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.phone && !/^\d{10}$/.test(form.phone)) {
      toast.error('Phone number must be exactly 10 digits')
      return
    }
    setLoading(true)
    try {
      await register(form)
      toast.success('Welcome to Blooms! 🌸')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: '32px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40 }}>🌸</div>
          <h1 style={{ color: 'var(--green)' }}>Create Business Account</h1>
        </div>
        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" className="form-input"
                value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input"
                value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-input"
                value={form.password} onChange={e => set('password', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">
                Phone
                <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 12 }}> (10 digits only)</span>
              </label>
              <input type="tel" className="form-input"
                placeholder="9876543210"
                maxLength={10}
                value={form.phone}
                onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} />
              {form.phone.length > 0 && form.phone.length < 10 && (
                <div style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>
                  {10 - form.phone.length} more digits needed
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" className="form-input"
                value={form.companyName} onChange={e => set('companyName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input type="text" className="form-input"
                value={form.gstNumber} onChange={e => set('gstNumber', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Address</label>
              <input type="text" className="form-input"
                value={form.deliveryAddress} onChange={e => set('deliveryAddress', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[['City','city'],['State','state'],['Pincode','pincode']].map(([label, key]) => (
                <div className="form-group" key={key}>
                  <label className="form-label">{label}</label>
                  <input type="text" className="form-input"
                    value={form[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text3)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--green)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}