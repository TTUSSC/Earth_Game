import { defineStore } from 'pinia';
import axios from 'axios';

let url = "https://script.google.com/macros/s/AKfycbwQGQY4CAhuYzI5AoAzsbWx4-aXTAONiZXpXq7Ue3MkojbgbvuKnDWXLk8wDZJLyx7P_g/exec";

export const useUserStore = defineStore('users', {
    state: () => ({
        data: null,
    }),
    actions: {
        async callAPI() {
            try {
                const response = await axios.get(url, {
                    params: {
                        table: "users"
                    }
                });
                this.data = response.data;
                console.log('useUsersStore:', this.data);
            } catch (error) {
                console.log('call api error: ' + error);
                return;
            }
        },
        async get_user_by_email(email) {
            if (this.data === null) await this.callAPI();
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i]['email'] === email) {
                    console.log("user found: ", this.data[i]);
                    return this.data[i];
                }
            }
            console.log("user not found.");
            return false;
        },
    },
    getters: {
        get_data() {
            return this.data;
        },
    }
})