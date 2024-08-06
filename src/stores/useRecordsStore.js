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
        }
    },
    getters: {}
})