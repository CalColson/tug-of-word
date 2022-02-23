<template lang='pug'>
#register
  form#register-form(@submit.prevent='onSubmit')
    .heading-container
      span.heading Register
      span#firebaseErrorMessage {{firebaseRegisterErrorMessage}}
    .input-group
      div
        label(for="userNameInput") User name:
        span.error-message {{userNameErrorMessage}}
      input#userNameInput(:class='{invalid: !isUserNameValid}' v-model='userName' @keyup='updateValidity' type="text")
    .input-group
      div
        label(for="passwordInput") Password:
        span.error-message {{passwordErrorMessage}}
      input#passwordInput(:class='{invalid: !isPasswordValid}' v-model='password' @keyup='updateValidity' type="password")
      small#passwordNote Password must be at least 6 characters long
    .input-group
      div
        label(for="emailInput") Email:
        span.error-message {{emailErrorMessage}}
      input#emailInput(:class='{invalid: !isEmailValid}' v-model='email' @keyup='updateValidity' type="email")
    button#register-button.form-button Register
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'

export default {
  name: 'Register',
  data: function () {
    return {
      userName: '',
      isUserNameValid: false,
      userNameErrorMessage: '',

      password: '',
      isPasswordValid: false,
      passwordErrorMessage: '',

      email: '',
      isEmailValid: false,
      emailErrorMessage: '',

      firebaseRegisterErrorMessage: ''
    }
  },
  computed: {
    formIsValid () {
      return this.isUserNameValid && this.isPasswordValid && this.isEmailValid
    },
    cleanUserInfo () {
      return {
        userName: this.userName.trim(),
        password: this.password.trim(),
        email: this.email.trim()
      }
    }
  },
  methods: {
    updateValidity (e) {
      this.clearErrorMessages(e)

      this.checkUserName()
      this.checkPassword()
      this.checkEmail()
    },
    clearErrorMessages (e) {
      this.firebaseRegisterErrorMessage = ''

      // console.log(e.target.id)
      if (e && e.target.id === 'userNameInput') this.userNameErrorMessage = ''
      if (e && e.target.id === 'passwordInput') this.passwordErrorMessage = ''
      if (e && e.target.id === 'emailInput') this.emailErrorMessage = ''
    },
    checkUserName () {
      this.isUserNameValid = this.userName.length >= 3 && !this.userName.includes('@')
    },
    checkPassword () {
      this.isPasswordValid = this.password.length >= 6
    },
    checkEmail () {
      this.isEmailValid = this.email.length >= 6 &&
        /^.+@.+\..{2,}$/g.test(this.email)
    },

    onSubmit () {
      if (this.formIsValid) {
        // console.log('registering')
        const auth = getAuth()

        createUserWithEmailAndPassword(auth, this.cleanUserInfo.email, this.cleanUserInfo.password)
          .then((userCredential) => {
            // first set display name of the user
            updateProfile(userCredential.user, {
              displayName: this.cleanUserInfo.userName
            }).catch((err) => console.error(err))

            const registeredUser = {
              uid: userCredential.user.uid,
              name: this.cleanUserInfo.userName,
              email: userCredential.user.email,
              rating: 1200
            }
            // then create instance of the user in the rtdb
            const db = getDatabase()
            set(ref(db, `registeredUsers/${this.cleanUserInfo.userName}`), registeredUser)
              .then(() => {
              // lastly, set store user, because on initial creation of user, displayName is not yet updated (so it cannot be accessed in the onAuthStateChanged function in App.vue)
                this.$store.commit('setUser', registeredUser)

                // finally go back to home page
                this.$router.push('/')
              }).catch((err) => console.log(err))
          }).catch((err) => {
            // console.log(err)
            if (err.code === 'auth/email-already-in-use') {
              this.firebaseRegisterErrorMessage = 'email is already in use'
            } else if (err.code === 'auth/invalid-email') {
              this.firebaseRegisterErrorMessage = 'invalid email'
            } else if (err.code === 'auth/weak-password') {
              this.firebaseRegisterErrorMessage = 'password too weak ( < 6 char )'
            }
          })
      } else {
        // console.error('invalid form')
        if (!this.isUserNameValid) {
          if (this.userName.length < 3) this.userNameErrorMessage = '3 character minimum length'
          else if (this.userName.includes('@')) this.userNameErrorMessage = 'name cannot include "@"'
        }
        if (!this.isPasswordValid) {
          this.passwordErrorMessage = '6 character minimum length'
        }
        if (!this.isEmailValid) {
          this.emailErrorMessage = 'invalid email'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$register-padding-bottom: 20px;

#register {
  padding-bottom: $register-padding-bottom;
}
#register-form {
  display: flex;
  flex-direction: column;

  min-height: calc(85vh - $register-padding-bottom);
  max-width: 750px;

  margin-inline: auto;
  padding: 3% 6%;

  color: $lighter-gray;
  background-color: $darkest-gray;
  border-radius: 3px;

  .heading-container {
    display: flex;
    .heading {
      font-family: 'Roboto', sans-serif;
      font-size: $xx-large;
    }
  }

  #firebaseErrorMessage {
    margin-inline: auto;

    font-size: $large;
    line-height: $xx-large;
    color: $failure
  }

  .input-group {
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;

    .error-message {
      margin-left: 1rem;

      font-size: $small;
      color: $failure
    }
  }

  #register-button {
    margin-top: 30px;
  }
}
</style>
