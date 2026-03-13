import { useState, useEffect } from 'react'
import { adminAPI } from '../../services/api'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { name:'', description:'', pricePerStem:'', minOrderQuantity:50, stockQuantity:0, imageUrl:'', color:'', originCountry:'', stemLengthCm:'', season:'', vaseLifeDays:'', isFeatured:false, categoryId:'' }

export default function AdminProducts() {
  const [products, setProducts]     = useState([])
  const [categories, setCategories] = useState([])
  const [modal, setModal]           = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [saving, setSaving]         = useState(false)

  const load = () => {
    adminAPI.getProducts().then(r => setProducts(r.data))
    adminAPI.getCategories().then(r => setCategories(r.data))
  }
  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(EMPTY); setModal('add') }
  const openEdit = p  => { setForm({ ...p, categoryId: p.categoryId || '' }); setModal(p) }
  const closeModal = () => setModal(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, pricePerStem: Number(form.pricePerStem), minOrderQuantity: Number(form.minOrderQuantity), stockQuantity: Number(form.stockQuantity), stemLengthCm: Number(form.stemLengthCm) || null, vaseLifeDays: Number(form.vaseLifeDays) || null, categoryId: form.categoryId ? Number(form.categoryId) : null }
      if (modal === 'add') await adminAPI.createProduct(payload)
      else                 await adminAPI.updateProduct(modal.id, payload)
      toast.success(modal === 'add' ? 'Product created!' : 'Product updated!')
      load(); closeModal()
    } catch (err) { toast.error(err.response?.data?.error || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    if (!window.confirm('Deactivate this product?')) return
    await adminAPI.deleteProduct(id)
    toast.success('Product deactivated')
    load()
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <h1 style={{ fontSize: 24 }}>Products</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Add Product
        </button>
      </div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><img src={p.imageUrl || 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=80'} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} onError={e => e.target.src='https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=80'} /></td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td style={{ color: 'var(--text3)' }}>{p.categoryName}</td>
                <td style={{ fontWeight: 700, color: '#b12704' }}>₹{p.pricePerStem}</td>
                <td style={{ color: p.stockQuantity < 200 ? '#e53e3e' : 'inherit', fontWeight: p.stockQuantity < 200 ? 700 : 400 }}>{p.stockQuantity?.toLocaleString('en-IN')}</td>
                <td><span style={{ fontSize: 11, fontWeight: 700, color: p.isActive ? '#065f46' : '#991b1b', background: p.isActive ? '#d1fae5' : '#fee2e2', padding: '3px 8px', borderRadius: 12 }}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-gray" style={{ padding: '5px 10px' }} onClick={() => openEdit(p)}><Pencil size={13} /></button>
                    <button className="btn btn-danger" style={{ padding: '5px 10px' }} onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                {[
                  ['Product Name *', 'name',             'text'],
                  ['Price Per Stem *','pricePerStem',    'number'],
                  ['Min Order Qty',  'minOrderQuantity', 'number'],
                  ['Stock Quantity', 'stockQuantity',    'number'],
                  ['Color',          'color',            'text'],
                  ['Origin Country', 'originCountry',    'text'],
                  ['Stem Length cm', 'stemLengthCm',     'number'],
                  ['Vase Life days', 'vaseLifeDays',     'number'],
                  ['Season',         'season',           'text'],
                ].map(([label, key, type]) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input type={type} className="form-input" value={form[key]} onChange={e => set(key, e.target.value)} required={label.includes('*')} step={type === 'number' ? 'any' : undefined} />
                  </div>
                ))}
                <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
                  <label className="form-label">Image URL</label>
                  <input type="text" className="form-input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input type="text" className="form-input" value={form.description} onChange={e => set('description', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} style={{ width: 16, height: 16 }} />
                  <label htmlFor="featured" className="form-label" style={{ margin: 0 }}>Mark as Bestseller</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-gray" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving} style={{ flex: 2 }}>
                  {saving ? 'Saving...' : modal === 'add' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}