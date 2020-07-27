<template>
  <div class="mylike-page">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow fixed @click-left="$router.go(-1)" />
    <div class="like-content">
      <div class="empty" v-show="isempty">
        <van-empty class="custom-image" description="您暂时没有收藏的商品哦，逛一逛">
          <template #image>
            <div>
              <img src="../assets/images/emptyBg.png" alt />
            </div>
          </template>
          <van-button type="danger" class="bottom-button" @click="$router.push({ name:'Menu'})">逛一逛</van-button>
        </van-empty>
      </div>
      <van-card
        v-for="(item,index) in mylikeData"
        :key="index"
        :title="item.name"
        :price="item.price"
        :desc="item.enname"
        :thumb="item.smallImg"
        :lazy-load="true"
        @click="goDetail(item.pid)"
      >
        <template #num>
          <van-icon name="delete" color="#8a8a8a" size="20px" @click.stop="delLike(item.pid)" />
        </template>
      </van-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Mylike",
  data() {
    return {
      mylikeData: [],
      isempty: false
    };
  },
  created() {
    this.getMylikeData();
  },
  methods: {
    goDetail(pid) {
      //pid: 商品id
      this.$router.push({ name: "Detail", query: { pid } });
    },
    // 获取用户收藏数据

    getMylikeData() {
      let tokenString = localStorage.getItem("__Tk");
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 2000) {
            this.mylikeData = result.data.result;
            if (this.mylikeData.length == 0) {
              this.isempty = true;
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 点击删除收藏
    delLike(pid, index) {
      //获取token
      let tokenString = localStorage.getItem("__Tk");
      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          pid,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 900) {
            this.$toast("删除收藏成功");
            this.mylikeData.splice(index, 1);
            if (this.mylikeData.length == 0) {
              this.isempty = true;
            }
          }
        })
        .catch(err => {
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
@bgColor: #f4a018;
@color: #ffa200;

.mylike-page {
  /deep/.van-icon-arrow-left,
  /deep/ .van-nav-bar__text {
    color: @bgColor;
  }
  .bottom-button {
    width: 80px;
    height: 30px;
    background-color: #f6f6f6;
    border: 1px solid #ddd;
    color: #8a8a8a;
    border-radius: 5px;
  }
  .like-content {
    position: fixed;
    top: 46.01px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px;
    overflow-y: auto;

    .van-card {
      background: #fff;
      margin-bottom: 10px;
    }
    .van-card__title {
      font-size: 15px;
    }
    .van-card__price {
      color: @bgColor;
    }
  }
}
</style>