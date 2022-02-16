<template lang="pug">
#app
  <Header :user='user'/>
  router-view
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, query, orderByKey, equalTo, onValue } from 'firebase/database'

import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  data: function () {
    return {
      user: null
    }
  },
  created () {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      // user data to pass into header props
      this.user = user

      // set store for user
      if (user) {
        const db = getDatabase()
        const usersQuery = query(ref(db, '/registeredUsers'),
          orderByKey(), equalTo(user.displayName))

        onValue(usersQuery, (snapshot) => {
          if (snapshot.val()) {
            this.$store.commit('setUser', {
              ...snapshot.val()[user.displayName],
              name: user.displayName
            })
            // console.log(this.$store.state.user)
          }
        })
      } else {
        this.$store.commit('setUser', null)
        // console.log(this.$store.state.user)
      }
    })
  }
}
</script>

<style lang="scss">
// fonts

// google fonts
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap');

// local downloads
@font-face {
  font-family: 'Noto Sans';
  src: local('Noto Sans'), url('./assets/fonts/noto-sans/NotoSans-Light.ttf');
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: 'Noto Sans';
  src: local('Noto Sans'), url('./assets/fonts/noto-sans/NotoSans-Regular.ttf');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Noto Sans';
  src: local('Noto Sans'), url('./assets/fonts/noto-sans/NotoSans-SemiBold.ttf');
  font-weight: 600;
  font-style: normal;
}

* {
  margin: 0;
  padding: 0;

  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 1rem;
}
::-webkit-scrollbar-track {
  background: $darker-gray;
}
::-webkit-scrollbar-thumb {
  background: $gray;
}

#app {
  min-height: 100vh;

  color: $white;
  background: $black;

  font-family: 'Noto Sans', sans-serif;
  font-size: $medium;
  font-weight: 400;
}

// override vue-modal default style
.vm--modal {
  background-color: $darkest-gray !important;
  color: $white;
  cursor: default;
}
</style>
