<template lang="pug">
#app
  <Header />
  router-view
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style lang="scss">
// fonts
@font-face {
  font-family: 'Noto Sans';
  src: local('Noto Sans'), url('./assets/fonts/noto-sans/NotoSans-Light.ttf');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'Noto Sans';
  src: local('Noto Sans'), url('./assets/fonts/noto-sans/NotoSans-Regular.ttf');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Noto Sans';
  src: local('Noto Sans'), url('./assets/fonts/noto-sans/NotoSans-SemiBold.ttf');
  font-weight: 600;
  font-style: normal;
}

* {
  margin: 0;
  padding: 0;

  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 1rem;
}
::-webkit-scrollbar-track {
  background: $bg-light;
}
::-webkit-scrollbar-thumb {
  background: $bg-lighter;
}

#app {
  min-height: 100vh;

  color: $text-color;
  background: $bg-color;

  font-family: 'Noto Sans', sans-serif;
  font-size: $text-size;
  font-weight: 400;
}
</style>
