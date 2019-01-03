<template>
  <div class="sys-page">
    <div class="container">
            <div class="handle-box">
                <el-row>
                    <el-col :span="24">
                        <el-button type="info" icon="el-icon-lx-add" size="small" class="handle-del mr10" 
                                    @click="preview">预览
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-edit" size="small" class="handle-del mr10"
                                    @click="onSubmit">保存
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-delete" size="small" class="handle-del mr10"
                                   @click="publish">发布
                        </el-button>
                        <el-button type="info" icon="el-icon-lx-redpacket_fill" size="small" class="handle-del mr10"
                                   @click="cancel">取消
                        </el-button>
                    </el-col>
                </el-row>
            </div>
              <div class="form">
                <el-form 
                ref="form" 
                :model="form" 
                
                label-width="80px">
                    <el-form-item label="标题">
                        <el-input v-model="form.Title"></el-input>
                    </el-form-item>
                    <el-form-item label="内容">
                        <!-- <el-input v-model="form.Content"></el-input> -->
                         <wangeditor :catchData="catchData"></wangeditor>
                    </el-form-item>
                    <el-form-item label="信息类别">
                        <el-select v-model="form.PhIdType" placeholder="请选择信息类别">
                            <el-option v-for="item in articleType" :key="item.PhId" :label="item.Name" :value="item.PhId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="信息来源">
                        <el-input v-model="form.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="制度级别">
                        <el-select v-model="form.LevelType" placeholder="请选择制度级别">
                            <el-option v-for="item in LevelData" :key="item.value" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否置顶">
                        <el-switch v-model="form.Ontop"></el-switch>
                    </el-form-item>
                    <el-form-item label="封面图片">
                        <!-- <el-input v-model="form.Picpath"></el-input> -->
                        <el-upload
                            ref="newsPic"
                            class="avatar-uploader"
                            action=""
                            :show-file-list="false"
                            :before-upload="beforeUploadNews"
                            :http-request='uploadFileMethod'>
                            <img v-if="form.Picpath" :src="picUrl+form.Picpath"
                                    class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="附件上传">
                        
                    </el-form-item>
                </el-form>
            </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import wangeditor from '@/components//editorElem'

//文章新增、编辑
export default {
  name: "Article_add",
  components: { wangeditor },
  data() {
    return {
        form:{
            PhId:0,         //主键
            PhIdType : '',   //信息类别
            Title:'',       //标题
            Content:'',     //文本
            Name:'',        //信息来源
            LevelType:'',    //制度级别
            Ontop:0,        //是否置顶
            Picpath:'',     //封面图片
            Attachment:[]   //附件
        },
        LevelData:[
            { name:'国家',value:1 },
            { name:'省级',value:2 },
            { name:'市级',value:3 }
        ],
        articleType:[]
    }
  },
  created() {
      this.getTypeData()
  },
  //加载数据
  mounted:function(){
      this.init();
  },
  //计算
  computed: {
      ...mapState({
          userid: state => state.user.userid,
          username: state => state.user.username,
          orgid: state => state.user.orgid
      }),
      picUrl: function () {
        return httpConfig.baseurl;
      }
  },
  methods: {
      //数据初始化
      init(){
          var type=this.$route.query.type;
          var phid=this.$route.query.phid;
          if(type==='add'){
              //alert(type)
          }else if(type==='edit'){
               //alert(type)
          }
      },
      //获取文章类别数据
      getTypeData(){
            this.$axios.get('/SysNews/GetSysNewsTypeList',{ params:'' })
            .then(res=>{

                if(res.Status==='error'){
                    this.$message.error(res.Msg);
                    return
                }

                this.articleType=res;

            }).catch(err=>{
                console.log(err)
                this.$message({ showClose: true,message: "辅助项获取错误", type: "error"});
            })
      },
      /**
       * 预览按钮事件
       */
      preview(){

      },
      /**
       * 保存事件
       */
      onSubmit(){

      },
      /**
       * 发布事件
       */
      publish(){

      },
      /**
       * 取消事件
       */
      cancel(){
          //关闭移除当前的TagNav
          this.$store.commit("tagNav/removeTagNav", this.$route);
          //跳转列表的首页
          this.$router.push({path: "/admin/article"});
      },
      //在这里接受子组件传过来的参数，赋值给data里的参数
      catchData(value){
        this.form.Content=value      
      },
      beforeUploadNews(){

      },
      uploadFileMethod(){
          
      }
  }
}
</script>
<!--style标签上添加scoped属性 表示它的样式作用于当下的模块-->
<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
</style>
<style>
    .avatar-uploader {
        position: absolute;
        z-index: 1;
        right: 25px;
        top: -20px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader .el-upload--text {
        width: 80px;
        height: 80px;
    }

    .avatar-uploader-icon {
        font-size: 20px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
    }

    /* .avatar {
        width: 80px;
        height: 80px;
        display: block;
    }

    .orgform .el-form-item__label {
        background: #6acccb;
    }

    .orgform .el-form-item {
        margin-bottom: 2px;
    }

    .pictrueUpload {
        width: 100%;
        height: 100%;
    }
    .el-form-item.is-required .el-form-item__label:before {
        content: '*';
        color:#d8281d;
        margin-right: 4px;
        font-size: 15px;
    } */
</style>
