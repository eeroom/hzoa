import React from 'react';
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon, Dropdown } from 'antd';
import { Routes, Route, Link } from "react-router-dom";
import './layoutfluid.css'
import BllAccount from '../bll/BllAccount';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
let bll = new BllAccount()

class LayoutFluid extends React.Component {
    async componentDidMount() {
        let { location: { pathname }, lstmenu } = this.props;
        if (pathname == "/") {
            pathname = "/home/index"
        }
        if (!lstmenu) {
            ({ lstmenu } = await bll.setmenuTree())
        }
        let menuselected = lstmenu.find(x => x.url == pathname);
        bll.setState({ menuselected })
    }
    onTitleClickHandler = ({ key, domEvent }) => {
        let { sideropenKeys } = this.props
        if (sideropenKeys.includes(key)) {
            sideropenKeys = sideropenKeys.filter(x => x != key)
        } else {
            sideropenKeys.push(key)
        }
        bll.setState({ sideropenKeys })
    }
    onclickHandler = () => {
        bll.logout()
        document.location.reload()
    }
    lstdropdwonItem = (
        <Menu style={{ marginTop: 6,marginRight:-10 }} >
            <Menu.Item key="0">
                <span><Icon type="setting" /></span>
                <span>个人设置</span>

            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1" onClick={this.onclickHandler}>
                <span><Icon type="logout" /></span>
                <span>退出登录</span>
            </Menu.Item>
        </Menu>
    );
    render() {
        let userName = bll.getcurrentUserName()
        let { menuselected = {}, lstRootmenu = [], sideropenKeys = [] } = this.props
        let seekRoot = node => node.pid ? seekRoot(node.parent) : node
        let root = seekRoot(menuselected)
        //状态保持,nav的url已他下面的选中的leaf为准,这样再次点nav就不会切换页面,切换别的nav后再切回来也可以保持状态
        root.navurl = menuselected.url
        return (
            <Layout>
                <Header style={{
                    position: 'fixed',
                    zIndex: 1,
                    width: '100%',
                    height: 52
                }}>
                    <div className="logo" >燃烧的远征</div>
                    <div className="logout" id='lstuserdrop'>
                        <Dropdown overlay={this.lstdropdwonItem} placement="bottomRight" getPopupContainer={() => document.getElementById('lstuserdrop')} >
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <span className="logout-username" ><Icon style={{ marginRight: 5 }} type="user" />{userName}</span>
                            </a>
                        </Dropdown>
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={[root.id]}
                        style={{ lineHeight: '52px', height: 52 }}
                    >
                        {lstRootmenu.map(x => (<Menu.Item key={x.id}><Link to={x.url || x.navurl}>{x.name}</Link></Menu.Item>))}
                    </Menu>


                </Header>
                <Layout>
                    <Sider width={200} style={{
                        background: '#fff', marginTop: 48, overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0
                    }} breakpoint="md">
                        <Menu
                            mode="inline"
                            selectedKeys={[menuselected.id]}
                            openKeys={sideropenKeys}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            {root.children && root.children.map(l1 => (<SubMenu
                                key={l1.id}
                                onTitleClick={this.onTitleClickHandler}
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
                    <Layout style={{ padding: '0 20px', marginTop: 52, marginLeft: 200 }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default connect(x => ({ ...x[bll.namespace] }))(LayoutFluid)