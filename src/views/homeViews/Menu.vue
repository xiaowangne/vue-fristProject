<template>
  <div class="menu-page">
    <van-search shape="round" show-action background placeholder="请输入搜索关键词" @focus="goPage('Search')">
      <template #action>
        <span v-if="isShow" class="user" @click="goPage('My')">
          <img class="auto-img" :src="userImg" alt=""></span> 
        <i v-else class="fa fa-user fa-2x" aria-hidden="true" @click="goPage('Login')"></i>
      </template>
    </van-search>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#f4a018" style="height:163.03px;">
      <van-swipe-item v-for="(item,index) in bannerData" :key="index">
        <img class="auto-img" v-lazy="item.bannerImg" alt />
      </van-swipe-item>
    </van-swipe>
    <div class="menu-content">
      <div class="aside-menu fl">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item
            v-for="(item,index) in typeData"
            :key="index"
            :title="item.typeDesc"
            @click="getProductData(item,index)"
          />
        </van-sidebar>
      </div>
      <div class="content fl">
        <van-card
          v-for="(item,index) in productData"
          :key="index"
          :title="item.name"
          :price="item.price"
          :desc="item.enname"
          :thumb="item.smallImg"
          :lazy-load="true"
          @click="goDetail(item.pid)"
        />
      </div>
    </div>
  </div>
</template>

<script>
// 导入样式
import "../../assets/css/Menu.less";
import { createNamespacedHelpers } from "vuex";

const { mapState, mapMutations } = createNamespacedHelpers("menuModule");
export default {
  name: "Menu",
  data() {
    return {
      activeKey: -1,
      //   banner图
      bannerData: [],

      // 商品类型
      typeData: [],

      //商品数据
      productData: [],
      isShow:false,
      userImg:null,
    };
  },
  created() {
    this.getBannerData();
    this.getTypeData();
    let type="isHot"
    if(this.typeDataCache.length!=0){
      type=this.typeDataCache[this.activeKeys].type
    }
    this.getProductData(
      { type: type },
      this.activeKeys
    );
    this.getUserData();
  },
  computed: {
    ...mapState(["bannerDataCache", "typeDataCache", "products", "activeKeys"])
  },
  methods: {
    ...mapMutations(["changeData", "changeProducts"]),
    goPage(name) {
      this.$router.push({ name: name });
    },
    // 获取banner数据
    getBannerData() {
      //获取vuex的banner缓存数据，如果存在缓存数据，则不发起请求，否则发起请求
      if (this.bannerDataCache.length > 0) {
        this.bannerData = this.bannerDataCache;
        // 
        return;
      }

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/banner",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          //   
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
            //缓存banner数据在vuex中
            this.changeData({
              key: "bannerDataCache",
              value: result.data.result
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 获取商品数据类型
    getTypeData() {
      if (this.typeDataCache.length > 0) {
        this.typeData = this.typeDataCache;
        
        return;
      }
      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          //   
          if (result.data.code == 400) {
            this.typeData = result.data.result;
            this.typeData.unshift({ type: "isHot", typeDesc: "最新推荐" });
            // 缓存typeData中的数据
            this.changeData({
              key: "typeDataCache",
              value: this.typeData
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    getProductData(item, index) {
      //在缓存获取商品数据
      this.changeData({
        key: "activeKeys",
        value: index
      });
      this.activeKey = this.activeKeys;
      if (this.products[item.type]) {
        this.productData = this.products[item.type];
        // 
        return;
      }

      this.productData = [];

      let params = {
        appkey: this.appkey,
        key: "type",
        value: item.type
      };

      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }

      //开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        //延迟自动关闭加载提示，如果该值为0，则不会自动关闭
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params
      })
        .then(result => {
          this.$toast.clear();
          // 
          if (result.data.code == 500) {
            this.productData = result.data.result;
            this.changeProducts({
              type: item.type,
              value: result.data.result
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 获取详情页面参数
    goDetail(pid) {
      //pid: 商品id
      this.$router.push({ name: "Detail", query: { pid } });
    },
     // 获取用户数据
    getUserData() {
      let tokenString = localStorage.getItem("__Tk");
      if(tokenString){
        this.isShow=true;
      }
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
           this.userImg= result.data.result[0].userImg 
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
  }
};
</script>

<style lang="less" scoped>
</style>