import React from 'react';
import { connect } from 'react-redux'
import { Table, Divider, Tag } from 'antd';
import { Routes, Route, Link } from "react-router-dom";
import LayoutFluid from '../../component/layoutfluid'
import useLayout from '../../component/useLayout'
import Bll from '../../bll/Bll'
let bll=new Bll("definination")
const { Column, ColumnGroup } = Table;

class Definition extends React.Component {
    async componentDidMount(){
       let {data:lstdata=[]}= await bll.post("camunda/getProcessDefinitionEntity")
       let {data:lstdef=[]}= await bll.post("procdefex/getEntities")
       lstdata.forEach(x=>{
            let def= lstdef.find(a=>a.procdefKey==x.key)||{}
            x.bizType=def.bizType
            x.completeformComponetName=def.completeformComponetName
            x.createformComponentName=def.createformComponentName
            x.ico=def.ico
       })
       bll.setState({lstdata})
    }
    render() {
        let {lstdata=[]}=this.props
        return (
            <Table dataSource={lstdata}>
                <Column title="key" dataIndex="key" key="key" />
                <Column title="resourceName" dataIndex="resourceName" key="resourceName" />
                <Column title="diagramResourceName" dataIndex="diagramResourceName" key="diagramResourceName" />
                <Column title="bizType" dataIndex="bizType" key="bizType" />
                <Column title="completeformComponetName" dataIndex="completeformComponetName" key="completeformComponetName" />
                <Column title="createformComponentName" dataIndex="createformComponentName" key="createformComponentName" />
                <Column title="ico" dataIndex="ico" key="ico" />
                <Column
                    title="version"
                    dataIndex="version"
                    key="version"
                    render={tag => (
                        <Tag color="blue" key={tag}>
                        {tag}
                    </Tag>
                    )}
                />
                <Column
                    title="Action"
                    key="id"
                    render={(text, record) => (
                        <span>
                            <a>Invite {record.id}</a>
                            <Divider type="vertical" />
                            <a>Delete</a>
                        </span>
                    )}
                />
            </Table>)
    }
}

export default connect((x)=>({...x[bll.namespace]}))(useLayout(LayoutFluid)(Definition))