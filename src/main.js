// main.js
import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRouter, createWebHistory } from 'vue-router';

import HomeComp from "@/components/HomeComp.vue";
import AnalyticsComp from "@/components/AnalyticsComp.vue";
import SettingsComp from "@/components/SettingsComp.vue";
import WampSession from "@/components/GetData.vue";
import CreateAccount from "@/components/CreateAccount.vue";
import store from '@/store.js';
import GetData from "@/components/GetData.vue"; // Import your store

const routes = [
    { path: '/', component: WampSession },
    { path: '/home', component: HomeComp },
    { path: '/analytics', component: AnalyticsComp },
    { path: '/settings', component: SettingsComp },
    {path: '/getData' , name: 'GetDataPage', component: GetData, props: true},
    { path: '/create-account', name: 'CreateAccountPage', component: CreateAccount, props: true },
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
