import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import { useAuth } from '@/stores/auth.js';
import http from '@/services/http.js';

export function useLogin() {
  const router = useRouter();
  const auth = useAuth();
  const errorMessage = ref('');

  const user = reactive({
    email: '',
    password: ''
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

  return { user, login, errorMessage };
}
