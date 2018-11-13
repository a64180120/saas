<template>
  <div class="manageContent">
    <div class="unionState flexPublic">
      <ul class="flexPublic">
        <li class="flexPublic">
          <div>角色状态:</div>
          <div class="selectContainer">
            <select v-model="roleState">
              <option v-for="item in roleStateValues" :key="item.id"  :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </li>
      </ul>
      <div class="flexPublic">
        <div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="角色编码/名称"></div>
        <div @click="unionSearch" class="seacherBtn">搜索</div>
      </div>
      <ul class="flexPublic handle">
        <a @click.prevent="routerTo('/role/add')"><li>新增</li></a>
        <a @click.prevent="routerTo('/role/update')"><li>修改</li></a>
        <a @click.prevent="routerTo('/role/delete')"><li>删除</li></a>
      </ul>
    </div>
    <div class="formData">
      <ul>
        <li>序号</li>
        <li>角色编码</li>
        <li>角色名称</li>
        <li>角色状态</li>
        <li>备注</li>
      </ul>
      <ul class="formDataItems flexPublic" v-for="item of roleInfo" :key="item.uid">
        <li>{{index+1+(pageIndex-1)*pageSize}}</li>
        <li>{{item.RoleCode}}</li>
        <li>{{item.Name}}</li>
        <li>
          <div class="inputContainer">
            <label ><input type="radio" :name="item.uid" v-model="item.state" value="1"> 启用</label>
            <label ><input type="radio":name="item.uid" v-model="item.state" value="0"> 禁用</label>
          </div>
        </li>
        <li>{{item.Description}}</li>
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
  export default {
    data(){
      return {
        userInfoCssList:[],
        unionSearchValue:'',
        PhIdList:'',
        pageIndex:1,
        pageSize:'15',
        pageCount:[],
        pageCssActive:'',
        pagePreDisabled:'',
        pageNextDisabled:'',
        roleState:'0',
        roleStateValues:[
          {id:0,name:'全部'},
          {id:1,name:'激活'},
          {id:2,name:'未激活'}
        ],
        roleInfo:[],
      }
    },
    methods:{
      unionSearch(){
        alert('输入的是:'+this.unionSearchValue)
      },
      newPage(val){//分页展示****************************************
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
        if(url!='/role/add'&&this.PhIdList.length==0){
          alert('请点击你要修改的组织')
          return;
        }else {
          this.$router.push({path: url, query: {PhId: this.PhIdList}});
        }
      },
      ajaxMode(){
        let {data,config}=this.$ajax();
        data = {
          uid: "0",
          orgid: "0",
          pagesize:this.pageSize,
          pageindex:this.pageIndex-1
        };
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
      }
    },
    mounted(){
      this.ajaxMode();
    }
  }
</script>

<style scoped>


  .unionState>ul:first-of-type>li{
    width:200px;
    font-size: 14px;
    text-align: center;
  }

  .formData>ul>li{
    border-right:1px solid #fff;
    height:50px;
    line-height:50px;
    text-align: center;
    width:25%;
  }
  .formData>ul>li:nth-of-type(4){
    width:30%;
  }
  .formData>ul>li:nth-of-type(5){
    width:15%;
  }
  .formData>ul:first-child>li:last-of-type{
    width:15%;
    border-right:1px solid #2780d1;
  }

  .formData>ul>li:first-child{
    width:5%;
    min-width: 31px;
    padding:0 2px;
  }

  .formData>ul.formDataItems:hover{
    background: #ddd;
  }
  .formDataItems{

    border-bottom:1px solid #ddd;
  }
  .formData>ul.formDataItems>li{
    border-right:1px solid #ddd;
    border-left:0;
    border-bottom:0;
    text-align: center;
    line-height: 40px;
    height:40px;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .formData>ul.formDataItems>li:first-child{
    border-left:1px solid #ddd;
  }


</style>
