<!-- WampSession.vue -->
<template>
  <div class="wamp-style d-flex flex-column align-items-center mt-4">
    <h1>WAMP Dashboard</h1>

    <div class="mb-3">
      <!-- Show the input and button only when connected -->
      <div v-if="connected" class="mt-2">
        <label for="email">Email:</label>
        <input v-model="email" type="text" id="email" class="form-control mb-2" placeholder="Enter email" />

        <!-- Button to submit email -->
        <router-link :to="{ name: 'CreateAccountPage' }" class="btn btn-secondary mb-2 me-2 mt-2">Create an Account</router-link>

        <button @click="getData" class="btn btn-success">Get Data</button>
      </div>
    </div>

    <div v-if="connected">
      <p>Status: Connected to WAMP Router</p>
      <p>Message: {{ message }}</p>
    </div>
    <div v-else>
      <p>Status: {{ connectionError ? 'Error in establishing connection' : 'Disconnected from WAMP Router' }}</p>
    </div>

    <div v-if="dataResult">
      <h2>Data Result</h2>
      <pre>{{ dataResult }}</pre>
    </div>
  </div>
</template>

<script>
import autobahn from 'autobahn-browser';

export default {
  data() {
    return {
      connected: false,
      connectionError: false,
      message: '',
      session: null,
      dataResult: null,
      email: '',
      emailEntered: false,
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

      connection.onopen = (session, details) => {
        this.session = session;
        this.connected = true;
        this.message = 'Connected Successfully';
        console.log('Session created', this.session);
        console.log('WAMP session opened:', session, details);
      };

      connection.onclose = (reason) => {
        this.connected = false;
        this.connectionError = true;
        this.message = 'Connection Closed';
        console.error(reason);
      };

      connection.open();
    },

    getData() {
      if (this.email.trim() !== '') {
        this.emailEntered = true;
      }
      if (this.session && this.emailEntered) {
        this.session.call('pk.codebase.account.get', [this.email.trim()]).then((res) => {
          console.log('Received data:', res);
          this.dataResult = JSON.stringify(res, null, 2);
        });
      }
    },
  },

  created() {
    this.createConnection();
  },

  // beforeUnmount() {
  //   if (this.session) {
  //     this.session.close();
  //   }
  // },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
