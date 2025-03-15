<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth.js';
import http from '@/services/http.js';

const auth = useAuth();
const router = useRouter();
const users = ref([]);
const errorMessage = ref('');
const permissionMessage = ref('');
const showEditModal = ref(false);
const showAddModal = ref(false);
const editingUser = ref({ username: '', email: '', password: '', address: '', role: 'user' });
const newUser = ref({ username: '', email: '', password: '', address: '', role: 'user' });

// Se o usuário não estiver autenticado, redireciona para o login
if (!auth.token) {
  router.push({ name: 'login' });
}

// Função para buscar os dados dos usuários no backend
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

// Chama a função ao carregar a página
onMounted(() => {
  fetchUsers();
});

// Função de logout
function logout() {
  auth.clearAuth();
  router.push({ name: 'login' });
}

// Exibe mensagem de erro de permissão
function showPermissionError() {
  permissionMessage.value = 'Você não tem permissão para realizar esta ação.';
  setTimeout(() => {
    permissionMessage.value = '';
  }, 3000);
}

// Abrir modal de edição
function editUser(user) {
  if (auth.user.role !== 'admin') {
    showPermissionError();
    return;
  }
  editingUser.value = { ...user, password: '' };
  showEditModal.value = true;
}

// Atualizar usuário
async function updateUser() {
  try {
    await http.put(`/user/${editingUser.value.id}`, editingUser.value, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    users.value = users.value.map(user =>
      user.id === editingUser.value.id ? { ...editingUser.value } : user
    );

    showEditModal.value = false;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
  }
}

// Excluir usuário
async function deleteUser(user) {
  if (auth.user.role !== 'admin') {
    showPermissionError();
    return;
  }

  if (!confirm(`Tem certeza que deseja excluir ${user.username}?`)) return;

  try {
    await http.delete(`/user/${user.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    users.value = users.value.filter(u => u.id !== user.id);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
  }
}

// Abrir modal de adicionar usuário
function openAddUserModal() {
  newUser.value = { username: '', email: '', password: '', address: '', role: 'user' };
  showAddModal.value = true;
}

// Criar novo usuário
async function addUser() {
  try {
    await http.post('/register', newUser.value, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    fetchUsers();
    showAddModal.value = false;
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
  }
}
</script>

<template>
  <div>
    <h2>Bem-vindo à Home</h2>

    <div v-if="errorMessage">
      <p style="color: red;">{{ errorMessage }}</p>
    </div>

    <div v-if="permissionMessage">
      <p class="permission-error">{{ permissionMessage }}</p>
    </div>

    <!-- Contêiner para alinhar os botões -->
    <div class="button-container">
      <button v-if="auth.user.role === 'admin'" class="add-btn" @click="openAddUserModal">
        Adicionar Usuário
      </button>
      <button class="logout-btn" @click="logout">
        Logout
      </button>
    </div>

    <table v-if="users.length" class="user-table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Address</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
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

    <!-- Modal de edição -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal">
        <h3>Editar Usuário</h3>
        <input v-model="editingUser.username" type="text" placeholder="Username" />
        <input v-model="editingUser.email" type="email" placeholder="Email" />
        <input v-model="editingUser.password" type="password" placeholder="Senha (opcional)" />
        <input v-model="editingUser.address" type="text" placeholder="Endereço" />
        <select v-model="editingUser.role">
          <option value="user">User</option>
          <option v-if="auth.user.role === 'admin'" value="admin">Admin</option>
        </select>

        <button @click="updateUser">Salvar</button>
        <button @click="showEditModal = false">Cancelar</button>
      </div>
    </div>

    <!-- Modal de adicionar usuário -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h3>Adicionar Usuário</h3>
        <input v-model="newUser.username" type="text" placeholder="Username" />
        <input v-model="newUser.email" type="email" placeholder="Email" />
        <input v-model="newUser.password" type="password" placeholder="Senha" />
        <input v-model="newUser.address" type="text" placeholder="Endereço" />
        <select v-model="newUser.role">
          <option value="user">User</option>
          <option v-if="auth.user.role === 'admin'" value="admin">Admin</option>
        </select>

        <button @click="addUser">Criar Usuário</button>
        <button @click="showAddModal = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button-container {
  display: flex;
  gap: 10px; /* Espaço entre os botões */
  margin-bottom: 20px;
}

.logout-btn {
  background-color: #ff5722;
  color: white;
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
}

.user-table th {
  background-color: #f4f4f4;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.add-btn {
  background-color: #28a745;
  color: white;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.permission-error {
  background: #ffcccc;
  color: red;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 350px;
  text-align: center;
}
</style>
