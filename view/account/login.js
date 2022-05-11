import React from 'react'
import { Button, Form, Input, Row, Col, Carousel, Divider } from 'antd'
import BllAccount from '../../bll/BllAccount'
import { message } from 'antd';
import mes001 from '../../assets/mes001.jpeg'
import mes002 from '../../assets/mes002.jpeg'
import mes003 from '../../assets/mes003.jpeg'
import loginbackgroundimg from '../../assets/loginbackground.svg'
import './login.css'
const bll = new BllAccount();
class Login extends React.Component {
  componentDidMount() {
    this.autoFocusInst.focus();
    document.addEventListener("keydown", (event) => {
      if (event.code != 'NumpadEnter')
        return
      this.handleSubmit(event)
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let { form } = this.props;
    form.validateFields(this.validateFieldsCallback)
  }
  validateFieldsCallback = async (err, formValue) => {
    if (err) {
      return
    }
    await bll.login(formValue)
    let { history } = this.props;
    let { location: { search = '' } } = history;
    message.info("登陆成功", 1, () => {
      let target = search.replace("?returnurl=", '') || "/"
      target = decodeURIComponent(target);
      console.log("target", target)
      history.push(target);
    });
  }
  render() {
    let { form: { getFieldDecorator } } = this.props;
    return (
      <div>
        <div style={{ backgroundImage: `url(${'/' + loginbackgroundimg})`, position: 'fixed', height: '100%', width: '100%' }}></div>
        <Form onSubmit={this.handleSubmit} style={{ overflow: 'hidden' }}>
          <Row style={{ marginTop: 64 }}>
            <Col span={12} offset={5}>
              <Divider className="redline" orientation="left"><h3>艾泽拉斯国家地理</h3></Divider>
            </Col>
          </Row>
          <Row>
            <Col span={8} offset={5} style={{ paddingRight: 20 }}>
              <Carousel autoplay >
                <div>
                  <img style={{ height: 300, width: '100%' }} src={'/' + mes001} ></img></div>
                <div >
                  <img style={{ height: 300, width: '100%' }} src={'/' + mes002}></img></div>
                <div>
                  <img style={{ height: 300, width: '100%' }} src={'/' + mes003}></img></div>
              </Carousel>
            </Col>
            <Col span={4} style={{ marginTop: 20 }}>
              <Form.Item label="用户名">
                {getFieldDecorator("account", { initialValue: 'eeroom', rules: [{ required: true, message: "必须输入用户名" }] })(<Input ref={el => this.autoFocusInst = el} />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator("pwd", { initialValue: '123456', rules: [{ required: true, message: "必须输入密码" }] })(<Input type="password" />)}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>登陆</Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>
        <div style={{ margin: '0 auto', position: 'fixed', bottom: 10, width: '100%', textAlign: 'center', fontSize: 14, color: 'rgba(0,0,0,.45)' }}>&copy;<span style={{ paddingLeft: 3 }}>2022</span><span style={{ paddingLeft: 3 }}>艾泽拉斯国家地理出品</span></div>
      </div>

    );
  }
}

export default Form.create()(Login);