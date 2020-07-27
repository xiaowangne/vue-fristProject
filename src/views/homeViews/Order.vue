<template>
  <div class="order-page">
    <div v-if="isIf">
      <button class="vButton" @click="goPage('Login')">点我登录</button>
    </div>
    <div v-else>
      <van-tabs
        v-model="active"
        animated
        color="#ffa200"
        title-active-color="#f4a018"
        swipeable
        @change="change"
      >
        <van-tab v-for="(t,k ) in title" :key="k" :title="t">
          <div class="order-content">
            <div class="empty" v-show="isempty">
              <van-empty class="custom-image" description="暂时没有订单哦，逛一逛">
                <template #image>
                  <div>
                    <img src="../../assets/images/emptyBg.png" alt />
                  </div>
                </template>
                <van-button type="danger" class="bottom-button" @click="goPage('Menu')">逛一逛</van-button>
              </van-empty>
            </div>
            <div class="order" v-for="(item,index) in allOrderData" :key="index">
              <div class="order-title clearfix">
                <span class="order-number fl">订单号:{{item[0].oid}}</span>
                <span class="del fr" v-show="item[0].status!=1">
                  <van-icon @click="delOder(item,index)" size="18px" name="delete" />
                </span>
                <span class="state fr">
                  <van-button
                    @click="sureOrder(item,index)"
                    v-show="item[0].status==1"
                    type="primary"
                    size="mini"
                  >确认收货</van-button>
                  <span v-show="item[0].status==2">已收货</span>
                </span>
              </div>
              <van-card
                v-for="(card,i) in item"
                :key="i"
                :num="card.count"
                :desc="card.enname"
                :thumb="card.smallImg"
              >
                <template #title>
                  <div class="title-box clearfix">
                    <span class="title fl">{{card.name}}</span>
                    <span class="price fr">¥{{card.price}}</span>
                  </div>
                </template>
                <template #price>
                  <span class="rules">{{card.rule}}</span>
                </template>
              </van-card>
              <div class="total-box clearfix">
                <div class="fl">
                  <div class="timer">{{item[0].updatedAt}}</div>
                </div>
                <div class="fr">
                  <span class="total-count">
                    共计
                    <span class="count">{{counts[index]}}</span> 件商品 合计：
                  </span>
                  <span class="total">¥{{total[index]}}</span>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../../assets/css/Order.less";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Order",
  data() {
    return {
      isempty: false,
      title: ["全部", "待收货", "已收货"],
      active: null,
      allOrderData: [],
      oids: {},
      // 数量和价钱
      counts: [],
      total: [],
      isIf: false
    };
  },
  computed: {
    ...mapState(["activeOrder"])
  },
  created() {
    this.active = this.activeOrder;
    this.getAllOrderData(this.active);
    let tokenString = localStorage.getItem("__Tk");
    if(!tokenString){
      this.isIf=true
    }
  },
  methods: {
    // 获取订单数据
    ...mapMutations(["changeData"]),
    goPage(name) {
      this.$router.push({ name: name });
    },
    getAllOrderData(status) {
      let tokenString = localStorage.getItem("__Tk");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status
        }
      })
        .then(result => {
          this.$toast.clear();
          

          if (result.data.code === 70000) {
            for (let i = 0; i < result.data.result.length; i++) {
              this.oids[result.data.result[i].oid] = 1;
              result.data.result[i].updatedAt = this.dateTime(
                result.data.result[i].updatedAt
              );
            }

            let count = 0;
            for (let key in this.oids) {
              let arr = [];
              this.counts[count] = 0;
              this.total[count] = 0;
              for (let i = 0; i < result.data.result.length; i++) {
                if (key === result.data.result[i].oid) {
                  this.counts[count] += result.data.result[i].count;
                  this.total[count] +=
                    result.data.result[i].count * result.data.result[i].price;
                  arr.push(result.data.result[i]);
                }
                this.allOrderData[count] = arr;
              }
              this.total[count] = this.total[count] + ".00";
              count++;
            }

            this.isempty = this.allOrderData.length > 0 ? false : true;
            this.$forceUpdate();

            
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    change(active) {
      // 清空已有数据
      this.allOrderData = [];
      this.counts = [];
      this.total = [];
      this.oids = {};

      this.getAllOrderData(active);
      this.changeData({ key: "activeOrder", value: active });
    },

    // 转换时间
    dateTime(rowData) {
      // 
      var d = new Date(rowData);

      var year = d.getFullYear(); //年
      var month = d.getMonth() + 1; //月
      var day = d.getDate(); //日

      var hh = d.getHours(); //时
      var mm = d.getMinutes(); //分
      var ss = d.getSeconds(); //秒

      var clock = year + "-";

      if (month < 10) clock += "0";

      clock += month + "-";

      if (day < 10) clock += "0";

      clock += day + " ";

      if (hh < 10) clock += "0";

      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";

      if (ss < 10) clock += "0";
      clock += ss;
      return clock;
    },
    // 确认收货
    sureOrder(item, index) {
      let tokenString = localStorage.getItem("__Tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item[0].oid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === 80000) {
            this.$toast(result.data.msg);
            if (this.active == 1) {
              this.allOrderData.splice(index, 1);
              this.isempty = this.allOrderData.length > 0 ? false : true;
            } else {
              item[0].status = 2;
              this.$forceUpdate();
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 删除订单
    delOder(item, index) {
      let tokenString = localStorage.getItem("__Tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item[0].oid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code === 90000) {
            this.$toast(result.data.msg);
            this.allOrderData.splice(index, 1);
            this.isempty = this.allOrderData.length > 0 ? false : true;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

