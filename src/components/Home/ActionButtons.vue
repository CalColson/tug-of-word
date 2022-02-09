<template lang="pug">
#action-buttons
  .action-button CREATE A GAME
  .action-button PLAY WITH A FRIEND
  .action-button PLAY WITH THE COMPUTER
</template>

<style lang="scss" scoped>
#action-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-weight: 600;
}
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30%;

  border-radius: 6px;
  background-color: $button-bg-color;
}
</style>
