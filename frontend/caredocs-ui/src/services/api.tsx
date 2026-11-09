
import axios from 'axios'
  // baseURL: import.meta.env.VITE_API_BASE_URL,
const api = axios.create({
  baseURL: 'http://localhost:5140/api',
  headers: {
    Accept: 'application/json'
  }
})
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
export default api
