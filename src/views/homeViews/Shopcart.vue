<template>
  <div class="shopcart-page">
    <!-- 如果购物车没有数据，则显示空页面 -->
    <div v-if="isEmpty">
      <van-empty class="custom-image" description="购物车空空如也，逛一逛">
        <template #image>
          <div>
            <img src="../../assets/images/emptyBg.png" alt />
          </div>
        </template>
        <van-button type="danger" class="bottom-button" @click="goPage('Menu')">逛一逛</van-button>
      </van-empty>
    </div>

    <div class="shopcart-content" v-else>
      <van-nav-bar
        title="购物车"
        fixed
        :right-text="isManage?'管理':'完成'"
        @click-right="isManage=!isManage"
      />
      <van-swipe-cell v-for="(item,index) in shopcartData" :key="index">
        <div class="clearfix">
          <van-checkbox
            v-model="results[index]"
            @click="select(index)"
            class="checkbox-box fl"
            checked-color="#ffa200"
          ></van-checkbox>
          <van-card
            :price="item.price"
            :desc="item.enname"
            class="goods-card fl"
            :thumb="item.small_img"
          >
            <template #title>
              <div class="title-box clearfix">
                <span class="title fl">{{item.name}}</span>
                <span class="rules fl">{{item.rule}}</span>
              </div>
            </template>
            <template #num>
              <van-stepper
                v-model="item.count"
                theme="round"
                button-size="22"
                @change="changeCount(index,item.sid,item.count)"
                disable-input
              />
            </template>
          </van-card>
        </div>
        <template #right>
          <van-button
            square
            text="删除"
            type="danger"
            @click="delShopcart(index,item.sid)"
            class="delete-button"
          />
        </template>
      </van-swipe-cell>
      <div v-if="isIf">
        <button class="vButton" @click="goPage('Login')">点我登录</button>
      </div>
      <div class="none-box" v-else>哎呀,到底了!</div>
      <!-- 提交订单 -->
      <div v-if="!isIf">
        <div v-if="isManage" class="submit-box">
          <van-submit-bar
            :price="sumPrice"
            button-text="提交订单"
            :disabled="isDisabled"
            @submit="submit"
          >
            <van-checkbox v-model="checked" @click="allSelect" checked-color="#ffa200">全选</van-checkbox>
          </van-submit-bar>
        </div>
        <div v-else class="submit-box">
          <van-submit-bar button-text="删除" @submit="allDel" :disabled="isDisabled">
            <van-checkbox v-model="checked" @click="allSelect" checked-color="#ffa200">全选</van-checkbox>
          </van-submit-bar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/Shopcart.less";

export default {
  name: "Shopcart",
  data() {
    return {
      checked: false,
      isManage: true,
      value: 1,
      isEmpty: false,
      isDisabled: true,
      results: [],
      // 储存所有商品单价
      price: [],
      // 合计
      sumPrice: null,
      // 购物车商品
      shopcartData: [],
      isIf: false
    };
  },
  created() {
    this.getAllShopcart();
    let tokenString = localStorage.getItem("__Tk");

    if (!tokenString) {
      this.isIf = true;
    }
  },

  methods: {
    goPage(name) {
      this.$router.push({ name: name });
    },
    // 获取购物车商品
    getAllShopcart() {
      let tokenString = localStorage.getItem("__Tk");
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          //
          if (result.data.code == 5000) {
            this.shopcartData = result.data.result;
            for (let i = 0; i < this.shopcartData.length; i++) {
              this.price[i] = this.shopcartData[i].price;
              this.results[i] = false;
            }
            this.isEmpty = this.shopcartData.length == 0;

            if (this.shopcartData > 0 && this.isManage) {
              this.setPrice();
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },
    // 改变商品数量
    changeCount(index, sid, count) {
      let tokenString = localStorage.getItem("__Tk");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          sid,
          count,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          //
          if (result.data.code == 6000) {
            this.setPrice();
          }
        })
        .catch(err => {
          // this.$toast.clear();
        });
    },
    // 删除单个购物车商品
    delShopcart(index, sid) {
      let tokenString = localStorage.getItem("__Tk");
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          sids: JSON.stringify([sid]),
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 7000) {
            this.shopcartData.splice(index, 1);
            this.price.splice(index, 1);
            this.results.splice(index, 1);
            this.select();
            this.isEmpty = this.shopcartData.length == 0;
            if (this.isEmpty) {
              this.checked = false;
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    one() {
      for (let i = 0; i < this.results.length; i++) {
        if (!this.results[i]) {
          this.checked = this.results[i];
          return;
        }
        this.checked = this.results[i];
      }
    },

    disableOne() {
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i]) {
          this.isDisabled = false;
          return;
        }
      }
      this.isDisabled = true;
    },
    // 单选
    select() {
      this.one();
      this.setPrice();
      this.disableOne();
    },
    // 全选
    allSelect() {
      for (let i = 0; i < this.results.length; i++) {
        this.results[i] = this.checked;
        //
      }
      // 重新渲染当前组件
      if (this.checked) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
      this.$forceUpdate();
      this.setPrice();
    },
    // 计算合计
    setPrice() {
      this.sumPrice = 0;
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i]) {
          this.sumPrice += this.price[i] * this.shopcartData[i].count;
        }
      }
      this.sumPrice = this.sumPrice * 100;
    },
    // 选中删除
    allDel() {
      let tokenString = localStorage.getItem("__Tk");
      // 开启加载提示
      let sid = [];

      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i]) {
          sid[i] = this.shopcartData[i].sid;
        }
      }

      if (sid.length == 0) {
        this.$toast("请选择商品");
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          appkey: this.appkey,
          sids: JSON.stringify(sid),
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 7000) {
            for (let i = this.results.length - 1; i >= 0; i--) {
              if (this.results[i]) {
                this.shopcartData.splice(i, 1);
                this.price.splice(i, 1);
                this.results.splice(i, 1);
                this.select();
              }
            }
            this.isEmpty = this.shopcartData.length == 0;
            if (this.isEmpty) {
              this.checked = false;
            }
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    // 提交定单
    submit() {
      let sids = [];
      for (let i = 0; i < this.results.length; i++) {
        if (this.results[i]) {
          sids.push(this.shopcartData[i].sid);
        }
      }

      this.$router.push({ name: "Submit", query: { sids: sids.join("-") } });
    }
  }
};
</script>

<style lang="less" scoped>
</style>