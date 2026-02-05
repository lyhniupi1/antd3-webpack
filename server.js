const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// 启用 CORS
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

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
  const { operateType, email, user, description } = req.body;
  
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
      // 根据 email 修改数据
      if (!email) {
        return res.json({
          success: false,
          message: '编辑操作需要 email 参数'
        });
      }
      const index = dataList.findIndex(item => item.email === email);
      if (index !== -1) {
        // 更新找到的条目
        dataList[index] = {
          email: email,
          user: user !== undefined ? user : dataList[index].user,
          description: description !== undefined ? description : dataList[index].description
        };
        res.json({
          success: true,
          message: `邮箱 ${email} 更新成功`,
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