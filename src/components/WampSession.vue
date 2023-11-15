
<template>
  <div class="wamp-style d-flex flex-column align-items-center mt-4">
    <h1>WAMP Dashboard</h1>

    <div class="mb-3">
      <button  v-if="!connection" @click="createConnection" class="btn btn-primary me-2">Create Connection</button>

      <!-- Show the input and button only when connected -->
      <div v-if="connected" class="mt-2">
        <label v-if="!emailEntered" for="email">Email:</label>
        <input v-if="!emailEntered" v-model="email" type="text" id="email" class="form-control mb-2" placeholder="Enter email" />

        <!-- Button to submit email -->
        <button v-if="!emailEntered" @click="enterEmail" class="btn btn-secondary mb-2 me-2 mt-2">Enter Email</button>

        <!-- Show email entered alert only when email is entered -->
<!--        <div v-if="emailEntered" class="alert alert-success mb-2">-->
<!--          Email entered successfully!-->
<!--        </div>-->

        <button @click="getData" class="btn btn-success">Get Data</button>
      </div>
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
      email: '', // Add email property
      emailEntered: false, // Track if email is entered
      connection:false
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
        this.connection = true;// for removing create connection button after clicking
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

    enterEmail() {
      if (this.email.trim() !== '') {
        this.emailEntered = true;

      }
    },

    getData() {
      if (this.session && this.emailEntered) {
        this.session.call('pk.codebase.account.get', [this.email.trim()]).then((res) => {
          console.log('Received data:', res);
          this.dataResult = JSON.stringify(res, null, 2);
        });
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
