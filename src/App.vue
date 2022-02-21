<template lang="pug">
#app
  <Header :user='user'/>
  router-view
</template>

<script>
import { getAuth, onAuthStateChanged, signInAnonymously, updateProfile } from 'firebase/auth'
import { getDatabase, ref, query, orderByKey, equalTo, onValue, set, remove } from 'firebase/database'

import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator'

import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  data: function () {
    return {
      db: null,
      user: null
    }
  },
  created () {
    this.db = getDatabase()

    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      // user data to pass into header props
      this.user = user

      // if (user) {
      //   console.log(`${user.email} logged in`)
      // } else console.log('user logged out')

      // if user has just registered, there will be no displayName set yet. In this case, the store's user is set in Register.vue after account creation, or, if anonymous, in the if statement below
      if (user && user.displayName) {
        // code for both registered and anonymous users

        // if the there is a previous user (i.e. signing in from anon account)
        if (this.$store.state.user) {
          // remove any open lobby games
          if (this.$store.state.hasOpenLobbyGame) {
            remove(ref(this.db, `lobby/users/${this.$store.state.user.name}`))
            this.$store.commit('setHasOpenLobbyGame', false)
          }

          // TODO: remove anonymous user from database
          // TODO: remove anonymous user from auth
        }

        // set store for user
        const path = user.isAnonymous ? '/anonymousUsers' : 'registeredUsers'
        const usersQuery = query(ref(this.db, path),
          orderByKey(), equalTo(user.displayName))

        onValue(usersQuery, (snapshot) => {
          if (snapshot.val()) {
            this.$store.commit('setUser', {
              ...snapshot.val()[user.displayName],
              name: user.displayName
            })
            // console.log(this.$store.state.user)
          } else {
            console.error('registered user could not be found in database')
            console.error('store user could not be set')
          }
        }, { onlyOnce: true })
      } else if (!user) {
        // if user has just logged out, the user will still be in the store
        if (this.$store.state.user) {
          // remove any open lobby games
          if (this.$store.state.hasOpenLobbyGame) {
            remove(ref(this.db, `lobby/users/${this.$store.state.user.name}`)).then(() => {
              this.$store.commit('setHasOpenLobbyGame', false)
            })
          }

          // remove user from state, as it is no longer valid
          this.$store.commit('setUser', null)
        }

        // if there is no user, log-in anonymously
        const auth = getAuth()
        signInAnonymously(auth).then((userCredential) => {
          const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals] })
          // console.log(randomName)

          updateProfile(userCredential.user, { displayName: randomName })

          // TODO: could result in collisions, but we'll worry about this later
          set(ref(this.db, `/anonymousUsers/${randomName}`), {
            name: randomName,
            rating: 1200
          })

          this.$store.commit('setUser', {
            name: randomName,
            rating: 1200
          })
        })
        // console.log(this.$store.state.user)
      } else {
        // user has no display name... presumably

        // error is muted for now, because it will always throw between the creation of a user and the update of the profile (thus adding a display name)
        // console.error('user exists, but has no display name')
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
