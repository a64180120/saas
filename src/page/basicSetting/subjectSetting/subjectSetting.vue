<template>
  <div class="manageContent">
    <div class="unionState flexPublic">
      <ul class="flexPublic">
        <li class="flexPublic">
          <div>科目类别:</div>
          <div class="selectContainer">
            <select v-model="subjectName">
              <option v-for="item in subjectNameValues" :key="item.id"  :value="item.id">{{item.name}}</option>
            </select>
          </div>
        </li>
      </ul>
      <div class="flexPublic">
        <div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="科目编码/名称"></div>
        <div @click="unionSearch" class="seacherBtn">搜索</div>
      </div>
      <ul class="flexPublic handle">
        <a @click.prevent="routerTo('/finance/basic/subject/add')"><li>增加</li></a>
        <a @click.prevent="routerTo('/environment/update')"><li>修改</li></a>
        <a @click.prevent="routerTo('/environment/add')"><li>删除</li></a>
        <a @click.prevent="routerTo('/environment/add')"><li>模板下载</li></a>
        <a @click.prevent="routerTo('/environment/add')"><li>导入</li></a>
        <a @click.prevent="routerTo('/environment/add')"><li>导出</li></a>
      </ul>
    </div>
    <div class="formData">
      <ul>
        <li>序号</li>
        <li>科目编码</li>
        <li>科目名称</li>
        <li>科目类别</li>
        <li>余额方向</li>
        <li>辅助核算</li>
        <li>停用/启用</li>
      </ul>
      <ul class="formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}" @click="chooseOn(index,item.PhId)" v-for="(item,index) of userInfo" :key="index">
        <li>{{index+1+(pageIndex-1)*pageSize}}</li>
        <li>{{item.KCode}}</li>
        <li>{{item.KName}}</li>
        <li>{{item.KType}}</li>
        <li>{{item.KBalanceType}}</li>
        <li>{{item.KAmountCheck}}</li>
        <li><i :class="{stateSuccess:item.EnabledMark,stateFailed:!item.EnabledMark}"></i></li>
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
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          unionSearchValue:'',
          subjectName:'1',
          PhIdList:'',
          orgname:'',
          pageIndex:1,
          pageSize:'15',
          pageCount:[],
          subjectNameValues:[
            {id:0,name:'全部'},
            {id:1,name:'资产'},
            {id:2,name:'负债'},
            {id:3,name:'净资产'},
            {id:4,name:'收入'},
            {id:5,name:'支出'}
          ],
          userInfoCssList:[],
          userInfo:[
            {PhId:11111,KCode:223123,KName:'kemu1',KType:'kem',KBalanceType:'zhng',KAmountCheck:'slil',EnabledMark:'1'},
            {PhId:11111,KCode:223123,KName:'kemu1',KType:'kem',KBalanceType:'zhng',KAmountCheck:'slil',EnabledMark:'1'},
            {PhId:11111,KCode:223123,KName:'kemu1',KType:'kem',KBalanceType:'zhng',KAmountCheck:'slil',EnabledMark:'1'},
            {PhId:11111,KCode:223123,KName:'kemu1',KType:'kem',KBalanceType:'zhng',KAmountCheck:'slil',EnabledMark:'1'}
          ],
          pageCssActive:'',
          pagePreDisabled:'',
          pageNextDisabled:'',
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
            if(this.pageIndex%this.pageCount!=1&&this.pageIndex>1){
              this.pageIndex--;
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
          if(url!='/finance/basic/subject/add'&&this.PhIdList.length==0){
            alert('请点击你要修改的组织')
            return;
          }else {
            this.$router.push({path: url, query: {PhId: this.PhIdList}});
          }
        },
        ajaxMode(){
          let {data,config}=this.$ajax();
          data.infoData=null;
          data = {
            uid: "0",
            orgid: "0",
            pagesize:this.pageSize,
            pageindex:this.pageIndex-1
          };
          this.$axios.get('http://10.0.45.51:7758/api/GCW/SysOrganize/GetSysOrganizeList',{params:data,headers:config.headers})
            .then(res=>{
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
            .catch(error=>{console.log(error)})
        }
      },
      created(){
      },
      created(){
        for(var i=0;i<this.userInfo.length;i++){
          this.userInfoCssList[i]={checked:false};
        }
        this.ajaxMode();
      },
    }
</script>

<style lang="scss" scoped>
  .unionState>ul>li{
    width:100%;
  }
  .formData>ul>li{
    &:last-of-type{
      border-right:1px solid #2780d1;
      width:8%;
    }
    border-right: 1px solid #fff;
    height: 40px;
    line-height: 40px;
    text-align: center;
    width: 18%;
    &:first-of-type{
      width:5%;
    }
    &:nth-of-type(5){
      width:15%;
    }
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
  .stateSuccess,.stateFailed{
    display: inline-block;
    width:30px;
    height:30px;
    position:relative;
    margin-top:5px;
  }
  .stateSuccess:after{
    content:"";
    position:absolute;
    width:10px;
    height:25px;
    border:1px solid #3776ab;
    border-width:0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -moz-transform:rotate(45deg) ;
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    left:10px;
    bottom:5px;
  }
  .stateFailed:after,.examFailed:before{
    content:"";
    position:absolute;
    width:2px;
    height:25px;
    background: #ff0000;
    bottom: 0px;
  }
  .stateFailed:after{
    -webkit-transform: rotate(45deg);
    -moz-transform:rotate(45deg) ;
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .stateFailed:before{
    -webkit-transform: rotate(-45deg);
    -moz-transform:rotate(-45deg) ;
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

</style>
