import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [cats, setCats]     = useState([])
  const [name, setName]     = useState('')
  const [desc, setDesc]     = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => adminAPI.getCategories().then(r => setCats(r.data))
  useEffect(() => { load() }, [])

  const handleAdd = async e => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await adminAPI.createCategory({ name: name.trim(), description: desc.trim() })
      toast.success('Category created!')
      setName(''); setDesc('')
      load()
    } catch (err) { toast.error(err.response?.data?.error || 'Error') }
    finally { setSaving(false) }
  }

  return (
    <div style={{ padding: 28 }}>
      <h1 style={{ fontSize: 24, marginBottom: 22 }}>Categories</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div className="card" style={{ overflow: 'hidden', height: 'fit-content' }}>
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Description</th></tr>
            </thead>
            <tbody>
              {cats.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td style={{ color: 'var(--text3)', fontSize: 13 }}>{c.description || '—'}</td>
                </tr>
              ))}
              {cats.length === 0 && (
                <tr><td colSpan={2} style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>No categories</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card" style={{ padding: 22, height: 'fit-content' }}>
          <h3 style={{ marginBottom: 16 }}>Add Category</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input type="text" className="form-input" placeholder="e.g. Tulips"
                value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input type="text" className="form-input" placeholder="Short description"
                value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-full" disabled={saving}>
              <Plus size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              {saving ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}