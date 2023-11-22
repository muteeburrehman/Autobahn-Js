<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">User Data</h3>

        <!-- Display user data in a table -->
        <div class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="align-middle">{{ user.fullname }}</td>
              <td class="align-middle">{{ user.email }}</td>
              <td class="align-middle">{{ user.age }}</td>
              <td class="align-middle">
                <div class="btn-group" role="group">
                  <!-- Pass user data to the update form using props -->
                  <router-link
                      :to="{ name: 'update-data', params: { id: user.id }}"
                      class="btn btn-warning mx-2"
                  >
                    Edit
                  </router-link>
                  <router-link
                      :to="{ name: 'delete-account', params: { id: user.id } }"
                      class="btn btn-primary mx-2"
                  >
                    Delete
                  </router-link>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <router-link to="/create-account" class="btn btn-primary mt-3">Create Account</router-link>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const users = ref([]);

    const fetchUserData = async () => {
      try {
        if (store.state.connected) {
          const res = await store.state.session.call('pk.codebase.account.list');
          users.value = res;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    // Watch for changes in users and reactively update the component
    watch(() => store.state.connected, (newValue) => {
      if (newValue) {
        fetchUserData();
      }
    });

    return {
      users,
    };
  },
};
</script>
