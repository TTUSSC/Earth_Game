import { defineStore } from 'pinia';
import { useClubsStore } from './useClubsStore';
import { useUserStore } from './useUsersStore';
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
            this.data = response.data.reverse();
            console.log('useRecordsStore:', this.data);
        },
        async query_record(club_email, user_email, is_ig) {
            console.log("query_record(", club_email, ", ", user_email, ", ", is_ig, ")")
            await this.callAPI();
            console.log(this.data);
            for (let i = 0; i < this.data.length; i++) {
                console.log(this.data[i]['club_email'], this.data[i]['user_email'], this.data[i]['is_ig']);
                if (this.data[i]['club_email'] == club_email &&
                    this.data[i]['user_email'] == user_email &&
                    this.data[i]['is_ig'] == is_ig) {
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
                    if (club.value == null) {
                        console.error('[-] 找不到社團資料', club.value);
                        continue;
                    }
                    //let user_name = "";
                    let club_name = club.value.name;
                    let club_stamp = club.value.text_on_stamp;
                    list.push({
                        user_email: this.data[i]['user_email'],
                        club_name: club_name,
                        club_stamp: club_stamp,
                        club_email: this.data[i]['club_email'],
                        created_time: this.data[i]['created_time'],
                        is_ig: this.data[i]['is_ig'],
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
            const usersStore = useUserStore();
            await this.callAPI();
            let list = [];
            const user = ref();
            for (let i = 0; i < this.data.length; i++) {
                console.log(this.data[i]['club_email']);
                if (this.data[i]['club_email'] === club_email) {
                    user.value = await usersStore.get_user_by_email(this.data[i]['user_email']);
                    console.log(user.value);
                    let user_name = user.value.name;
                    console.log("user_name: ", user_name)
                    list.push({
                        user_name: user_name,
                        created_time: this.data[i]['created_time'],
                        is_ig: this.data[i]['is_ig'],
                    })
                }
            }

            if (list == []) {
                console.log('record not found');
                list = false;
            }

            console.log('query_by_user list:', list);
            return list;
        }
    },
    getters: {
        data_len: (state) => {
            if (state.data == null) return 0;
            else return state.data.length;
        },
    }
})