import axios from 'axios';

const BASE_URL = 'https://medibook-3-zhb9.onrender.com/api';
const api = axios.create({ baseURL: BASE_URL });

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: data => api.post('/auth/register', data),
  login:    data => api.post('/auth/login', data),
};

// ── Hospitals ─────────────────────────────────────────────────────────────────
export const hospitalAPI = {
  getAll:  ()       => api.get('/hospitals'),
  getById: id       => api.get(`/hospitals/${id}`),
  search:  keyword  => api.get('/hospitals/search', { params: { keyword } }),
  create:  data     => api.post('/hospitals', data),
  update:  (id, d)  => api.put(`/hospitals/${id}`, d),
  delete:  id       => api.delete(`/hospitals/${id}`),
};

// ── Doctors ───────────────────────────────────────────────────────────────────
export const doctorAPI = {
  getAll:           ()         => api.get('/doctors'),
  getById:          id         => api.get(`/doctors/${id}`),
  search:           keyword    => api.get('/doctors/search', { params: { keyword } }),
  getBySpec:        spec       => api.get('/doctors/specialization', { params: { name: spec } }),
  getAvailableSlots:(id, date) => api.get(`/doctors/${id}/available-slots`, { params: { date } }),
  create:           data       => api.post('/doctors', data),
  update:           (id, d)    => api.put(`/doctors/${id}`, d),
  delete:           id         => api.delete(`/doctors/${id}`),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const appointmentAPI = {
  book:         data => api.post('/appointments', data),
  getMine:      ()   => api.get('/appointments/my'),
  getAll:       ()   => api.get('/appointments'),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  cancel:       id   => api.put(`/appointments/${id}/cancel`),
  delete:       id   => api.delete(`/appointments/${id}`),
};

// ── Search ────────────────────────────────────────────────────────────────────
export const searchAPI = {
  suggestions: q => api.get('/search/suggestions', { params: { q } }),
  search:      q => api.get('/search', { params: { q } }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  patients:  () => api.get('/admin/patients'),
};

export default api;
