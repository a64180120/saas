<template>
    <div class="dataRank">
        <div class="topEchartCon" :class="{close:showechart}">
            <div class="topEchart">
                <div class="chart1">
                    <chart1/>
                </div>
            </div>
            <div class="lengend">
                <ul class="yearIcon">
                    <li><i :style="yearColor[0]"></i> 2018</li>
                    <li><i :style="yearColor[1]"></i> 2019</li>
                    <li><i :style="yearColor[2]"></i> 2020</li>
                    <li class="imgIcon"><img src="@/assets/images/datadriver/sj.png"/> </li>
                </ul>
                <div class="countType">
                    <span class="active">本年累计数</span>
                    <span>本月数</span>
                </div>
                <div class="inputContainer">
                    <input type="text" placeholder="请输入基层工会名称">
                </div>
            </div>
        </div>
        <div class="listContainer" :class="{close:showechart}">
            <div class="pagination">
                <div style="float:left">
                    共 <span class="">1789</span>条记录
                </div>
                <div style="float:right">
                    <el-pagination
                        background
                        @size-change="getData"
                        @current-change="getData"
                        :current-page.sync="pageindex"
                        :page-sizes="[10,20, 30, 50, 70,100,500]"
                        :page-size.sync="pagesize"
                        layout="sizes, prev, pager, next"
                        :total="total">
                    </el-pagination>
                    <el-button @click="showRowSelect" style="position: relative;top: -3px;" type="mini">添加列名</el-button>
                </div>
            </div>
            <i @click="showechart=!showechart" class="topArrow" :class="{topArrowclose:showechart}">
                <img src="@/assets/images/datadriver/you.png"/>
            </i>
            <div class="tablelist">
                <el-table
                :data="tableData"
                align="left"
                
                border
                :show-overflow-tooltip="true"
                row-class-name="tableRow"
                height="100%"
                style="width: 100%">
                    <el-table-column
                    type="index"
                    sortable
                    sort-by="index"
                    label="序号"
                    min-width="60">
                    </el-table-column>
                    <el-table-column
                    sortable
                    prop="name"
                    label="工会名称"
                    min-width="150">
                    </el-table-column>
                    <el-table-column label="凭证数量">
                        <el-table-column
                            sortable
                            prop="date"
                            sort-by="date"
                            label="小计"
                            min-width="90">
                        </el-table-column>
                        <el-table-column
                            sortable
                            prop="province"
                            label="已审"
                            min-width="90">
                        </el-table-column>
                        <el-table-column
                            sortable
                            prop="city"
                            label="未审"
                            min-width="90">
                        </el-table-column>   
                    </el-table-column>
                    <el-table-column  
                    prop="name"
                    label="决算核算完成率"
                    
                    >
                    </el-table-column>    
                    <el-table-column  
                    label="支出(元)"
                    >
                        <el-table-column
                            sortable
                            prop="city"
                            label="总支出"
                            min-width="100">
                        </el-table-column>  
                        <el-table-column
                            v-for="rowname of rowSelected.out" :key="rowname.prop"
                            sortable
                            :prop='rowname.prop'
                            :label="rowname.label"
                            :min-width="rowname.width">
                        </el-table-column>   
                    </el-table-column>  
                    <el-table-column  
                      label="收入(元)"
                    >
                        <el-table-column
                            sortable
                            prop="city"
                            label="总收入"
                            min-width="100">
                        </el-table-column>  
                        <el-table-column
                            v-for="rowname of rowSelected.in" :key="rowname.prop"
                            sortable
                            :prop='rowname.prop'
                            :label="rowname.label"
                            :min-width="rowname.width">
                        </el-table-column>  
                       
                    </el-table-column>     
                </el-table>
            </div>
        </div>
        <el-dialog :visible.sync="rowSelect" custom-class="dataDriverRank" width="50%">
            <div class="allRowslist">
                <p class="title">列名显示选择</p>
                <div class="button">
                    <span @click="updateRows" class="btn">
                        保存
                    </span>
                    <span @click="rowSelect=false" class="btn">
                        关闭
                    </span>
                </div>
                <ul class=" listcontent">
                    <li>
                        <div>列名</div>
                        <div>是否显示</div>
                    </li>
                    <li v-for="row of rowlist.in">
                        <div>{{row.prop+' '+row.label}}</div>
                        <div>
                            <el-checkbox v-model="row.checked"></el-checkbox>
                        </div>
                    </li>
                    <li v-for="row2 of rowlist.out">
                        <div>{{row2.prop+' '+row2.label}}</div>
                        <div>
                            <el-checkbox v-model="row2.checked"></el-checkbox>
                        </div>
                    </li>
                </ul>
                <img src="../../../assets/images/datadriver/bt3-1.png"/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import chart1 from './echart/chart1'
export default {
    name:'datarank',
    data(){
        return {
            yearColor:[  //年度图例的颜色
                {background:'#b1b928'},
                {background:'#016bb8'},
                {background:'#722d32'}
            ],
            pagesize:30,
            pageindex:0,
            total:10,
            showechart:false,
            tableData: [{
                date: '2016-05-03',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-02',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-04',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-01',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-08',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-06',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-06',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-06',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
                }, {
                date: '2016-05-07',
                name: '王小虎',
                402: '上海',
                401: '普陀区',
                address: '上海市普陀区金沙江路 1518 弄',
                zip: 200333
            }],
            rowlist:{
                in:[
                    {prop:'401',label:'会费收入',width:100,checked:false},
                    {prop:'402',label:'拨缴经费收入',width:100,checked:false},
                    {prop:'403',label:'上级补助收入',width:100,checked:false},
                    {prop:'404',label:'政府补助收入',width:100,checked:false},
                    {prop:'405',label:'行政补助收入',width:100,checked:false},
                    {prop:'406',label:'事业收入',width:100,checked:false},
                    {prop:'407',label:'投资收益',width:100,checked:false},
                    {prop:'408',label:'其他收入',width:100,checked:false}
                ],
                out:[
                    {prop:'501',label:'职工活动支出',width:100,checked:false},
                    {prop:'502',label:'维权支出',width:100,checked:false},
                    {prop:'503',label:'业务支出',width:100,checked:false},
                    {prop:'504',label:'行政支出',width:100,checked:false},
                    {prop:'505',label:'资本性支出',width:100,checked:false},
                    {prop:'506',label:'补助下级支出',width:100,checked:false},
                    {prop:'507',label:'事业支出',width:100,checked:false},
                    {prop:'508',label:'其他支出',width:100,checked:false},
                ]
            },
            rowSelected:{
                in:[],
                out:[]
            },
            rowSelect:false,
        }
    },
    methods:{
        getData(){

        },
        showRowSelect(){
            this.rowlist.out.map(row => {
                row.checked=false;
            })
            this.rowlist.in.map(row => {
                row.checked=false;
            })
            this.rowSelected.in.map((row)=>{
                this.rowlist.in.find((ar)=>{
                    if(ar.prop==row.prop){
                        row.checked=true;
                    }
                })
            })
            this.rowSelected.out.map((row)=>{
                this.rowlist.out.find((ar)=>{
                    if(ar.prop==row.prop){
                        row.checked=true;
                    }
                })
            })
            this.rowSelect=true;
        },
        updateRows(){
            this.rowSelected.in=[];
            this.rowSelected.out=[];
            this.rowlist.out.map(row => {
                if(row.checked){
                    this.rowSelected.out.push(row);
                }
            })
            this.rowlist.in.map(row => {
                if(row.checked){
                    this.rowSelected.in.push(row);
                }
            })
            this.rowSelect=false;
        }
    },
    components:{
        chart1
    }
}
</script>

<style lang="scss" scoped>
$borderBlue:#245c92;//深蓝色边框
$countType:#3cbddd; //本年累计数激活的背景色
$countColor:#05467e;//本年累计数未激活的背景色
.dataRank{
    color:#fff;
    padding:15px;
    .topEchartCon{
        width:100%;
        height:220px;
        text-align: center;
        &.close{
            display:none;
        }
        >div{
            float:left;
            height:100%;
        }
        .topEchart{
            width:84%;
            .chart1{
                position:relative;
                top:-50px;
            }
        }
        .lengend{
            width:16%;
            margin-top: 20px;
            .yearIcon{
                text-align:left;
                position:relative;
                margin:0 0 15px;
                >li{
                    padding-left:30px;
                    height: 30px;
                    line-height: 30px;
                    margin-bottom: 5px;
                    position:relative;
                    >i{
                        position:absolute;
                        left:0;
                        top: 7px;
                        width: 17px;
                        height: 17px;
                        background:red;
                    }
                }
                .imgIcon{
                    position: absolute;
                    top: 7px;
                    right: 35px;
                    width: 30px;
                    height: 30px;
                    padding: 0;
                    >img{
                        width:100%;
                        height:100%;
                    }
                }
            }
            .countType{
                text-align: center;
                overflow:hidden;
                height:27px;
                line-height:27px;
                >span{
                    float:left;
                    width:50%;
                    background:$countColor;
                    cursor:pointer;
                    color:#fff;
                }
                .active{
                    background:$countType;
                }
            }
            .inputContainer{
                margin-top:10px;
                background:transparent;
                
                >input{
                    background: transparent;
                    border-color:$borderBlue;
                    border-radius:5px;
                }
            }
        }
        &:after{
            clear:both;
            content:'';
            display:block;
        }
    }
    .listContainer{
        position:absolute;
        top:290px;
        left:15px;
        right:15px;
        bottom:15px;
        border: 1px solid $borderBlue;
        border-radius:5px;
        transition:all 0.2s linear;
        &.close{
             top:70px;
        }
        .pagination{
            margin:0;
            height:35px;
            line-height:35px;
            padding:0 20px;
            background:rgba(51,198,241,0.23);
            >div{
                >div{
                    display:inline-block;
                }
            }
        }
        .topArrow{
            position:absolute;
            left:49%;
            top:-10px;
            opacity:0.8;
            cursor:pointer;
            transform: rotate(-90deg);
            -moz-transform: rotate(-90deg);
            -webkit-transform: rotate(-90deg);
            -o-transform: rotate(-90deg);
            -ms-transform: rotate(-90deg);
        } 
        .topArrowclose{
            transform: rotate(90deg);
            -moz-transform: rotate(90deg);
            -webkit-transform: rotate(90deg);
            -o-transform: rotate(90deg);
            -ms-transform: rotate(90deg);
        }
        .tablelist{
            position:absolute;
            top:40px;
            left:5px;
            right:5px;
            bottom:5px;
            text-align: left;
        }   
        
    }
}
.tableRow{

}

.allRowslist{
    padding:70px;
    color:#fff;
     >img{
        position:absolute;
        left:0;
        top:0;
        z-index:-1;
        width:100%;
        height:100%;
    }
    .title{
        height:40px;
        line-height:40px;
        font-size:20px;
    }
    .button{
        text-align: right;
        margin-bottom:10px;
    }
    .listcontent{
        height:390px;
        overflow:auto;
        >li{
            overflow:hidden;
            height:30px;
            line-height: 30px;
            >div{
                float:left;
                width:33.33%;
                overflow:hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                border:1px solid #fff;
                border-bottom:0;
                &:first-of-type{
                    width:66.66%;
                    border-right:0;
                    text-align: left;
                    padding:0 10px;
                }
            }
            &:first-of-type>div:first-of-type{
                text-align:center;
            }
            &:last-of-type{
                border-bottom:1px solid #fff;
            }
        }
    }
}
</style>
<style lang="scss">
.dataRank{
    .el-table{
        background:none;
        height:100%;
        width:100%;
    }
    .el-table,
    .el-table thead{
        color:#ccc;
    }
    .el-table thead.is-group th,
    .el-table tr,
    .el-table th,
    .el-table td{
        background: none;
        text-align:center;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td {
        background: none;
    }
    .el-dialog__wrapper {
        text-align:center;
        &:after{
            vertical-align:middle;
            content:'';
            display:inline-block;
            width:0;
            height:100%;
        }
    }
} 
.dataDriverRank{
    margin-top:0 !important;
    width: 800px !important;
    display:inline-block;
    vertical-align:middle;
    height: 600px;
    background:none;
    position: relative;
    >div{
        padding:0;
    }
    .el-dialog__headerbtn {
        top: 4px;
        right: 6px;
        padding: 0;
        background: #000;
        width: 22px;
        height: 22px;
        line-height: 22px;
        color: #fff;
        border: none;
        outline: none;
        cursor: pointer;
        font-size: 20px;
        border-radius: 50%;
    }
}
</style>

