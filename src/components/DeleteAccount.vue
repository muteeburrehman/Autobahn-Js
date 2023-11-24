<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title"> Delete Account </h3>

        <div class="mb-3">
          <label for="email">Email </label>
          <input
              type="text"
              id="email"
              class="form-control mb-2"
              :class="{ 'is-invalid': emailError }"
              placeholder="Enter email"
              v-model="accountData.email"
          />
          <div v-if="emailError" class="invalid-feedback">{{ emailError }}</div>
        </div>

        <button @click="deleteAccount" class="btn btn-danger mb-2">Delete Account</button>
        <div v-if="accountDeleted" class="alert alert-success mt-2">
          Account Deleted successfully
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-2">
          {{ errorMessage }}
        </div>
        <div v-else>
          <p v-if="!store.state.connected">
            No session available. Please ensure that you are connected.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router';
export default {
  setup() {
    const store = useStore();
    const router = useRouter(); // Initialize router

    const accountData = ref({
      email: '',
    });
    const emailError = ref(null);
    const accountDeleted = ref(false);
    const errorMessage = ref('');

    const deleteAccount = async () => {
      emailError.value = '';
      accountDeleted.value = false;
      errorMessage.value = '';

      if (!store.state.connected) {
        errorMessage.value = 'No session available. Please ensure that you are connected.';
        return;
      }

      if (!validateEmail()) {
        return;
      }

      try {
        const { email } = accountData.value;

        // session call for deleting account
        const res = await store.state.session.call('pk.codebase.account.delete', [email]);
        console.log('Account deleted successfully', res);
        accountDeleted.value = true;

        // Redirect to ShowUsersPage after successfully creating an account
        router.push({ name: 'show-users' });
      } catch (error) {
        console.error('Error deleting account:', error);
        errorMessage.value = 'Error deleting account. Please try again.';
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

    watch(() => store.state.connected, (newConnected) => {
      if (!newConnected) {
        // reset the component state when disconnected
        emailError.value = '';
        accountDeleted.value = false;
        errorMessage.value = '';
      }
    });

    return {
      deleteAccount,
      accountData,
      emailError,
      accountDeleted,
      errorMessage,
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