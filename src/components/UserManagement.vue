<template>
  <Layout>
    <Header style="background-color: #d7dde4">
      <Form style="padding-top: 15px" ref="formInline" :model="formInline" inline>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.account" placeholder="账号">
            <template #prepend>
              <Icon type="ios-person-outline"></Icon>
            </template>
          </Input>
        </FormItem>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.name" placeholder="用户名">
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
          <Tooltip content="修改用户信息" placement="top">
            <Button type="warning" shape="circle" icon="ios-create-outline" style="margin-right: 5px" @click="modify(index)"></Button>
          </Tooltip>
          <Tooltip content="删除用户信息" placement="top">
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
      title="创建用户"
      v-model="drawer.value"
      width="720"
      :mask-closable="false"
      :styles="drawer.styles"
  >
    <Form :model="drawer.formData" ref="addForm">
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="账号" label-position="top">
            <Input v-model="drawer.formData.account" placeholder="账号" />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="密码" label-position="top">
            <Input v-model="drawer.formData.password" type="password" placeholder="密码">
            </Input>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="32">
        <Col span="12">
          <FormItem label="用户名" label-position="top">
            <Input v-model="drawer.formData.name" placeholder="用户名">
            </Input>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="用户组" label-position="top">
            <Select v-model="drawer.formData.groups" placeholder="用户组" multiple>
              <Option v-for="item in drawer.groups" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="备注" label-position="top">
        <Input type="textarea" v-model="drawer.formData.notes" :rows="6" placeholder="please enter the description" />
      </FormItem>
    </Form>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="drawer.value = false">取消</Button>
      <Button type="primary" @click="addUser('addForm')">保存</Button>
    </div>
  </Drawer>
</template>

<script>
import * as userApi from '../api/UserApi'
import * as userGroupApi from '../api/UserGroupApi'

export default {
  name: 'UserManagement',
  setup() {
  },
  data() {
    return {
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
            title: '账号',
            key: 'account'
          },
          {
            title: '用户名',
            key: 'name'
          },
          {
            title: '描述',
            key: 'notes'
          },
          {
            title: '最后登录时间',
            key: 'updateTime'
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
          groups: '',
          notes: ''
        },
      }
    }
  },
  mounted() {
    this.queryUsers(1)
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.queryUsers(1)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    queryUsers (pageNo) {
      userApi.userList({
        pageSize: this.page.size,
        pageCurrent: pageNo,
        account: isEmpty(this.formInline.account) ? null : this.formInline.account,
        name: isEmpty(this.formInline.name) ? null : this.formInline.name
      }).then(response => {
        this.page.total = parseInt(response.data.total)
        this.table.data = response.data.records
      })
    },
    modify (index) {
      this.drawer.model = 'update'
      this.showCreateUser(this.table.data[index])
    },
    remove (index) {
      let _this = this;
      this.$Modal.confirm({
        title: '删除确认',
        content: '确定要删除用户吗？',
        onOk: function (){
          userApi.deleteUser({id: _this.table.data[index].id}).then(() => {
            _this.queryUsers(1)
          })
        }
      })
    },
    pageChange (pageNo) {
      this.queryUsers(pageNo)
    },
    pageSizeChange (pageSize) {
      this.page.size = pageSize
      this.queryUsers(1)
    },
    showDrawerForm () {
      this.drawer.model = 'create'
      this.showCreateUser( {
        id: '',
        account: '',
        password: '',
        name: '',
        groups: '',
        notes: ''
      })
    },
    showCreateUser (data) {
      userGroupApi.groupList({
        pageSize: 500,
        pageCurrent: 1,
      }).then((response) => {
        this.drawer.groups = response.data.records
        data.groups = data.groups.split(',')
        this.drawer.formData = data
        this.drawer.value = true
      })
    },
    addUser (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.drawer.formData.groups) {
            this.drawer.formData.groups = this.drawer.formData.groups.join(',')
          }

          if (this.drawer.model === 'create') {
            userApi.addUser(this.drawer.formData).then(() => {
                  this.queryUsers(1);
                  this.drawer.value = false
                })
          }else{
            userApi.updateUser(this.drawer.formData).then(() => {
              this.queryUsers(1);
              this.drawer.value = false
            })
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
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
