import React from 'react';
import { connect } from 'react-redux'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { Routes, Route, Link } from "react-router-dom";
import './index.css'
import LayoutFluid from '../../component/layoutfluid'
import useLayout from '../../component/useLayout'
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

class Index extends React.Component {

    render() {
        return (
            <div> Content</div>)
    }
}

export default useLayout(LayoutFluid)(Index)