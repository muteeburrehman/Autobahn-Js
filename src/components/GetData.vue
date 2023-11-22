<template>
  <div class="container mt-5">

      <div class="card">
        <div class="card-body">
          <h3 class="card-title">User Detail:</h3>

    <div class="mb-3">
      <label for="email" class="form-label">Email:</label>
      <input v-model="email" type="text" id="email" class="form-control mb-2" placeholder="Enter email" />

      <div v-if="emailError" class="text-danger">{{ emailError }}</div>

      <button @click="getData" class="btn btn-success">Get Data</button>
    </div>

    <div v-if="dataResult" class="mt-4">
      <h3> Details: </h3>
      <!-- Display data result here -->
      <pre class="bg-light p-3">{{ dataResult }}</pre>
    </div>

    <div v-if="errorMessage" class="mt-4">
      <h3>Error:</h3>
      <div class="text-danger">{{ errorMessage }}</div>
    </div>
  </div>
      </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const email = ref('');
    const emailError = ref(null);
    const dataResult = ref(null);
    const errorMessage = ref(null);
    const store = useStore();

    const getData = async () => {
      // Reset dataResult to null at the beginning of the function
      dataResult.value = null;

      try {
        if (validateEmail()) {
          const res = await store.state.session.call('pk.codebase.account.get', [email.value.trim()]);
          console.log('Received data:', res);

          if (res) {
            // Account found, display data
            dataResult.value = JSON.stringify(res, null, 2);
            errorMessage.value = null; // Clear any previous error messages
          } else {
            // Account not found for the specified email
            errorMessage.value = 'No account found for the specified email.';
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        // Handle the error, display a user-friendly message, or log it as needed
        errorMessage.value = 'Error fetching data. Please try again later.';
      }
    };

    const validateEmail = () => {
      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        emailError.value = 'Email is required';
        return false;
      } else if (!emailRegex.test(email.value.trim())) {
        emailError.value = 'Invalid email format';
        return false;
      } else {
        emailError.value = null;
        return true;
      }
    };

    return {
      email,
      emailError,
      dataResult,
      errorMessage,
      getData,
    };
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}
</style>