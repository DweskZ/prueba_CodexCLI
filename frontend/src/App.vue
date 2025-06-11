<template>
  <div>
    <!-- Si el usuario está autenticado, muestra el dashboard y navegación -->
    <div v-if="user">
      <HeaderBar :user="user" @logout="logout" />
      <nav>
        <button :class="{ active: currentTab === 'dashboard' }" @click="currentTab = 'dashboard'">Dashboard</button>
        <button :class="{ active: currentTab === 'history' }" @click="currentTab = 'history'">Historial</button>
      </nav>
      <div v-if="currentTab === 'dashboard'">
        <WeatherSearch @buscar="buscarClima" />
        <!-- Puedes mostrar aquí info del usuario o más componentes del dashboard -->
      </div>
      <div v-if="currentTab === 'history'">
        <WeatherHistory :historial="historial" />
      </div>
    </div>
    <!-- Si no hay usuario logueado, muestra el formulario de login/registro -->
    <AuthForm
      v-else
      @login="loginUser"
      @register="registerUser"
      :authMsg="authMsg"
      :authMsgType="authMsgType"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AuthForm from './components/AuthForm.vue'
import HeaderBar from './components/HeaderBar.vue'
import WeatherSearch from './components/WeatherSearch.vue'
import WeatherHistory from './components/WeatherHistory.vue'

const API_URL = "https://backend-750975947564.northamerica-south1.run.app"
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const authMsg = ref('')
const authMsgType = ref('')
const historial = ref([])
const currentTab = ref('dashboard') // controla la pestaña activa

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
    currentTab.value = 'dashboard' // Muestra el dashboard tras login
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
    currentTab.value = 'dashboard' // Muestra el dashboard tras registro
    return
  }
  const err = await resp.json()
  authMsg.value = err.message || 'Error al registrar usuario'
}

/** Logout */
function logout() {
  user.value = null
  localStorage.removeItem('user')
  historial.value = []
  currentTab.value = 'dashboard'
}

/** Buscar clima */
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

<style>
nav {
  margin: 1em 0;
  display: flex;
  gap: 1em;
}
button.active {
  font-weight: bold;
  border-bottom: 2px solid #2563eb;
}
</style>
