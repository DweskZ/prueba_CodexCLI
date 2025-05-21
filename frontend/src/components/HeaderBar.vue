<template>
  <!-- Barra superior del dashboard con el nombre de la app y controles de usuario -->
  <div class="header-bar">
    <!-- Nombre de la app a la izquierda -->
    <div class="app-name">Dashboard del Clima</div>
    <!-- Controles de usuario (email y botón de logout) a la derecha -->
    <div class="user-controls">
      <!-- Muestra el email del usuario logueado -->
      <span class="user-email">{{ user.email }}</span>
      <!-- Botón para cerrar sesión. Emite el evento 'logout' al hacer click -->
      <button class="logout-btn" @click="$emit('logout')">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
// Recibe el objeto user como propiedad desde el padre (App.vue)
defineProps({ user: Object })
</script>
