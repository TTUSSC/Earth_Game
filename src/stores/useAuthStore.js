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

            const user = await usersStore.get_user_by_email(email);
            console.log('user:')
            console.log(user)
            if (user == {}) {
                console.log('login failed :(');
            } else {
                this.token = user["user_id"];

                this.name = user["name"];
                this.nick_name = user["nick_name"];
                this.email = user["email"];
                this.phone = user["phone_number"];
                console.log("login successed!");
            }
        },
        logout() {

        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    }
})