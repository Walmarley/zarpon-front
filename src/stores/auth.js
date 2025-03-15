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

    // async function checkToken() {
    //     try {
    //         const tokenAuth = 'Bearer ' + token;
    //         const { data } = await http.get('/auth/verify', {
    //             headers: {
    //                 Authorization: tokenAuth,
    //             },
    //         });
    //         return data;
    //     } catch (error) {
    //         console.log(error.response.data);
    //     }
    // }
    


    return {
        token,
        user,
        setToken,
        setUser,
        // checkToken
    }

    });