import { useState, useEffect } from 'react'
import { orderAPI } from '../services/api'
import Navbar from '../components/Navbar'

export default function OrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.myOrders().then(r => setOrders(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 24px' }}>
        <h1 style={{ marginBottom: 24, color: 'var(--green)' }}>My Orders</h1>
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--text3)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p>No orders yet. Start shopping!</p>
          </div>
        ) : orders.map(order => (
          <div key={order.id} className="card" style={{ padding: 22, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--green)' }}>{order.invoiceNumber}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <span className={`badge badge-${order.status}`}>{order.status}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              {order.orderItems?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6, color: 'var(--text2)' }}>
                  <span>{item.productName} × {item.quantity} stems</span>
                  <span style={{ fontWeight: 600 }}>₹{Number(item.lineTotal).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10, fontWeight: 700, fontSize: 16 }}>
                <span>Total (incl. 18% GST)</span>
                <span style={{ color: '#b12704' }}>₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}