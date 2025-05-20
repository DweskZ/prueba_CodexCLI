<template>
  <div class="dashboard-bg">
    <div class="container">
      <h1 class="main-title">🌤️ Dashboard del Clima</h1>
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

      <h2 class="history-title">Historial de búsquedas</h2>
      <div v-if="historial.length === 0" class="empty">Sin búsquedas aún.</div>
      <div v-else class="cards-grid">
        <div v-for="busqueda in historial" :key="busqueda.id" class="weather-card" v-motion-fade>
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
    <footer class="footer">Desarrollado por Carlos | Powered by OpenWeather & Vue 3</footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Animaciones de entrada (solo si tienes vueuse/motion o puedes eliminar v-motion-fade si no lo usas)
const email = ref(localStorage.getItem('email') || '')
const ciudad = ref('')
const historial = ref([])

function guardarEmail() {
  localStorage.setItem('email', email.value)
}

function getIcon(icon) {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`
}

function formatFecha(fecha) {
  return new Date(fecha).toLocaleString()
}

async function buscarClima() {
  if (!email.value || !ciudad.value) return
  await fetch('http://localhost:3000/api/weather/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.value, city: ciudad.value }),
  })
  obtenerHistorial()
}

async function obtenerHistorial() {
  if (!email.value) return
  const resp = await fetch(`http://localhost:3000/api/weather/history/${email.value}`)
  if (resp.ok) {
    historial.value = await resp.json()
  }
}

onMounted(obtenerHistorial)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
.dashboard-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #7fd8ea 0%, #ffffff 100%);
  padding-bottom: 50px;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem 0 1rem;
  font-family: 'Montserrat', Arial, sans-serif;
}
.main-title {
  text-align: center;
  font-size: 2.6rem;
  font-weight: 600;
  color: #216583;
  margin-bottom: 2rem;
  letter-spacing: 1px;
}
.search-form {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2.5rem;
}
.search-form input {
  padding: 0.7rem 1rem;
  font-size: 1.1rem;
  border: 1px solid #aad8d3;
  border-radius: 1.5rem;
  outline: none;
  background: #f8fbfa;
  transition: border 0.2s;
  width: 230px;
}
.search-form input:focus {
  border: 1.5px solid #53a7c0;
}
.search-form button {
  background: linear-gradient(90deg, #53a7c0 0%, #3295a8 100%);
  color: white;
  padding: 0.7rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 1.5rem;
  font-weight: 600;
  box-shadow: 0 3px 12px #53a7c026;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.search-form button:hover {
  background: linear-gradient(90deg, #3295a8 0%, #53a7c0 100%);
  transform: translateY(-2px) scale(1.04);
}
.history-title {
  margin: 2.5rem 0 1.5rem 0;
  font-size: 1.5rem;
  color: #226075;
  font-weight: 500;
  text-align: center;
}
.empty {
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  margin-top: 1.5rem;
}
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}
.weather-card {
  background: #ffffffd9;
  border-radius: 1.5rem;
  box-shadow: 0 6px 24px #5abedb21, 0 2px 8px #99b1c921;
  padding: 1.2rem 1.3rem 1.1rem 1.3rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s, box-shadow 0.15s;
  position: relative;
  overflow: hidden;
}
.weather-card:hover {
  transform: translateY(-6px) scale(1.025);
  box-shadow: 0 16px 40px #5abedb25, 0 4px 16px #99b1c935;
}
.weather-card .header {
  display: flex;
  align-items: center;
  margin-bottom: 0.9rem;
  gap: 1rem;
}
.weather-card img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e4f3fa;
  border: 2.5px solid #bce2f0;
}
.weather-card h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #21516c;
  font-weight: 600;
}
.fecha {
  font-size: 0.92rem;
  color: #577d93;
  margin-top: 0.15rem;
}
.info .row {
  display: flex;
  justify-content: space-between;
  margin: 0.2rem 0;
  font-size: 1.06rem;
  color: #357fa6;
}
.footer {
  text-align: center;
  color: #22607599;
  font-size: 1rem;
  margin-top: 2.5rem;
  padding: 1.5rem 0 0 0;
  font-family: 'Montserrat', Arial, sans-serif;
}
@media (max-width: 600px) {
  .search-form {
    flex-direction: column;
    gap: 0.7rem;
    align-items: center;
  }
  .main-title {
    font-size: 2rem;
  }
  .container {
    padding: 1rem 0.2rem 0 0.2rem;
  }
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
