<template>
  <div>
    <DashBoard :session="store.state.session" :connected="connected" />

    <!-- Router Links -->

    <!-- Bootstrap-styled router links -->
    <router-link to="/update-data" class="btn btn-warning mb-2 me-2 mt-2">Update Data</router-link>
    <router-link to="/create-account" class="btn btn-success mb-2 me-2 mt-2">Create an Account</router-link>
    <router-link to="/show-users" class="btn btn-primary mb-2 me-2 mt-2">Show Users</router-link>
    <router-link to="/delete-account" class="btn btn-danger mb-2 me-2 mt-2">Delete Account</router-link>
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import DashBoard from "@/components/layout/DashBoard.vue";
import autobahn from 'autobahn-browser';

export default {
  name: 'App',
  components: {
    DashBoard,
  },
  inject: ['store'],

  data() {
    return {
      connected: false,
    };
  },
  methods: {
    createConnection() {
      const url = 'ws://localhost:8081/ws';
      const realm = 'realm1';
      const connection = new autobahn.Connection({
        url,
        realm,
      });

      connection.onopen = (newSession, details) => {
        this.store.mutations.setSession(newSession); // Access mutations via store
        console.log('Session created', newSession);
        console.log('WAMP session opened:', newSession, details);
      };

      connection.onclose = (reason) => {
        this.connected = false;
        console.error('Connection Closed:', reason);
      };

      connection.open();
    },
  },
  created() {
    this.createConnection();
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
