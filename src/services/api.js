import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL + '/api'
    : '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('bl_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bl_token')
      localStorage.removeItem('bl_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login:    d => api.post('/auth/login', d),
  register: d => api.post('/auth/register', d),
}

export const productAPI = {
  getAll:        p  => api.get('/products', { params: p }),
  getById:       id => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
}

export const cartAPI = {
  get:    ()       => api.get('/cart'),
  add:    (pid, q) => api.post('/cart/add', { productId: pid, quantity: q }),
  update: (id, q)  => api.put(`/cart/update/${id}?quantity=${q}`),
  remove: id       => api.delete(`/cart/remove/${id}`),
}

export const orderAPI = {
  place:    d => api.post('/orders/place', d),
  myOrders: () => api.get('/orders/my-orders'),
}

export const adminAPI = {
  getStats:       ()        => api.get('/admin/stats'),
  getProducts:    ()        => api.get('/admin/products'),
  createProduct:  d         => api.post('/admin/products', d),
  updateProduct:  (id, d)   => api.put(`/admin/products/${id}`, d),
  deleteProduct:  id        => api.delete(`/admin/products/${id}`),
  getCategories:  ()        => api.get('/admin/categories'),
  createCategory: d         => api.post('/admin/categories', d),
  getOrders:      ()        => api.get('/admin/orders'),
  updateStatus:   (id, s)   => api.put(`/admin/orders/${id}/status`, { status: s }),
  getUsers:       ()        => api.get('/admin/users'),
}

export default api