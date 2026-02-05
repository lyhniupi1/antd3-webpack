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
  // 模拟成功响应
  res.json({
    success: true,
    data: {
      list: [
        { id: 1, email: 'test1@example.com', status: 'active' },
        { id: 2, email: 'test2@example.com', status: 'inactive' }
      ],
      total: 2
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