<template>

  <div class="container">
    <!--背景-->
    <div class="bac_panel">

      <div class="panel_bac">
        <div>
          <div>外部数据流程导入示意图</div>
          <div class="head_lc">
            <ul>
              <li>
                <img src="../../assets/img/lc_2.png" />
                <p>下载模板</p>
              </li>
              <li class="el-icon-right"
                  style="font-size: 2rem;color: #aaa;"></li>
              <li>
                <img src="../../assets/img/lc_1.png" />
                <p>导入Excel</p>
              </li>
              <li class="el-icon-right"
                  style="font-size: 2rem;color: #aaa;"></li>
              <li>
                <img src="../../assets/img/check.png" />
                <p>规范性检查</p>
              </li>
              <li class="el-icon-right"
                  style="font-size: 2rem;color: #aaa;"></li>
              <li>
                <img src="../../assets/img/lc_3.png" />
                <p>导入完毕</p>
              </li>
            </ul>
          </div>
          <div class="panel_circle "
               :class="{uploadMsg:loadstep==3}">
            <el-progress v-if="loadstep!=3&&percentNum>1"
                         style="position:relative;top:-5px;left:-5px"
                         type="circle"
                         :width="240"
                         :percentage="percentNum"></el-progress>

            <div v-if="loadstep!=3"
                 class="panel_circle_text">
              <div v-show="loadstep==0">
                <el-upload ref="uploadChairman"
                           class="circleupload"
                           drag
                           action=""
                           :show-file-list="false"
                           :before-upload="beforeUpload"
                           :http-request='uploadFileMethod'>
                  <img src="@/assets/img/shangchuan.png"
                       class="avatar-uploader-icon">
                  <div class="el-upload__text">拖拽或<em>点击上传</em></div>
                </el-upload>
              </div>
              <div class="stepImg"
                   v-show="loadstep==1">
                <img src="@/assets/img/shangchuanzhong.png">
                <p>{{percentNum}}%</p>
              </div>
              <div class="stepImg "
                   v-show="loadstep==2"
                   @click="loadstep=0;percentNum=0;fileErrMsg = {IngoreMsg: '',ErrMsg: ''}">
                <img src="@/assets/img/wancheng.png">
                <p>{{percentNum}}%</p>

              </div>
            </div>
            <div v-if="loadstep == 3"
                 class="msgCon">
              <div v-show="fileErrMsg.ErrMsg.length>0||fileErrMsg.IngoreMsg.length>0||fileErrMsg.AddMsg.length>0||fileSuccessMsg"
                   class="fileCon">
                <ul class="fileErrMsg"
                    v-show="fileErrMsg.ErrMsg.length>0">
                  <li>不可跳过错误:</li>
                  <li v-for="(item,index) of fileErrMsg.ErrMsg"
                      :key="index">{{item}}</li>
                </ul>
                <ul class="fileAddMsg"
                    v-show="fileErrMsg.AddMsg.length>0">
                  <li>基础数据错误:</li>
                  <li v-for="(item,index) of fileErrMsg.AddMsg"
                      :key="index">{{item}}</li>
                </ul>
                <ul class="fileIngoreMsg"
                    v-show="fileErrMsg.IngoreMsg.length>0">
                  <li>可跳过错误:</li>
                  <li v-for="(item2,index2) of fileErrMsg.IngoreMsg"
                      :key="index2">{{item2}}</li>
                </ul>
                <ul class="fileSuccessMsg">
                  <li>{{fileSuccessMsg}}</li>
                </ul>
              </div>
              <div class="fileBtn">
                <div class="btn"
                     @click.stop="fileErrHandle()">跳过</div>
                <div class="btn"
                     @click.stop="fileErrHandle('cover')">覆盖</div>
                <div class="btn"
                     @click.stop="fileErrHandle('add')">添加</div>
                <div class="btn"
                     @click.stop="loadstep=0;percentNum=0;fileErrMsg = {IngoreMsg: '',ErrMsg: '',AddMsg:''}">重新上传</div>

              </div>

            </div>
          </div>
          <div style="position: absolute;bottom: 30px;width: 100%;text-align: center;color: #888;">
            <p class="loadBtn"> <a :href="modelFileUrl"
                 target="_blank">下载模板</a> </p>
            <p>备注：只能上传xls格式文件，且大小不能超过2MB，如果超过最大阈值，请将表格分析后多次导入</p>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import httpConfig from '@/util/ajaxConfig'  //自定义ajax头部配置*****
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
export default {
  name: "index",

  data () {
    return {
      filelist: [],//文件列表
      loadstep: 0,
      percentNum: 0,
      haveMsg: false,
      fileErrMsg: {
        IngoreMsg: [],
        ErrMsg: [],
        AddMsg: []
      },
      fileSuccessMsg: '',
      modelFileUrl: ''
    }
  },
  //计算
  computed: {
    ...mapState({
      userid: state => state.user.userid,
      orgid: state => state.user.orgid
    }),
    picUrl: function () {
      return httpConfig.baseurl;
    }
  },
  mounted () {
    let base = httpConfig.getAxiosBaseConfigUncontrol();
    this.modelFileUrl = base.baseURL + "/File/GetExportFile?filePath=template&fileName=外部数据导入模板.xls";
  },
  methods: {
    ...mapActions({
      uploadFile: 'uploadFile/Excelupload'
    }),
    //上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      var isRightType = (file.type === 'application/vnd.ms-excel');
      /* if (!isRightType) {
           this.$message.error('请选择Excel文档!');
           return false
       }
       if (!isLt2M) {
           this.$message.error('上传文件大小不能超过 2MB!');
           return false
       }*/
      this.loadstep = 1;
      /*  
      */
    },
    uploadFileMethod (param) {
      this.fileErrMsg = {
        IngoreMsg: '',
        ErrMsg: ''
      }
      this.haveMsg = '',
        this.fileSuccessMsg = ''
      let fileObject = param.file;
      let formData = new FormData();
      formData.append('RelPhid', '0')
      formData.append('BTable', 'gcw3_voucher_mst')
      /* formData.append('id', this.orgForm.PhId)*/
      formData.append("file", fileObject);
      let timer = () => {
        setTimeout(() => {
          this.percentNum = this.percentNum + Math.floor(Math.random() * 5);
          if (this.percentNum < 100) { timer() }
          else {
            this.percentNum = 100;
            this.loadstep = 2
            if (this.haveMsg) {
              setTimeout(() => {
                this.loadstep = 3
                this.$message({ showClose: true, message: this.haveMsg, type: 'error' });

              }, 800)
            }
            return
          };
        }, Math.random() * 150)
      }
      timer()
      this.uploadFile(formData).then(res => {
        if (res.Status === 'error') {
          this.$msgBox.error(res.Msg);
          return
        }
        //回传的上传临时文件
        if (res.Data) {

          // this.percentNum = 100

          this.filelist = res.Data;
          this.ExcelValidMsg(res.Data);
          // var model=res.Data
          // var url_=me.picUrl

          // for (var i = 0; i < model.length; i++){
          //      me.curimgList.push(model[i]);
          // }
          // this.$emit("uploadimg", res.Data);
        }

      }).catch(error => {
        console.log(error);
        this.$message({ showClose: true, message: '上传附件失败', type: 'error' })
      })




    },
    // uploadfile(item) {
    //             //this.imglist.push(item);
    //             //console.log(this.filelist,item);
    //             this.filelist=item;
    //             if(item){
    //                 this.ExcelValidMsg(item);    
    //             }
    //             //console.log(item,this.filelist)
    //         },
    //校验excel文件中凭证信息***********
    ExcelValidMsg (param) {
      var data = {
        fileName: param[0].BUrlPath,
        orgid: this.orgid,
        orgcode: this.$store.state.user.orgcode,
        uyear: new Date().getFullYear(),
        isIn: 1,
        makePerson: this.$store.state.user.username,
        dealwithPNo: 0 //重复凭证字号处理方式: 0 禁止, 1 跳过, 2 覆盖
      }
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();

      // let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      loading.setText('文件正在校验,大约需要3分钟....')
      axios.create(base).get('/PVoucherMst/GetImportVoucherListFromExcelValidMsg', { params: data, headers: new_header })
        .then(res => {
          loading.close();
          let dataJ = JSON.parse(res.data);
          if (dataJ.Status == 'error') {

            if (dataJ.Data) {
              if (dataJ.Data.ErrMsg || dataJ.Data.IngoreMsg) {
                this.haveMsg = dataJ.Msg
              }
              this.fileErrMsg = {
                ErrMsg: dataJ.Data.ErrMsg,
                IngoreMsg: dataJ.Data.IngoreMsg,
                AddMsg: dataJ.Data.AddMsg,
              }
            } else {
              this.haveMsg = dataJ.Msg
              this.fileErrMsg = {
                ErrMsg: [dataJ.Msg],
                IngoreMsg: [],
                AddMsg: []
              }
            }
            //进度条已经转完,请求还没回来时,手动改为状态3
            if (this.percentNum = 100 && this.haveMsg) {
              this.loadstep = 3
              this.$message({ showClose: true, message: this.haveMsg, type: 'error' });
            }

          } else {
            this.GetImportVoucherListFromExcel(data);
          }
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => {
          loading.close();
          this.$message({ showClose: true, message: err, type: 'error' });
        })
    },

    //忽略 或者 覆盖选项****************
    fileErrHandle (str) {

      if (this.fileErrMsg.ErrMsg.length > 0) {
        this.$msgBox.show('请先处理不可跳过的错误,并重新上传文件!')
        return;
      }
      if (this.fileErrMsg.AddMsg.length > 0 && str != 'add') {
        this.$msgBox.show('有基础数据错误,请查看!点击添加按钮可以自动添加并导入!')
        return;
      }
      //console.log(this.filelist)
      var data = {
        fileName: this.filelist[0].BUrlPath,
        orgid: this.orgid,
        orgcode: this.$store.state.user.orgcode,
        uyear: new Date().getFullYear(),
        isIn: 1,
        makePerson: this.$store.state.user.username,

        dealwithPNo: 0 //重复凭证字号处理方式: 0 禁止, 1 跳过, 2 覆盖
      }
      if (str == 'add') {
        data.dealwithPNo = 3;
      } else if (str == 'cover') {
        data.dealwithPNo = 2;
      } else {
        data.dealwithPNo = 1;
      }
      this.GetImportVoucherListFromExcel(data);
    },
    //excel文件导入**************
    GetImportVoucherListFromExcel (data) {
      let baseheader = httpConfig.getHeaderConfig(this.dbname);
      let base = httpConfig.getAxiosBaseConfigUncontrol();
      //let config_header = { "Content-Type": "multipart/form-data" };
      var new_header = Object.assign({}, baseheader);
      const loading = this.$loading();
      data.isIn = 1;
      loading.setText('文件正在导入,大约需要3分钟....')
      axios.create(base).get('PVoucherMst/GetImportVoucherListFromExcel', { params: data, headers: new_header })
        .then(res => {
          loading.close();
          console.log(res)
          if (JSON.parse(res.data).Status == 'success') {
            this.$msgBox.show(JSON.parse(res.data).Msg)

            this.fileErrMsg = {
              IngoreMsg: [],
              ErrMsg: [],
              AddMsg: []
            }
            this.fileSuccessMsg = JSON.parse(res.data).Msg;

          } else {
            this.$msgBox.error(JSON.parse(res.data).Msg)
            loadstep = 0;
            percentNum = 0;
            fileErrMsg = { IngoreMsg: '', ErrMsg: '', AddMsg: '' }

          }
        }, err => {
          // console.log(err);
          loading.close();
        })
        .catch(err => {
          loading.close();
          this.$message({ showClose: true, message: '文件导入失败了!', type: 'error' });
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  margin-bottom: 50px;
  height: 100%;
  position: relative;
}
.bac_panel {
  background-color: #00a6ee;
  height: 100%;
  width: 100%;
  padding: 50px 40px;
  overflow: hidden;
  &:before {
    content: "";
    background-color: #f9f9f9;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20%;
  }
  &:after {
    content: "";
    background-color: #f9f9f9;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20%;
    left: 0;
    z-index: 0;
  }

  .panel_bac {
    background-color: #00b8ee;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 15px 0px #afafaf;
    z-index: 1;
    &:before {
      content: "";
      background-color: #fff;
      position: absolute;
      top: 0;
      width: 100%;
      height: 40%;
      z-index: -1;
    }
    &:after {
      content: "";
      background-color: #fff;
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 40%;
      z-index: -1;
    }
    > div {
      text-align: center;
      > div:nth-of-type(1) {
        font-size: 1.7rem;
        color: #00b8ee;
      }
      > .head_lc {
        margin-top: 15px;
        > ul li {
          display: inline-block;
          vertical-align: middle;
          min-width: 100px;
          img {
            width: 60px;
          }
        }
      }
      > .panel_circle {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 270px;
        height: 270px;
        overflow: hidden;
        border-radius: 50%;
        box-shadow: 0 0 10px 2px #afafaf;
        background-color: #fbfbfb;
        margin: -125px;
        padding: 20px;
        transition: all 0.3s linear;
        .panel_circle_text {
          position: absolute;
          top: 25px;
          left: 25px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 0 6px 1px #e0e0e0;
          > div {
            height: 100%;
            width: 100%;
            background-color: #fff;
            text-align: center;

            > .circleupload {
              height: 100%;
              width: 100%;

              .el-upload__text {
                margin-top: 10px;
              }
            }
          }
          .stepImg {
            padding: 50px;
            img {
              width: 100px;
            }
            p {
              font-size: 2rem;
              font-weight: bolder;
            }
          }
        }
      }
      > .uploadMsg {
        border-radius: 5px;
        width: 400px;
        height: 300px;
        margin: -150px -200px;
      }
    }
  }
  .msgCon {
    margin: 0 auto;
    overflow: hidden;
    width: 100%;
    text-align: left;
    .fileCon {
      float: left;
      width: 100%;
      height: 230px;
      overflow-y: auto;
      border: 1px dotted #ddd;
      border-radius: 4px;
      padding: 10px;

      > .fileIngoreMsg {
        color: rgb(45, 142, 221);
      }
      > .fileErrMsg {
        color: rgb(255, 0, 0);
      }
    }
    .fileBtn {
      > div {
        width: 70px;
        margin-right: 15px;
        margin-top: 10px;
        display: inline-block;
      }
    }
    .fileAddMsg {
      color: #f59d14;
    }
    .fileSuccessMsg {
      color: #6aca25;
    }
  }
}
.loadBtn {
  text-align: center;
  > a {
    border: 1px solid #00b8ee;
    border-radius: 3px;
    display: inline-block;
    width: 110px;
    height: 30px;
    line-height: 30px;
    margin: 10px 0;
  }
}
</style>
<style>
.panel_bac .el-progress-circle {
  transform: rotate(180deg);
}
.panel_bac .el-progress-circle svg path {
  stroke-width: 4px;
}
.panel_bac .el-progress-circle svg path:nth-of-type(1) {
  stroke-opacity: 0;
}
.circleupload .el-upload--text,
.circleupload .el-upload-dragger {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 0;
}
.circleupload .el-upload-dragger {
  padding: 30px;
}
.circleupload .el-upload-dragger img {
  width: 150px;
}
</style>
