<template lang="pug">
#header
  nav#header-nav
    #logo tug of word
    .header-link PLAY
    .header-link RULES
    .header-link ABOUT
    #sign-in-link(@click='onSignInClicked') SIGN IN
      modal#sign-in-modal(name='sign-in' height='75%')
        form#sign-in-form
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
            button SIGN IN
            #register-link No account? Register.

</template>

<script>
export default {
  name: 'Header',
  data: function () {
    return {
      userNameOrEmail: '',
      password: '',

      isNameOrEmailValid: false,
      isEmail: false,
      isPasswordValid: false
    }
  },
  mounted () {
    this.onSignInClicked()
  },
  methods: {
    onSignInClicked () {
      this.$modal.show('sign-in')
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
  padding-inline: 12.5%;
  padding-block: 7.5%;

  color: $lighter-gray;
  font-size: $medium;
}
#sign-in-form #sign-in-modal-heading {
  flex: 1;

  font-size: 3rem;
  font-family: 'Roboto', sans-serif;
}
#sign-in-form .input-group {
  flex: 1;

  input {
    width: 100%;
    height: 2.5rem;

    margin-top: 10px;
    padding-inline: 13.25px;

    color: $lighter-gray;
    background-color: $darkest-gray;

    border: 1px solid $dark-gray;
    border-radius: 3px;

    &.invalid {
      border: 1px solid $failure;
    }
  }
}
#sign-in-form #action-area {
  flex: 1;

  display: flex;
  flex-direction: column;

  button {
    width: 100%;
    height: 3rem;

    color: $white;
    font-size: $medium;
    font-weight: 600;
    background-color: $info;
    border-radius: 3px;
    border: none;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.224);

    cursor: pointer;
  }

  #register-link {
    margin-top: auto;

    color: $info;

    cursor: pointer;
  }
}
</style>
