<template lang='pug'>
#lobby
  #lobby-content
    #header-row
      .heading.player-header Player
      .heading.rating-header Rating
      .heading.time-header Time
      .heading.mode-header Mode
      .xmark-icon-container
        font-awesome-icon.heading.kill-button-header(icon='fa-regular fa-xmark-circle')
    .row(v-for='(room, i) in lobbyRooms' :key='i' @click="onRowClicked")
      .row-item.player {{room.name}}
      .row-item.rating {{room.rating}}
      .row-item.time {{room.time}}
      .row-item.mode {{room.isRated ? 'Rated': 'Casual'}}
      //- TODO: only show for room creator... and perhaps moderator
      .xmark-icon-container(@click.stop='')
        font-awesome-icon.row-item.kill-button(icon='fa-regular fa-xmark-circle' @click.stop="onXmarkClicked")
</template>

<script>
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, remove } from 'firebase/database'

export default {
  name: 'Lobby',
  data: function () {
    return {
      db: null,
      lobbyRooms: []
    }
  },
  created () {
    this.db = getDatabase()
  },
  mounted () {
    const lobbyUsersRef = ref(this.db, 'lobby/users')

    onChildAdded(lobbyUsersRef, (data) => {
      this.lobbyRooms.push(data.val())
    })
    onChildChanged(lobbyUsersRef, (data) => {
      this.lobbyRooms = this.lobbyRooms.map((room) => {
        if (data.val().name === room.name) return data.val()
        else return room
      })
    })
    onChildRemoved(lobbyUsersRef, (data) => {
      this.lobbyRooms = this.lobbyRooms.filter((room) => data.val().name !== room.name)
    })
  },
  methods: {
    onRowClicked () {
      // TODO:
      console.log('row clicked')
    },
    onXmarkClicked (e) {
      const playerName = e.target.closest('.row').firstChild.innerText
      // console.log(playerName)
      remove(ref(this.db, `/lobby/users/${playerName}`))
    }
  }
}
</script>

<style lang='scss' scoped>
#lobby {
  background-image: url('../../assets/img/Flag.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 75% 75%;
}
#lobby-content {
  // the 2rem accounts for the padding in the home view
  height: calc(85vh - 2rem);
  padding-top: 1rem;
  overflow-y: auto;

  background-color: $transparent-gray;

  .xmark-icon-container {
    padding-inline: 15px;
    cursor: default;
  }
}
#header-row {
  display: flex;
  align-items: center;

  height: 2.5rem;
  padding-inline: 1rem;

  font-weight: 600;
}
#header-row .heading {
  flex: 1;

  &.kill-button-header {
    flex: 0;
    visibility: hidden;
  }
}

.row {
  display: flex;
  align-items: center;

  padding-inline: 1rem;
  height: 2.5rem;

  border-bottom: 1px solid $white;
}
.row:hover {
  background-color: $transparent-accent;
  cursor: pointer;
}
.row .row-item {
  flex: 1;

  &.kill-button {
    flex: 0;

    cursor: pointer;
  }
}
</style>
