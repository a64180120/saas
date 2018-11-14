<template>
    <div class="newAdd">
      <div class="newAddContent">
        <div class="newAddTitle flexPublic">
          <span>科目新增</span>
          <span></span>
        </div>
        <ul class="contentItem">
          <li>
            <div>科目编码</div>
            <div></div>
          </li>
          <li>
            <div>科目名称</div>
            <div class="inputContainer"></div>
          </li>
          <li>
            <div>科目类别</div>
            <div class="inputContainer"> </div>
          </li>
          <li>
            <div>余额方向</div>
            <div>
              <label for=""><input type="radio" name="line">借方</label>
              <label for=""><input type="radio" name="line">贷方</label>
              <label for=""><input type="radio" name="line">借/贷</label>
            </div>
          </li>
          <li>
            <div>辅助核算</div>
            <div>
              <label for=""><input type="checkbox">部门</label>
              <label for=""><input type="checkbox">项目</label>
              <label for=""><input type="checkbox">往来个人</label>
              <label for=""><input type="checkbox">往来单位</label>
            </div>
          </li>
        </ul>
        <div>
          <span>保存</span>
          <span>取消</span>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "new-add"
    }
</script>

<style lang="scss" scoped>
  .newAdd{
    width:100%;
    height:100%;
    position:fixed;
    top:0;
    background: rgba(0,0,0,0.4);
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
  }
  .newAddContent{
    background: #fff;
    overflow: hidden;
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
      padding:10px 20px;
      font-size: 15px;
      li{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        height:20px;
        margin-bottom: 10px;
        div{
          height:100%;
          margin-right:5px;
          &:nth-of-type(2){
            width:82%;
            border:1px solid #ccc;
          }
        }
      }
    }
  }

</style>
