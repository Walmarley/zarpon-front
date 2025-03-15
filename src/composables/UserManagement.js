import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth.js';
import http from '@/services/http.js';

export function useUserManagement() {
  const auth = useAuth();
  const router = useRouter();
  const users = ref([]);
  const errorMessage = ref('');
  const permissionMessage = ref('');
  const showEditModal = ref(false);
  const showAddModal = ref(false);
  const editingUser = ref({ username: '', email: '', password: '', address: '', role: 'user' });
  const newUser = ref({ username: '', email: '', password: '', address: '', role: 'user' });

  // Redireciona se não estiver autenticado
  if (!auth.token) {
    router.push({ name: 'login' });
  }

  // Buscar usuários
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

  // Logout
  function logout() {
    auth.clearAuth();
    router.push({ name: 'login' });
  }

  // Exibir erro de permissão
  function showPermissionError() {
    permissionMessage.value = 'Você não tem permissão para realizar esta ação.';
    setTimeout(() => {
      permissionMessage.value = '';
    }, 3000);
  }

  // Editar usuário
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

  // Criar usuário
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

  // Buscar usuários ao montar o componente
  onMounted(() => {
    fetchUsers();
  });

  return {
    users,
    errorMessage,
    permissionMessage,
    showEditModal,
    showAddModal,
    editingUser,
    newUser,
    fetchUsers,
    logout,
    showPermissionError,
    editUser,
    updateUser,
    deleteUser,
    openAddUserModal,
    addUser,
  };
}
