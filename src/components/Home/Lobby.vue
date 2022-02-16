<template lang='pug'>
#lobby
  #lobby-content
    #header-row
      .heading.player-header Player
      .heading.rating-header Rating
      .heading.time-header Time
      .heading.mode-header Mode
    .row(v-for='(room, i) in lobbyRooms' :key='i')
      .row-item.player {{room.name}}
      .row-item.rating {{room.rating}}
      .row-item.time {{room.time}}
      .row-item.mode {{room.isRated ? 'Rated': 'Casual'}}
</template>

<script>
import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database'

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
}
</style>
