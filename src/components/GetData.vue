<template>
  <div class="wamp-style d-flex flex-column align-items-center mt-4">
    <h1>WAMP Dashboard</h1>
    <div class="mb-3">
      <label for="email">Email:</label>
      <input v-model="email" type="text" id="email" class="form-control mb-2" placeholder="Enter email" />

      <button @click="getData" class="btn btn-success" >Get Data</button>
    </div>

    <div v-if="dataResult">
      <h2>Data Result</h2>
      <pre>{{ dataResult }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import store from '@/store.js'; // Update the path accordingly

export default {
  props: {
    connected: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const email = ref('');
    const dataResult = ref(null);

    const getData = () => {
      if (email.value.trim() !== '' && store.state.session) {
        store.state.session.call('pk.codebase.account.get', [email.value.trim()]).then((res) => {
          console.log('Received data:', res);
          dataResult.value = JSON.stringify(res, null, 2);
        });
      }
    };

    return {
      email,
      dataResult,
      getData,
    };
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
