<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Create Account</h3>

        <div class="mb-3">
          <label for="fullname" class="form-label">Full Name:</label>
          <input v-model="accountData.fullname" type="text" id="fullname" class="form-control" :class="{ 'is-invalid': fullnameError }" placeholder="Enter full name" />
          <div v-if="fullnameError" class="invalid-feedback">{{ fullnameError }}</div>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input v-model="accountData.email" type="text" id="email" class="form-control" :class="{ 'is-invalid': emailError }" placeholder="Enter email" />
          <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
        </div>

        <div class="mb-3">
          <label for="age" class="form-label">Age:</label>
          <input v-model="accountData.age" type="number" id="age" class="form-control" :class="{ 'is-invalid': ageError }" placeholder="Enter age" />
          <div v-if="ageError" class="invalid-feedback">{{ ageError }}</div>
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
    console.log(props);
    const store = useStore();

    const accountData = ref({
      fullname: '',
      age: null,
      email: '',
    });

    const fullnameError = ref(null);
    const emailError = ref(null);
    const ageError = ref(null);
    const accountCreated = ref(false);
    const showErrorMessage = ref(false);
    const errorMessage = ref('');

    const createAccount = async () => {
      fullnameError.value = ''; // Clear previous full name error
      emailError.value = ''; // Clear previous email error
      ageError.value = ''; // Clear previous age error
      accountCreated.value = false; // Reset account creation status
      errorMessage.value = ''; // Clear previous error message
      showErrorMessage.value = false; // Hide the error message

      if (!store.state.connected) {
        errorMessage.value = 'No session available. Please ensure you are connected.';
        showErrorMessage.value = true;
        return;
      }

      if (!validateFullname() || !validateEmail() || !validateAge()) {
        errorMessage.value = 'Please fill in all fields correctly.';
        showErrorMessage.value = true;
        return;
      }

      try {
        const { fullname, age, email } = accountData.value;

        // session call for creating an account
        const res = await store.state.session.call('pk.codebase.account.create', [fullname, age, email]);
        console.log('Account created successfully:', res);
        accountCreated.value = true;
      } catch (error) {
        if (error.error === 'AccountAlreadyExistsError') {
          errorMessage.value = 'Account with this email already exists.';
        } else {
          errorMessage.value = 'Error creating account. Please try again.';
          console.error('Error creating account:', error);
        }
        showErrorMessage.value = true;
      }
    };

    const validateFullname = () => {
      if (!accountData.value.fullname.trim()) {
        fullnameError.value = 'Full name is required';
        return false;
      } else {
        fullnameError.value = null;
        return true;
      }
    };

    const validateEmail = () => {
      // Regular expression for basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!accountData.value.email.trim()) {
        emailError.value = 'Email is required';
        return false;
      } else if (!emailRegex.test(accountData.value.email.trim())) {
        emailError.value = 'Invalid email format';
        return false;
      } else {
        emailError.value = null;
        return true;
      }
    };

    const validateAge = () => {
      if (accountData.value.age === null || isNaN(accountData.value.age) || accountData.value.age < 0) {
        ageError.value = 'Please enter a valid age';
        return false;
      } else {
        ageError.value = null;
        return true;
      }
    };

    // Watch for changes in the session state
    watch(() => store.state.connected, (newConnected) => {
      if (!newConnected) {
        // Reset the component state when disconnected
        fullnameError.value = '';
        emailError.value = '';
        ageError.value = '';
        accountCreated.value = false;
        showErrorMessage.value = false;
        errorMessage.value = '';
      }
    });

    return {
      accountData,
      fullnameError,
      emailError,
      ageError,
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
.is-invalid {
  border-color: #dc3545;
}
.invalid-feedback {
  color: #dc3545;
}
</style>
