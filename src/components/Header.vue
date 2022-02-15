<template lang="pug">
#header
  nav#header-nav
    router-link#logo(to='/') tug of word
    .header-link PLAY
    .header-link RULES
    .header-link ABOUT
    #sign-in-link(@click='onSignInClicked') SIGN IN
      modal#sign-in-modal(:name='signInModalName' height='75%')
        form#sign-in-form(@submit.prevent='onSubmit')
          #sign-in-modal-heading Sign in
          .input-group
            label(for="userNameOrEmailInput") User name or email:
            br
            input#userNameOrEmailInput(:class='{invalid: !isNameOrEmailValid}' v-model='userNameOrEmail' @keyup='updateValidity' type="text" autofocus)
          .input-group
            label(for="password") Password:
            br
            input#password(:class='{invalid: !isPasswordValid}' v-model='password' @keyup='updateValidity' type="password")
          #action-area
            button.form-button SIGN IN
            #register-link(to='/register' @click='onRegisterClicked') No account? Register.

</template>

<script>
export default {
  name: 'Header',
  data: function () {
    return {
      signInModalName: 'sign-in',

      userNameOrEmail: '',
      password: '',

      isNameOrEmailValid: false,
      isEmail: false,
      isPasswordValid: false
    }
  },
  mounted () {
    // this.onSignInClicked()
  },
  methods: {
    onSignInClicked () {
      this.$modal.show(this.signInModalName)

      // focus first input after a short wait
      setTimeout(() => {
        document.getElementById('userNameOrEmailInput').focus()
      }, 500)
    },
    updateValidity () {
      this.checkNameOrEmail()
      this.checkPassword()
    },
    checkNameOrEmail () {
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
            this.isEmail = false
          }
        }
      } else {
        this.isNameOrEmailValid = false
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
      console.log('signing-up')
    },

    onRegisterClicked () {
      this.cleanup()
      this.$router.push('./register')
    },

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

  font-family: 'Roboto', sans-serif;
  font-size: $xx-large;
}
#sign-in-form .input-group {
  flex: 1;
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
</style>
