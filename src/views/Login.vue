<template>
  <div class="register">
    <van-nav-bar
      class="register-nav"
      title="登录"
      left-text="返回"
      @click-left="goPage('Menu')"
    />
    <div class="logo">
      <img class="auto-img" src="../assets/images/logo.png" alt />
    </div>

    <!-- 登录表单 -->
    <van-form class="register-form" @submit="login">
      <van-field v-model="userInfo.phone" rows="1" label="手机号" placeholder="请输入手机号" maxlength=11> 
        <template #left-icon>
          <i class="fa fa-lg fa-phone-square" aria-hidden="true"></i>
        </template>
      </van-field>
      <van-field
        rows="1"
        :type="flag?'password':'text'"
        name="密码"
        label="密　码"
        placeholder="请输入密码"
        v-model="userInfo.password"
        maxlength=18
      >
        <template #left-icon>
          <i class="fa fa-lg fa-expeditedssl" aria-hidden="true"></i>
        </template>
        <template #right-icon>
          <i
            class="van-icon iconSize"
            :class="{'van-icon-closed-eye':flag,'van-icon-eye-o':!flag}"
            @click="flag=!flag"
          ></i>
        </template>
      </van-field>

      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">立即登录</van-button>
        <div class="forget clearfix">
          <span class="fl" @click="goPage('Register')">立即注册</span>
        <span class="fr" @click="goPage('AuthCode')">忘记密码?</span>
        </div>
      </div>
    </van-form>
  </div>
</template>

<script>
// import { Toast } from "vant";
// 导入注册css样式
import "../assets/css/Register.less";

import Code from "../components/Code";
//导入验证表单模块
import validForm from "../assets/js/formVerify";
export default {
  name: "Login",
  components: { Code },
  data() {
    return {
      userInfo: {
        phone: null,
        password: null
      },
      flag: true
    };
  },
  methods: {
    goPage(name) {
      this.$router.push({ name: name });
    },
      // 返回
    back(){
        this.$router.go(-1);
    },
    //注册
    login() {
      //进行验证表单
      if (validForm.validUserForm(this.userInfo, this)) {
        //复制对象
        let data = Object.assign({}, this.userInfo);

        //请求密钥
        data.appkey = this.appkey;

        //开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,

          //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
          duration: 0
        });

        //发起注册请求
        this.axios({
          method: "POST",
          url: "/login",

          //post传递参数需要写在data
          data
        })
          .then(result => {
            //关闭加载提示
            this.$toast.clear();
            
            if (result.data.code == 200) {
              this.$toast(result.data.msg)
              //跳转到菜单
            this.$router.push({ name: 'Menu' });
              
              //存储token，用于后面登录验证
              localStorage.setItem("__Tk", result.data.token);
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch(err => {
            //关闭加载提示
            this.$toast.clear();
            
          });
      }
    }
  }
};
</script>
<style lang="less" scoped>
  
</style>