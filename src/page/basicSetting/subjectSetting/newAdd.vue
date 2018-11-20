<template>
    <div class="newAdd">
      <div class="newAddContent">
        <div class="newAddTitle flexPublic">
          <span>科目新增</span>
          <span @click.stop="newAdd(false)"></span>
        </div>
        <ul class="contentItem">
          <li>
              <div>科目编码</div>
              <div class="flexPublic">
                <div>401</div>
                <div class="inputContainer">
                    <input type="text" v-model="KCode">
                </div>
              </div>
          </li>
          <li>
            <div>科目名称</div>
            <div class="inputContainer">
                <input placeholder="必填" type="text" v-model="KName">
            </div>
          </li>
          <li>
            <div>科目类别</div>
            <div class="selectContainer">
                <select v-model="KType">
                    <option value="0">必填</option>
                    <option value="资产">资产</option>
                    <option value="负债">负债</option>
                    <option value="净资产">净资产</option>
                    <option value="收入">收入</option>
                    <option value="支出">支出</option>
                </select>
            </div>
          </li>
          <li>
            <div>余额方向</div>
            <div class="itemRadio">
              <label ><input type="radio" name="line" v-model="KBalanceType" value="借方" >借方</label>
              <label><input type="radio" name="line" v-model="KBalanceType" value="贷方">贷方</label>
              <label ><input type="radio" name="line"  v-model="KBalanceType" value="借/贷">借/贷</label>
            </div>
          </li>
          <li>
            <div>辅助核算</div>
            <div class="itemRadio">
              <label ><input type="checkbox" v-model="KAmountCheck" value="部门">部门</label>
              <label ><input type="checkbox" v-model="KAmountCheck" value="项目">项目</label>
              <label><input type="checkbox"  v-model="KAmountCheck" value="个人">往来个人</label>
              <label ><input type="checkbox" v-model="KAmountCheck" value="单位">往来单位</label>
            </div>
          </li>
        </ul>
        <div class="itemBtnCon">
          <div @click.stop="newAdd(this.PhIdList.name)">保存</div>
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
            this.initMsg();
            console.log(this.PhIdList.data)
        },
        data(){
            return{
                KCode:'',
                KName:'',
                KType:0,
                KBalanceType:'',
                KAmountCheck:''
            }
        },
        methods:{
            newAdd(name){
                if(name=='add'){
                    console.log(this.KCode,this.KName,this.KType,this.KBalanceType,this.check)
                    alert('add:success')
                }else if(name=='update'){
                    console.log(this.KCode,this.KName,this.KType,this.KBalanceType,this.check)
                    alert('update:success')
                }
                this.$emit('add-click',false);
            },
            initMsg(){
                this.KCode= this.PhIdList.data[0].KCode;
                this.KName= this.PhIdList.data[0].KName;
                this.KType= this.PhIdList.data[0].KType;
                this.KBalanceType= this.PhIdList.data[0].KBalanceType;
                this.KAmountCheck= this.PhIdList.data[0].KAmountCheck;
            }
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
          &:nth-of-type(2){
            width:82%;
          }
        }
          &:first-of-type>div:nth-of-type(2){
              border:1px solid #ccc;
              div:first-of-type{
                  text-align: center;
                  width:20%;
                  background: #ccc;
              }
              div:nth-of-type(2){
                  width:80%;
                  input{
                      border:0;
                      color:#ff9900;
                      padding-left:5px;
                  }
              }
          }
          &:nth-of-type(4)>div,&:nth-of-type(5)>div{
              border:0;
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
