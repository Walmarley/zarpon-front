import http from '@/services/http.js';

export async function fetchUsers(token) {
  try {
    const response = await http.get('/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Falha na autenticação. Faça login novamente.');
  }
}

export function deleteUser(user, role, setMessage) {
  if (role !== 'admin') {
    setMessage('Usuário não tem permissão para excluir!');
    return;
  }
  console.log('Excluir usuário:', user);
}

export function editUser(user, role, router, setMessage) {
  if (role !== 'admin') {
    setMessage('Usuário não tem permissão para editar!');
    return;
  }
  console.log('Editar usuário:', user);
  router.push(`/user/${user.id}`);
}
