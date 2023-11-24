<template>
  <div class="container mt-5">
    <div class="card" @mouseover="isHovered = true" @mouseleave="isHovered = false" :class="{ 'hovered': isHovered }">
      <div class="card-body">
        <h3 class="card-title">User Detail:</h3>

        <div v-if="dataResult">
          <div class="user-details text-white">
            <div class="mb-3">
              <strong class="detail-label text-white">Email:</strong>
              {{ dataResult.email }}
            </div>
            <div class="mb-3">
              <strong class="detail-label text-white">Full Name:</strong>
              {{ dataResult.fullname }}
            </div>
            <div class="mb-3">
              <strong class="detail-label text-white">Age:</strong>
              {{ dataResult.age }}
            </div>
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
    const isHovered = ref(false)
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
      isHovered
    };
  },
};
</script>



<style scoped>
.container {
  max-width: 600px;
}

.card {
  border: 2px solid #3498db;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle box shadow */
  background-color: #2c3e50;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.card:hover {
  background-color: #34495e;
  transform: scale(1.02); /* Scale up on hover */
}

.card-body {
  padding: 20px;
}

.card-title {
  color: #3498db;
  font-family: 'Roboto', sans-serif; /* Use a suitable font */
}

.user-details {
  padding: 15px;
  border: 1px solid #2c3e50;
  border-radius: 8px;
  background-color: #34495e;
  transition: transform 0.3s ease; /* Smooth transition for details */
}

.user-details strong {
  font-weight: bold;
  color: #3498db;
}

.detail-label {
  display: inline-block;
  width: 100px;
}

.text-danger {
  color: #dc3545;
}

.hovered {
  background-color: #34495e !important;
  cursor: pointer;
}

/* Additional styles for icons or cursor indicators */
.card:hover {
  cursor: pointer;
}
</style>
