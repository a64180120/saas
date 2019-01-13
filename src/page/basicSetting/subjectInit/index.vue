<template>
  <div class="container">
        <div class="subjectNav">
            <ul>
                <li @click="navActive(item)" :class="{active:activeNav==item.name}" v-for="(item,index) of navList" :key="index"><span>{{item.name}}</span></li>
            </ul>
        </div> 
        <div class="subjectContent">
            <div>
                <div class="searcherCon"> 
                    <div class="searcherValue"><input @keyup.13="getSubjectQueryList()" v-model="searchVal" type="text" placeholder="科目编码/名称"></div>
                    <div  @click="getSubjectQueryList()" class="searcherBtn btn">搜索</div>
                </div>
                <ul class="subjectHanle">
                    <li><span>系统默认启用日期:</span><span>{{startYear+'年'+'1月'}}</span></li>
                    <li v-show="!updatePage" :class="{btnDisabled:CheckRes}" @click.stop="CheckRes?0:updatePage=true" class="btn">开始初始化</li>
                    <li v-show="updatePage"  @click.stop="endInit()" class="btn">结束初始化</li>
                    <li :class="{btnDisabled:!CheckRes}" @click.stop="unInit()" class="btn">反初始化</li>
                    <li class="subjectSet">
                        <div>
                            <ul>
                                <li>科目设置</li>
                                <li @click.stop="addPage">新增</li>
                                <li @click.stop="updateSubject">修改</li>
                                <li @click.stop="subDelete">删除</li>
                            </ul>    
                        </div>    
                    </li>
                    <li @click.stop="refresh" style="background:#fff;width:30px;min-width:30px;border:0;border-radius:50%;cursor:pointer"><img src="../../../assets/icon/fresh2.svg" alt=""> </li>
                </ul>
            </div>
            <section  class="listContainer">
                <ul class="listTitle">
                    <li>科目编码</li>
                    <li>科目名称</li>
                    <li>余额方向</li>
                    <li>辅助核算</li>
                    <li>停用/启用</li>
                    <li>年初余额(元)</li>
                </ul>
                <div class="listOver">
                    <ul @click.stop="chooseOn(item,index)" :class="{clickActive:choosedCss[index]}" class="listTitle listContent" v-for="(item,index) of dataList" :key="index">
                        <li :title="item.KCode">{{item.KCode}}</li>
                        <li>{{item.KName}}</li>
                        <li><span v-if="item.KBalanceType==1">借</span><span v-if="item.KBalanceType==2">贷</span><span v-if="item.KBalanceType==3">借/贷</span></li>
                        <li>
                            <div class="assistCss" v-for="(aux,index) of item.AuxiliaryTypes" :key=index>
                                <img src="@/assets/images/finance/e43d0d92-28a3-4b66-8ef8-26681e276d6b.svg" alt="">   
                                <span>{{aux.BaseName}} &nbsp;</span>    
                            </div>     
                        </li>
                        <li>
                            <div ><i  :class="{newAddStateTrue:true,newAddStateFalse:false}"></i> </div>
                            <!-- <div v-show="updatePage">
                                <label>启用 <input type="radio"></label>
                                <label>停用 <input type="radio"></label>
                            </div> -->
                        </li>
                        <li>
                            <div v-show="(!updatePage)">{{item.NCAccount==0?'':item.NCAccount}}</div>
                            <div class="inputContainer" v-show="updatePage&&item.IsLast==1"><input type="text" v-model="item.NCAccount"></div>
                        </li>
                        <li v-if="item.children.length>0" class="child">                       
                            <ul @click.stop="childChoose($event,item,child,index2)"  v-for="(child,index2) of item.children" :key=index2>
                                <li style="padding:0 0 0 20px;" :title="child.KCode">{{child.KCode}}</li>
                                <li style="padding-left:20px;" >{{child.KName}}</li>
                                <li><span v-if="child.KBalanceType==1">借</span><span v-if="child.KBalanceType==2">贷</span><span v-if="child.KBalanceType==3">借/贷</span></li>
                                <li>
                                    <div class="assistCss" v-for="(aux,index) of child.AuxiliaryTypes" :key=index>
                                        <img src="@/assets/images/finance/e43d0d92-28a3-4b66-8ef8-26681e276d6b.svg" alt="">   
                                        <span>{{aux.BaseName}} &nbsp;</span>    
                                    </div>     
                                </li>
                                <li>
                                    <div ><i  :class="{newAddStateTrue:true,newAddStateFalse:false}"></i> </div>
                                    <!-- <div v-show="updatePage">
                                        <label>启用 <input type="radio"></label>
                                        <label>停用 <input type="radio"></label>
                                    </div> -->
                                </li>
                                <li>
                                    <div v-show="(!updatePage)">{{child.NCAccount==0?'':child.NCAccount}}</div>
                                    <div class="inputContainer" v-show="updatePage&&child.IsLast==1"><input type="text" v-model="child.NCAccount"></div>
                                </li>
                                <li v-if="child.children.length>0" class="child">
                                    <ul @click.stop="childChoose($event,child,child3,index3)"  v-for="(child3,index3) of child.children" :key=index3>
                                        <li style="padding:0 0 0 30px;" :title="child3.KCode">{{child3.KCode}}</li>
                                        <li style="padding-left:30px;" >{{child3.KName}}</li>
                                        <li><span v-if="child3.KBalanceType==1">借</span><span v-if="child3.KBalanceType==2">贷</span><span v-if="child3.KBalanceType==3">借/贷</span></li>
                                        <li>
                                            <div class="assistCss" v-for="(aux,index) of child3.AuxiliaryTypes" :key=index>
                                                <img src="@/assets/images/finance/e43d0d92-28a3-4b66-8ef8-26681e276d6b.svg" alt="">   
                                                <span>{{aux.BaseName}} &nbsp;</span>    
                                            </div>     
                                        </li>
                                        <li>
                                            <div ><i  :class="{newAddStateTrue:true,newAddStateFalse:false}"></i> </div>
                                            <!-- <div v-show="updatePage">
                                                <label>启用 <input type="radio"></label>
                                                <label>停用 <input type="radio"></label>
                                            </div> -->
                                        </li>
                                        <li>
                                            <div v-show="(!updatePage)">{{child3.NCAccount==0?'':child3.NCAccount}}</div>
                                            <div class="inputContainer" v-show="updatePage&&child3.IsLast==1"><input type="text" v-model="child3.NCAccount"></div>
                                        </li>
                                        <li v-if="child3.children.length>0" class="child">
                                            <ul @click.stop="childChoose($event,child3,child4,index4)"  v-for="(child4,index4) of child3.children" :key=index4>
                                                <li style="padding:0 0 0 40px;" :title="child4.KCode">{{child4.KCode}}</li>
                                                <li style="padding-left:40px;" >{{child4.KName}}</li>
                                                <li><span v-if="child4.KBalanceType==1">借</span><span v-if="child4.KBalanceType==2">贷</span><span v-if="child4.KBalanceType==3">借/贷</span></li>
                                                <li>
                                                    <div class="assistCss" v-for="(aux,inde) of child4.AuxiliaryTypes" :key=inde>
                                                        <img src="@/assets/images/finance/e43d0d92-28a3-4b66-8ef8-26681e276d6b.svg" alt="">   
                                                        <span>{{aux.BaseName}} &nbsp;</span>    
                                                    </div>     
                                                </li>
                                                <li>
                                                    <div ><i  :class="{newAddStateTrue:true,newAddStateFalse:false}"></i> </div>
                                                    <!-- <div v-show="updatePage">
                                                        <label>启用 <input type="radio"></label>
                                                        <label>停用 <input type="radio"></label>
                                                    </div> -->
                                                </li>
                                                <li>
                                                    <div v-show="(!updatePage)">{{child3.NCAccount==0?'':child4.NCAccount}}</div>
                                                    <div class="inputContainer" v-show="updatePage&&child3.IsLast==1"><input type="text" v-model="child4.NCAccount"></div>
                                                </li>
                                                
                                            </ul>
                                        </li>       
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul> 
                </div>
               
               
            </section>
        </div> 
        <div style="clear:both"></div>
        <div v-if="addPageShow" class="addPageCon">
            <div class="addPage">
                <div class="title"><span v-if="addPageShow=='add'">科目新增</span><span v-if="addPageShow=='update'">科目修改</span><i @click.stop="addPageShow=false"></i><div style="clear:both"></div></div>
                <ul>
                    <li>
                        <div>上级科目</div>
                        <div class="inputContainer">
                            &nbsp;{{subjectInfo.preSubject?subjectInfo.preSubject.KCode:''}}&nbsp;{{subjectInfo.preSubject?subjectInfo.preSubject.KName:''}}
                            
                            <!-- <select :disabled="addPageShow=='update'?true:false" v-model="subjectInfo.preSubject">
                                <option v-show="addData.PSubject.length>1" value="0">必填</option>
                                <option :value="item" v-for="(item,index) of addData.PSubject" :key=index>{{item.KName}}</option>
                            </select> -->
                        </div>
                        <div style="clear:both"></div>
                    </li>
                    <li style="overflow: hidden;">
                        <div>科目编码</div>
                        <div class="subCodeCss">
                            
                            <span v-show="addPageShow=='add'">{{subjectInfo.preSubject?subjectInfo.preSubject.KCode:''}}</span>
                            <div class="inputContainer">
                                <input :disabled="addPageShow=='update'?true:false" :placeholder="subjectInfo.preSubject?'0'+(parseInt(subjectInfo.preSubject.children.length)+1):'01'" 
                                        type="text" v-model="subjectInfo.KCode">
                            </div>
                            
                        </div>
                        <div style="clear:both"></div>
                    </li>
                    <li>
                        <div>科目名称</div>
                        <div class="inputContainer">
                            <input :disabled="choosedData[0].child.IsSystem?true:false" placeholder="必填" type="text" v-model="subjectInfo.KName">
                        </div>
                        <div style="clear:both"></div>
                    </li>
                    <li>
                        <div>科目类别</div>
                        <div  style="padding-left:10px;border:1px solid #ccc">
                            {{navList[subjectInfo.preSubject.KType-1].name}}
                        </div>
                      
                        <div style="clear:both"></div>
                    </li>
                    <li>
                        <div>余额方向</div>
                        <div>
                            <label v-show="(addPageShow=='add')||(subjectInfo.KBalanceType==1&&addPageShow=='update')">
                                <input v-model="subjectInfo.KBalanceType" value="1" type="radio" name="balance">
                                &nbsp;借方&nbsp;&nbsp;&nbsp;
                            </label>
                            <label v-show="(addPageShow=='add')||(subjectInfo.KBalanceType==2&&addPageShow=='update')">
                                <input v-model="subjectInfo.KBalanceType" value="2"  type="radio" name="balance">
                                &nbsp;贷方&nbsp;&nbsp;&nbsp;
                            </label>
                            <label v-show="(addPageShow=='add')||(subjectInfo.KBalanceType==3&&addPageShow=='update')">
                                <input v-model="subjectInfo.KBalanceType" value="3"  type="radio" name="balance">
                                &nbsp;借/贷&nbsp;&nbsp;&nbsp;
                            </label>
                        </div>
                        <div style="clear:both"></div>
                    </li>
                    <li>
                        <div>启/停用</div>
                        <div style="border:0">
                            <label v-show="(addPageShow=='add')||(subjectInfo.KBalanceType==1&&addPageShow=='update')">
                                <input v-model="subjectInfo.KBalanceType" value="1" type="radio" name="enable">
                                &nbsp;启用&nbsp;&nbsp;&nbsp;
                            </label>
                            <label v-show="(addPageShow=='add')||(subjectInfo.KBalanceType==0&&addPageShow=='update')">
                                    <input v-model="subjectInfo.KBalanceType" value="0" type="radio" name="enable">
                                    &nbsp;停用&nbsp;&nbsp;&nbsp;
                            </label>
                        </div>
                        <div style="clear:both"></div>
                        
                    </li>
                    <li>
                        <div>辅助核算</div>
                        <div style="overflow-y:auto;padding:0 5px;">
                            <label v-for="(assist,index2) of addData.Type" :key=index2>
                                <input type="checkbox" v-model="subjectInfo.AuxiliaryTypes[index2]">
                                &nbsp;{{assist.BaseName}}
                            </label>
                        </div>
                        <div style="clear:both"></div>
                    </li>
                </ul>
                <div class="finishBtn">
                    <span @click.stop="addPageShow=false" class="btn">取消</span>
                    <span @click.stop="addFinish()" class="btn">保存</span>
                    <div style="clear:both"></div>
                </div>
            </div>
        </div>
        <message :visible.sync="message.visible" :delay="message.delay" :message='message.message'></message>
        <time-select :showtype='"yearTime"' @item-click="yearSelect"></time-select>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import userInfo from '@/util/auth'
import { SubjectAdd,SubjectUpdate,SubjectDelete } from '@/api/subject/subjectInfo'
import timeSelect from '@/components/TimeSelectBar'
//科目期初
export default {
  name: "subjectInit",
  data() {
    return {
        searchVal:'',
        dataList:[],
        startYear:'',  //建账日期;
        year:(new Date).getFullYear(), //选择的年份
        asset:[],  //资产
        liabilities:[],  //负债
        netAsset:[],//净资产
        income:[],//收入
        pay:[],//支出
        Mst:{},//凭证信息
        addInfo:{}, //获取的新增科目的返回结果
        addData:{},//json转换的addInfo
        subjectInfo:{  //新增科目的值
            preSubject:'',
            KCode:'',
            KName:'',
            KType:'',
            KBalanceType:'',
            AuxiliaryTypes:[]
        },
        choosedData:[],//选中的item
        choosedCss:[],//选中的item的样式
        navList:[
            {code:'asset',name:'资产类'},{code:'liabilities',name:'负债类'},{code:'netAsset',name:'净资产类'},{code:'income',name:'收入类'},{code:'pay',name:'支出类'}
        ],
        checkedYear:'', //年份
        activeNav:'资产类',  //激活的类别

        updatePage:false,  //是否编辑状态
        CheckRes:'',  //是否初始化
        addPageShow:false,  //新增修改页面
        message:{
            message:'',
            delay:0,
            visible:false
        },
        orgInfo:''
    }
  },
  created() {
        
  },
  //加载数据
  mounted:function(){
      this.getChecked();
      
      this.startYear=userInfo.getUserInfoData().orgInfo.StartYear;  
  },
  //计算
  computed: {
      ...mapState({
          uid: state => state.user.userid,
          username: state => state.user.username,
          orgcode: state => state.user.orgcode,
          orgid: state => state.user.orgid,
      })
  },
  methods: {
      //导航切换**************
    navActive(item){
          var vm=this;
          this.activeNav=item.name;
          this.dataList=vm[item.code];
     
    },
    //样式初始化
    initCss(){
        for(var da in this.dataList){
            this.choosedCss[da]=false;
        }
    },
    //判断初始化状态************
    getChecked(){
            var data={
                uid:this.uid,
                orgid:this.orgid,
                queryfilter:{"OrgId*num*eq*1":this.orgid}
            }
            this.$axios.get('/PBusinessConfig/GetPBusinessConfigList',{params:data})
                .then(res=>{
                    if(res.Status=='error'){
                       this.message={
                            delay:4000,
                            message:res.Msg,
                            visible:true
                        } 
                    } 
                    if(!res.CheckRes){
                        this.message={
                            delay:4000,
                            message:'组织未初始化,请先初始化!',
                            visible:true
                        }
                    }
                   
                    
                    this.CheckRes=res.CheckRes;
                    this.startInitCss=!res.CheckRes;
                    // console.log(res)                  
                    // this.checkedTime=res.Record[0].JAccountPeriod+1;
                    if(res.CheckRes){
                        this.checkedYear=res.Record[0].JYear;
                    }
                     
               
                     this.getSubjectList();
                    // this.sideDate=res.Record[0].JYear+'-'+this.checkedTime;
                    // this.year=this.sideDate.split('-')[0];
                    // this.month=this.sideDate.split('-')[1];
                    // this.checkVal=this.checkedTime;
                    // this.unCheckVal=this.checkedTime>1?this.checkedTime-1:1;
                    // //this.getvoucherList('reset');
                    // this.$emit("time-click",{sideDate:this.sideDate,checkedTime:this.checkedTime,checkedYear:this.checkedYear})
                    // this.$forceUpdate();
                },err => {
                        console.log(err);
                       
                    })
                .catch(err=>this.$message({ showClose: true,message: err, type: "error"}))
        },
    //获取页面数据*********************
    getSubjectList(){
        var data={
            orgid:this.orgid,
            Ryear:this.year  
        }
        this.asset=[];
        this.liabilities=[];
        this.netAsset=[];
        this.income=[];
        this.pay=[];
        this.$axios.get('PSubject/GetPSubjectList',{params:data})
        .then(res=>{
            console.log(res)
            if(res.Status=="success"){
                for(var sub of res.Data){  //数据分成5类
                    switch(sub.KType){
                        case '1' :
                        this.asset.push(sub);
                        break;
                        case '2' :
                        this.liabilities.push(sub);
                        break;
                        case '3' :
                        this.netAsset.push(sub);
                        break;
                        case '4' :
                        this.income.push(sub);
                        break;
                        case '5' :
                        this.pay.push(sub);
                        break;
                    }
                } 
                
                this.Mst=res.Mst;
                this.dataList=this.asset;
                this.initCss();
                var data1={
                    orgid:this.orgid,
                    uid:this.uid,
                    Ryear:this.year
                }
                const loading2=this.$loading();
                this.$axios.get('PSubject/GetPSubjectLastList',{params:data1})
                .then(res=>{
                        loading2.close();
                        
                        if(res.Status=='success'){
                            this.addInfo=res;
                          
                        }
                        this.$forceUpdate();
                    },err => {
                        console.log(err);
                       
                    })
                    
            }
        },err => {
            console.log(err);
            
        })
        .catch(err=>{
           console.log(err)
        })
    },
    //递归查询*****
    infi(vm,arr,obj){
        if(obj.children.length>0){
            for(var i=0;i<obj.children.length;i++){
                if(obj.children[i].children.length==0){
                    arr.push(obj.children[i]);
                }else if(obj.children[i].children.length>0){
                    vm.infi(vm,arr,obj.children[i]);
                }
            }
        }else if(obj.children.length==0){
            arr.push(obj);
        }
        return arr;
    },
    //初始化按钮***********
    endInit(){
        var vm=this;
        var subjects=[];
        var Dtls=[];
        var url='Update';
        //加入末级科目到subject***
        for(var ass of this.asset){
                subjects=vm.infi(vm,subjects,ass);      
        }
        for(var lia of this.liabilities){
            subjects=vm.infi(vm,subjects,lia);   
        }
        for(var ne of this.netAsset){
            subjects=vm.infi(vm,subjects,ne);   
        }
        for(var inc of this.income){
            subjects=vm.infi(vm,subjects,inc);   
        }
        for(var p of this.pay){
           subjects=vm.infi(vm,subjects,p);   
        }
        
        
        if(!this.Mst){
            url='Add';
            for(var s in subjects){
                Dtls[s]={
                    SubjectCode:subjects[s].KCode, 
                    SubjectName:subjects[s].KName,
                    PersistentState:1
                }
                if(subjects[s].KBalanceType==1){
                    Dtls[s].JSum=subjects[s].NCAccount;
                    Dtls[s].DSum=0;
                    
                }else if(subjects[s].KBalanceType==2){
                    Dtls[s].DSum=subjects[s].NCAccount;
                    Dtls[s].JSum=0;
                }
                // if(subjects[s].AuxiliaryTypes.length>0){  //添加Dtls的辅助项
                //         Dtls[s].DtlAccounts={
                //             SubjectCode: Dtls[s].SubjectCode,
                //             SubjectName: Dtls[s].SubjectName,
                //             JSum: Dtls[s].JSum,
                //             DSum:0,
                //             PersistentState:1
                //         }
                //     for(var i of subjects[s].AuxiliaryTypes){
                //         Dtls[s].DtlAccounts[i.GLS]=i.PhId;
                //     }
                // }
        
            }
        }else{
            //修改
            for(var s in subjects){
                
                if(!subjects[s].PVoucherDel){
                    Dtls[s]={
                        SubjectCode:subjects[s].KCode, 
                        SubjectName:subjects[s].KName,
                        PersistentState:1
                    }
                   
                }else{
                    Dtls[s]=subjects[s].PVoucherDel;
                    Dtls[s].PersistentState=2;
                    Dtls[s].SubjectCode=subjects[s].KCode; 
                    Dtls[s].SubjectName=subjects[s].KName;
                    
                }  
                if(subjects[s].KBalanceType==1){
                    Dtls[s].JSum=subjects[s].NCAccount;
                    Dtls[s].DSum=0;
                    
                }else if(subjects[s].KBalanceType==2){
                    Dtls[s].DSum=subjects[s].NCAccount;
                    Dtls[s].JSum=0;
                } 
            }
            this.Mst.Dtls=Dtls;
            this.Mst.PersistentState=2;
        }
            //试算平衡*****************
            var J=0;
            var D=0;
            for(var dt of Dtls){
                J=(parseFloat(J)+parseFloat(dt.JSum)).toFixed(2);
                D=(parseFloat(D)+parseFloat(dt.DSum)).toFixed(2);
               
            }
            if(J!=D){
                var c=J-D;  //差额**
                this.message={
                    message:'借贷试算平衡不通过,借贷差额为'+c+'请检查余额!',
                    delay:4000,
                    visible:true
                }
                return;
            }
            if(!this.Mst){
                var data1={
                    uid: this.uid,
                    orgid: this.orgid,
                    orgcode: this.orgcode,
                    infoData: {
                        Mst:{
                            PMakePerson:this.username,
                            PType:'记',
                            OrgId:this.orgid,
                            OrgCode:this.orgcode,
                            PersistentState:1,
                            PMonth:0,
                            Uyear:this.year,
                            Dtls:Dtls
                        }
                    }
                }
            }else{
                 var data1={
                    uid: this.uid,
                    orgid: this.orgid,
                    orgcode: this.orgcode,
                    infoData: {
                        Mst:this.Mst
                    }
                }
            }
            
     
        const loading1=this.$loading();
        this.$axios.post('/PVoucherMst/Post'+url, data1)
        .then(res=>{
            loading1.close();
            if(res.Status=="success"){
                //发送初始化请求
                var data2={
                    orgid:this.orgid
                }
                const loading1=this.$loading();
                this.$axios.post('PBusinessConfig/PostCompleteInit',data2)
                .then(res=>{
                    loading1.close();
                    if(res.Status=='success'){
                        this.message={
                            delay:4000,
                            message:'恭喜您，借贷试算平衡，初始化完成 。',
                            visible:true
                        }
                        this.updatePage=false;
                        this.getChecked();
                    }else{
                        this.message={
                            delay:4000,
                            message:res.Msg,
                            visible:true
                        }
                    }
                    
                },err => {
                        console.log(err);
                       
                    })
                .catch(err=>{
                    loading1.close();
                    this.message={
                            delay:4000,
                            message:err,
                            visible:true
                        }
                })
            }else{
               this.message={
                    delay:4000,
                    message:res.Msg,
                    visible:true
                } 
            }
        })
        .catch(err=>{
            loading1.close();
            console.log(err)
        })
        
    },
    //反初始化
    unInit(){
        if(!this.CheckRes){
            return;
        }
        var data2={
            orgid:this.orgid
        }
        const loading1=this.$loading();
        this.$axios.post('PBusinessConfig/PostUnCompleteInit',data2)
        .then(res=>{
            loading1.close();
            if(res.Status=='success'){
                this.message={
                    delay:4000,
                    message:res.Msg,
                    visible:true
                }
            }
            this.getChecked();
        },err => {
            console.log(err);
            
        })
        .catch(err=>{
            loading1.close();
            this.$message({ showClose: true,message: err, type: "error"});
        })
    },
    //搜索功能*************
    getSubjectQueryList(){
        var data={
            orgid:this.orgid,
            uid:this.uid,
            Ryear:this.year,  
            infoData:{
                KType:'',
                KCode:this.searchVal,
                KName:this.searchVal
            }
            
        }
        for(var nav in this.navList){
            if(this.navList[nav].name==this.activeNav)
            data.infoData.KType=parseInt(nav)+1;
        }
        const loading=this.$loading();
        this.$axios.post('PSubject/PostPSubjectQueryList',data)
        .then(res=>{
            loading.close();
            if(res.Status=='success'){
                var str=this.navList[data.infoData.KType-1].code;
                var vm=this;
                vm[str]=res.Data;
                this.dataList=res.Data;
                if(res.Data.length==0){
                    this.message={
                        message:'未搜索到匹配的科目',
                        delay:3000,
                        visible:true
                    }
                }
            }
        },err => {
            console.log(err);
            
        })
        .catch(err=>{ 
            loading.close();
            this.$message(err);
        })
    },
    //选择行****
    chooseOn(item,index){
        for(var ch in this.choosedCss){
            this.choosedCss[ch]='';
        }
        var uls=document.querySelectorAll(".child>ul");
        for(var ul of uls){
            ul.className='';
        }
        this.choosedData=[];
        this.choosedData.push({child:item});
        this.choosedCss[index]=true;
        this.$forceUpdate();
    },
    //子代选择
    childChoose($event,item,child,index2){
         for(var ch in this.choosedCss){
            this.choosedCss[ch]='';
        }
        var e=$event.currentTarget;
        var uls=document.querySelectorAll(".child>ul");
        for(var ul of uls){
            ul.className='';
        }
        e.className="clickActive";
        this.choosedData=[];
        this.choosedData.push({child:child,parent:item});
        this.$forceUpdate();
    },
    //新增*****
    addPage(){
        if(this.choosedData.length<=0){
            this.message={
                message:'请选择修改的科目!',
                visible:true,
                delay:4000
            }
            return;
        }
      
        this.addData={};
        this.addPageShow='add';
        this.addData=this.choosedData[0].child;
        this.addData.Type=this.addInfo.Type;
        this.subjectInfo={
            preSubject:this.addData,
            KCode:'',
            KName:'',
            KType:this.addData.KType,
            KBalanceType:this.addData.KBalanceType,
            AuxiliaryTypes:[]
        }
        for(var t=0;t<this.addData.Type.length;t++){
            this.subjectInfo.AuxiliaryTypes[t]=false;
        }
        
    },
    //修改*****
    updateSubject(){
        if(this.choosedData.length<=0){
            this.message={
                message:'请选择修改的科目!',
                visible:true,
                delay:4000
            }
            return;
        }
         if(!this.choosedData[0].child.IsLast){
             this.message={
                 message:'只能修改末级科目!',
                 delay:4000,
                 visible:true
             }
             return;
         }
        this.addPageShow='update';
        this.addData={};
        this.addData.PSubject=this.choosedData.parent?this.choosedData.parent:[];  
         this.addData.Type=this.addInfo.Type;
       
        this.subjectInfo={
            PhId:this.choosedData[0].child.PhId,
            preSubject:this.choosedData[0].parent,
            KName:this.choosedData[0].child.KName,
            KCode:this.choosedData[0].child.KCode,
            KType:this.choosedData[0].child.KType,
            KBalanceType:this.choosedData[0].child.KBalanceType,
            AuxiliaryTypes:[]
        }
       
        if(!this.subjectInfo.preSubject){
            this.subjectInfo.preSubject=JSON.parse(JSON.stringify(this.choosedData[0].child));
            this.subjectInfo.preSubject.KCode='';
            this.subjectInfo.preSubject.KName='';
        }
    
        for(var t=0;t<this.addData.Type.length;t++){
            this.subjectInfo.AuxiliaryTypes[t]=false;
        }
    },
    //科目新增修改保存按钮
    addFinish(){
        var auxi=[];
        var vm=this;
        for(var t in this.addData.Type){  
            if(this.subjectInfo.AuxiliaryTypes[t])
                auxi.push(this.addData.Type[t]);
        }
        this.subjectInfo.OrgId=this.orgid;
        this.subjectInfo.Layers=parseInt(this.subjectInfo.preSubject.Layers)+1;
        this.subjectInfo.KType=this.subjectInfo.preSubject.KType;
        this.subjectInfo.Uyear=this.subjectInfo.preSubject.Uyear;
        this.subjectInfo.OrgCode=this.orgcode;
        this.subjectInfo.ParentId=this.subjectInfo.preSubject.PhId;      
        if(this.addPageShow=="add"){
            //新增***************
            if((!this.subjectInfo.preSubject)||(!this.subjectInfo.KName)){
                this.message={
                    message:'请输入科目名和上级科目!',
                    visible:true,
                    delay:4000
                }
                return;
            }
            var info=JSON.parse(JSON.stringify(this.subjectInfo));//防止页面瞬间变化***
            if(this.subjectInfo.KCode){
                info.KCode=this.subjectInfo.preSubject.KCode+this.subjectInfo.KCode;
            }else{
                info.KCode=this.subjectInfo.preSubject.KCode+(this.subjectInfo.preSubject.children?'0'+(parseInt(this.subjectInfo.preSubject.children.length)+1):'01');
            }
          
            // if(this.subjectInfo.preSubject.children){
            //     this.subjectInfo.KCode=parseInt(this.subjectInfo.preSubject.KCode)+'0'+(parseInt(this.subjectInfo.preSubject.children.length)+1);
            // }else{
            //     this.subjectInfo.KCode=parseInt(this.subjectInfo.preSubject.KCode)+'01';
            // }
            var data1={
              uid:this.uid,
              orgid:this.orgid,
              ParentSubject:this.addData,
              Subject: info, 
              AuxiliaryTypeList:auxi
            }
            const loading=this.$loading();
            SubjectAdd(vm,data1)
            .then(res=>{
                loading.close();
                if(res.Status=='success'){
                    this.message={
                        message:res.Msg,
                        visible:true,
                        delay:4000
                    }
                }else{
                   this.message={
                        message:res.Msg,
                        visible:true,
                        delay:4000
                    } 
                }
                this.addPageShow=false;
                this.getSubjectList();
            },err => {
                loading.close();
                console.log(err);
                
            })
            .catch(err=>{
                loading.close();
                this.message={
                        message:err?err:'出错了!',
                        visible:true,
                        delay:4000
                    }
            })
        }else{
            //修改***************
            if(this.choosedData[0].child.NgRecordVer){  //版本号***
                this.subjectInfo.NgRecordVer=this.choosedData[0].child.NgRecordVer
            }
            var data2={
              uid:this.uid,
              orgid:this.orgid,
              Subject: this.subjectInfo, 
              AuxiliaryTypeList:auxi
            }
            const loading2=this.$loading();
            SubjectUpdate(vm,data2)
            .then(res=>{
                loading2.close();
                if(res.Status=='success'){
                    this.message={
                        message:res.Msg,
                        visible:true,
                        delay:4000
                    }
                    this.addPageShow=false;
                    this.getSubjectList();
                }else{
                    this.message={
                        message:res.Msg,
                        visible:true,
                        delay:4000
                    }
                }
                
            },err => {
                loading2.close();
                console.log(err);
                
            })
            .catch(err=>{
                loading2.close();
                this.message={
                        message:err?err:'出错了!',
                        visible:true,
                        delay:4000
                    }
            })
        }
    },
    //删除*****
    subDelete(){
        var vm=this;
        if(this.choosedData.length<=0){
            this.message={
                message:'请选择要删除的科目!',
                visible:true,
                delay:4000
            }
            return;
        }
        var data3={
            orgid:this.orgid,
            uid:this.uid,
            id:this.choosedData[0].child.PhId
        }
        const loading2=this.$loading();
        SubjectDelete(vm,data3)
        .then(res=>{
            loading2.close();
            if(res.Status=='success'){
                this.message={
                    message:res.Msg,
                    delay:4000,
                    visible:true
                }
                 this.getSubjectList();
            }else{
               this.message={
                    message:res.Msg,
                    delay:4000,
                    visible:true
                } 
            }
           
        },err => {
            loading2.close();
            console.log(err);
            
        })
        .catch(err=>{
            loading2.close();
            this.message={
                    message:err,
                    delay:4000,
                    visible:true
                }
        })
    },
    //接收年份选择****
    yearSelect(data){
        this.year=data.choosedYear;
    
        this.getSubjectList();
    },
    //刷新
    refresh(){
        this.searchVal='';
        this.choosedData=[];
        for(var ch in this.choosedCss){
            this.choosedCss[ch]='';
        }
        var uls=document.querySelectorAll(".child>ul");
        for(var ul of uls){
            ul.className='';
        }
        this.getSubjectList();
    }
  },
  components:{
      timeSelect,
  }

}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style lang='scss' scoped>
    .container{
        height:100%;
        min-width:1000px;
    }
    .subjectNav{
        width: 25px;
        height:70%;
        float:left;
        >ul{
            height:100%;
            >li{
                text-align: center;
                height:20%;
                display:flex;  //垂直居中
                align-items:center;  //垂直居中
                padding-top:30px\9\0;
                // min-height: 130px;
                cursor:pointer;
                &.active{
                    background: #00b7ee;
                    color:#fff;
                }
                >span{
                    
                    position:relative;
                   
                    
                }
                 
            }
        }
    }
    .subjectContent{
        float:left;
        margin-left: 1%;
        width:96%;
        height:100%;
        >div:first-of-type{
            height:30px;
            width:100%;
            min-width: 810px;
            position: relative;
        }
    }
    .listContainer{
        min-width:810px;
        height:90%;
        margin-top:10px;
        position:relative;
        padding-top:40px;
        padding-bottom: 20px;
        .listOver{
            height:100%;
            overflow-y: scroll;
        }
    }
    .listContainer >ul.listTitle:first-of-type{
        width:100%;
        background: #d3e9f9 ;
        color:#333;
        position:absolute;
        top:0;
        margin-right:5px;
        // >li{
        //     border-right:1px solid #fff;
        // }
    }
    .listContainer ul.listTitle{
        height:auto;
        background: #d3e9f9 ;
        color:#333;
        // &:first-of-type{
        //     >li{
        //         background: #d3e9f9 ;
        //     }
        // }
        >li>div{
            height:100%;
            width:100%;
            position:relative;
        }
    }
    .listContainer ul.listTitle >li{
        float:left;
        text-align: center;
        height:40px;
        line-height: 40px;
        overflow:hidden;
        position:relative;
    }
    .listContainer ul.listTitle >li:first-of-type{
        width:20%;
    }
    .listContainer ul.listTitle >li:nth-of-type(2){
        width:13%;
    }
    .listContainer ul.listTitle >li:nth-of-type(3){
        text-align: center;
        width:10%;
    }
    .listContainer ul.listTitle >li:nth-of-type(4){
        width:32%;
    }
    .listContainer ul.listTitle >li:nth-of-type(5){
        width:15%;
    }
    .listContainer ul.listTitle >li:nth-of-type(6){
        width:10%;
    }
    .listContainer ul.listContent{
        background: #fff;
        &.clickActive>li{
            background:#aaa;
            &.child{
                background: #fff;
            }
        }
        li{
            padding: 0 0 0 5px;
        }
        >li{
            border:1px solid #ddd;
            border-width:0 1px 1px 0;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 0 0 5px;

            &:first-of-type{
                border-left:1px solid #ddd;
            }
            .inputContainer>input{
                border:0;
            }
            .assistCss{
                display: inline-block;
                width:auto;
                margin-right:5px;
           
                >img{
                    height:70%;
                    vertical-align: middle;
                    position:relative;
                    top:-2px;
                }
            }
        }
        >li.child{
            clear:both;
            height:auto;
            width:100%;
            padding:0 ;
            border:0;
            >ul{
                &.clickActive>li{
                    background:#aaa;
                }
                
                >li{
                    float:left;
                    height:40px;
                    position:relative;
                    border:1px solid #ddd;
                    border-width:0 1px 1px 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &:first-of-type{
                       width:20%;
                       border-width:0 1px 1px 1px;
                    }
                    &:nth-of-type(2){
                        width:13%;
                    }
                    &:nth-of-type(3){
                        text-align: center;
                        width:10%;
                    }
                    &:nth-of-type(4){
                        width:32%;
                    }
                    &:nth-of-type(5){
                        width:15%;
                    }
                    &:nth-of-type(6){
                        width:10%;
                    }
                    >div{
                        height:100%;
                    }
                }
            }
        }
    }
    li.child{
        clear:both;
        height:auto !important;
        width:100%;
        padding:0 !important;
        border:0 !important;
        .child{
            background: #fff !important;
        }
        >ul{
            &.clickActive>li{
                background:#aaa;
            }
            
            >li{
                float:left;
                height:40px;
                position:relative;
                border:1px solid #ddd;
                border-width:0 1px 1px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                &:first-of-type{
                    width:20%;
                    border-width:0 1px 1px 1px;
                }
                &:nth-of-type(2){
                    width:13%;
                }
                &:nth-of-type(3){
                    text-align: center;
                    width:10%;
                }
                &:nth-of-type(4){
                    width:32%;
                }
                &:nth-of-type(5){
                    width:15%;
                }
                &:nth-of-type(6){
                    width:10%;
                }
                >div{
                    height:100%;
                }
            }
        }
    }
    .searcherCon{
        >div{
            float:left;
        }

    }
    .subjectHanle{
        right:0;
        position:absolute;
        z-index:9;
        >li{
            float:left;
            height:30px;
            line-height: 30px;
            overflow: hidden;          
            margin-left:10px;
            width:90px;
            text-align: center;
            border-radius:3px;
            >img{
                width:100%;
                height:100%;
            }
            &:first-of-type{
                background: none;
                color:#aaa;
                width:220px;
            }
            &.subjectSet{
                transition:all 0.2s linear;
                position:relative;
                border:1px solid #00b7ee;
                cursor:pointer;
                &:hover{
                    height:120px;
                    border:1px solid #00b7ee;
                }
                >div{
                    float:left;
                    width:100%;
                    height:100%;
                    z-index:9;
                    >ul{
                        li{
                            width:100%;
                            background: #fff;
                            color:#aaa;
                            &:hover{
                                background:#ccc;
                                color:#fff;
                            }
                        }
                        >li:first-of-type{
                            position: relative;    
                            text-align: left;
                            padding-left:10px;
                            background: #00b7ee;
                            color:#fff;
                            &:after{
                                content:"";
                                position: absolute;
                                right:6px;
                                top:12px;
                                border:5px solid transparent;
                                border-top:5px solid #fff;
                            }   
                        }
                    }
                }
                
            }
            &:last-of-type{
                margin-right:5px;
            }
            >ul>li{
                height:30px;
            }
        }
    }
    i.newAddStateTrue:after{
        top:5px;
    }
    .newAddStateFalse:before,
    .newAddStateFalse:after{
        top:20px;
    }
    .searcherBtn{
        height:32px;
        width:60px;
        text-align: center;
        line-height: 30px;
        border-radius: 0 ;
    }   
    .addPageCon{
        width:100%;
        height:100%;
        position:fixed;
        left:0;
        top:0;
        z-index:99;
        font-size:16px;
        color:#666;
        background:rgba(0,0,0,0.5);
        >.addPage{           
            width:556px;
            height:396px;
            position:absolute;
            left:35%;
            top:120px;
            background:#fff;
            padding:5px 10px;
            >ul{
                padding:20px 50px 0px;
                >li{
                    
                    height:30px;
                    line-height:30px;
                    margin-bottom:10px;
                    overflow-y: auto;
                    .inputContainer>input{
                        border:0;
                        height:95%;
                    }
                    
                    .subCodeCss{
                        overflow: hidden;
                        >span{
                            float:left;
                            height:100%;
                            line-height: 30px;
                            width:20%;
                            background: #ccc;
                            color:#fff;
                            text-align: right;
                            padding-right:5px;
                        }
                        >div{
                            float:left;
                            width:80%;
                            >input{
                                border:0;
                            }
                        }
                    }
                    >div{
                        height:100%;
                    }
                    >div:last-of-type{
                        width:0;
                        height:0;
                    }
                    >div:first-of-type{
                        float:left;
                        width:75px;
                        text-align: right;
                        padding-right:10px;
                    }
                    >div:nth-of-type(2){
                        float:left;        
                        width:360px;
                        border:1px solid #ccc;
                        
                    }
                    &:nth-of-type(4) >div:nth-of-type(2){
                         border:0;
                    }
                    &:nth-of-type(5) >div:nth-of-type(2){
                         border:0;
                    }
                    
                }
                &>li:last-of-type{
                    margin-top:10px;
                    height:40px;
                }
                
            }
        }
    }
    .title{
        border-bottom: 1px solid #ccc;
        padding:8px 3px;
        width:100%;
        font-family: Arial;
        font-size: 14.0pt;
        font-style: normal;
        font-weight: 700;
        >span{
            float:left;
        }
        i{
            float:right;
            background: url("../../../assets/icon/close.svg");
            background-size:cover ;
            width:20px;
            height:20px;
            cursor:pointer;
            &:hover{
                opacity:0.7;
            }
        }
    }
    .finishBtn{
        width:230px;
        margin:auto;
        >:nth-of-type(2){
            float:right;
        }
    }
    .box{
        top:40px;
        height:88%;
        box-shadow:0 0 20px 2px #ccc;
    }
    
</style>