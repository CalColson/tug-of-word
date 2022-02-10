<template lang="pug">
#action-buttons
  .action-button(@click='createGame') CREATE A GAME
    modal(name='example')
      .modal-content
        #time-control
          #time-control-label seconds per side
          input#time-control-input(v-model='secondsPerSide' type="number", min="1", max="3")
        #choose-mode
          #casual-button.mode-button(:class='{selected: !isRated}', @click='onCasualButtonClick') casual
          #rated-button.mode-button(:class='{selected: isRated}', @click='onRatedButtonClick') rated
        #action-section
          #cancel-button.action-section-button(@click='$modal.hide("example")') cancel
          #confirm-button.action-section-button(@click='joinLobby') join lobby
  .action-button PLAY WITH A FRIEND
  .action-button PLAY WITH THE COMPUTER
</template>

<script>
import { getDatabase, ref, set } from 'firebase/database'

export default {
  name: 'ActionButtons',
  created () {
    this.db = getDatabase()
  },
  data: function () {
    return {
      db: null,

      secondsPerSide: 20,
      isRated: true
    }
  },
  methods: {
    createGame () {
      this.$modal.show('example')
    },
    onCasualButtonClick () {
      if (this.isRated) this.isRated = false
    },
    onRatedButtonClick () {
      if (!this.isRated) this.isRated = true
    },
    joinLobby () {
      set(ref(this.db, 'lobby/users/cosmo'), {
        name: 'cosmo',
        rating: '1337',
        time: this.secondsPerSide,
        isRated: this.isRated
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#action-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-size: 20px;
  font-weight: 600;
}
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 30%;

  color: $text-gray;
  border-radius: 6px;
  background-color: $button-bg-color;

  cursor: pointer;
}
.action-button:hover {
  color: #ffffff;
  background-color: $bg-lighter;
}

.modal-content {
  display: flex;
  flex-direction: column;

  height: 100%;
  padding: 20px;
  text-align: center;
}
#time-control {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}
// #time-control-input {
// }
#choose-mode {
  flex: 1.5;

  display: flex;
  justify-content: center;
  align-items: center;
}
#choose-mode .mode-button {
  width: 30%;
  height: 50%;

  padding-block: 0.5rem;

  background-color: $bg-light;
  text-shadow: 1px 1px black;

  cursor: pointer;
}
#choose-mode .mode-button.selected {
  background-color: $bg-success;
}
#casual-button {
  border-start-start-radius: 6px;
  border-end-start-radius: 6px;
}
#rated-button {
  border-start-end-radius: 6px;
  border-end-end-radius: 6px;
}

#action-section {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 25%;

  border-top: 1px solid $text-color;
}
#action-section .action-section-button {
  width: 25%;
  border-radius: 6px;

  padding-block: 0.5rem;

  cursor: pointer;
}
#action-section #cancel-button {
  background-color: $bg-failure;
}
#action-section #confirm-button {
  background-color: $bg-success;
}
</style>
