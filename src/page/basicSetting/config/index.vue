<template>
  <div class="config">
      <div class="manageContent">
          <div class="unionState">
              <ul class="flexPublic handle">
                  <a @click.prevent="keepConfig(true)"><li>保存</li></a>
                  <a @click.prevent="keepConfig(false)"><li>取消</li></a>
              </ul>
          </div>
          <div class="auxiliary manageContent">
              <div class="auxiliaryNav">
                  <p class="auxiliaryNavTitle">参数内容</p>
                  <ul>
                      <li @click.stop="navTabTurn(item.name)" :class="{active:navActive==item.name}" v-for="(item,index) of navTab" :key="index">{{item.name}}</li>
                  </ul>
              </div>
              <ul class="handle" v-show="navActive=='凭证处理'">
                  <li v-for="(item,index) of handle" :key="index">
                      <p>{{item.title}}</p>
                      <div><label ><input :name="item.name" v-model="item.val" value="是" type="radio">是</label></div>
                      <div><label ><input :name="item.name" v-model="item.val" value="否"  type="radio">否</label></div>
                  </li>
              </ul>
              <ul class="print"  v-show="navActive=='凭证打印'">
                  <li v-for="(item,index) of print" :key="index">
                      <p>{{item.title}}</p>
                      <div><label ><input :name="item.name" v-model="item.val" value="凭证保存时" type="radio">凭证保存时</label></div>
                      <div><label ><input :name="item.name" v-model="item.val" value="凭证审核时"  type="radio">凭证审核时</label></div>
                      <div><label ><input :name="item.name" v-model="item.val" value="手动打印"  type="radio">手动打印</label></div>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: "index",
      data(){
        return {
            navActive:'凭证处理',
            handle:[
                {title:'凭证是否需要审批',name:'check',val:'是'},
                {title:'制单和审核是否允许为同一人',name:'make',val:'是'}
            ],
            print:[
                {title:'凭证立即打印',name:'print',val:'手动打印'},
            ],
            navTab:[
                {name:'凭证处理'},
                {name:'凭证打印'}
            ],

        }

      },
      methods: {
          navTabTurn(item) {
              this.navActive = item;
          },
          keepConfig(bool){
              if(bool){
                  console.log(this.handle,this.print)
              }else{
                  var route=this.$route;
                  this.$store.commit("tagNav/removeTagNav", route);
                  this.$router.push({path:'/home'})
              }
          }
      }
  }
</script>

<style lang="scss" scoped>
    .auxiliary{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .auxiliaryNav{
        width:15%;
        min-width:138px;
        margin-top: 10px;
        padding-right:5px;
    }
    .auxiliaryNavTitle{
        background:#83c350;
        color:#fff;
        height:40px;
        line-height: 40px;
        text-align: center;
        font-size: 15px;
    }
    .auxiliaryNav>ul{
        padding:10px 20px;
    }
    .auxiliaryNav>ul>li{
        width:90%;
        margin:auto;
        margin-bottom:10px;
        min-width: 100px;
        height:30px;
        line-height: 30px;
        text-align: center;
        border:1px solid #ff9900;
        border-radius: 5px;
    }
    .auxiliaryNav>ul>li:hover{
        background: #ff9900;
        color:#fff;
        cursor:pointer;
    }
    .auxiliaryNav>ul>li.active{
        background: #ff9900;
        color:#fff;
    }
    .unionState>ul{
        justify-content: flex-end;
    }
    .auxiliary{
        justify-content: flex-start;
    }
    .auxiliary>ul{
        margin-top: 10px;
        margin-left: 20px;
        padding:10px;
        >li{
            div{
                margin:0 0  10px  40px;
            }
            >p{
                margin: 0 0 10px 0;
                padding-left:20px;
                position:relative;
                &:before{
                    content:"";
                    position: absolute;
                    width:10px;
                    height:100%;
                    background: #ff9900;
                    left: 0;
                }
            }
        }
    }
</style>
