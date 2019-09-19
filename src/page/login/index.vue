<template>
    <div class="sys-login log">
        <div class="register_head">
            <template v-if="settingInfo.platform.logo">
                <img :src="picUrl+settingInfo.platform.logo" />
            </template>
            <template v-else>
                <img src="../../assets/images/register/register_company_log.png">
            </template>
            <div :title="settingInfo.platform.platformname" class="logo_box platformname">
                {{settingInfo.platform.platformname}}
            </div>
            <div class="telPhone"><img src="../../assets/images/finance/SAAS-03.png"><span>{{setting.phone}}</span></div>
            <!--<div class="telPhone"><img src="../../assets/images/finance/SAAS-03.png"><span>0731-84878190</span></div>-->
        </div>
        <div class="login-area">
            <div class="form-area">
                <div class="form-group" style="padding-top: 30px;">
                    <div class="form-box">
                        <!--账号登录界面-->
                        <div :style="{'display':selectArea=='ordinaryLogin'?'block':'none'}">
                            <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px">
                                <el-form-item prop="name">
                                    <img src="@/assets/images/register/1.png">
                                    <el-input v-model="loginForm.name" type="text" placeholder="手机号码/账号" @blur.prevent="changeAccount()"></el-input>
                                    <div v-if="ischange_db" class="selfBtn AreaCode"  @click="dbbaseDialogVisible = true">
                                        <img style="position: initial;" src="@/assets/images/register/dz.png">
                                    </div>
                                </el-form-item>
                                <el-form-item prop="password">
                                    <img src="@/assets/images/register/2.png">
                                    <el-input v-model="loginForm.password" type="password" @blur='getOrgByUser' placeholder="密码" ></el-input>
                                </el-form-item>
                                <el-form-item v-if="isOrganize" prop="orgid"><!--v-if="isOrganize"-->
                                    <img src="@/assets/images/register/3.png">
                                    <el-select v-model="loginForm.orgid" filterable placeholder="请选择组织">
                                        <el-option v-for="item in options"
                                                   :key="item.PhId"
                                                   :label="item.OrgName"
                                                   :value="item.PhId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="verifyCode">
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="loginForm.verifyCode" type="text"  placeholder="请输入验证码（必填）" @keyup.enter.native="submitForm('loginForm')"></el-input>
                                    <div :disabled="disabled" class="selfBtn verifyCode"
                                         :style="{'background-color':'#fff','color':'blue'}">
                                        <img @click="VCodeChange" style="bottom: 1px;width: 90px;right: 3px;height: 25px;line-height: 25px;" :src="Verifycode" alt="">
                                    </div>
                                </el-form-item>
                                <!--账户密码管理-->
                                <template>
                                    <div class="flexPublic">
                                        <!--短信快捷登录-->
                                        <template v-if="menuMeesage.messsign&&menuMeesage.messsign.isshow">
                                            <p @click="selectArea='phoneLogin'" style="cursor: pointer">短信快捷登录</p>
                                        </template>
                                        <div  class="flexPublic">
                                            <!--忘记密码-->
                                            <template v-if="menuMeesage.forgetword&&menuMeesage.forgetword.isshow">
                                                <p  @click="selectArea='fixPassword'" style="cursor: pointer">忘记密码</p>
                                            </template>
                                            <!--注册账号-->
                                            <template v-if="menuMeesage.registnum &&menuMeesage.registnum.isshow">
                                                <router-link to="/register"><p style="cursor: pointer">注册账号</p></router-link>
                                            </template>
                                        </div>

                                    </div>
                                </template>
                                <div style="text-align: center;margin-top: 10px">
                                    <router-link to="/index"><div class="selfBtn whiteBtn" style="cursor: pointer">取消</div></router-link>
                                    <div class="selfBtn blueBtn" @click="submitForm('loginForm')" style="cursor: pointer">登录</div>
                                </div>
                            </el-form>
                        </div>

                        <!--手机登录界面-->
                        <div :style="{'display':selectArea=='phoneLogin'?'block':'none'}">
                            <el-form :model="loginFormPhone" :rules="loginFormPhoneRules" ref="loginFormPhone" label-position="left" label-width="0px">
                                <el-form-item prop="phoneNum">
                                    <img src="@/assets/images/register/sj.png">
                                    <el-input v-model="loginFormPhone.phoneNum" type="text" placeholder="请输入手机号" @blur.prevent="changeAccount()"></el-input>
                                    <div :disabled="disabled" class="selfBtn verifyCode"
                                         :style="{'background-color':disabled?'#CCCCCC':'#2473EB',
                                                    'color':disabled?'grey':'white',
                                                    'border-color':disabled?'#CCCCCC':'#2473EBe'}"
                                         @click="sendCode(1)" id="timerArea1">{{timertitle}}</div>
                                </el-form-item>
                                <el-form-item prop="phoneCode">
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="loginFormPhone.phoneCode" type="text"  placeholder="请输入短信验证码"></el-input>
                                    <div v-if="ischange_db" class="selfBtn AreaCode"  @click="dbbaseDialogVisible = true">
                                        <img style="position: initial;" src="@/assets/images/register/dz.png">
                                    </div>
                                </el-form-item>
                                <!--v-if="isOrganize" -->
                                <el-form-item v-if="isOrganizePhone" prop="orgid">
                                    <img src="@/assets/images/register/3.png">
                                    <el-select v-model="loginFormPhone.orgid" filterable placeholder="请选择组织">
                                        <el-option v-for="item in phoneoptions"
                                                   :key="item.PhId"
                                                   :label="item.OrgName"
                                                   :value="item.PhId">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <div style="text-align: center ;margin-top: 40px">

                                    <div class="selfBtn whiteBtn"  @click="selectArea='ordinaryLogin'">取消</div>
                                    <div class="selfBtn blueBtn" @click="submitForm('loginFormPhone')">登录</div>
                                </div>
                            </el-form>
                        </div>
                        <!--忘记密码，修改密码界面-->
                        <div :style="{'display':selectArea=='fixPassword'?'block':'none'}">
                            <el-form :model="fixPwdForm" :rules="fixPwdFormRules" ref="fixPwdForm" label-position="left" label-width="0px">
                                <el-form-item prop="phoneNum">
                                    <img src="@/assets/images/register/sj.png">
                                    <el-input v-model="fixPwdForm.phoneNum" type="text" placeholder="请输入手机号" @blur.prevent="changeAccount()"></el-input>
                                    <div :disabled="disabledPwd" class="selfBtn verifyCode"
                                         :style="{'background-color':disabledPwd?'#CCCCCC':'#2473EB','color':disabledPwd?'grey':'white'}" @click="sendCode(2)" id="timerArea2">{{timertitlePwd}}</div>
                                </el-form-item>
                                <el-form-item prop="phoneCode">
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="fixPwdForm.phoneCode" type="text" placeholder="请输入校验码"></el-input>
                                </el-form-item>
                                <!--<el-form-item prop="password">-->
                                <!--<img src="@/assets/images/register/2-2.png">-->
                                <!--<el-input v-model="fixPwdForm.password" type="password"  placeholder="请输入密码"></el-input>-->
                                <!--</el-form-item>-->
                                <el-form-item prop="newPassword">
                                    <img src="@/assets/images/register/2.png">
                                    <el-input v-model="fixPwdForm.newPassword" type="password"  placeholder="请输入新密码" @focus="showMsg" @blur="hideMsg"></el-input>
                                    <div :style="{'display': showMsgFlag?'block':'none'}" >
                                        <div class="selficon_bac"></div>
                                        <div class="selficon_frot"></div>
                                        <ol class="msgBox">
                                            <li></li>
                                            <li>长度为6-12个字符</li>
                                            <li></li>
                                            <li>至少包含1个字母或其他字符</li>
                                            <li></li>
                                            <li>支持数字、大小写字母和标点符号</li>
                                            <li></li>
                                            <li>不允许有空格</li>
                                        </ol>
                                    </div>
                                </el-form-item>
                                <el-form-item prop="confirmPassword" >
                                    <img src="@/assets/images/register/2-1.png">
                                    <el-input v-model="fixPwdForm.confirmPassword" type="password"  placeholder="请确认新密码"></el-input>
                                </el-form-item>

                                <div style="text-align: center; margin-top: 40px">

                                    <div class="selfBtn whiteBtn" @click="selectArea='ordinaryLogin'">取消</div>
                                    <div class="selfBtn blueBtn" @click="submitForm('fixPwdForm')">修改</div>
                                </div>
                            </el-form>
                        </div>

                        <div v-if="sysMsg" class="err-msg">{{sysMsg}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="register_foot">
            <a @click="serviceVisible = true">服务协议</a> | <a @click="operateVisible = true">免责声明</a> | <a :href="setting.weburl">关于政云</a>
        </div>
        <div style="display: none;">
            <countdownpop></countdownpop>
        </div>

        <!-- el-dialog 弹出服务协议-->
        <el-dialog title="服务协议" :visible.sync="serviceVisible">
            <div class="fwxy">
                <h3>一、总则</h3>
                <p>
                    GHC工会财务云平台通过以下条款为您提供服务。
                    您只有完全同意下列所有服务条款并完成注册程序，才能成为GHC工会财务云平台的用户并使用相应服务。
                    您在使用GHC工会财务云平台提供的各项服务之前，应仔细阅读本用户协议。 您在注册程序过程中点击“同意条款，立即注册”按钮即表示您与GHC工会财务云平台达成协议，完全接受本服务条款项下的全部条款。<br>
                    您一旦使用GHC工会财务云平台的服务，即视为您已了解并完全同意本服务条款各项内容。
                </p>
                <h3>二、隐私条款</h3>

                <ul>
                    <li>
                        1.用户在注册账号或使用本服务的过程中，可能需要填写或提交一些必要的信息，如法律法规、规章规范性文件（以下称“法律法规”）规定的需要填写的身份信息。如用户提交的信息不完整或不符合法律法规的规定，则用户可能无法使用本服务或在使用本服务的过程中受到限制。

                    </li>
                    <li>
                        2.用户隐私信息是指涉及用户集体或个人身份或个人隐私的信息，比如，用户真实姓名、身份证号、手机号码、地址等。非个人隐私信息是指用户对本服务的操作状态以及使用习惯等明确且客观反映在GHC工会财务云平台服务器端的基本记录信息、个人隐私信息范围外的其它普通信息，以及用户同意公开的上述隐私信息。尊重用户个人隐私信息的私有性是GHC工会财务云平台的一贯制度，平台将采取技术措施和其他必要措施，确保用户及个人隐私信息安全，防止在本服务中收集的用户个人隐私信息泄露、毁损或丢失。在发生前述情形或者GHC工会财务云平台发现存在发生前述情形的可能时，将及时采取补救措施。平台未经用户同意不向任何第三方公开、 透露用户个人隐私信息。<br/>
                        但以下特定情形除外：
                        <ul>
                            <li>
                                (1) GHC工会财务云平台根据法律法规规定或有权机关的指示提供用户的个人隐私信息；
                            </li>
                            <li>
                                (2) 由于用户将其用户密码告知他人或与他人共享注册帐户与密码，由此导致的任何个人信息的泄漏，或其他非因平台原因导致的个人隐私信息的泄露；
                            </li>
                            <li>
                                (3) 用户自行向第三方公开其个人隐私信息；
                            </li>
                            <li>
                                (4) 用户与GHC工会财务云平台及合作单位之间就用户个人隐私信息的使用公开达成约定，平台因此向合作单位公开用户个人隐私信息；
                            </li>
                            <li>
                                (5) 任何由于黑客攻击、电脑病毒侵入及其他不可抗力事件导致用户个人隐私信息的泄露。
                            </li>
                        </ul>
                    </li>
                    <li>
                        3.用户同意GHC工会财务云平台可在以下事项中使用用户的个人隐私信息：
                        <ul>
                            <li>
                                (1) 平台向用户及时发送重要通知，如软件更新、本协议条款的变更；
                            </li>
                            <li>
                                (2) 平台内部进行审计、数据分析和研究等，以改进平台的产品、服务和与用户之间的沟通；
                            </li>
                            <li>
                                (3) 依本协议约定，GHC工会财务云平台管理、审查用户信息及进行处理措施；
                            </li>
                            <li>
                                (4) 适用法律法规规定的其他事项。
                            </li>
                        </ul>
                        除上述事项外，如未取得用户事先同意，平台不会将用户个人隐私信息使用于任何其他用途。
                    </li>
                    <li>
                        4.为了改善GHC工会财务云平台的技术和服务，向用户提供更好的服务体验，平台或可会自行收集使用或向第三方提供用户的非个人隐私信息。
                    </li>
                </ul>

                <h3>三、用户行为</h3>
                <p>用户同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为∶</p>
                <ul>
                    <li>
                        1.发布或以其它方式传送含有下列内容之一的信息： 反对宪法所确定的基本原则的； 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的； 损害国家荣誉和利益的； 煽动民族仇恨、民族歧视、破坏民族团结的； 破坏国家宗教政策，宣扬邪教和封建迷信的； 散布谣言，扰乱社会秩序，破坏社会稳定的； 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的； 侮辱或者诽谤他人，侵害他人合法权利的； 含有虚假、诈骗、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容； 含有中国法律、法规、规章、条例以及任何具有法律效力之规范所限制或禁止的其它内容的； 含有GHC工会财务云平台认为不适合在平台展示的内容；
                    </li>
                    <li>
                        2.以任何方式危害他人的合法权益；
                    </li>
                    <li>
                        3.冒充其他任何人或机构，或以虚伪不实的方式陈述或谎称与任何人或机构有关；
                    </li>
                    <li>
                        4.将依据任何法律或合约或法定关系（例如由于雇佣关系和依据保密合约所得知或揭露之内部资料、专属及机密资料）知悉但无权传送之任何内容加以发布、发送电子邮件或以其它方式传送；
                    </li>
                    <li>
                        5.将侵害他人著作权、专利权、商标权、商业秘密、或其它专属权利（以下简称“专属权利”）之内容加以发布或以其它方式传送；
                    </li>
                    <li>
                        6.将任何广告信函、促销资料、“垃圾邮件”、““滥发信件”、“连锁信件”、“直销”或其它任何形式的劝诱资料加以发布、发送或以其它方式传送；
                    </li>
                    <li>
                        7.将设计目的在于干扰、破坏或限制任何计算机软件、硬件或通讯设备功能之计算机病毒（包括但不限于木马程序（trojan horses）、蠕虫（worms）、定时炸弹、删除蝇（cancelbots）（以下简称“病毒”）或其它计算机代码、档案和程序之任何资料，加以发布、发送或以其它方式传送；
                    </li>
                    <li>
                        8.干扰或破坏本服务或与本服务相连线之服务器和网络，或违反任何关于本服务连线网络之规定、程序、政策或规范；
                    </li>
                    <li>
                        9.跟踪、人肉搜索或以其它方式骚扰他人；
                    </li>
                    <li>
                        10.故意或非故意地违反任何适用的当地、国家法律，以及任何具有法律效力的规则；
                    </li>
                    <li>
                        11.未经合法授权而截获、篡改、收集、储存或删除他人个人信息、站内邮件或其它数据资料，或将获知的此类资料用于任何非法或不正当目的。
                    </li>
                </ul>
                <p>您已认可GHC工会财务云平台未对用户的使用行为进行全面控制，您使用任何内容时，包括依赖前述内容之正确性、完整性或实用性时，您同意将自行加以判断并承担所有风险，而不依赖于GHC工会财务云平台。但GHC工会财务云平台依其自行之考虑，可拒绝和删除经由本服务提供之违反本条款的或其它引起GHC工会财务云平台反感的任何内容。 您了解并同意，GHC工会财务云平台依据法律法规的要求，或基于诚信为了以下目的或在合理必要范围内，认定必须将内容加以保存或揭露时，得加以保存或揭露：</p>
                <ul>
                    <li>
                        1.遵守法律程序；
                    </li>
                    <li>
                        2.执行本使用协议；
                    </li>
                    <li>
                        3.回应任何第三人提出的权利主张；
                    </li>
                    <li>
                        4.保护平台、其用户及公众之权利、财产或个人安全；
                    </li>
                    <li>
                        5.其它GHC工会财务云平台认为有必要的情况。
                    </li>
                </ul>

                <h3>四、遵守法律</h3>
                <p>您同意遵守中华人民共和国相关法律法规的所有规定，并对以任何方式使用您的密码和您的帐号使用本服务的任何行为及其结果承担全部责任。
                    如您的行为违反国家法律和法规的任何规定，有可能构成犯罪的，将被追究刑事责任，并由您承担全部法律责任。
                    同时，如果GHC工会财务云平台有理由认为您的任何行为，包括但不限于您的任何言论和其它行为违反或可能违反国家法律和法规的任何规定，GHC工会财务云平台可在任何时候不经任何事先通知终止向您提供服务。
                </p>
                <h3>五、附则</h3>
                <p>	本用户条款的订立、执行和解释及争议的解决均应适用中华人民共和国法律。
                    如用户就本协议内容或其执行发生任何争议，用户应尽量与我们友好协商解决；协商不成时，任何一方均可向GHC工会财务云平台所在地的人民法院提起诉讼。
                    我们未行使或执行本服务协议任何权利或规定，不构成对前述权利或权利之放弃。
                    如本用户条款中的任何条款无论因何种原因完全或部分无效或不具有执行力，本用户条款的其余条款仍应有效并且有约束力。
                    本协议所有条款的最终解释权属于GHC工会财务云平台。

                </p>
            </div>
        </el-dialog>
        <!-- el-dialog 免责声明-->
        <el-dialog title="免责声明" :visible.sync="operateVisible">
            <div style="width: 100%;height: 500px;overflow: auto;">
                <p style="">
                    1、 互联网是一个开放平台，用户将照片等个人资料上传到互联网上，有可能会被其他组织或个人复制、转载、擅改或做其它非法用途，用户必须充分意识此类风险的存在。<br>
                    2、用户明确同意其使用GHC工会财务云平台服务所存在的风险将完全由其自己承担；因其使用GHC工会财务云平台服务而产生的一切后果也由其自己承担，我们对用户不承担任何责任。<br>
                    3、 我们不保证服务一定能满足用户的要求，也不保证服务不会中断，对服务的及时性、安全性、准确性也都不作保证。<br>
                    4、 对于因不可抗力或GHC工会财务云平台无法控制的原因造成的网络服务中断或其他缺陷，GHC工会财务云平台不承担任何责任。<br>
                    5、 我们不对用户所发布信息的删除或储存失败承担责任。我们有权判断用户的行为是否符合本网站使用协议条款之规定，如果我们认为用户违背了协议条款的规定，我们有终止向其提供网站服务的权利 。<br>
                </p>
            </div>
        </el-dialog>

        <el-dialog
            title="区域选择"
            :visible.sync="dbbaseDialogVisible"
            width="385px"
            marginTop="25%"
            :show-close='false'>
            <el-form ref="formDBbase" :model="loginForm" :rules="loginRules" label-width="100px" label-position="right">
                <el-form-item label="选择区域：" prop="realName" class="area-font">
                    <el-select popper-class="area-option" v-model="loginForm.dbbase" clearable class="area-input" placeholder="请选择区域" style="width: 200px;">
                        <el-option v-for="item in sysDB"
                                   :key="item.PhId"
                                   :label="item.AreaName"
                                   :value="item.DbName">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer sc" style="text-align: center">
                <div class="selfBtn whiteBtn" @click="handDBClose" style="color: #00B8EE; border-color: #00B8EE;">取 消</div>
                <div class="selfBtn blueBtn" @click="saveDbBase()">保 存</div>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'
    import countdownpop from "../../components/countDownPop/index";
    import httpConfig from '@/util/ajaxConfig';  //自定义ajax头部配置*****
    import httpajax from "axios";
    import config from '@/util/ajaxConfig'
    import qs from 'qs'
    import md5 from "js-md5";
    import Auth from "@/util/auth";
    import {getOtherSetting} from "../../api/home";

    export default {
        data() {
            let validMobile=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let reg=/^[1][3,4,5,7,8][0-9]{9}$/;
                    if(!reg.test(value)){callback(new Error('手机号格式不对'))}else{
                        callback()
                    }
                }
            };
            let validPwd=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let reg=/^(?=.*[A-Za-z!@#\$%\^&\*\(\)])([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    //let reg=/^([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    if(!reg.test(value)){
                        callback(new Error('6-12位且至少包含一个字母或其他字符'))
                    }else{
                        callback()
                    }
                }
            };
            let validPwdR=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    if (value!=this.fixPwdForm.newPassword){
                        callback(new Error('两次密码输入不一致'))
                    }else{
                        callback()
                    }
                }
            };
            let validCaptcha=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    /*
                    * 此处将值发回后台，进行校验
                    * */
                    let data={
                        loginid:this.loginid,
                        code:value
                    };
                    this.$axios.get(
                        '/SysToken/GetCheckCode',
                        {params:data}
                    ).then(res=>{
                        if(res.Msg=='验证码错误'){
                            callback(new Error('验证码错误'))
                            this.getCodePic();
                        }else{
                            this.loginRules.verifyCode[1].required=false;
                            callback()
                        }
                    }).catch(err=>{
                        this.getCodePic();
                        console.log(err);
                    })

                }
            };
            //手机验证码校验
            let validPhoneCaptcha=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let that=this;
                    let base = httpConfig.getAxiosBaseConfig();
                    let headconfig = httpConfig.getTestHeaderConfig(that.dbname);
                    httpajax.create(base)({
                        method: 'get',
                        url: '/SysUser/GetCheckMsgCode?phone='+that.loginFormPhone.phoneNum+'&type=login&code='+value,
                        headers: headconfig
                    }).then(res => {

                        var resdata=JSON.parse(res.data);
                        console.log(resdata);
                        if(resdata.Status=='error'){
                            callback(new Error(resdata.Msg))
                        }else{

                            this.loginFormPhoneRules.phoneCode[1].required=false;
                            //this.loginFormPhone.orgid=JSON.parse(res.data).orgs[0].PhId;
                            this.phonePwd=resdata.user.Password;
                            this.phoneoptions=resdata.orgs;
                            if(this.phoneoptions.length==1){
                                this.loginFormPhone.orgid=JSON.parse(res.data).orgs[0].PhId;
                            }

                            if(this.phoneoptions.length>=1){
                                this.isOrganizePhone=true;
                            }else{
                                this.isOrganizePhone=false;
                            }
                            callback();
                        }
                    }).catch(err=>{
                        console.log(err);
                        callback(new Error('验证码错误'))
                    })

                    /* if (value!=this.phoneCaptcha){
                         callback(new Error('验证码错误'))
                     }else{
                         callback()
                     }*/
                }
            };
            let validPasswordCaptcha=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let that=this;
                    let base = httpConfig.getAxiosBaseConfig();
                    let headconfig = httpConfig.getTestHeaderConfig(that.dbname);
                    httpajax.create(base)({
                        method: 'get',
                        url: '/SysUser/GetCheckMsgCode?phone='+that.fixPwdForm.phoneNum+'&type=fixPwd&code='+value,
                        headers: headconfig
                    }).then(res => {
                        console.log(JSON.parse(res.data).Status);
                        if(JSON.parse(res.data).Status=='error'){
                            callback(new Error(JSON.parse(res.data).Msg))
                        }else{
                            callback();
                        }
                    }).catch(err=>{
                        console.log(err);
                        callback(new Error('验证码错误'))
                    })
                }
            };
            return {
                serviceVisible:false,
                operateVisible:false,
                roleFlam:1,
                roleList:'',//角色列表
                showMsgFlag:false,
                phonePwd:'',//
                disabled:false,//用于禁用button
                disabledPwd:false,//用于禁用密码修改button
                selectArea:'ordinaryLogin',//显示界面 ordinaryLogin--普通账号密码登录  phoneLogin--手机验证码登录  fixPassword--修改密码
                loginForm: {
                    dbbase:'',
                    name: '',
                    password: '',
                    orgid: '',
                    verifyCode: ''
                },
                options: [],//保存密码登录的组织
                phoneoptions:[],//保存手机短信登录的组织
                getDatas:'',
                loginRules: {
                    name: [
                        {required: true, message: '请输入手机号', trigger: 'blur'}
                    ],
                    password :[
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{required:true,validator:validPwd,trigger:'blur'}
                    ],
                    orgid :[
                        {required: true, message: '请选择当前用户组织', trigger: 'blur'}
                    ],
                    verifyCode: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                        {required:true, validator:validCaptcha, trigger: 'blur'}
                    ]
                },
                //手机登录表单
                loginFormPhone: {
                    phoneNum: '',
                    phoneCode: '',
                    orgid: ''
                },
                //手机登录表单验证方法
                loginFormPhoneRules:{
                    phoneNum:[
                        {required:true, message: '请输入手机号', trigger: 'blur'},
                        {required:true,validator:validMobile,trigger:'blur'}
                    ],
                    phoneCode: [
                        {required:true, message: '请输入验证码', trigger: 'blur'},
                        {required:true,validator:validPhoneCaptcha,trigger: 'blur'}
                    ],
                    orgid:{required:true, message: '请输入值', trigger: 'blur'}
                },
                //密码修改表单
                fixPwdForm: {
                    phoneNum:'',
                    phoneCode: '',
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                //密码修改表单验证方法
                fixPwdFormRules:{
                    phoneNum:[
                        {required:true, message: '请输入手机号', trigger: 'blur'},
                        {required: true,validator:validMobile,trigger:'blur'}
                    ],
                    phoneCode:[
                        {required:true, message: '请输入验证码', trigger: 'blur'},
                        {required:true, validator:validPasswordCaptcha, trigger: 'blur'}
                    ],
                    newPassword:[
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {required: true,validator:validPwd,trigger:'blur'},
                    ],
                    confirmPassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {required: true,validator:validPwdR,trigger:'blur'}
                    ]
                },
                changeCaptcha:'',//存储切换的验证码--普通登录验证码
                phoneCaptcha:'',// --手机号登录验证码
                passwordCaptcha:'',//--更改密码的验证码
                timertitle:'发送短信',
                timertitlePwd:'发送短信',
                sysMsg: '',
                loading: false,
                isOrganize:false,//账号登录组织显示
                isOrganizePhone:false,//手机验证码登录组织显示
                Verifycode:'',
                settingInfo:{  //获取的设置信息
                    copyright:'',
                    linkus:'',
                    linkus2:'',
                    platform:''
                },
                setting:{  //底部信息
                    phone:'',
                    qq:'',
                    fax:'',
                    email:'',
                    weburl:'',
                    address:''
                },

                //显示数据库的区域选择
                dbbaseDialogVisible:false,
                sysDB:[],   //区域数据库
                isdbbaseAdd:false,
                ischange_db:false,

                //判断是否显示内容
                menuMeesage:{
                    aboutnewgrade:{isshow:false},//关于新中大科技
                    aboutzhengyun:{isshow:false},//关于政云
                    copyright:{isshow:false},//版权
                    datareportpla:{isshow:false},//数据直报平台
                    disclaimer:{isshow:false},//免责声明
                    forgetword: {isshow: false},//忘记密码
                    labfinadmin:{isshow:false},//工会财务管理
                    linkmode:{isshow:false},//联系方式
                    messsign:{isshow:false},//短信快捷登录
                    onlinemess:{isshow:false},//在线留言
                    qqorweixin:{isshow:false},//QQ/微信
                    register:{isshow:false},//注册
                    registernum:{isshow:false},//注册账号
                    rotatechart:{isshow:false},//轮播图
                    serviceagree:{isshow:false},//服务协议
                    unionwindow:{isshow:false},//公会之窗

                    inddynam:{isshow:true},
                    productplan:{isshow:true},
                    policysystem:{isshow:true},









                },
            }
        },
        //计算属性
        computed: {
            ...mapState({
                lang: state => state.lang,
                theme: state => state.theme,
                dbname:state => state.user.dbname
            }),
            picUrl:function(){
                return config.baseurl;
            },
            loginid:function(){
                return Math.random()
            },

        },
        created() {
            this.getCodePic();
            this.otherSetting();
            //this.getImg();
            this.GetDbArea();
        },
        watch: {
            //监听password变化 ，(debounce)停留0.5s获取组织信息
            // 'loginForm.password': lodash.debounce(,1000),
            //监听selectArea变化，将验证码校验重新加入验证
            'selectArea':function () {
                this.loginRules.verifyCode[1].required=true;
                this.loginFormPhoneRules.phoneCode[1].required=true;
            }
        },
        beforeMount(){
            // 初始化错误信息。保证单独点击input时可以弹出正确的错误提示
        },
        mounted(){
            this.changeCaptcha=this.code();
            this.getSysWebMenuMessage()

        },
        methods: {
            ...mapActions({
                login: 'user/loginByPhone',
                getToken:'user/getToken',
                orgByUser:'user/GetOrgByUser',
                GetVerifycode:'user/GetVerifycode',
                businessConfig:'Pconfig/getBusinessConfig',
                GetAllRoleauthorize: 'user/GetAllRoleauthorize',
                CheckAccount: 'user/CheckAccount',
                SysDBbaseList: 'user/SysDBbaseList',
                SaveUserDBInsert: 'user/SaveUserDBInsert',
            }),
            //获取网站的配置信息
            otherSetting(){
                var vm=this;
                var params={
                    value:"linkus,linkus2,copyright,platform"
                }
                getOtherSetting(vm,params).then(
                    (res)=>{
                        console.log(res)
                        if(res.Status=='error'){
                            this.$message({showClose: true, message: "设置信息获取错误", type: "error"});
                        }else{
                            this.settingInfo=res;
                            this.setting.phone=res.linkus.linkphone;
                            this.setting.qq=res.linkus.customservice;
                            this.setting.fax=res.linkus.fax;
                            this.setting.email=res.linkus.email;
                            this.setting.weburl=res.linkus.weburl;
                            this.setting.address=res.linkus.address;
                        }
                    }

                )
            },

            //获取验证么图片
            getCodePic:function(){
                this.Verifycode=httpConfig.getAxiosBaseConfig().baseURL+'/SysToken/GetSecurityCode?v='+ Math.random()+'&loginid='+this.loginid;
            },

            //获取组织信息
            getOrgByUser:function(){
                if(this.loginForm.password==''){
                    return
                };
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载数据.....',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.loginForm.orgid='';
                this.orgByUser({
                    uname_login:this.loginForm.name,
                    password: md5(this.loginForm.password)
                }).then(res => {
                    loading.close();
                    if(res){
                        if(res.Status==='error'){
                            this.$message({showClose: true, message: res.Msg, type: "error"});
                            this.isOrganize=false;
                            this.loginForm.password='';
                            return;
                        }

                        //获取组织信息，当前组织只有一个时，直接赋值，显示
                        let orgData=res.Record;
                        if(orgData.length===1){
                            this.options=orgData;
                            this.isOrganize=true;
                            let that=this;
                            setTimeout(function(){
                                that.loginForm.orgid=orgData[0].PhId;
                            },300);
                        } else if(orgData.length===0){
                            this.isOrganize=false;
                            this.options=[];
                            this.$message({showClose: true, message: "当前用户组织不存在!", type: "error"});
                        }
                        else{
                            this.isOrganize=true;
                            this.options=orgData;
                        }
                    }
                }).catch(err => {
                    loading.close();
                    console.log(err)
                })

            },
            //随机数模拟验证码
            code:function(){
                let code= String(Math.floor(Math.random()*10))+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
                return code;
            },
            /*
            * 发送短信，用于短信验证或者登录
            * type  用于判断发送的验证码是哪种
            *   0--获取普通账号登录验证码//图片验证，失效
            *   1--获取手机验证码登录
            *   2--获取修改密码的手机验证码
            * */
            sendCode:function(type){
                if(type==1){//手机登录
                    //发送验证码前，先进行手机验证，确保手机号正确
                    this.$refs.loginFormPhone.validateField('phoneNum',(validMessage)=>{
                        if(validMessage){
                            this.$message(validMessage);
                        }else{
                            if(!this.disabled){
                                this.disabled=true;
                                this.getPhoneCode('login',this.loginFormPhone.phoneNum);
                                this.timer(59,'timerArea1');
                                this.timertitle='59S后重新发送';
                            }
                        }

                    })
                }else{//修改密码
                    //发送验证码前，先进行手机验证，确保手机号正确
                    this.$refs.fixPwdForm.validateField('phoneNum',(validMessage)=>{
                        if(validMessage){
                            this.$message(validMessage);
                        }else {
                            if (!this.disabledPwd) {
                                this.passwordCaptcha = this.code;
                                this.getPhoneCode('fixPwd',this.fixPwdForm.phoneNum);
                                this.disabledPwd = true;
                                this.timer(59,'timerArea2');
                                this.timertitlePwd = '59S后重新发送';
                            }
                        }
                    })
                }
            },
            /*
            * 手机验证码获取接口
            * type:类型
            * phone:手机号
            * */
            getPhoneCode:function(type,phone) {
                let base = httpConfig.getAxiosBaseConfigUncontrol();
                let headconfig = httpConfig.getTestHeaderConfig(this.dbname);
                httpajax.create(base)({
                    method: 'get',
                    url: '/SysUser/GetMsgCode?phone='+phone+'&type='+type,
                    headers: headconfig
                }).then(res => {
                    console.log(res);
                }).catch(err=>{
                    console.log(err);
                })
            },
            //根据登入人的Id与组织Id获取不同的权限
            getDifferenRole:function(userId, orgId){
                let base = httpConfig.getAxiosBaseConfig();
                let headconfig = httpConfig.getTestHeaderConfig(this.dbname);
                console.log(this.dbname);
                httpajax.create(base)({
                    method: 'get',
                    url: '/SysRole/GetDefaultPageByRoles?userId=' + userId+'&orgId='+orgId,
                    headers: headconfig
                }).then(res => {
                    let data = JSON.parse(res.data);
                    console.log(data.UrlAddress);
                    if (data.UrlAddress == null || data.UrlAddress == '') {
                        this.$message({showClose: true, message: "当前用户还未赋予有页面的菜单权限，请联系管理员!", type: "error"});
                    } else {
                        this.$router.push(data.UrlAddress);
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            /*
            * 手机验证码验证接口
            * type:类型
            *phone:手机号
            * code:验证码
            * */
            verifyCodePhone:function(type,phone,code,callback){
                let base = httpConfig.getAxiosBaseConfig();
                let headconfig = httpConfig.getTestHeaderConfig(this.dbname);
                httpajax.create(base)({
                    method: 'get',
                    url: '/SysUser/GetCheckMsgCode?phone='+phone+'&type='+type+'&code='+code,
                    headers: headconfig
                }).then(res => {
                    //console.log(res);
                    callback(res);
                }).catch(err=>{
                    console.log(err);
                    return err;
                })
            },
            /*
            * 验证码发送按钮倒计时
            * */
            timer:function(t,type){
                let that=this;
                t--;
                setTimeout(function(){
                    if(t>0){
                        document.getElementById(type).innerText=t+'S后重新发送';
                        that.timer(t,type);
                    }else{
                        if(type=='timerArea1'){
                            that.disabled = false;
                            that.loginRules.verifyCode[1].required=true;
                            document.getElementById(type).innerText='重新发送验证码';
                        }else {
                            that.disabledPwd = false;
                            that.loginFormPhoneRules.phoneCode[1].required=true;
                            document.getElementById(type).innerText='重新发送验证码';
                        }
                    }
                },1000)
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loginRules.verifyCode[1].required=true;
                        this.loginFormPhoneRules.phoneCode[1].required=true;
                        var _$this=this;

                        if(formName=='loginFormPhone'){
                            const logloading = _$this.$loading({
                                lock: true,
                                text: '正在登录.....',
                                spinner: 'el-icon-loading'
                            });

                            //登录参数
                            var logpara={
                                name: _$this.loginFormPhone.phoneNum,
                                password: _$this.phonePwd,
                                orgid: _$this.loginFormPhone.orgid
                            };

                            //获取配置信息
                            var configPara={
                                userid:'',
                                orgid:_$this.loginForm.orgid,
                                year:''
                            };
                            httpajax.all([_$this.login(logpara), _$this.businessConfig(configPara)])
                                .then(httpajax.spread(function (res, perms) {
                                    //两个请求现已完成

                                    if(res.Status==="success"){


                                        //插入账号与数据库关系数据
                                        if(_$this.isdbbaseAdd){
                                            var dbdata=_$this.sysDB.filter(item =>{ return item.DbName==_$this.loginForm.dbbase; });
                                            var param={
                                                infoData:[{
                                                    AreaCode:dbdata[0].AreaCode,
                                                    AreaName:dbdata[0].AreaName,
                                                    DbName:dbdata[0].DbName,
                                                    UserAccount:_$this.loginForm.name,
                                                    UserId:0,
                                                    IsSystem:0
                                                }],
                                                value:"add"
                                            };
                                            _$this.SaveUserDBInsert(param).then(res => {
                                                if(res){
                                                    if(res.Status==='error'){
                                                        _$this.$message({showClose: true, message: res.Msg, type: "error"});
                                                        return;
                                                    }
                                                    _$this.isdbbaseAdd=false;
                                                }
                                            }).catch(err => {
                                                console.log(err)
                                            })
                                        }

                                        //加载菜单信息
                                        var param={
                                            userid:res.Data.userInfo.PhId,
                                            orgid:res.Data.orgInfo.PhId
                                        };

                                        _$this.GetAllRoleauthorize(param);  //按钮权限
                                        _$this.$store.dispatch('user/getNavList', param).then((navList) => {
                                            logloading.close();
                                            //_$this.$router.push('/home') //跳转主页
                                            //根据不同的角色显示不同的首页
                                            _$this.getDifferenRole(res.Data.userInfo.PhId, res.Data.orgInfo.PhId)
                                        })

                                    } else {
                                        logloading.close();
                                        _$this.$message({ showClose: true, message: res.Msg, type: 'error' })
                                    }
                                })).catch(error => {
                                logloading.close();
                                console.log(error);
                            });
                        }
                        else if(formName=='loginForm'){
                            const loading = _$this.$loading({
                                lock: true,
                                text: '正在登录.....',
                                spinner: 'el-icon-loading'
                            });


                            //登录参数
                            var logpara2={
                                name: _$this.loginForm.name,
                                password: _$this.loginForm.password,
                                orgid: _$this.loginForm.orgid
                            };

                            //获取配置信息
                            var configPara2={
                                userid:'',
                                orgid:_$this.loginForm.orgid,
                                year:''
                            };

                            httpajax.all([_$this.login(logpara2), _$this.businessConfig(configPara2)])
                                .then(httpajax.spread(function (res, perms) {

                                    //两个请求现已完成
                                    console.log('login2')
                                    console.log(res)
                                    console.log(perms)
                                    if(res.Status==="success"){

                                        //插入账号与数据库关系数据
                                        if(_$this.isdbbaseAdd){
                                            var dbdata=_$this.sysDB.filter(item =>{ return item.DbName==_$this.loginForm.dbbase; });
                                            var param={
                                                infoData:[{
                                                    AreaCode:dbdata[0].AreaCode,
                                                    AreaName:dbdata[0].AreaName,
                                                    DbName:dbdata[0].DbName,
                                                    UserAccount:_$this.loginForm.name,
                                                    UserId:0,
                                                    IsSystem:0
                                                }],
                                                value:"add"
                                            };
                                            _$this.SaveUserDBInsert(param).then(res => {
                                                if(res){
                                                    if(res.Status==='error'){
                                                        _$this.$message({showClose: true, message: res.Msg, type: "error"});
                                                        return;
                                                    }
                                                    _$this.isdbbaseAdd=false;
                                                }
                                            }).catch(err => {
                                                console.log(err)
                                            })
                                        }

                                        //加载菜单信息
                                        var param={
                                            userid:res.Data.userInfo.PhId,
                                            orgid:res.Data.orgInfo.PhId
                                        };
                                        _$this.GetAllRoleauthorize(param);  //按钮权限
                                        _$this.$store.dispatch('user/getNavList', param).then((navList) => {
                                            loading.close();
                                            if(res.Data.orgInfo.EnCode){
                                                //根据不同的角色显示不同的首页
                                                _$this.getDifferenRole(res.Data.userInfo.PhId, res.Data.orgInfo.PhId)

                                            }else{
                                                _$this.$router.push('/system/organization') //跳转主页
                                            }
                                        })
                                    } else {
                                        loading.close();
                                        _$this.$message({ showClose: true, message: res.Msg, type: 'error' })
                                    }
                                })).catch(error => {
                                loading.close();
                                console.log(error);
                            });
                        }
                        else {
                            //密码修改
                            const loading = _$this.$loading({
                                lock: true,
                                text: '正在修改.....',
                                spinner: 'el-icon-loading'
                            });
                            let data={
                                uid:0,
                                Phone:_$this.fixPwdForm.phoneNum,
                                NewPwd:_$this.fixPwdForm.newPassword
                            };
                            let base = httpConfig.getAxiosBaseConfig();
                            let headconfig = httpConfig.getTestHeaderConfig(this.dbname);
                            httpajax.create(base)({
                                method: 'post',
                                url: '/SysUser/PostUpdatePwdByPhoneNumber',
                                data:qs.stringify(data),
                                headers: headconfig
                            }).then(res => {

                                loading.close();
                                if(JSON.parse(res.data).Status=='success'){
                                    _$this.$message({showClose: true, message: JSON.parse(res.data).Msg, type: "error"});
                                    _$this.selectArea='ordinaryLogin';
                                    _$this.fixPwdForm.newPassword='';
                                    _$this.fixPwdForm.phoneNum='';
                                    _$this.fixPwdForm.confirmPassword='';
                                    _$this.fixPwdForm.phoneCode='';
                                }else{
                                    _$this.$message({showClose: true, message: JSON.parse(res.data).Msg, type: "success"});
                                }
                            }).catch(err=>{
                                loading.close();
                                console.log(err);
                            })
                        }
                    }else{
                        return false;
                    }
                });
            },
            VCodeChange(){
                this.Verifycode=httpConfig.getAxiosBaseConfig().baseURL+'/SysToken/GetSecurityCode?v='+ Math.random()+'&loginid='+this.loginid;
            },
            getImg(){

                this.GetVerifycode({
                    v:Math.random(),
                    loginid:this.loginid
                }).then((res)=>{
                    //this.Verifycode=window.URL.createObjectURL(res.data);

                    var binaryData = [];
                    binaryData.push(res.data);
                    this.Verifycode=window.URL.createObjectURL(new Blob(binaryData, {type: "image/png"}))
                })

            },
            showMsg:function(){
                this.showMsgFlag=true;
            },
            hideMsg:function(){
                this.showMsgFlag=false;
            },
            EnterShow(ev){
                alert('你按回车键了');
            },
            GetDbArea(){
                //获取区域
                const loading2 = this.$loading({
                    lock: true,
                    text: '正在获取区域数据.....',
                    spinner: 'el-icon-loading'
                });

                this.SysDBbaseList().then(res => {
                    loading2.close();
                    console.log("区域数据")
                    if(res){
                        if(res.Status==='error'){
                            this.$message({showClose: true, message: res.Msg, type: "error"});
                            return;
                        }
                        this.sysDB=res.Record;
                    }
                }).catch(err => {
                    loading2.close();
                    console.log(err)
                })
            },
            /**
             * 判断当前账号 所在的区域 和数据库的名称
             * 如果ngsoft里面没有数据
             * 要让用户选择区域 ，并在选择填完密码，判断完组织之后，填写ngsoft 前账号 所在的区域的关系
             *  */
            changeAccount(){
                var me=this;
                //默认ordinaryLogin--普通账号密码登录  phoneLogin--手机验证码登录  fixPassword--修改密码
                var account=this.loginForm.name;
                if(this.selectArea=='phoneLogin'){
                    //手机登录页面
                    account=this.loginFormPhone.phoneNum;
                }else if(this.selectArea=='fixPassword'){
                    //修改密码
                    account=this.fixPwdForm.phoneNum;
                }

                if(account==''){
                    return
                };

                const loading = this.$loading({
                    lock: true,
                    text: '正在判断账号所在区域.....',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.CheckAccount({
                    uname_login:account
                }).then(res => {
                    loading.close();
                    if(res){
                        if(res.Status==='error'){
                            this.$message({showClose: true, message: res.Msg, type: "error"});
                            //普通账号密码登录
                            this.loginForm.name='';
                            //手机验证码登录
                            this.loginFormPhone.phoneNum='';
                            //修改密码
                            this.fixPwdForm.phoneNum='';

                            return;
                        }
                        //获取组织信息，当前组织只有一个时，直接登录
                        if(res.changeDb){
                            this.ischange_db=true;
                            let dbList=res.Record;
                            if(dbList.length===1){
                                //默认修改当前数据库的名称,直接赋值

                                this.$store.commit("user/setDbName", {
                                    dbname:dbList[0].DbName,
                                    areacode:dbList[0].AreaCode,
                                    account:dbList[0].UserAccount,
                                    userid:dbList[0].UserId,
                                });

                                this.loginForm.dbbase=dbList[0].DbName;

                            } else if(dbList.length===0){
                                //没有关系表，直接弹出页面选择所在区域的数据库
                                this.isdbbaseAdd=true;

                                //获取区域
                                this.dbbaseDialogVisible=true

                            } else{
                                //多个的时候，选择其中的一个区域
                                this.dbbaseDialogVisible=true
                            }
                        }
                    }
                }).catch(err => {
                    loading.close();
                    console.log(err)
                })
            },
            //关闭区域，数据库修改
            handDBClose(){
                this.dbbaseDialogVisible=false;
                this.loginForm.dbbase==''
            },
            //保存区域数据信息
            saveDbBase(){
                if(this.loginForm.dbbase==''){
                    this.$message({showClose: true, message: '请选择当前账号所在区域', type: "error"});
                    return
                };
                //this.$axios.get('/SysDBbase/GetSysDBbase')


                //更新当前的数据库缓存信息
                var dbdata=this.sysDB.filter(item =>{ return item.DbName==this.loginForm.dbbase; });

                this.$store.commit("user/setDbName", {
                    dbname:dbdata[0].DbName,
                    areacode:dbdata[0].AreaCode,
                    account:this.loginForm.name,
                    userid:dbdata[0].UserId
                });

                this.dbbaseDialogVisible=false;
            },
            //获取网页菜单权限设置
            getSysWebMenuMessage() {
                let data = {
                    value: "signin,signin2"
                }
                this.$axios.get('/SysMessage/GetSysWebMenuMessage', {params: data}).then(res => {
                    for( var i in res ){
                        res[i].isshow = res[i].isshow==1?true:false;
                        if(res[i].title=='轮播图'){

                        }
                    }
                    this.menuMeesage = res
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            }

        },
        components: {countdownpop},
    }
</script>
<style scoped>

    .platformname{
        height:65px;
        line-height: 65px;
        font-weight: 800;
        font-size: 30px;
        display: inline-block;
    }
    .flexPublic p{
        color: #000;
        font-size: 18px;
        padding: 0 10px 20px 10px;
    }
    i{
        width: 25px;
        height: 25px;
        background-color: #0183FD;
        color: white;
        font-size: 11pt;
        font-weight: 900;
        text-align: center;
        line-height: 25px;
        border-radius: 25px 25px;
        position: relative;
        left: 500px;
    }
    .register_head{
        height:61px;
        line-height: 61px;
        width: 100%;
        background-color: #f5f5f5;
        overflow: hidden;
        position: fixed;
        top: 0;
        z-index: 99;
    }
    .register_head img{
        height: 51px;
        margin-left: 206px;
        margin-top: 5px;
    }
    .telPhone{
        color:#88b927;
        font-size: 20px;
        align-items: center;
        margin-right: 206px;
        float: right;
    }
    .telPhone>img{
        height: 40px;
        margin-top: 10px;
    }
    .register_foot{
        height:61px;
        line-height: 61px;
        width: 100%;
        background-color: #464144;
        overflow: hidden;
        position: fixed;
        bottom: 0;
        z-index: 99;
        text-align: center;
        color: #fff;
    }
    .register_foot a{
        color: #fff;
        cursor: pointer;
    }
    .selficon_bac{
        border-top: 10px solid transparent;
        border-right: 10px solid #63b1fb;
        border-bottom: 10px solid transparent;
        position: absolute;
        right: -6px;
        top: 11px;
    }
    .selficon_frot{
        border-top: 10px solid transparent;
        border-right: 10px solid white;
        border-bottom: 10px solid transparent;
        position: absolute;
        right: -8px;
        top: 11px;
        z-index: 2;
    }
    .msgBox{
        position: absolute;
        right: -140px;
        top: -20px;
        line-height: 20px;
        border: 1px solid #63b1fb;
        color: grey;
        padding: 10px 5px 10px 23px;
        font-size: 12px;
        width: 135px;
    }
    .msgBox>li:nth-of-type(2n-1){
        width: 3px;
        height: 3px;
        background-color: #63b1fb;
        border-radius: 5px;
        box-shadow: 0 0 3px 2px #63b1fb;
        position: relative;
        left: -12px;
        top: 10px;
    }
    .el-select{
        width: 80px;
        height: 30px;
    }
    .sys-login{
        height: 100%;
        background-image: none;
        background-color: #f5f5f5;
    }
    .sys-login .login-area{
        width: 100%;
        min-width: 969px;
        height: 398px;
        margin: auto;
        position: absolute;
        top: 50%;
        margin-top: -199px;
        padding: 0;
        background: #0183fd;
        text-align: center;
    }
    .form-area{
        text-align: center;
        width: 100%;
        position: relative;
        top: -20px;

    }
    .form-group{
        margin: auto;
        width:725px ;
        height: 437px;
        background-color: #FFFFFF;
        background-image: none;
        border: 2px solid  #FFFFFF;
        box-shadow: 0px 50px 50px -25px #211F20;
        line-height: 18px;
        font-size: 10.0pt;
    }
    .form-group .msg{
        font-size:15px;
        color: #000;
        margin: auto auto;
        width: 70%;
        text-align: left;
    }
    .form-group .msg>p{
        font-size: 12px;
        padding-left: 30px;
    }
    .form-box{
        text-align: left;
        width: 407px;
        margin: 40px auto;
    }
    .card_content{
        display: flex;
        flex-direction: row;
    }
    .card_content>div{
        vertical-align: middle;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(217, 217, 217);
        border-radius: 0px;
        width: 170px;
        height: 170px;
        background-color: transparent;
        margin: 10px 5px;
    }
    .card_content>div:hover{
        border-color: #0183FD;
    }
    .card_content>div>img{
        width: 89px;
        height: 89px;
        cursor: pointer;
        margin-top: 20px;
    }
    .card_content>div>p{
        color: #0183FD;
        text-align: center;
        text-decoration: none;
        font-size: 20px;
        font-style: normal;
        line-height: 0px;
        margin-top: 30px;
    }
    .active_showarea{
        display:none
    }
    .selfBtn{
        cursor: pointer;
        width: 127px;
        height: 33px;
        border-radius: 5px 5px;
        line-height: 33px;
        font-size: 15px;
        text-align: center;
        display: inline-block;
    }
    .whiteBtn{

        background-color: transparent;
        border: 1px solid #2473EB;
        color:#2473EB
    }
    .blueBtn{
        margin-left:45px;
        background-color: #0183fd;
        border: 1px solid #0183fd;
        color:white
    }
    .verifyCode{
        display: inline-block;
        background-color: #fff;
        color: rgb(36, 115, 235);
        position: absolute;
        bottom: 5px;
        width: 100px;
        right: 3px;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        border: 1px solid rgb(36, 115,235);
    }
    .AreaCode{
        display: inline-block;
        background-color: #fff;
        color: rgb(36, 115, 235);
        position: absolute;
        bottom: 5px;
        width: 30px;
        right: 3px;
        height: 30px;
        line-height: 30px;
        font-size: 13px;
    }

    .area-input >>> .el-input--suffix input {
        line-height: 30px;
    }
</style>
<style>
    .sys-login .form-group .el-form-item{
        border-width: 0px 0px 1px 0px;
        border-style: solid;
        border-color: #63b1fb;
        border-radius: 0 0;
    }
    .sys-login .form-group .el-form-item.is-error{
        border-color: #d45b5b;
    }
    .sys-login .form-group .el-form-item .el-form-item__content img{
        position: absolute;
        width: 30px;
        height: 25px;
        bottom:10px
    }
    .sys-login .form-group .el-input{
        background:none;
        margin-left: 40px;
    }
    .log .form-group .el-select .el-input .el-input__inner{
        padding: 10px;
        width: 360px !important;
        background-color: white;
        border: none;
    }
    .sys-login .form-group .el-input__inner{
        width: 345px;
        background-color: white;
        border: none;
    }
    .sys-login .form-group .el-input__suffix{
        display: none;
    }
    .sys-login .form-group .el-form-item.is-error .el-input__inner {
        border-color:transparent;
        background-color: transparent;
    }
    .el-select{
        text-align: center;
    }
    .sys-login .el-dialog__footer{
        text-align: center;
    }
</style>
