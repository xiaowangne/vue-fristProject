<template>
  <div class="my-page">
    <div v-if="isIf">
      <button class="vButton" @click="$router.push({ name:'Login' })">点我登录</button>
    </div>
    <div v-else>
      <div class="bg-box" :style="'backgroundImage:url('+userData.userBg+')'">
        <div class="clearfix replace">
          <div class="fr">
            <van-uploader :after-read="uploadFile">
              <i class="fa fa-lg fa-camera" aria-hidden="true"></i>
            </van-uploader>
          </div>
        </div>
        <div class="name-box">
          <div class="img-box">
            <van-uploader :after-read="uploadUserImg">
              <van-image fit="contain" round :src="userData.userImg" />
            </van-uploader>
          </div>
          <div class="name">{{userData.nickName}}</div>
        </div>
        <div class="signature">
          <span>签名：</span>
          <span>{{userData.desc===""?'这个人很懒,什么都没留下':userData.desc}}</span>
        </div>
      </div>
    </div>

    <div class="content-box">
      <van-cell-group>
        <van-cell title="账户管理" is-link @click="goPage('User')" />
        <van-cell title="地址管理" is-link @click="goPage('MyAddress')" />
        <van-cell title="我的收藏" is-link @click="goPage('Mylike')" />
        <van-cell title="安全中心" is-link @click="goPage('Safety')" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "My",
  data() {
    return {
      userData: [],
      fileList: null,
      isIf: false
    };
  },
  created() {
    this.getUserData();
    let tokenString = localStorage.getItem("__Tk");

    if (!tokenString) {
      this.isIf = true;
    }
  },
  methods: {
    goPage(name) {
      if (this.isIf) {
        this.$toast("请登录");
      } else {
        this.$router.push({ name: name });
      }
    },
    // 获取用户数据
    getUserData() {
      let tokenString = localStorage.getItem("__Tk");
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === "A001") {
            this.userData = result.data.result[0];
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 上传背景
    uploadFile(file) {
      let base64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );

      let imgType = file.file.type.split("/")[1];
      let tokenString = localStorage.getItem("__Tk");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img: base64Img
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === "I001") {
            
            this.userData.userBg = result.data.userBg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 上传头像
    uploadUserImg(file) {
      let base64Img = file.content.replace(
        /^data:image\/[A-Za-z]+;base64,/,
        ""
      );

      let imgType = file.file.type.split("/")[1];
      let tokenString = localStorage.getItem("__Tk");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType,
          serverBase64Img: base64Img
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === "H001") {
            
            this.userData.userImg = result.data.userImg;
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
.my-page {
  .bg-box {
    color: #fff;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .replace {
      padding: 20px 20px 0 0;
    }
    > .name-box {
      width: 100%;
      > .img-box {
        width: 100px;
        height: 100px;
        margin: auto;
        .van-image--round {
          box-shadow: 0 0 5px 5px rgba(255, 255, 255, 0.3);
          width: 100px;
          height: 100px;
        }
      }
      > .name {
        text-align: center;
        font-size: 16px;
        padding: 5px 0;
      }
    }
    .signature {
      padding: 5px;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
    }
  }
}
</style>