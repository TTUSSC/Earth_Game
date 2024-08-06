import { defineStore } from 'pinia';

export const useUserStore = defineStore('auth', {
    state: () => ({
        name: null,
        nick_name: null,
        email: null,
        phone: null,
        stamps: null,

        token: null,
    }),
    actions: {

        async login() {

        },
        logout() {

        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    }
})