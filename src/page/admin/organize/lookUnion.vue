<template>
    <div class="manageContent">
        <div class="examineTab">
            <div @click="examineTabFn(true)" :class="{examineTabAct:examineTab}">待审核(4)</div>
            <div @click="examineTabFn(false)" :class="{examineTabAct:!examineTab}">已审核(4)</div>
        </div>
        <!--******待审核********-->
        <div v-show="examineTab" class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic">
                    <div>信息完整度:</div>
                    <div class="selectContainer">
                        <select  v-model="infoPersentSelect">
                            <option v-for="item of infoPersentSelectValues" :key="item.id" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </li>
                <li class="flexPublic">
                    <div>距试用结束时长:</div>
                    <div class="selectContainer">
                        <select name="tryTimeSelect"  v-model="tryTimeSelect">
                            <option v-for="item of tryTimeSelectValues" :key="item.id" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </li>
            </ul>
            <div class="flexPublic">
              <div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="组织编码/名称"></div>
              <div @click="unionSearch" class="seacherBtn">搜索</div>
            </div>
            <ul class="flexPublic handle">
               <router-link to="/organize/add"> <li>审核</li></router-link>
              <router-link to="/organize/add"> <li>批量审核</li></router-link>
            </ul>
        </div>
        <div  v-show="examineTab" class="formData">
            <ul>
                <li>序号</li>
                <li>企业/单位名称</li>
                <li>联系人姓名</li>
                <li>联系电话</li>
                <li>联系地址</li>
                <li>信息完整度（%）</li>
                <li><div>距试用结束时长</div><div>（天）</div></li>
            </ul>
            <ul class="formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index].checked}" @click="chooseOn(index,item.PhId)" v-for="(item,index) of userInfo" :key="index">
                <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                <li :title="item.PhId">{{item.PhId}}</li>
                <li>{{item.RealName}}</li>
                <li>{{item.TelePhone||item.MobilePhone}}</li>
                <li :title="item.Address">{{item.Address}}</li>
                <li class="flexPublic">
                    <div class="progressContainer" >
                        <div class="progress" :style="{background:infoStyle[index],width:item.Integrity+'%'}">{{item.Integrity < 80 ?'':item.Integrity+' %'}}</div>
                        <div  :style="{color:infoStyle[index],width:(100-item.Integrity)<20?20:100-item.Integrity+'%',display:(100-item.Integrity)<20?'none':'block'}">{{item.Integrity}} %</div>
                    </div>
                </li>
                <li>{{item.ServiceEndTime}}</li>
            </ul>
        </div>
        <!--******已审核********-->
         <div v-show="!examineTab" class="unionState flexPublic">
            <ul class="flexPublic">
                <li class="flexPublic w-100 lookState">
                    <div>审核状态:</div>
                    <div class="selectContainer">
                        <select  v-model="infoPersentSelect">
                            <option v-for="item of infoPersentSelectValues" :key="item.id" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </li>
            </ul>
            <div class="flexPublic">
              <div class="seacherValue"><input @keyup.enter="unionSearch" v-model="unionSearchValue" type="text" placeholder="组织编码/名称"></div>
              <div @click="unionSearch" class="seacherBtn">搜索</div>
            </div>
        </div>
        <div  v-show="!examineTab" class="formData">
            <ul>
                <li>序号</li>
                <li>企业/单位名称</li>
                <li>联系人姓名</li>
                <li>联系电话</li>
                <li>联系地址</li>
                <li>审核状态</li>
                <li>审核时间</li>
            </ul>
            <ul class=" formDataItems flexPublic" :class="{userInfoCss:userInfoCssList[index]}" @click="chooseOn(index,item.PhId)" v-for="(item,index) of examined" :key="index">
                <li>{{index+1+(pageIndex-1)*pageSize}}</li>
                <li :title="item.uname">{{item.uname}}</li>
                <li>{{item.pname}}</li>
                <li>{{item.phone}}</li>
                <li :title="item.address">{{item.address}}</li>
                <li ><i :class="{examSuccess : item.examState,examFailed : !item.examState}"></i></li>
                <li>{{item.examTime}}</li>
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
    created(){
        this.getInfoStyle();
    },
     data(){
          return {
            infoPersentSelect:0,
            tryTimeSelect:0,
            orgname:'',
            examineTab:true,
            infoStyle:[],
            userInfoCssList:[],
            unionSearchValue:'',
            PhIdList:'',
            pageIndex:1,
            pageSize:'15',
            pageCount:[],
            pageCssActive:'',
            pagePreDisabled:'',
            pageNextDisabled:'',
            infoPersentSelectValues:[{id:0,name:'全部'},{id:1,name:'30%以下'},{id:2,name:'30%-50%'},{id:3,name:'50%-80%'},{id:4,name:'80%以上'}],
            tryTimeSelectValues:[{id:0,name:'全部'},{id:1,name:'一天'},{id:2,name:'3天以内'},{id:3,name:'一周之内'},{id:4,name:'15天'}],
            userInfo1:[{uid:1,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',info:36,lastTime:'12'},
                    {uid:2,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',info:10.22,lastTime:'12'},
                    {uid:3,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',info:70,lastTime:'12'},
                    {uid:4,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',info:90,lastTime:'12'},

            ],
            userInfo:[],
            examined:[
                {uid:1,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',examState:true,examTime:'2018-09-12  14:32'},
                {uid:2,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',examState:true,examTime:'2018-09-12  14:32'},
                {uid:3,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',examState:false,examTime:'2018-09-12  14:32'},
                {uid:4,uname:'杭州政云数据技术有限公司',pname:'王明亮',phone:15166757372,address:'浙江省杭州市拱墅区祥源路阿斯顿发送到发',examState:false,examTime:'2018-09-12  14:32'},

            ]
          }
        },
        methods:{
          unionSearch(){
            alert('输入的是:'+this.unionSearchValue)
          },
          examineTabFn(bool){
              this.examineTab=bool;
          },
          getInfoStyle(){
                var infos=this.userInfo;
                var val=[];
                for(var i in infos){
                    infos[i].info=parseInt(infos[i].info);
                    val[i]=infos[i].info;
                    if(val[i]<30){
                        val[i]=`#ff0000`;
                    }else if(val[i]>=30&&val[i]<50){
                        val[i]=`#ff9900`;
                    }else if(val[i]>=50&&val[i]<80){
                        val[i]=`#2473eb`;
                    }else{
                        val[i]=`#83c350`;
                    }
                }
                this.infoStyle=val;
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
            this.$router.push({path:url,query:{PhId:this.PhIdList}});
          },
          ajaxMode(){

            let data = {
              uid: "0",
              orgid: "0",
              pagesize:this.pageSize,
              pageindex:this.pageIndex-1
            };
            this.$axios.get('http://10.0.20.46:8028/api/GCW/SysOrganize/GetSysOrganizeList',{params:data})
              .then(res=>{

                this.userInfo=res.Record;
                for(var i=0;i<this.userInfo.length;i++){
                  this.userInfoCssList[i]={checked:false};
                }
                this.pageIndex=res.index+1;
                this.pageSize=res.size;
                var newArr=[];
                var maxP=Math.ceil(res.totalRows/res.size)>10?10:Math.ceil(res.totalRows/res.size);
                for(var i=0;i<maxP;i++){
                  newArr=i+1;
                }
                this.pageCount=newArr;
              })
                .catch(err=>{console.log(err)})
          }
        },
        mounted(){
          this.ajaxMode();
        },
        computed:{

        }
}
</script>

<style scoped>

  .unionState>ul>li.lookState{
    width:200px ;
  }
  .examineTab{
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      margin-bottom:10px;
  }
  .examineTab>div{
      width:130px;
      height:60px;
      line-height:60px;
      border-bottom: 8px solid transparent;
      text-align: center;
      font-size:20px;
      font-weight:500;
      cursor:pointer;
  }
  .examineTab>div:hover{
      border-bottom-color: #ff9900;
  }
  .examineTab>.examineTabAct{
      border-bottom-color: #83c350;
  }
  .examineTab>.examineTabAct:hover{
      border-bottom-color: #83c350;
  }
  .unionState>ul>li{
    margin-right:20px;
    width:50%;

  }
  .unionState>ul>li>div:first-of-type{
    width:80px;
    font-size: 14px;
    text-align: center;
  }
    .unionState>ul>li:last-of-type>div:first-child{
    width:110px;

  }


  .formData{
    margin-top:10px;
  }
  .formData>ul:first-child{
    display:flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    font-size:13px;
  }
  .formData>ul:first-child{
    background: #2780d1;
    color:#fff;
  }
  .formData>ul>li{
    border-right:1px solid #fff;
    height:50px;
    line-height:50px;
    text-align: center;
    width:15%;
  }
    .formData>ul>li:nth-of-type(2){
        width:20%;
    }
    .formData>ul>li:nth-of-type(5){
        width:20%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
     .formData>ul>li:nth-of-type(6){
        width:20%;
    }
     .formData>ul:first-child>li:last-of-type{
        width:15%;
        border-right:1px solid #2780d1;
        display:block;
    }
     .formData>ul:first-child>li:last-of-type>div{
         height:40%;
         line-height:25px;
     }

 .formData>ul>li:first-child{
    width:5%;
    min-width: 31px;
    padding:0 2px;
  }


  .formDataItems{

    border-bottom:1px solid #ddd;
  }
  .formData>ul.formDataItems:hover{
    background: #ddd;
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
.progressContainer{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    height:27px;
    width:100%;
    border:1px solid #ddd;
    border-radius: 15px;
    background: #ebeef5;
    margin:5px;
}
.progressContainer>div{
    text-align: left;
    padding-left:3px;
}
.progressContainer>div.progress{
    border-radius: 15px;
    height:100%;
    text-align: right;
    line-height: 27px;
}
  .examSuccess,.examFailed{
    display: inline-block;
    width:30px;
    height:30px;
    position:relative;
    margin-top:5px;
  }
  .examSuccess:after{
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
  .examFailed:after,.examFailed:before{
    content:"";
    position:absolute;
    width:2px;
    height:25px;
    background: #ff0000;
    bottom: 0px;
  }
  .examFailed:after{
    -webkit-transform: rotate(45deg);
    -moz-transform:rotate(45deg) ;
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .examFailed:before{
    -webkit-transform: rotate(-45deg);
    -moz-transform:rotate(-45deg) ;
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

</style>
