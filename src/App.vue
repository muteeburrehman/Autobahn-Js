<template>
  <div>
    <DashBoard :session="store.state.session" :connected="store.state.connected" />

    <!-- Router Links -->

    <!-- Bootstrap-styled router links -->
<!--    <router-link to="/update-data" class="btn btn-warning mb-2 me-2 mt-2">Update Data</router-link>-->
<!--    <router-link to="/create-account" class="btn btn-success mb-2 me-2 mt-2">Create an Account</router-link>-->
<!--    <router-link to="/show-users" class="btn btn-primary mb-2 me-2 mt-2">Show Users</router-link>-->
<!--    <router-link to="/delete-account" class="btn btn-danger mb-2 me-2 mt-2">Delete Account</router-link>-->
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { onMounted, ref} from 'vue';
import DashBoard from "@/components/layout/DashBoard.vue";
import autobahn from 'autobahn-browser';
import {useStore} from "vuex";

export default {
  name: 'App',
  components: {
    DashBoard,
  },

  setup() {
    // const store = inject('store');
    const store = useStore()
    const users = ref([]); // Declare 'users' here

    const createConnection = () => {
      const url = 'ws://localhost:8081/ws';
      const realm = 'realm1';
      const connection = new autobahn.Connection({
        url,
        realm,
      });

      connection.onopen = (newSession, details) => {
        store.commit('setSession', newSession); // Use commit to access mutations
        console.log('Session created', newSession);
        console.log('WAMP session opened:', newSession, details);

        // Fetch user data after connection is established
        fetchUserData();
      };

      connection.onclose = (reason) => {
        store.state.connected = false;
        console.error('Connection Closed:', reason);
      };

      connection.open();
    };


    const fetchUserData = async () => {
      try {
        if (store.state.connected) {
          const res = await store.state.session.call('pk.codebase.account.list');
          // Do something with the user data, e.g., update a Vuex store
          users.value = res;
          console.log('User data fetched successfully:', res);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    onMounted(() => {
      createConnection();
      fetchUserData();
    });

    return {
      store,
      users
    };
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
