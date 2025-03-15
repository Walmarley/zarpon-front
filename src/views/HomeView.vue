<script setup>
import { useUserManagement } from '@/composables/UserManagement.js';
import { useAuth } from '@/stores/auth.js';
import { ref, computed } from 'vue';
import '@/assets/styles/HomeView.css'; // Importando os estilos

const {
  users,
  errorMessage,
  permissionMessage,
  showEditModal,
  showAddModal,
  editingUser,
  newUser,
  logout,
  editUser,
  updateUser,
  deleteUser,
  openAddUserModal,
  addUser,
} = useUserManagement();

const auth = useAuth();
const isAdmin = auth.user?.role === 'admin'; // Verifica se o usuário logado é admin
const isUser = auth.user?.role === 'user';  // Verifica se o usuário logado é user

const searchQuery = ref('');
const sortColumn = ref(null);
const sortOrder = ref(1); // 1 = ascendente, -1 = descendente

// Função para ordenar a tabela
const sortedUsers = computed(() => {
  let filtered = users.value;

  if (searchQuery.value) {
    filtered = filtered.filter(user =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (sortColumn.value) {
    filtered = [...filtered].sort((a, b) => {
      const valA = a[sortColumn.value]?.toString().toLowerCase();
      const valB = b[sortColumn.value]?.toString().toLowerCase();
      return valA > valB ? sortOrder.value : valA < valB ? -sortOrder.value : 0;
    });
  }

  return filtered;
});

// Alterna a ordenação ao clicar no cabeçalho
const sortTable = column => {
  if (sortColumn.value === column) {
    sortOrder.value *= -1;
  } else {
    sortColumn.value = column;
    sortOrder.value = 1;
  }
};
</script>

<template>
  <div>
    <h2>Desafio Zarpon</h2>

    <div v-if="errorMessage">
      <p class="error-message">{{ errorMessage }}</p>
    </div>

    <div v-if="permissionMessage">
      <p class="permission-error">{{ permissionMessage }}</p>
    </div>

    <div class="button-container">
      <button class="add-btn" @click="openAddUserModal">Adicionar Usuário</button> <!-- Todos podem adicionar -->
      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <!-- Campo de busca -->
    <input v-model="searchQuery" type="text" placeholder="Buscar por nome..." class="search-input" />

    <table v-if="sortedUsers.length" class="user-table">
      <thead>
        <tr>
          <th @click="sortTable('username')">Username</th>
          <th @click="sortTable('email')">Email</th>
          <th @click="sortTable('address')">Address</th>
          <th @click="sortTable('role')">Role</th>
          <th v-if="isAdmin">Actions</th> <!-- Esconde a coluna se não for admin -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in sortedUsers" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.address }}</td>
          <td>{{ user.role }}</td>
          <td v-if="isAdmin"> <!-- Apenas admin pode ver Editar/Excluir -->
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
        <input v-model="editingUser.username" type="text" placeholder="Username" class="modal-input" />
        <input v-model="editingUser.email" type="email" placeholder="Email" class="modal-input" />
        <input v-model="editingUser.password" type="password" placeholder="Senha (opcional)" class="modal-input" />
        <input v-model="editingUser.address" type="text" placeholder="Endereço" class="modal-input" />
        <select v-model="editingUser.role" class="modal-input">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div class="modal-buttons">
          <button class="save-btn" @click="updateUser">Salvar</button>
          <button class="cancel-btn" @click="showEditModal = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de adicionar usuário -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal">
        <h3>Adicionar Usuário</h3>
        <input v-model="newUser.username" type="text" placeholder="Username" class="modal-input" />
        <input v-model="newUser.email" type="email" placeholder="Email" class="modal-input" />
        <input v-model="newUser.password" type="password" placeholder="Senha" class="modal-input" />
        <input v-model="newUser.address" type="text" placeholder="Endereço" class="modal-input" />
        
        <select v-model="newUser.role" class="modal-input">
          <option value="user">User</option>
          <option v-if="isAdmin" value="admin">Admin</option> <!-- Apenas admin pode criar admin -->
        </select>

        <div class="modal-buttons">
          <button class="save-btn" @click="addUser">Criar Usuário</button>
          <button class="cancel-btn" @click="showAddModal = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>
