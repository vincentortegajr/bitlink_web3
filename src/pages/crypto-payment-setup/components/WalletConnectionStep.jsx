import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WalletConnectionStep = ({ onNext, isActive }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState({
    eth: '0.00',
    usdc: '0.00',
    base: '0.00'
  });
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const connected = localStorage.getItem('wallet_connected') === 'true';
    if (connected) {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6Bb1d4B2f8A3E9C1F5D8B7A4C2E6F9D3');
      setBalance({
        eth: '2.45',
        usdc: '1,250.00',
        base: '850.75'
      });
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress('0x742d35Cc6Bb1d4B2f8A3E9C1F5D8B7A4C2E6F9D3');
      setBalance({
        eth: '2.45',
        usdc: '1,250.00',
        base: '850.75'
      });
      localStorage.setItem('wallet_connected', 'true');
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    setBalance({
      eth: '0.00',
      usdc: '0.00',
      base: '0.00'
    });
    localStorage.removeItem('wallet_connected');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const supportedCurrencies = [
    { symbol: 'ETH', name: 'Ethereum', balance: balance.eth, icon: 'Coins' },
    { symbol: 'USDC', name: 'USD Coin', balance: balance.usdc, icon: 'DollarSign' },
    { symbol: 'BASE', name: 'Base Token', balance: balance.base, icon: 'Triangle' }
  ];

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Connect Your Wallet</h2>
        <p className="text-text-secondary">
          Connect your Coinbase Smart Wallet to start accepting crypto payments
        </p>
      </div>

      {!isConnected ? (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Wallet" size={32} className="text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Coinbase Smart Wallet</h3>
              <p className="text-sm text-text-secondary">
                Secure, gasless transactions on Base Chain with built-in payment processing
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Shield" size={20} className="text-success mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Why Coinbase Smart Wallet?</p>
                  <ul className="text-xs text-text-secondary mt-1 space-y-1">
                    <li>• No gas fees for transactions</li>
                    <li>• Built-in fraud protection</li>
                    <li>• Instant payment notifications</li>
                    <li>• Multi-currency support</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              onClick={handleConnect}
              loading={isConnecting}
              iconName="Wallet"
              iconPosition="left"
              fullWidth
            >
              {isConnecting ? 'Connecting...' : 'Connect Coinbase Wallet'}
            </Button>

            <p className="text-xs text-text-secondary">
              By connecting, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <Icon name="Check" size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-success">Wallet Connected Successfully</p>
                <p className="text-xs text-success/80 font-mono">{formatAddress(walletAddress)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                iconName="LogOut"
                className="text-success hover:text-success/80"
              >
                Disconnect
              </Button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Wallet Balance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {supportedCurrencies.map((currency) => (
                <div key={currency.symbol} className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name={currency.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{currency.symbol}</p>
                      <p className="text-xs text-text-secondary">{currency.name}</p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-text-primary mt-2 font-mono">
                    {currency.balance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Info" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Base Chain Network</p>
                <p className="text-xs text-text-secondary">
                  Connected to Base mainnet for fast, low-cost transactions
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={onNext}
              iconName="ArrowRight"
              iconPosition="right"
            >
              Continue to Payment Setup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnectionStep;