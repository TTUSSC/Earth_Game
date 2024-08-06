import { defineStore } from 'pinia';
import axios from 'axios';

let url = "https://script.google.com/macros/s/AKfycbwQGQY4CAhuYzI5AoAzsbWx4-aXTAONiZXpXq7Ue3MkojbgbvuKnDWXLk8wDZJLyx7P_g/exec";

export const useRecordsStore = defineStore('records', {
    state: () => ({
        data: null,
    }),
    actions: {
        async callAPI() {
            const response = await axios.get(url, {
                params: {
                    table: "records"
                }
            });
            this.data = response.data;
            console.log('useRecordsStore:');
            console.log(this.data);
        },
        async query_record(club_email, user_email) {
            await this.callAPI();
            for (let i = 0; i < this.data.length; i++) {
                if (this.data['club_email'] === club_email && this.data['user_email'] === user_email) {
                    console.log("record found:");
                    console.log(this.data[i]);
                    return this.data[i];
                }
            }
            console.log("record not found.");
            return false;
        },
        async query_by_user(user_email) {
            await this.callAPI();
            for (let i = 0; i < this.data.length; i++) {
                if (this.data['user_email'] === user_email) {
                    console.log("record found:");
                    console.log(this.data[i]);
                    return this.data[i];
                }
            }
            console.log("record not found.");
            return false;
        },
        async query_by_club(club_email) {
            await this.callAPI();
            for (let i = 0; i < this.data.length; i++) {
                if (this.data['club_email'] === club_email) {
                    console.log("record found:");
                    console.log(this.data[i]);
                    return this.data[i];
                }
            }
            console.log("record not found.");
            return false;
        }
    },
    getters: {}
})