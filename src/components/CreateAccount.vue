<!-- CreateAccount.vue -->
<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Create Account</h3>

        <div class="mb-3">
          <label for="fullname" class="form-label">Full Name:</label>
          <input v-model="accountData.fullname" type="text" id="fullname" class="form-control" placeholder="Enter full name" />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input v-model="accountData.email" type="text" id="email" class="form-control" placeholder="Enter email" />
        </div>

        <div class="mb-3">
          <label for="age" class="form-label">Age:</label>
          <input v-model="accountData.age" type="number" id="age" class="form-control" placeholder="Enter age" />
        </div>

        <button @click="createAccount" class="btn btn-primary mb-2">Create Account</button>

        <div v-if="accountCreated" class="alert alert-success mt-2">
          Account created successfully!
        </div>
        <div v-if="showErrorMessage" class="alert alert-danger mt-2">
          {{ errorMessage }}
        </div>
        <div v-else>
          <p v-if="!store.state.connected">No session available. Please ensure you are connected.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  setup(props) {
    console.log(props)
    const store = useStore();

    const accountData = ref({
      fullname: '',
      age: null,
      email: '',
    });

    const accountCreated = ref(false);
    const showErrorMessage = ref(false);
    const errorMessage = ref('');

    const createAccount = () => {
      errorMessage.value = ''; // Clear previous error message
      showErrorMessage.value = false; // Hide the error message

      if (store.state.session && store.state.connected && accountData.value.email.trim() !== '' && accountData.value.fullname.trim() !== '' && accountData.value.age !== null) {
        const { fullname, age, email } = accountData.value;

        store.state.session.call('pk.codebase.account.create', [fullname, age, email])
            .then((res) => {
              console.log('Account created successfully:', res);
              accountCreated.value = true;
            })
            .catch((error) => {
              if (error.error === 'AccountAlreadyExistsError') {
                errorMessage.value = 'Account with this email already exists.';
                showErrorMessage.value = true; // Display the error message
              } else {
                console.error('Error creating account:', error);
              }
            });
      }
    };

    // Watch for changes in the session state
    watch(() => store.state.connected, (newConnected) => {
      if (!newConnected) {
        // Reset the component state when disconnected
        accountCreated.value = false;
        showErrorMessage.value = false;
        errorMessage.value = '';
      }
    });

    return {
      accountData,
      accountCreated,
      showErrorMessage,
      errorMessage,
      createAccount,
      store,
    };
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
