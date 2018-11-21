<template>
        <div class="manageContent">
              <div class="unionState flexPublic">
                <ul class="flexPublic">
                  <li class="flexPublic">
                    <div>隶属工会:</div>
                    <div class="selectContainer">
                      <select v-model="unionName">
                        <option v-for="item in unionNameValues" :key="item.id"  :value="item.id">{{item.name}}</option>
                      </select>
                    </div>
                  </li>
                  <li class="flexPublic datepick">
                      <div>使用期限:</div>
                      <div class="block">
                        <el-date-picker
                          v-model="date1"
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </div>
                  </li>
                  <li class="flexPublic">
                    <div>状态:</div>
                    <div class="selectContainer">
                      <select name="phoneHead"  v-model="unionState">
                        <option v-for="item in unionStateValues" :key="item.id"  :value="item.id">{{item.name}}</option>
                      </select>
                    </div>
                  </li>
                </ul>
                <div class="flexPublic">
                  <div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="组织编码/名称"></div>
                  <div @click="unionSearch" class="seacherBtn">搜索</div>
                </div>
                <ul class="flexPublic handle">
                  <a @click.prevent="routerTo('/organize/add')"><li>新增</li></a>
                  <a @click.prevent="routerTo('/organize/update')"><li>修改</li></a>
                  <a @click.prevent="routerTo('/organize/add')"><li>备份</li></a>
                  <a @click.prevent="routerTo('/organize/add')"><li>恢复</li></a>
                  <a @click.prevent="routerTo('/organize/add')"><li>导入</li></a>
                </ul>
              </div>
              <div class="formData">
                <ul>
                  <li>序号</li>
                  <li>用户名</li>
                  <li>组织编码</li>
                  <li>组织名称</li>
                  <li>隶属工会</li>
                  <li class="zhangtao">
                    <div>账套</div>
                    <div class="flexPublic">
                      <span>建账日期</span>
                      <span>创建人</span>
                      <span>会计</span>
                    </div>
                  </li>
                  <li>启用</li>
                </ul>
                <ul class="formDataItems">
                  <li :class="{userInfoCss:userInfoCssList[index].checked}" @click="chooseOn(index,item.PhId)" v-for="(item,index) of userInfo" :key="index">
                    <ul class="formDataItem flexPublic">
                      <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                      <li>{{item.PhId}}</li>
                      <li>{{item.EnCode}}</li>
                      <li>{{item.OrgName}}</li>
                      <li>{{item.ParentName}}</li>
                      <li>{{item.date}}</li>
                      <li>{{item.cjr}}</li>
                      <li>{{item.kuaiji}}</li>
                      <li class="stateControl flexPublic">
                        <label><input :name="item.uid" type="radio" value="1"  v-model="item.EnabledMark">启用</label>
                        <label><input :name="item.uid" type="radio" value="0" v-model="item.EnabledMark">禁止</label>
                      </li>
                    </ul>
                  </li>
                </ul>
            </div>
              <div class="formDataPages">
                <div class="flexPublic">
                  <div>每页显示</div>
                  <div class="selectContainer flexPublic">
                    <select name="" @change="pageSizeSelect" v-model="pageSize">
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                    </select>
                  </div>
                  <div>条</div>
                  <div class="pagesContainer">
                    <ul class="flexPublic">
                      <li :class="{pageDisabled:!(this.pageIndex%this.pageCount!=1)}" @click.stop="newPage('pre')">上一页</li>
                      <li :class="{pageActive:pageCssActive==index}" @click.stop="newPage(index)" :key="index" v-for="(item,index) of pageCount">{{item}}</li>
                      <li :class="{pageDisabled:!(this.pageIndex%this.pageCount!=0&&this.pageIndex!=this.pageCount)}" @click.stop="newPage('next')">下一页</li>
                    </ul>
                  </div>
                </div>
              </div>
        </div>

</template>

<script>
import md5 from 'js-md5'
export default {
    data(){
          return {
            date1: '',
            unionSearchValue:'',
            unionState:'0',
            unionName:'0',
            PhIdList:'',
            pageIndex:1,
            pageSize:'15',
            pageCount:[],
            unionNameValues:[
              {id:0,name:'杭州总工会'},
              {id:1,name:'政云工会'},
              {id:2,name:'相符工会'}
            ],
            unionStateValues:[
              {id:0,name:'全部'},
              {id:1,name:'激活'},
              {id:2,name:'未激活'}
            ],
            userInfoCssList:[],
            userInfo:[],
            pageCssActive:'',
            pagePreDisabled:'',
            pageNextDisabled:'',
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
          }
        },
    methods:{
      unionSearch(){
        var {data,config}=this.$ajax();
        data={
          uid: "0",
          orgid: "0",
          pagesize:this.pageSize,
          pageindex:this.pageIndex-1,
          parames:['OrgName*eq*'+this.unionSearchValue,'EnterpriseCode*eq*'+this.unionSearchValue],
          logics:['OrgName*eq*'+this.unionSearchValue+'%OR%EnterpriseCode*eq*'+this.unionSearchValue]
        }
        this.$axios.get('http://10.0.45.51:7758/api/GCW/SysOrganize/GetSysOrganizeList',{params:data,headers:config.headers})
          .then(res=>{
            var data=JSON.parse(res.data);console.log(data)
            this.userInfo=data.Record;
            for(var i=0;i<this.userInfo.length;i++){
              this.userInfoCssList[i]={checked:false};
            }
            this.pageIndex=data.index+1;
            this.pageSize=data.size;
            var newArr=[];
            var maxP=Math.ceil(data.totalRows/data.size)>10?10:Math.ceil(data.totalRows/data.size);
            for(var i=0;i<maxP;i++){
              newArr=i+1;
            }
            this.pageCount=newArr;
          })
      },
      newPage(val){//分页展示****************************************
        console.log()
        if(val=='next'){
          if(this.pageIndex%this.pageCount!=0&&this.pageIndex!=this.pageCount){
            this.pageIndex++;
          }
        }else if(val=='pre'){
          if(this.pageIndex%this.pageCount!=1){
            this.pageIndex--;console.log(this.pageIndex)
          }
        }else{
          this.pageIndex=val+1;
        }
        this.pageCssActive=this.pageIndex-1;
        this.ajaxMode();
      },
      pageSizeSelect(){
        this.ajaxMode();
      },
      chooseOn(index,PhId){
        this.userInfoCssList.map((value) => {return value.checked=false})
        this.userInfoCssList[index].checked=true;
        this.$forceUpdate();
        this.PhIdList=PhId;
      },
      routerTo(url){
        if(url!='/organize/add'&&this.PhIdList.length==0){
          alert('请点击你要修改的组织')
          return;
        }else {
          this.$router.push({path: url, query: {PhId: this.PhIdList}});
        }
      },
      ajaxMode(){
        var {data,config}=this.$ajax();
        data = {
          uid: "0",
          orgid: "0",
          pagesize:this.pageSize,
          pageindex:this.pageIndex-1,
        }

        this.$axios.get('http://10.0.20.46:7758/api/GCW/SysOrganize/GetSysOrganizeList',{params:data,headers:config.headers})
          .then(res=>{
            console.log(res);
            var data=JSON.parse(res.data);
            this.userInfo=data.Record;
            for(var i=0;i<this.userInfo.length;i++){
              this.userInfoCssList[i]={checked:false};
            }
            this.pageIndex=data.index+1;
            this.pageSize=data.size;
            var newArr=[];
            var maxP=Math.ceil(data.totalRows/data.size)>10?10:Math.ceil(data.totalRows/data.size);
            for(var i=0;i<maxP;i++){
              newArr=i+1;
            }
            this.pageCount=newArr;
          })
            .catch(err=>{console.log(err)})
      }
    },
    created(){

    },
    mounted(){
      this.ajaxMode();
    }
}
</script>

<style scoped>


  .formData>ul:first-child>li{
    border-right:1px solid #fff;
    height:50px;
    line-height:50px;
    text-align: center;
    width:15%;
  }
  .formData>ul:first-child>li:nth-of-type(6){
    line-height: 25px;
    width:27%;
  }
  .formData>ul:first-child>li:nth-of-type(7){
    width:10%;
  }
  .formData>ul:first-child>li:last-of-type{
    border-right:1px solid #2780d1;
  }
  .formDataItem>li:first-child,.formData>ul:first-child>li:first-child{
    width:3%;
    min-width: 31px;
    padding:0 2px;
  }
  .zhangtao>div:first-child{
    border-bottom: 1px solid #fff;
  }
  .zhangtao>div:last-child>span{
    width:33.33%;
    border-right:1px solid #fff;
  }
  .zhangtao>div:last-child>span:last-child{
    border:0;
  }

  .formDataItems>li{
    width:100%;
  }
  .formDataItems>li>ul>li:first-of-type{
    border-left:1px solid #ddd;
  }
 .formDataItem:hover{
    background: #ddd;
  }
  .formDataItems{

    border-bottom:1px solid #ddd;
  }
  .formDataItem>li{
    border:1px solid #ddd;
    border-left:0;
    border-bottom:0;
    width:15%;
    height:40px;
    text-align: center;
    line-height: 40px;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .formDataItem>li:nth-of-type(6),
  .formDataItem>li:nth-of-type(7),
  .formDataItem>li:nth-of-type(8){
    width:9%;
  }
  .formDataItem>li:nth-of-type(9){
    width:10%;
    padding:0 8px;
  }


</style>
