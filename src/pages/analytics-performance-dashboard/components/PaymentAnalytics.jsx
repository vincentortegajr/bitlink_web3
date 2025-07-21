import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const paymentData = [
    { name: 'ETH', value: 45.2, amount: '2.34 ETH', color: '#627EEA' },
    { name: 'USDC', value: 32.8, amount: '1,245 USDC', color: '#2775CA' },
    { name: 'BASE', value: 22.0, amount: '890 BASE', color: '#0052FF' }
  ];

  const recentTransactions = [
    {
      id: '1',
      type: 'payment',
      amount: '0.05 ETH',
      usdValue: '$127.50',
      from: '0x742d...4B2f',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'confirmed',
      txHash: '0xabc123...def456'
    },
    {
      id: '2',
      type: 'payment',
      amount: '250 USDC',
      usdValue: '$250.00',
      from: '0x891a...7C3e',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'confirmed',
      txHash: '0x789xyz...123abc'
    },
    {
      id: '3',
      type: 'payment',
      amount: '100 BASE',
      usdValue: '$85.00',
      from: '0x456b...9D1f',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending',
      txHash: '0x456def...789ghi'
    }
  ];

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const getStatusColor = (status) => {
    return status === 'confirmed' ? 'text-success' : status === 'pending' ? 'text-warning' : 'text-destructive';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-prominent">
          <p className="text-sm font-medium text-text-primary">{data.name}</p>
          <p className="text-sm text-text-secondary">{data.value}% ({data.amount})</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Payment Distribution */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Payment Distribution</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedPeriod === 'week' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </Button>
            <Button
              variant={selectedPeriod === 'month' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-4">
            {paymentData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-text-primary">{item.name}</p>
                    <p className="text-sm text-text-secondary">{item.amount}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text-primary">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Recent Transactions</h3>
          <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="right">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-success/10 text-success rounded-md border border-success/20">
                  <Icon name="ArrowDownLeft" size={16} />
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-text-primary">{transaction.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'confirmed' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    From {transaction.from} • {formatTimestamp(transaction.timestamp)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-text-primary">{transaction.usdValue}</p>
                <button className="text-xs text-primary hover:text-primary/80 transition-smooth">
                  View on Base
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;