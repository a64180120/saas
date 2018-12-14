<template>
    <div class="manageAdd">
      <div class="choose">
        <ul class="flexPublic">
          <li @click="addFinished(true)">保存</li>
          <li @click="addFinished(false)">取消</li>
          <li><a href="">附件?</a></li>
        </ul>
      </div>
      <div class="addFormContainer">
        <h6 class="addTitle">基层组织账套管理</h6>
        <ul class="addFormItems ul-flexChild">
          <li>
            <div class="addFormItemTitle">工会名称</div>
            <div class="inputContainer"><input  @blur="unionInput(true)" type="text" placeholder="必填" v-model="OrgName"></div>
            <div v-show="unionCss.name">请输入工会名称</div>
          </li>
          <li>
            <div class="addFormItemTitle">统一社会信用代码</div>
            <div class="inputContainer"><input  @blur="unionInput(false)" type="text" placeholder="必填"  v-model="EnterpriseCode"></div>
            <div v-show="unionCss.id">请输入信用代码</div>
          </li>
          <li>
            <div class="addFormItemTitle">单位地址</div>
            <div class="block flexPublic">
              <el-cascader
                expand-trigger="hover"
                :options="options"
                v-model="address"
                @change="handleChange">
              </el-cascader>
              <div class="inputContainer">
                <input class="addressDetail " type="text" v-model="Address" placeholder="请输入详细地址">
              </div>
            </div>
            <div></div>
          </li>
          <li>
            <div class="addFormItemTitle">联系电话</div>
            <div>
              <div class="selectContainer">
                <select name="phoneHead"  v-model="phoneHead">
                  <option v-for="item in phoneHeadValues" :key="item.id"  :value="item.id">{{item.name}}</option>

                </select>
              </div>
              <div>-</div>
              <div class="inputContainer">
                <input type="text" v-model="MobilePhone" placeholder="请输入联系电话">
              </div>
            </div>
            <div></div>
          </li>
          <li>
            <div class="addFormItemTitle">隶属工会</div>
            <div class="selectContainer">
              <select name="unionOwner" v-model="ParentName">
                <option v-for="item of ParentNameValues" :key="item.id" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div></div>
          </li>
          <li>
            <div class="addFormItemTitle">会计制度</div>
            <div class="selectContainer">
              <select name="unionOwner" v-model="AccountSystem">
                <option v-for="item of AccountSystemValues" :key="item.id" :value="item.id">{{item.name}}</option>
              </select>
            </div>
            <div></div>
          </li>
          <li>
            <div class="addFormItemTitle">启用日期</div>
            <div>
              <el-date-picker
                v-model="EnableTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div></div>
          </li>
          <li>
            <div class="addFormItemTitle" >工会主席</div>
            <div ><div class="inputContainer"><input type="text" v-model="Chairman" disabled></div><input @change="getFile($event)" type="file"></div>
            <div></div>
          </li>
          <li>
            <div class="addFormItemTitle">经审会主任</div>
            <div class="inputContainer"><input type="text"></div>
            <div></div>
          </li>
          <li>
            <div class="addFormItemTitle">服务期限</div>
            <div>
              <el-date-picker
                v-model="ServiceStartTime"
                type="date"
                placeholder="开始日期">
              </el-date-picker>
              <div>-</div>
              <el-date-picker
                v-model="ServiceEndTime"
                type="date"
                placeholder="结束日期">
              </el-date-picker>
            </div>
            <div></div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
    import md5 from 'js-md5'
    import qs from 'qs'
    export default {
      name: "manage-add",
      data() {
        return {
          PhId:'1',
          file:'1',
          OrgName:'',
          EnterpriseCode:'',
          Address:'',
          address: [],
          phoneHead:'1',
          MobilePhone:'',
          Telephone:'',
          Chairman:'工会主席',
          EnableTime:'',
          ServiceStartTime: '',
          ServiceEndTime: '',
          ParentName:'0',
          AccountSystem:'0',
          ParentNameValues:[{id:'0',name:'相符街道总工会'},{id:'1',name:'拱墅街道总工会'},{id:'2',name:'运河产业园街道总工会'}],
          AccountSystemValues:[{id:'0',name:'工会会计制度2009版'},{id:'1',name:'工会会计制度2008版'}],
          phoneHeadValues:[{id:'0',name:'手机号'},{id:'1',name:'0571'},{id:'2',name:'010'},{id:'3',name:'021'}],
          unionCss:{name:false,id:false},
          //日期选择器data******************************
          pickerOptions1: {
            disabledDate(time) {
              return time.getTime() > Date.now();
            },
            shortcuts: [{
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            }, {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
          },

          //地址选择器data*********************************
          options: [{
            value: '浙江',
            label: '浙江',
            children: [{
              value: '杭州',
              label: '杭州',
              children: [{
                value: '西湖区',
                label: '西湖区'
              }, {
                value: '拱墅区',
                label: '拱墅区'
              }, {
                value: '上城区',
                label: '上城区'
              }, {
                value: '下城区',
                label: '下城区'
              }]
            }, {
              value: '绍兴',
              label: '绍兴',
              children: [{
                value: '柯城',
                label: '柯城'
              }]
            }]
          }, {
            value: 'js',
            label: '江苏',
            children: [{
              value: 'sz',
              label: '苏州',
              children: [{
                value: 'layout',
                label: 'Layout 布局'
              }, {
                value: 'color',
                label: 'Color 色彩'
              }, {
                value: 'typography',
                label: 'Typography 字体'
              }, {
                value: 'icon',
                label: 'Icon 图标'
              }, {
                value: 'button',
                label: 'Button 按钮'
              }]
            }, {
              value: 'form',
              label: 'Form',
              children: [{
                value: 'radio',
                label: 'Radio 单选框'
              }, {
                value: 'checkbox',
                label: 'Checkbox 多选框'
              }, {
                value: 'input',
                label: 'Input 输入框'
              }, {
                value: 'input-number',
                label: 'InputNumber 计数器'
              }, {
                value: 'select',
                label: 'Select 选择器'
              }, {
                value: 'cascader',
                label: 'Cascader 级联选择器'
              }, {
                value: 'switch',
                label: 'Switch 开关'
              }, {
                value: 'slider',
                label: 'Slider 滑块'
              }, {
                value: 'time-picker',
                label: 'TimePicker 时间选择器'
              }, {
                value: 'date-picker',
                label: 'DatePicker 日期选择器'
              }, {
                value: 'datetime-picker',
                label: 'DateTimePicker 日期时间选择器'
              }, {
                value: 'upload',
                label: 'Upload 上传'
              }, {
                value: 'rate',
                label: 'Rate 评分'
              }, {
                value: 'form',
                label: 'Form 表单'
              }]
            }, {
              value: 'data',
              label: 'Data',
              children: [{
                value: 'table',
                label: 'Table 表格'
              }, {
                value: 'tag',
                label: 'Tag 标签'
              }, {
                value: 'progress',
                label: 'Progress 进度条'
              }, {
                value: 'tree',
                label: 'Tree 树形控件'
              }, {
                value: 'pagination',
                label: 'Pagination 分页'
              }, {
                value: 'badge',
                label: 'Badge 标记'
              }]
            }, {
              value: 'notice',
              label: 'Notice',
              children: [{
                value: 'alert',
                label: 'Alert 警告'
              }, {
                value: 'loading',
                label: 'Loading 加载'
              }, {
                value: 'message',
                label: 'Message 消息提示'
              }, {
                value: 'message-box',
                label: 'MessageBox 弹框'
              }, {
                value: 'notification',
                label: 'Notification 通知'
              }]
            }, {
              value: 'navigation',
              label: 'Navigation',
              children: [{
                value: 'menu',
                label: 'NavMenu 导航菜单'
              }, {
                value: 'tabs',
                label: 'Tabs 标签页'
              }, {
                value: 'breadcrumb',
                label: 'Breadcrumb 面包屑'
              }, {
                value: 'dropdown',
                label: 'Dropdown 下拉菜单'
              }, {
                value: 'steps',
                label: 'Steps 步骤条'
              }]
            }, {
              value: 'others',
              label: 'Others',
              children: [{
                value: 'dialog',
                label: 'Dialog 对话框'
              }, {
                value: 'tooltip',
                label: 'Tooltip 文字提示'
              }, {
                value: 'popover',
                label: 'Popover 弹出框'
              }, {
                value: 'card',
                label: 'Card 卡片'
              }, {
                value: 'carousel',
                label: 'Carousel 走马灯'
              }, {
                value: 'collapse',
                label: 'Collapse 折叠面板'
              }]
            }]
          }, {
            value: 'ziyuan',
            label: '资源',
            children: [{
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }]
          }]
        };
      },
      methods: {
        handleChange(value) {//地址选择器的值******************
          console.log(value)
        },
        unionInput(bool){
          if(bool){
            if(!this.OrgName){
                this.unionCss.name=true;
            }else{
                this.unionCss.name=false;
            }
          }else{
            if(!this.EnterpriseCode){
              this.unionCss.id=true;
            }else{
              this.unionCss.id=false;
            }
          }
        },
        addFinished(bool){//添加文件上传**************************
          if(!bool){
            this.$router.go(-1);
          }else {
            if (this.OrgName.length > 0 && this.EnterpriseCode.length > 0){
              let formData = new FormData();
              let config = {
                headers: {
                  'content-Type': 'multipart/form-data'
                }
              }

              formData.append('EnterpriseCode', this.EnterpriseCode);
              formData.append('file', this.file);
              this.$axios.post("/trip/planerec", this.EnterpriseCode, config)
                  .then(console.log('finish'))
            }else{
              alert('请输入工会名称和统一社会信用代码')
            }
          }
        },
        getFile($event){
          this.file=$event.target.files[0];
        },
        ajaxMode(){

          var page = {
            'Province':this.address[0],
            'City':this.address[1],
            'County':this.address[2],
            'Street':this.address[3],
            'PhId':this.PhId,
            'file':this.file,
            'OrgName':this.OrgName,
            'EnterpriseCode':this.EnterpriseCode,
            'Address':this.Address,
            'phoneHead':this.phoneHead,
            'MobilePhone':this.MobilePhone,
            'Telephone':this.Telephone,
            'Chairman': this.Chairman,
            'EnableTime':this.EnableTime,
            'ServiceStartTime':this.ServiceStartTime,
            'ServiceEndTime': this.ServiceEndTime,
            'ParentName':this.ParentName,
            'AccountSystem':this.AccountSystem,
          };
          var data = {
            uid: "0",
            orgid: "0",
            infoData: page
          };
          this.$axios.post('/SysOrganize/PostAdd',data)
            .then(res=>{
              if(res.Status=='success'){
                this.$router.push({path:'/'})
              }
            })
        }
      }
    }
</script>

<style scoped>
  .addTitle{
    font-size: 30px;
  }
  .manageAdd{
    font-size:15px;
  }
.choose{
  background:#fff;
  padding:5px;
  font-size: 15px;
}
  .choose>ul{
    justify-content: flex-end;
  }
.choose>ul>li{
  margin-left:15px;
  padding:2px 8px;
  border:1px solid #ff9900;
  border-radius: 3px;
  cursor:pointer;
}
.choose>ul>li:hover{
  background: #ff9900;
  color:#fff;
}
.ul-flexChild>li{
  display: flex;
  flex-flow: row nowrap;
  justify-content:start ;
  align-items: center;
}
.addFormContainer{
  margin-bottom:20px;
  padding-bottom:80px;
}
.addFormItems>li{
  margin-top:15px;
}

.addFormItems>li>div{
  line-height: 40px;
  height:40px;
}
  .addFormItems>li>.addFormItemTitle{
    text-align: right;
    width:30%;
    padding:0 10px;
  }
  .addFormItems>li>div:nth-child(1){
    font-size: 18px;
    font-weight: 600;
  }
.addFormItems>li>div:nth-child(2){
  width:50%;
  display: flex;
  flex-flow: row nowrap;
  justify-content:space-between ;
  align-items: center;
}
.addFormItems>li>div:nth-child(3){
  width:10%;
  text-align: left;
  color:red;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
  .block{
    text-align: left;
  }
.block>span{
  width:40%;
}
.addressDetail{
  width:98%;
  margin:0 0 0 10px;
}

   input{
    margin:0;
  }

.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width:100%;
}
  input[type=file]{
    margin-left:10px;
  }

</style>
