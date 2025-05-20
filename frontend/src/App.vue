<template>
  <div class="weather-dashboard-bg">
    <div v-if="!user" class="auth-dual-center">
      <!-- Login -->
      <div class="auth-card-side auth-login">
        <div class="app-title main-title">Dashboard del Clima</div>
        <div class="subtitle">Consulta el clima en cualquier lugar, en cualquier momento</div>
        <form @submit.prevent="loginUser" class="auth-form">
          <div class="form-title">Iniciar sesión</div>
          <div class="field-group">
            <label for="loginEmail">Correo electrónico</label>
            <input
              id="loginEmail"
              v-model="loginEmail"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              required
              autocomplete="username"
            />
          </div>
          <div class="field-group">
            <label for="loginPassword">Contraseña</label>
            <input
              id="loginPassword"
              v-model="loginPassword"
              type="password"
              placeholder="Ingresa tu contraseña"
              required
              autocomplete="current-password"
            />
          </div>
          <button class="primary-btn" type="submit">Iniciar sesión</button>
          <div v-if="authMsg && authMsgType === 'login'" class="auth-msg">{{ authMsg }}</div>
        </form>
      </div>

      <!-- DIVIDER -->
      <div class="divider-vertical">
        <div class="divider-line"></div>
        <div class="divider-text">o</div>
        <div class="divider-line"></div>
      </div>

      <!-- Registro -->
      <div class="auth-card-side auth-register">
        <div class="form-title main-title">Crear cuenta</div>
        <div class="subtitle">¿No tienes cuenta? Regístrate gratis:</div>
        <form @submit.prevent="registerUser" class="auth-form">
          <div class="field-group">
            <label for="registerEmail">Correo electrónico</label>
            <input
              id="registerEmail"
              v-model="registerEmail"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              required
              autocomplete="username"
            />
          </div>
          <div class="field-group">
            <label for="registerPassword">Contraseña</label>
            <input
              id="registerPassword"
              v-model="registerPassword"
              type="password"
              placeholder="Ingresa tu contraseña"
              required
              autocomplete="new-password"
            />
          </div>
          <button class="secondary-btn" type="submit">Registrarse</button>
          <div v-if="authMsg && authMsgType === 'register'" class="auth-msg">{{ authMsg }}</div>
        </form>
      </div>
    </div>

    <!-- DASHBOARD LOGUEADO -->
    <div v-else class="dashboard-container">
      <div class="header-bar">
        <div class="app-name">Dashboard del Clima</div>
        <div class="user-controls">
          <span class="user-email">{{ user.email }}</span>
          <button class="logout-btn" @click="logout">Cerrar sesión</button>
        </div>
      </div>
      <div class="main-content">
        <div class="search-section">
          <div class="search-title">Buscar clima</div>
          <form class="search-form" @submit.prevent="buscarClima">
            <input
              v-model="ciudad"
              class="city-input"
              type="text"
              placeholder="Ingrese una ciudad"
              required
            />
            <button class="primary-btn" type="submit">Buscar</button>
          </form>
        </div>
        <div class="history-section">
          <div class="history-title">Historial de búsquedas</div>
          <!-- CONTENEDOR SCROLL DEL HISTORIAL -->
          <div class="history-cards-container">
            <div v-if="historial.length === 0" class="weather-card empty-card">
              Sin búsquedas aún.
            </div>
            <div v-else class="history-cards">
              <div
                v-for="busqueda in historial"
                :key="busqueda.id"
                class="weather-card"
              >
                <div class="weather-details">
                  <!-- Ciudad, País y Fecha -->
                  <div class="weather-card-row-top">
                    <div class="city-country">
                      <span class="city">{{ busqueda.city }}</span>
                      <span class="country">, {{ busqueda.country }}</span>
                    </div>
                    <div class="weather-card-date">{{ formatFecha(busqueda.date) }}</div>
                  </div>
                  <!-- Descripción e Icono -->
                  <div class="weather-card-row-mid">
                    <span class="weather-description">{{ busqueda.description }}</span>
                    <span v-if="busqueda.icon" class="weather-icon">
                      <img :src="getIcon(busqueda.icon)" :alt="busqueda.description" />
                    </span>
                  </div>
                  <!-- Detalles principales -->
                  <div class="weather-card-info">
                    <span class="weather-label">Temp:</span>
                    <span class="weather-value">{{ busqueda.temperature }}°C</span>
                    <span class="weather-label">| Sensación:</span>
                    <span class="weather-value">{{ busqueda.feels_like }}°C</span>
                    <span class="weather-label">| Humedad:</span>
                    <span class="weather-value">{{ busqueda.humidity }}%</span>
                    <span class="weather-label">| Viento:</span>
                    <span class="weather-value">{{ busqueda.wind_speed }} m/s</span>
                  </div>
                  <!-- Usuario (opcional) -->
                  <div class="weather-card-user" v-if="busqueda.user && busqueda.user.email">
                    <span class="weather-label">Usuario:</span>
                    <span class="weather-value">{{ busqueda.user.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        Desarrollado por Figueroa y Chile | Powered by OpenWeather & Vue 3
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const authMsg = ref('')
const authMsgType = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const ciudad = ref('')
const historial = ref([])

async function loginUser() {
  authMsg.value = ""
  authMsgType.value = "login"
  if (!loginEmail.value || !loginPassword.value) return

  const loginResp = await fetch('http://localhost:3000/api/auth/simple-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value })
  })
  if (loginResp.ok) {
    const data = await loginResp.json()
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    obtenerHistorial()
    loginEmail.value = ""
    loginPassword.value = ""
    return
  }
  const errorData = await loginResp.json()
  authMsg.value = errorData.message || "Error al iniciar sesión"
}
async function registerUser() {
  authMsg.value = ""
  authMsgType.value = "register"
  if (!registerEmail.value || !registerPassword.value) return

  const regResp = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: registerEmail.value, password: registerPassword.value })
  })
  if (regResp.ok) {
    const data = await regResp.json()
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    obtenerHistorial()
    registerEmail.value = ""
    registerPassword.value = ""
    return
  } else {
    const err = await regResp.json()
    authMsg.value = err.message || 'Error al registrar usuario'
  }
}
function logout() {
  user.value = null
  localStorage.removeItem('user')
  ciudad.value = ""
  historial.value = []
}
async function buscarClima() {
  if (!user.value || !ciudad.value) return

  await fetch('http://localhost:3000/api/weather/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.value.email, city: ciudad.value }),
  })
  ciudad.value = ""
  obtenerHistorial()
}
async function obtenerHistorial() {
  if (!user.value) return
  const resp = await fetch(`http://localhost:3000/api/weather/history/${user.value.email}`)
  if (resp.ok) {
    historial.value = await resp.json()
  }
}
function formatFecha(fecha) {
  const d = new Date(fecha)
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}
function getIcon(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
onMounted(() => {
  if (user.value) obtenerHistorial()
})
</script>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  width: 100vw !important;
  height: 100vh !important;
  min-height: 100vh !important;
  min-width: 100vw !important;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
  background: #f0f5ff !important;
}
.weather-dashboard-bg {
  min-height: 100vh;
  min-width: 100vw;
  height: 100vh;
  width: 100vw;
  background: #f0f5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Montserrat', Arial, sans-serif;
  overflow: auto;
}
/* ---- Login/Register ---- */
.auth-dual-center {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0px 6px 40px 0px rgba(0,0,0,0.12);
  max-width: 940px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  margin: 40px 0;
  padding: 0;
  gap: 0;
}
.auth-card-side {
  flex: 1 1 0;
  padding: 46px 44px 46px 44px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 350px;
  max-width: 420px;
  background: #fff;
}
.auth-login {
  border-right: 2.5px solid #e9ecf3;
}
.auth-register {}
.main-title {
  color: #1e3a8a;
  font-size: 25px;
  font-weight: 700;
  text-align: left;
  margin-bottom: 2px;
}
.subtitle {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 14px;
  margin-top: 0;
  text-align: left;
}
.form-title {
  color: #1e3a8a;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 18px;
  margin-top: 0;
  text-align: left;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-group label {
  color: #334155;
  font-size: 15px;
  font-weight: 500;
}
.field-group input {
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  padding: 12px;
  font-size: 16px;
}
.primary-btn, .secondary-btn {
  border: none;
  border-radius: 6px;
  padding: 14px 0;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  transition: background .17s;
  margin-top: 10px;
}
.primary-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 700;
  height: 48px;
  min-width: 115px;
  white-space: nowrap;
  cursor: pointer;
  transition: background .17s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.primary-btn:hover { background: #1549b7; }
.secondary-btn {
  background: #4b96ff;
  padding: 14px 0;
  min-width: 115px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.secondary-btn:hover { background: #2265d4; }
.auth-msg {
  color: #e74c3c;
  margin-top: 13px;
  text-align: left;
  font-size: 1.07rem;
  font-weight: 500;
}
.divider-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  max-width: 60px;
  background: transparent;
  position: relative;
}
.divider-line {
  width: 2px;
  height: 75px;
  background: #e9ecf3;
  margin: 0 auto;
}
.divider-text {
  color: #b0b6bf;
  font-size: 21px;
  font-weight: 700;
  text-align: center;
  margin: 12px 0;
  line-height: 1;
}
@media (max-width: 950px) {
  .auth-dual-center {
    flex-direction: column;
    align-items: stretch;
    max-width: 98vw;
    border-radius: 18px;
    box-shadow: 0px 4px 16px 0px rgba(0,0,0,0.08);
  }
  .auth-card-side {
    max-width: 98vw;
    border-right: none !important;
    padding: 30px 6vw;
  }
  .divider-vertical {
    flex-direction: row;
    min-width: 100%;
    max-width: 100%;
    margin: 0 0 14px 0;
    height: 36px;
  }
  .divider-line {
    width: 100%;
    max-width: 80px;
    height: 2px;
    margin: 0 6px;
  }
  .divider-text {
    margin: 0 9px;
    font-size: 18px;
  }
}
/* ---- Dashboard ---- */
.dashboard-container {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}
.header-bar {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 700px;
  height: 64px;
  margin: 40px auto 0 auto;
  border-radius: 10px 10px 0 0;
}
.app-name {
  color: #1e3a8a;
  font-size: 20px;
  font-weight: 700;
}
.user-controls {
  display: flex;
  gap: 14px;
  align-items: center;
}
.user-email {
  color: #64748b;
  font-size: 14px;
}
.logout-btn {
  background: #f1f5f9;
  border-radius: 6px;
  padding: 7px 18px;
  font-size: 15px;
  color: #334155;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background .18s;
}
.logout-btn:hover { background: #e2e8f0; }
.main-content {
  padding: 34px 28px 0 28px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: stretch;
  width: 100%;
  max-width: 700px;
  min-height: 420px;
  background: #fff;
  border-radius: 0 0 12px 12px;
  box-shadow: 0px 4px 18px 0px rgba(0,0,0,0.09);
  margin: 0 auto 30px auto;
}
.search-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 0.5rem;
}
.search-title {
  color: #1e3a8a;
  font-size: 18px;
  font-weight: 600;
}
.search-form {
  display: flex;
  flex-direction: row;
  gap: 14px;
  align-items: center;
}
.city-input {
  background: #f8fafc;
  border-radius: 7px;
  border: 1px solid #cbd5e1;
  padding: 14px;
  font-size: 15px;
  flex: 1;
  min-width: 0;
}
.history-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.history-title {
  color: #1e3a8a;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.history-cards-container {
  max-height: 45vh;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding-right: 2px;
}
.history-cards {
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 100%;
}
.weather-card {
  background: #f8fafc;
  border-radius: 9px;
  padding: 12px 15px;
  box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 15px;
  color: #22223b;
  min-height: 62px;
}
.empty-card {
  text-align: center;
  color: #8d99ae;
  font-weight: 500;
}
.weather-details {
  width: 100%;
}
.weather-card-row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.11rem;
  margin-bottom: 2px;
}
.city-country {
  display: flex;
  align-items: baseline;
}
.city {
  color: #1457c9;
  font-size: 1.19rem;
  font-weight: 800;
  margin-right: 2px;
  letter-spacing: 0.2px;
}
.country {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 400;
}
.weather-card-date {
  color: #888;
  font-size: 0.98rem;
  font-weight: 400;
}
.weather-card-row-mid {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 4px;
}
.weather-description {
  color: #2563eb;
  font-size: 1.11rem;
  font-weight: 600;
  text-transform: capitalize;
}
.weather-icon img {
  width: 34px;
  height: 34px;
}
.weather-card-info {
  font-size: 0.98rem;
  color: #334155;
  font-weight: 500;
  margin-bottom: 1px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 7px;
  align-items: center;
}
.weather-label {
  color: #64748b;
  font-size: 0.98rem;
  margin-left: 1px;
}
.weather-value {
  font-weight: 700;
  color: #22223b;
  margin-right: 7px;
}
.weather-card-user {
  font-size: 0.95rem;
  color: #888;
  margin-top: 4px;
}
.footer {
  text-align: center;
  color: #22607599;
  font-size: 1.10rem;
  padding: 2.2rem 0 1.1rem 0;
  width: 100vw;
  background: transparent;
  margin-top: 20px;
}
</style>
