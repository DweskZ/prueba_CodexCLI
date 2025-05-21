<template>
  <!-- Contenedor general de la sección de historial de búsquedas -->
  <div class="history-section">
    <!-- Título de la sección -->
    <div class="history-title">Historial de búsquedas</div>
    <!-- Contenedor de tarjetas del historial (con scroll si hay muchas) -->
    <div class="history-cards-container">
      <!-- Si el historial está vacío, muestra un mensaje -->
      <div v-if="!historial.length" class="weather-card empty-card">
        Sin búsquedas aún.
      </div>
      <!-- Si hay historial, muestra una tarjeta por cada búsqueda -->
      <div v-else class="history-cards">
        <!-- Componente WeatherCard por cada objeto del historial -->
        <WeatherCard v-for="b in historial" :key="b.id" :busqueda="b" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Importa el componente de tarjeta individual
import WeatherCard from './WeatherCard.vue'
// Recibe el historial como prop (es un array de objetos con datos del clima)
defineProps({ historial: Array })
</script>
