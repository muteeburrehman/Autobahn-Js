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
                  <button

                      @click="deleteUser(user.email)"
                      class="btn btn-primary btn-sm mx-2"
                  >
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
        if (store.state.connected){

          const response = await store.state.session.call('pk.codebase.account.delete',[email]);
          console.log('User:',response);
          fetchUserData();
          console.log(users)
        }
      } catch (error){
        console.error('Error fetching data: ', error )
      }
    }
    // Modify handleUserClick to navigate to the update-data route with the user's email
    const handleUserClickTwo = (email) => {
      store.dispatch('setClickedEmail', email);
      router.push({ name: 'update-data', params: { email } });
    };

    const handleUserClick = (email) => {
      store.dispatch('setClickedEmail', email);
      router.push({ name: 'get-data', params: { email } });
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
      handleUserClick,
      handleUserClickTwo,
      deleteUser
    };
  },
};
</script>