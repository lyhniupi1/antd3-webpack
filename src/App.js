import React from 'react';
import { Button, Card, Layout, Typography, Form, Input, message } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const FormItem = Form.Item;

// 使用装饰器语法
@Form.create()
class App extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        message.success(`提交成功！用户名: ${values.username}, 邮箱: ${values.email}`);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#1890ff', padding: '0 20px' }}>
          <Title level={3} style={{ color: 'white', lineHeight: '64px', margin: 0 }}>
            Antd 3 类组件表单示例
          </Title>
        </Header>
        <Content style={{ padding: '50px' }}>
          <Card title="欢迎使用 Ant Design 3.26.20" style={{ maxWidth: 800, margin: '0 auto' }}>
            <Paragraph>
              这是一个使用 Ant Design 3.26.20、React 类组件和 @Form.create 装饰器构建的示例页面。
            </Paragraph>
            
            <div style={{ marginTop: 30 }}>
              <Title level={4}>表单示例</Title>
              <Paragraph>
                使用 @Form.create() 装饰器包装组件，实现表单验证和提交功能。
              </Paragraph>
              
              <Form onSubmit={this.handleSubmit} layout="vertical">
                <FormItem label="用户名">
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名!' }],
                  })(
                    <Input placeholder="请输入用户名" />
                  )}
                </FormItem>
                
                <FormItem label="邮箱">
                  {getFieldDecorator('email', {
                    rules: [
                      { required: true, message: '请输入邮箱!' },
                      { type: 'email', message: '请输入有效的邮箱地址!' }
                    ],
                  })(
                    <Input placeholder="请输入邮箱" />
                  )}
                </FormItem>
                
                <FormItem label="备注">
                  {getFieldDecorator('note')(
                    <Input.TextArea placeholder="请输入备注信息" rows={4} />
                  )}
                </FormItem>
                
                <FormItem>
                  <Button type="primary" htmlType="submit" size="large">
                    提交表单
                  </Button>
                  <Button 
                    style={{ marginLeft: 10 }} 
                    size="large"
                    onClick={() => this.props.form.resetFields()}
                  >
                    重置
                  </Button>
                </FormItem>
              </Form>
            </div>
            
            <div style={{ marginTop: 40 }}>
              <Title level={4}>组件说明</Title>
              <Paragraph>
                这个页面展示了以下功能：
              </Paragraph>
              <ul>
                <li>使用 @Form.create() 装饰器创建表单高阶组件</li>
                <li>类组件写法与生命周期管理</li>
                <li>Ant Design 表单验证规则</li>
                <li>Layout 布局组件</li>
                <li>消息提示组件</li>
              </ul>
            </div>
          </Card>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Antd 3 类组件示例 ©2026 - 使用 React 和 Ant Design 构建
        </Footer>
      </Layout>
    );
  }
}

export default App;