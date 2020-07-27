<template>
  <div class="myAddress">
    <van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="back" fixed="" />
    <div class="address">
         <van-address-list v-model="aid" :list="list" default-tag-text="默认" @add="goAddress " @edit="goAddress"/>
    </div>
   
  </div>
</template>

<script>
export default {
  name: "MyAddress",
  data() {
    return {
      aid: "1",
      list: []
    };
  },
  created() {
    this.getMyAddress();
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
              }
              this.list.push(currentAddress);
            });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

   // 新增，编辑地址, 新增地址不要携带aid, 编辑地址需要携带aid, aid： 地址id
    goAddress(address) {

      let o = {
        name: 'Address'
      };

      if (address) {
          
          
          o.params = {
          aid: address.id
        }
      }
      
      
      this.$router.push(o);
    }
  }
};
</script>

<style lang="less" scoped>
@bgColor: #f4a018;
@color: #ffa200;
.myAddress {
    .address{
        position: fixed;
        top:46.01px ;
        left: 0;
        right: 0;
        bottom:80.01px;
        overflow-y: auto;
    }
  color: #333;
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar__arrow {
    color: @bgColor;
  }
  /deep/.van-tag--danger {
    background: @color;
  }
  /deep/.van-radio__icon {
    display: none;
  }
  /deep/ .van-button--danger {
    background: @color;
    border: 1px solid @color;
  }
}
</style>