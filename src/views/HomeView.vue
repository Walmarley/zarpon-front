<template>
  <div>
    <h1>Home</h1>
    <button @click="openLoginModal">Abrir Modal de Login</button>

    <!-- Tabela de Usuários -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Role</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.address }}</td>
            <td>
              <button @click="editUser(user)" class="edit-btn">Editar</button>
              <button @click="deleteUser(user)" class="delete-btn">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Login -->
    <LoginModal ref="loginModal" @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
import axios from 'axios';
import LoginModal from '@/components/LoginModal.vue';

export default {
  components: {
    LoginModal,
  },
  data() {
    return {
      users: [], // Lista de usuários vazia inicialmente
    };
  },
  methods: {
    openLoginModal() {
      this.$refs.loginModal.openModal();
    },
    handleLoginSuccess() {
      console.log('Usuário logado com sucesso!');
    },
    editUser(user) {
      console.log('Editar usuário:', user);
      // Implemente a lógica de edição aqui
    },
    deleteUser(user) {
      console.log('Excluir usuário:', user);
      // Implemente a lógica de exclusão aqui
    },
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3333/user');
        this.users = response.data;
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    },
  },
  mounted() {
    this.fetchUsers(); // Busca os usuários quando o componente é montado
  },
};
</script>

<style scoped>
.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}

.edit-btn,
.delete-btn {
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #42b983;
  color: white;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
}

.edit-btn:hover {
  background-color: #3aa876;
}

.delete-btn:hover {
  background-color: #e63939;
}
</style>