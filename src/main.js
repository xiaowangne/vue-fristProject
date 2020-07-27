import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

// 引入组件
import Code from './components/Code.vue'

Vue.component('Code',Code)

// 引入字体图标
import 'font-awesome/css/font-awesome.min.css';

// 导入vant框架
import { NavBar,Form ,Button,Field,Icon,CountDown,Toast, Tabbar, TabbarItem ,Swipe, SwipeItem,Search , Sidebar, SidebarItem,Lazyload,Card,Image as VanImage, Stepper, GoodsAction, GoodsActionIcon, GoodsActionButton,Divider,Tag ,SwipeCell, Checkbox, CheckboxGroup,SubmitBar,Empty,List,AddressEdit, ActionSheet, AddressList,Cell, CellGroup , Tab, Tabs,Uploader} from 'vant';

//导入用于设置 rem 基准值模块
import 'lib-flexible'
Vue.config.productionTip = false

// 注册vant框架组件
Vue.use(NavBar).use(Form).use(Button).use(Field).use(Icon).use( CountDown).use(Toast).use( Tabbar).use(TabbarItem ).use(Swipe).use(SwipeItem).use(Search).use( Sidebar).use(SidebarItem ).use(Lazyload).use(Card).use(VanImage ).use( Stepper).use( GoodsAction).use( GoodsActionIcon).use(GoodsActionButton).use(Divider).use(Tag).use(SwipeCell).use( Checkbox).use( CheckboxGroup).use(SubmitBar).use(Empty).use(List ).use(AddressEdit).use( ActionSheet).use( AddressList).use(Cell).use(CellGroup).use( Tab).use( Tabs).use(Uploader)

//注册axios
Vue.use(VueAxios, axios)

//配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//配置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

//发起请求之前处理
axios.interceptors.request.use(config => {
  // 

  if (config.method == 'post') {
    let paramsString = '';
    //post请求参数序列化，转成一个字符串
    for (let key in config.data) {
      paramsString += key + '=' + config.data[key] + '&'
    }

    // 

    config.data = paramsString.slice(0, -1);

    // 
  }

  return config;
})
//添加appkey属性保存appkey
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
