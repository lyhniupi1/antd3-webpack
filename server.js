const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// 启用 CORS
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());
// 解析表单数据 (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

//初始化邮箱数据
let dataList = [
        { email: 'admin@example.com', user: '张三', description: '管理员邮箱' },
        { email: 'finance@example.com', user: '李四', description: '财务部门邮箱' },
        { email: 'support@example.com', user: '王五', description: '技术支持邮箱' },
        { email: 'sales@example.com', user: '赵六', description: '销售部门邮箱' },
        { email: 'hr@example.com', user: '钱七', description: '人力资源邮箱' }
      ];

// 处理 FlexProcess 请求
app.post('/handleEmail', (req, res) => {
  console.log('收到 handleEmail 请求:', req.body);
  
  // 获取所有请求参数的示例
  // 1. 请求体参数 (JSON 或表单数据)
  //    - JSON 数据: Content-Type: application/json
  //    - 表单数据: Content-Type: application/x-www-form-urlencoded (已通过 express.urlencoded 解析)
  //    - 多部分表单数据: Content-Type: multipart/form-data (需要 multer 等中间件)
  const bodyParams = req.body;
  // 2. 查询字符串参数 (URL 中的 ?key=value)
  const queryParams = req.query;
  // 3. 路由参数 (如 /users/:id)
  const routeParams = req.params;
  // 4. 请求头
  const headers = req.headers;
  
  // 打印所有参数用于调试
  console.log('所有请求参数:');
  console.log('- 请求体 (JSON/表单):', bodyParams);
  console.log('- 查询参数:', queryParams);
  console.log('- 路由参数:', routeParams);
  console.log('- 请求头:', headers);
  
  // 也可以合并所有参数到一个对象（注意优先级）
  const allParams = {
    ...routeParams,
    ...queryParams,
    ...bodyParams,
    // 请求头通常单独处理，不合并到参数中
  };
  console.log('合并后的参数:', allParams);
  
  const { operateType, email, user, description, oriEmail } = req.body;
  
  // 根据 operateType 执行相应操作
  switch (operateType) {
    case 'query':
      // 查询所有数据
      res.json({
        success: true,
        data: {
          list: dataList,
          total: dataList.length
        }
      });
      break;
      
    case 'delete':
      // 根据 email 删除数据
      if (!email) {
        return res.json({
          success: false,
          message: '删除操作需要 email 参数'
        });
      }
      const initialLength = dataList.length;
      dataList = dataList.filter(item => item.email !== email);
      if (dataList.length < initialLength) {
        res.json({
          success: true,
          message: `邮箱 ${email} 删除成功`,
          data: {
            list: dataList,
            total: dataList.length
          }
        });
      } else {
        res.json({
          success: false,
          message: `未找到邮箱 ${email}`
        });
      }
      break;
      
    case 'edit':
      // 根据 oriEmail 定位要修改的邮箱记录，使用 email, user, description 作为新值
      if (!oriEmail) {
        return res.json({
          success: false,
          message: '编辑操作需要 oriEmail 参数来定位原始邮箱'
        });
      }
      const index = dataList.findIndex(item => item.email === oriEmail);
      if (index !== -1) {
        // 更新找到的条目
        dataList[index] = {
          email: email !== undefined ? email : oriEmail, // 如果提供了新邮箱则更新，否则保持原邮箱
          user: user !== undefined ? user : dataList[index].user,
          description: description !== undefined ? description : dataList[index].description
        };
        res.json({
          success: true,
          message: `邮箱 ${oriEmail} 更新成功`,
          data: {
            list: dataList,
            total: dataList.length
          }
        });
      } else {
        res.json({
          success: false,
          message: `未找到邮箱 ${oriEmail}`
        });
      }
      break;
      
    case 'add':
      // 新增数据
      if (!email) {
        return res.json({
          success: false,
          message: '新增操作需要 email 参数'
        });
      }
      // 检查是否已存在相同 email
      if (dataList.some(item => item.email === email)) {
        return res.json({
          success: false,
          message: `邮箱 ${email} 已存在`
        });
      }
      dataList.push({
        email,
        user: user || '',
        description: description || ''
      });
      res.json({
        success: true,
        message: `邮箱 ${email} 新增成功`,
        data: {
          list: dataList,
          total: dataList.length
        }
      });
      break;
      
    default:
      // 未知操作类型
      res.json({
        success: false,
        message: `未知的操作类型: ${operateType}`
      });
  }
});

// 处理银行付款手续费清算查询
app.post('/queryBankPayFeeSett', (req, res) => {
  console.log('收到 queryBankPayFeeSett 请求:', req.body);
  
  // 模拟返回数据
  const mockData = {
    netAmount: '1,000.00',
    headOfficeAmount: '500.00',
    branchAmounts: [
      { branch: '分行1', amount: '200.00' },
      { branch: '分行2', amount: '150.00' },
      { branch: '分行3', amount: '50.00' },
      { branch: '分行4', amount: '101.00' }
    ]
  };
  
  res.json({
    success: true,
    ...mockData
  });
});

// 处理其他 FlexProcess 请求的通用路由
app.post('/:process', (req, res) => {
  console.log(`收到 ${req.params.process} 请求:`, req.body);
  // 返回通用成功响应
  res.json({
    success: true,
    message: `Process ${req.params.process} executed successfully`,
    data: req.body
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`模拟服务器运行在 http://localhost:${PORT}`);
});