// main.js
import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRouter, createWebHistory } from 'vue-router';

import HomeComp from "@/components/HomeComp.vue";
import AnalyticsComp from "@/components/AnalyticsComp.vue";
import SettingsComp from "@/components/SettingsComp.vue";

import CreateAccount from "@/components/CreateAccount.vue";
import store from '@/store.js';
import GetData from "@/components/GetData.vue";
import DeleteAccount from "@/components/DeleteAccount.vue";
import UpdateData from "@/components/UpdateData.vue";
import ShowUsers from "@/components/ShowUsers.vue"; // Import your store

const routes = [
    { path: '/', name:'show-users', component: ShowUsers },
    { path:'/edit/:email',name:'update-data',component: UpdateData },
    { path: '/home', component: HomeComp },
    { path: '/analytics', component: AnalyticsComp },
    { path: '/settings', component: SettingsComp },
    { name: 'get-data', path: '/get-data/:email', component: GetData, props: true },

    { path: '/create-account', name: 'create-account', component: CreateAccount, props: true },
    { path: '/delete-account/:email', name:'delete-account', component: DeleteAccount, props: true},
    { path: '/:catchAll(.*)', redirect: '/' }, // Redirect any unknown routes to the home page
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App);

app.use(router);

// Provide the store to all components
app.provide('store', store);

app.mount('#app');