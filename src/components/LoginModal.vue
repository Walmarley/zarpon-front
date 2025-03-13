<template>
    <div class="modal-overlay" v-if="isOpen" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">E-mail:</label>
            <input type="email" id="email" v-model="credentials.email" required />
          </div>
          <div class="form-group">
            <label for="password">Senha:</label>
            <input type="password" id="password" v-model="credentials.password" required />
          </div>
          <button type="submit">Entrar</button>
          <button type="button" @click="closeModal">Fechar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import AuthService from '@/services/auth';
  
  export default {
    data() {
      return {
        isOpen: false,
        credentials: {
          email: '',
          password: '',
        },
      };
    },
    methods: {
      openModal() {
        this.isOpen = true;
      },
      closeModal() {
        this.isOpen = false;
      },
      async handleLogin() {
        try {
          const response = await AuthService.login(this.credentials);
          console.log('Login realizado:', response);
          this.closeModal();
          this.$emit('login-success');
        } catch (error) {
          console.error('Erro no login:', error);
          alert('Erro ao fazer login. Verifique suas credenciais.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
  }
  
  button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button[type="submit"] {
    background-color: #42b983;
    color: white;
  }
  
  button[type="button"] {
    background-color: #ccc;
  }
  </style>