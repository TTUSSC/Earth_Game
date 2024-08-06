import { defineStore } from 'pinia';
import { useUserStore } from './useUsersStore';
import { useClubsStore } from './useClubsStore';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        name: null,
        nick_name: null,
        email: null,
        phone: null,
        stamps: null,
        is_club: false,

        token: null,
    }),
    actions: {
        async user_login(email) {
            const usersStore = useUserStore();
            const user = await usersStore.get_user_by_email(email);
            console.log('user:');
            console.log(user);

            if (user == {}) {
                console.log('login failed :(');
            } else {
                this.token = user["user_id"];

                this.name = user["name"];
                this.nick_name = user["nick_name"];
                this.email = user["email"];
                this.phone = user["phone_number"];
                console.log("user login successed!");
            }
        },
        async club_login(email, password) {
            console.log("email: " + email);
            console.log("password: " + password);
            const clubStore = useClubsStore();
            const club = await clubStore.get_user_by_email_password(email, password);
            console.log('club: ' + club);

            if (club) {
                this.token = club["club_id"];
                this.is_club = true;

                this.name = club["name"];
                this.email = club["email"];
                console.log("club login successed!");
            } else {
                console.log('login failed :(');
                return;
            }
        },
        logout() {

        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
    }
})