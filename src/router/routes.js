export const routes = [

    {
        path: '/register',
        name: 'Register',
        component: r => require(['../views/Register.vue'], r)
    },
    {
        path: '/login',
        name: 'Login',
        component: r => require(['../views/Login.vue'], r)
    },
    {
        path:'/mune',
        name:'Home',
        component:r=>require(['../views/Home.vue'],r),
        children:[
            {
                path:'/menu',
                name:'Menu',
                component:r=>require(['../views/homeViews/Menu.vue'],r),
            },
            {
                path:'/order',
                name:'Order',
                component:r=>require(['../views/homeViews/Order.vue'],r),
            },
            {
                path:'/shopcart',
                name:'Shopcart',
                component:r=>require(['../views/homeViews/Shopcart.vue'],r),
            },
            {
                path:'/my',
                name:'My',
                component:r=>require(['../views/homeViews/My.vue'],r),
            }
        ]
    },
    {
        path:'/detail',
        name:'Detail',
        component:r=>require(['../views/Detail.vue'],r)
    },
    {
        path:'/address:aid?',
        name:'Address',
        component:r=>require(['../views/Address.vue'],r)
    },
    {
        path:'/myAddress',
        name:'MyAddress',
        component:r=>require(['../views/MyAddress.vue'],r)
    },
    {
        path:'/submit',
        name:'Submit',
        component:r=>require(['../views/Submit.vue'],r)
    },
    {
        path:'/search',
        name:'Search',
        component:r=>require(['../views/Search.vue'],r)
    },
    {
        path:'/mylike',
        name:'Mylike',
        component:r=>require(['../views/Mylike.vue'],r)
    },
    {
        path:'/user',
        name:'User',
        component:r=>require(['../views/User.vue'],r)
    },
    {
        path:'/safety',
        name:'Safety',
        component:r=>require(['../views/Safety.vue'],r)
    },
    {
        path:'/authCode',
        name:'AuthCode',
        component:r=>require(['../views/AuthCode.vue'],r)
    },
    {
        path:'/findPassword',
        name:'FindPassword',
        component:r=>require(['../views/FindPassword.vue'],r)
    },
    {
        path:'*',
        redirect:{
            name:'Menu'
        }
    }

]