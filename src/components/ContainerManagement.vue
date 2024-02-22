<template>
  <Layout>
    <Header style="background-color: #d7dde4">
      <Form style="padding-top: 15px" ref="formInline" :model="formInline" inline>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.name" placeholder="容器名称">
            <template #prepend>
              <Icon type="ios-person-outline"></Icon>
            </template>
          </Input>
        </FormItem>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.host" placeholder="宿主机IP">
            <template #prepend>
              <Icon type="ios-person-outline"></Icon>
            </template>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formInline')">查询</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="showDrawerForm">增加</Button>
        </FormItem>
      </Form>
    </Header>
    <Content>
      <Table border :columns="table.columns" :data="table.data">
        <template #action="{ index }">
          <Tooltip content="查看容器日志" placement="top">
            <Button type="primary" shape="circle" icon="ios-bug" style="margin-right: 5px" @click="showContainerLog(index)"></Button>
          </Tooltip>
          <Tooltip v-if="isAdmin" content="复制容器信息" placement="top">
            <Button type="warning" shape="circle" icon="ios-copy-outline" style="margin-right: 5px" @click="copy(index)"></Button>
          </Tooltip>
          <Tooltip v-if="isAdmin" content="修改容器信息" placement="top">
            <Button type="warning" shape="circle" icon="ios-create-outline" style="margin-right: 5px" @click="modify(index)"></Button>
          </Tooltip>
          <Tooltip v-if="isAdmin" content="删除容器" placement="top">
            <Button type="error" shape="circle" icon="ios-remove-circle-outline" @click="remove(index)"></Button>
          </Tooltip>
        </template>
      </Table>
    </Content>
    <Footer style="position:fixed; right: 10px; bottom: 10px; padding: 10px;">
      <Page :total="page.total" :page-size="page.size" @on-page-size-change="pageSizeChange" @on-change="pageChange" show-sizer />
    </Footer>
  </Layout>

  <Drawer
      title="创建容器"
      v-model="drawer.value"
      width="720"
      :mask-closable="false"
      :styles="drawer.styles"
  >
    <Form :model="drawer.formData" ref="addForm">
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="宿主机账号" label-position="top">
            <Input v-model="drawer.formData.account" placeholder="宿主机账号" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="宿主机密码" label-position="top">
            <Input v-model="drawer.formData.password" type="password" placeholder="宿主机密码">
            </Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="宿主机IP" label-position="top">
            <Input v-model="drawer.formData.host" placeholder="宿主机IP">
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="宿主机端口" label-position="top">
            <Input v-model="drawer.formData.port" placeholder="端口">
            </Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="容器名称" label-position="top">
            <Input v-model="drawer.formData.name" placeholder="容器名称">
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="宿主机密钥" label-position="top">
            <Input v-model="drawer.formData.privateKey" placeholder="密钥">
            </Input>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="命名空间" label-position="top">
        <Input v-model="drawer.formData.namespace" placeholder="命名空间">
        </Input>
      </FormItem>
      <FormItem label="日志命令" label-position="top">
        <Input type="textarea" v-model="drawer.formData.logCommand" :rows="2" placeholder="please enter the command" />
      </FormItem>
      <FormItem label="备注" label-position="top">
        <Input type="textarea" v-model="drawer.formData.notes" :rows="6" placeholder="please enter the description" />
      </FormItem>
    </Form>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="drawer.value = false">取消</Button>
      <Button type="primary" @click="addContainer('addForm')">保存</Button>
    </div>
  </Drawer>
</template>

<script>
import * as containerApi from '../api/ContainerApi'

export default {
  name: 'ContainerManagement',
  setup() {
  },
  data() {
    return {
      isAdmin: false,
      formInline: {
        name: '',
        account: ''
      },
      page: {
        size: 10,
        total: 0
      },
      table: {
        columns: [
          {
            title: '容器名称',
            key: 'name'
          },
          {
            title: '宿主机账号',
            key: 'account'
          },
          {
            title: '宿主机IP',
            key: 'host'
          },
          {
            title: '宿主机端口',
            key: 'port'
          },
          {
            title: '描述',
            key: 'notes'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        data: [],
      },
      drawer: {
        value: false,
        model: 'create',
        groups: [],
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        formData: {
          id: '',
          account: '',
          password: '',
          name: '',
          host: '',
          port: 0,
          privateKey: "",
          logCommand: "",
          namespace: "",
          notes: ''
        },
      }
    }
  },
  mounted() {
    let loginUserJson = localStorage.getItem("loginUser");
    let user = JSON.parse(loginUserJson);
    if (user.id === "1") {
      this.isAdmin = true
    }
    this.queryContainer(1)
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.queryContainer(1)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    queryContainer (pageNo) {
      containerApi.containerList({
        pageSize: this.page.size,
        pageCurrent: pageNo,
        host: isEmpty(this.formInline.host) ? null : this.formInline.host,
        name: isEmpty(this.formInline.name) ? null : this.formInline.name
      }).then(response => {
        this.page.total = parseInt(response.data.total)
        this.table.data = response.data.records
      })
    },
    modify (index) {
      this.drawer.model = 'update'
      this.showCreateContainer(this.table.data[index])
    },
    copy (index) {
      this.drawer.model = 'create'
      let source = this.table.data[index];
      let copyData = {
        id: '',
        account: source.account,
        password: source.password,
        name: source.name,
        host: source.host,
        port: source.port,
        privateKey: source.privateKey,
        logCommand: source.logCommand,
        namespace: source.namespace,
        notes: source.notes
      }
      this.showCreateContainer(copyData)
    },
    remove (index) {
      let _this = this;
      this.$Modal.confirm({
        title: '删除确认',
        content: '确定要删除容器吗？',
        onOk: function (){
          containerApi.deleteContainer({id: _this.table.data[index].id}).then(() => {
            _this.queryContainer(1)
          })
        }
      })
    },
    pageChange (pageNo) {
      this.queryContainer(pageNo)
    },
    pageSizeChange (pageSize) {
      this.page.size = pageSize
      this.queryContainer(1)
    },
    showDrawerForm () {
      this.drawer.model = 'create'
      this.showCreateContainer( {
        id: '',
        account: '',
        password: '',
        name: '',
        host: '',
        port: 0,
        privateKey: "",
        logCommand: "",
        namespace: "",
        notes: ''
      })
    },
    showCreateContainer (data) {
      this.drawer.formData = data
      this.drawer.value = true
    },
    addContainer (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.drawer.model === 'create') {
            containerApi.addContainer(this.drawer.formData).then(() => {
              this.queryContainer(1);
              this.drawer.value = false
            })
          }else{
            containerApi.updateContainer(this.drawer.formData).then(() => {
              this.queryContainer(1);
              this.drawer.value = false
            })
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    showContainerLog (index) {
      window.open("/#/containerLogger?sid=" + this.table.data[index].id, "_blank")
    }
  }
}
</script>

<style scoped>
.demo-drawer-footer{
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
