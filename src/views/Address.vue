<template>
  <div class="address-page">
    <van-nav-bar :title="!!aid?'编辑地址':'新增地址'" left-text="返回" left-arrow @click-left="back" />
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-postal
      show-set-default
      show-search-result
      save-button-text="保存地址"
      delete-button-text="删除地址"
      :show-delete="!!aid"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="delAddress"
    />
  </div>
</template>

<script>
//导入地址数据
import { Toast } from "vant";
import areaList from "../assets/js/area";
export default {
  name: "Address",
  data() {
    return {
      areaList,
      //地址信息
      addressInfo: {
        //收货人
        name: "",
        //手机号
        tel: "",
        //省
        province: "",
        //城市
        city: "",
        //区县
        county: "",
        //详细地址
        addressDetail: "",
        //地区编号，地址选择
        areaCode: "",
        //邮编
        postalCode: "",
        //默认地址
        isDefault: false
      },
      aid: ""
    };
  },
  created() {
    //截取路由参数 地址id: aid
    this.aid = this.$route.params.aid;

    //如果是编辑地址，则查询地址数据关联

    if (this.aid) {
      this.getAddress(this.aid);
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    onSave(addressData) {
      let isSame = true;

      if (this.aid) {
        //判断用户是否修改地址, 需要获取当前地址数据和查询地址数据是否一致
        for (let key in this.addressInfo) {
          //存在不同数据,表明用户已经修改过地址
          if (this.addressInfo[key] != addressData[key]) {
            isSame = false;
          }
        }
      }
      let tokenString = localStorage.getItem("__Tk");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      addressData.isDefault = addressData.isDefault ? 1 : 0;
      if (this.aid) {
        if (!isSame) {
          this.axios({
            method: "POST",
            url: "/editAddress",
            data: {
              appkey: this.appkey,
              tokenString,
              aid: this.aid,
              name: addressData.name,
              tel: addressData.tel,
              province: addressData.province,
              city: addressData.city,
              county: addressData.county,
              addressDetail: addressData.addressDetail,
              areaCode: addressData.areaCode,
              postalCode: addressData.postalCode,
              isDefault: addressData.isDefault
            }
          })
            .then(result => {
              this.$toast.clear();

              if (result.data.code == 30000) {
                this.$router.push({ name: "MyAddress" });
                Toast(result.data.msg);
              } else {
                Toast(result.data.msg);
              }
            })
            .catch(err => {
              this.$toast.clear();
            });
        } else {
          this.$toast.clear();
        }
      } else {
        this.axios({
          method: "POST",
          url: "/addAddress",
          data: {
            appkey: this.appkey,
            tokenString,
            name: addressData.name,
            tel: addressData.tel,
            province: addressData.province,
            city: addressData.city,
            county: addressData.county,
            addressDetail: addressData.addressDetail,
            areaCode: addressData.areaCode,
            postalCode: addressData.postalCode,
            isDefault: addressData.isDefault
          }
        })
          .then(result => {
            this.$toast.clear();

            if (result.data.code == 9000) {
              this.$router.push({ name: "MyAddress" });
              Toast(result.data.msg);
            } else {
              Toast(result.data.msg);
            }
          })
          .catch(err => {
            this.$toast.clear();
          });
      }
    },

    // 获取编辑地址数据
    getAddress(aid) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 40000) {
            result.data.result[0].isDefault = Boolean(
              result.data.result[0].isDefault
            );
            for (let key in this.addressInfo) {
              this.addressInfo[key] = result.data.result[0][key];
            }
          }
        })
        .catch(err => {
          this.$toast.clear();
        });
    },

    // 删除地址
    delAddress(aid) {
      let tokenString = localStorage.getItem("__Tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      })
        .then(result => {
          this.$toast.clear();

          if (result.data.code == 10000) {
            this.$router.push({ name: "MyAddress" });
          } else {
            this.$toast(result.data.msg);
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
.address-page {
  color: #333;
  /deep/ .van-nav-bar__text,
  /deep/ .van-icon {
    color: @bgColor;
  }
  /deep/ .van-field__error-message {
    color: @bgColor;
  }
  /deep/ .van-button--danger,
  /deep/.van-address-edit__buttons .van-button {
    background: @color;
    color: #fff;
    border: 1px solid @color;
  }
  /deep/ .van-switch--on {
    background: @color;
  }
}
</style>