import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const IntegrationTesting = ({ onPrevious, onComplete, isActive }) => {
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedTest, setSelectedTest] = useState('');
  const [testPayment, setTestPayment] = useState({
    amount: '0.01',
    currency: 'ETH',
    description: 'Test payment'
  });

  const availableTests = [
    {
      id: 'wallet-connection',
      name: 'Wallet Connection',
      description: 'Test wallet connectivity and balance retrieval',
      status: 'pending'
    },
    {
      id: 'payment-button',
      name: 'Payment Button',
      description: 'Test payment button functionality and UI',
      status: 'pending'
    },
    {
      id: 'transaction-flow',
      name: 'Transaction Flow',
      description: 'End-to-end payment processing test',
      status: 'pending'
    },
    {
      id: 'notification-delivery',
      name: 'Notification Delivery',
      description: 'Test email and webhook notifications',
      status: 'pending'
    },
    {
      id: 'error-handling',
      name: 'Error Handling',
      description: 'Test error scenarios and recovery',
      status: 'pending'
    }
  ];

  const [tests, setTests] = useState(availableTests);

  const currencyOptions = [
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
    { value: 'BASE', label: 'Base Token (BASE)' }
  ];

  const runSingleTest = async (testId) => {
    setIsRunningTests(true);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const testResult = {
      id: testId,
      timestamp: new Date(),
      status: Math.random() > 0.2 ? 'passed' : 'failed',
      duration: Math.floor(Math.random() * 3000) + 500,
      details: generateTestDetails(testId)
    };

    setTestResults(prev => [...prev, testResult]);
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: testResult.status }
        : test
    ));
    
    setIsRunningTests(false);
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    for (const test of tests) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const testResult = {
        id: test.id,
        timestamp: new Date(),
        status: Math.random() > 0.15 ? 'passed' : 'failed',
        duration: Math.floor(Math.random() * 3000) + 500,
        details: generateTestDetails(test.id)
      };

      setTestResults(prev => [...prev, testResult]);
      setTests(prev => prev.map(t => 
        t.id === test.id 
          ? { ...t, status: testResult.status }
          : t
      ));
    }
    
    setIsRunningTests(false);
  };

  const generateTestDetails = (testId) => {
    const details = {
      'wallet-connection': {
        checks: ['Wallet connectivity', 'Balance retrieval', 'Network validation'],
        metrics: { responseTime: '245ms', success: true }
      },
      'payment-button': {
        checks: ['Button rendering', 'Click handling', 'Amount validation'],
        metrics: { loadTime: '120ms', success: true }
      },
      'transaction-flow': {
        checks: ['Payment initiation', 'Blockchain confirmation', 'Status updates'],
        metrics: { totalTime: '15.2s', gasUsed: '21000' }
      },
      'notification-delivery': {
        checks: ['Email sending', 'Webhook delivery', 'Retry mechanism'],
        metrics: { deliveryTime: '850ms', retries: 0 }
      },
      'error-handling': {
        checks: ['Invalid amount', 'Network errors', 'Timeout handling'],
        metrics: { errorsCaught: 3, recoveryTime: '2.1s' }
      }
    };
    
    return details[testId] || { checks: [], metrics: {} };
  };

  const sendTestPayment = async () => {
    setIsRunningTests(true);
    
    // Simulate test payment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentResult = {
      id: 'test-payment-' + Date.now(),
      timestamp: new Date(),
      status: 'passed',
      duration: 3000,
      details: {
        checks: ['Payment creation', 'Amount validation', 'Mock transaction'],
        metrics: { 
          amount: testPayment.amount,
          currency: testPayment.currency,
          txHash: '0x' + Math.random().toString(16).substring(2, 66)
        }
      }
    };

    setTestResults(prev => [...prev, paymentResult]);
    setIsRunningTests(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return { name: 'CheckCircle', color: 'text-success' };
      case 'failed': return { name: 'XCircle', color: 'text-destructive' };
      case 'running': return { name: 'Loader', color: 'text-warning animate-spin' };
      default: return { name: 'Clock', color: 'text-text-secondary' };
    }
  };

  const getOverallStatus = () => {
    const completedTests = tests.filter(t => t.status !== 'pending');
    const passedTests = tests.filter(t => t.status === 'passed');
    
    if (completedTests.length === 0) return 'Not Started';
    if (completedTests.length < tests.length) return 'In Progress';
    if (passedTests.length === tests.length) return 'All Tests Passed';
    return 'Some Tests Failed';
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Integration Testing</h2>
        <p className="text-text-secondary">
          Test your payment setup before going live
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-text-primary">Test Suite</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  getOverallStatus() === 'All Tests Passed' ? 'bg-success' :
                  getOverallStatus() === 'Some Tests Failed' ? 'bg-destructive' :
                  getOverallStatus() === 'In Progress' ? 'bg-warning' : 'bg-text-secondary'
                }`}></div>
                <span className="text-sm text-text-secondary">{getOverallStatus()}</span>
              </div>
            </div>

            <div className="space-y-3">
              {tests.map((test) => {
                const statusIcon = getStatusIcon(test.status);
                return (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={statusIcon.name} size={20} className={statusIcon.color} />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{test.name}</p>
                        <p className="text-xs text-text-secondary">{test.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runSingleTest(test.id)}
                      disabled={isRunningTests}
                      iconName="Play"
                    >
                      Run
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="default"
                onClick={runAllTests}
                disabled={isRunningTests}
                loading={isRunningTests}
                iconName="PlayCircle"
                iconPosition="left"
                fullWidth
              >
                {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </div>
          </div>

          {/* Test Payment */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Send Test Payment</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  placeholder="0.01"
                  value={testPayment.amount}
                  onChange={(e) => setTestPayment(prev => ({ ...prev, amount: e.target.value }))}
                />

                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={testPayment.currency}
                  onChange={(value) => setTestPayment(prev => ({ ...prev, currency: value }))}
                />
              </div>

              <Input
                label="Description"
                type="text"
                placeholder="Test payment description"
                value={testPayment.description}
                onChange={(e) => setTestPayment(prev => ({ ...prev, description: e.target.value }))}
              />

              <Button
                variant="outline"
                onClick={sendTestPayment}
                disabled={isRunningTests || !testPayment.amount}
                loading={isRunningTests}
                iconName="Send"
                iconPosition="left"
                fullWidth
              >
                Send Test Payment
              </Button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Test Results</h3>
            
            {testResults.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="TestTube" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-text-secondary">No tests run yet</p>
                <p className="text-sm text-text-secondary mt-1">
                  Run tests to see detailed results here
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {testResults.map((result) => {
                  const statusIcon = getStatusIcon(result.status);
                  return (
                    <div key={result.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon name={statusIcon.name} size={16} className={statusIcon.color} />
                          <span className="text-sm font-medium text-text-primary">
                            {tests.find(t => t.id === result.id)?.name || 'Test Payment'}
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary">
                          {result.duration}ms
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-text-secondary">
                          {result.timestamp.toLocaleTimeString()}
                        </div>
                        
                        {result.details.checks && (
                          <div>
                            <p className="text-xs font-medium text-text-primary mb-1">Checks:</p>
                            <ul className="text-xs text-text-secondary space-y-1">
                              {result.details.checks.map((check, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <Icon name="Check" size={12} className="text-success" />
                                  <span>{check}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.details.metrics && Object.keys(result.details.metrics).length > 0 && (
                          <div className="bg-muted rounded p-2">
                            <p className="text-xs font-medium text-text-primary mb-1">Metrics:</p>
                            <div className="text-xs text-text-secondary space-y-1">
                              {Object.entries(result.details.metrics).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                  <span className="font-mono">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Integration Status */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Integration Status</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Wallet Connection</span>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success">Connected</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Base Pay Integration</span>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Payment Buttons</span>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success">Configured</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Notifications</span>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm text-success">Enabled</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Shield" size={20} className="text-success" />
                  <div>
                    <p className="text-sm font-medium text-success">Ready for Production</p>
                    <p className="text-xs text-success/80 mt-1">
                      Your payment setup is configured and tested successfully
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Settings
        </Button>
        <Button
          variant="success"
          onClick={onComplete}
          iconName="CheckCircle"
          iconPosition="right"
          disabled={getOverallStatus() !== 'All Tests Passed'}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};

export default IntegrationTesting;