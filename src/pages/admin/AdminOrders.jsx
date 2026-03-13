import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Eye, X } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = ['PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']

export default function AdminOrders() {
  const [orders, setOrders]     = useState([])
  const [selected, setSelected] = useState(null)
  const [status, setStatus]     = useState('')
  const [saving, setSaving]     = useState(false)

  const load = () => adminAPI.getOrders().then(r => setOrders(r.data))
  useEffect(() => { load() }, [])

  const openOrder = o => { setSelected(o); setStatus(o.status) }

  const handleUpdate = async () => {
    setSaving(true)
    try {
      await adminAPI.updateStatus(selected.id, status)
      toast.success('Status updated!')
      load(); setSelected(null)
    } catch { toast.error('Error updating status') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, marginBottom: 22 }}>Orders</h1>
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr><th>Invoice</th><th>Buyer</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No orders yet</td></tr>
            ) : orders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700, color: 'var(--green)' }}>{o.invoiceNumber}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{o.buyerName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{o.buyerEmail}</div>
                </td>
                <td style={{ fontWeight: 700, color: '#b12704' }}>₹{Number(o.totalAmount).toLocaleString('en-IN')}</td>
                <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                <td style={{ fontSize: 12, color: 'var(--text3)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <button className="btn btn-gray" style={{ padding: '5px 10px' }} onClick={() => openOrder(o)}>
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2>{selected.invoiceNumber}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {[['Buyer', selected.buyerName], ['Email', selected.buyerEmail], ['Company', selected.companyName], ['Phone', selected.contactPhone], ['Address', selected.deliveryAddress], ['Notes', selected.notes || '—']].map(([k, v]) => (
                <div key={k} style={{ background: '#f8f8f6', padding: '8px 12px', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <h3 style={{ marginBottom: 10, fontSize: 15 }}>Order Items</h3>
            {selected.orderItems?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 14 }}>
                <span>{item.productName} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>₹{Number(item.lineTotal).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
              <span>Total</span>
              <span style={{ color: '#b12704' }}>₹{Number(selected.totalAmount).toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <select className="form-input" style={{ flex: 1 }} value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-primary" onClick={handleUpdate} disabled={saving} style={{ whiteSpace: 'nowrap' }}>
                {saving ? 'Saving...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}