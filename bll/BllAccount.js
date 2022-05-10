import Bll from './Bll'
import account from '../apiInterface/account'
import apiinvoker from '../apiInterface/apiinvoker'
import axios from 'axios'
import constdict from '../utils/constdict'
import docCookies from '../utils/docCookies'
let apiaccount = new Proxy(new account(), { get: (x, y, z) => apiinvoker(x, y, z) })
class BllAccount extends Bll {

    constructor(ns) {
        super(ns || BllAccount.name);
    }

    async login({ account, pwd }) {
        //登陆逻辑,jwttoken在data和响应头中都有
        //响应头中的token是为了方便滑动过期,axios响应拦截器自动读取token值并且更新到本地存储
        //axios请求拦截器从本地存储读取token值放到请求头中
        await axios.post("http://localhost:8126/login/signIn", { account, pwd });
        docCookies.setItem(constdict.userName, account, Infinity,"/")
    }

    logout(){
        docCookies.removeItem(constdict.authentication,"/")
    }

    getcurrentUserName(){
      return  docCookies.getItem(constdict.userName)
    }
}

export default BllAccount;