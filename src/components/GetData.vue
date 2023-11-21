<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">User Data</h3>

        <!-- Display user data in a table -->
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
            <td>{{ user.fullname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.age }}</td>
            <td>
              <router-link :to="{ name: 'update-data', params: { id: user.id } }" class="btn btn-primary">Update</router-link>
              <router-link :to="{ name: 'delete-account', params: { id: user.id } }" class="btn btn-primary">Update</router-link>
            </td>
          </tr>
          </tbody>
        </table>

        <router-link to="/create-account" class="btn btn-primary">Create Account</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const users = ref([]);

    const fetchUserData = async () => {
      try {
        if (store.state.connected) {
          // Assuming there is a WAMP RPC endpoint to fetch user data
          const res = await store.state.session.call('pk.codebase.account.get_all');
          users.value = res;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const deleteUser = async (userId) => {
      try {
        if (store.state.connected) {
          // Assuming there is a WAMP RPC endpoint to delete a user
          await store.state.session.call('pk.codebase.account.delete', [userId]);
          // Remove the deleted user from the local list
          users.value = users.value.filter(user => user.id !== userId);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    return {
      users,
      deleteUser,
    };
  },
};
</script>
