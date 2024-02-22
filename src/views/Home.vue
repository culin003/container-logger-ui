<style>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
}
.layout-logo{
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 20px;
}
.layout-nav{
  width: 420px;
  margin: 0 20px 0 auto;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark">
          <div class="layout-nav">
            <div style="width: 210px; position: fixed; left: 30px; color: #d7dde4">Container Logger</div>
            <Dropdown trigger="click" style="position: fixed; right: 30px;">
              <a style="color: #d7dde4" href="javascript:void(0)">
                <Icon type="logo-octocat" />
                {{ loginUser.name }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <template #list>
                <DropdownMenu>
                  <DropdownItem @click="logout">退出登录</DropdownItem>
                </DropdownMenu>
              </template>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="1-0" theme="light" width="auto" :open-names="['1']">
            <Submenu name="1">
              <template #title>
                <Icon type="ios-navigate"></Icon>
                系统管理
              </template>
              <MenuItem v-for="(menu, index) in menuData" :name="'1-' + index" @click="itemClick(menu.path)">{{ menu.name }}</MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
          <Content :style="{padding: '20px 0 0 0', minHeight: '280px'}">
            <router-view/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginUser: {},
      menuData: []
    }
  },
  mounted() {
    let loginUserJson = localStorage.getItem("loginUser");
    let user = JSON.parse(loginUserJson);
    this.loginUser = user;
    let data = [{
        name: "用户管理",
        path: "/userManagement"
      },{
        name: "用户组管理",
        path: "/userGroupManagement"
      },{
        name: "容器管理",
        path: "/containerManagement"
      }]

    if (user.id === "1") {
      this.menuData = data;
    }else{
      data.splice(0, 2)
      this.menuData = data;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('loginUser')
      localStorage.removeItem("token")
      this.$router.push('/login')
    },
    itemClick(path) {
      this.$router.push(path)
    }
  }
}
</script>
