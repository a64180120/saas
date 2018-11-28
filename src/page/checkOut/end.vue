<template>
    <div class="end">
        <div class="unionState flexPublic">
            <div class="dateSelect">
                <label>
                    <div>账期:</div>
                    <div class="block">
                        <el-date-picker
                            v-model="date1"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </label>
                <label >
                    <div>至:</div>
                    <div class="block">
                        <el-date-picker
                            v-model="date2"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </label>
            </div>
            <div class="flexPublic searcherCon">
                <div class="searcherValue"><input type="text" placeholder="科目/摘要/凭证号"></div>
                <div  class="searcherBtn">搜索</div>
            </div>
            <ul class="flexPublic handle">
                <a @click.prevent="handle('update')"><li>修改</li></a>
                <a @click.prevent="handle('delete')"><li>删除</li></a>
                <a @click.prevent="handle('turnVouchers')"><li>批量生成凭证</li></a>
            </ul>
        </div>
        <div class="content">
            <ul>
                <li @click="newAdd" class="newAddCss">
                    <div>新增期末结转</div>
                    <div ><i></i></div>
                </li>
                <li v-for="(item,index) of dataList" :key="index" @click="chooseItem(item,index)">
                    <div>{{item.date}}</div>
                    <div class="carry-over" :class="{active:carryOverCss[index].checked}">
                        <h3>结转收入</h3>
                        <h3>1000000.00元</h3>
                        <p @click.stop="proVoucher(item)">生成凭证</p>
                    </div>
                </li>

            </ul>
        </div>
        <div v-if="newAddToggle" class="newAddPage">
            <div>
                <div class="newAddTitle flexPublic">
                    <span>新增期末结转</span>
                    <span @click="newAdd(false)"></span>
                </div>
                <div class="newAddContent">
                    <div class="newAddName flexPublic">
                        <div>方案名称 : </div>
                        <div class="inputContainer"><input maxlength="15" placeholder="请输入名称(必填)" v-model="name" type="text"></div>
                    </div>
                    <div class="newAddSetting flexPublic">
                        <div class="outSetting">
                            <p></p>
                            <div class="outTitle">
                                转出设置
                            </div>
                            <div class="inputContainer">
                                <input placeholder="请输入摘要" v-model="outAbstruct" type="text">
                            </div>
                            <div class="subjectContainer">
                                <p><span>转出科目(多选)</span></p>
                                <div class="subjectContent">
                                    <div>
                                        <p><span>未选</span></p>
                                        <div class="inputContainer"><input v-model="outSearch" placeholder="请输入科目名称或代码" type="text"></div>
                                        <div>
                                            <ul>
                                                <li class="subActive" :class="{subClick:outSubChooseCss[index].checked}" @click="subChoose('out',index,item)" v-for="(item,index) of outSearchValues" :key="index">{{item}}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="arrow">
                                        <ul>
                                            <li><img src="@/assets/icon/rightDouble.svg" alt=""></li>
                                            <li @click="arrowHandle('out','add')" ><img src="@/assets/icon/rightArr.svg" alt=""></li>
                                            <li @click="arrowHandle('out','minus')" ><img src="@/assets/icon/leftArr.svg" alt=""></li>
                                            <li><img src="@/assets/icon/leftDouble.svg" alt=""></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p><span>已选</span></p>
                                        <div>
                                            <ul>
                                                <li class="subActive" :class="{subClick:outSubChoosedCss[index].checked}" @click="subChoosed('out',index,item)" v-for="(item,index) of outChoosed" :key="index">{{item}}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="inSetting">
                            <p></p>
                            <div class="outTitle">
                                转入设置
                            </div>
                            <div class="inputContainer">
                                <input placeholder="请输入摘要" v-model="inAbstruct" type="text">
                            </div>
                            <div class="subjectContainer">
                                <p><span>转入科目(多选)</span></p>
                                <div class="subjectContent">
                                    <div>
                                        <p><span>未选</span></p>
                                        <div class="inputContainer"><input v-model="inSearch" placeholder="请输入科目名称或代码" type="text"></div>
                                        <div>
                                            <ul>
                                                <li class="subActive" :class="{subClick:inSubChooseCss[index].checked}" @click="subChoose('in',index,item)" v-for="(item,index) of inSearchValues" :key="index">{{item}}</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="arrow">
                                        <ul>
                                            <li><img src="@/assets/icon/rightDouble.svg" alt=""></li>
                                            <li @click="arrowHandle('in','add')"><img src="@/assets/icon/rightArr.svg" alt=""></li>
                                            <li @click="arrowHandle('in','minus')"><img src="@/assets/icon/leftArr.svg" alt=""></li>
                                            <li><img src="@/assets/icon/leftDouble.svg" alt=""></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p><span>已选</span></p>
                                        <div>
                                            <ul>
                                                <li class="subActive" :class="{subClick:inSubChoosedCss[index].checked}" @click="subChoosed('in',index,item)" v-for="(item,index) of inChoosed" :key="index">{{item}}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="newAddCancle">
                    <span @click="keepNewAdd">保存</span>
                    <span @click="newAdd(false)">取消</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "end",
      created(){
       this.initCss();
      },
      mounted(){},
      data(){
        return {
            date1:'',
            date2:'',
            name:'',
            unionSearchValue:'',
            choosed:[],
            outChoosed:[],
            inChoosed:[],
            inAbstruct:'',
            outAbstruct:'',
            inSearch:'',
            inSearchValues:[],
            outSearch:'',
            outSearchValues:[],
            dataList:[
                {PhId:'11',date:'2019-09-13  16:32',money:'1000000.00'},
                {PhId:'11',date:'2019-09-13  16:32',money:'1000000.00'},
                {PhId:'11',date:'2019-09-13  16:32',money:'1000000.00'},
                {PhId:'11',date:'2019-09-13  16:32',money:'1000000.00'},
                {PhId:'11',date:'2019-09-13  16:32',money:'1000000.00'},
                {PhId:'11',date:'2019-09-13  16:32',money:'1000000.00'},
                {PhId:'11',date:'2019-09-13  16:32',money:'1000000.00'}
            ],
            carryOverCss:[],
            pickerOptions: {
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
            subjects:[
                '科目1',
                '科目2',
                '科目3',
                '科目4',
                '科目5',
                '科目6',
                '科目1-1',
                '科目2-1',
                '科目3-1',
                '科目4-1',
                '科目5-1'
            ],
            newAddToggle:false,
            inSubChoose:[],
            inSubChooseCss:[],
            outSubChoose:[],
            outSubChooseCss:[],
            inSubChoosed:[],
            inSubChoosedCss:[],
            outSubChoosed:[],
            outSubChoosedCss:[],
        }
      },
      methods:{
          chooseItem(item,index){
              if( this.carryOverCss[index].checked){
                  this.carryOverCss[index].checked=false;
                    this.choosed.splice(index,1);
              }else{
                  this.carryOverCss[index].checked=true;
                  this.choosed[index]=item;console.log(this.choosed, this.carryOverCss,index);
              }
              this.$forceUpdate();
          },
          proVoucher(item){

          },
          initCss(){
              for(var i in this.dataList){
                  this.carryOverCss[i]={checked:false}
              }

          },
          keepNewAdd(){
              if(!this.name){
                  alert('请输入方案名称!')
              }else{

              }
          },
          newAdd(bool){
              if(bool){
                  for(var i in this.subjects){
                      this.inSubChooseCss[i]={checked:false}
                      this.outSubChooseCss[i]={checked:false}
                  }
                  this.inSearchValues=this.subjects;
                  this.outSearchValues=this.subjects;
                   this.newAddToggle=true;
              }else{
                  this.newAddToggle=false;
              }
          },
          //未选*******************
          subChoose(val,index,item){
              var sub=[];
              var cho=[];
              if(val=='in'){
                 sub=this.inSubChooseCss;
                  cho=this.inSubChoose;
              }else{
                  sub=this.outSubChooseCss;
                  cho=this.outSubChoose;
              }
              if( sub[index].checked){
                  sub[index].checked=false;
                  cho.splice(index,1);
              }else{
                  sub[index].checked=true;
                  cho[index]=item;
              }
              this.$forceUpdate();
          },
          //已选**********************************
          subChoosed(val,index,item){
              var sub=[];
              var cho=[];
              if(val=='in'){
                  sub=this.inSubChoosedCss;
                  cho=this.inSubChoosed;
              }else{
                  sub=this.outSubChoosedCss;
                  cho=this.outSubChoosed;
              }
              if( sub[index].checked){
                  sub[index].checked=false;
                  cho.splice(index,1);
              }else{
                  sub[index].checked=true;
                  cho[index]=item;
              }
              this.$forceUpdate();
          },
          arrowHandle(val,type){
              if(val=='out'){
                  if(type=='add'){
                      for(var su of this.outSubChoose){
                        if(su){
                            this.outChoosed.push(su);
                        }
                      }
                      for(var i in this.outSubChoose){
                          this.outSubChooseCss[i]={checked:false}
                      }
                      this.outSubChoose=[];
                      this.$forceUpdate();
                  }else if(type=='minus'){
                      for(var i=this.outSubChoosed.length-1;i>=0;i--){
                          if(this.outSubChoosed[i]){
                              this.outChoosed.splice(i,1);
                          }
                      }
                  }
                  this.outSubChoosedCss=[];
                  this.outSubChoosed=[];
                  for(var i in this.outChoosed){
                      this.outSubChoosedCss[i]={checked:false}
                  }
                  this.$forceUpdate();
              }else{
                  if(type=='add'){
                      for(var su of this.inSubChoose){
                          if(su){
                              this.inChoosed.push(su);
                          }
                      }
                      for(var i in this.inSubChoose){
                          this.inSubChooseCss[i]={checked:false}
                      }
                      this.inSubChoose=[];
                      this.$forceUpdate();
                  }else if(type=='minus'){
                      for(var i=this.inSubChoosed.length-1;i>=0;i--){
                          if(this.inSubChoosed[i]){
                              this.inChoosed.splice(i,1);
                          }
                      }
                  }
                  this.inSubChoosedCss=[];
                  this.inSubChoosed=[];
                  for(var i in this.inChoosed){
                      this.inSubChoosedCss[i]={checked:false}
                  }
                  this.$forceUpdate();
              }
          },
          fastSearch(val){
              var value='';
              var values=[];
              if(val=='in'){
                  value=this.inSearch;
              }else{
                  value=this.outSearch;
              }
              for(var i in this.subjects){

                   if(this.subjects[i].indexOf(value)!=-1){ console.log(values)
                       values.push(this.subjects[i]);
                   }
              }
              if(val=='in'){
                  this.inSearchValues=values;
                  this.inSubChooseCss=[];
                  for(var css of this.inSubChooseCss){
                      css={checked:false}
                  }
              }else{
                  this.outSearchValues=values;
                  this.outSubChooseCss=[];
                  for(var css of this.outSubChooseCss){
                      css={checked:false}
                  }
              }
          }
      },
      watch:{
        inSearch(){
            this.fastSearch('in');
        },
         outSearch(){
              this.fastSearch('out');
          }
      }
  }
</script>

<style lang="scss" scoped>
    .end{
        min-width:1200px;
        height:100%;
        position:relative;
    }
    .unionState>ul>li{
        width:50%;
    }
    .searcherCon{
        float:right;
        margin-right:50px;
        width:40%;
        min-width: 170px;
    }

    .unionState:after{
        content:"";
        clear:both;
        display: block;
    }
    .searcherValue{
        border:1px solid #ddd;
        border-radius: 10px 0 0 10px ;
        overflow: hidden;
        padding-left:10px;
    }
    .searcherValue{
        width:80%;
    }
    .searcherValue>input{
        width:100%;
        height:30px;
        outline: none;
        margin:0;
        font-size: 14px;
        border:0;
    }
    .searcherBtn{
        height:30px;
        width:20%;
        text-align: center;
        line-height: 30px;
        background:#509edc;
        color:#fff;
        cursor:pointer;
    }
    .unionState .handle>a>li{
        border:1px solid #ff9900;
        cursor:pointer;
        border-radius: 3px;
        text-align: center;
        min-width:70px;
        font-size:13px;
        height:30px;
        line-height: 30px;
        margin-left:10px;
        margin-right: 0;
    }
    .unionState .handle>a:nth-of-type(3)>li{
        min-width: 100px;
    }
    .unionState .handle>a>li:hover{
        background: #ff9900;
        color:#fff;
    }
    div.dateSelect{
        display: flex;
        justify-content: flex-start;
        width:30%;
        margin-right: 20px;
        >label{
            display: flex;
            align-items: center;
            &:nth-of-type(2){
                margin-left:5px ;
                >div:first-of-type{
                    width:30px;
                }
                >div.inputContainer{
                    width:40px;
                }
            }
            div{
                text-align: center;
            }
        }
        >label>div:first-of-type{
            width:40px;
        }
        >label>div:nth-of-type(2)>div{
            width:100px;
        }
    }
    .content{
        width:100%;
        height:100%;
        padding:10px 15px;
        margin-top: 10px;
        >ul{
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: space-between;
            >li{
                width:24%;
                height:176px;
                margin-bottom: 20px;
                &.newAddCss{

                    >div:first-of-type{
                        background: #ff9900;
                        text-align: center;
                    }
                    >div:nth-of-type(2){

                        display: flex;
                        justify-content: center;
                        align-items: center;
                        >i{
                            display: block;
                            width:85px;
                            height:80px;
                            position:relative;
                            &:before{
                                content:"";
                                position:absolute;
                                top:37px;
                                background: #ccc;
                                width:100%;
                                height:5px;
                                border-radius: 5px;
                                border:1px solid #ccc;
                            }
                            &:after{
                                content:"";
                                position:absolute;
                                left:40px;
                                background: #ccc;
                                width:5px;
                                height:100%;
                                border-radius: 5px;
                                border:1px solid #ccc;
                            }
                        }

                    }

                }
                >div:first-of-type{
                    height:35px;
                    line-height: 35px;
                    color: #fff;
                    background: #6acccb;
                }
                >div:nth-of-type(2){
                    border:1px solid #ccc;
                    border-top: 0;
                    height:141px;
                    cursor:pointer;
                }
                >.carry-over{
                    padding:20px;
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 20px;
                    >h3{
                        font-weight: 600;
                    }
                    >p{
                        width:80px;
                        font-size: 13px;
                        border:1px solid #6acccb;
                        border-radius: 3px;
                        text-align: center;
                        height:25px;
                        line-height: 25px;
                        background: #fff;
                        cursor:pointer;
                        &:hover{
                            background: #6acccb;
                        }
                    }
                }
                >.active{
                    background:#ff9900 ;
                }
            }
        }
    }
    .newAddPage{
        position:absolute;
        top:0;
        width:100%;
        height:100%;
        background: rgba(102,102,102,0.5);
        >div{
            width:90%;
            margin:150px auto 0;
            background: #fff;
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
            .newAddContent{
                padding:10px;
                >.newAddName{
                    margin-bottom:10px;
                    >div:first-of-type{
                        width:100px;
                    }
                }
            }
            .newAddCancle{
                height:50px;
                border-top:1px solid #ccc;
                display:flex;
                flex-flow: row;
                justify-content: flex-end;
                align-items: center;
                >span{
                    width:90px;
                    height:40px;
                    line-height: 40px;
                    text-align: center;
                    border-radius: 5px;
                    border:1px solid #3e8cbc;
                    margin-right: 20px;
                    background: #3e8cbc;
                    color:#fff;
                    cursor:pointer;
                    &:hover{
                        background: #fff;
                        color:#333;
                        border-color:#3e8cbc;
                    }
                }
            }
        }
    }
    .newAddSetting{
        >div{
            width:49%;
            text-align: center;
            background: #efefef;
        }
       .inSetting, .outSetting{
           input{
               background: #fff;
           }
            >p:first-of-type{
                height:8px;
                background: #454d64;
            }
           >div.outTitle{
               height:25px;
               width:130px;
               background: #454d64;
               margin:0 auto 10px;
               color:#fff;
               font-size: 15px;
               position:relative;
               z-index: 0;
               &:before{
                   content:"";
                   position:absolute;
                   border:25px solid transparent;
                   border-top-color:#454d64;
                   width:130px;
                   left:-25px;
                   z-index: -1;
               }
           }
        }
        .inSetting{
            >p:first-of-type{
                background: #ff9900;
            }
            >div.outTitle{
                background: #ff9900;
                &:before{
                    border-top-color:#ff9900;
                }
            }

        }
        .subjectContainer{

            border:1px solid #ccc;
            background: #fff;
            margin:20px 8px 10px;
            padding:0 10px 10px 10px;
            >p{
                text-align: left;
                span{
                    position:relative;
                    top:-10px;
                    background: #fff;
                    padding:0 10px;
                }
            }
            .subjectContent{
                display: flex;
                .arrow{
                    display: flex;
                    flex-flow: column;
                    justify-content: center;
                    align-items: center;
                    ul{
                        padding:20px;
                        li{
                            width:27px;
                            height:27px;
                            margin-bottom:15px;
                            cursor:pointer;
                            &:nth-of-type(2){
                                position: relative;
                                left:-5px;
                            }
                            &:nth-of-type(3){
                                position: relative;
                                left:5px;
                            }
                            img{
                                width:100%;
                                height:100%;

                            }
                        }
                    }
                }
                >div{
                    width:40%;
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: center;
                    border:1px solid #ccc;
                    &:nth-of-type(2){
                        width:20%;
                        border:0;
                    }
                    >p{
                        span{
                            position:relative;
                            top:-10px;
                            background: #fff;
                            padding:0 10px;
                        }
                    }
                    .inputContainer{
                        width:95%;
                    }
                    >div{
                        width:100%;
                        margin-top: 10px;
                        ul{
                            height:150px;
                            width:100%;
                            overflow-y: auto;
                            >li{
                                height:30px;
                                line-height: 30px;
                                padding:0 15px;
                                text-align: left;
                                cursor:pointer;
                            }
                        }
                    }
                    .subActive:hover{
                        background: #ccc;
                    }
                    .subClick{
                        background: #02a7e7;
                    }
                    .subClick:hover{
                        background: #02a7e7;
                    }
                }
            }

        }
    }
</style>
