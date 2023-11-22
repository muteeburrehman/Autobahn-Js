<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">Update Account</h3>

        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input v-model="accountData.email" type="text" id="email" class="form-control" :class="{ 'is-invalid': emailError }" placeholder="Enter email" />
          <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
        </div>

        <div class="mb-3">
          <label for="fullname" class="form-label">Full Name:</label>
          <input v-model="accountData.fullname" type="text" id="fullname" class="form-control" :class="{ 'is-invalid': fullnameError }" placeholder="Enter full name" />
          <div v-if="fullnameError" class="invalid-feedback">{{ fullnameError }}</div>
        </div>

        <div class="mb-3">
          <label for="age" class="form-label">Age:</label>
          <input v-model="accountData.age" type="number" id="age" class="form-control" :class="{ 'is-invalid': ageError }" placeholder="Enter age" />
          <div v-if="ageError" class="invalid-feedback">{{ ageError }}</div>
        </div>

        <button @click="updateAccount" class="btn btn-primary mb-2">Update Account</button>

        <div v-if="accountUpdated" class="alert alert-success mt-2">
          Account updated successfully!
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
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const accountData = ref({
      fullname: '',
      age: null,
      email: '',
    });

    const fullnameError = ref(null);
    const emailError = ref(null);
    const ageError = ref(null);
    const accountUpdated = ref(false);
    const showErrorMessage = ref(false);
    const errorMessage = ref('');

    const fetchUserData = async () => {
      const user = router.currentRoute.value.state?.user;

      if (user) {
        accountData.value = {
          fullname: user.fullname,
          age: user.age,
          email: user.email,
        };
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    const updateAccount = async () => {
      fullnameError.value = '';
      emailError.value = '';
      ageError.value = '';
      accountUpdated.value = false;
      errorMessage.value = '';
      showErrorMessage.value = false;

      if (!store.state.connected) {
        errorMessage.value = 'No session available. Please ensure you are connected.';
        showErrorMessage.value = true;
        return;
      }

      if (!validateEmail() || !validateFullname() || !validateAge()) {
        errorMessage.value = 'Please fill in all fields correctly.';
        showErrorMessage.value = true;
        return;
      }

      try {
        const { fullname, age, email } = accountData.value;

        // Axios call for updating an account
        const res = await axios.put(`your_api_endpoint/${email}`, { fullname, age });
        console.log('Account updated successfully:', res.data);
        accountUpdated.value = true;

        // Redirect to ShowUsersPage after successfully updating an account
        router.push({ name: 'show-users' });
      } catch (error) {
        errorMessage.value = 'Error updating account. Please try again.';
        showErrorMessage.value = true;
        console.error('Error updating account:', error);
      }
    };
    const validateEmail = () => {
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

    const validateFullname = () => {
      if (!accountData.value.fullname.trim()) {
        fullnameError.value = 'Full name is required';
        return false;
      } else {
        fullnameError.value = null;
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

    watch(() => store.state.connected, (newConnected) => {
      if (!newConnected) {
        fullnameError.value = '';
        emailError.value = '';
        ageError.value = '';
        accountUpdated.value = false;
        showErrorMessage.value = false;
        errorMessage.value = '';
      }
    });

    return {
      accountData,
      fullnameError,
      emailError,
      ageError,
      accountUpdated,
      showErrorMessage,
      errorMessage,
      updateAccount,
      store,
      fetchUserData,
    };
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}
.invalid-feedback {
  color: #dc3545;
}
</style>