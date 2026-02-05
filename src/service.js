/**
 * 简单的 HTTP POST 请求调用函数
 * @param {string} process - 接口名称（例如 'user/login'）
 * @param {Object} params - 请求参数映射
 * @param {string} baseURL - 可选的基础 URL，默认为空（相对路径）
 * @returns {Promise} 返回 Promise，解析为响应数据
 */
function FlexProcess(process, params, baseURL = '') {
  // 构建完整的请求 URL
  const url = baseURL ? `${baseURL}/${process}` : `/${process}`;
  
  // 配置请求选项
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(params),
  };

  // 发起 fetch 请求
  return fetch(url, options)
    .then(response => {
      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP 错误 ${response.status}: ${response.statusText}`);
      }
      // 解析 JSON 响应
      return response.json();
    })
    .then(data => {
      // 返回解析后的数据
      return data;
    })
    .catch(error => {
      // 统一错误处理
      console.error('FlexProcess 请求失败:', error);
      throw error;
    });
}

export default FlexProcess;