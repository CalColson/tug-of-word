<template lang='pug'>
#lobby
  #lobby-content
    #header-row
      .heading.player-header Player
      .heading.rating-header Rating
      .heading.time-header Time
      .heading.mode-header Mode
    .row(v-for='(room, i) in lobbyRooms' :key='i')
      .row-item.player {{room.player}}
      .row-item.rating {{room.rating}}
      .row-item.time {{room.time}}
      .row-item.mode {{room.mode}}
</template>

<script>
export default {
  name: 'Lobby',
  data: function () {
    return {
      lobbyRooms: [
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' },
        // { player: 'Cosmosis', rating: '1200', time: '20', mode: 'Casual' }
      ]
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

  background-color: $transparent-mask-bg-color;
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

  border-bottom: 1px solid $text-color;
}
.row:hover {
  background-color: $transparent-accent-color;
  cursor: pointer;
}
.row .row-item {
  flex: 1;
}
</style>
