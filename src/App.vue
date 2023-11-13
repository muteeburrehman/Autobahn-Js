<template>
  <DashBoard/>
  <WampSession/>
</template>

<script>

import DashBoard from "@/components/DashBoard.vue";
import WampSession from "@/components/WampSession.vue";
export default {

  name: 'App',
  components: {
    WampSession,
    DashBoard
  }
}
</script>

<!--<style>-->
<!--#app {-->
<!--  font-family: Avenir, Helvetica, Arial, sans-serif;-->
<!--  -webkit-font-smoothing: antialiased;-->
<!--  -moz-osx-font-smoothing: grayscale;-->
<!--  text-align: center;-->
<!--  color: #2c3e50;-->
<!--  margin-top: 60px;-->
<!--}-->
<!--</style>-->
