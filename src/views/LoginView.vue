<template>
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
</form>
</template>

<script setup>

import http from '@/services/http.js';
import { reactive } from 'vue';
import { useAuth } from '@/stores/auth.js';

const auth = useAuth();

const user = reactive({
  email: 'Letha_Strosin97@yahoo.com',
  password: '123456'
});

async function login(){
  try {
    const { data } = await http.post('/authenticate', user);
    console.log(data);
    auth.setToken(data.token);
    auth.setUser(data.user);
  } catch (error) {
    console.log(erro?.response?.data);
  }
}
</script>

<style lang="scss" scoped>

</style>