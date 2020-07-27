<template>
  <div class="submit-page">
    <van-nav-bar title="提交订单" fixed left-text="返回" left-arrow @click-left="back" />
    <div class="content-box">
      <div class="area clearfix" @click="show=true">
        <span class="fl">{{address}}</span>
        <span class="fr">
          <van-icon name="arrow" />
        </span>
      </div>
      <div class="order">
        <van-card
          v-for="(item,index) in orderData"
          :key="index"
          :num="item.count"
          :desc="item.enname"
          :thumb="item.small_img"
        >
          <template #title>
            <div class="title-box clearfix">
              <span class="title fl">{{item.name}}</span>
              <span class="price fr">¥{{item.price}}</span>
            </div>
          </template>
          <template #price>
            <span class="rules">{{item.rule}}</span>
          </template>
        </van-card>
        <div class="total-box clearfix">
          <div class="fr">
            <span class="total-count">
              共计
              <span class="count">{{counts}}</span> 件商品 合计：
            </span>
            <span class="total">¥{{total/100+".00"}}</span>
          </div>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="show" title="选择收货地址">
      <div class="content">
        <div class="address">
          <van-address-list
            @select="select"
            v-model="aid"
            :list="list"
            @add="$router.push({name:'Address'})"
          />
        </div>
      </div>
    </van-action-sheet>
    <van-submit-bar :price="total" @submit="commit" button-text="立即结算" />
  </div>
</template>

<script>
import "../assets/css/Submit.less";
export default {
  name: "Submit",
  data() {
    return {
      aid: "1",
      list: [],
      show: false,
      orderData: [],
      address: "请选择收货地址",
      //商品总数量
      counts: 0,
      phone: null,
      receiver: null,
      //总金额
      total: 0,
      sids: []
    };
  },
  created() {
    this.getMyAddress();
    this.sids = this.$route.query.sids.split("-");
    
    this.getSubmitData(this.sids);
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    // 获取我的地址数据
    getMyAddress() {
      let tokenString = localStorage.getItem("__Tk");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === 20000) {
            result.data.result.forEach(v => {
              let currentAddress = {
                id: v.aid,
                tel: v.tel,
                name: v.name,
                address: v.province + v.city + v.county + v.addressDetail,
                isDefault: Boolean(v.isDefault)
              };
              //默认选择默认地址
              if (v.isDefault) {
                this.aid = v.aid;
                this.address = currentAddress.address;
                this.phone = currentAddress.tel;
                this.receiver = currentAddress.name;
              }
              this.list.push(currentAddress);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 选择地址
    select(item) {
      this.show = !this.show;
      
      this.phone = item.tel;
      this.receiver = item.name;
      this.address = item.address;
    },

    // 获取提交订单数据
    getSubmitData(sids) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids)
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 50000) {
            this.orderData = result.data.result;
            for (let i = 0; i < this.orderData.length; i++) {
              this.counts += this.orderData[i].count;
              this.total += this.orderData[i].price * this.orderData[i].count;
            }
            this.total = this.total * 100;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 提交订单
    commit() {
      if (this.address === "请选择收货地址") {
        this.$toast("请选择收货地址");
        return;
      }
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.phone,
          address: this.address,
          receiver: this.receiver
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === 60000) {
            this.$router.push({ name: "Order" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

