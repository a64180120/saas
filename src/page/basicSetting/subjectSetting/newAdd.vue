<template>
    <div class="newAdd">
      <div class="newAddContent">
        <div class="newAddTitle flexPublic">
          <span>科目新增</span>
          <span @click.stop="addCancle"></span>
        </div>
        <ul class="contentItem">
          <li>
              <div>科目编码</div>
              <div class="flexPublic">
                <div>401</div>
                <div class="inputContainer">
                    <input type="text" >
                </div>
              </div>
          </li>
          <li>
            <div>科目名称</div>
            <div class="inputContainer">
                <input placeholder="必填" type="text">
            </div>
          </li>
          <li>
            <div>科目类别</div>
            <div class="selectContainer">
                <select>
                    <option value="必填">必填</option>
                </select>
            </div>
          </li>
          <li>
            <div>余额方向</div>
            <div class="itemRadio">
              <label for=""><input type="radio" name="line">借方</label>
              <label for=""><input type="radio" name="line">贷方</label>
              <label for=""><input type="radio" name="line">借/贷</label>
            </div>
          </li>
          <li>
            <div>辅助核算</div>
            <div class="itemRadio">
              <label for=""><input type="checkbox">部门</label>
              <label for=""><input type="checkbox">项目</label>
              <label for=""><input type="checkbox">往来个人</label>
              <label for=""><input type="checkbox">往来单位</label>
            </div>
          </li>
        </ul>
        <div class="itemBtnCon">
          <div @click.stop="newAdd">保存</div>
          <div @click.stop="addCancle">取消</div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "new-add",
        methods:{
            newAdd(){
            },
            addCancle(){
               this.$router.push({path:'/setting/subject'});
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
    top:250px;
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
