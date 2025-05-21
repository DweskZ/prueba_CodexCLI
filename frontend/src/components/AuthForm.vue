<template>
  <div class="auth-dual-center">
    <!-- === SECCIÓN LOGIN === -->
    <div class="auth-card-side auth-login">
      <!-- Título y subtítulo del panel de login -->
      <div class="app-title main-title">Dashboard del Clima</div>
      <div class="subtitle">Consulta el clima en cualquier lugar, en cualquier momento</div>
      <!-- Formulario de inicio de sesión -->
      <form @submit.prevent="$emit('login', loginEmail, loginPassword)" class="auth-form">
        <div class="form-title">Iniciar sesión</div>
        <div class="field-group">
          <label for="loginEmail">Correo electrónico</label>
          <!-- Input de email para login -->
          <input id="loginEmail" v-model="loginEmail" type="email" placeholder="Ingresa tu correo electrónico" required autocomplete="username" />
        </div>
        <div class="field-group">
          <label for="loginPassword">Contraseña</label>
          <!-- Input de contraseña para login -->
          <input id="loginPassword" v-model="loginPassword" type="password" placeholder="Ingresa tu contraseña" required autocomplete="current-password" />
        </div>
        <!-- Botón para enviar el login -->
        <button class="primary-btn" type="submit">Iniciar sesión</button>
        <!-- Mensaje de error para login -->
        <div v-if="authMsg && authMsgType === 'login'" class="auth-msg">{{ authMsg }}</div>
      </form>
    </div>
    <!-- === DIVISOR ENTRE LOGIN Y REGISTRO === -->
    <div class="divider-vertical">
      <div class="divider-line"></div>
      <div class="divider-text">o</div>
      <div class="divider-line"></div>
    </div>
    <!-- === SECCIÓN REGISTRO === -->
    <div class="auth-card-side auth-register">
      <div class="form-title main-title">Crear cuenta</div>
      <div class="subtitle">¿No tienes cuenta? Regístrate gratis:</div>
      <!-- Formulario de registro -->
      <form @submit.prevent="$emit('register', registerEmail, registerPassword)" class="auth-form">
        <div class="field-group">
          <label for="registerEmail">Correo electrónico</label>
          <!-- Input de email para registro -->
          <input id="registerEmail" v-model="registerEmail" type="email" placeholder="Ingresa tu correo electrónico" required autocomplete="username" />
        </div>
        <div class="field-group">
          <label for="registerPassword">Contraseña</label>
          <!-- Input de contraseña para registro -->
          <input id="registerPassword" v-model="registerPassword" type="password" placeholder="Ingresa tu contraseña" required autocomplete="new-password" />
        </div>
        <!-- Botón para enviar el registro -->
        <button class="secondary-btn" type="submit">Registrarse</button>
        <!-- Mensaje de error para registro -->
        <div v-if="authMsg && authMsgType === 'register'" class="auth-msg">{{ authMsg }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// Definimos las propiedades recibidas del padre (mensaje de error y tipo de mensaje)
const props = defineProps(['authMsg', 'authMsgType'])
// Variables reactivas para los campos de login y registro
const loginEmail = ref('')
const loginPassword = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
</script>
