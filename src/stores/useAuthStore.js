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
        access_priv: false,
        records: null,
    }),
    actions: {
        async get_user_records() {
            const recordsStore = useRecordsStore();
            if (!this.isLoggedIn) return;
            this.records = await recordsStore.query_by_user(this.email)
            console.log("email: " + this.email, this.records)
        },
        async get_club_records() {
            const recordsStore = useRecordsStore();
            if (!this.isLoggedIn) return;
            this.records = await recordsStore.query_by_club(this.email)
            console.log("email: " + this.email, this.records)
        },
        async user_login(email) {
            email = email.toLowerCase();
            const usersStore = useUserStore();
            try {
                const user = await usersStore.get_user_by_email(email);
                console.log('user:', user);

                if (!user) {
                    console.log('login failed :(');
                } else {
                    this.token = user["user_id"];
                    this.access_priv = user["access_priv"];

                    this.name = user["name"];
                    this.nick_name = user["nick_name"];
                    this.department = user["department"];
                    this.email = user["email"];
                    this.phone = user["phone_number"];
                    console.log("user login successful!");
                }
            } catch (error) {
                console.error('Login error:', error);
                return false;
            }
        },
        async club_login(email, password) {
            console.log("email:", email, "password:", password);
            const clubStore = useClubsStore();
            const club = await clubStore.get_user_by_email_password(email, password);
            console.log('club: ' + club);

            if (club) {
                this.token = club["club_id"];
                this.is_club = true;

                this.name = club["name"];
                this.email = club["email"];
                console.log("club login successful!");
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
            this.department = null;
            this.email = null;
            this.phone = null;
            console.log('logout successed :p');
        },
        async update_auth() {
            /**
             * 更新使用者資料 usersStore
             */
            if (!this.isLoggedIn) return;
            const usersStore = useUserStore();
            await usersStore.callAPI();
            try {
                const user = await usersStore.get_user_by_email(this.email);
                console.log('user:', user);

                if (!user) {
                    console.log('Update auth data failed, unknown account:', this.email);
                } else {
                    this.token = user["user_id"];
                    this.access_priv = user["access_priv"];

                    this.name = user["name"];
                    this.nick_name = user["nick_name"];
                    this.department = user["department"];
                    this.email = user["email"];
                    this.phone = user["phone_number"];

                    if (!this.is_club) this.get_user_records();
                    else this.get_club_records();

                    console.log("Update auth data successful!");
                }
            } catch (error) {
                console.error('Update auth data error:', error);
                return false;
            }

        }
    },
    getters: {
        isLoggedIn: (state) => !!state.token,
        records_len: (state) => {
            if (state.records == null) return 0;
            else return state.records.length;
        },
        get_access_priv: (state) => state.access_priv,
        get_records: (state) => state.records
    }
})