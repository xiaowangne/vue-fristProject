<template>
  <div class="search-page">
    <van-search v-model="keywords" show-action :placeholder="placeholder" @input="getData">
      <template #left>
        <van-icon name="arrow-left" @click="$router.push({name:'Menu'})" />
      </template>
      <template #action>
        <div>
          <van-button type="primary" size="small" @click="search">搜索</van-button>
        </div>
      </template>
    </van-search>
    <div class="search-content">
      <van-card
        v-for="(item,index) in result"
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
</template>

<script>
import "../assets/css/Search.less";
export default {
  name: "Search",
  data() {
    return {
      placeholder: "",
      keywords: "", //input框绑定的关键字
      //商品数据
      productData: [],
      productName: [],
      result: [] //搜索结果，是一个数组
    };
  },
  created() {
    this.getTypeData();
  },
  methods: {
    // 获取详情页面参数
    goDetail(pid) {
      //pid: 商品id
      this.$router.push({ name: "Detail", query: { pid } });
    },
    // 获取商品数据类型
    getTypeData() {
      this.axios({
        method: "GET",
        url: "/type",
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          //   
          if (result.data.code == 400) {
            for (let i = 0; i < result.data.result.length; i++) {
              this.getProductData(result.data.result[i].type);
            }
          }
        })
        .catch(err => {
          
        });
    },
    getProductData(value) {
      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: value
        }
      })
        .then(result => {
          //   
          if (result.data.code == 500) {
            for (let i = 0; i < result.data.result.length; i++) {
              this.productData.push(result.data.result[i]);
              this.productName.push(result.data.result[i].name);
            }
            this.placeholder = this.productName[
              Math.floor(Math.random() * this.productName.length)
            ];
          }
        })
        .catch(err => {
          
        });
    },
    //搜索的方法
    search() {
      this.result = [];
      // 遍历拿到item，并判断值是否和input框相似，一样就添加到result数组中
      if (this.keywords == "") {
        this.keywords = this.placeholder;
      }
      this.productName.map((item, index) => {
        if (item.includes(this.keywords)) {
          this.result.push(this.productData[index]);
        }
      });
    },
    getData() {
      this.result = [];
      // 遍历拿到item，并判断值是否和input框相似，一样就添加到result数组中
      if (this.keywords == "") {
        this.result = [];
        this.placeholder = this.productName[
          Math.floor(Math.random() * this.productName.length)
        ];
      } else {
        this.productName.map((item, index) => {
          if (item.includes(this.keywords)) {
            this.result.push(this.productData[index]);
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>