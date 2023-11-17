<template>
  <div>
    <DashBoard />

    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script>
import DashBoard from "@/components/layout/DashBoard.vue";

export default {
  name: 'App',
  components: {
    DashBoard
  }
};
</script>
