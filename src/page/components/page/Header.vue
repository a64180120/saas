<template>
  <div class="Top_navigation">
    <div class="logo_box">
      <img src="@/assets/images/logo2.png">
    </div>
    <div id="div" class="search_box">
      <img src="@/assets/img/fdj.png" style="margin:0;">
      <div id="sou" class="sousuo" style="display:none;"></div>
    </div>
    <div class="Sign_box">
      <img src="@/assets/images/finance/SAAS-01.png">
      <div @click.stop="userDropDown=!userDropDown" class="userInfo" v-if="userinfo">
        <div>{{username}}<div></div>
        </div>
        <ul :class="{userDropDown:userDropDown}">
          <li>
            <div>{{userinfo.RealName}}</div>
            <div>({{userinfo.MobilePhone}})</div>
          </li>
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
      <img src="@/assets/images/finance/SAAS-03.png">
      <p>0571-88270588</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import md5 from "js-md5";
import desHelper from "@/util/desHelper";
import auth from "@/util/auth";

export default {
  name: "home_header",
  data() {
    return {

    };
  },
  mounted() {

  },
  computed: {

  },
  methods: {
      
  }
};
</script>
<style scoped>
</style>
