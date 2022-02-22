<template lang="pug">
#action-buttons
  .action-button(@click='createGame') CREATE A GAME
    modal(name='create-game')
      .modal-content
        #time-control
          #time-control-label seconds per side
          input#time-control-input(v-model='secondsPerSide' @change='onTimeInputChanged' type="number", :min="minTime", :max="maxTime")
        #choose-mode
          #casual-button.mode-button(:class='{selected: !isRated}', @click='onCasualButtonClick') casual
          #rated-button.mode-button(:class='{selected: isRated}', @click='onRatedButtonClick') rated
        #action-section
          #cancel-button.action-section-button(@click='$modal.hide("create-game")') cancel
          #confirm-button.action-section-button(@click='onJoinLobbyClicked') join lobby
  .action-button PLAY WITH A FRIEND
  .action-button PLAY WITH THE COMPUTER
</template>

<script>
import { getDatabase, ref, remove, set } from 'firebase/database'

export default {
  name: 'ActionButtons',
  data: function () {
    return {
      db: null,

      minTime: 5,
      maxTime: 30,

      secondsPerSide: 20,
      isRated: true,

      // listeners
      handleBeforeUnload: null
    }
  },
  created () {
    this.db = getDatabase()
  },
  destroyed () {
    // remove open room (if existent) from lobby
    if (this.$store.state.hasOpenLobbyGame) {
      remove(ref(this.db, `lobby/users/${this.$store.state.user.name}`))
    }

    // remove listeners
    if (this.handleBeforeUnload) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload)
    }
  },
  methods: {
    createGame () {
      this.$modal.show('create-game')
    },
    onTimeInputChanged () {
      if (this.secondsPerSide < this.minTime) this.secondsPerSide = 5
      if (this.secondsPerSide > this.maxTime) this.secondsPerSide = 30
    },
    onCasualButtonClick () {
      if (this.isRated) this.isRated = false
    },
    onRatedButtonClick () {
      if (!this.isRated) this.isRated = true
    },
    // determine when, in which exact cases, to remove the room from the lobby in the rtdb
    // TODO: on join game
    // HANDLED! on logout (only applicable to registered users)
    // HANDLED! on login (only applicable to anon users)
    // HANDLED! on cancelling game (clicking 'x')
    // HANDLED! on leaving home
    // HANDLED! on closing window
    onJoinLobbyClicked () {
      let name
      let rating
      const user = this.$store.state.user
      // console.log(user)
      if (user) {
        name = user.name
        rating = user.rating
      }

      set(ref(this.db, `lobby/users/${name}`), {
        name: name,
        rating: rating,
        time: this.secondsPerSide,
        isRated: this.isRated
      }).then(() => {
        this.$modal.hide('create-game')

        this.$store.commit('setHasOpenLobbyGame', true)

        // set event listener to avoid having zombie rooms
        this.handleBeforeUnload = (e) => {
          remove(ref(this.db, `lobby/users/${name}`))
        }
        window.addEventListener('beforeunload', this.handleBeforeUnload)
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

  color: $light-gray;
  border-radius: 6px;
  background-color: $dark-gray;

  cursor: pointer;
}
.action-button:hover {
  color: #ffffff;
  background-color: $gray;
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

  #time-control-input {
    width: 5rem;

    font-size: $large;

  }
}
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

  background-color: $darker-gray;
  text-shadow: 1px 1px black;

  cursor: pointer;
}
#choose-mode .mode-button.selected {
  background-color: $success;
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

  border-top: 1px solid $white;
}
#action-section .action-section-button {
  width: 25%;
  border-radius: 6px;

  padding-block: 0.5rem;

  text-shadow: 1px 1px black;
  cursor: pointer;
}
#action-section #cancel-button {
  background-color: $failure;
}
#action-section #confirm-button {
  background-color: $success;
}
</style>
