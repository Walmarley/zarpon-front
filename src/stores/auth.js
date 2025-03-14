import { ref } from "vue";
import { defineStore } from "pinia";

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
        // localStorage.setItem('user', userValue);
        user.value = userValue;
    }

    return {
        setToken,
        setUser,
    }

    });