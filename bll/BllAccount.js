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
        docCookies.setItem(constdict.userName, account, Infinity, "/")
    }

    logout() {
        docCookies.removeItem(constdict.authentication, "/")
    }

    getcurrentUserName() {
        return docCookies.getItem(constdict.userName)
    }

    async getmenu() {
        let lst = await new Promise((x, y) => {
            window.setTimeout(() => {
                x([
                    { id: 1, name: '首页', url: '/home/index' },
                    { id: 2, name: '工作流程', url: '' },
                    { id: 21, name: '流程办理', pid: 2, ico: 'user' },
                    { id: 210, name: '发起流程', url: '/workflow/start', pid: 21 },
                    { id: 211, name: '我的流程', url: '/workflow/mylist', pid: 21 },
                    { id: 212, name: '待办列表', url: '/workflow/todolist', pid: 21 },
                    { id: 213, name: '已办列表', url: '/workflow/historylist', pid: 21 },
                    { id: 22, name: '流程设置', pid: 2, ico: 'laptop' },
                    { id: 220, name: '流程定义', url: '/workflow/definition', pid: 22 },
                    { id: 221, name: '表单配置', url: '/workflow/form', pid: 22 },
                    { id: 222, name: '审批配置', url: '/workflow/approve', pid: 22 },
                    { id: 3, name: '公司网盘', url: '/wangpan/index' },
                    { id: 4, name: '客户管理', url: '' },
                    { id: 41, name: '我的客户', url: '/cc/index', pid: 4, ico: 'notification' },
                    { id: 42, name: '售后回访', url: '/cc/huifang', pid: 4 },
                    { id: 5, name: '合同管理', url: '' },
                    { id: 51, name: '合同列表', url: '/hetong/index', pid: 5 },
                    { id: 52, name: '合同设置', url: '/hetong/index', pid: 5 },
                    { id: 6, name: '人事管理', url: '' },
                    { id: 61, name: '员工档案', url: '/employee/index', pid: 6 },
                    { id: 62, name: '员工绩效', url: '/employee/index', pid: 6 },
                    { id: 63, name: '员工考勤', url: '/employee/index', pid: 6 },
                    { id: 64, name: '员工薪酬', url: '/employee/index', pid: 6 },
                ])
            }, 200)
        })
        lst.forEach(x=>{
            x.id=x.id+''
            x.pid=(x.pid||'')+''
        })
        return lst
    }

    async setmenuTree() {
        let { lstmenu } = this.getState()
        if (lstmenu)
            return
        lstmenu = await this.getmenu()
        let dict = {}
        lstmenu.forEach(x => {
            x.children = []
            dict[x.id] = x
        })
        lstmenu.forEach(x => {
            if (!x.pid) {
                return
            }
            x.parent = dict[x.pid]
            x.parent.children.push(x)
        })
        let lstRootmenu = lstmenu.filter(x => !x.pid)
        let getnavurl=node=>node.url?node.url:getnavurl(node.children[0])
        lstRootmenu.forEach(x => x.navurl = getnavurl(x))
        //左侧菜单默认全部展开
        let sideropenKeys = lstmenu.filter(x => x.children.length > 1).map(x => x.id)
        this.setState({ lstmenu, lstRootmenu, sideropenKeys })
        return { lstmenu, lstRootmenu }
    }
}

export default BllAccount;