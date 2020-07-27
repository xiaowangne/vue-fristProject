<template>
  <div class="findPassword-page">
    <van-nav-bar title="找回密码" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <div class="box">
      <van-form class="register-form">
        <van-field v-model="phone" rows="1" label="手机号" placeholder="已注册手机号" maxlength="11">
          <template #left-icon>
            <i class="fa fa-lg fa-phone-square" aria-hidden="true"></i>
          </template>
        </van-field>
        <van-field
          rows="1"
          :type="flag?'password':'text'"
          name="密码"
          label="密　码"
          placeholder="密码以字母开头(6,16位)"
          v-model="password"
          maxlength="18"
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
        <van-button type="primary" @click="savePassword" block>确认</van-button>
      </van-form>
    </div>
  </div>
</template>

<script>
import validForm from "../assets/js/formVerify";
export default {
  name: "FindPassword",
  data() {
    return {
      phone: null,
      password: null,
      flag: true
    };
  },
  methods: {
    // 保存
    savePassword() {
      if (
        !validForm.validUserForm(
          { phone: this.phone, password: this.password },
          this
        )
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
        url: "/retrievePassword",
        data: {
          appkey: this.appkey,
          phone: this.phone,
          password: this.password
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == "L001") {
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
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
.findPassword-page {
  .box {
    padding: 10px;
    margin-top: 40px;
  }
  /deep/.van-icon-arrow-left,
  /deep/ .van-nav-bar__text {
    color: @bgColor;
  }
  .fa {
    color: @color;
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