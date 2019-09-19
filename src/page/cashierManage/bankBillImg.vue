<template>
    <div class="timeSelect ridusCheck">
        <div class="container">
            <div class="manageContent">
                <div class="">
                    <div class="unionState" style="width: 100%;height: 40px;min-width: 1260px;">
                        <div style="width:100%;float: right">

                            <ul class="flexUl handle">
                                <li class=""  @click="downloadImg">下载</li>
                                <li class="" @click="showPrintArea(printType=1)">打印</li>
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </ul>
                            <ul class="flexUl handle" style="float: left"><span>银行对账单</span> <span style="margin-left: 20px;color: #00b7ee">{{date1.choosedYear}}</span><span>年度</span></ul>
                        </div>
                        <!--<div class="head">

                        </div>-->
                       <!-- <div class="selectarea">
                            <span>{{date1.choosedYear}}年度</span>
                            <div class="btnArea">
                                <div class=""  @click="downloadImg">下载</div>
                                <div class="" @click="showPrintArea(printType=1)">打印</div>
                                <li style="margin:0;border: 0;background: none;font-size: 27px;color: #00B8EE;" class="el-icon-refresh" @click="refresh"></li>
                            </div>
                        </div>-->
                    </div>
                    <div class="formData" >
                        <!--银行对账单界面-->
                        <div class="">
                            <div class="coverdiv">
                                <div class=""  style="overflow-y: auto;overflow-x: hidden;top: 90px;left: 30px;right: 30px; padding:10px">
                                    <template v-for="(item,index) in BillList">

                                        <div class="selsectArea upload-demo" >
                                            <div  style="width: 175px;height: 180px;margin: auto;overflow: hidden;">
                                            <template v-if="item.img.length>0">
                                                <div style="position: absolute;z-index: 99;color: #ffffff;margin-left: 15px;margin-top: 0px;">
                                                    <p class="hyzIcon_book">{{item.img.length}}</p>
                                                </div>
                                                <div style="position: absolute;z-index: 99;color: #ffffff;margin-left: 15px;margin-top: -3px;margin-left:128px ">
                                                    <el-checkbox class="checkLabel" v-model="checkMonth[index]"></el-checkbox>
                                                </div>

                                            </template>
                                            <el-upload
                                                multiple
                                                :action="'month'+(index+1)"
                                                :on-preview="handlePreviewN"
                                                :on-remove="handleRemoveN"
                                                :before-upload="beforeUploadPic"
                                                :http-request='uploadFileMethod'
                                                :file-list="item.img"
                                                list-type="picture-card">
                                                <i class="el-icon-lx-add" ></i>
                                                <div slot="tip" class="el-upload__tip">{{index+1}}月</div>
                                            </el-upload>

                                            </div>
                                        </div>

                                    </template>
                                </div>
                            </div>
                        </div>
                        <!--图片预览界面-->
                        <div id="imgContentArea" class="cover" :style="{'display':(showImg?'block':'none'),'z-index':'999'}">

                            <div  class="imgContent" style="">
                                <img :src="chooseImg.url" style="width: auto;height: 100%">
                                <i class="el-icon-close" style="cursor: pointer;position:absolute;text-align:right;margin-top: -20px;margin-left: 10px;color: white;font-size: 35px" @click="closePrintArea(1)"></i>

                            </div>
                            <div  class="imgList" style="">
                                <ul>
                                    <template v-for="item in imgList">
                                        <li :class="{'choose':(chooseImg.url==item.url)}" @click="checkImg(item)">
                                            <img :src="item.url">
                                        </li>
                                    </template>
                                </ul>

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
                                <ul class=" handle" style="margin-bottom: 20px;margin-top: 20px">
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="timeSelectBox">
                    <time-select-bar @item-click="dateChoose" :showtype="'yearTime'"></time-select-bar>
                </div>


            </div>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <message :message="saasMessage.message" :visible.sync="saasMessage.visible"></message>
    </div>
</template>

<script>
    import * as axios from "axios";
    import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
    import { mapState} from "vuex";
    import saasMsg from '@/components/message/message'
    import TimeSelectBar from "@/components/TimeSelectBar/index";
    export default {
        name: "bankBillImg",
        data(){
            return{
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },
                date1:[],
                showPrint:false,//打印预览界面 显示隐藏
                BillList:[{voucherBanks:[],img:[]}],
                imgList:[],//图片弹窗显示的图片列表
                showImg:false,//显示图片弹窗
                chooseImg:{},//选中查看的图片
                checkMonth:[false,false,false,false,false,false,false,false,false,false,false,false],
                printType:0,//0表示打印表单，1表示打印银行对账单图片
            }
        },
        computed:{
            ...mapState({
                userid: state => state.user.userid,
                orgid: state => state.user.orgid,
                OrgIds:state => state.user.OrgIds,
                orgName:state=>state.user.orgName,
                orgCode:state=>state.user.orgCode,
                curOrg: state => state.user.curOrg,   //当前的组织信息
                username: state => state.user.username,
                Roleauthorize: state => state.user.Roleauthorize,
                dbname:state=>state.user.dbname
            }),
        },
        components: {TimeSelectBar,saasMsg},
        mounted(){
            window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件},
        },
        destroyed(){
            window.removeEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
        },
        methods:{
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
            /*时间选择器点击事件*/
            dateChoose:function(val){
                this.date1=val;
                this.getBankBill();
            },
            //    刷新
            refresh:function(){
                this.getBankBill()
            },
            //显示打印预览
            showPrintArea:function(type){
                if(type==1){
                    let printFlag=false
                    for(var i in this.checkMonth){
                        if(this.checkMonth[i]){
                            printFlag=true;
                        }
                    }
                    if(!printFlag){
                        this.saasMessage={
                            message:'请选择要打印的对账单',
                            delay:3000,
                            visible:true
                        };
                        return;
                    }
                }
                this.hideMoneyTypePrint=this.hideMoneyType;
                this.hideMoneyType=false;
                let that=this;
                that.showPrint=true;
                setTimeout(function(){

                    //获取打印内容，渲染于弹窗
                    let print = document.createElement("div");
                    print.setAttribute('class','timeSelect printArea');
                    print.style.padding='30px 40px 30px 30px';
                    let cop='';
                    if(type==0){
                        //获取页面显示的打印表格的表头
                        let dm = that.$refs.printFrom.parentNode.parentNode.firstChild.firstChild.childNodes[2].cloneNode(true);
                        //获取隐藏的工会组织科目名称的表头
                        let thchilds=document.getElementById('theadArea').cloneNode(true).childNodes;
                        //获取隐藏的表格内容--表尾
                        let tbchilds=document.getElementById('tbodyArea').cloneNode(true).childNodes;
                        //表头拼接
                        for(let i=thchilds.length-1;i>=0;i--){
                            dm.insertBefore(thchilds[i],dm.firstChild);
                        }
                        //获取页面的表格内容
                        cop = that.$refs.printFrom.cloneNode(true);
                        //表格内容拼接表尾
                        for(let i=0;i<tbchilds.length;i++){
                            cop.lastChild.appendChild(tbchilds[i]);
                        }
                        //表格内容拼接表头
                        cop.insertBefore(dm,cop.childNodes[2]);
                    }else{
                        cop = document.createElement("div");
                        for(let i=0 ;i<that.BillList.length ; i++){
                            if(that.checkMonth[i]){
                                let tab=document.createElement("table");
                                tab.style.borderWidth='0px';
                                tab.style.pageBreakAfter='always';

                                let tabHead=document.createElement("header");
                                let tr0=document.createElement("tr");
                                let td0=document.createElement("td");
                                td0.style.padding='10px';
                                td0.style.borderWidth='0px';
                                let title=document.createElement("h1");
                                title.innerText=i+1+'月'
                                td0.appendChild(title);
                                tr0.appendChild(td0);

                                tabHead.appendChild(tr0);
                                tab.appendChild(tabHead);
                                td0=null;
                                tr0=null;
                                tabHead=null;

                                let tabBody=document.createElement("tbody");
                                let billImgList=that.BillList[i].img;

                                for(let j=0 ; j<billImgList.length ; j++){
                                    let tr1=document.createElement("tr");
                                    let td1=document.createElement("td");
                                    td1.style.padding='10px';
                                    td1.style.borderWidth='0px';
                                    let aImg=document.createElement('img');
                                    aImg.src=billImgList[j].url;
                                    aImg.style.width="100%";
                                    td1.appendChild(aImg);
                                    tr1.appendChild(td1);
                                    tabBody.appendChild(tr1);
                                    aImg=null;
                                    td1=null;
                                    tr1=null;
                                }
                                tab.appendChild(tabBody);
                                cop.appendChild(tab);
                                tab=null;
                                tabBody=null;
                            }

                        }

                    }
                    print.appendChild(cop);
                    //内容全部放入打印预览
                    document.getElementById('printContentArea').appendChild(print);
                },30);
            },
            //关闭打印预览
            closePrintArea:function(type){
                if(type==0){
                    this.showPrint=false;
                    this.hideMoneyType=this.hideMoneyTypePrint;
                    document.getElementById('printContentArea').innerHTML='';
                }else{
                    this.showImg=false;
                }

            },
            // 打印
            printContent(){
                this.hideMoneyType=this.hideMoneyTypePrint;
                let print =document.getElementById('printContentArea');
                this.$print(print) // 使用
            },
            //图片删除
            handleRemoveN(file, fileList) {
                if(!file.phid){
                    return;
                }
                this.$axios.post('PVoucherMst/PostDeleteVoucherBankBill',{PhId:file.phid}).then(res=>{
                    this.$message.success(res.Msg);
                    this.getBankBill();
                }).catch(err=>{
                    console.log(err);
                })
            },
            //图片预览
            handlePreviewN(file,fileList) {
                this.chooseImg=file;
                this.imgList=this.BillList[file.listIndex].img;
                this.showImg=true;
            },
            //文件类型判断
            beforeUploadPic(file) {
                console.log(file);
                let isRightType = (file.type === 'image/png'||file.type === 'image/jpeg');
                if (!isRightType) {
                    this.$message.error('请选择图片!');
                    return false
                }
            },
            //excel上传
            uploadFileMethod(param) {
                var _$this=this;
                var url='PVoucherMst/PostAddVoucherBankBill';
                let month=param.action.substring(5);
                let fileObject = param.file;
                console.log(fileObject);
                let formData = new FormData();
                formData.append("Year", this.date1.choosedYear);
                formData.append("Month", month);
                formData.append("OrgId", this.orgid);
                formData.append("OrgCode", this.orgCode);
                formData.append("file", fileObject);
                formData.append('timeCode',(new Date()).getTime().toString());
                let loading=this.$loading();
                loading.setText('正在上传...')

                let baseheader=httpConfig.getHeaderConfig(this.dbname);
                let base=httpConfig.getAxiosBaseConfigUncontrol();

                let config_header = { "Content-Type": "multipart/form-data" };
                var new_header = Object.assign({},config_header, baseheader);

                axios.create(base).post(url, formData, { headers:new_header }).then(res => {
                    loading.close();
                    var response=JSON.parse(res.data);
                    if(response.Status=='success'){

                    }else{
                        _$this.$refs.piclist.clearFiles();
                        _$this.$message({showClose: true, message: response.Msg, type: 'error'});
                    }
                    this.getBankBill();
                }).catch((error) =>{
                    loading.close();
                    //错误
                    _$this.$refs.piclist.clearFiles();
                    _$this.$message({showClose: true, message: error, type: 'error'});
                });

            },
            //银行对账单查询
            getBankBill:function(){
                let data={
                    orgid:this.orgid,
                    Ryear:this.date1.choosedYear,
                };
                this.$axios.get('PVoucherMst/GetVoucherBankBill',{params:data}).then(res=>{
                    console.log(res);
                    let data=res.Data;
                    for(let i=0 ; i<data.length ; i++){
                        let attachments=data[i].voucherBanks;
                        let imgList=[];
                        if(attachments.length>0){
                            for(let j=0 ; j<attachments.length ; j++ ){
                                let img={
                                    listIndex:i,
                                    name: attachments[j].BName||'',
                                    url: httpConfig.baseurl+attachments[j].BUrlPath||'',
                                    phid:attachments[j].PhId
                                }
                                imgList.push(img);
                            }
                        }
                        data[i]['img']=imgList;
                    }
                    this.BillList=data;
                }).catch(err=>{
                    console.log(err);
                })
            },
            //点击显示银行对账单列表
            getAndShowBill:function(){
                this.getBankBill();
                this.showBill=true;
            },
            //下载银行对账单
            downloadImg:function(){
                let loading=this.$loading();
                let data={
                    'orgid':this.orgid,
                    'Ryear':this.date1.choosedYear,
                    'monthList':this.checkMonth
                }
                let base = httpConfig.getAxiosBaseConfigUncontrol();
                //下载Excel
                this.downloadLoading = true
                this.$axios.get('PVoucherMst/GetVoucherBankBillZip',{params:data}).then(res => {
                    if(res.Status=="error"){
                        this.$message({ showClose: true, message: res.Msg, type: 'error' })
                    }else{
                        /*let myWindow=window.open(base.baseURL + "/File/GetExportFile?filePath=" + res.path + "&fileName=" + res.filename,'下载','');
                        myWindow=null;*/
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
                    this.downloadLoading = false;
                    loading.close();
                }).catch(err => {
                    loading.close();
                    console.log(err)
                })
            },
            //切换显示图片
            checkImg:function(file){
                this.chooseImg={};
                this.chooseImg=file;
            }

        }
    }
</script>

<style scoped>
    reportBox{
        width: 100%;
        height: 100%;
    }
    .printArea td, .printArea th{
        height: 30px;
    }
    .upload-demo{
        width:16%;
        min-width: 175px;
        height: 200px;
        overflow: hidden;
        display: inline-block;
        padding-top: 10px;
    }
    .checkLabel{
        color: limegreen;
    }
    .imgContent{
        width: 100%;
        height: auto;
        position: absolute;
        top: 50px;
        bottom: 150px;
    }
    .imgList{
        position: absolute;
        bottom: 0;
        height: 100px;
        overflow-x: auto;
        overflow-y: hidden;
        vertical-align: center;
        width: 100%;
        text-align: center;
        vertical-align: center;
    }
    .imgList ul li{
        display: inline-block;
        height: 100px;
        width: auto;
        padding: 3px;
        background-color: white;
        overflow: hidden;
        margin-left: 10px;
    }
    .imgList ul .choose{
        background-color: #00b7ee;
    }
    .imgList ul li img{
        height: 100%;
        width: auto;
    }
    .cover{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(66,66,66,0.45);
        z-index: 99;
        text-align: center;
        overflow-y: auto;
    }
    .cover,.coverContent{
        width: 100%;
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
    .coverContent ul{
        padding: 0px 50px;
        margin-bottom: 20px;
    }
    .coverContent ul li:nth-of-type(1){
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(1):hover{
        color: #00B8EE;
        background: #fff;
    }
    .coverContent ul li:nth-of-type(2){
        border: 1px solid #ccc;
        color: #fff;
        background-color: #ccc;

        padding: 5px 15px;
        width: 100px;
        border-radius: 3px;
    }
    .coverContent ul li:nth-of-type(2):hover{
        color: #ccc;
        background-color: #fff;
    }
    .coverdiv{
        margin: auto;
        height: 549px;
        background-color: #fff;
        padding: 10px 30px;
    }
    .coverdiv .head:first-child{
        border-bottom: 1px solid #cecece;
        height: 40px;
        line-height: 40px;
        font-size: 20px ;
        font-weight: 900;
    }
    .coverdiv .head:first-child p{
        display: inline-block;
        float: left;
    }
    .coverdiv .head:first-child i{
        float: right;
        margin-top: 10px;
        color: #CCCCCC;
    }
    .selectarea span{
        color: #00B8EE;
        font-size: 18px;
        font-weight: bolder;
        float: left;
    }
    .cover .selectarea{
        height: 45px;
        padding-top: 10px;
        font-size: 16px ;
    }
    .cover .selectarea .btnArea{
        display: inline-block;
        font-size: 14px;
        float: right;
    }

    .cover .selectarea .btnArea div{
        margin-top: 10px;
        width: 90px;
        height: 30px;
        border: 1px solid #00B8EE;
        color: #FFF;
        background: #00B8EE;
        display: inline-block;
        margin-left: 10px;
        margin-top: -5px;
        line-height: 30px;
        text-align:center ;
        cursor: pointer;
        border-radius: 3px;
    }
    .cover .selectarea .btnArea div:hover{
        color: #00B8EE;
        background: #fff;
    }
    .hyzIcon_book{
        position: relative;
        top: -2px;
        left: -12px;
        width: 20px;
        height: 30px;
        text-align: center;
        background-image: url("../../assets/images/hyzicon/bookmark.png");
        background-repeat: no-repeat;
        background-size: cover;
        background-position: -5px;
    }
</style>
<style>
    .flexUl .el-input--suffix .el-input__inner{
        line-height: 30px;
    }

    .ridusCheck .el-upload-list--picture-card .el-upload-list__item{
        position: absolute;
        margin: 0px;
    }
    .ridusCheck .el-upload__tip{
        color: #333;
        position: absolute;
        width: 148px;
        margin-top: 15px;
        margin-left: 0;
        border-radius: 0 0 5px 5px;
        text-align: center;
    }
    .ridusCheck .select{
        box-shadow:0 0 10px 2px #00b7ee;
    }
    .ridusCheck .el-upload-list__item.is-success .el-upload-list__item-status-label{
        display: none !important;
    }
    .ridusCheck .el-checkbox__inner{
        border-radius: 0px 4px 0px 30px;
        width: 20px;
        height: 20px;
        line-height: 20px;
    }
    .ridusCheck .el-checkbox__inner::after{
        height: 8px;
        left: 8px;
        border-width: 2px;
    }
</style>
