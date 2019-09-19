<template>
    <div class="manageContent">
        <div class="reportBox">
            <div class="unionState" style="width: 100%;height: 40px;min-width: 1260px;">

                <div style="width:100%;float: right" id="elSelf" >
                    <ul class="flexUl handle">
                        <li  @click="postExcel">导出</li >
                        <li  @click="showPrintArea">打印</li >
                        <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                    </ul>
                    <ul  class="flexUl handle" style="line-height: 30px">
                        <div class="flexPublic handle">
                            <div class="searcherValue"><input type="text" placeholder="姓名/单位" v-model="inputKvalue"></div>
                            <div  class="searcherBtn" @click="getReadData">搜索</div>
                        </div>
                    </ul>
                </div>
            </div>
            <div class="formData" style="left:40px;top: 40px;right: 0px;bottom: 0;width: auto;margin-top: 0;">
                <div class="tbHeader">
                    <table>
                        <colgroup>
                            <col width="10%"/>
                            <col width="20%"/>
                            <col width="20%"/>
                            <col width="25%"/>
                            <col width="25%"/>
                        </colgroup>
                        <thead>
                        <tr>
                            <td>序号</td>
                            <td>姓名/单位</td>
                            <td>联系方式</td>
                            <td>需求描述</td>
                            <td>提交时间</td>
                        </tr>
                        </thead>

                    </table>
                </div>
                <div class="tbBody" id="ts">
                    <table  ref="printFrom">
                        <colgroup>
                            <col width="10%"/>
                            <col width="20%"/>
                            <col width="20%"/>
                            <col width="25%"/>
                            <col width="25%"/>
                        </colgroup>
                        <tbody>
                        <template v-if="readData.length>0">
                            <tr v-for="(item,index) in readData">
                                <td class="center">{{index+1}}</td>
                                <td>{{item.Author}}</td>
                                <td>{{item.Phone}}</td>
                                <td>{{item.Description}}</td>
                                <td class="center">{{item.NgInsertDt}}</td>
                            </tr>
                        </template>
                        <template v-else>
                            <tr>
                                <td colspan="5" class="center">
                                    没有消息
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!--打印预览界面-->
        <div id="covCon" class="cover" :style="{'display':(showPrint?'block':'none'),'z-index':'999'}">
            <div  class="coverContent" style="width: auto;height: auto;top: 30px;left:40px;right: 40px;margin-top: 0;margin-left:0;">
                <div id="covTil" class="" style="text-align: left">
                    <span>打印预览界面</span>
                    <i class="el-icon-close" style="cursor: pointer;text-align:right;float: right;padding-top: 4px;margin-left: 50px;" @click="closePrintArea(0)"></i>
                    <a  style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right' @click="printContent">打印</a>
                    <a style='margin:0 0 0px 20px;cursor: pointer;display: inline-block;float: right;color: #333333' @click="closePrintArea(0)">取消</a>
                </div>
                <div id="printContentArea" style="margin-bottom: 20px">

                </div>
            </div>
        </div>
        <message :message="saasMessage.message" :visible.sync="saasMessage.visible"></message>
    </div>

</template>

<script>
    import { mapState} from 'vuex'
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    export default {
        name: "read",
        data(){
            return{
                inputKvalue:'',
                readData:[],//已读消息列表
                showPrint:false,//显示隐藏打印区域
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'' //消息主体内容**************
                },
            }
        },
        computed:{
            ...mapState({
                userid:state=>state.user.userid,
            })
        },
        mounted(){
            this.getReadData();
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件},
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        methods:{
            /*获取未读消息列表*/
            getReadData:function(){
                let data={
                    value:1,
                    pageindex:0,
                    pagesize:0,
                    queryfilter:this.inputKvalue
                }
                this.$axios.get('SysMessage/GetSysMessageByPage',{params:data}).then(res=>{
                    console.log(res);
                    if(res.Status=='success'){
                        this.readData=res.Data;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            },
            /*刷新*/
            refresh:function(){
                this.getReadData();
            },
            /*导出*/
            postExcel:function(){
                let data={
                    uid:this.userid,
                    isFinish:1
                };
                let base = httpConfig.getAxiosBaseConfigUncontrol();
                let loading=this.$loading()
                this.$axios.get('SysMessage/GetSysMessageExcel',{params:data}).then(res=>{
                    console.log(res);
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        let tempLink = document.createElement("a");
                        let downloadUrl=base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename;
                        tempLink.style.display = "none";
                        tempLink.href = downloadUrl;
                        tempLink.setAttribute("download", res.filename);
                        if (typeof tempLink.download === "undefined") {
                            tempLink.setAttribute("target", "_blank");
                        }
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        document.body.removeChild(tempLink);
                    }
                    loading.close();
                }).catch(err=>{
                    console.log(err);
                    loading.close();
                })
            },
            //显示打印预览
            showPrintArea:function(){
                this.showPrint=true;
                //获取打印内容，渲染于弹窗
                let print = document.createElement("div");
                print.setAttribute('class','timeSelect');
                print.style.padding='30px 40px 30px 30px';
                //获取页面显示的打印表格的表头
                let dm = this.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                //获取页面的表格内容
                let cop = this.$refs.printFrom.cloneNode(true);
                //表格内容拼接表头
                cop.insertBefore(dm,cop.childNodes[2]);
                print.appendChild(cop);
                //内容全部放入打印预览
                document.getElementById('printContentArea').appendChild(print);
            },
            //关闭打印预览
            closePrintArea:function(){
                this.showPrint=false;
                document.getElementById('printContentArea').innerHTML='';
            },
            // 打印
            printContent(e){
                let print =document.getElementById('printContentArea');
                this.$print(print) // 使用
            },
            //滚动事件
            handleScroll: function () {
                let scObj = document.getElementById('covCon');//打印区域滚动
                if(scObj==undefined){
                    window.removeEventListener('scroll', this.handleScroll, false);  // 监听（绑定）滚轮滚动事件
                }else{
                    if(scObj.scrollTop>35){
                        document.getElementById('covTil').classList.add('fixTitle');
                    }else{
                        document.getElementById('covTil').classList.remove('fixTitle');
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .cover{
        position: fixed;
        position:-ms-page ;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
        text-align: center;
        overflow-y: auto;
    }
    .coverContent{
        background-color: #fff;
        width: 362px;
        height: auto;
        position: absolute;
        top: 5%;
        left: 5%;
        right: 5%;
        margin-bottom: 50px;
        box-shadow: 0 0 5px 1px #d3e9f9;
    }
    .coverContent div:nth-of-type(1){
        border-bottom: 1px solid #eee;
        padding:10px 20px;

    }
    .coverContent div:nth-of-type(2){
        padding: 0px 20px;
    }
</style>
