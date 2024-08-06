import { defineStore } from 'pinia';
import { useUserStore } from './useUsersStore';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        name: null,
        nick_name: null,
        email: null,
        phone: null,
        stamps: null,

        token: null,
    }),
    actions: {
        async login(email) {
            const usersStore = useUserStore();

            let user = usersStore.get_user_by_email(email);
            if (user) {
                this.token = user["user_id"];

                this.name = user["name"];
                this.nick_name = user["nick_name"];
                this.email = user["email"];
                this.phone = user["phone_number"];
                console.log("login successed!");
            } else {
                console.log('login failed :(');
            }
        },
        logout() {

        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    }
})