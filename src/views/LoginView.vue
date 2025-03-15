<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input 
        type="email" 
        placeholder="Seu Email"
        v-model="user.email"
      >
      <input 
        type="password" 
        placeholder="Sua Senha"
        v-model="user.password"
      >
      <button type="submit">Login</button>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import { useAuth } from '@/stores/auth.js';
import http from '@/services/http.js';

const router = useRouter();
const auth = useAuth();
const errorMessage = ref('');

const user = reactive({
  email: 'Alberto56@yahoo.com',
  password: '123456'
});

async function login() {
  try {
    const { data } = await http.post('/authenticate', user);
    
    auth.setToken(data.token);
    auth.setUser(data.user);
    
    // Redireciona para a Home após login bem-sucedido
    router.push({ name: 'home' });

  } catch (error) {
    errorMessage.value = 'Email ou senha incorretos. Tente novamente.';
  }
}
</script>
