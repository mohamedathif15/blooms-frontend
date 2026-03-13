import { useState } from 'react'
import { CreditCard, Smartphone, Building2, Lock } from 'lucide-react'

export default function PaymentModal({ amount, onSuccess, onClose }) {
  const [method, setMethod] = useState('card')
  const [paying, setPaying] = useState(false)
  const [done, setDone]     = useState(false)

  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry]   = useState('')
  const [cvv, setCvv]         = useState('')
  const [name, setName]       = useState('')
  const [upi, setUpi]         = useState('')
  const [bank, setBank]       = useState('State Bank of India')

  const formatCard   = val => val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExpiry = val => {
    const d = val.replace(/\D/g,'').slice(0,4)
    return d.length >= 3 ? d.slice(0,2)+'/'+d.slice(2) : d
  }

  const handlePay = async () => {
    if (method === 'card') {
      if (cardNum.replace(/\s/g,'').length < 16) { alert('Enter valid 16-digit card number'); return }
      if (expiry.length < 5)  { alert('Enter valid expiry MM/YY'); return }
      if (cvv.length < 3)     { alert('Enter valid 3-digit CVV'); return }
      if (!name.trim())       { alert('Enter name on card'); return }
    }
    if (method === 'upi' && !upi.includes('@')) {
      alert('Enter valid UPI ID e.g. name@upi'); return
    }
    setPaying(true)
    await new Promise(r => setTimeout(r, 2500))
    setPaying(false)
    setDone(true)
    await new Promise(r => setTimeout(r, 1000))
    onSuccess()
  }

  const amtFormatted = Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })

  return (
    <div className="modal-overlay">
      <div style={{
        background: '#fff', borderRadius: 14,
        width: '100%', maxWidth: 440,
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,.35)'
      }}>

        {/* Header */}
        <div style={{
          background: '#1a5c38', color: '#fff',
          padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>🌸</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Blooms Pay</div>
              <div style={{ fontSize: 11, opacity: .75 }}>Secure Payment Gateway</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, opacity: .75 }}>Amount to Pay</div>
            <div style={{ fontWeight: 800, fontSize: 22 }}>₹{amtFormatted}</div>
          </div>
        </div>

        {/* Success Screen */}
        {done ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 64 }}>✅</div>
            <h3 style={{ color: '#065f46', marginTop: 12, fontSize: 20 }}>Payment Successful!</h3>
            <p style={{ color: 'var(--text3)', fontSize: 14, marginTop: 8 }}>₹{amtFormatted} paid successfully</p>
            <p style={{ color: 'var(--text3)', fontSize: 13, marginTop: 4 }}>Placing your order...</p>
          </div>
        ) : (
          <div style={{ padding: 24 }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[
                { id: 'card',       icon: CreditCard, label: 'Card' },
                { id: 'upi',        icon: Smartphone,  label: 'UPI' },
                { id: 'netbanking', icon: Building2,   label: 'Net Banking' },
              ].map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setMethod(id)} style={{
                  flex: 1, padding: '10px 6px',
                  border: `2px solid ${method === id ? '#1a5c38' : '#e0ddd6'}`,
                  borderRadius: 8,
                  background: method === id ? '#f0faf4' : '#fff',
                  cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  color: method === id ? '#1a5c38' : '#666',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 5
                }}>
                  <Icon size={18} />{label}
                </button>
              ))}
            </div>

            {/* Card Form */}
            {method === 'card' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input className="form-input" placeholder="1234 5678 9012 3456"
                    value={cardNum} maxLength={19}
                    onChange={e => setCardNum(formatCard(e.target.value))}
                    style={{ letterSpacing: 2, fontSize: 15 }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Expiry</label>
                    <input className="form-input" placeholder="MM/YY"
                      value={expiry} maxLength={5}
                      onChange={e => setExpiry(formatExpiry(e.target.value))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input className="form-input" placeholder="•••"
                      type="password" maxLength={3}
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g,''))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Name on Card</label>
                  <input className="form-input" placeholder="JOHN DOE"
                    value={name}
                    onChange={e => setName(e.target.value.toUpperCase())} />
                </div>
                <div style={{ background: '#f0faf4', borderRadius: 8, padding: '8px 12px', marginBottom: 4, fontSize: 11, color: '#065f46' }}>
                  💡 Test card: 4111 1111 1111 1111 | 12/26 | 123
                </div>
              </div>
            )}

            {/* UPI Form */}
            {method === 'upi' && (
              <div>
                <div className="form-group">
                  <label className="form-label">UPI ID</label>
                  <input className="form-input" placeholder="yourname@upi"
                    value={upi} onChange={e => setUpi(e.target.value)} />
                </div>
                <div style={{ background: '#f0faf4', borderRadius: 8, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#1a5c38', fontWeight: 700, marginBottom: 8 }}>Accepted UPI Apps</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['📱 Google Pay','📲 PhonePe','💰 Paytm','🏦 BHIM'].map(app => (
                      <div key={app} style={{ background: '#fff', padding: '6px 10px', borderRadius: 6, fontSize: 12, border: '1px solid var(--border)' }}>{app}</div>
                    ))}
                  </div>
                </div>
                <div style={{ background: '#fff8e1', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#92400e' }}>
                  💡 Test UPI: test@upi
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === 'netbanking' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Select Your Bank</label>
                  <select className="form-input" value={bank} onChange={e => setBank(e.target.value)}>
                    {['State Bank of India','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank',
                      'Punjab National Bank','Bank of Baroda','Canara Bank','Union Bank of India',
                      'Indian Bank','Other Banks'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div style={{ background: '#fff8e1', borderRadius: 8, padding: 12, marginBottom: 14, fontSize: 12, color: '#92400e' }}>
                  ⚠️ You will be redirected to your bank's secure portal to complete payment.
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8f8f6', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
              <Lock size={14} color="#1a5c38" />
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                256-bit SSL encrypted · Your payment info is safe & secure
              </span>
            </div>

            {/* Pay Button */}
            <button onClick={handlePay} disabled={paying} style={{
              width: '100%', padding: 14,
              background: paying ? '#aaa' : '#1a5c38',
              color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 16, fontWeight: 700,
              cursor: paying ? 'not-allowed' : 'pointer'
            }}>
              {paying ? '⏳ Processing Payment...' : `Pay ₹${amtFormatted}`}
            </button>

            <button onClick={onClose} style={{
              width: '100%', padding: 10,
              background: 'transparent', border: 'none',
              color: 'var(--text3)', cursor: 'pointer', fontSize: 13, marginTop: 8
            }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}