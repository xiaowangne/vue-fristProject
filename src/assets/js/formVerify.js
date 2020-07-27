class ValidForm {
    constructor() {
        this.validUserFormReg = {
            //验证手机号
            phone: {
                reg: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}/,
                msg: '手机号格式不正确'
            },
            // 用户名
            nickName: {
                reg: /^[\u4e00-\u9fa5a-zA-Z][\u4e00-\u9fa5a-zA-Z\d]{1,7}$/,
                msg: '用户名格式不正确'
            },
            //邮箱
            email: {
                reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                msg: '邮箱格式不正确'
            },
            //6位数字验证码
            code: {
                reg: /^\d{6}$/,
                msg: '验证格式正确'
            },
            // 密码
            password: {
                reg: /^[a-zA-Z]\w{5,15}$/,
                msg: '密码格式不正确'
            }
        }
    }
    //验证表单
    validUserForm(o, self) {
        //o：验证表单数据, 类型：object

        for (let key in o) {
            if (!this.validUserFormReg[key].reg.test(o[key])) {
                self.$toast(this.validUserFormReg[key].msg);
                return false;
            }
        }
        //表单验证通过
        return true;
    }
}
export default new ValidForm();