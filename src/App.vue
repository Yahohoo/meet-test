<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'

export default {
  name: 'App',

  components: {
    MainLayout,
  },
}
</script>

<style>
  :root {
    --bd-color: #ebeef5;
  }

  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

  html {
    height: 100%;
  }

  body {
    margin: 0;
    height: 100%;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #app {
    height: 100%;
  }
</style>
