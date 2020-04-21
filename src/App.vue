<template>
  <div id="app">
    <m-header class="header"></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import MHeader from "components/header/Header";
  import Tab from "./components/tab/Tab";
  import Player from "./base/player/Player";

  export default {
    name: 'app',
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>

<style scoped lang="stylus">


</style>
