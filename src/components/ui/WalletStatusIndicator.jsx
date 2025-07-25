import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const WalletStatusIndicator = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [network, setNetwork] = useState('Base');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate wallet connection check
    const checkWalletConnection = () => {
      const connected = localStorage.getItem('wallet_connected') === 'true';
      if (connected) {
        setIsConnected(true);
        setWalletAddress('0x742d35Cc6Bb1d4B2f');
        setBalance('2.45');
      }
    };

    checkWalletConnection();
  }, []);

  const handleConnect = async () => {
    try {
      // Simulate wallet connection
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6Bb1d4B2f');
      setBalance('2.45');
      localStorage.setItem('wallet_connected', 'true');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance('0.00');
    localStorage.removeItem('wallet_connected');
    setIsExpanded(false);
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    // Could add toast notification here
  };

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-warning/10 text-warning px-3 py-2 rounded-md border border-warning/20">
          <div className="w-2 h-2 bg-warning rounded-full"></div>
          <span className="text-xs font-medium hidden sm:inline">Not Connected</span>
        </div>
        <button
          onClick={handleConnect}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium transition-smooth hover:bg-primary/90 hover:scale-hover"
        >
          <Icon name="Wallet" size={16} />
          <span className="hidden sm:inline">Connect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-3 bg-success/10 text-success px-3 py-2 rounded-md border border-success/20 transition-smooth hover:bg-success/20"
        >
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium font-mono">{formatAddress(walletAddress)}</span>
            <div className="flex items-center space-x-2 text-xs opacity-80">
              <span>{balance} ETH</span>
              <span>•</span>
              <span>{network}</span>
            </div>
          </div>
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
        </button>

        {/* Expanded Dropdown */}
        {isExpanded && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-lg shadow-prominent z-50 animate-scale-in">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">Wallet Connected</span>
                <div className="flex items-center space-x-1 text-success">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs">{network}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Address</span>
                  <button
                    onClick={copyAddress}
                    className="flex items-center space-x-1 text-xs font-mono text-text-primary hover:text-primary transition-smooth"
                  >
                    <span>{formatAddress(walletAddress)}</span>
                    <Icon name="Copy" size={12} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Balance</span>
                  <span className="text-xs font-medium text-text-primary">{balance} ETH</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <button
                  onClick={handleDisconnect}
                  className="flex items-center space-x-2 w-full px-2 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-smooth"
                >
                  <Icon name="LogOut" size={14} />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-success p-2 rounded-md transition-smooth hover:bg-success/10"
        >
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <Icon name="Wallet" size={16} />
        </button>

        {/* Mobile Expanded View */}
        {isExpanded && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:hidden">
            <div className="w-full bg-surface rounded-t-lg p-4 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Wallet Status</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-success">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="font-medium">Connected to {network}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Address</span>
                    <button
                      onClick={copyAddress}
                      className="flex items-center space-x-1 font-mono text-text-primary"
                    >
                      <span>{formatAddress(walletAddress)}</span>
                      <Icon name="Copy" size={14} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Balance</span>
                    <span className="font-medium">{balance} ETH</span>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="flex items-center justify-center space-x-2 w-full py-3 text-destructive border border-destructive/20 rounded-md hover:bg-destructive/10 transition-smooth"
                >
                  <Icon name="LogOut" size={16} />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletStatusIndicator;
