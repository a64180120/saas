<template>
    <section>
        <div class="staff_header">
            <p><span></span><span>房屋建筑面积</span></p>
            <ul>
                <li>
                    <span>房屋建筑面积</span>
                    <span>
                        <el-input-number v-model="areaList.HouseSumArea" @focus="handleFocus" @change="handleChange" :controls="false" :min="0" size="mini" :step="1" :precision="2"></el-input-number>
                    </span>
                    <span>平方米</span>
                </li>
                <li>
                    <span>其中：有工会产权的自由面积</span>
                    <span>
                        <el-input-number  v-model="areaList.HouseFreeArea" @focus="handleFocus" @change="handleChange" :controls="false" :min="0" size="mini" :step="1" :precision="2"></el-input-number>
                    </span>
                    <span>平方米</span>
                </li>
            </ul>
        </div>
        <div class="staff_header">
            <p><span></span><span>土地占有面积</span></p>
            <ul>
                <li>
                    <span>土地占有面积</span>
                    <span>
                        <el-input-number v-model="areaList.LandSumArea" @focus="handleFocus" @change="handleChange" :controls="false" :min="0" size="mini" :step="1" :precision="2"></el-input-number>
                    </span>
                    <span>平方米</span>
                </li>
                <li>
                    <span>其中：有工会产权的自由面积</span>
                    <span>
                        <el-input-number  v-model="areaList.LandFreeArea" @focus="handleFocus" @change="handleChange" :controls="false" :min="0" size="mini" :step="1" :precision="2"></el-input-number>
                    </span>
                    <span>平方米</span>
                </li>
            </ul>
        </div>
        <!-- 弹窗*****message:信息******delay:延迟毫秒 -->
        <saas-msg :message="saasMessage.message" :delay="saasMessage.delay" :visible.sync="saasMessage.visible" ></saas-msg>
    </section>

</template>

<script>
    import saasMsg from '@/components/message/message'
    export default {
        name: "unitArea",
        props:{
            save:{
                type:Boolean,
                default(){
                    return false
                }
            },
            unitProps:{
                type:Object,
                default(){
                    return {}
                }
            }
        },
        data(){
            return{
                areaList:{
                    'HouseSumArea': 0,
                    'HouseFreeArea': 0,
                    'LandSumArea': 0,
                    'LandFreeArea': 0,
                },
                saasMessage:{
                    visible:false,  //消息弹出框*******
                    message:'', //消息主体内容**************
                    delay:0
                },

            }
        },
        components:{saasMsg},
        watch:{
            save:function(val){
                if(val){
                    this.$emit('getUnit',this.areaList)
                }
            },
            unitProps:function(val){
                if(val){
                    this.areaList=val;
                }
            }
        },
        methods:{
            handleFocus:function(val){
                if(val.target.value=='0.00'){
                    val.target.value='';
                }
            },
            handleChange:function(){
                this.$nextTick(()=>{
                    if(this.areaList.HouseFreeArea>this.areaList.HouseSumArea){
                        this.areaList.HouseFreeArea=this.areaList.HouseSumArea;
                        this.saasMessage={
                            message:'当前输入值不允许超过房屋建筑面积值，已自动为您修改为可填写最大值，如需修改，可手动调整',
                            delay:5000,
                            visible:true
                        };
                    }
                    if(this.areaList.LandFreeArea>this.areaList.LandSumArea){
                        this.areaList.LandFreeArea=this.areaList.LandSumArea;
                        this.saasMessage={
                            message:'当前输入值不允许超过土地占地面积值，已自动为您修改为可填写最大值，如需修改，可手动调整',
                            delay:5000,
                            visible:true
                        };
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .staff_header{
        >p{
            height: auto;
            margin-bottom: 10px;
            >span:nth-of-type(1){
                display: inline-block;
                width: 5px;
                height: 20px;
                background-color: #ff7c2f;
                vertical-align: bottom;
            }
            >span:nth-of-type(2){
                margin-left: 15px;
                font-weight: bolder;
            }
        }
        >ul{
            height: 48px;
            line-height: 30px;
            >li{
                display: inline-block;
                float: left;
                margin-right: 15px;
            }
        }
    }
    .staff_header input{
        border: none;
    }
</style>
