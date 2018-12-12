<template>
    <div class="newAdd">
        <div class="newAddContent">
            <div class="newAddTitle flexPublic">
                <span>类型分类</span>
                <span @click.stop="newAdd()"></span>
            </div>
            <ul class="contentItem">
                <li>
                    <div>类型名称</div>
                    <div class="inputContainer">
                        <input type="text" v-model="formData.BaseName">
                    </div>
                    <div @click="fastCreate">立即创建</div>
                </li>
                <li>
                    <div>是否启用</div>
                    <div class="itemRadio">
                        <label ><input type="radio" name="line" v-model="formData.EnabledMark" value="0" >启用</label>
                        <label><input type="radio" name="line" v-model="formData.EnabledMark" value="1">停用</label>
                    </div>
                </li>
                <li>
                    <div @click="btnShow('update')">修改</div>
                    <div @click="btnShow('delete')">删除</div>
                </li>
            </ul>
            <div class="formContainer">
                <ul class="formTitle">
                    <li>序号</li>
                    <li>类型编码</li>
                    <li>类型名称</li>
                    <li>启用/停用</li>
                </ul>
                <ul v-for="(item,index) of dataList" :key="index" class="formData">
                    <li>{{index+1}}</li>
                    <li>{{item.BaseCode}}</li>
                    <li>{{item.BaseName}}</li>
                    <li>
                        <i v-show="!updateCss[index].checked" :class="{newAddStateTrue:item.EnabledMark==0,newAddStateFalse:item.EnabledMark==1}"></i>
                        <div v-show="updateCss[index].checked">
                            <label><input type="radio" :name="item.BaseName" v-model="item.EnabledMark" value=0>启用</label>
                            <label><input type="radio" :name="item.BaseName" v-model="item.EnabledMark" value=1>停用</label>
                        </div>
                    </li>
                    <li><i @click.stop="deleteData(item,index)" v-show="deleteCss[index].checked"></i></li>
                </ul>


            </div>
            <div class="itemBtnCon">
                <div @click.stop="newAdd(true)">保存</div>
                <div @click.stop="newAdd()">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import Auth from "@/util/auth";
  import { dealAddString } from "@/util/validate";

  export default {
    name: "auxiliary-type",
      props:{
        datalists:''
      },
      created(){
        this.dataList=JSON.parse(this.datalists);
        this.initCss();
      },
      data(){
        return {
            formData:{ BaseCode:'',BaseName:'',EnabledMark:0 },
            dataList:[],
            deleteList:[],
            updateCss:[],
            deleteCss:[]
        }
      },
      computed:{
        ...mapState({
            orgid:state=>state.user.orgid,
            orgcode:state=>state.user.orgcode,
            uid:state=>state.user.userid,
            username:state=>state.user.username
        })
      },
      methods:{
          newAdd(bool){
              if(bool){
                  for(var del of this.deleteList){
                      this.dataList.push(del);
                  }
                  let data={
                      uid:this.uid,
                      orgid:this.orgid,
                      infoData:this.dataList
                  };

                  var vm=this;
                  this.$axios.post('/PVoucherAuxiliaryType/PostAddAuxiliaryType',data)
                      .then(res=>{
                          if(res.Status=='success'){
                              vm.$emit('type-click',false);
                              //alert('保存成功!')
                              this.$message.success("保存成功!");
                          }
                      })
                      .catch(err=>console.log(err))
              }else{
                  this.$emit('type-click',false);
              }

          },
          fastCreate(){

            if(this.dataList.length>=50){
                alert('当前组织辅助项数量已到上限!')
                return;
            }
            if(this.formData.BaseName===''){
                this.$message.warning("请填写类型名称！");
                return;
            }

            // 获取
            //debugger;

            var lastObject=this.dataList[this.dataList.length-1];
          
            var addData={
                PhId:0,
                Type:'',
                BaseCode:dealAddString(lastObject.BaseCode),
                BaseName:this.formData.BaseName,
                GLS:dealAddString(lastObject.GLS),
                OrgId:this.orgid,
                OrgCode:this.orgcode,
                IsSystem:0,
                EnabledMark:this.formData.EnabledMark,
                CreatorName:this.username,
                EditorName:this.username
            };


            this.dataList.unshift(addData);

            this.$nextTick(() => {
                this.formData.BaseCode='';
                this.formData.BaseName='';
                this.formData.EnabledMark=0;
            })
            this.initCss();
            this.$forceUpdate();
              
          },
          deleteData(item,index){
            item.DeleteMark=1;
            this.deleteList.push(item);
            this.dataList.splice(index,1);
            this.initCss();
            this.btnShow('delete');
          },
          initCss(){
              for(var i in this.dataList){
                  this.updateCss[i]={checked:false}
                  this.deleteCss[i]={checked:false}
              }
          },
          btnShow(val){
            if(val=='delete'){
                for(var del of this.deleteCss){
                    del.checked=!del.checked;
                }
            }else if(val=='update'){
                for(var up of this.updateCss){
                    up.checked=!up.checked;
                }
            }
            this.$forceUpdate();
          },
      }
  }
</script>

<style lang="scss" scoped>
    .newAdd{
        width:100%;
        height:100%;
        position:absolute;
        z-index:10;
        top:0;
        background: rgba(0,0,0,0.4);
    }
    .newAddContent{
        background: #fff;
        overflow: hidden;
        position:absolute;
        left:25%;
        top:20%;
        width:600px;
        .newAddTitle{
            background: #3e8cbc;
            border-radius: 8px;
            height:40px;
            line-height: 40px;
            width:100%;
            color:#fff;
            padding:0 10px;
            font-size: 16px;
            span:last-of-type{
                width:25px;
                height:25px;
                border-radius: 50%;
                background: #fff;
                position: relative;
                &::after,&::before{
                    content:"";
                    position: absolute;
                    width:15px;
                    height:1px;
                    background: #3e8cbc;
                    top:12px;
                    left:5px;
                }
                &::after{
                    transform: rotate(45deg);
                }
                &::before{
                    transform: rotate(-45deg);
                }
            }
        }
        .contentItem{
            padding:10px 10px 0 10px;
            font-size: 15px;
            li{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                height:30px;
                line-height: 30px;
                margin-bottom: 10px;
                div{
                    height:100%;
                    margin-right:5px;
                    &:first-of-type{
                        min-width:70px;
                    }
                    &:nth-of-type(2){
                        width:80%;
                    }
                    &:nth-of-type(3){
                        min-width:70px;
                        background: #4faed2;
                        border-radius: 3px;
                        color:#fff;
                        text-align: center;
                        cursor:pointer;
                    }
                }
                &:nth-of-type(3){
                    justify-content: flex-end;
                }
                &:nth-of-type(3)>div{
                    width:70px;
                    margin-left: 5px;
                    border:1px solid #ff9900;
                    text-align: center;
                    cursor:pointer;
                    border-radius: 3px;
                }
                &:nth-of-type(3)>div:hover{
                    color:#fff;
                    background: #ff9900;
                }
                &:nth-of-type(3)>div:after{
                    content:"";
                    display: block;
                    clear: both;
                }
            }
        }
    }
    .itemRadio{
        letter-spacing: 3px;
        label{
            input{
                margin-right:3px;
            }
        }
    }
    .itemBtnCon{
        border-top: 1px solid #ccc;
        padding:0 20px;
        height:40px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        div{
            width:70px;
            background: #3e8cbc;
            text-align: center;
            border-radius: 3px;
            border:2px solid #3e8cbc;
            height:30px;
            line-height: 26px;
            font-size: 14px;
            color:#fff;
            margin-left: 10px;
            cursor: pointer;
            &:hover{
                background:#fff;
                color:#3e8cbc;
            }
        }
    }
    .formContainer{
        padding:0 20px 0 10px;
        overflow-y: auto;
        height:200px;
        ul{
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            &.formData{
                margin:0;
            }
            &:first-of-type{
                background: #ccc;
                li{
                    border-right-color:#fff;
                    &:last-of-type{
                        border-right-color:#ccc;
                    }
                }
            }
            &:last-of-type{
                border-bottom: 1px solid #ccc;
            }
            li{
                border-top:1px solid #ccc;
                border-right:1px solid #ccc;
                width:25%;
                height:25px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                position:relative;
                &:first-of-type{
                    border-left: 1px solid #ccc;
                }
                &:first-of-type{
                    width:10%;
                }
                &:nth-of-type(2){
                    width:30%;
                }
                &:nth-of-type(3){
                    width:40%;
                }
                &:nth-of-type(4){
                    width:20%;
                }
                &:nth-of-type(5){
                    width:0;
                    border:0;
                    i{
                        position: absolute;
                        right:-23px;
                        width:25px;
                        height:25px;
                        background: url("../../../assets/icon/delete.svg");
                        background-size:cover ;
                        &:hover{
                            background: url("../../../assets/icon/delete_fill.svg");
                            background-size:cover ;
                        }
                    }
                }
            }
        }
    }
    li i.newAddStateTrue:after{
        top:0px;
    }
    label{margin-left:10px;}
</style>
