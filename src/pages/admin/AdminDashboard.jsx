import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../../services/api'
import { Package, ShoppingBag, Users, TrendingUp, AlertTriangle, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getOrders()])
      .then(([s, o]) => { setStats(s.data); setOrders(o.data.slice(0, 8)) })
  }, [])

  const cards = stats ? [
    { label: 'Total Products',  value: stats.totalProducts,  icon: Package,       bg: '#d8f3dc', fg: '#1a5c38' },
    { label: 'Total Orders',    value: stats.totalOrders,    icon: ShoppingBag,   bg: '#dbeafe', fg: '#1a4a8a' },
    { label: 'Pending Orders',  value: stats.pendingOrders,  icon: Clock,         bg: '#fef3c7', fg: '#92400e' },
    { label: 'Total Buyers',    value: stats.totalBuyers,    icon: Users,         bg: '#ede9fe', fg: '#5b21b6' },
    { label: 'Revenue',         value: `₹${Number(stats.totalRevenue||0).toLocaleString('en-IN')}`, icon: TrendingUp, bg: '#d1fae5', fg: '#065f46' },
    { label: 'Low Stock Items', value: stats.lowStockProducts, icon: AlertTriangle, bg: '#fed7aa', fg: '#9a3412' },
  ] : []

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26 }}>Dashboard</h1>
        <p style={{ color: 'var(--text3)', fontSize: 14 }}>Welcome back! Here is your store overview.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {cards.map(({ label, value, icon: Icon, bg, fg }) => (
          <div key={label} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, background: bg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={fg} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 17 }}>Recent Orders</h2>
          <Link to="/admin/orders" style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>View All →</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Invoice</th><th>Buyer</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>No orders yet</td></tr>
              ) : orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: 'var(--green)' }}>{o.invoiceNumber}</td>
                  <td>{o.buyerName}</td>
                  <td style={{ fontWeight: 700, color: '#b12704' }}>₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                  <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text3)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}