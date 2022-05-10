import React from 'react'
import {Button,Form,Input} from 'antd'
import BllAccount from '../../bll/BllAccount'
import { message } from 'antd';
const bll = new BllAccount();
class Login extends React.Component {
  componentDidMount() {
    this.autoFocusInst.focus();
  }
  handleSubmit=(e)=>{
    e.preventDefault()
    let { form } = this.props;
    form.validateFields(this.validateFieldsCallback)
  }
  validateFieldsCallback=async (err,formValue)=>{
      if(err){
        return
      }
      await bll.login(formValue)
      let { history } = this.props;
      let { location:{search = ''} } = history;
      message.info("登陆成功",1,()=>{
        let target = search.replace("?returnurl=", '') || "/"
        target = decodeURIComponent(target);
        console.log("target", target)
        history.push(target);
      });
  }
  render() {
    let { form:{getFieldDecorator} } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="用户名">
          {getFieldDecorator("account",{rules:[{required:true,message:"必须输入用户名"}]})(<Input ref={el=>this.autoFocusInst=el} />)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator("pwd",{rules:[{required:true,message:"必须输入密码"}]})(<Input type="password" />)}
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit">登陆</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Login);