import { defineStore } from 'pinia';
import axios from 'axios';

let url = "https://script.google.com/macros/s/AKfycbwQGQY4CAhuYzI5AoAzsbWx4-aXTAONiZXpXq7Ue3MkojbgbvuKnDWXLk8wDZJLyx7P_g/exec";

export const useClubsStore = defineStore('clubs', {
    state: () => ({
        data: null,
    }),
    actions: {
        async callAPI() {
            try {
                const response = await axios.get(url, {
                    params: {
                        table: "clubs"
                    }
                });
                this.data = response.data;
                console.log('useClubsStore:');
                console.log(this.data);
            } catch (error) {
                console.log('call api error: ' + error);
                return;
            }
        },
        async get_user_by_email_password(email, password) {
            if (this.data === null) await this.callAPI();
            for (let i = 0; i < this.data.length; i++) {
                console.log(this.data[i]['email'] + ' ' + this.data[i]['password']);
                if (this.data[i]['email'] == email && this.data[i]['password'] == password) {
                    console.log("club found:");
                    console.log(this.data[i]);
                    return this.data[i];
                }
            }
            console.log('club not found.')
            return false;
        }
    },
    getters: {}
})