import { createStore } from 'vuex';

export default createStore({
    state: {
        session: null,
        connected: false,
        clickedEmail: null,
    },
    mutations: {
        setSession(state, newSession) {
            state.session = newSession;
            state.connected = true;
        },
        setClickedEmail(state, email) {
            state.clickedEmail = email;
        },
    },
    actions: {
        setClickedEmail({ commit }, email) {
            commit('setClickedEmail', email);
        },
    },
});
