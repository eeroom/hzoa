import React from 'react';
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Routes, Route, Link } from "react-router-dom";
import './index.css'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
let lstmenu = [
    { id: 1, name: '首页', url: '/home/index' },
    { id: 2, name: '工作流程', url: '' },
    { id: 21, name: '流程办理', pid: 2, ico: 'user' },
    { id: 210, name: '发起流程', url: '/workflow/start', pid: 21 },
    { id: 211, name: '我的流程', url: '/workflow/mylist', pid: 21 },
    { id: 212, name: '待办列表', url: '/workflow/todolist', pid: 21 },
    { id: 213, name: '已办列表', url: '/workflow/historylist', pid: 21 },
    { id: 22, name: '流程设置', pid: 2, ico: 'laptop' },
    { id: 220, name: '流程定义', url: '/workflow/setting', pid: 22 },
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
]

class Start extends React.Component {
    constructor(props) {
        super(props)
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
        let lstnav = lstmenu.filter(x => !x.pid)
        let getnavurl = (nav) => {
            if (nav.url) {
                return nav.url
            }
            return getnavurl(nav.children[0])
        }
        lstnav.forEach(x => x.navurl = getnavurl(x))
        this.state = {
            lstnav,
            lstmenu,
            selectednav: {},
            siderselectedKeys: [],
            sideropenKeys: []
        }
    }
    componentDidMount() {
        console.log("componentDidMount-start")
        let { location } = this.props;
        let { pathname } = location;
        let { lstmenu } = this.state
        if (pathname == "/") {
            pathname = "/home/index"
        }
        var leaf = lstmenu.find(x => x.url == pathname);
        if (!leaf) {
            return
        }
        let findnav = (menu, sideropenKeys) => {
            if (!menu.pid) {
                return menu
            }
            sideropenKeys.push(menu.id)
            return findnav(menu.parent)
        }
        let sideropenKeys = []
        let selectednav = findnav(leaf, sideropenKeys)
        let siderselectedKeys = [leaf.id]
        this.setState({ ...this.state, selectednav, sideropenKeys, siderselectedKeys })


    }
    render() {
        let { lstnav, selectednav, siderselectedKeys, sideropenKeys } = this.state
        return (
            <Layout>
                <Header style={{
                    position: 'fixed',
                    zIndex: 1,
                    width: '100%'
                }}>
                    <div className="logo" >燃烧的远征</div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={[selectednav.id]}
                        style={{ lineHeight: '64px' }}
                    >
                        {lstnav.map(x => (<Menu.Item key={x.id}><Link to={x.url||x.navurl}>{x.name}</Link></Menu.Item>))}
                    </Menu>
                </Header>
                <Layout>
                    <Sider width={200} style={{
                        background: '#fff', marginTop: 64, overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0
                    }} breakpoint="md">
                        <Menu
                            mode="inline"
                            selectedKeys={siderselectedKeys}
                            openKeys={sideropenKeys}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            {selectednav.children && selectednav.children.map(l1 => (<SubMenu
                                key={l1.id}
                                title={
                                    <span>
                                        <Icon type={l1.ico} />
                                        {l1.name}
                                    </span>
                                }
                            >{l1.children.map(l2 => (<Menu.Item key={l2.id}><Link to={l2.url}>{l2.name}</Link></Menu.Item>))}
                            </SubMenu>))}
                        </Menu>
                    </Sider>
                    <Layout style={{ padding: '0 20px', marginTop: 64, marginLeft: 200 }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content>
                            创建流程
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default Start