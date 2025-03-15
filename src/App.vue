<template>

  <ul>
    <li>
      <router-link :to="{name:'home'}">Home</router-link>
    </li>
    <li>
      <router-link :to="{name:'login'}">Login</router-link>
    </li>
    <li>
      <router-link :to="{name:'dashboard'}">Dashboard</router-link>
    </li>
  </ul>

  <router-view />
</template>

<script setup>
import { useAuth } from '@/stores/auth.js';

const auth = useAuth();

</script>

<style lang="scss" scoped>

</style>