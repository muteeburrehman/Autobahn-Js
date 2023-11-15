// main.js
import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRouter, createWebHistory } from 'vue-router';

// Import your components for each route

import HomeComp from './components/HomeComp.vue';
import AnalyticsComp from './components/AnalyticsComp.vue';
import SettingsComp from './components/SettingsComp.vue';
import DashBoard from "@/components/DashBoard.vue";



const routes = [
    {path: '/', component: DashBoard},
    { path: '/home', component: HomeComp },
    { path: '/analytics', component: AnalyticsComp },
    { path: '/settings', component: SettingsComp }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');
