// src/plugins/vuetify.js

import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: false, // Set to true for dark mode
        themes: {
            light: {
                primary: '#2196F3',
                secondary: '#FFC107',
                accent: '#607D8B',
            },
            dark: {
                primary: '#1976D2',
                secondary: '#FFA000',
                accent: '#455A64',
            },
        },
    },
});
