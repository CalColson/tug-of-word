<template lang="pug">
#home
  <ActionButtons />
  <Leaderboard />
  <Lobby />
</template>

<script>
import ActionButtons from '../components/Home/ActionButtons.vue'
import Leaderboard from '../components/Home/Leaderboard.vue'
import Lobby from '../components/Home/Lobby.vue'

export default {
  name: 'Home',
  components: {
    ActionButtons,
    Leaderboard,
    Lobby
  }
}
</script>

<style lang="scss" scoped>
#home {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 2fr;
  grid-template-areas:  'abs lob'
                        'ldr lob';
  gap: 1rem;

  padding: 1rem;

  min-height: 85vh;
}

#action-buttons {
  grid-area: abs;
}

#leaderboard {
  grid-area: ldr;
}

#lobby {
  grid-area: lob;
}
</style>
