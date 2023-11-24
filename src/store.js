// store.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        session: null,
        connected: false,
        clickedEmail: null,
        users: [], // Add the users array to store user data
    },
    mutations: {
        setSession(state, newSession) {
            state.session = newSession;
            state.connected = true;
        },
        setClickedEmail(state, email) {
            state.clickedEmail = email;
        },
        deleteUser(state, email) {
            const index = state.users.findIndex(user => user.email === email);
            if (index !== -1) {
                state.users.splice(index, 1);
            }
        },
        // Add the setUsers mutation to store user data
        setUsers(state, users) {
            state.users = users;
        },
    },
    actions: {
        setClickedEmail({ commit }, email) {
            commit('setClickedEmail', email);
        },
        deleteUser({ commit }, email) {
            commit('deleteUser', email);
        },
    },
});
