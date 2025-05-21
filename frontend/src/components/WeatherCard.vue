<template>
  <!-- Tarjeta principal del historial, muestra datos del clima consultado -->
  <div class="weather-card">
    <div class="weather-details">
      <!-- Fila superior: ciudad, país y fecha -->
      <div class="weather-card-row-top">
        <div class="city-country">
          <!-- Ciudad consultada -->
          <span class="city">{{ busqueda.city }}</span>
          <!-- País de la ciudad -->
          <span class="country">, {{ busqueda.country }}</span>
        </div>
        <!-- Fecha/hora de la consulta -->
        <div class="weather-card-date">{{ formatFecha(busqueda.date) }}</div>
      </div>
      <!-- Fila media: descripción del clima y, si existe, icono -->
      <div class="weather-card-row-mid">
        <span class="weather-description">{{ busqueda.description }}</span>
        <!-- Muestra el icono del clima si existe en los datos -->
        <span v-if="busqueda.icon" class="weather-icon">
          <img :src="getIcon(busqueda.icon)" :alt="busqueda.description" />
        </span>
      </div>
      <!-- Fila inferior: detalles del clima -->
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
      <!-- Si existe información del usuario, la muestra (útil para multiusuario) -->
      <div class="weather-card-user" v-if="busqueda.user && busqueda.user.email">
        <span class="weather-label">Usuario:</span>
        <span class="weather-value">{{ busqueda.user.email }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// Recibe por props el objeto busqueda con todos los datos del clima
const props = defineProps({ busqueda: Object })

// Devuelve la URL del icono del clima según el código recibido (OpenWeather)
function getIcon(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`
}

// Formatea la fecha en formato corto (ej: 22/5/25, 19:00)
function formatFecha(fecha) {
  const d = new Date(fecha)
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
}
</script>
