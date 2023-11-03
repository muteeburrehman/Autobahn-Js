<template>
  <div>
    <h1>WAMP Dashboard</h1>
    <div v-if="connected">
      <p>Status: Connected to WAMP Router</p>
      <p>Message: {{ message }}</p>
    </div>
    <div v-else>
      <p>Status: Disconnected from WAMP Router</p>
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
    };
  },
  created() {
    const url = 'ws://localhost:8081/ws';
    const realm = 'realm1';
    const connection = new autobahn.Connection({
      url,
      realm,
    });

    connection.onopen = (session, details) => {
      this.session = session;
      this.connected = true;
      console.log('session created', this.session);

      session.subscribe('com.example.topic1', (args) => {
        this.message = args[0];
        console.log('Session subscribed');
      });

      session.publish('com.example.topic1', ['Vue Js']);
      console.log('WAMP session opened:', session, details);
    };

    connection.onclose = (reason) => {
      this.connected = false;
      console.log(reason);
    };

    connection.open();
  },
  beforeUnmount() {
    if (this.session) {
      this.session.close();
    }
  }
};
</script>
