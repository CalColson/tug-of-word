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
    // TODO: overhaul this function!!! diagram out exactly what needs to be done when each kind of user logs in (3 kinds: no user, anonUser, registeredUser). Also note what happens on save, try to remove the errors of login occurring just through a hot-reload, not a full f5 page reload
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`${user.displayName} logged in`)
      } else console.log('user logged out')

      // user data to pass into header props
      this.user = user

      // if user has just registered, there will be no displayName set yet. In this case, the store's user is set in Register.vue after account creation, or, if anonymous, in the if statement below
      if (user && user.displayName) {
        // code for both registered and anonymous users

        // if there is a previous user (i.e. signing in from anon account)
        if (this.$store.state.user &&
        // This second check is used to make sure it isn't just reran on save
          this.$store.state.user.uid !== user.uid) {
          // remove any open lobby games
          if (this.$store.state.hasOpenLobbyGame) {
            remove(ref(this.db, `lobby/users/${this.$store.state.user.name}`))
            this.$store.commit('setHasOpenLobbyGame', false)
          }

          remove(ref(this.db, `anonymousUsers/${this.$store.state.user.name}`))
          fetch(`http://localhost:3000/user/${this.$store.state.user.uid}`, { method: 'DELETE' })
        }

        // set store for user
        const path = user.isAnonymous ? '/anonymousUsers' : 'registeredUsers'
        const usersQuery = query(ref(this.db, path),
          orderByKey(), equalTo(user.displayName))

        onValue(usersQuery, (snapshot) => {
          if (snapshot.val()) {
            this.$store.commit('setUser', snapshot.val()[user.displayName])
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
          // console.log(userCredential)

          const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals] })
          // console.log(randomName)

          updateProfile(userCredential.user, { displayName: randomName })

          // TODO: could result in collisions, but we'll worry about this later
          const anonUser = {
            uid: userCredential.user.uid,
            name: randomName,
            rating: 1200
          }
          set(ref(this.db, `/anonymousUsers/${randomName}`), anonUser)
          this.$store.commit('setUser', anonUser)
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
