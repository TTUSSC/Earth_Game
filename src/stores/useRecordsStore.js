import { defineStore } from 'pinia';
import { useClubsStore } from './useClubsStore';
import { ref } from 'vue';
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
            console.log("query_record(" + club_email + ", " + user_email + ")")
            await this.callAPI();
            for (let i = 0; i < this.data.length; i++) {
                console.log(this.data[i]['club_email'] + ' ' + this.data[i]['user_email']);
                if (this.data[i]['club_email'] == club_email && this.data[i]['user_email'] == user_email) {
                    console.log("record found:");
                    console.log(this.data[i]);
                    return this.data[i];
                }
            }
            console.log("record not found.");
            return false;
        },
        async query_by_user(user_email) {
            const clubsStore = useClubsStore();
            // return a list
            await this.callAPI();
            let list = [];
            const club = ref();
            for (let i = 0; i < this.data.length; i++) {
                if (this.data[i]['user_email'] === user_email) {
                    club.value = await clubsStore.get_club_by_email(this.data[i]['club_email']);
                    //let user_name = "";
                    let club_name = club.value.name;
                    let club_stamp = club.value.text_on_stamp;
                    list.push({
                        user_email: this.data[i]['user_email'],
                        club_name: club_name,
                        club_stamp: club_stamp,
                        club_email: this.data[i]['club_email'],
                        created_time: this.data[i]['created_time'],
                    });
                }
            }
            if (list == []) {
                console.log('record not found');
                list = false;
            }
            console.log('query_by_user list:', list);
            return list;
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