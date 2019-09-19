<template >
    <div class="home" style="background:#f4f4f4;" >
        <div class="Top_navigation">
            <div class="logo_box">
                <img :src="picUrl+settingInfo.platform.logo" />
            </div>
            <div :title="settingInfo.platform.platformname" class="logo_box platformname">
                {{settingInfo.platform.platformname}}
            </div>
            <!--<div id="div" class="search_box">-->
            <!--<img src="@/assets/img/fdj.png" style="margin:0;"/>-->
            <!--<div id="sou" class="sousuo" style="display:none;"></div>-->
            <!--</div>-->
            <div class="Sign_box">
                <img src="@/assets/images/finance/SAAS-01.png" />
                <div @click.stop="userDropDown=!userDropDown" class="userInfo" v-if="userinfo">
                    <div>{{username}}<div></div></div>
                    <ul :class="{userDropDown:userDropDown}">
                        <li>
                            <div>{{userinfo.RealName}}</div>
                            <div>({{userinfo.MobilePhone}})</div>
                        </li>
                        <li @click.stop="NavTo('finance')">进入平台</li>
                        <li @click.stop="editPawClick">修改密码</li>
                        <li @click.stop="logoutClick">退出登录</li>
                    </ul>
                </div>
                <p v-if="!userinfo">
                    <router-link style="color:#7fa409" to="/login">登录</router-link>
                </p>
                <p v-if="!userinfo">|</p>
                <p v-if="!userinfo">
                    <router-link style="color:#7fa409" to="/register">注册</router-link>
                </p>
            </div>
            <div class="contact_box">
                <img src="@/assets/images/finance/SAAS-03.png" />
                <p>{{setting.phone}}</p>
            </div>
        </div>



        <div class="decorate"></div>
        <div class="Broadcast_box" style="animation-delay:0.5s;">
            <div style="width: 1178px;margin-left: 11px; margin-top:4px; position: relative;" >
                <!-- <img src="@/assets/img/t1.jpg" style="position: absolute;width: 100%;height: 552px;"> -->
                <el-carousel height="552px" >
                    <el-carousel-item v-for="(item,index) in topPicList" :key="index">
                        <img :src="picUrl+item.Picpath" style="width: 100%;height: 100%">
                    </el-carousel-item>
                    <!--<el-carousel-item>-->
                    <!--<img src="@/assets/img/t1.jpg">-->
                    <!--</el-carousel-item>-->
                    <!--<el-carousel-item>-->
                    <!--<img src="@/assets/img/t2.jpg">-->
                    <!--</el-carousel-item>-->
                    <!--<el-carousel-item>-->
                    <!--<img src="@/assets/img/t3.jpg">-->
                    <!--</el-carousel-item>-->
                    <!--<el-carousel-item>-->
                    <!--<img src="@/assets/img/t4.jpg">-->
                    <!--</el-carousel-item>-->
                </el-carousel>
            </div>
        </div>
        <div class="Central_navigation" >
            <div @click.stop="NavTo('finance')" class="Finance"> <img src="@/assets/img/cai.png" />
                <h1>工会财务管理</h1>
            </div>
            <div @click.stop="NavTo('report')" class="data"> <img src="@/assets/img/shu.png" />
                <h1>数据直报平台</h1>
            </div>
        </div>
        <!--行业动态-->
        <template>
            <div id="Journalism" class="Journalism">
                <div class="biao">
                    <span>行业动态</span>
                    <img src="@/assets/img/b1-1.png" style="width:100%; margin-top:12px;" />
                    <p class="g" style="cursor: pointer;"  @click.stop="openNewsList('291190117000001')">更多</p>
                </div>
                <div class="Journalism_left">
                    <a href="http://www.zjtax.gov.cn/" target="_blank">
                        <div class="img_box">
                            <img :src="picUrl + trendPic.Picpath" v-if="trendPic.Picpath" style="width: 100%;height: 100%">
                            <!--<img src="@/assets/img/img1.png"/>-->
                        </div>
                        <div class="txt_box">
                            <h1 style="float:left;">新版企业所得税</h1>
                            <p>为进一步落实企业所得税优惠政策，统一规范企业所得税优惠事项的办理，根据《国家税务总局关于发布修订后的&lt;企业所得税优惠政策事项办理办法&gt;的公告》（国家税务总局公告2018年第23号，以下简称23号公告）的规定，结合我省实际，现就企业所得税优惠事项办理有关问题公告如下：</p>
                        </div>
                        <div class="txt_box1">
                            <p>一、凡享受企业所得税优惠政策的企业，均应按照23号公告执行。
                                　　           				二、享受集成电路生产企业、集成电路设计企业、软件企业、国家规划布局内的重点软件企业和集成电路设计企业等优惠事项的企业，应当在完成年度汇算清缴后，按照《企业所得税优惠事项管理目录》（2017年版）“后续管理要求”项目中列示的清单，通过省经信委的浙江省软件和信息服务业公共服务平台（网址：www.zjiip.org.cn）上传相关资料。相关资料不再单独报送税务机关。
                                　　            			三、本公告适用于2017年度汇算清缴及以后年度企业所得税优惠事项办理工作。《浙江省国家税务局 浙江省地方税务局关于企业所得税优惠事项办理问题的公告》（浙江省国家税务局 浙江省地方税务局公告2015年第10号）以及《浙江省国家税务局关于加强企业所得税优惠备案管理工作的通知》（浙国税发〔2017〕60号）同时废止。</p>
                        </div>
                    </a>
                </div>
                <div class="Journalism_right">
                    <ul>
                        <li v-for="(item,index) of proInfoList" :key="index" @click.stop="openUrl(item)">
                            <div>
                                <i class="list-dot"></i>
                                <p class="txt" style='cursor: pointer;'>{{item.Title}}</p>
                                <span class="r">{{item.PublishTime | formatDate('YYYY-MM-DD')}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </template>
        <!--<ind-info :industryInfo="industryInfo"></ind-info>-->
        <!--产品方案-->
        <template>
            <div id="Broadcast" class="Broadcast">
                <div style="float:left;width:70px;height:180px;background: #0183fd;color: #fff;font-size: 25px;padding: 5px 18px;text-align:center;margin: 10px 0 20px 15px;overflow: hidden">
                    产品方案
                </div>
                <div id="div1">
                    <ul>
                        <li><img src="@/assets/img/s1.png" /></li>
                        <li><img src="@/assets/img/s2.png" /></li>
                        <li><img src="@/assets/img/s3.png" /></li>
                        <li><img src="@/assets/img/s4.png" /></li>
                        <li><img src="@/assets/img/s1.png" /></li>
                    </ul>
                </div>
            </div>
        </template>
        <div id="policy" class="policy">
            <div class="b">
                <ul style="margin-left: 260px;">
                    <li @click.stop="typeclick('all')">
                        <i class="list-dot" :class="{ dotWhite:(active=='all') }"></i>
                        <a href="javascript:void(0);">全部</a>
                    </li>
                    <li @click.stop="typeclick('country')">
                        <i class="list-dot" :class="{ dotWhite:(active=='country') }"></i>
                        <a href="javascript:void(0);">国家</a>
                    </li>
                    <li @click.stop="typeclick('province')">
                        <i class="list-dot" :class="{ dotWhite:(active=='province') }"></i>
                        <a href="javascript:void(0);">省级</a>
                    </li>
                    <li @click.stop="typeclick('city')">
                        <i class="list-dot" :class="{ dotWhite:(active=='city') }"></i>
                        <a href="javascript:void(0);">市级</a>
                    </li>
                </ul>
            </div>
            <div class="policy_left" style="position:relative;">
                <div class="chuang">

                </div>
                <el-carousel indicator-position="none" height="400px" arrow="never">
                    <el-carousel-item v-for="(item,index) in bottomPicList" :key="index">
                        <a class="chuangCarousel" :href="item.Linkaddress?item.Linkaddress:'javascript:void(0)'">
                            <img :src="picUrl+item.Picpath" alt="" style="width: 100%;height: 100%">
                            <p>{{item.Title}}</p>
                        </a>
                    </el-carousel-item>
                    <!--<el-carousel-item>-->
                    <!--<a href="#"><img src="@/assets/img/n1.png" alt=""></a>-->
                    <!--</el-carousel-item>-->
                    <!--<el-carousel-item >-->
                    <!--<a href="#"><img src="@/assets/img/n2.jpg" alt=""></a>-->
                    <!--</el-carousel-item>-->
                    <!--<el-carousel-item >-->
                    <!--<a href="#"><img src="@/assets/img/n3.jpg" alt=""></a>-->
                    <!--</el-carousel-item>-->
                    <!--<el-carousel-item>-->
                    <!--<a href="#"><img src="@/assets/img/n4.jpg" alt=""></a>-->
                    <!--</el-carousel-item>-->
                </el-carousel>
            </div>
            <div class="policy_right">
                <ul>
                    <li v-for="(item,index ) of newsInfo" :key="index" @click.stop="openUrl(item)">
                        <div>
                            <i class="list-dot"></i>
                            <p class="txt" style='cursor: pointer;'>{{item.Title}}</p>
                            <span class="r">{{item.PublishTime | formatDate('YYYY-MM-DD')}}</span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="switch">
                <img src="@/assets/img/j1.png" style="margin-left: 402px;margin-top: 14px;" />
                <p :class="loading?'changenews-true':'changenews-false' "  @click.stop="changenewsList">换一批</p>
                <p style="margin-left: 8px;cursor: pointer;" @click.stop="openNewsList('291190117000002')">更多</p>
            </div>
        </div>
        <div id="bottom_box" class="bottom_box">
            <div class="bottom_box_left">
                <ul>
                    <li>
                        <h1 style="font-size: 24px;">联系方式</h1>
                        <img src="@/assets/img/t1.png" class="t1" />
                    </li>
                    <li>
                        <img src="@/assets/img/d1.png" />
                        <p>{{setting.phone}}</p>
                    </li>
                    <li>
                        <img src="@/assets/img/d2.png"  />
                        <p>{{setting.qq}}</p>
                    </li>
                    <li>
                        <img src="@/assets/img/d3.png"  />
                        <p>{{setting.fax}}</p>
                    </li>
                    <li>
                        <img src="@/assets/img/d4.png"  />
                        <p>{{setting.email}}</p>
                    </li>
                    <li>
                        <img src="@/assets/img/d5.png"  />
                        <p>{{setting.weburl}}</p>
                    </li>
                    <li>
                        <img  src="@/assets/img/d6.png" />
                        <p style="line-height: normal;margin-left: 28px;margin-top: -27px;">{{setting.address}}</p>
                    </li>
                </ul>
            </div>
            <div class="bottom_box_right">
                <ul>
                    <li>
                        <h1 style="font-size: 24px;">在线留言</h1>
                        <img src="@/assets/img/t1.png" class="t1" />
                    </li>
                    <li>
                        <p style="width: 65px;">姓名/单位</p>
                        <input v-model="messageOnline.Author" style="padding: 5px 10px" type="text" class="input_box" />
                    </li>
                    <li>
                        <p style="width: 65px;">联系方式</p>
                        <input v-model="messageOnline.Phone"  style="padding: 5px 10px;" type="text" class="input_box"  />
                    </li>
                    <li>
                        <p style="width: 65px;">需求描述</p>
                        <textarea v-model="messageOnline.Description" style="padding: 5px 10px" class="cha"></textarea>
                    </li>
                    <div @click="MsgCommit" class="btn1">提交</div>
                </ul>
            </div>
        </div>
        <div class="bottom_box1">
            <div style="width:1132px; height:295px; margin:auto auto 0;">
                <div style="width:566px; height:220px; float:left;">
                    <div class="zi" style="margin-top:70px;">
                        <h1 style="margin-left: 29px;cursor: pointer;" @click="serviceVisible = true">服务协议</h1>
                        <p>|</p>
                        <h1 style="cursor: pointer;" @click="operateVisible = true">免责声明</h1>
                    </div>
                    <div class="zi" style="margin-top: -2px;margin-left:87px;">
                        <a style="font-size: 20px;color: #fff;" href="http://www.newgrand.cn">关于新中大科技</a>
                        <a style="font-size: 20px;color: #fff;margin-left:43px;" href="http://www.gdataware.com">关于政云数据</a>
                    </div>
                </div>
                <div style=" width:566px; height:220px; float:right;">
                    <img :src="picUrl+settingInfo.linkus2.qq" class="g1" />
                    <img :src="picUrl+settingInfo.linkus2.wechat" class="g1" />
                </div>
                <div class="cc" >
                    <p>Copyright@ 1993-2018NEWGRAND.AII Rights Reserved</p>
                    <p>主办单位:{{settingInfo.copyright.hostunit}}</p>
                    <p>发行单位:{{settingInfo.copyright.publishunit}}</p>
                    <p>技术支持:{{settingInfo.copyright.supportunit}}</p>
                    <p>{{settingInfo.copyright.keeprecord}}</p>
                </div>
            </div>
        </div>
        <!-- el-dialog 弹出修改密码页面-->
        <el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" custom-class="editPawDialog">
            <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px" >
                <el-form-item label="旧密码" prop="oldPaw">
                    <el-input type="password" v-model="editPaw.oldPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPaw" id="newPaw">
                    <el-input type="password" key="inpNewPaw" v-model="editPaw.newPaw" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmNewPaw" >
                    <el-input type="password" key="inpConfirmNewPaw" v-model="editPaw.confirmNewPaw" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="textC">
                <el-button type="primary" @click="editPawSubmit">保存</el-button>
            </div>
        </el-dialog>

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
        <message :visible.sync="message.visible" :delay="message.delay" :message='message.message'></message>
    </div>
</template>

<script>

    import { mapState, mapActions } from 'vuex'
    import config from '@/util/ajaxConfig'
    import Auth from "@/util/auth";
    import md5 from 'js-md5'
    import desHelper from "@/util/desHelper"
    import {getOtherSetting} from '@/api/home'
import { debug } from 'util';
    // import indInfo from '@/components/home/industryInfo'
    export default {
        name: "home",
        data(){
            let validPaw=(rule,value,callback)=>{
                if(value==''||value==undefined){
                    callback()
                }else{
                    //let reg=/^([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    let reg=/^(?=.*[A-Za-z!@#\$%\^&\*\(\)])([0-9]|[a-z]|[A-Z]|!|@|#|\$|%|\^|&|\*|\(|\)){6,12}$/;
                    if(!reg.test(value)){
                        callback(new Error('不符合输入规则:6-12位且至少包含一个字母或其他字符'))
                    }else{
                        callback()
                    }
                }
            };
            return {
                loading: true,
                trendPic:'',
                bottomPicList:[], //公会之窗
                topPicList:[], //轮播图列表
                userDropDown:false, //修改密码弹窗
                dialog: {
                    editPaw: {
                        show: false
                    }
                },
                editPaw: {
                    oldPaw: "",
                    newPaw: "",
                    confirmNewPaw: ""
                },
                editPawRules: {
                    oldPaw: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
                    newPaw: [
                        { required: true, message: "请输入新密码", trigger: "blur" },
                        { required:true, validator:validPaw,trigger:'blur'}
                    ],
                    confirmNewPaw: [
                        { required: true, message: "请再次输入新密码", trigger: "blur" },
                        { required:true, validator:validPaw,trigger:'blur'}
                    ]
                },
                message: 2,
                userInfoHead:{},
                carouselImgs:[   //轮播图片
                    {url:'../../static/img/t1.jpg',index:1},
                    {url:'../../static/img/t2.jpg',index:2},
                    {url:'../../static/img/t3.jpg',index:3},
                    {url:'../../static/img/t4.jpg',index:4}
                ],
                orgWindow:{
                    imgUrl:'../assets/img/n1.png'
                },
                //页面数据
                nav:'',
                active:'all', //政策制度选中***
                proInfoList:[],
                newsInfo:[],
                pageSize: 7, //pageSize
                pageIndex: 1, //pageIndex
                total:0,
                serviceVisible:false,  //弹出服务协议
                operateVisible:false,  //弹出运营范围
                messageOnline:{   //在线留言
                    Description:'',
                    Phone:'',
                    Author:''
                },
                message:{
                    message:'',
                    visible:false
                },
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
                industryInfo:{}
            }
        },
        computed:{
            picUrl:function(){
                return config.baseurl;
            },
            ...mapState({
                uid: state => state.user.userid,
                username: state => state.user.username,
                orgcode: state => state.user.orgcode,
                orgid: state => state.user.orgid,
                roleInfo:state=>state.user.roleInfo,
                defultdbname:state=>state.user.defultdbname
            }),
            userinfo:function(){
                var user=Auth.getUserInfoData();

                if(user){
                    return user.userInfo
                }
            }
        },
        created() {
            //this.getHomeSetting();
            this.otherSetting();
        },
        mounted(){
            this.getTrendPic();
            this.getBottomPicList();
            this.getTopPicList();
            this.getnewsInfo();
            this.getproInfoList();

        },
        methods:{
            ...mapActions({
                sysLogout: "user/logout",
                GetNewsList: "news/GetNewsList",
                msgCommit:"news/MsgCommit"
            }),
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
            //跳转工会****
            NavTo(str){
                if(!this.userinfo){
                    this.$router.push({path:'/login'});
                }else{
                    // if(str=='finance'){  //工会财务****************暂时没有数据直报
                    //
                    // }else{  //数据直报
                    //
                    // }
                    var data = {
                        orgId: this.orgid,
                        userId: this.uid
                    };
                    this.$axios
                        .get("SysRole/GetDefaultPageByRoles", { params: data })
                        .then(res => {
                            if (res.UrlAddress == null || res.UrlAddress == '') {
                                this.$message.error("当前用户还未赋予有页面的菜单权限，请联系管理员!");
                            } else {
                                this.$router.push({path:res.UrlAddress});
                            }
                        })
                        .catch(err => {
                            this.saasMessage = {
                                message: "获取默认页面失败了!",
                                visible: true
                            };
                        });
                }
            },
            //获取行业动态图片
            getTrendPic(){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    pagesize: '20',
                    pageindex: '0',
                    PositionType: 'bottom',
                    Title: '行业动态',
                    Publish:'2',
                    defultdbname:true
                };
                this.$axios.get('/SysPicture/GetSysPictureQueryList', {params: data})
                    .then(res => {
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        console.log(res);
                        if(res.list.length > 0){
                            this.trendPic = res.list[0];
                        }
                        //this.bottomPicList = res.list;
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({showClose: true, message: "公会之窗获取错误", type: "error"});
                    })
            },
            //获取工会之窗图片
            getBottomPicList(){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    pagesize: '20',
                    pageindex: '0',
                    PositionType: 'bottom',
                    Title: '工会之窗',
                    Publish:'2',
                    defultdbname:true
                };
                this.$axios.get('/SysPicture/GetSysPictureQueryList', {params: data})
                    .then(res => {
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        this.bottomPicList = res.list;
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({showClose: true, message: "公会之窗获取错误", type: "error"});
                    })
            },
            //获取动态轮播图
            getTopPicList(){
                let data = {
                    uid: this.uid,
                    orgid: this.orgid,
                    pagesize: '20',
                    pageindex: '0',
                    PositionType: 'top',
                    Publish:'2',
                    defultdbname:true
                };
                this.$axios.get('/SysPicture/GetSysPictureQueryList', {params: data})
                    .then(res => {
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }
                        this.topPicList = res.list;
                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({showClose: true, message: "轮播图获取错误", type: "error"});
                    })
            },
            //获取政策制度信息
            getnewsInfo(type){
                var parames={
                    value:291190117000002,
                    pageindex:this.pageIndex-1,
                    pagesize:this.pageSize,
                    queryfilter:{
                        "LevelType*num*eq":type,  //制度级别(1-国家,2-省级,3-市级)
                        "Publish*num*eq":1,  //发布状态
                    },
                    defultdbname:true
                };
                this.loading=false;
                this.GetNewsList(parames).then(res => {
                    this.loading=true;
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }
                    this.newsInfo=res.List;
                    this.total=Number(res.Total);
                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '新闻获取失败', type: 'error'})
                })

            },
            //获取行业动态信息
            getproInfoList(){
                var parames={
                    value:291190117000001,
                    pageindex:0,
                    pagesize:6,
                    queryfilter:{
                        "Publish*num*eq":1,  //发布状态
                    },
                    defultdbname:true
                };

                this.GetNewsList(parames).then(res => {
                    if (res.Status === 'error') {
                        this.$message.error(res.Msg);
                        return
                    }

                    this.proInfoList=res.List;

                }).catch(error => {
                    console.log(error);
                    this.$message({showClose: true, message: '新闻获取失败', type: 'error'})
                })
            },
            //获取网站的配置信息
            getHomeSetting(){
                this.$axios.get('/SysToken/GetHomeSetting', {defultdbname:true})
                    .then(res => {
                        if (res.Status === 'error') {
                            this.$message.error(res.Msg);
                            return
                        }

                        console.log(res.Data);
                        if(res.Data.length>0){
                            this.setting.phone = res.Data[0]||'0571-88270588';
                            this.setting.qq = res.Data[1]||'2749634478';
                            this.setting.fax = res.Data[2]||'0571-88290562';
                            this.setting.email = res.Data[3]||'zhengyun@newgrand.cn';
                            this.setting.weburl = res.Data[4]||'www.gdataware.com';
                            this.setting.address = res.Data[5]||'杭州市拱墅区祥园路88号中国（杭州）智慧信息产业园N座9F';
                        }

                    })
                    .catch(err => {
                        console.log(err)
                        this.$message({showClose: true, message: "配置获取错误", type: "error"});
                    })
            },
            logoutClick() {
                //退出事件
                this.sysLogout().then(() => {
                    this.$router.push("/login");
                });
            },
            //打开网址
            openUrl(object){
                //window.open(object.url);
                this.$router.push({path: '/news/view', query: { phid:object.PhId,type:'index',typePhid:object.PhIdType }});
            },
            //更换一批新闻
            changenewsList(){
                this.loading=false;
                var pagetotal=this.pageSize * this.pageIndex;
                if(pagetotal < this.total){
                    this.pageIndex = this.pageIndex+1;
                    //this.typeclick(this.active)

                    if(this.active==='country') {
                        this.getnewsInfo('1')
                    }else if(this.active==='province'){
                        this.getnewsInfo('2')
                    }else if(this.active==='city'){
                        this.getnewsInfo('3')
                    }else if(this.active==='all'){
                        this.getnewsInfo('')
                    }

                }else{

                    this.$message({showClose: true, message: '新闻已经没有', type: 'warning'})
                    this.loading=true;
                }

            },
            //新闻 更多页面
            openNewsList(typeid){
                this.$router.push({path: '/news/list', query: { typePhid:typeid }});
            },
            typeclick(object){
                //alert(object);
                this.active=object;
                this.pageIndex=1;

                if(object==='country') {
                    this.getnewsInfo('1')
                }else if(object==='province'){
                    this.getnewsInfo('2')
                }else if(object==='city'){
                    this.getnewsInfo('3')
                }else if(object==='all'){
                    this.getnewsInfo('')
                }

            },
            //修改密码
            editPawClick(){
                this.editPaw.oldPaw="";
                this.editPaw.newPaw="";
                this.editPaw.confirmNewPaw="";
                this.dialog.editPaw.show=true
            },
            //修改密码提交
            editPawSubmit() {
                this.$refs.editPaw.validate(valid => {
                    if (valid) {
                        if (this.editPaw.newPaw!= this.editPaw.confirmNewPaw) {
                            console.log("新密码与确认新密码不一致!");
                            this.$message.error("新密码与确认新密码不一致!");
                            return;
                        }

                        var oldPwd = md5(this.editPaw.oldPaw);
                        var newPwd = desHelper.Encrypt(this.editPaw.newPaw,oldPwd);

                        //接口要包含3个参数： uid、 oldPwd、 newPwd
                        let data={
                            uid:this.uid,
                            orgid:this.orgid,
                            OldPwd: oldPwd,
                            NewPwd: newPwd
                        };
                        this.$axios.post('/SysUser/PostUpdatePassword',data)
                            .then(res=>{
                                if (res.Status=='success'){
                                    this.$message.success("密码修改成功!");
                                    this.dialog.editPaw.show = false;
                                    this.editPaw.oldPaw="";
                                    this.editPaw.newPaw="";
                                    this.editPaw.confirmNewPaw="";
                                    this.$router.push("/login");
                                }

                                if (res.Status=="error"){
                                    this.$message.error(res.Msg);
                                    return false;
                                }
                            })
                            .catch(err=>console.log(err));

                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            //提交在线留言
            MsgCommit(){
                var data={
                    infoData:this.messageOnline,
                    nowTimeRandom:(new Date()).getTime(),
                    defultdbname:true
                }
                const loading=this.$loading();
                this.msgCommit(data).then(res => {
                    if(res.Status=='success'){
                        this.message={
                            message:'已将留言发送给工作人员,后续会与您联系!',
                            visible:true
                        }
                        this.messageOnline={
                            Description:'',
                            Phone:'',
                            Author:''
                        }
                    }else{
                        this.message={
                            message:res.Msg,
                            visible:true
                        }
                    }
                    loading.close();
                }).catch(error => {
                    console.log(error);
                    loading.close();
                    this.$message({showClose: true, message: "提交留言失败了!", type: "error"});
                })
            }
        },
        components:{
            // indInfo
        }
    }


</script>

<style lang="scss" scoped>
    .fwxy{
        width: 100%;
        height: 500px;
        overflow: auto;
    }
    .fwxy h3{
        margin: 20px 0;
        font-weight: 600;
        font-size: 16px;
    }
    .fwxy p{
        text-indent: 2em;
    }
    .fwxy ul li{
        margin: 10px 0px;
    }
    .fwxy ul li ul li{
        margin: 5px 0px;
        text-indent: 1em;
    }
    .Top_navigation {
        width: 1177px;
        height: 70px;
        margin: auto auto 0;
    }
    .logo_box {
        max-width: 500px;
        float: left;
        height: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .logo_box img {

        height:65px;

    }
    .logo_box,.platformname{
        height:65px;
        line-height: 65px;
        font-weight: 800;
        font-size: 30px;
    }
    .search_box {
        position:relative;
        float: right;
        z-index:50;
        width: 70px;
        height: 70px;
        background: rgba(0,0,0,0.5);
    }
    .sousuo{
        width: 245px;
        height: 40px;
        border-radius: 8px;
        position: absolute;
        background: #fff;
        right: 2px;
        bottom: -48px;
        z-index:50;
    }
    .nm{
        animation: flipInX 1s ease;
        animation-fill-mode: backwards;
    }
    .bottom_box {
        background: #282828;
        width: 1120px;
        margin: 15px auto 0;
        height: 360px;
        padding-left: 10px;
        padding-right: 7px;
        padding-top: 19px;
        padding-bottom: 10px;
    }
    .input_box{
        width:200px;
        height:30px;
        border: none;
        margin-top:4px;
        margin-left:9px;
        outline:none;
        color: #505050;
        line-height:none;
    }
    .search_box img {
        display: block;
        margin: 14px auto 0;
    }.Sign_box {
         float: right;
         width: 140px;
         height: 70px;
     }
    .Sign_box * {
        float: left;
    }
    .Sign_box p {
        font-size: 16px;
        line-height: 70px;
        color: #7fa409;
        margin-left: 5px;
    }
    .Sign_box img {
        width: 25%;
        margin-top: 17px;
    }
    .contact_box {
        width: 200px;
        float: right;
        height: 70px;
    }
    .contact_box * {
        float: left;
    }
    .policy {
        width: 1132px;
        height: 443px;
        margin: 15px auto 0;
        background: url(../assets/img/q6.png);
        background-size: 100%;
        padding-left: 16px;
        padding-right: 13px;
        padding-top: 19px;
        padding-bottom: 10px;
    }
    .chuang{
        position:absolute;
        right:-9px;
        top:-9px;
        width:136px;
        height:118px;
        background: url(../assets/img/g1.png);
        z-index:999;
    }
    .contact_box p {
        font-size: 16px;
        line-height: 70px;
        color: #7fa409;
        margin-left: 5px;
    }
    .contact_box img {
        width: 17%;
        margin-top: 17px;
        margin-left: 23px;
    }
    .decorate {
        background: #0183fd;
        width: 100%;
        height: 490px;
        margin-top: 35px;
        position: relative;
        overflow: hidden;
        animation: a 0.5s;
    }
    .decorate img {
        position: absolute;
    }
    .Broadcast_box {
        position: absolute;
        top: 70px;
        width: 1200px;
        height: 629px;
        left: 50%;
        margin-left: -600px;
        background:url(../assets/img/q1.png);
        animation: flipInX 1s ease;
        animation-fill-mode: backwards;
    }
    .policy_left {
        width: 545px;
        height: 400px;
        float: right;
    }
    .bottom_box1 {
        background: #282828;
        width: 100%;
        margin: 15px auto 0;
        height: 350px;
    }
    .decorate {
        background: #0183fd;
        width: 100%;
        height: 490px;
        margin-top: 35px;
        position: relative;
        overflow: hidden;
        animation: a 0.5s;
    }
    .sousuo{
        width: 245px;
        height: 40px;
        border-radius: 8px;
        position: absolute;
        background: #fff;
        right: 2px;
        bottom: -48px;
        z-index:50;
    }
    .nm{
        animation: flipInX 1s ease;
        animation-fill-mode: backwards;
    }
    .Journalism {
        width: 1132px;
        height: 335px;
        background: url(../assets/img/q6.png);

        margin: 50px auto 0;
        background-size: 100% 100%;
        padding-left: 16px;
        padding-right: 13px;
        padding-top: 19px;
        padding-bottom:10px;
    }
    .Central_navigation {
        width: 1130px;
        height: 160px;
        margin: auto auto 0;
        margin-top: 117px;
    }
    .Finance {
        float: left;
        width: 550px;
        height: 192px;
        background: url(../assets/img/q6.png);
        background-size: 100% 100%;
        cursor:pointer;
    }
    .data * {
        float: left;
        cursor:pointer;
    }
    .data img {
        width: 20%;
        margin-top: 53px;
        margin-left: 77px;
    }
    .data h1 {
        line-height: 192px;
        margin-left: 20px;
        font-weight: 400;
        font-size: 40px;
        color: #7fa409;
    }
    .Finance * {
        float: left;
    }
    .Finance img {
        width: 20%;
        margin-top: 53px;
        margin-left: 77px;
    }
    .Finance:hover img{
        animation: a1 .5s;
        animation-fill-mode:forwards;
    }

    .Finance:hover h1{
        animation: a2 .5s;
        animation-fill-mode:forwards;
    }
    .Finance h1 {
        line-height: 192px;
        margin-left: 20px;
        font-weight: 400;
        font-size: 40px;
        color: #7fa409;
        transition:opacity .2s;
    }
    .data {
        float: right;
        width: 550px;
        height: 192px;
        background: url(../assets/img/q6.png);
        background-size: 100% 100%;
    }
    .data:hover img{
        animation: a1 .5s;
        animation-fill-mode:forwards;
    }

    .data:hover h1{
        animation: a2 .5s;
        animation-fill-mode:forwards;
    }
    @keyframes a1{
        0%{
            margin-left: 77px;
        }
        100%{
            margin-left: 223px;
        }
    }

    @keyframes a2{
        0%{
            margin-left: 20px;
            opacity:1;
        }
        100%{
            margin-left: -170px;
            opacity:0;
        }
    }
    @keyframes a {
        0%{
            margin-left:-2000px;
        }
        100%{
            margin-left:0px;
            //  background:
        }
    }
    @keyframes flipInX {
        0% {
            -webkit-transform: perspective(400px) rotateX(90deg);
            transform: perspective(400px) rotateX(90deg);
            opacity: 0;
        }
        40%{
            -webkit-transform: perspective(400px) rotateX(-10deg);
            transform: perspective(400px) rotateX(-10deg);
        }
        70%{
            -webkit-transform: perspective(400px) rotateX(10deg);
            transform: perspective(400px) rotateX(10deg);
        }
        100%{
            -webkit-transform: perspective(400px) rotateX(0deg);
            transform: perspective(400px) rotateX(0deg);
            opacity: 1;
        }
    }
    .Journalism_left {
        width: 545px;
        height: 266px;
        float: left;
    }
    .Journalism_right {
        width: 545px;
        height: 266px;
        float: right;
    }
    .img_box {
        width: 270px;
        height: 175px;
        float: left;
    }
    .img_box img {
        width: 100%;
        height: 100%;
    }
    .txt_box {
        float: right;
        width: 266px;
        height: 175px;
        overflow: hidden;
    }
    .Broadcast {
        width: 1132px;
        overflow: hidden;
        margin: 15px auto 0;
        background: url(../assets/img/q6.png);
        height: 200px;
        background-size: 100% 100%;
    }
    .txt_box h1 {
        float: left;
        font-size: 20px;
        display: block;
        max-height: 45px;
        overflow: hidden;
        color: #3ea0af;
    }
    .txt_box p {
        float:left;
        font-size:13px;
        margin-top:2px;
        color: #a0a0a0;
        height:150px;
        line-height:25px;
    }
    .txt_box1 {
        width:545px;
        float:left;
        height:79px;
        overflow:hidden;
    }
    .txt_box1 p {
        float:left;
        font-size:13px;
        color:#a0a0a0;
        height:78px;
        line-height:25px;
    }
    .Journalism_right ul {
        width:100%;
        height:100%;
        overflow:hidden;
    }
    .Journalism_right ul li {
        width:545px;
        height:40px;
        margin-top:3px;
        float:left;
        color:#505050;
    }
    .k {
        width:9px;
        overflow:hidden;
        font-size:25px;
        line-height:40px;
        float:left;
    }
    .txt {
        width:430px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        float:left;
        margin-left:8px;
        line-height:40px;
        padding-left:6px;
        transition:box-shadow 0.4s;
        color: #737373;
    }
    .r {
        float: right;
        line-height:40px;
    }
    .Journalism_right ul li:hover p {
        color: #3ea0af;
        box-shadow: 0px 3px 10px #888888;
    }
    .biao {
        width:1103px;
        height:50px;
        float:left;
        position:relative;
    }
    .biao>span{
        position:absolute;
        left:1px;
        top:12px;
        font-size: 19px;
        padding-left: 5px;
        background-color:rgb(1, 131, 253);
        color: #ffffff;
    }
    .biao>span:after{
        position:absolute;
        content:"";
        border:19px solid transparent;
        border-right-color: #0183fd;
        right: -19px;
        top: 8px;
        transform: rotate(-45deg);
    }
    .g {
        position: absolute;
        right:0;
        top:15px;
        font-size:15px;
        color:#2196f3;
    }
    .img_box1 {
        float:left;
        height:90%;
        margin-top:9px;
        margin-left:7px;
    }
    #div1 {
        float:left;
        width:950px;
        height:130px;
        position:relative;
        border:#d6d6d6 1px solid;
        top: 39px;
        overflow: hidden;
        left:45px;
    }
    #div1 ul {
        position: absolute;
        left:0;
        top:0;
    }
    #div1 ul li {
        width:178px;
        height:128px;
        float:left;
        list-style:none;
        margin-left:26px;
    }
    #div1 ul li img {
        width:100%;
        height:87%;
        margin-top:8px;
    }
    .y {
        position:absolute;
        top:3px;
        /* display: none; */
        left:11px;
        z-index:1;
        width:98.2%;
        height:88%;
        z-index:1;
    }
    .policy_right {
        width: 545px;
        height: 315px;
        float: left;
    }
    .policy_right ul {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .policy_right ul li {
        width: 545px;
        height: 40px;
        margin-top: 3px;
        float: left;
        color: #505050;
    }
    .policy_right ul li:hover p {
        color: #3ea0af;
        box-shadow: 0px 3px 10px #888888;
    }
    .b {
        width:545px;
        height:33px;
        float:left;
        background: url(../assets/img/b2.png);
    }
    .niu{
        width:100% !important;
        height:35px !important;
        position:absolute !important;
        right:0 !important;
        bottom:0px !important;
        left:0 !important;
        z-index:10 !important;
        padding-top:0 !important;
        padding-bottom:0 !important;
        color:#fff !important;
        text-align:center !important;
        text-shadow:0 1px 2px rgba(0,0,0,.6) !important;
        line-height:35px;
        font-size:14px !important;
        background:rgba(0,0,0,0.5);
    }

    .yindao{
        width:100%;
        height:100%;
        position:fixed;
        top:0;
        left:0;
        z-index:100;
        background: #fff;
    }
    .b ul li{
        float:left;
        width:70px;
        height:33px;
        line-height:35px;
        color:#fff;
    }
    .switch{
        width:100%;
        height:52px;
        float:left;
    }
    .switch *{
        float:left;
        margin-top:11px;
        color:#2196f3;
    }
    .bottom_box_left{
        width:545px;
        height:330px;
        float:left;
    }
    .bottom_box_right{
        width:545px;
        height:330px;
        float:right;
    }
    .bottom_box_right ul{
        width:100%;
        height:100%;
        overflow:hidden;
    }
    .bottom_box_right ul li{
        width:300px;
        height:40px;
        color:#fff;
        float:left;
        line-height:37px;
        padding-left:0px;
        margin-left:145px;
    }
    .bottom_box_right ul li *{
        float:left;
    }
    .bottom_box_left ul li img{
        width:7%;
        margin-top:8px;
        margin-right:9px;
    }
    .bottom_box_left ul{
        width:100%;
        height:100%;
        overflow:hidden;

    }
    .bottom_box_left ul li{
        width:300px;
        height:40px;
        color:#fff;
        float:left;
        line-height:37px;
        padding-left:0px;
        margin-left:145px;
    }
    .bottom_box_left ul li *{
        float:left;
    }
    .bottom_box_left ul li img{
        width:7%;
        margin-top:8px;
        margin-right:9px;
    }
    .bottom_box_right ul{
        width:100%;
        height:100%;
        overflow:hidden;
    }
    .bottom_box_right ul li{
        width:300px;
        height:40px;
        color:#fff;
        float:left;
        line-height:37px;
        padding-left:0px;
        margin-left:145px;
    }
    .bottom_box_right ul li *{
        float:left;
    }
    .bottom_box_left ul li img{
        width:7%;
        margin-top:8px;
        margin-right:9px;
    }
    .t1{
        margin-top:35px !important;
        margin-left:-95px !important;
        width:30% !important;
    }
    .input_box{
        width:200px;
        height:30px;
        border: none;
        margin-top:4px;
        margin-left:9px;
        outline:none;
        color: #505050;
        line-height:none;
        background: #fff;
    }
    .cha{
        margin-left:9px;
        border: none;
        width: 200px;
        margin-top:6px;
        outline:none;
        color: #505050;
        line-height:none!important;
        background: #fff;
        height: 80px;
    }
    .btn1{
        width:100px;
        height:31px;
        background:#8ba42f;
        border-radius:5px;
        color:#fff;
        font-size:12px;
        text-align:center;
        line-height:30px;
        margin: 221px 242px 0;
        cursor:pointer;
    }
    .zi{
        width:330px;
        height:50px;
        float: left;
        margin-left:104px;
        margin-top:30px;
    }
    .zi h1{
        font-size:20px;
        float: left;
        line-height:50px;
        color:#fff;
    }
    .zi p{
        font-size:20px;
        float: left;
        margin-left:30px;
        margin-right:30px;
        line-height:50px;
        color:#fff;
    }
    .g1{
        float:left;
        width:25%;
        margin-top:55px;
        margin-left:80px;
    }
    .cc{
        width:100%;
        position:relative;
        height: 115px;
        overflow:hidden;
    }
    .cc p{
        text-align:center;
        color:#fff;
        margin-top:3px;
    }
    /* 轮播图 */
    .carouselImgs{
        width:100%;
        height:100%;
    }
    .carouselImgs>img{
        width:100%;
        height:100%;
    }
    .policy_left>img{
        width:100%;
        height:100%;
    }
    // .userInfo{
    // 	width:75%;
    // 	text-align: center;
    // 	position:relative;
    // 	height:100%;
    // }
    // .userInfo>div{
    // 	height:100%;
    // 	line-height: 100%;
    // }
    // .userInfo>ul{
    // 	position:absolute;
    // 	top:100%;
    // 	left:0;
    // 	background:#fff;
    // 	z-index:9;
    // }
    // .userInfo>div,
    // .userInfo>ul>li,
    // .userInfo>ul>li>div{
    // 	text-align: center;
    // 	width:100%;
    // }
    >ul.userDropDown{
        height:auto;
        opacity:1;
        border: 1px solid #E6E6FA;
        >li:first-of-type{
            margin-top:10px;
            >div{
                height:50%;
                line-height:100%;

            }
        }
    }
    .userInfo{
        display: inline-block;
        position:relative;
        color:#333;
        >div{
            padding:0 20px 10px;
            height:70px;
            line-height:70px;
            position:relative;
            cursor:pointer;
            width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            >div{
                position:absolute;
                border:5px solid transparent;
                border-top-color:#333;
                top:30px;
                right:0px;
            }
        }
        >ul{
            position: absolute;
            height:0;
            overflow: hidden;
            top:70px;
            right:-37px;
            z-index: 99;
            background: #fff;
            transition:all 0.3s linear;
            opacity:0;
            border-radius:  0 0 3px 3px;
            >li{
                width:135px;
                height:45px;
                line-height:45px;
                text-align:center;
                cursor:pointer;
                padding:0 5px;
                >div{
                    width:100%;
                    text-align: center;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width:100%;
                }
                &:hover{
                    background:#e6f8fd;
                    color:#33c6f1;
                }
            }
        }
        >ul.userDropDown{
            height:auto;
            opacity:1;
            //   border: 1px solid #E6E6FA;
            >li:first-of-type{
                border-bottom: 1px solid #ebeef5;
                font-weight: 600;
                margin-bottom: 6px;
                padding-bottom: 6px;
                margin-top:10px;
                >div{
                    height:50%;
                    line-height:100%;
                }
            }
        }

    }
    .list-dot{
        border-radius: 50%;
        width:8px;
        height:8px;
        float:left;
        // background:#333;
        position:relative;
        top:13px;
    }
    .dotWhite{
        background:#fff;
    }
    .changenews-true{
        margin-left: 8px;
        cursor: pointer;
    }
    .changenews-false{
        margin-left: 8px;
        pointer-events: none;
        color: #a0a0a0;
    }
    .chuangCarousel{
        position:relative;
        width:100%;
        height: 100%;
        display: block;
    }
    .chuangCarousel>p{
        position:absolute;
        z-index: 9;
        bottom:0;
        left:0;
        right:0;
        height:50px;
        line-height: 50px;
        overflow: hidden;
        text-align: center;
        font-size:23px;
        background: rgba(0,0,0,0.5);
        color:#fff;
    }
</style>
