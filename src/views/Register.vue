<template>
  <div class="register">
    <van-nav-bar
      class="register-nav"
      title="注册"
      left-text="返回"
      right-text="登录"
      @click-right="goPage('Login')"
      @click-left="back"
    />
    <div class="logo">
      <img class="auto-img" src="../assets/images/logo.png" alt />
    </div>

    <!-- 注册表单 -->
    <van-form class="register-form" @submit="register">
      <van-field v-model="userInfo.phone" rows="1" label="手机号" placeholder="请输入手机号" maxlength=11>
        <template #left-icon>
          <i class="fa fa-lg fa-phone-square" aria-hidden="true"></i>
        </template>
      </van-field>
      <van-field v-model="userInfo.nickName" rows="1" label="用户名" placeholder="不能以数字开头(2-8位)" maxlength=10>
        <template #left-icon>
          <i class="fa fa-lg fa-user-circle" aria-hidden="true"></i>
        </template>
      </van-field>
      <van-field
        rows="1"
        :type="flag?'password':'text'"
        name="密码"
        label="密　码"
        placeholder="密码以字母开头(6,16位)"
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
      <van-field v-model="authCode" rows="1" label="验证码" placeholder="请输入验证码" maxlength=6>
        <template #left-icon>
          <i class="fa fa-lg fa-envelope-square" aria-hidden="true"></i>
        </template>
        <template #right-icon>
          <div @click="getCode">
            <Code></Code>
          </div>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">立即注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
// import { Toast } from "vant";
// 导入注册css样式
import "../assets/css/Register.less";
import { mapState } from "vuex";

import Code from "../components/Code";
//导入验证表单模块
import validForm from "../assets/js/formVerify";
export default {
  name: "Register",
  components: { Code },
  computed: {
    ...mapState(["identifyCode"])
  },
  data() {
    return {
      userInfo: {
        phone: null,
        nickName: null,
        password: null
      },
      code: null,
      authCode: null,
      flag: true
    };
  },
  mounted() {
    this.code = this.identifyCode;
  },
  methods: {
    getCode() {
      this.code = this.identifyCode;
    },
    goPage(name) {
      this.$router.push({ name: name });
    },
      // 返回
    back(){
        this.$router.go(-1);
    },
    //注册
    register() {
      //进行验证表单
      if (validForm.validUserForm(this.userInfo, this)) {
        if (this.code === this.authCode) {
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
            url: "/register",

            //post传递参数需要写在data
            data
          })
            .then(result => {
              //关闭加载提示
              this.$toast.clear();
              
              if (result.data.code == 100) {
                //跳转到登录页面
                this.$router.push({ name: "Login" });
              } else {
                this.$toast(result.data.msg);
              }
            })
            .catch(err => {
              //关闭加载提示
              this.$toast.clear();
              
            });
        }else{
          this.$toast("验证码输入错误");
        }
      }
    }
  }
};
</script>
