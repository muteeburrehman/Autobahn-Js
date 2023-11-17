// main.js
import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRouter, createWebHistory } from 'vue-router';

import HomeComp from "@/components/HomeComp.vue";
import AnalyticsComp from "@/components/AnalyticsComp.vue";
import SettingsComp from "@/components/SettingsComp.vue";
import WampSession from "@/components/WampSession.vue";
import CreateAccount from "@/components/CreateAccount.vue";

const routes = [
    { path: '/', component: WampSession },
    { path: '/home', component: HomeComp },
    { path: '/analytics', component: AnalyticsComp },
    { path: '/settings', component: SettingsComp },
    { path: '/create-account', name: 'CreateAccountPage', component: CreateAccount },
    { path: '/:catchAll(.*)', redirect: '/' }, // Redirect any unknown routes to the home page
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');
