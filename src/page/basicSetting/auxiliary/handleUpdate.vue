<template>
    <div class="newAdd">
        <div class="newAddContent">
            <div class="newAddTitle flexPublic">
                <span>辅助选项{{handleName[PhIdList.name]}}</span>
                <span @click.stop="newAdd()"></span>
            </div>
            <ul class="contentItem">
                <li>
                    <div>辅助项编码</div>
                    <div>{{formData.BaseCode}}</div>
                </li>
                <li>
                    <div>辅助项名称</div>
                    <div class="inputContainer">
                        <input placeholder="必填" type="text" v-model="formData.BaseName">
                    </div>
                </li>
                <li>
                    <div>辅助项状态</div>
                    <div class="itemRadio">
                        <label ><input type="radio" name="line" v-model="formData.EnabledMark" value="1" >启用</label>
                        <label><input type="radio" name="line" v-model="formData.EnabledMark" value="0">停用</label>
                    </div>
                </li>
            </ul>
            <div class="itemBtnCon">
                <div @click.stop="newAdd(PhIdList.name)">保存</div>
                <div @click.stop="newAdd()">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "new-add",
        props:{
            PhIdList:{}
        },
        created(){
        },
        mounted(){
            if(this.PhIdList.name=='add'){
                this.formData.BaseCode='001';//需要动态获取新增code*****
            }else{
                this.formData=this.PhIdList.data;
            }
        },
        data(){
            return{
                formData:{PhId:'',BaseCode:'',BaseName:'',EnabledMark:0},
                handleName:{add:'新增',update:'修改'},
            }
        },
        methods:{
            newAdd(name){
                if(name=='add'){
                    console.log(this.formData)
                    alert('add:success')
                }else if(name=='update'){
                    console.log(this.formData)
                    alert('update:success')
                }
                this.$emit('add-click',false);
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
        left:35%;
        top:20%;
        width:500px;
        .newAddTitle{
            background: #3e8cbc;
            border-radius: 8px;
            height:40px;
            line-height: 40px;
            width:500px;
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
            padding:10px 20px 0 20px;
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
                        min-width:90px;
                    }
                    &:nth-of-type(2){
                         width:82%;
                     }
                }
                &:first-of-type>div:nth-of-type(2){
                     border:1px solid #ccc;
                     background: #ccc;
                    color:#ff9900;
                     padding:0 10px;
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
</style>
