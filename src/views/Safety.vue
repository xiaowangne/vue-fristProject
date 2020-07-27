<template>
  <div class="safety-page">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      right-text="退出登录"
      left-arrow
      @click-right="exit"
      @click-left="$router.go(-1)"
    />
    <div class="content-box">
      <van-button type="primary" block @click="show = true;
">修改密码</van-button>
      <van-action-sheet v-model="show" title="修改密码">
        <div class="content">
          <van-field v-model="oldPassword" type="password" label="旧密码" placeholder="旧密码(6-16)位" />
          <van-field v-model="newPassword" type="password" label="新密码" placeholder="新密码(6-16)位" />
          <van-button type="primary" @click="changePassword" block>确认修改</van-button>
        </div>
      </van-action-sheet>
      <van-button type="primary" block @click="delClick">注销账号</van-button>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
export default {
  name: "Safety",
  data() {
    return {
      show: false,
      oldPassword: null,
      newPassword: null
    };
  },
  methods: {
    //   修改密码
    changePassword() {
      let tokenString = localStorage.getItem("__Tk");
      let password = "";
      let oldPassword = "";
      if (this.oldPassword == "") {
        this.$toast("请输入旧密码");
        return;
      }
      if (this.newPassword == "") {
        this.$toast("请输入新密码");
        return;
      }
      let reg = /^[a-zA-Z]\w{5,15}$/;
      if (reg.test(this.newPassword)) {
        password = this.newPassword;
      } else {
        this.$toast("新密码格式不正确");
        return;
      }
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          password,
          oldPassword: this.oldPassword
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === "E001") {
            this.$toast(result.data.msg);
            this.$router.push({ name: "Login" });
            localStorage.clear();
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();

          
        });
    },
    //   注销账号
    delClick() {
      Dialog.confirm({
        title: "账号注销",
        message: "是否注销账号"
      })
        .then(() => {
          let tokenString = localStorage.getItem("__Tk");
          // 开启加载提示
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: "POST",
            url: "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString
            }
          })
            .then(result => {
              this.$toast.clear();
              
              if (result.data.code === "G001") {
                this.$toast(result.data.msg);
                this.$router.push({ name: "Login" });
                localStorage.clear();
              }
            })
            .catch(err => {
              this.$toast.clear();
              
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 退出登录
    exit() {
      Dialog.confirm({
        message: "请确认退出登录"
      })
        .then(() => {
          let tokenString = localStorage.getItem("__Tk");
          // 开启加载提示
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0
          });

          this.axios({
            method: "POST",
            url: "/logout",
            data: {
              appkey: this.appkey,
              tokenString
            }
          })
            .then(result => {
              this.$toast.clear();
              
              if (result.data.code === "F001") {
                this.$toast(result.data.msg);
                this.$router.push({ name: "Login" });
                localStorage.clear();
              }
            })
            .catch(err => {
              this.$toast.clear();
              
            });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style lang="less" scoped>
@bgColor: #f4a018;
@color: #ffa200;

.safety-page {
  /deep/.van-icon-arrow-left,
  /deep/ .van-nav-bar__text {
    color: @bgColor;
  }
  .content {
    padding: 16px;
    .van-button--block {
      margin-top: 40px;
      background: @color;
      border: none;
      color: #fff;
      border-radius: 8px;
    }
  }
  .van-button--block {
    margin-top: 40px;
    background: #fff;
    border: none;
    color: #333;
  }
  .content-box {
    padding: 10px 20px;
  }
}
</style>