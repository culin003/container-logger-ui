<template>
  <Layout>
    <Header style="background-color: #d7dde4">
      <Form style="padding-top: 15px" ref="formInline" :model="formInline" inline>
        <FormItem prop="user">
          <Input type="text" v-model="formInline.name" placeholder="用户组名称">
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
          <Tooltip content="查看组内用户" placement="top">
            <Button type="primary" shape="circle" icon="ios-people" style="margin-right: 5px" @click="groupUsers(index)"></Button>
          </Tooltip>
          <Tooltip content="关联容器" placement="top">
            <Button type="primary" shape="circle" icon="ios-link" style="margin-right: 5px" @click="linkContainers(index)"></Button>
          </Tooltip>
          <Tooltip content="修改组信息" placement="top">
            <Button type="warning" shape="circle" icon="ios-create-outline" style="margin-right: 5px" @click="modify(index)"></Button>
          </Tooltip>
          <Tooltip content="删除用户组" placement="top">
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
      title="创建用户组"
      v-model="createDrawer.value"
      width="720"
      :mask-closable="false"
      :styles="createDrawer.styles"
  >
    <Form :model="createDrawer.formData" ref="addForm">
      <FormItem label="组名" label-position="top">
        <Input v-model="createDrawer.formData.name" placeholder="组名">
        </Input>
      </FormItem>
      <FormItem label="备注" label-position="top">
        <Input type="textarea" v-model="createDrawer.formData.notes" :rows="6" placeholder="please enter the description" />
      </FormItem>
    </Form>
    <div class="demo-drawer-footer">
      <Button style="margin-right: 8px" @click="createDrawer.value = false">取消</Button>
      <Button type="primary" @click="addUserGroup('addForm')">保存</Button>
    </div>
  </Drawer>

  <Drawer
      title="查看用户"
      v-model="userDrawer.value"
      width="720"
      :mask-closable="true"
      :styles="userDrawer.styles"
  >
    <Table border :columns="userDrawer.columns" :data="userDrawer.data"/>
  </Drawer>

  <Drawer
      title="关联容器"
      v-model="linkContainerDrawer.value"
      width="1000"
      :mask-closable="false"
      :styles="linkContainerDrawer.styles"
  >
    <Table ref="containers" height="300" border :columns="linkContainerDrawer.containerColumns" :data="linkContainerDrawer.containerData" @on-selection-change="onContainerSelected"/>
    <div style="text-align: center; height: 50px; padding: 10px 0 10px 0;">
      <Button type="primary" icon="md-arrow-down" style="margin-right: 8px" @click="containerSelected">选择</Button>
    </div>
    <Table ref="linkContainers" height="300"  border :columns="linkContainerDrawer.linkContainerColumns" :data="linkContainerDrawer.linkContainerData" @on-selection-change="onLinkContainerSelected">
      <template #action="{ index }">
        <Tooltip content="删除用户信息" placement="top">
          <Button type="error" shape="circle" icon="ios-remove-circle-outline" @click="linkContainerDelete(index)"></Button>
        </Tooltip>
      </template>
    </Table>
    <div style="text-align: center; height: 50px; padding: 10px 0 10px 0;">
      <Button type="warning" style="margin-right: 8px" @click="linkContainerDrawer.value = false">取消</Button>
      <Button type="primary" style="margin-right: 8px" @click="saveLinkContainers">保存</Button>
    </div>
  </Drawer>
</template>

<script>
import * as userGroupApi from '../api/UserGroupApi'
import * as containerApi from '../api/ContainerApi'


export default {
  name: 'UserGroupManagement',
  setup() {
  },
  data() {
    return {
      formInline: {
        name: ''
      },
      page: {
        size: 10,
        total: 0
      },
      table: {
        columns: [
          {
            title: '组名',
            key: 'name'
          },
          {
            title: '描述',
            key: 'notes'
          },
          {
            title: '创建时间',
            key: 'createTime'
          },
          {
            title: '修改时间',
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
      createDrawer: {
        value: false,
        model: 'create',
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        formData: {
          id: '',
          name: '',
          userIds: '',
          notes: ''
        },
      },
      userDrawer: {
        value: false,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        columns: [
          {
            title: '账号',
            key: 'account'
          },
          {
            title: '用户名',
            key: 'name'
          }
        ],
        data: []
      },
      linkContainerDrawer: {
        value: false,
        groupId: 0,
        styles: {
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: '53px',
          position: 'static'
        },
        containerColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
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
            title: '容器名称',
            key: 'name'
          }
        ],
        linkContainerColumns: [
          {
            title: '宿主机IP',
            key: 'host'
          },
          {
            title: '宿主机端口',
            key: 'port'
          },
          {
            title: '容器名称',
            key: 'name'
          },
          {
            title: '操作',
            slot: 'action',
            align: 'center'
          }
        ],
        containerSelected: [],
        linkContainerSelected: [],
        containerData: [],
        linkContainerData: []
      }
    }
  },
  mounted() {
    this.queryUserGroups(1)
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.queryUserGroups(1)
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    queryUserGroups (pageNo) {
      userGroupApi.groupList({
        pageSize: this.page.size,
        pageCurrent: pageNo,
        name: isEmpty(this.formInline.name) ? null : this.formInline.name
      }).then(response => {
        this.page.total = parseInt(response.data.total)
        this.table.data = response.data.records
      })
    },
    modify (index) {
      this.createDrawer.model = 'update'
      this.showCreateUserGroup(this.table.data[index])
    },
    remove (index) {
      let _this = this;
      this.$Modal.confirm({
        title: '删除确认',
        content: '确定要删除用户组吗？',
        onOk: function (){
          userGroupApi.deleteGroup({id: _this.table.data[index].id}).then(() => {
            _this.queryUserGroups(1)
          })
        }
      })
    },
    pageChange (pageNo) {
      this.queryUserGroups(pageNo)
    },
    pageSizeChange (pageSize) {
      this.page.size = pageSize
      this.queryUserGroups(1)
    },
    showDrawerForm () {
      this.createDrawer.model = 'create'
      this.showCreateUserGroup( {
        id: '',
        account: '',
        password: '',
        name: '',
        groups: '',
        notes: ''
      })
    },
    showCreateUserGroup (data) {
      this.createDrawer.formData = data
      this.createDrawer.value = true
    },
    addUserGroup (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.createDrawer.model === 'create') {
            userGroupApi.addGroup(this.createDrawer.formData).then(() => {
              this.queryUserGroups(1);
              this.createDrawer.value = false
            })
          }else{
            userGroupApi.updateGroup(this.createDrawer.formData).then(() => {
              this.queryUserGroups(1);
              this.createDrawer.value = false
            })
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    groupUsers (index) {
      userGroupApi.groupUsers({groupId: this.table.data[index].id}).then((response) => {
        this.userDrawer.data = response.data
        this.userDrawer.value = true
      })
    },
    linkContainers (index) {
      Promise.all([
        containerApi.containerList({
          pageSize: 1000,
          pageCurrent: 1
        }),
        userGroupApi.groupContainers({
          groupId: this.table.data[index].id
        })
      ]).then((responses) => {
        this.linkContainerDrawer.groupId = this.table.data[index].id
        this.linkContainerDrawer.containerData = responses[0].data.records
        this.linkContainerDrawer.linkContainerData = responses[1].data.length === 0 ? [] : responses[1].data
        this.linkContainerDrawer.value = true
      })
    },
    containerSelected () {
      let data = []
      for (let i = 0; i < this.linkContainerDrawer.linkContainerData.length; i++) {
        data.push(this.linkContainerDrawer.linkContainerData[i])
      }

      for (let i = 0; i < this.linkContainerDrawer.containerSelected.length; i++) {
        if (data.findIndex((item) => {
          return item.id === this.linkContainerDrawer.containerSelected[i].id;
        }) < 0 ) {
          data.push(this.linkContainerDrawer.containerSelected[i])
        }
      }

      this.linkContainerDrawer.linkContainerData = data
    },
    linkContainerDelete (index) {
      this.linkContainerDrawer.linkContainerData.splice(index, 1);
    },
    saveLinkContainers () {
      let data = {
        groupId: this.linkContainerDrawer.groupId,
        data: []
      }
      for (let i = 0; i < this.linkContainerDrawer.linkContainerData.length; i++) {
        data.data.push({
          groupId: this.linkContainerDrawer.groupId,
          containerId: this.linkContainerDrawer.linkContainerData[i].id
        })
      }

      userGroupApi.addGroupContainers(data).then(() => {
        this.linkContainerDrawer.value = false
      })
    },
    onContainerSelected (selection) {
      this.linkContainerDrawer.containerSelected = selection
    },
    onLinkContainerSelected (selection) {
      this.linkContainerDrawer.linkContainerSelected = selection
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
