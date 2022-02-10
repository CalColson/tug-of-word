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
  cursor: pointer;
}
#header-nav #logo:hover {
  color: $link-text-color
}
#header-nav .header-link {
  font-weight: 300;
}
#header-nav .header-link:hover {
  color: $accent-color;
  cursor: pointer;
}
#header-nav #sign-in-link {
  margin-left: auto;
  // to cancel out the padding
  margin-right: -15px;
  padding: 15px;
  border-radius: 8px;

  font-size: 24px;
  color: $link-text-color;

  cursor: pointer;
}

#header-nav #sign-in-link:hover {
  background-color: $bg-light;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.224);
}
</style>
