<template>
  <div class="detail-page">
    <van-nav-bar fixed title="商品详情" left-text="返回" left-arrow @click-left="back" />

    <div class="detail-content">
      <van-image :src="productDetail.large_img" style="display:block;" />
      <div class="title-box">
        <span class="title">{{productDetail.name}}</span>
        <span class="enname">{{productDetail.enname}}</span>
      </div>
      <!-- 购买商品 -->
      <div class="clearfix price-box">
        <div class="fl price">￥{{price}}</div>
        <div class="fr">
          <van-stepper v-model="count" theme="round" button-size="22" disable-input />
        </div>
      </div>
      <!-- 商品规格 -->
      <div class="rule-box">
        <div class="rule-item" v-for="(item,index) in rules" :key="index">
          <div class="rule-title">{{item.title}}</div>
          <div class="rule-tags clearfix">
            <div
              class="fl tag-item"
              :class="{active:item.num==i}"
              v-for="(itemName,i) in item.tag"
              :key="i"
              @click="item.num=i"
            >{{itemName.name}}</div>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc-box">
        <div class="desc-title">商品描述</div>
        <div class="desc-content">
          <div class="desc-item" v-for="(item,index) in productDetail.desc" :key="index">{{item}}</div>
        </div>
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon
        icon="cart-o"
        :badge="status"
        text="购物车"
        color="#333"
        @click="goPage('Shopcart')"
      />
      <van-goods-action-icon
        :icon="isLike?'like':'like-o'"
        text="收藏"
        color="#ffa200"
        @click="likeClick"
      />
      <van-goods-action-button color="#ffa200" type="warning" text="加入购物车" @click="addShopcart" />
      <van-goods-action-button color="#fc702f" type="danger" text="立即购买" @click="buyShop" />
    </van-goods-action>
  </div>
</template>

<script>
import "../assets/css/Detail.less";

export default {
  name: "Detail",
  data() {
    return {
      count: 1,
      rules: [
        {
          title: "温度",
          tag: [{ name: "常温" }, { name: "热" }, { name: "加冰" }],
          num: 0
        },
        {
          title: "多糖",
          tag: [{ name: "常规糖" }, { name: "少糖" }, { name: "多糖" }],
          num: 0
        },
        { title: "加奶", tag: [{ name: "单份奶" }, { name: "双份奶" }], num: 0 }
      ],
      status: null,
      //   商品详情
      pid: null,
      productDetail: {},
      price: null,
      onePrice: null,
      isLike: false,
      sids: []
    };
  },
  created() {
    this.pid = this.$route.query.pid;
    this.getDetailData(this.pid);
    this.findLike(this.pid);
    this.getShopcartCount();
  },

  methods: {
    goPage(name) {
      this.$router.push({ name: name });
    },
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 获取商品信息
    getDetailData(pid) {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: pid
        }
      })
        .then(result => {
          this.$toast.clear();
          //   
          if (result.data.code == 600) {
            let data = result.data.result[0];
            data.desc = data.desc.split(/\n/);
            this.productDetail = result.data.result[0];
            this.price = this.productDetail.price;
            this.onePrice = this.productDetail.price;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 点击收藏取消收藏
    likeClick() {
      //获取token
      let tokenString = localStorage.getItem("__Tk");
      let url = this.isLike ? "/notlike" : "/like";

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 800 || result.data.code == 900) {
            this.isLike = result.data.code == 800;
            this.$toast(result.data.msg);
          } else {
            //如果token无效，则跳转到登录页面
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          
        });
    },

    // 查询是否收藏
    findLike(pid) {
      //获取token
      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 1000) {
            this.isLike = result.data.result.length > 0;
          } else {
            //如果token无效，则跳转到登录页面
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          
        });
    },

    // 添加购物车
    addShopcart() {
      //获取token
      let tokenString = localStorage.getItem("__Tk");
      let rulesData = [];
      for (let i = 0; i < this.rules.length; i++) {
        rulesData.push(this.rules[i].tag[this.rules[i].num].name);
      }
      let rule = rulesData.join("/");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          pid: this.pid,
          count: this.count,
          rule,
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 3000) {
            this.$toast(result.data.msg);
            this.count = 1;
            this.sids.push(result.data.sid);
            

            this.getShopcartCount();
          } else {
            //如果token无效，则跳转到登录页面
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          
        });
    },

    // 查询购物车有多少商品
    getShopcartCount() {
      let tokenString = localStorage.getItem("__Tk");

      this.axios({
        method: "GET",
        url: "/shopcartCount",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 4000) {
            this.status = result.data.result;
            this.price = this.onePrice;
            this.status = this.status > 99 ? "99+" : this.status;
          }
        })
        .catch(err => {
          
        });
    },

    // 立即购买
    buyShop() {
      let tokenString = localStorage.getItem("__Tk");
      let rulesData = [];
      for (let i = 0; i < this.rules.length; i++) {
        rulesData.push(this.rules[i].tag[this.rules[i].num].name);
      }
      let rule = rulesData.join("/");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          pid: this.pid,
          count: this.count,
          rule,
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          
          if (result.data.code == 3000) {
            this.$toast(result.data.msg);
            this.count = 1;
            this.sids.push(result.data.sid);
            this.$router.push({
              name: "Submit",
              query: { sids: this.sids.join("-") }
            });
            this.getShopcartCount();
          } else {
            //如果token无效，则跳转到登录页面
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
</style>