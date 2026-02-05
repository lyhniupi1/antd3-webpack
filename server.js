const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// 启用 CORS
app.use(cors());

// 解析 JSON 请求体
app.use(express.json());

// 处理 FlexProcess 请求
app.post('/handleEmail', (req, res) => {
  console.log('收到 handleEmail 请求:', req.body);
  // 模拟成功响应，数据字段与表格列匹配：email, user, description
  res.json({
    success: true,
    data: {
      list: [
        { email: 'admin@example.com', user: '张三', description: '管理员邮箱' },
        { email: 'finance@example.com', user: '李四', description: '财务部门邮箱' },
        { email: 'support@example.com', user: '王五', description: '技术支持邮箱' },
        { email: 'sales@example.com', user: '赵六', description: '销售部门邮箱' },
        { email: 'hr@example.com', user: '钱七', description: '人力资源邮箱' }
      ],
      total: 5
    }
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