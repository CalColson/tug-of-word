<template lang='pug'>
#leaderboard
  #header-row
    .title Leaderboard
    .more-link More...
  .row(v-for='(leader, i) in leaders' :key='i' :class="i % 2 === 0 ? 'dark' : 'light'")
    .rank {{'#' + (i + 1)}}
    .name {{leader.name}}
    .rating {{leader.rating}}
</template>

<script>
export default {
  name: 'Leaderboard',
  data: function () {
    return {
      leaders: [
        { name: 'Don', rating: '1600' },
        { name: 'Chance', rating: '1400' },
        { name: 'Cal', rating: '1200' },
        { name: 'Marty', rating: '900' },
        { name: 'Mimi', rating: '850' },
        { name: 'Peppy', rating: '800' },
        { name: 'Patrick', rating: '700' },
        { name: 'Dani', rating: '675' },
        { name: 'Mary', rating: '650' },
        { name: 'Olive', rating: '600' }
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
#leaderboard {
  display: flex;
  flex-direction: column;
}

#header-row {
  display: flex;
  align-items: center;
  flex: 1;

  padding-inline: 1rem;

  background-color: $bg-light;
}
#header-row .more-link {
  margin-left: auto;
}
.row {
  display: flex;
  align-items: center;
  flex: 1;

  padding-inline: 1rem;
}
.row.dark {
  background-color: $bg-dark;
}
.row.light {
  background-color: $bg-lighter;
}
.row .rank {
  flex: 1;
}
.row .name {
  flex: 1;
}
.row .rating {
  flex: 1;
}
</style>
