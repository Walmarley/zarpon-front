<script setup>
import { useLogin } from '@/composables/LoginManagement';

const { user, login, errorMessage } = useLogin();

import '@/assets/styles/LoginView.css';
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input 
          type="email" 
          placeholder="Seu Email"
          v-model="user.email"
          class="input-field"
        >
        <input 
          type="password" 
          placeholder="Sua Senha"
          v-model="user.password"
          class="input-field"
        >
        <button type="submit" class="login-button">Entrar</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

