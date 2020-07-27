<template>
  <div class="home">
    <div class="content-box">
      <router-view></router-view>
    </div>
    <van-tabbar active-color="#f4a018" v-model="active" @change="onChange">
      <van-tabbar-item
        v-for="(item,index) in tabBarData"
        :key="index"
        :icon="item.icon"
      >{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      tabBarData: [
        {
          icon: "home-o",
          title: "首页",
          routeName: "Menu"
        },
        {
          icon: "description",
          title: "订单",
          routeName: "Order"
        },
        {
          icon: "shopping-cart-o",
          title: "购物车",
          routeName: "Shopcart"
        },
        {
          icon: "contact",
          title: "我的",
          routeName: "My"
        }
      ],
      active: 0
    };
  },
  // 解决刷新时路径与激活块不对应的问题
  created() {
    let url = location.hash;
    let urlarr = url.split("/");
    let name = urlarr[urlarr.length - 1];
    for (let i = 0; i < this.tabBarData.length; i++) {
      if (name == this.tabBarData[i].routeName.toLowerCase()) {
        this.active=i;
        return
      }
    }
    
  },
  updated(){
    let url = location.hash;
    let urlarr = url.split("/");
    let name = urlarr[urlarr.length - 1];
    for (let i = 0; i < this.tabBarData.length; i++) {
      if (name == this.tabBarData[i].routeName.toLowerCase()) {
        this.active=i;
        return
      }
    }
    
  },
  methods: {
    onChange(index) {
      this.$router.push({ name: this.tabBarData[index].routeName });
    }
  }
};
</script>