import { defineStore } from 'pinia';
import { useUserStore } from './useUsersStore';
import { useClubsStore } from './useClubsStore';
import { useRecordsStore } from './useRecordsStore';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        name: null,
        nick_name: null,
        department: null,
        email: null,
        phone: null,
        stamps: null,
        is_club: false,

        token: null,
        records: null,
    }),
    actions: {
        async get_records() {
            const recordsStore = useRecordsStore();
            if (!this.isLoggedIn) return;
            this.records = await recordsStore.query_by_user(this.email)
            console.log("email: " + this.email, this.records)
        },
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
                this.department = user["department"];
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
            this.token = null;
            this.is_club = false;
            this.records = null;

            this.name = null;
            this.nick_name = null;
            this.email = null;
            this.phone = null;
            console.log('logout successed :p');
        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
        records_len: (state) => {
            if (state.records == null) return 0;
            else return state.records.length;
        }
    }
})