<template>
    <div class="sys-page">
        <div class="container">
            <el-tabs v-model="message" tab-position='top'>
                <el-tab-pane :label="`基层工会组织`" name="first">
                    <!-- 搜索 -->
                    <!-- <app-search>
                        <el-form :inline="true" :model="searchForm">
                            <el-form-item label="隶属工会">
                                <el-select v-model="searchForm.orgination" placeholder="工会">
                                    <el-option v-for="item in unionNameValues" :key="item.id"  :value="item.id" :label="item.name"></el-option>
                                </el-select>
                            </el-form-item>
                             <el-form-item label="服务期限">
                                <el-date-picker v-model="searchForm.date" type="date" placeholder="时间"></el-date-picker>
                            </el-form-item>
                             <el-form-item label="状态">
                                <el-select v-model="searchForm.state" placeholder="状态" >
                                    <el-option  v-for="item in unionStateValues" :key="item.id"  :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="searchForm.text" placeholder="请输入查询条件"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="search">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </app-search> -->
                     <!---基层工会组织 工具条 -->
                    <app-toolbar>
                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" @click="orgDataAdd" >新增</el-button>
                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" @click="orgDataEdit">修改</el-button>
                        <el-button type="primary">备份</el-button>
                        <el-button type="primary">恢复</el-button>
                        <el-button type="primary">导入</el-button>
                    </app-toolbar>

                    <!--基层工会组织 表格体 -->
                    <el-table 
                    v-loading="orgData.loading" 
                    :data="orgData.data" 
                    class="table"
                    ref="organizeTable"
                    :header-cell-style="{background:'#2780d1',color:'#fff'}"
                    border 
                    :default-sort="{prop: 'EnCode', order: 'descending'}">

                        <el-table-column type="index" label="序号" width="64" align="center"></el-table-column>
                        <el-table-column prop="EnCode" label="组织编码" width="120"></el-table-column>
                        <el-table-column prop="OrgName" label="组织名称"></el-table-column>
                        <el-table-column prop="ParentName" label="隶属工会"></el-table-column>
                        <el-table-column label="账套" >
                          <el-table-column prop="EnableTime" label="建账日期" width="100"></el-table-column>
                          <el-table-column prop="Creator" label="创建人" width="100"> </el-table-column>
                          <el-table-column prop="kuaiji" label="会计" width="100"> </el-table-column>
                          </el-table-column>
                        <el-table-column prop="EnabledMark" width="80" label="启用/停用"></el-table-column>
                        <el-table-column prop="ServiceEndTime" width="100" label="服务期限"></el-table-column>
                    </el-table>
                  <div class="pagination">
                      <el-pagination background @current-change="orgDataPageChange" layout="total,prev, pager, next" :page-size="orgData.pageSize" :total="orgData.totalCount">
                      </el-pagination>
                  </div>
                </el-tab-pane>
                <el-tab-pane :label="`机关工会组织`" name="second">
                    <template v-if="message === 'second'">
                          <!---机关工会组织 工具条 -->
                          <app-toolbar>
                              <el-button type="primary">新增</el-button>
                              <el-button type="primary" v-hasPermission="'edit'">修改</el-button>
                              <el-button type="primary">备份</el-button>
                              <el-button type="primary">恢复</el-button>
                              <el-button type="primary">导入</el-button>
                          </app-toolbar>

                          <!--机关工会组织 表格体 -->
                          <el-table 
                          v-loading="AdminOrgData.loading" 
                          :data="AdminOrgData.data" 
                          class="table"
                          ref="adminOrganizeTable"
                          :header-cell-style="{background:'#2780d1',color:'#fff'}"
                          border>
                              <el-table-column type="index" label="序号" width="64" align="center"></el-table-column>
                              <el-table-column prop="PhId" label="用户号" width="120"></el-table-column>
                              <el-table-column prop="EnCode" label="组织编码"></el-table-column>
                              <el-table-column prop="OrgName" label="组织名称"></el-table-column>
                              <el-table-column prop="NgInsertDt" width="100" label="创建日期"></el-table-column>
                          </el-table>
                        <div class="pagination">
                            <el-pagination background @current-change="adminOrgDataPageChange" layout="total,prev, pager, next" :page-size="AdminOrgData.pageSize" :total="AdminOrgData.totalCount">
                            </el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`待审核基层组织(${verifyOrgData.totalCount})`" name="third">
                    <template v-if="message === 'third'">

                            <el-tabs type="border-card">
                              <el-tab-pane label="待审核">
                                  <!---待审核 工具条 -->
                                  <app-toolbar>
                                      <el-button type="primary">审核</el-button>
                                  </app-toolbar>

                                  <!--待审核 表格体 -->
                                  <el-table 
                                  v-loading="verifyOrgData.loading" 
                                  :data="verifyOrgData.data" 
                                  class="table"
                                  ref="verifyOrganizeTable"
                                  :header-cell-style="{background:'#2780d1',color:'#fff'}"
                                  border>
                                      <el-table-column type="index" label="序号" width="64" align="center"></el-table-column>
                                      <el-table-column prop="OrgName" label="企业/单位名称" width="120"></el-table-column>
                                      <el-table-column prop="UserName" label="联系人姓名"></el-table-column>
                                      <el-table-column prop="MobilePhone" label="联系电话"></el-table-column>
                                      <el-table-column prop="Address" label="联系地址"></el-table-column>
                                      <el-table-column prop="Integrity" label="信息完整度（%）">
                                        <template slot-scope="scope">
                                          <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.Integrity"></el-progress>
                                        </template>
                                      </el-table-column>
                                      <el-table-column prop="Tryout" label="距试用结束时长"></el-table-column>
                                  </el-table>
                                <div class="pagination">
                                    <el-pagination background @current-change="verifyOrgDataPageChange" layout="total,prev, pager, next" :page-size="verifyOrgData.pageSize" :total="verifyOrgData.totalCount">
                                    </el-pagination>
                                </div>
                              </el-tab-pane>
                              <el-tab-pane label="审核不通过">
                                  <!--审核不通过 表格体 -->
                                  <el-table 
                                  v-loading="NotVerifyOrgData.loading" 
                                  :data="NotVerifyOrgData.data" 
                                  class="table"
                                  ref="notVerifyOrganizeTable"
                                  :header-cell-style="{background:'#2780d1',color:'#fff'}"
                                  border>
                                      <el-table-column type="index" label="序号" width="64" align="center"></el-table-column>
                                      <el-table-column prop="OrgName" label="企业/单位名称" width="120"></el-table-column>
                                      <el-table-column prop="UserName" label="联系人姓名"></el-table-column>
                                      <el-table-column prop="MobilePhone" label="联系电话"></el-table-column>
                                      <el-table-column prop="Address" label="联系地址"></el-table-column>
                                      <el-table-column prop="Integrity" label="信息完整度（%）">
                                        <template slot-scope="scope">
                                          <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.Integrity"></el-progress>
                                        </template>
                                      </el-table-column>
                                      <el-table-column prop="Tryout" label="距试用结束时长"></el-table-column>
                                  </el-table>
                                <div class="pagination">
                                    <el-pagination background @current-change="NotVerifyOrgDataPageChange" layout="total,prev, pager, next" :page-size="NotVerifyOrgData.pageSize" :total="NotVerifyOrgData.totalCount">
                                    </el-pagination>
                                </div>
                              </el-tab-pane>
                            </el-tabs>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
  name: "tabs",
  data() {
    return {
      message: 'first',
      //基础组织信息
      orgData: {
        data:[
          {PhId:'1',EnCode:'0001',OrgName:'新中大',ParentName:'拱墅区总工会',EnableTime:'2018-11-15',Creator:'创建人1',kuaiji:'会计1',EnabledMark:1,ServiceEndTime:'2020-12-31'},
          {PhId:'1',EnCode:'0001',OrgName:'新中大',ParentName:'拱墅区总工会',EnableTime:'2018-11-15',Creator:'创建人1',kuaiji:'会计1',EnabledMark:1,ServiceEndTime:'2020-12-31'},
          {PhId:'1',EnCode:'0001',OrgName:'新中大',ParentName:'拱墅区总工会',EnableTime:'2018-11-15',Creator:'创建人1',kuaiji:'会计1',EnabledMark:1,ServiceEndTime:'2020-12-31'},
          {PhId:'1',EnCode:'0001',OrgName:'新中大',ParentName:'拱墅区总工会',EnableTime:'2018-11-15',Creator:'创建人1',kuaiji:'会计1',EnabledMark:1,ServiceEndTime:'2020-12-31'},
          {PhId:'1',EnCode:'0001',OrgName:'新中大',ParentName:'拱墅区总工会',EnableTime:'2018-11-15',Creator:'创建人1',kuaiji:'会计1',EnabledMark:1,ServiceEndTime:'2020-12-31'}
        ],
        pageSize: 20, //pageSize
        pageIndex: 1, //pageIndex
        totalCount: 40, //总页数
        loading: false,
      }, 
      //机关组织信息
      AdminOrgData: {
        data:[
          {PhId:'1',EnCode:'0001',OrgName:'新中大',NgInsertDt:'2020-12-31'},
          {PhId:'2',EnCode:'0001',OrgName:'新中大',NgInsertDt:'2020-12-31'},
          {PhId:'3',EnCode:'0001',OrgName:'新中大',NgInsertDt:'2020-12-31'},
          {PhId:'4',EnCode:'0001',OrgName:'新中大',NgInsertDt:'2020-12-31'},
          {PhId:'5',EnCode:'0001',OrgName:'新中大',NgInsertDt:'2020-12-31'}
        ],
        pageSize: 20, //pageSize
        pageIndex: 1, //pageIndex
        totalCount: 40, //总页数
        loading: false,
      }, 
      //待审核
      verifyOrgData:{
        data:[
          {PhId:'1',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'2',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'3',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'4',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'5',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1}
        ],
        pageSize: 10, //pageSize
        pageIndex: 1, //pageIndex
        totalCount: 0, //总页数
      },
      //审核不通过
      NotVerifyOrgData:{
        data:[
          {PhId:'1',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'2',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'3',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'4',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1},
          {PhId:'5',OrgName:'新中大',UserName:'吾丰明',MobilePhone:'13750870542',Address:'地址',Integrity:50,Tryout:1}
        ],
        pageSize: 10, //pageSize
        pageIndex: 1, //pageIndex
        totalCount: 0, //总页数
      },
      searchForm: {
        orgination: "",
        date: "",
        state: ""
      },
      unionStateValues: [
        { id: 0, name: "全部" },
        { id: 1, name: "激活" },
        { id: 2, name: "未激活" }
      ],
      unionNameValues:[
        {id:0,name:'杭州总工会'},
        {id:1,name:'政云工会'},
        {id:2,name:'相符工会'}
      ],
    };
  },
  methods: {
    //搜索事件
    search(){

    },
    //基础组织分页事件
    orgDataPageChange(){

    },
    //基础组织-新增
    orgDataAdd(){
      this.$router.push({path: '/admin/orgin/add', query: {PhId: 0}});
    },
    orgDataEdit(){
      this.$router.push({path: '/admin/orgin/add', query: {PhId: 1}});
    },
    //机关组织分页事件
    adminOrgDataPageChange(){

    },
    //待审核 分页事件
    verifyOrgDataPageChange(){
    },
    //审核不通过
    NotVerifyOrgDataPageChange(){

    }
  },
  computed: {
    unreadNum() {
      return this.unread.length;
    }
  }
};
</script>

<style>
.message-title {
  cursor: pointer;
}
.handle-row {
  margin-top: 30px;
}
</style>

