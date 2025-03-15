import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import { useAuth } from '../stores/auth.js';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView, // Login será a página inicial
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { auth: true }, // Requer autenticação
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Middleware para proteger rotas autenticadas
router.beforeEach((to, from, next) => {
  const auth = useAuth();

  if (to.meta.auth && !auth.token) {
    next({ name: 'login' }); // Se não estiver autenticado, redireciona para Login
  } else {
    next(); // Caso contrário, permite o acesso
  }
});

export default router;
