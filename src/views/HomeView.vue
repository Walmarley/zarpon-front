<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth.js';
import http from '@/services/http.js';

const auth = useAuth();
const router = useRouter();
const users = ref([]);
const errorMessage = ref('');

// Se o usuário não estiver autenticado, redireciona para o login
if (!auth.token) {
  router.push({ name: 'login' });
}

// Função para buscar os dados dos usuários no backend
async function fetchUsers() {
  try {
    const response = await http.get('/user', {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    users.value = response.data; // Armazena os dados na variável reativa
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    errorMessage.value = 'Falha na autenticação. Faça login novamente.';
    logout(); // Se houver erro, faz logout
  }
}

// Chama a função ao carregar a página
onMounted(() => {
  fetchUsers();
});

// Função de logout
function logout() {
  auth.clearAuth(); // Remove token e dados do usuário
  router.push({ name: 'login' }); // Redireciona para login
}
</script>

<template>
  <div>
    <h2>Bem-vindo à Home</h2>
    
    <div v-if="errorMessage">
      <p style="color: red;">{{ errorMessage }}</p>
    </div>

    <table v-if="users.length" class="user-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Address</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.role }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped>
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.user-table th {
  background-color: #f4f4f4;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
