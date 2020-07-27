<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
@fontColor: #333;
@bgColor: #f4a018;
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
body {
  background: #f6f6f6;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
.auto-img {
  width: 100%;
  display: block;
}
.van-picker__cancel,
.van-picker__confirm {
  color: @bgColor;
}
.vButton {
  width: 80px;
  height: 30px;
  background-color: #f6f6f6;
  border: 1px solid #ddd;
  color: #8a8a8a;
  border-radius: 5px;
  margin: 50px auto;
  display: block;
}
</style>
