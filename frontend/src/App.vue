<template>
  <div class="dashboard-bg">
    <div class="container">
      <h1 class="main-title">🌤️ Dashboard del Clima</h1>

      <!-- Login / Registro -->
      <div v-if="!user" class="auth-card">
        <!-- Formulario Login -->
        <form @submit.prevent="loginUser" class="auth-form">
          <h2>Iniciar sesión</h2>
          <input
            v-model="loginEmail"
            type="email"
            placeholder="Correo electrónico"
            required
          />
          <input
            v-model="loginPassword"
            type="password"
            placeholder="Contraseña"
            required
          />
          <button type="submit">Login</button>
        </form>
        <!-- Formulario Registro -->
        <form @submit.prevent="registerUser" class="auth-form" style="margin-top:1.2rem;">
          <h2>¿No tienes cuenta? Regístrate</h2>
          <input
            v-model="registerEmail"
            type="email"
            placeholder="Correo electrónico"
            required
          />
          <input
            v-model="registerPassword"
            type="password"
            placeholder="Contraseña"
            required
          />
          <button type="submit" class="register-btn">Registrar</button>
        </form>
        <div v-if="authMsg" class="error-msg">{{ authMsg }}</div>
      </div>

      <!-- Dashboard: solo si está logueado -->
      <div v-else>
        <div class="user-bar">
          <span>Hola, {{ user.email }}</span>
          <button class="logout" @click="logout">Cerrar sesión</button>
        </div>

        <form @submit.prevent="buscarClima" class="search-form">
          <input
            v-model="ciudad"
            type="text"
            placeholder="Ciudad"
            required
          />
          <button type="submit">Buscar clima</button>
        </form>

        <h2 class="history-title">Historial de búsquedas</h2>
        <div v-if="historial.length === 0" class="empty">Sin búsquedas aún.</div>
        <div v-else class="cards-grid">
          <div v-for="busqueda in historial" :key="busqueda.id" class="weather-card">
            <div class="header">
              <img :src="getIcon(busqueda.icon)" :alt="busqueda.description" />
              <div>
                <h3>{{ busqueda.city }}, {{ busqueda.country }}</h3>
                <p class="fecha">{{ formatFecha(busqueda.date) }}</p>
              </div>
            </div>
            <div class="info">
              <div class="row">
                <span>🌡️ Temp:</span>
                <span>{{ busqueda.temperature }}°C (Sens: {{ busqueda.feels_like }}°C)</span>
              </div>
              <div class="row">
                <span>☁️ Clima:</span>
                <span>{{ busqueda.description }}</span>
              </div>
              <div class="row">
                <span>💧 Humedad:</span>
                <span>{{ busqueda.humidity }}%</span>
              </div>
              <div class="row">
                <span>💨 Viento:</span>
                <span>{{ busqueda.wind_speed }} m/s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">Desarrollado por Figueroa y Chile | Powered by OpenWeather & Vue 3</footer>
  </div>
</template>

<script setup>
// --- Importaciones y variables reactivas ---
import { ref, onMounted } from 'vue'

// Estado de usuario y mensajes
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const authMsg = ref('')

// Login
const loginEmail = ref('')
const loginPassword = ref('')

// Registro
const registerEmail = ref('')
const registerPassword = ref('')

// Función de login
async function loginUser() {
  authMsg.value = ""
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
  authMsg.value = errorData.message || "Error de login"
}

// Función de registro
async function registerUser() {
  authMsg.value = ""
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

// Cerrar sesión
function logout() {
  user.value = null
  localStorage.removeItem('user')
  ciudad.value = ""
  historial.value = []
}

// --- Búsqueda y manejo del historial ---
const ciudad = ref('')
const historial = ref([])

function getIcon(icon) {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleString()
}

// Buscar clima y actualizar historial
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

// Obtener historial del usuario logueado
async function obtenerHistorial() {
  if (!user.value) return
  const resp = await fetch(`http://localhost:3000/api/weather/history/${user.value.email}`)
  if (resp.ok) {
    historial.value = await resp.json()
  }
}

onMounted(() => {
  if (user.value) obtenerHistorial()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

/* Fondo a pantalla completa */
.dashboard-bg {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  background: linear-gradient(120deg, #7fd8ea 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.container {
  width: 100vw;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1rem 0 1rem;
  font-family: 'Montserrat', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.main-title {
  text-align: center;
  font-size: 2.9rem;
  font-weight: 700;
  color: #216583;
  margin-bottom: 2.5rem;
  letter-spacing: 1.5px;
}

/* Tarjeta de login/registro */
.auth-card {
  background: #fffdfdce;
  border-radius: 1.5rem;
  box-shadow: 0 6px 20px #00000013;
  padding: 2.1rem 2.5rem;
  margin: 1.5rem 0 2.5rem 0;
  width: 100%;
  max-width: 400px;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}
.auth-form h2 {
  color: #226075;
  margin-bottom: 1.1rem;
  font-size: 1.2rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 1px;
}
.auth-form input {
  padding: 0.9rem 1.1rem;
  border-radius: 1.1rem;
  border: 1.3px solid #aad8d3;
  font-size: 1.11rem;
  outline: none;
  background: #f8fbfa;
  font-family: 'Montserrat', Arial, sans-serif;
}
.auth-form button {
  background: linear-gradient(90deg, #53a7c0 0%, #3295a8 100%);
  color: white;
  padding: 0.9rem 0;
  border-radius: 1.2rem;
  font-size: 1.1rem;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  font-family: 'Montserrat', Arial, sans-serif;
}
.auth-form button:hover {
  background: linear-gradient(90deg, #3295a8 0%, #53a7c0 100%);
  transform: scale(1.04);
}
.register-btn {
  background: linear-gradient(90deg, #6dc96d 0%, #379b3a 100%);
  color: white;
  font-weight: 700;
}
.register-btn:hover {
  background: linear-gradient(90deg, #379b3a 0%, #6dc96d 100%);
}
.error-msg {
  color: #e74c3c;
  margin-top: 0.7rem;
  text-align: center;
  font-size: 1.05rem;
  font-weight: 500;
}
.user-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  gap: 1rem;
  font-size: 1.1rem;
  margin-bottom: 1.3rem;
}
.logout {
  background: #ee706b;
  color: #fff;
  border: none;
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
}
.logout:hover {
  background: #c0392b;
}

/* Formulario búsqueda ciudad */
.search-form {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  margin-bottom: 2.8rem;
  width: 100%;
  max-width: 700px;
}
.search-form input {
  padding: 1rem 1.4rem;
  font-size: 1.18rem;
  border: 1.5px solid #aad8d3;
  border-radius: 1.7rem;
  outline: none;
  background: #f8fbfa;
  transition: border 0.2s;
  width: 270px;
  font-family: 'Montserrat', Arial, sans-serif;
}
.search-form input:focus {
  border: 2px solid #53a7c0;
}
.search-form button {
  background: linear-gradient(90deg, #53a7c0 0%, #3295a8 100%);
  color: white;
  padding: 1rem 2.3rem;
  font-size: 1.18rem;
  border: none;
  border-radius: 1.7rem;
  font-weight: 700;
  box-shadow: 0 3px 12px #53a7c026;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  font-family: 'Montserrat', Arial, sans-serif;
}
.search-form button:hover {
  background: linear-gradient(90deg, #3295a8 0%, #53a7c0 100%);
  transform: translateY(-2px) scale(1.04);
}
.history-title {
  margin: 2.8rem 0 1.7rem 0;
  font-size: 1.7rem;
  color: #226075;
  font-weight: 600;
  text-align: center;
}
.empty {
  text-align: center;
  color: #7a96a5;
  font-size: 1.15rem;
  margin-top: 1.7rem;
}
.cards-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.7rem;
  margin-bottom: 2.5rem;
}
.weather-card {
  background: #ffffffdb;
  border-radius: 1.5rem;
  box-shadow: 0 6px 24px #5abedb19, 0 2px 8px #99b1c921;
  padding: 1.3rem 1.5rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.17s, box-shadow 0.17s;
  position: relative;
  overflow: hidden;
  min-width: 0;
}
.weather-card:hover {
  transform: translateY(-6px) scale(1.025);
  box-shadow: 0 18px 50px #5abedb2c, 0 4px 16px #99b1c935;
}
.weather-card .header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1.1rem;
}
.weather-card img {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: #e4f3fa;
  border: 2.5px solid #bce2f0;
}
.weather-card h3 {
  margin: 0;
  font-size: 1.28rem;
  color: #21516c;
  font-weight: 700;
}
.fecha {
  font-size: 0.96rem;
  color: #577d93;
  margin-top: 0.15rem;
}
.info .row {
  display: flex;
  justify-content: space-between;
  margin: 0.25rem 0;
  font-size: 1.11rem;
  color: #357fa6;
  font-weight: 500;
}
.footer {
  text-align: center;
  color: #22607599;
  font-size: 1.12rem;
  margin-top: auto;
  padding: 2.5rem 0 1.3rem 0;
  font-family: 'Montserrat', Arial, sans-serif;
  width: 100vw;
  background: transparent;
}
@media (max-width: 900px) {
  .container {
    max-width: 98vw;
    padding: 1.3rem 0.3rem 0 0.3rem;
  }
  .main-title {
    font-size: 2.1rem;
  }
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.1rem;
  }
  .search-form {
    flex-direction: column;
    gap: 0.7rem;
    align-items: center;
    max-width: 99vw;
  }
  .search-form input {
    width: 95vw;
    max-width: 360px;
  }
  .auth-card {
    padding: 1.2rem 0.6rem;
    max-width: 97vw;
  }
}
</style>
