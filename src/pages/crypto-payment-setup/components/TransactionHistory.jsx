import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading transaction history
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 'tx_1',
          hash: '0x742d35Cc6Bb1d4B2f8A3E9C1F5D8B7A4C2E6F9D3',
          amount: '0.05',
          currency: 'ETH',
          usdValue: '125.50',
          status: 'completed',
          type: 'payment',
          from: '0x1234...5678',
          to: '0x8765...4321',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          description: 'Buy Me a Coffee',
          gasUsed: '21000',
          gasFee: '0.001'
        },
        {
          id: 'tx_2',
          hash: '0x8A3E9C1F5D8B7A4C2E6F9D3742d35Cc6Bb1d4B2f',
          amount: '50.00',
          currency: 'USDC',
          usdValue: '50.00',
          status: 'pending',
          type: 'payment',
          from: '0x9876...1234',
          to: '0x4321...8765',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          description: 'Premium Content Access',
          gasUsed: '45000',
          gasFee: '0.002'
        },
        {
          id: 'tx_3',
          hash: '0xF5D8B7A4C2E6F9D3742d35Cc6Bb1d4B2f8A3E9C1',
          amount: '0.02',
          currency: 'ETH',
          usdValue: '50.20',
          status: 'failed',
          type: 'payment',
          from: '0x5555...9999',
          to: '0x1111...3333',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          description: 'Tip Payment',
          gasUsed: '0',
          gasFee: '0',
          errorReason: 'Insufficient balance'
        },
        {
          id: 'tx_4',
          hash: '0xC2E6F9D3742d35Cc6Bb1d4B2f8A3E9C1F5D8B7A4',
          amount: '100.00',
          currency: 'BASE',
          usdValue: '85.00',
          status: 'completed',
          type: 'payment',
          from: '0x7777...2222',
          to: '0x6666...4444',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          description: 'Course Purchase',
          gasUsed: '35000',
          gasFee: '0.0015'
        }
      ];
      
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return { name: 'CheckCircle', color: 'text-success' };
      case 'pending': return { name: 'Clock', color: 'text-warning' };
      case 'failed': return { name: 'XCircle', color: 'text-destructive' };
      default: return { name: 'Circle', color: 'text-text-secondary' };
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    
    return `px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.completed}`;
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const totalValue = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + parseFloat(tx.usdValue), 0);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-text-primary">Recent Transactions</h3>
          <p className="text-sm text-text-secondary">
            Total received: ${totalValue.toFixed(2)} USD
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-border rounded-md px-3 py-1 bg-background text-text-primary"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Receipt" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-text-secondary">No transactions found</p>
          <p className="text-sm text-text-secondary mt-1">
            {filter === 'all' ? 'Transactions will appear here once you start receiving payments' : `No ${filter} transactions`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => {
            const statusIcon = getStatusIcon(tx.status);
            
            return (
              <div key={tx.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name={statusIcon.name} size={20} className={statusIcon.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {tx.description}
                        </p>
                        <span className={getStatusBadge(tx.status)}>
                          {tx.status}
                        </span>
                      </div>
                      
                      <div className="text-xs text-text-secondary space-y-1">
                        <div className="flex items-center space-x-4">
                          <span>From: {formatAddress(tx.from)}</span>
                          <span>•</span>
                          <span>{formatTimestamp(tx.timestamp)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="font-mono">{formatAddress(tx.hash)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="ExternalLink"
                            className="h-4 w-4 p-0"
                            onClick={() => window.open(`https://basescan.org/tx/${tx.hash}`, '_blank')}
                          />
                        </div>
                        
                        {tx.status === 'failed' && tx.errorReason && (
                          <div className="text-destructive">
                            Error: {tx.errorReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">
                      {tx.amount} {tx.currency}
                    </p>
                    <p className="text-xs text-text-secondary">
                      ${tx.usdValue} USD
                    </p>
                    {tx.status === 'completed' && (
                      <p className="text-xs text-text-secondary mt-1">
                        Gas: {tx.gasFee} ETH
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {filteredTransactions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;