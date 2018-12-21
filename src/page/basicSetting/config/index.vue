<template>
<div class="sys-page">
    <div class="container">
        <div class="config">
            <div class="manageContent">
                <div class="unionState">
                    <ul class="flexPublic handle">
                        <a @click.prevent="saveConfig"><li>保存</li></a>
                        <a @click.prevent="cancle"><li>取消</li></a>
                    </ul>
                </div>
                <div class="auxiliary manageContent">
                    <div class="auxiliaryNav">
                        <p class="auxiliaryNavTitle">参数内容</p>
                        <ul>
                            <li @click.stop="navTabTurn(item.name)" :class="{active:navActive==item.name}" v-for="(item,index) of navTab" :key="index">{{item.name}}</li>
                        </ul>
                    </div>
                    <ul class="handle" v-show="navActive=='凭证处理'">
                        <li v-for="(item,index) of handle" :key="index">
                            <p>{{item.title}}</p>
                            <div><label ><input :name="item.name" v-model="item.val" value="1" type="radio">是</label></div>
                            <div><label ><input :name="item.name" v-model="item.val" value="0"  type="radio">否</label></div>
                        </li>
                    </ul>
                    <ul class="print"  v-show="navActive=='凭证打印'">
                        <li v-for="(item,index) of print" :key="index">
                            <p>{{item.title}}</p>
                            <div><label ><input :name="item.name" v-model="item.val" value="3" type="radio">凭证保存时</label></div>
                            <div><label ><input :name="item.name" v-model="item.val" value="2"  type="radio">凭证审核时</label></div>
                            <div><label ><input :name="item.name" v-model="item.val" value="1"  type="radio">手动打印</label></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'

  export default {
    name: "index",
      data(){
        return {
            navActive:'凭证处理',
            handle:[
                { phid:0, code:'handle',title:'凭证是否需要审批',name:'isVerify',val:'1'},
                { phid:0, code:'handle',title:'制单和审核是否允许为同一人',name:'isSame',val:'1'}
            ],
            print:[
                { phid:0,code:'print',title:'凭证立即打印',name:'print',val:'1'},
            ],
            navTab:[
                { code:'handle',name:'凭证处理'},
                { code:'print',name:'凭证打印'}
            ],
            dataList:[]
        }
      },
      mounted(){
          this.getData();
      },
        //计算
        computed:{
            ...mapState({
                orgid:state=>state.user.orgid,
                orgcode:state=>state.user.orgcode,
                uid:state=>state.user.userid,
                user:state=>state.user
            })
        },
      methods: {
          //获取参数
          getData(){

            let data = {
                uid: this.uid,
                orgid: this.orgid,
                queryfilter:'',
            };
            this.$axios.get('/POrganizeConfig/GetOrganizeConfigList',{params:data})
                .then(res=>{
                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    this.dataList=res.Record;


                    //凭证是否需要审批
                    var isVerify=this.dataList.filter(item =>{
                        return item.CCode==='isVerify';
                    });
                    if(isVerify.length>0){
                        this.handle[0].phid=isVerify[0].PhId
                        this.handle[0].title=isVerify[0].CName
                        this.handle[0].val=isVerify[0].CValue
                    }

                    //制单和审核是否允许为同一人
                    var isSame=this.dataList.filter(item =>{
                        return item.CCode==='isSame';
                    });
                    //debugger;
                    if(isSame.length>0){
                        this.handle[1].phid=isSame[0].PhId
                        this.handle[1].title=isSame[0].CName
                        this.handle[1].val=isSame[0].CValue
                    }

                    //凭证立即打印
                    var isprint=this.dataList.filter(item =>{
                        return item.CCode==='print';
                    });
                    if(isprint.length>0){
                        this.print[0].phid=isprint[0].PhId
                        this.print[0].title=isprint[0].CName
                        this.print[0].val=isprint[0].CValue
                    }

                    console.log(this.handle)
                    console.log(this.print)


                })
                .catch(err=>{
                    console.log(err)
                    this.$message({ showClose: true,message: "配置信息获取错误", type: "error"});
                })
          },
          //选中类型
          navTabTurn(item) {
              this.navActive = item;
          },
          //保存
          saveConfig(){

            var config=[];

            //凭证是否需要审批
            var isVerify=this.dataList.filter(item =>{
                return item.CCode==='isVerify';
            });
            if(isVerify.length>0){
                var model=isVerify[0];
                model.CValue=this.handle[0].val
                model.PersistentState=2
                config.push(model)
            }else{
                config.push({
                    PhId:0,
                    OrgId:this.orgid,
                    OrgCode:this.orgcode,
                    CType:this.handle[0].code,
                    CCode:this.handle[0].name,
                    CName:this.handle[0].title,
                    CValue:this.handle[0].val,
                    PersistentState:1
                })
            }


            //制单和审核是否允许为同一人
            var isSame=this.dataList.filter(item =>{
                return item.CCode==='isSame';
            });
            if(isSame.length>0){
                var model2=isSame[0];
                model2.CValue=this.handle[1].val
                model2.PersistentState=2
                config.push(model2)
            }else{
                config.push({
                    PhId:0,
                    OrgId:this.orgid,
                    OrgCode:this.orgcode,
                    CType:this.handle[1].code,
                    CCode:this.handle[1].name,
                    CName:this.handle[1].title,
                    CValue:this.handle[1].val,
                    PersistentState:1
                })
            }
            //凭证立即打印
            var isprint=this.dataList.filter(item =>{
                return item.CCode==='print';
            });
            if(isprint.length>0){
                var model3=isprint[0];
                model3.CValue=this.print[0].val
                model3.PersistentState=2
                config.push(model3)
            }else{
                config.push({
                    PhId:0,
                    OrgId:this.orgid,
                    OrgCode:this.orgcode,
                    CType:this.print[0].code,
                    CCode:this.print[0].name,
                    CName:this.print[0].title,
                    CValue:this.print[0].val,
                    PersistentState:1
                })
            }


            var data={
                uid:this.uid,
                orgid:this.orgid,
                infoData:config
            }

            this.$axios.post('/POrganizeConfig/PostAdd',data)
                .then(res=>{ 
                    console.log(res)

                    if(res.Status==='error'){
                        this.$message.error(res.Msg);
                        return
                    }
                    this.$message.success("更新成功!");
                    this.getData();
                    
                })
                .catch(err=>{
                    console.log(err)
                })
            
          },
          //取消
          cancle(){
            var route=this.$route;
            this.$store.commit("tagNav/removeTagNav", route);
            this.$router.push({path:'/home'})
          }
      }
  }
</script>

<style lang="scss" scoped>
    .auxiliary{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .auxiliaryNav{
        width:15%;
        min-width:138px;
        margin-top: 10px;
        padding-right:5px;
    }
    .auxiliaryNavTitle{
        background:#83c350;
        color:#fff;
        height:40px;
        line-height: 40px;
        text-align: center;
        font-size: 15px;
    }
    .auxiliaryNav>ul{
        padding:10px 20px;
    }
    .auxiliaryNav>ul>li{
        width:90%;
        margin:auto;
        margin-bottom:10px;
        min-width: 100px;
        height:30px;
        line-height: 30px;
        text-align: center;
        border:1px solid #ff9900;
        border-radius: 5px;
    }
    .auxiliaryNav>ul>li:hover{
        background: #ff9900;
        color:#fff;
        cursor:pointer;
    }
    .auxiliaryNav>ul>li.active{
        background: #ff9900;
        color:#fff;
    }
    .unionState>ul{
        justify-content: flex-end;
    }
    .auxiliary{
        justify-content: flex-start;
    }
    .auxiliary>ul{
        margin-top: 10px;
        margin-left: 20px;
        padding:10px;
        >li{
            div{
                margin:0 0  10px  40px;
            }
            >p{
                margin: 0 0 10px 0;
                padding-left:20px;
                position:relative;
                &:before{
                    content:"";
                    position: absolute;
                    width:10px;
                    height:100%;
                    background: #ff9900;
                    left: 0;
                }
            }
        }
    }
</style>
