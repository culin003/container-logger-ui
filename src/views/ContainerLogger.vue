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
            <MenuItem name="4" style="position: fixed; right: 30px;" @click="closeXterm">
              <Icon type="ios-paper"></Icon>
              关闭
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{padding: '0 0 0 0', minHeight: '280px'}">
        <div id="loggerView" style="height: 100%; width: 100%;"></div>
      </Content>
    </Layout>
  </div>
</template>
<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { AttachAddon } from 'xterm-addon-attach'
import GLOBAL from '../api/GlobalVariable'

export default {
  name: 'ContainerLogger',
  data(){
    return {

    }
  },
  methods: {
    closeXterm () {
      window.close()
    }
  },
  mounted() {
    const terminal = new Terminal({
      disableStdin: true,
      convertEol: true,
      cursorBlink: true,
      theme: {
        foreground: "#ECECEC", //字体
        background: "#000000", //背景色
        cursor: "help", //设置光标
        lineHeight: 30,
      }
    })
    const fitAddon = new FitAddon()
    const socket = new WebSocket(`${GLOBAL.BASE_WS}${this.$route.query.sid}/ws`)
    const attachAddon = new AttachAddon(socket)
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(attachAddon)
    terminal.open(document.getElementById("loggerView"))
    fitAddon.fit()
    window.onresize = () => {
      fitAddon.fit()
    }

  }
}
</script>
