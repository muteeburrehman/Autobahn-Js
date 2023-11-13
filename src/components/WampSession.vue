<template>
  <div class="wamp-style d-flex flex-column align-items-center mt-4">
    <h1>WAMP Dashboard</h1>

    <div class="mb-3">
      <button @click="createConnection" class="btn btn-primary me-2">Create Connection</button>
      <button @click="getData" class="btn btn-success">Get Data</button>
    </div>

    <div v-if="connected">
      <p>Status: Connected to WAMP Router</p>
      <p>Message: {{ message }}</p>
    </div>
    <div v-else>
      <p>Status: Disconnected from WAMP Router</p>
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
      message: 'Connected Successfully',
      session: null,
      dataResult: null,
    };
  },
  methods: {
    createConnection() {
      const url = 'ws://192.168.0.142:8081/ws';
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
        this.message = 'Connection Closed';
        console.log(reason);
      };

      connection.open();
    },

    getData() {
      if (this.session) {
        this.session.call('pk.codebase.account.get', ['muteeb@test.com']).then((res) => {
          console.log('Received data:', res);
          this.dataResult = JSON.stringify(res, null, 2);
        });
      } else {
        alert('Please create a connection first.');
      }
    },
  },

  beforeUnmount() {
    if (this.session) {
      this.session.close();
    }
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
