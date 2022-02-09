<template lang="pug">
#header
  nav#header-nav
    #logo tug of word
    .header-link PLAY
    .header-link RULES
    .header-link ABOUT
    #sign-in-link SIGN IN
</template>

<style lang="scss" scoped>
#header {
  height: 15vh;
}
#header-nav {
  display: flex;
  align-items: center;
  gap: 55px;

  height: 100%;
  padding-inline: 2rem;

  background: linear-gradient(180deg, $bg-light 0%, $bg-color 100%);
}
#header-nav #logo {
  font-size: 32px;
}
#header-nav .header-link {
  font-weight: 300;
}
#header-nav #sign-in-link {
  margin-left: auto;

  font-size: 24px;
  color: $link-text-color;
}
</style>
