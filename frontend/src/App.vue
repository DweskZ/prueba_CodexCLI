<template>
  <!-- Fondo de dashboard a pantalla completa -->
  <div class="dashboard-bg">
    <div class="container">
      <!-- Título principal -->
      <h1 class="main-title">🌤️ Dashboard del Clima</h1>
      <!-- Formulario de búsqueda -->
      <form @submit.prevent="buscarClima" class="search-form">
        <input
          v-model="email"
          @change="guardarEmail"
          type="email"
          placeholder="Correo electrónico"
          required
        />
        <input
          v-model="ciudad"
          type="text"
          placeholder="Ciudad"
          required
        />
        <button type="submit">Buscar clima</button>
      </form>

      <!-- Historial de búsquedas -->
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
    <!-- Pie de página -->
    <footer class="footer">
      Desarrollado por Figueroa y Chile | Powered by OpenWeather & Vue 3
    </footer>
  </div>
</template>

<script setup>
// Importamos las utilidades de Vue
import { ref, onMounted } from 'vue'

// Variables reactivas para email, ciudad y el historial de búsquedas
const email = ref(localStorage.getItem('email') || '')
const ciudad = ref('')
const historial = ref([])

// Guarda el email en localStorage cuando cambia
function guardarEmail() {
  localStorage.setItem('email', email.value)
}

// Devuelve la URL del icono del clima de OpenWeather
function getIcon(icon) {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`
}

// Formatea la fecha a un string legible
function formatFecha(fecha) {
  return new Date(fecha).toLocaleString()
}

// Hace la búsqueda de clima usando el backend
async function buscarClima() {
  if (!email.value || !ciudad.value) return
  await fetch('http://localhost:3000/api/weather/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, city: ciudad.value }),
  })
  obtenerHistorial()
}

// Obtiene el historial de búsquedas del backend
async function obtenerHistorial() {
  if (!email.value) return
  const resp = await fetch(`http://localhost:3000/api/weather/history/${email.value}`)
  if (resp.ok) {
    historial.value = await resp.json()
  }
}

// Carga el historial cuando el componente se monta
onMounted(obtenerHistorial)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');

/* Fondo degradado a pantalla completa */
.dashboard-bg {
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  background: linear-gradient(120deg, #7fd8ea 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Container central ancho, máximo 1100px y margen auto */
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

/* Título principal */
.main-title {
  text-align: center;
  font-size: 2.9rem;
  font-weight: 700;
  color: #216583;
  margin-bottom: 2.5rem;
  letter-spacing: 1.5px;
}

/* Formulario de búsqueda con inputs grandes */
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

/* Título del historial */
.history-title {
  margin: 2.8rem 0 1.7rem 0;
  font-size: 1.7rem;
  color: #226075;
  font-weight: 600;
  text-align: center;
}

/* Texto cuando no hay búsquedas */
.empty {
  text-align: center;
  color: #7a96a5;
  font-size: 1.15rem;
  margin-top: 1.7rem;
}

/* Grid de tarjetas */
.cards-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.7rem;
  margin-bottom: 2.5rem;
}

/* Tarjetas del clima */
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

/* Pie de página siempre abajo */
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
}
</style>
