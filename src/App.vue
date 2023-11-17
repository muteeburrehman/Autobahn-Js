<template>
  <div>
    <DashBoard :session="store.state.session" :connected="connected" />

    <!-- Router Links -->

    <!-- Bootstrap-styled router links -->
    <router-link to="/create-account" class="btn btn-secondary mb-2 me-2 mt-2">Create an Account</router-link>
    <router-link to="/get-data" class="btn btn-primary mb-2 me-2 mt-2">Get Data</router-link>

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
        this.connected = true;
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
