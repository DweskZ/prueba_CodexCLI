<template>
  <!-- Sección de búsqueda de clima -->
  <div class="search-section">
    <!-- Título de la sección -->
    <div class="search-title">Buscar clima</div>
    <!-- Formulario para ingresar la ciudad y buscar -->
    <form class="search-form" @submit.prevent="buscar">
      <!-- Input donde el usuario escribe el nombre de la ciudad -->
      <input
        v-model="ciudad"
        class="city-input"
        type="text"
        placeholder="Ingrese una ciudad"
        required
      />
      <!-- Botón para enviar la búsqueda -->
      <button class="primary-btn" type="submit">Buscar</button>
    </form>
  </div>
</template>

<script setup>
// Importa la función ref para variables reactivas
import { ref } from 'vue'
// Definimos el evento personalizado "buscar" que será escuchado por el componente padre (App.vue)
const emit = defineEmits(['buscar'])
// Variable reactiva para el input de la ciudad
const ciudad = ref('')
// Función que se ejecuta al enviar el formulario
function buscar() {
  // Emite el evento "buscar" con el valor de la ciudad al padre
  emit('buscar', ciudad.value)
  // Limpia el input después de buscar
  ciudad.value = ''
}
</script>
