<template>
  <div class="login-form demo-login">
    <Login @on-submit="handleSubmit">
      <UserName name="username" value="" />
      <Password name="password" value="" />
      <Submit />
    </Login>
  </div>
</template>
<script>
import * as sessionApi from '../api/SessionApi'
export default {
  methods: {
    handleSubmit(valid, { username, password }) {
      if (valid) {
        sessionApi.login({
          account: username,
          password: password
        }).then(response => {
          localStorage.setItem('loginUser', JSON.stringify(response.data.data))
          localStorage.setItem('token', response.data.data.token)
          this.$router.push(response.data.data.id === "1" ? '/userManagement' : '/containerManagement')
        }).catch(data => {
          this.$Message.error({
            content: data.desc,
            duration: 3
          })
        })
      }
    }
  }
}
</script>
<style>
.login-form{
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.demo-login{
  width: 400px !important;
  margin: 0 auto;
}
</style>
