import React from 'react';
import {
  Button,
  Card,
  Layout,
  Typography,
  Form,
  Input,
  message,
  Table,
  Modal,
  Popconfirm,
  Row,
  Col,
  Pagination,
  Icon
} from 'antd';

const { Title, Paragraph } = Typography;
const FormItem = Form.Item;
import FlexProcess from './service';

import './index.less'

// 使用装饰器语法
@Form.create()
class App2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 邮箱数据
      emailData: [],
      // 分页
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0,
      },
      // 模态框
      modalVisible: false,
      modalTitle: '新增邮箱',
      editingRecord: null,
      // 表单验证
      loading: false,
    };
  }

  async componentDidMount() {
    // 组件挂载后加载邮箱数据
    this.handleEmailQuery();
  }

  // 查询邮箱数据
  handleEmailQuery = () => {
    FlexProcess('handleEmail', { operateType: 'query' })
      .then(response => {
        console.log(JSON.stringify(response))
        // 处理响应数据
        if (response && response.success) {
          // 假设响应数据在 response.data 中，且每个数据项有 key 字段
          const emailData = response.data.list.map((item, index) => ({
            ...item,
            key: item.key || (index + 1).toString(),
          }));
          this.setState({
            emailData,
            pagination: {
              ...this.state.pagination,
              total: emailData.length,
            },
          });
        } else {
          console.error('查询邮箱数据失败:', response);
          message.error('加载邮箱数据失败');
        }
      })
      .catch(error => {
        console.error('查询邮箱数据异常:', error);
        message.error('加载邮箱数据异常');
      });
  };

  // 显示新增/编辑模态框
  showModal = (record = null) => {
    const { form } = this.props;
    if (record) {
      // 编辑模式
      form.setFieldsValue({
        email: record.email,
        user: record.user,
        description: record.description,
      });
      this.setState({
        modalVisible: true,
        modalTitle: '编辑邮箱',
        editingRecord: record,
      });
    } else {
      // 新增模式
      form.resetFields();
      this.setState({
        modalVisible: true,
        modalTitle: '新增邮箱',
        editingRecord: null,
      });
    }
  };

  // 隐藏模态框
  hideModal = () => {
    this.setState({
      modalVisible: false,
      editingRecord: null,
    });
    this.props.form.resetFields();
  };

  // 处理表单提交
  handleSubmit = () => {
    const { form } = this.props;
    const { emailData, editingRecord } = this.state;
    
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      
      this.setState({ loading: true });
      
      // 模拟API调用延迟
      setTimeout(() => {
        if (editingRecord) {
          // 更新现有记录
          const newData = emailData.map(item => 
            item.key === editingRecord.key ? { ...item, ...values, key: editingRecord.key } : item
          );
          this.setState({
            emailData: newData,
            loading: false,
          });
          message.success('邮箱更新成功');
        } else {
          // 新增记录
          const newRecord = {
            key: (emailData.length + 1).toString(),
            ...values,
          };
          this.setState({
            emailData: [...emailData, newRecord],
            pagination: {
              ...this.state.pagination,
              total: emailData.length + 1,
            },
            loading: false,
          });
          message.success('邮箱新增成功');
        }
        
        this.hideModal();
      }, 500);
    });
  };

  // 删除邮箱
  handleDelete = (key) => {
    const { emailData } = this.state;
    const newData = emailData.filter(item => item.key !== key);
    
    this.setState({
      emailData: newData,
      pagination: {
        ...this.state.pagination,
        total: newData.length,
      },
    });
    message.success('邮箱删除成功');
  };

  // 处理分页变化
  handleTableChange = (pagination) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    });
  };

  // 渲染表格列
  getColumns = () => {
    return [
      {
        title: '邮箱地址',
        dataIndex: 'email',
        key: 'email',
        width: '30%',
        render: (text) => <span style={{ color: '#1890ff' }}>{text}</span>,
      },
      {
        title: '使用人',
        dataIndex: 'user',
        key: 'user',
        width: '20%',
      },
      {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        width: '30%',
      },
      {
        title: '操作',
        key: 'action',
        width: '20%',
        render: (text, record) => (
          <span>
            <Button
              type="link"
              onClick={() => this.showModal(record)}
              style={{ marginRight: 8, color: '#1890ff' }}
            >
              <Icon type="edit" style={{ marginRight: 4 }} />编辑
            </Button>
            <Popconfirm
              title="确定要删除这个邮箱吗？"
              onConfirm={() => this.handleDelete(record.key)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger>
                <Icon type="delete" style={{ marginRight: 4 }} />删除
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];
  };

  render() {
    const { form } = this.props;
    const { emailData, pagination, modalVisible, modalTitle, loading } = this.state;
    const { getFieldDecorator } = form;

    // 计算当前页数据
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const currentPageData = emailData.slice(startIndex, endIndex);

    return (
      <div className='mainContentWrap email-maintenance'>
        <div className='comTitle' style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' , marginTop: '24px' }}>
          网联发票邮箱维护功能
        </div>
        
        <Card 
          title="邮箱列表" 
          extra={
            <Button
              type="primary"
              icon={<Icon type="plus" />}
              onClick={() => this.showModal()}
              size="large"
              style={{
                backgroundColor: '#52c41a',
                borderColor: '#52c41a',
                fontWeight: 'bold',
                boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
                marginRight: '50px'
              }}
            >
              新增邮箱
            </Button>
          }
          className="table-section"
        >
          <Table
            columns={this.getColumns()}
            dataSource={currentPageData}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              pageSizeOptions: ['5', '10', '20', '50'],
            }}
            onChange={this.handleTableChange}
            rowKey="key"
            bordered
          />
        </Card>

        <Card className="form-section" style={{ marginTop: 20 }}>
          <Typography>
            <Title level={4}>使用说明</Title>
            <Paragraph>
              1. 点击右上角的"新增邮箱"按钮可以添加新的邮箱信息。
            </Paragraph>
            <Paragraph>
              2. 在表格中点击"编辑"按钮可以修改现有邮箱信息。
            </Paragraph>
            <Paragraph>
              3. 点击"删除"按钮可以删除对应的邮箱记录。
            </Paragraph>
            <Paragraph>
              4. 邮箱地址将作为主键，请确保唯一性。
            </Paragraph>
            <Paragraph type="secondary">
              提示：系统支持分页显示，您可以通过表格下方的分页控件浏览更多数据。
            </Paragraph>
          </Typography>
        </Card>

        {/* 新增/编辑模态框 */}
        <Modal
          title={modalTitle}
          visible={modalVisible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          confirmLoading={loading}
          okText="确定"
          cancelText="取消"
          width={600}
        >
          <Form layout="vertical">
            <FormItem label="邮箱地址">
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ],
              })(
                <Input placeholder="例如：user@example.com" />
              )}
            </FormItem>
            <FormItem label="使用人">
              {getFieldDecorator('user', {
                rules: [
                  { required: true, message: '请输入使用人' },
                  { max: 20, message: '使用人名称不能超过20个字符' },
                ],
              })(
                <Input placeholder="例如：张三" />
              )}
            </FormItem>
            <FormItem label="说明">
              {getFieldDecorator('description', {
                rules: [
                  { max: 100, message: '说明不能超过100个字符' },
                ],
              })(
                <Input.TextArea 
                  placeholder="例如：财务部门专用邮箱" 
                  rows={3}
                />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default App2;