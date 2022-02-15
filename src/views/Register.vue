<template lang='pug'>
#register
  form#register-form(@submit.prevent='onSubmit')
          .heading Register
          .input-group
            label(for="userNameInput") User name
            input#userNameInput(:class='{invalid: !isUserNameValid}' v-model='userName' @keyup='updateValidity' type="text" autofocus)
          .input-group
            label(for="password") Password:
            input#password(:class='{invalid: !isPasswordValid}' v-model='password' @keyup='updateValidity' type="password")
          .input-group
            label(for="email") Email:
            input#email(:class='{invalid: !isEmailValid}' v-model='email' @keyup='updateValidity' type="email")
          button#register-button.form-button Register
</template>

<script>
export default {
  name: 'Register',
  data: function () {
    return {
      userName: '',
      isUserNameValid: false,

      password: '',
      isPasswordValid: false,

      email: '',
      isEmailValid: false
    }
  },
  computed: {
    formIsValid () {
      return this.isUserNameValid && this.isPasswordValid && this.isEmailValid
    }
  },
  methods: {
    updateValidity () {
      this.checkUserName()
      this.checkPassword()
      this.checkEmail()
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
        console.log('registering')
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

  .heading {
    font-family: 'Roboto', sans-serif;
    font-size: $xx-large;
  }

  .input-group {
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #register-button {
    margin-top: 30px;
  }
}
</style>
