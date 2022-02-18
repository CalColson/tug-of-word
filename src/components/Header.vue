<template lang="pug">
#header
  nav#header-nav
    router-link#logo(to='/') tug of word
    .header-link PLAY
    .header-link RULES
    .header-link ABOUT
    #anon-header-container(v-if='(user && user.isAnonymous && user.displayName)')
      #anon-name Temporary ID: {{user.displayName}}
      //- TODO: autofill name in register vuew with the anon display-name
      router-link.register-link(to='/register') Register now!
    #sign-in-link(v-if='!user || user.isAnonymous' @click='onSignInClicked') SIGN IN
      modal#sign-in-modal(:name='signInModalName' height='75%' @closed='onModalClosed')
        form#sign-in-form(@submit.prevent='onSubmit')
          #sign-in-modal-heading
            span Sign in
            span#firebase-error-message {{firebaseSignInErrorMessage}}
          .input-group
            label(for="userNameOrEmailInput") User name or email:
            span.sign-in-error-message {{userNameOrEmailErrorMessage}}
            br
            input#userNameOrEmailInput(:class='{invalid: !isNameOrEmailValid}' v-model='userNameOrEmail' @keyup='updateValidity' type="text" autofocus)
          .input-group
            label(for="passwordInput") Password:
            span.sign-in-error-message {{passwordErrorMessage}}
            br
            input#passwordInput(:class='{invalid: !isPasswordValid}' v-model='password' @keyup='updateValidity' type="password")
          #action-area
            button.form-button SIGN IN
            #register-link(to='/register' @click='onRegisterClicked') No account? Register.
    #username-button(v-else @click='onUsernameButtonClicked')
      font-awesome-icon(icon='fa-regular fa-flag')
      span#header-username {{user.displayName}}
      #username-dropdown(:class="{active: isUsernameDropdownActive}")
        .dropdown-item1(@click='onLogoutClicked') logout

</template>

<script>
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDatabase, ref, query, onValue, equalTo, orderByKey } from 'firebase/database'

import { nanoid } from 'nanoid'

export default {
  name: 'Header',
  props: {
    user: Object
  },
  data: function () {
    return {
      auth: null,

      isUsernameDropdownActive: false,
      outsideDropdownClickListener: null,

      signInModalName: 'sign-in',

      userNameOrEmail: '',
      userNameOrEmailErrorMessage: '',
      userNameOrEmailErrorCode: 'minLength',

      password: '',
      passwordErrorMessage: '',

      isNameOrEmailValid: false,
      isEmail: false,
      isPasswordValid: false,

      firebaseSignInErrorMessage: ''
    }
  },
  created () {
    this.auth = getAuth()

    // this does not trigger when the click is in the dropdown, due to stopPropogation, this is rather hacky, so keep it in mind, and consider refactoring later
    this.outsideDropdownClickListener = () => {
      this.isUsernameDropdownActive = false
    }
    document.addEventListener('click', this.outsideDropdownClickListener)
  },
  mounted () {
    // this.onSignInClicked()
  },
  destroyed () {
    document.removeEventListener('click', this.outsideDropdownClickListener)
  },
  methods: {
    onSignInClicked () {
      this.$modal.show(this.signInModalName)
    },
    updateValidity (e) {
      this.clearErrorMessages(e)

      this.checkNameOrEmail()
      this.checkPassword()
    },
    clearErrorMessages (e) {
      this.firebaseSignInErrorMessage = ''
      if (e && e.target.id === 'userNameOrEmailInput') this.userNameOrEmailErrorMessage = ''
      if (e && e.target.id === 'passwordInput') this.passwordErrorMessage = ''
    },
    checkNameOrEmail () {
      this.userNameOrEmailErrorCode = ''

      // check userNameOrEmail validity
      if (this.userNameOrEmail.length >= 3) {
        // is appropriate minimum length
        if (!this.userNameOrEmail.includes('@')) {
          // does not have an @ symbol
          this.isNameOrEmailValid = true
          this.isEmail = false
        } else {
          // could potentially be an email
          if (/^.+@.+\..{2,}$/g.test(this.userNameOrEmail)) {
            // is valid email
            this.isNameOrEmailValid = true
            this.isEmail = true
          } else {
            // is invalid username (contain's an @ symbol, but is not a valid email)
            this.isNameOrEmailValid = false
            this.userNameOrEmailErrorCode = 'invalidName'
            this.isEmail = false
          }
        }
      } else {
        this.isNameOrEmailValid = false
        this.userNameOrEmailErrorCode = 'minLength'
        this.isEmail = false
      }
    },
    checkPassword () {
      // check password validity
      if (this.password.length >= 6) {
        // is appropriate minimum length
        this.isPasswordValid = true
      } else this.isPasswordValid = false
    },

    onSubmit () {
      if (this.isNameOrEmailValid && this.isPasswordValid) {
        const onSuccessfulSignIn = (userCredential) => {
          // console.log(userCredential)
          this.$modal.hide('sign-in')
        }
        const onFailedSignIn = (err) => {
          // console.error(err)
          if (err.code === 'auth/invalid-email') {
            this.firebaseSignInErrorMessage = 'invalid email'
          } else if (err.code === 'auth/user-disabled') {
            this.firebaseSignInErrorMessage = 'user account disabled'
          } else if (err.code === 'auth/user-not-found') {
            this.firebaseSignInErrorMessage = 'user not found'
          } else if (err.code === 'auth/wrong-password') {
            this.firebaseSignInErrorMessage = 'user not found'
          }
        }
        const userNameOrEmail = this.userNameOrEmail.trim()

        if (this.isEmail) {
          // if the input was an email, we simply sign in
          signInWithEmailAndPassword(this.auth, userNameOrEmail, this.password)
            .then(onSuccessfulSignIn)
            .catch(onFailedSignIn)
        } else {
          // otherwise, we have to find the email associated with the username
          const db = getDatabase()
          const usersQuery = query(ref(db, '/registeredUsers'),
            orderByKey(), equalTo(userNameOrEmail))

          onValue(usersQuery, (snapshot) => {
            // console.log(snapshot.val())
            let email
            if (snapshot.val()) email = snapshot.val()[userNameOrEmail].email
            // just throwing in a random email to fail the sign-in
            else email = userNameOrEmail + nanoid() + '@completely14fake.com'

            signInWithEmailAndPassword(this.auth, email, this.password)
              .then(onSuccessfulSignIn)
              .catch(onFailedSignIn)
          }, { onlyOnce: true })
        }
      } else {
        // console.error('invalid login')
        if (!this.isNameOrEmailValid) {
          if (this.userNameOrEmailErrorCode === 'minLength') {
            this.userNameOrEmailErrorMessage = '3 character minimum length'
          } else if (this.userNameOrEmailErrorCode === 'invalidName') {
            this.userNameOrEmailErrorMessage = 'invalid email (usernames cannot contain @)'
          }
        }
        if (!this.isPasswordValid) {
          this.passwordErrorMessage = '6 character minimum length'
        }
      }
    },

    onRegisterClicked () {
      this.cleanup()
      this.$router.push('./register')
    },

    onModalClosed () {
      this.userNameOrEmail = ''
      this.userNameOrEmailErrorMessage = ''
      this.userNameOrEmailErrorCode = 'minLength'

      this.password = ''
      this.passwordErrorMessage = ''

      this.isNameOrEmailValid = false
      this.isEmail = false
      this.isPasswordValid = false
    },

    onUsernameButtonClicked (e) {
      e.stopPropagation()
      this.isUsernameDropdownActive = true
    },

    onLogoutClicked () {
      signOut(getAuth())
    },

    // called when navigating to a new page
    cleanup () {
      this.$modal.hide(this.signInModalName)
    }
  }
}
</script>

<style lang="scss" scoped>
#header {
  height: 15vh;
}
#header-nav {
  display: flex;
  align-items: center;
  gap: 55px;

  height: 100%;
  padding-inline: 2rem;

  background: linear-gradient(180deg, $darker-gray 0%, $black 100%);
}
#header-nav #logo {
  font-size: 32px;

  color: $white;
  text-decoration: none;
  cursor: pointer;
}
#header-nav #logo:hover {
  color: $info
}
#header-nav .header-link {
  font-weight: 300;
}
#header-nav .header-link:hover {
  color: $accent;
  cursor: pointer;
}

#anon-header-container {
  margin-left: auto;

  text-align: center;
  font-size: $small;

  .register-link {
    color: $info;
    cursor: pointer;
  }
}

#header-nav #sign-in-link {
  margin-left: auto;
  // to cancel out the padding
  margin-right: -15px;
  padding: 15px;
  border-radius: 8px;

  font-size: 24px;
  color: $info;

  cursor: pointer;
}

#header-nav #sign-in-link:hover {
  background-color: $darker-gray;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.224);
}

#sign-in-modal #sign-in-form {
  display: flex;
  flex-direction: column;
  justify-items: center;

  height: 100%;
  padding: 7.5% 12.5%;

  color: $lighter-gray;
  font-size: $medium;
}
#sign-in-form #sign-in-modal-heading {
  flex: 1;

  display: flex;

  font-family: 'Roboto', sans-serif;
  font-size: $xx-large;

  #firebase-error-message {
    margin-inline: auto;

    font-size: $large;
    line-height: $xx-large;
    color: $failure
  }
}
#sign-in-form .input-group {
  flex: 1;

  .sign-in-error-message {
    margin-left: 1rem;

    font-size: $small;
    color: $failure;
  }
}
#sign-in-form #action-area {
  flex: 1;

  display: flex;
  flex-direction: column;

  #register-link {
    margin-top: auto;

    color: $info;

    cursor: pointer;
  }
}
#username-button {
  position: relative;

  margin-left: auto;
  // to cancel out the padding
  margin-right: -15px;
  padding-inline: 15px;
  border-radius: 8px;

  font-size: $large;
  color: $light-gray;

  cursor: pointer;

  &:hover {
    color: $white;
  }

  #header-username {
    margin-left: 0.5rem;
  }

  #username-dropdown {
    visibility: hidden;
    &.active {
      visibility: visible;
    }

    position: absolute;
    right: 0;

    width: 100%;
    min-width: 10rem;

    padding-block: 0.5rem;

    text-align: center;
    font-size: $large;
    color: $lighter-gray;

    background-color: $dark-gray;
    border-radius: 6px;

    &:hover {
      color: $white;
    }
  }
}
</style>
