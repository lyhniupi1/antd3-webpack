import React, { useState, useEffect } from 'react';
import './index.less';
import FlexProcess from './service';

const App3 = () => {
  // 初始数据
  const [data, setData] = useState({
    accountingDate: '',
    netAmount: '0.00',
    headOfficeAmount: '0.00',
    branchAmounts: [], // 分行支出明细
  });

  const [summary, setSummary] = useState({
    total: '0.00',
    netAmount: '0.00',
    headOfficeAmount: '0.00',
    branchTotal: '0.00', // 分行支出汇总
  });

  // 单独的时间输入状态
  const [accountingDateInput, setAccountingDateInput] = useState('2025-01-01');

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FlexProcess('queryBankPayFeeSett', {});
        // 根据项目中的常见响应格式：{ success: true, data: { ... } }
        if (response && response.success) {
          const apiData = response.data || {};
          setData({
            accountingDate: accountingDateInput,
            netAmount: apiData.netAmount || '0.00',
            headOfficeAmount: apiData.headOfficeAmount || '0.00',
            branchAmounts: apiData.branchAmounts || []
          });
          // 重新计算汇总
          recalculateSummary(apiData.branchAmounts || [], apiData.netAmount || '0.00', apiData.headOfficeAmount || '0.00');
        } else {
          console.error('接口返回失败:', response);
          // 可以在这里添加错误处理，比如显示错误消息
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        // 可以在这里添加错误处理，比如显示错误消息
      }
    };

    fetchData();
  }, [accountingDateInput]);

  // 更新金额
  const updateAmount = (type, value, index = null) => {
    const numValue = parseFloat(value.replace(/,/g, '')) || 0;
    
    if (type === 'branch' && index !== null) {
      const newAmounts = [...data.branchAmounts];
      newAmounts[index] = {
        ...newAmounts[index],
        amount: formatCurrency(value)
      };
      setData({ ...data, branchAmounts: newAmounts });
      recalculateSummary(newAmounts);
    } else if (type === 'net') {
      setData({ ...data, netAmount: formatCurrency(value) });
      recalculateSummary(data.branchAmounts, formatCurrency(value), data.headOfficeAmount);
    } else if (type === 'headOffice') {
      setData({ ...data, headOfficeAmount: formatCurrency(value) });
      recalculateSummary(data.branchAmounts, data.netAmount, formatCurrency(value));
    }
  };

  // 重新计算汇总
  const recalculateSummary = (branchAmounts = data.branchAmounts, netAmount = data.netAmount, headOfficeAmount = data.headOfficeAmount) => {
    const branchTotal = branchAmounts.reduce((sum, item) => {
      const amount = typeof item === 'object' ? item.amount : item;
      return sum + (parseFloat(amount.replace(/,/g, '')) || 0);
    }, 0);
    
    const netNum = parseFloat(netAmount.replace(/,/g, '')) || 0;
    const headOfficeNum = parseFloat(headOfficeAmount.replace(/,/g, '')) || 0;
    
    setSummary({
      total: formatCurrency(netNum),
      netAmount: formatCurrency(netNum),
      headOfficeAmount: formatCurrency(headOfficeNum),
      branchTotal: formatCurrency(branchTotal)
    });
  };

  // 格式化金额
  const formatCurrency = (value) => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };


  return (
    <div className="mainContentWrap accounting-maintenance">
      <div className="comTitle" style={{fontSize:'24px', fontWeight:'bold', marginBottom:'50px', marginTop:'24px'}}>网联银行间付款业务手续费清算记录</div>
      
      <div className="table-section" style={{ marginBottom: '20px' }}>
        <table className="ant-table" style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e8e8e8' }}>
          <thead>
            <tr>
              <th style={{ background: '#F3F5FD', padding: '12px', textAlign: 'center', fontWeight: '600', border: '1px solid #e8e8e8' }}>记账时间</th>
              <th style={{ background: '#F3F5FD', padding: '12px', textAlign: 'center', fontWeight: '600', border: '1px solid #e8e8e8' }}>网联手续费文件金额</th>
              <th style={{ background: '#F3F5FD', padding: '12px', textAlign: 'center', fontWeight: '600', border: '1px solid #e8e8e8' }}>总行支出</th>
              <th style={{ background: '#F3F5FD', padding: '12px', textAlign: 'center', fontWeight: '600', border: '1px solid #e8e8e8' }}>分行支出</th>
            </tr>
          </thead>
          <tbody>
            {/* 第二行：明细数据 */}
            <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8' }}>
                <input
                  type="date"
                  style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                  value={accountingDateInput}
                  onChange={(e) => setAccountingDateInput(e.target.value)}
                />
              </td>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8' }}>
                <div style={{ padding: '8px', background: '#fafafa', borderRadius: '4px', fontWeight: '500' }}>{data.netAmount}</div>
              </td>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8' }}>
                <div style={{ padding: '8px', background: '#fafafa', borderRadius: '4px', fontWeight: '500' }}>{data.headOfficeAmount}</div>
              </td>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8' }}>
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.branchAmounts.map((item, index) => (
                      <div key={index} style={{ padding: '8px', background: '#fafafa', borderRadius: '4px' }}>
                        <span style={{ fontWeight: '500' }}>{item.branch}: {item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
            </tr>
            
            {/* 第三行：合计 */}
            <tr style={{ background: '#f8f9fa' }}>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8', fontWeight: '600' }}>合计金额</td>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8' }}>
                <div style={{ display: 'inline-block', padding: '6px 12px', background: '#488162', color: 'white', borderRadius: '4px', fontWeight: '600' }}>{summary.netAmount}</div>
              </td>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8' }}>
                <div style={{ display: 'inline-block', padding: '6px 12px', background: '#488162', color: 'white', borderRadius: '4px', fontWeight: '600' }}>{summary.headOfficeAmount}</div>
              </td>
              <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #e8e8e8' }}>
                <div style={{ display: 'inline-block', padding: '6px 12px', background: '#488162', color: 'white', borderRadius: '4px', fontWeight: '600' }}>{summary.branchTotal}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 统计信息 */}
      <div style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <span style={{ fontWeight: '500', marginRight: '8px' }}>总金额：</span>
            <span style={{ fontWeight: '600', color: '#1890ff' }}>{summary.total}</span>
          </div>
          <div>
            <span style={{ fontWeight: '500', marginRight: '8px' }}>分行数量：</span>
            <span style={{ fontWeight: '600', color: '#52c41a' }}>{data.branchAmounts.length} 个</span>
          </div>
          <div>
            <span style={{ fontWeight: '500', marginRight: '8px' }}>校验结果：</span>
            <span style={{
              fontWeight: '600',
              color: Math.abs(parseFloat(summary.total.replace(/,/g, '')) -
                (parseFloat(data.netAmount.replace(/,/g, '')) || 0)) < 0.01 ? '#52c41a' : '#ff4d4f'
            }}>
              {Math.abs(parseFloat(summary.total.replace(/,/g, '')) -
                (parseFloat(data.netAmount.replace(/,/g, '')) || 0)) < 0.01 ? '✓ 金额平衡' : '✗ 金额不平衡'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App3;