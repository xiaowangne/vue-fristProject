<template>
  <div class="code-page">
    <van-nav-bar title="验证码" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <div class="box">
      <van-field v-model="email" type="text" label="邮箱" placeholder="请输入邮箱" />
      <van-field v-model="code" type="text" label="邮箱验证码" placeholder="请输入6位验证码">
        <template #button>
          <van-button size="small" :disabled="isSend" type="primary" @click="sendCode">{{text}}</van-button>
        </template>
      </van-field>
      <van-button type="primary" @click="next" block>下一步</van-button>
    </div>
  </div>
</template>

<script>
import validForm from "../assets/js/formVerify";

export default {
  name: "AuthCode",
  data() {
    return {
      email: null,
      code: null,
      text: "发送验证码",
      isSend: false
    };
  },
  methods: {
    // 发送验证码
    sendCode() {
      if (!validForm.validUserForm({ email: this.email }, this)) {
        return;
      }
      let time = 60;
      this.text = time + "秒后重新发送";
      this.isSend = true;
      let timer = setInterval(() => {
        if (time == 0) {
          clearInterval(timer);
          timer = null;
          this.text = "发送验证码";
          this.isSend = false;
        } else {
          time--;
          this.text = time + "秒后重新发送";
        }
      }, 1000);
      //发起发送验证码请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.email
        }
      })
        .then(result => {
          this.$toast.clear();
          this.$toast(result.data.msg);
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 下一步

    next() {
      if (
        !validForm.validUserForm({ email: this.email, code: this.code }, this)
      ) {
        return;
      }
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.code
        }
      })
        .then(result => {
          this.$toast.clear();
          this.$toast(result.data.msg);
          if (result.data.code === "K001") {
            this.$router.push({ name: "FindPassword" });
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    }
  }
};
</script>

<style lang="less" scoped>
@bgColor: #f4a018;
@color: #ffa200;
.code-page {
  .box {
    padding: 10px;
    margin-top: 40px;
  }
  /deep/.van-icon-arrow-left,
  /deep/ .van-nav-bar__text {
    color: @bgColor;
  }
  .van-button--primary {
    background: @color;
    color: #fff;
    border: none;
    border-radius: 5px;
  }
  .van-button--block {
    margin-top: 20px;
    background: @color;
    border: none;
    color: #fff;
    border-radius: 8px;
  }
}
</style>