import React, { useState } from 'react';
import './AccountingTable.css';

const App3 = () => {
  // 初始数据
  const [data, setData] = useState({
    accountingDate: '20260206',
    netAmount: '1,000.00',
    headOfficeAmount: '500.00',
    branchAmounts: ['200.00', '150.00', '50.00', '101.00'], // 分行支出明细
  });

  const [summary, setSummary] = useState({
    total: '1,000.00',
    netAmount: '1,000.00',
    headOfficeAmount: '500.00',
    branchTotal: '500.00', // 分行支出汇总
  });


  // 更新金额
  const updateAmount = (type, value, index = null) => {
    const numValue = parseFloat(value.replace(/,/g, '')) || 0;
    
    if (type === 'branch' && index !== null) {
      const newAmounts = [...data.branchAmounts];
      newAmounts[index] = formatCurrency(value);
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
    const branchTotal = branchAmounts.reduce((sum, amount) => {
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
    <div className="accounting-container">
      <h2>记账明细表</h2>
      
      <table className="accounting-table">
        <thead>
          <tr>
            <th className="header-cell">记账时间</th>
            <th className="header-cell">网联手续费文件金额</th>
            <th className="header-cell">总行支出</th>
            <th className="header-cell">分行支出</th>
          </tr>
        </thead>
        <tbody>
          {/* 第二行：明细数据 */}
          <tr className="data-row">
            <td className="date-cell">
              <input
                type="date"
                className="date-input"
                value={data.accountingDate}
                onChange={(e) => setData({...data, accountingDate: e.target.value})}
              />
            </td>
            <td className="amount-cell">
              <span className="amount-text">{data.netAmount}</span>
            </td>
            <td className="amount-cell">
              <span className="amount-text">{data.headOfficeAmount}</span>
            </td>
            <td className="branch-cell">
              <div className="branch-amounts-container">
                <div className="branch-amounts-grid">
                  {data.branchAmounts.map((amount, index) => (
                    <div key={index} className="branch-amount-item">
                      <span className="branch-amount-text">分行{index + 1}: {amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tr>
          
          {/* 第三行：合计 */}
          <tr className="summary-row">
            <td className="summary-label">合计金额</td>
            <td className="summary-amount">
              <span className="total-amount">{summary.netAmount}</span>
            </td>
            <td className="summary-amount">
              <span className="total-amount">{summary.headOfficeAmount}</span>
            </td>
            <td className="summary-amount">
                <div className="total-amount">
                  <span className="total-amount">{summary.branchTotal}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 统计信息 */}
      <div className="statistics">
        <div className="stat-item">
          <span className="stat-label">总金额：</span>
          <span className="stat-value">{summary.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">分行数量：</span>
          <span className="stat-value">{data.branchAmounts.length} 个</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">校验结果：</span>
          <span className={`check-result ${Math.abs(parseFloat(summary.total.replace(/,/g, '')) - 
            (parseFloat(data.netAmount.replace(/,/g, '')) || 0)) < 0.01 ? 'success' : 'error'}`}>
            {Math.abs(parseFloat(summary.total.replace(/,/g, '')) - 
              (parseFloat(data.netAmount.replace(/,/g, '')) || 0)) < 0.01 ? '✓ 金额平衡' : '✗ 金额不平衡'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default App3;