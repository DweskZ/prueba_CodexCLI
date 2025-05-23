<script setup>
import { ref, onMounted } from 'vue'
import AuthForm from './components/AuthForm.vue'
import HeaderBar from './components/HeaderBar.vue'
import WeatherSearch from './components/WeatherSearch.vue'
import WeatherHistory from './components/WeatherHistory.vue'

// 🌐 Dirección del backend en Cloud Run
const API_URL = "https://backend-750975947564.northamerica-south1.run.app"

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const authMsg = ref('')
const authMsgType = ref('')
const historial = ref([])

/** Login de usuario */
async function loginUser(email, password) {
  authMsg.value = ""
  authMsgType.value = "login"
  const resp = await fetch(`${API_URL}/api/auth/simple-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (resp.ok) {
    const data = await resp.json()
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    obtenerHistorial()
    return
  }
  const errorData = await resp.json()
  authMsg.value = errorData.message || "Error al iniciar sesión"
}

/** Registro de usuario */
async function registerUser(email, password) {
  authMsg.value = ""
  authMsgType.value = "register"
  const resp = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (resp.ok) {
    const data = await resp.json()
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    obtenerHistorial()
    return
  }
  const err = await resp.json()
  authMsg.value = err.message || 'Error al registrar usuario'
}

/** Cierre de sesión */
function logout() {
  user.value = null
  localStorage.removeItem('user')
  historial.value = []
}

/** Búsqueda de clima */
async function buscarClima(ciudad) {
  if (!user.value || !ciudad) return
  await fetch(`${API_URL}/api/weather/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.value.email, city: ciudad }),
  })
  obtenerHistorial()
}

/** Obtener historial de clima */
async function obtenerHistorial() {
  if (!user.value) return
  const resp = await fetch(`${API_URL}/api/weather/history/${user.value.email}`)
  if (resp.ok) {
    historial.value = await resp.json()
  }
}

onMounted(() => {
  if (user.value) obtenerHistorial()
})
</script>
