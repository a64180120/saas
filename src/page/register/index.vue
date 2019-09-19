<template>
    <div class="sys-login">
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
            <div class="telPhone">
                <img src="../../assets/images/finance/SAAS-03.png">
                <span>{{setting.phone}}</span></div>
        </div>
        <div class="login-area">

            <div class="form-area">
                <div class="form-group">
                    <div class="form-box">
                        <i class="el-icon-close" :style="{display:((showArea=='selectArea'||showArea=='firstStep')?'block':'none')}" @click="backToLogin" style="cursor: pointer"></i>
                        <div :class="{active_showarea:showArea!='selectArea'}">
                            <div class="el-message-box__title" style="color: rgb(1,131,253)">请选择注册方式</div>
                            <div class="card_content">
                                <div @click="changeshowArea('firstStep','0')" style="cursor: pointer">
                                    <img src="@/assets/images/register/register_ordinary.png">
                                    <p>普通注册</p>
                                </div>
                                <div @click="changeshowArea('firstStep','1')" style="cursor: pointer">
                                    <img src="@/assets/images/register/register_code.png">
                                    <p>邀请码注册</p>
                                </div>
                            </div>
                        </div>
                        <el-form :model="registerForm1" :rules="registerRules1"  ref="validFormF" label-position="left" label-width="0px">
                            <div :class="{active_showarea:showArea!='firstStep'}" >
                                <div style="height: 65px;line-height: 30px">
                                    <div  class="el-message-box__title">当前注册方式: {{checkType==0?'普通注册':'邀请码注册'}}</div>
                                    <!--<el-radio label="0" v-model="checkType">普通注册</el-radio>-->
                                    <!--<el-radio label="1" v-model="checkType">邀请码注册</el-radio>-->
                                </div>
                                <template v-if="checkType==0">
                                    <el-form-item prop="name">
                                        <img src="@/assets/images/register/1.png">
                                        <el-input v-model="registerForm1.name" type="text"
                                                  placeholder="请输入联系人姓名（必填）"></el-input>
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <el-form-item prop="code">
                                        <img src="@/assets/images/register/1.png">
                                        <el-input v-model="registerForm1.code" type="text" placeholder="请输入邀请码（必填）"></el-input>
                                    </el-form-item>
                                </template>

                                <el-form-item prop="phone">
                                    <img src="@/assets/images/register/sj.png">
                                    <template v-if="checkType==0">
                                        <el-input v-model="registerForm1.phone" type="text" placeholder="请输入手机号（必填）"></el-input>
                                    </template>
                                    <template v-else>
                                        <el-input v-model="registerForm1.phone" type="text" placeholder="请输入手机号（必填）" @blur.prevent="getDbByPhone()"></el-input>
                                        <div style="position: absolute;right: -35px;top: 6px;" v-if="ischange_db" class="selfBtn AreaCode"  @click="dbbaseDialogVisible = true">
                                            <img style="position: initial;" src="@/assets/images/register/dz.png">
                                        </div>
                                    </template>

                                </el-form-item>
                                <el-form-item prop="phonecode" >
                                    <img src="@/assets/images/register/4.png">
                                    <el-input v-model="registerForm1.phonecode" type="text"  placeholder="请输入手机验证码（必填）"></el-input>
                                    <div :disabled="disabled" class="selfBtn verifyCode"
                                         :style="{'background-color':disabled?'#CCCCCC':'#2473EB','color':disabled?'grey':'white'}" @click="sendCode" id="timerArea">{{timertitle}}</div>
                                </el-form-item>
                                <div style="text-align: center">

                                    <router-link to="/index"><button class="selfBtn whiteBtn">取消</button></router-link>
                                    <div class="selfBtn blueBtn" @click="changeshowArea('secondStep')">下一步</div>
                                    <!--<template v-if="checkType==0">
                                        <div class="selfBtn blueBtn" @click="changeshowArea('secondStep')">下一步</div>
                                        <router-link to="/index"><button class="selfBtn whiteBtn">取消</button></router-link>
                                    </template>
                                    <template v-else>
                                        <div class="selfBtn blueBtn" @click="codeRegister">下一步</div>
                                    </template>-->

                                </div>
                            </div>
                        </el-form>
                        <el-form style=" margin-top:45px;" :model="registerForm2" :rules="registerRules2" ref="validFormS" label-position="left" label-width="0px">
                            <div :class="{active_showarea:showArea!='secondStep'}">
                                <el-form-item prop="company">
                                    <img src="@/assets/images/register/1.png">
                                    <el-input :disabled="checkType==1" v-model="registerForm2.company" type="text" placeholder="请输入企业/单位名称（必填）"></el-input>
                                </el-form-item>
                                <el-form-item prop="addressDetail">
                                    <img src="@/assets/images/register/dz.png" style="bottom: 35px;">
                                    <el-select :disabled="checkType==1" v-model="registerForm2.provincevalue" placeholder="省" @change="searchArea(registerForm2.provincevalue,1)">
                                        <el-option
                                            v-for="item in province"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value" >
                                        </el-option>
                                    </el-select>
                                    <el-select :disabled="checkType==1" v-model="registerForm2.cityvalue" placeholder="市" style="margin-left: 0px" @change="searchArea(registerForm2.cityvalue,2)">
                                        <el-option
                                            v-for="item in city"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select :disabled="checkType==1" v-model="registerForm2.countyvalue" placeholder="区县" style="margin-left: 0px" @change="searchArea(registerForm2.countyvalue,3)">
                                        <el-option
                                            v-for="item in county"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-select :disabled="checkType==1" v-model="registerForm2.streetvalue" placeholder="乡镇" style="margin-left: 0px">
                                        <el-option
                                            v-for="item in street"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <el-input :disabled="checkType==1" v-model="registerForm2.addressDetail" type="text" placeholder="请输入详细地址、门牌号（必填）"></el-input>
                                </el-form-item>
                                <!--<el-form-item prop="addressDetail">
                                    <img src="@/assets/images/register/register_ordinary.png">

                                </el-form-item>-->
                                <el-form-item prop="password">
                                    <img src="@/assets/images/register/2.png">
                                    <el-input v-model="registerForm2.password" type="password" placeholder="请输入密码（必填）" @focus="showMsg" @blur="hideMsg"></el-input>
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

                                <el-form-item prop="confirmpassword">
                                    <img src="@/assets/images/register/2-1.png">
                                    <el-input v-model="registerForm2.confirmpassword" type="password" placeholder="请输入确认密码（必填）"></el-input>
                                </el-form-item>
                                <div style="text-align: center">
                                    <div class="default selfBtn whiteBtn" @click="changeshowArea('firstStep')">上一步</div>
                                    <div class="selfBtn blueBtn" @click="changeshowArea('sub')">注册</div>
                                </div>
                            </div>
                        </el-form>
                        <!--<el-form-item v-if="isOrganize" prop="orgid">
                        <el-select v-model="loginForm.orgid" filterable placeholder="请选择组织">
                            <el-option v-for="item in options"
                                       :key="item.PhId"
                                       :label="item.OrgName"
                                       :value="item.PhId">
                            </el-option>
                        </el-select>
                    </el-form-item>-->


                        <div v-if="sysMsg" class="err-msg">{{sysMsg}}</div>
                    </div>
                    <div class="msg" :style="{'display':showArea=='selectArea'?'block':'none'}">
                        <h1>说明：</h1>
                        <p>1、注册方式选择“普通注册”的，提交注册信息后，待管理人员审核通过后，可正常使用平台功能，申请结果将以短信方式通知。</p>
                        <p>2、注册方式选择“邀请码注册”的，核对相关信息无误并提交成功后，即表示注册成功，可正常使用平台功能。</p>
                        <p>3、注册成功后，15日内您可免费试用本平台。若相关信息在此期间未完善上传或者审核不通过的，您将无法继续正常使用本平台功能。</p>
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
            <el-form ref="formDBbase" :model="registerForm1" :rules="registerRules1" label-width="100px" label-position="right">
                <el-form-item label="选择区域：" prop="realName" class="area-font">
                    <el-select popper-class="area-option" v-model="registerForm1.dbbase" clearable class="area-input" placeholder="请选择区域" style="width: 200px;">
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
    import countdownpop from "../../components/countDownPop/index";
    import httpConfig from "../../util/ajaxConfig";
    import httpajax from "axios";
    import { mapState, mapActions } from 'vuex'
    import config from '@/util/ajaxConfig'
    // import TimeSelectBar from "../../components/TimeSelectBar/index";
    import qs from 'qs'
    import {getOtherSetting} from "../../api/home";
    export default {
        name: "index",
        data(){
            let validMobile=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let reg=/[0-9]{11}/
                    if(!reg.test(value)||value.length>11){callback(new Error('手机号格式不对'))}else{
                        callback()
                    }
                }
            };
            let validCode=(rule,value,callback)=>{
              if(value==''||value==undefined){
                  callback();
              }else{
                  let that=this;
                  let base = httpConfig.getAxiosBaseConfig();
                  let headconfig = httpConfig.getTestHeaderConfig(that.dbname);
                  httpajax.create(base)({
                      method: 'get',
                      url: '/SysUser/GetCheckMsgCode?phone='+that.registerForm1.phone+'&type=register&code='+value,
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
            let validStreet=(rule,value,callback)=>{
                /*provincevalue: '',
                    cityvalue: '',
                    countyvalue: '',
                    streetvalue: '',*/
                if(this.registerForm2.provincevalue==''){
                    callback(new Error('请选择省'))
                }else if(this.registerForm2.cityvalue==''){
                    callback(new Error('请选择城市'))
                }else if(this.registerForm2.countyvalue==''){
                    callback(new Error('请选择县'))
                }else if(this.registerForm2.streetvalue==''){
                    callback(new Error('请选择街道'))
                }else if(value==''||value==undefined){
                    callback()
                }else{
                    callback()
                }
            };
            let validPwd=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    let reg=/^(?=.*[A-Za-z!@#\$%\^&\*\(\)])([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    if(!reg.test(value)){
                        callback(new Error('6-12位且至少包含一个字母或其他字符'))
                    }else{
                        callback()
                    }
                    /*let oldLength=value.length;
                    let newLength=value.replace(/\s*!/g,"").length;
                    if(oldLength<6||oldLength>12){
                        callback(new Error('密码长度应在6-12位之间'))
                    }else {
                        if (oldLength > newLength) {
                            callback(new Error('密码不得包含空格'))
                        }else{
                            callback()
                        }
                    }*/
                }
            };
            let validPwdR=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                   if (value!=this.registerForm2.password){
                       callback(new Error('两次密码输入不一致'))
                   }else{
                       callback()
                   }
                }
            };
            return{
                serviceVisible:false,
                operateVisible:false,
                showMsgFlag:false,
                sysMsg:'',
                timertitle:'发送验证码',
                disabled:false,

                checkType:'1',//0-普通注册,1-邀请码注册
                registerForm1:{
                    dbbase:'',
                    name: '',
                    code:'',
                    phone:'',
                    phonecode:'',
                },
                registerRules1:{
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    code:[
                        {required:true,message:'请输入邀请码',trigger:'blur'}
                    ],
                    phone:[
                        {required:true,message:'请输入手机号',trigger:'blur'},
                        {required:true,validator:validMobile,trigger:'blur'}
                    ],
                    phonecode:[
                        {required:true,message:'请输入验证码',trigger:'blur'},
                        {required:true,validator:validCode,trigger:'blur'}
                    ],
                },
                registerForm2:{
                    company:'',
                    provincevalue: '',
                    cityvalue: '',
                    countyvalue: '',
                    streetvalue: '',

                    addressDetail:'',
                    password: '',
                    confirmpassword:'',

                    orgid:'',
                },
                registerRules2:{
                    company:[
                        {required:true,message:'请输入企业/单位名称',trigger:'blur'}
                    ],
                    addressDetail:[
                        {required: true,validator:validStreet,trigger:'blur'},
                        {required:true,message:'请输入详细地址',trigger:'blur'}
                    ],
                    password :[
                        {required: true,validator:validPwd,trigger:'blur'},
                        {required: true, message: '请输入密码', trigger: 'blur'},

                    ],
                    confirmpassword :[
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {required: true,validator:validPwdR,trigger:'blur'}
                    ]
                },

                province: [],
                city: [],
                county: [],
                street: [],
                showArea:'selectArea',
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
            }
        },
        components: {countdownpop},
        mounted(){
            this.searchArea(0,0);
            this.otherSetting();
            this.GetDbArea();
        },
        computed:{
            picUrl:function(){
                return config.baseurl;
            },
            ...mapState({
                lang: state => state.lang,
                theme: state => state.theme,
                dbname:state => state.user.dbname
            }),
        },


        methods:{
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
            //获取其他设置数据
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
            backToLogin:function(val){
                if(this.showArea=='selectArea'){
                    this.$router.push({name: 'login'});
                }else{
                    this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                    this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                    this.searchArea(0,0);
                    this.showArea="selectArea";
                }

            },
            showMsg:function(){
              this.showMsgFlag=true;
            },
            hideMsg:function(){
                this.showMsgFlag=false;
            },


            changeshowArea:function(val,type){

                if(type!=undefined){
                    this.checkType=type;
                }
                if(val=='firstStep'){
                    this.showArea=val;
                }
                if(val=='secondStep'){

                    if(this.checkType==0){
                        this.registerRules1.code[0].required=false;
                        this.registerRules1.name[0].required=true;
                        this.registerRules2.addressDetail[0].required=true;
                        this.registerRules2.addressDetail[1].required=true;
                        this.registerRules2.company[0].required=true;
                    }else{
                        this.registerRules1.code[0].required=true;
                        this.registerRules1.name[0].required=false;
                        this.registerRules2.addressDetail[0].required=false;
                        this.registerRules2.addressDetail[1].required=false;
                        this.registerRules2.company[0].required=false;
                    }
                    this.$refs.validFormF.validate((valid) => {
                        if(valid){
                            if(this.checkType==0){
                                this.showArea=val;
                            }else{
                                this.codeRegister();
                            }

                        }
                    })
                }
                if(val=='sub'){
                    console.log(this.registerRules2);
                    if(this.checkType==1){
                        this.registerRules2.addressDetail=[];
                    }
                    this.$refs.validFormS.validate((valid) => {
                        if(valid){
                            let loading=this.$loading();
                            if(this.checkType==0){
                                this.showArea=val;
                                let userInfo={
                                    'RealName':this.registerForm1.name,
                                    'Account':this.registerForm1.phone,
                                    'MobilePhone':this.registerForm1.phone,
                                    'Password':this.registerForm2.password
                                }, orgInfo={
                                    'OrgName':this.registerForm2.company,
                                    'Province': this.registerForm2.provincevalue,
                                    'City': this.registerForm2.cityvalue,
                                    'County':this.registerForm2.countyvalue,
                                    'Street':this.registerForm2.streetvalue,
                                    'Address':this.registerForm2.addressDetail
                                };
                                // )
                                let base=httpConfig.getAxiosBaseConfig();
                                //测试的Header
                                let headconfig=httpConfig.getTestHeaderConfig(this.dbname);
                                httpajax.create(base)({
                                    method: 'post',
                                    url: '/SysUser/PostRegister',
                                    data: qs.stringify({
                                        'userInfo':userInfo,
                                        'orgInfo':orgInfo
                                    }),
                                    headers:headconfig
                                }).then(res => {
                                    loading.close();
                                    res=qs.parse(res);
                                    res=JSON.parse(res.data);
                                    console.log(res);
                                    if(res.Status=='success'){
                                        this.$message('注册成功!');
                                        this.loginAc(res.KeyCodes[0]);

                                        //this.$router.push({ path: "/login"})
                                    }else{
                                        this.$message(res.Msg);
                                        this.showArea='selectArea';
                                        this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                                        this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                                        this.searchArea(0,0);
                                    }
                                }).catch(err => {
                                    loading.close();
                                    this.$message('注册失败!');
                                    this.showArea='selectArea';
                                    this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                                    this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                                    this.searchArea(0,0);
                                    console.log(err)
                                })
                            }else{
                                let data={
                                    uid:0,
                                    Phone:this.registerForm1.phone,
                                    NewPwd:this.registerForm2.password
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
                                    res=qs.parse(res);
                                    console.log(res);
                                    res=JSON.parse(res.data);
                                    console.log(res);
                                    if(res.Status=='success'){
                                        this.$message('注册成功');
                                        this.loginAc(this.registerForm2.orgid);

                                        //this.$router.push({ path: "/login"})

                                    }else{
                                        this.$message('注册失败!');
                                        this.showArea='selectArea';
                                        this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                                        this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                                        this.searchArea(0,0);
                                    }
                                }).catch(err=>{
                                    loading.close();
                                    this.$message('注册失败!');
                                    this.showArea='selectArea';
                                    this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                                    this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                                    this.searchArea(0,0);
                                    console.log(err);
                                })
                            }
                        }
                    })
                }

            },
            loginAc:function(orgid){
                console.log(orgid);
                var _$this=this;
                const loading = this.$loading({
                    lock: true,
                    text: '正在登录.....',
                    spinner: 'el-icon-loading'
                });
                //登录参数
                var logpara2={
                    name: _$this.registerForm1.phone,
                    password: _$this.registerForm2.password,
                    orgid: orgid
                };
                console.log(logpara2);
                //获取配置信息
                var configPara2={
                    userid:'',
                    orgid:orgid,
                    year:''
                };

                httpajax.all([_$this.login(logpara2), _$this.businessConfig(configPara2)])
                    .then(httpajax.spread(function (res, perms) {

                        //两个请求现已完成
                        if(res.Status==="success"){

                            //加载菜单信息
                            let param={
                                userid:res.Data.userInfo.PhId,
                                orgid:res.Data.orgInfo.PhId
                            };

                            _$this.GetAllRoleauthorize(param);  //按钮权限
                            _$this.$store.dispatch('user/getNavList', param).then((navList) => {
                                loading.close();
                                _$this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                                _$this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                                _$this.searchArea(0,0);
                                if(res.Data.orgInfo.EnCode){
                                    //根据不同的角色显示不同的首页
                                    _$this.getDifferenRole('0','0', res.Data.userInfo.PhId, res.Data.orgInfo.PhId)

                                }else{
                                    _$this.$router.push('/system/organization') //跳转主页
                                }
                            })
                        } else {
                            loading.close();
                            _$this. registerForm1={name: '',code:'',phone:'',phonecode:'',};
                            _$this.registerForm2={company:'',provincevalue: '',cityvalue: '',countyvalue: '',streetvalue: '',addressDetail:'',password: '',confirmpassword:'',}
                            _$this.searchArea(0,0);
                            _$this.$router.push({ path: "/login"})
                            _$this.$message({ showClose: true, message: res.Msg, type: 'error' })
                        }
                    })).catch(error => {
                    loading.close();
                    console.log(error);
                });
            },
            getDifferenRole:function(uid, orgId, userId, organizeId){
                let base = httpConfig.getAxiosBaseConfig();
                let headconfig = httpConfig.getTestHeaderConfig(this.dbname);
                httpajax.create(base)({
                    method: 'get',
                    url: '/SysRole/GetSysRoleListByUser?uid='+uid+'&orgid='+orgId+'&UserId='+userId+'&OrganizeId='+organizeId,
                    headers: headconfig
                }).then(res => {
                    this.roleList = JSON.parse(res.data).Record;
                    if(this.roleList.length > 0){
                        for(let i =0; i< this.roleList.length; i++){
                            if(this.roleList[i].EnCode == '004'){
                                this.roleFlam = 2;
                            }
                            if(this.roleList[i].EnCode == 'admin'){
                                this.roleFlam = 3;
                            }
                            if(this.roleList[i].EnCode == '001'){
                                this.roleFlam = 1;
                                break;
                            }
                        }
                    }
                    if(this.roleFlam == 1){
                        this.$router.push('/home') //跳转主页
                    }else if(this.roleFlam == 2){
                        this.$router.push('/system/account') //跳转主页
                    }else {
                        this.$router.push('/admin/orgin') //跳转主页
                    }
                    console.log(this.roleList);
                }).catch(err=>{
                    console.log(err);
                })
            },
            check:function(val){
                console.log(val);
                this.checkType=val;
            },
            sendCode:function(){
                this.$refs.validFormF.validateField('phone',(validMessage)=> {
                    if (validMessage) {
                        this.$message(validMessage);
                    } else {
                        if (!this.disabled) {
                            this.disabled = true;
                                this.getPhoneCode('register', this.registerForm1.phone);
                                this.timer(59);
                                document.getElementById('timerArea').innerText = '59S后重新发送';


                        }
                    }
                })
            },
            /*
       * 手机验证码获取接口
       * type:类型
       * phone:手机号
       * */
            getPhoneCode:function(type,phone) {
                let base = httpConfig.getAxiosBaseConfig();
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
            //邀请码注册
            codeRegister:function(){
                let base = httpConfig.getAxiosBaseConfig();
                let headconfig = httpConfig.getTestHeaderConfig(this.dbname);
                httpajax.create(base)({
                    method: 'get',
                    url: '/SysUser/GetCheckInvitationCode?Phone='+this.registerForm1.phone+'&InvitationCode='+this.registerForm1.code,
                    headers: headconfig
                }).then(res => {
                    let data=JSON.parse(res.data);
                    if(data.Status=='error'){
                        this.$message(data.Msg);
                        this.registerForm1.code='';
                    }else{
                        this.registerForm2.addressDetail=data.orgs[0].Address;
                        this.registerForm2.company=data.orgs[0].OrgName;
                        this.registerForm2.orgid=data.orgs[0].PhId;

                        this.searchAreaDetail(data.orgs[0].Province,0);
                        this.searchAreaDetail(data.orgs[0].County,2);
                        this.searchAreaDetail(data.orgs[0].City,1);
                        this.searchAreaDetail(data.orgs[0].Street,3);

                        this.showArea='secondStep';

                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            timer:function(t){
                    let that=this;
                    t--;
                    setTimeout(function(){
                        if(t>0){

                            document.getElementById('timerArea').innerText =t+'S后重新发送';
                            that.timer(t);
                        }else{
                            that.disabled=false;
                            document.getElementById('timerArea').innerText ='重新发送验证码';
                        }
                    },1000)
            },
            //查询具体城市
            searchAreaDetail:function(areaId,type){
                let base=httpConfig.getAxiosBaseConfig();
                //测试的Header
                let headconfig=httpConfig.getTestHeaderConfig(this.dbname);
                httpajax.create(base)({
                    url: "/SysArea/GetAreaName?areaId="+areaId,
                    method: "get",
                    headers:headconfig
                }).then(res=>{
                    console.log(res);
                    switch (type) {
                        case 0:
                            {this.registerForm2.provincevalue=res.data;break};
                        case 1:
                            {this.registerForm2.cityvalue=res.data;break};
                        case 2:
                            {this.registerForm2.countyvalue=res.data;break};
                        case 3:
                            {this.registerForm2.streetvalue=res.data;break};
                        default:{
                            break;
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            //根据手机号获取数据库
            getDbByPhone:function(){
                let account=this.registerForm1.phone;
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

            /*获取对饮地区数据库*/
            getDb:function(areaCode){
                let base=httpConfig.getAxiosBaseConfig();
                //测试的Header
                let headconfig=httpConfig.getTestHeaderConfig(this.dbname);
                httpajax.create(base)({
                    url: "/SysDBbase/GetSysDBbase?id="+areaCode,
                    method: "get",
                    headers:headconfig
                }).then(res=>{
                    console.log(res);
                    let data=JSON.parse(res.data);
                    this.$store.commit("user/setDbName", {
                        dbname:data.DbName,
                        areacode:data.AreaCode,
                    })
                }).catch(err=>{
                    console.log(err);
                })
            },
        //    查询省市县街道
            searchArea:function(val,level){
                let that=this;
                let base=httpConfig.getAxiosBaseConfig();
                //测试的Header
                let headconfig=httpConfig.getTestHeaderConfig(this.dbname);
                httpajax.create(base)({
                    url: (val==0?"/SysArea/GetAreaList2?id=":"/SysArea/GetAreaList?id=")+val,
                    method: "get",
                    headers:headconfig
                }).then(
                    function(res){
                        let time=JSON.parse(res.data);
                        res=time;
                        if(level==0){
                            that.province=res;
                            that.city=[];
                            that.county=[];
                            that.street=[];
                            that.registerForm2.provincevalue='';
                            that.registerForm2.cityvalue='';
                            that.registerForm2.countyvalue='';
                            that.registerForm2.streetvalue='';
                        }else if(level==1){
                            that.getDb(val)
                            that.city=res;
                            that.county=[];
                            that.street=[];
                            that.registerForm2.cityvalue='';
                            that.registerForm2.countyvalue='';
                            that.registerForm2.streetvalue='';
                        }else if(level==2){
                            that.county=res;
                            that.street=[];
                            that.registerForm2.countyvalue='';
                            that.registerForm2.streetvalue='';
                        }else if(level==3){
                            that.street=res;
                            that.registerForm2.streetvalue=''
                        }else{
                        }
                    }
                )
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
            //关闭区域，数据库修改
            handDBClose(){
                this.dbbaseDialogVisible=false;
                this.registerForm1.dbbase==''
            },
            //保存区域数据信息
            saveDbBase(){
                if(this.registerForm1.dbbase==''){
                    this.$message({showClose: true, message: '请选择当前账号所在区域', type: "error"});
                    return
                };
                //this.$axios.get('/SysDBbase/GetSysDBbase')


                //更新当前的数据库缓存信息
                var dbdata=this.sysDB.filter(item =>{ return item.DbName==this.registerForm1.dbbase; });

                this.$store.commit("user/setDbName", {
                    dbname:dbdata[0].DbName,
                    areacode:dbdata[0].AreaCode,
                    account:this.registerForm1.phone,
                    userid:dbdata[0].UserId
                });

                this.dbbaseDialogVisible=false;
            },
        },
    }

</script>

<style scoped>
    .platformname{
        height:65px;
        line-height: 65px;
        font-weight: 800;
        font-size: 30px;
        display: inline-block;
        margin-left: 10px;
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
        background-color: #211f20;
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
        margin: 20px auto;
    }
    .card_content{
        text-align: center;
        margin: auto;
    }
    .card_content>div{
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(217, 217, 217);
        border-radius: 0px;
        width: 170px;
        height: 170px;
        background-color: transparent;
        margin: 10px;
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
        width: 120px;
        height: 33px;
        border-radius: 5px 5px;
        line-height: 33px;
        font-size: 16px;
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
        background-color: #2473EB;
        border: 1px solid #2473EB;
        color:white
    }
    .blueBtn_verify{
        background-color: #2473EB;
        border:0;
        color:white;
        display: inline-block;
        margin-left: 20px;
        font-weight: 100;
        font-size: 10pt;
        width: 130px;
    }
    .verifyCode{
        display: inline-block;
        background-color: rgb(36, 115, 235);
        color: white;
        position: absolute;
        bottom: 5px;
        width: 100px;
        right: 3px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
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
        bottom:5px
    }
    .sys-login .form-group .el-input{
        background:none;
        margin-left: 40px;
    }
    .sys-login .form-group .el-select .el-input .el-input__inner{
        padding: 10px;
        width: 100px;
    }
    .sys-login .form-group .el-select .el-input .el-input__inner:first-child{
        margin-left: 0px;
        padding-left: 10px;
    }
    .sys-login .form-group .el-input__inner{
        background-color: white;
        border: none;
        width: 345px;
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
