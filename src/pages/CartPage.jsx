import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderAPI, productAPI } from '../services/api'
import Navbar from '../components/Navbar'
import PaymentModal from '../components/PaymentModal'
import toast from 'react-hot-toast'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { cart, updateQty, removeItem, subtotal, gst, total, fetchCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]             = useState(1)
  const [placing, setPlacing]       = useState(false)
  const [invoice, setInvoice]       = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [addr, setAddr] = useState({
    deliveryAddress: user?.deliveryAddress || '',
    contactName:     user?.name || '',
    contactPhone:    user?.phone || '',
    notes:           ''
  })

  const validateStep2 = () => {
    if (!addr.deliveryAddress.trim()) {
      toast.error('Please enter delivery address'); return false
    }
    if (!addr.contactName.trim()) {
      toast.error('Please enter contact name'); return false
    }
    if (!addr.contactPhone.trim()) {
      toast.error('Please enter phone number'); return false
    }
    if (!/^\d{10}$/.test(addr.contactPhone)) {
      toast.error('Phone number must be exactly 10 digits'); return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      const { data } = await orderAPI.place(addr)
      await fetchCart()
      setInvoice(data.invoiceNumber)
      setStep(3)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order')
    } finally { setPlacing(false) }
  }

  // Step 3 — Order Success
  if (step === 3) return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)'
      }}>
        <div className="card" style={{
          padding: 52, textAlign: 'center', maxWidth: 440
        }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: '#065f46', marginBottom: 8 }}>
            Order Placed Successfully!
          </h2>
          <p style={{ color: 'var(--text3)', marginBottom: 16 }}>
            Payment confirmed. Your order is being processed.
          </p>
          <div style={{
            background: '#f0faf4',
            border: '2px solid #52b788',
            borderRadius: 10, padding: 16, marginBottom: 8
          }}>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Invoice Number</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1a5c38' }}>
              {invoice}
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
            Our team will call you within 24 hours to confirm delivery details.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => navigate('/orders')}>
              View My Orders
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Empty cart
  if (cart.length === 0) return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 60px)'
      }}>
        <div style={{ fontSize: 72 }}>🛒</div>
        <h2 style={{ margin: '16px 0 8px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text3)', marginBottom: 20 }}>
          Add some flowers to get started!
        </p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
          Browse Flowers
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: '32px auto', padding: '0 24px' }}>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          {['Cart', 'Delivery', 'Payment'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: step > i + 1 ? '#065f46' : step === i + 1 ? '#1a5c38' : '#ddd',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 13,
                fontWeight: step === i + 1 ? 700 : 400,
                color: step === i + 1 ? '#1a5c38' : 'var(--text3)'
              }}>{s}</span>
              {i < 2 && (
                <div style={{
                  width: 40, height: 2,
                  background: step > i + 1 ? '#1a5c38' : '#ddd'
                }} />
              )}
            </div>
          ))}
        </div>

        {/* STEP 1 — Cart Items */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
            <div>
              <h2 style={{ marginBottom: 16 }}>
                Your Cart ({cart.length} item{cart.length > 1 ? 's' : ''})
              </h2>
              {cart.map(item => (
                <div key={item.id} className="card" style={{
                  padding: 16, marginBottom: 12,
                  display: 'flex', gap: 14, alignItems: 'center'
                }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=200'}
                    alt={item.productName}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=200'}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{item.productName}</div>
                    <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                      ₹{item.pricePerStem}/stem
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className="btn btn-gray" style={{ padding: '5px 11px' }}
                      onClick={() => item.quantity > item.minOrderQuantity
                        ? updateQty(item.id, item.quantity - 10)
                        : removeItem(item.id)
                      }
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontWeight: 700, minWidth: 48, textAlign: 'center', fontSize: 15 }}>
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-gray" style={{ padding: '5px 11px' }}
                      onClick={() => updateQty(item.id, item.quantity + 10)}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <div style={{
                    fontWeight: 700, color: '#b12704',
                    minWidth: 100, textAlign: 'right'
                  }}>
                    ₹{Number(item.lineTotal).toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: 'none', border: 'none',
                      cursor: 'pointer', color: '#e53e3e', padding: 4
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <div className="card" style={{ padding: 22 }}>
                <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: 12, fontSize: 14, color: 'var(--text3)'
                }}>
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{
                  borderTop: '2px solid var(--border)', paddingTop: 12,
                  display: 'flex', justifyContent: 'space-between',
                  fontWeight: 700, fontSize: 18, marginBottom: 20
                }}>
                  <span>Total</span>
                  <span style={{ color: '#b12704' }}>
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={() => setStep(2)}
                >
                  Proceed to Delivery →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Delivery Details */}
        {step === 2 && (
          <div style={{ maxWidth: 520 }}>
            <h2 style={{ marginBottom: 20 }}>Delivery Details</h2>
            <div className="card" style={{ padding: 28 }}>
              <div className="form-group">
                <label className="form-label">Delivery Address *</label>
                <input type="text" className="form-input"
                  placeholder="Full delivery address"
                  value={addr.deliveryAddress}
                  onChange={e => setAddr(a => ({ ...a, deliveryAddress: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Name *</label>
                <input type="text" className="form-input"
                  placeholder="Person to receive the order"
                  value={addr.contactName}
                  onChange={e => setAddr(a => ({ ...a, contactName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Contact Phone *
                  <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 12 }}> (10 digits)</span>
                </label>
                <input
                  type="tel" className="form-input"
                  placeholder="9876543210"
                  maxLength={10}
                  value={addr.contactPhone}
                  onChange={e => setAddr(a => ({
                    ...a,
                    contactPhone: e.target.value.replace(/\D/g, '').slice(0, 10)
                  }))}
                />
                {addr.contactPhone && addr.contactPhone.length < 10 && (
                  <div style={{ fontSize: 12, color: '#e53e3e', marginTop: 4 }}>
                    {10 - addr.contactPhone.length} more digits needed
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input type="text" className="form-input"
                  placeholder="Any special delivery instructions"
                  value={addr.notes}
                  onChange={e => setAddr(a => ({ ...a, notes: e.target.value }))} />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1 }}
                  onClick={async () => {
  if (!validateStep2()) return
  try {
    const { data: latestProducts } = await productAPI.getAll()
    const productMap = {}
    latestProducts.forEach(p => { productMap[p.id] = p })

    const insufficient = []
    for (const item of cart) {
      const latest = productMap[item.productId]
      if (!latest) continue
      if (item.quantity > latest.stockQuantity) {
        insufficient.push(
          `• ${item.productName}: ${item.quantity} in cart, only ${latest.stockQuantity} available`
        )
      }
    }

    if (insufficient.length > 0) {
      toast.error(
        'Insufficient stock:\n' + insufficient.join('\n'),
        { duration: 6000, style: { whiteSpace: 'pre-line' } }
      )
      return
    }

    setShowPayment(true)
  } catch {
    toast.error('Could not verify stock. Please try again.')
  }
}}
                  disabled={placing}
                >
                  💳 Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={total}
          onClose={() => setShowPayment(false)}
          onSuccess={async () => {
            setShowPayment(false)
            await handlePlaceOrder()
          }}
        />
      )}
    </div>
  )
}