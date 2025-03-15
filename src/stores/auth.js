import { ref } from "vue";
import { defineStore } from "pinia";
import http from "@/services/http.js";

export const useAuth = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token'));
    const user = ref(JSON.parse(localStorage.getItem('user')));

    function setToken(tokenValue) {
        localStorage.setItem('token', tokenValue);
        token.value = tokenValue;
    }

    function setUser(userValue) {
        const userString = JSON.stringify(userValue);
        localStorage.setItem("user", userString);
        user.value = userValue;
    }

    function clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token.value = null;
        user.value = null;
    }

    return {
        token,
        user,
        setToken,
        setUser,
        clearAuth,
    };
});
