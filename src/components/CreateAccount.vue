<!-- CreateAccount.vue -->
<template>
  <div>
    <label for="fullname">Full Name:</label>
    <input v-model="accountData.fullname" type="text" id="fullname" class="form-control mb-2" placeholder="Enter full name" />

    <label for="email">Email:</label>
    <input v-model="accountData.email" type="text" id="email" class="form-control mb-2" placeholder="Enter email" />

    <label for="age">Age:</label>
    <input v-model="accountData.age" type="number" id="age" class="form-control mb-2" placeholder="Enter age" />

    <button @click="createAccount" class="btn btn-secondary mb-2 me-2 mt-2">Create Account</button>

    <div v-if="accountCreated" class="alert alert-success mb-2">
      Account created successfully!
    </div>
    <div v-else>
      <p>No session available. Please ensure you are connected.</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    session: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      accountData: {
        fullname: '',
        age: null,
        email: '',
      },
      accountCreated: false,
    };
  },
  watch: {
    // Watch for changes in the session prop
    session: {
      handler(newSession) {
        if (newSession) {
          // If a new session is received, you can perform any necessary actions here
          // For example, you might want to initialize something or trigger another action
          console.log('Session received in CreateAccount component:', newSession);
        }
      },
      immediate: true, // Trigger the handler immediately when the component is created
    },
  },
  methods: {
    createAccount() {
      if (this.session && this.accountData.email.trim() !== '' && this.accountData.fullname.trim() !== '' && this.accountData.age !== null) {
        const { fullname, age, email } = this.accountData;

        this.session.call('pk.codebase.account.create', [fullname, age, email])
            .then((res) => {
              console.log('Account created successfully:', res);
              this.accountCreated = true;
            })
            .catch((error) => {
              console.error('Error creating account:', error);
            });
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
