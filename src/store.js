// store.js
import { reactive } from 'vue';

const state = reactive({
    session: null,
    connected: false,
});

const mutations = {
    setSession(newSession) {
        state.session = newSession;
        state.connected = true;
    },
};

export default {
    state,
    mutations,
};
