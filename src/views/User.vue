<template>
  <div class="user-page">
    <van-nav-bar title="账户管理" left-text="返回" left-arrow @click-left="$router.go(-1)" />
    <van-cell-group>
      <van-cell class="headPhoto" center title="头像" size="large">
        <template #default>
          <van-uploader :after-read="uploadUserImg">
            <div class="userImg clearfix">
              <img :src="infoData.userImg" class="auto-img fr" alt />
            </div>
          </van-uploader>
        </template>
      </van-cell>
      <van-cell title="用户id" size="large" :value="infoData.userId" />
      <van-cell title="手机号" size="large" :value="infoData.phone" />
      <van-cell title="昵称" size="large">
        <van-field v-model="infoData.nickName" input-align="right" @focus="name=infoData.nickName" @blur="changeUser({key:'nickName',value:infoData.nickName,path:'/updateNickName'})"/>
      </van-cell>
      <van-cell title="简介" size="large">
        <template #label>
          <van-cell-group>
            <van-field maxlength="20" @focus="oldDesc=desc"  v-model="desc" @blur="changeUser({key:'desc',value:desc,path:'/updateDesc'})" />
          </van-cell-group>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    return {
      infoData: [],
      desc: "这个人很懒,什么都没留下~",
      name:null,
      oldDesc:null
    };
  },
  created() {
    this.getInfoData();
  },
  methods: {
    getInfoData() {
      let tokenString = localStorage.getItem("__Tk");
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === "B001") {
            this.infoData = result.data.result[0];
            if (result.data.result[0].desc == "") {
              this.desc = this.desc;
            } else {
              this.desc = result.data.result[0].desc;
            }
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
            
            this.infoData.userImg = result.data.userImg;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    changeUser(data) {
      
      if(this.name==data.value){
        return
      }
      if(this.oldDesc==data.value){
        return
      }
      if (data.value == "") {
        this.$toast("输入不能为空");
        return;
      }
      let tokenString = localStorage.getItem("__Tk");
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: data.path,
        data: {
          appkey: this.appkey,
          tokenString,
          [data.key]:data.value
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === "B001") {
           
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

.user-page {
  .userImg {
    height: 30px;
    width: 100%;
    text-align: right;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .headPhoto {
    padding: 0 16px;
  }
  .van-nav-bar {
    border-bottom: 1px solid #ebedf0;
  }
  /deep/.van-icon-arrow-left,
  /deep/ .van-nav-bar__text {
    color: @bgColor;
  }
  .van-cell__label {
    height: 50px;
    line-height: 50px;
  }
  [class*="van-hairline"]::after {
    border: none;
  }
  /deep/.van-field__control {
    color: #969799;
  }
}
</style>