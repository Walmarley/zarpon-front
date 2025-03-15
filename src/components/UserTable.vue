<!-- src/components/UserTable.vue -->
<template>
    <div>
      <input 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', $event.target.value)" 
        type="text" 
        class="search-input" 
        placeholder="Pesquisar por nome, email ou endereço" 
      />
      
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
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps(['sortedUsers', 'searchQuery', 'sortTable', 'editUser', 'deleteUser']);
  const emit = defineEmits(['update:searchQuery']);
  </script>
  