<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title">User Data</h3>

        <div class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Age</th>
              <th class="text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="align-middle">{{ user.id }}</td>
              <td class="align-middle">{{ user.fullname }}</td>
              <td class="align-middle">
                <div>
                  <router-link
                      :to="{ name: 'get-data', params: { email: user.email } }"
                      @click="handleUserClick(user.email)"
                  >
                    {{ user.email }}
                  </router-link>
                </div>
              </td>
              <td class="align-middle">{{ user.age }}</td>
              <td class="align-middle text-center">
                <div class="btn-group" role="group">
                  <button @click="handleUserClickTwo(user.email)" class="btn btn-warning btn-sm mx-2">
                    Edit
                  </button>
                  <button @click="showDeleteDialog(user)" class="btn btn-primary btn-sm mx-2">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex justify-content-center">
          <router-link to="/create-account" class="btn btn-primary mt-3">Add new user</router-link>
        </div>

        <v-dialog v-model="dialog" width="500">
          <template v-slot:default>
            <v-card title="Delete User">
              <v-card-text>
                <template v-if="itemToDelete">
                  Are you sure you want to delete the user: `{{ itemToDelete.fullname }}`?
                </template>
                <template v-else>
                  No user selected for deletion.
                </template>
              </v-card-text>

              <v-card-actions>
                <v-btn  @click="dialog = false">Cancel</v-btn>
                <v-btn color="error" @click="deleteItem">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const users = ref([]);
    const itemToDelete = ref(null);
    const dialog = ref(false);

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

    const deleteUser = async (email) => {
      try {
        if (store.state.connected) {
          const response = await store.state.session.call('pk.codebase.account.delete', [email]);
          console.log('User deleted:', response);
          fetchUserData();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };

    const handleUserClickTwo = (email) => {
      store.dispatch('setClickedEmail', email);
      router.push({ name: 'update-data', params: { email } });
    };

    const handleUserClick = (email) => {
      store.dispatch('setClickedEmail', email);
      router.push({ name: 'get-data', params: { email } });
    };

    const showDeleteDialog = (user) => {
      itemToDelete.value = user;
      dialog.value = true;
    };

    const deleteItem = async () => {
      try {
        if (store.state.connected && itemToDelete.value) {
          await deleteUser(itemToDelete.value.email);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        itemToDelete.value = null;
        dialog.value = false;
      }
    };

    onMounted(() => {
      fetchUserData();
    });

    watch(() => store.state.connected, (newValue) => {
      if (newValue) {
        fetchUserData();
      }
    });

    return {
      users,
      handleUserClick,
      handleUserClickTwo,
      showDeleteDialog,
      itemToDelete,
      dialog,
      deleteItem,
    };
  },
};
</script>
