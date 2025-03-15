<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth.js';
import http from '@/services/http.js';

const auth = useAuth();
const router = useRouter();
const users = ref([]);
const errorMessage = ref('');
const permissionMessage = ref('');
const searchQuery = ref('');
const sortKey = ref('');
const sortOrder = ref(1);

if (!auth.token) {
  router.push({ name: 'login' });
}

async function fetchUsers() {
  try {
    const response = await http.get('/user', {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    users.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    errorMessage.value = 'Falha na autenticação. Faça login novamente.';
    logout();
  }
}

onMounted(fetchUsers);

function logout() {
  auth.clearAuth();
  router.push({ name: 'login' });
}

function editUser(user) {
  if (auth.user.role !== 'admin') {
    permissionMessage.value = 'Usuário não tem permissão para editar!';
    return;
  }
  console.log('Editar usuário:', user);
  router.push(`/user/${user.id}`);
}

function deleteUser(user) {
  if (auth.user.role !== 'admin') {
    permissionMessage.value = 'Usuário não tem permissão para excluir!';
    return;
  }
  console.log('Excluir usuário:', user);
}

function sortTable(column) {
  if (sortKey.value === column) {
    sortOrder.value *= -1;
  } else {
    sortKey.value = column;
    sortOrder.value = 1;
  }
}

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const sortedUsers = computed(() => {
  if (!sortKey.value) return filteredUsers.value;
  return [...filteredUsers.value].sort((a, b) => {
    const aValue = a[sortKey.value].toLowerCase();
    const bValue = b[sortKey.value].toLowerCase();
    return (aValue > bValue ? 1 : -1) * sortOrder.value;
  });
});
</script>

<template>
  <div>
    <h2>Bem-vindo à Home</h2>

    <div class="button-container">
      <button @click="logout" class="logout-btn">Logout</button>
      <button v-if="auth.user.role === 'admin'" class="add-btn">Adicionar Usuário</button>
    </div>

    <div v-if="errorMessage">
      <p class="error">{{ errorMessage }}</p>
    </div>

    <div v-if="permissionMessage">
      <p class="permission-error">{{ permissionMessage }}</p>
    </div>

    <input v-model="searchQuery" type="text" class="search-input" placeholder="Pesquisar por nome, email ou endereço" />

    <table v-if="sortedUsers.length" class="user-table">
      <thead>
        <tr>
          <th @click="sortTable('username')">Username</th>
          <th @click="sortTable('email')">Email</th>
          <th @click="sortTable('address')">Address</th>
          <th @click="sortTable('role')">Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in sortedUsers" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button class="edit-btn" @click="editUser(user)">Editar</button>
            <button class="delete-btn" @click="deleteUser(user)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.logout-btn, .add-btn {
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.logout-btn {
  background-color: red;
  color: white;
}

.add-btn {
  background-color: green;
  color: white;
}

.search-input {
  margin-bottom: 10px;
  padding: 8px;
  width: 100%;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th, .user-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
  cursor: pointer;
}

.user-table th {
  background-color: #f4f4f4;
}

.edit-btn {
  background-color: blue;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;
}

.delete-btn {
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
