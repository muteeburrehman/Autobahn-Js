<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">User Detail:</h3>

        <div v-if="dataResult">
          <h3>Details:</h3>
          <div class="user-details">
            <div><strong>Email:</strong> {{ dataResult.email }}</div>
            <div><strong>Full Name:</strong> {{ dataResult.fullname }}</div>
            <div><strong>Age:</strong> {{ dataResult.age }}</div>
            <!-- Add more details as needed -->
          </div>
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
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const dataResult = ref(null);
    const errorMessage = ref(null);
    const store = useStore();

    // Watch for changes in the clicked email and reactively call getData
    watch(() => store.state.clickedEmail, (newEmail) => {
      getData(newEmail);
    });

    const getData = async (email) => {
      try {
        dataResult.value = null;
        errorMessage.value = null; // Reset error message

        // Check if store.state.session is defined before making the API call
        if (!store.state.session) {
          errorMessage.value = 'Session is not initialized. Please try again later.';
          return;
        }

        // Log the email being used in the API call
        console.log('Making API call with email:', email);

        // Make the API call
        const res = await store.state.session.call('pk.codebase.account.get', [email.trim()]);
        console.log('Received data:', res);

        // Check if the response is undefined or empty
        if (res && Object.keys(res).length !== 0) {
          // Update dataResult with the response
          dataResult.value = res;
        } else {
          // Handle the case where the response is empty
          errorMessage.value = 'No account found for the specified email.';
        }
      } catch (error) {
        // Log the entire error object for debugging
        console.error('Error fetching data:', error);

        // Update errorMessage with a generic error message
        errorMessage.value = 'Error fetching data. Please try again later.';
      }
    };

    // Automatically call getData method on page load
    onMounted(() => {
      console.log('Clicked Email:', store.state.clickedEmail);
      getData(store.state.clickedEmail);
    });

    return {
      dataResult,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.user-details {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
