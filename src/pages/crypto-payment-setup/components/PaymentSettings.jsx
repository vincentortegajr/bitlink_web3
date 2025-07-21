import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PaymentSettings = ({ onNext, onPrevious, isActive }) => {
  const [generalSettings, setGeneralSettings] = useState({
    showUsdConversion: true,
    minimumPaymentThreshold: '0.001',
    maximumPaymentLimit: '10',
    autoConfirmPayments: true,
    requirePaymentMemo: false
  });

  const [feeSettings, setFeeSettings] = useState({
    platformFee: '2.5',
    gasFeeHandling: 'absorb',
    customFeeStructure: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    enablePaymentLimits: true,
    requireEmailVerification: false,
    enableFraudDetection: true,
    blockSuspiciousTransactions: true
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    basePay: {
      enabled: true,
      merchantId: 'merchant_' + Math.random().toString(36).substring(2, 10),
      apiKey: 'bp_' + Math.random().toString(36).substring(2, 20)
    },
    customDomain: {
      enabled: false,
      domain: '',
      sslEnabled: true
    }
  });

  const gasFeeOptions = [
    { value: 'absorb', label: 'Platform Absorbs Gas Fees' },
    { value: 'pass', label: 'Pass to Customer' },
    { value: 'split', label: 'Split 50/50' }
  ];

  const handleGeneralSettingChange = (key, value) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFeeSettingChange = (key, value) => {
    setFeeSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSecuritySettingChange = (key, value) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  const regenerateApiKey = () => {
    setIntegrationSettings(prev => ({
      ...prev,
      basePay: {
        ...prev.basePay,
        apiKey: 'bp_' + Math.random().toString(36).substring(2, 20)
      }
    }));
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Payment Settings</h2>
        <p className="text-text-secondary">
          Configure payment processing, fees, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Settings" size={24} className="text-primary" />
              <h3 className="text-lg font-medium text-text-primary">General Settings</h3>
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Show USD Conversion"
                description="Display USD equivalent for crypto amounts"
                checked={generalSettings.showUsdConversion}
                onChange={(e) => handleGeneralSettingChange('showUsdConversion', e.target.checked)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Payment"
                  type="number"
                  placeholder="0.001"
                  value={generalSettings.minimumPaymentThreshold}
                  onChange={(e) => handleGeneralSettingChange('minimumPaymentThreshold', e.target.value)}
                  description="ETH"
                />

                <Input
                  label="Maximum Payment"
                  type="number"
                  placeholder="10"
                  value={generalSettings.maximumPaymentLimit}
                  onChange={(e) => handleGeneralSettingChange('maximumPaymentLimit', e.target.value)}
                  description="ETH"
                />
              </div>

              <Checkbox
                label="Auto-confirm Payments"
                description="Automatically confirm payments after blockchain confirmation"
                checked={generalSettings.autoConfirmPayments}
                onChange={(e) => handleGeneralSettingChange('autoConfirmPayments', e.target.checked)}
              />

              <Checkbox
                label="Require Payment Memo"
                description="Require customers to add a memo with payments"
                checked={generalSettings.requirePaymentMemo}
                onChange={(e) => handleGeneralSettingChange('requirePaymentMemo', e.target.checked)}
              />
            </div>
          </div>

          {/* Fee Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="DollarSign" size={24} className="text-success" />
              <h3 className="text-lg font-medium text-text-primary">Fee Structure</h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Platform Fee"
                type="number"
                placeholder="2.5"
                value={feeSettings.platformFee}
                onChange={(e) => handleFeeSettingChange('platformFee', e.target.value)}
                description="Percentage fee per transaction"
              />

              <Select
                label="Gas Fee Handling"
                options={gasFeeOptions}
                value={feeSettings.gasFeeHandling}
                onChange={(value) => handleFeeSettingChange('gasFeeHandling', value)}
                description="How to handle blockchain gas fees"
              />

              <Checkbox
                label="Custom Fee Structure"
                description="Enable custom fee tiers based on payment amount"
                checked={feeSettings.customFeeStructure}
                onChange={(e) => handleFeeSettingChange('customFeeStructure', e.target.checked)}
              />

              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Calculator" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Fee Calculator</p>
                    <p className="text-xs text-text-secondary mt-1">
                      For a 1 ETH payment: Platform fee {feeSettings.platformFee}% = {(1 * parseFloat(feeSettings.platformFee || 0) / 100).toFixed(4)} ETH
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Integration */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Shield" size={24} className="text-warning" />
              <h3 className="text-lg font-medium text-text-primary">Security Settings</h3>
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Enable Payment Limits"
                description="Enforce minimum and maximum payment amounts"
                checked={securitySettings.enablePaymentLimits}
                onChange={(e) => handleSecuritySettingChange('enablePaymentLimits', e.target.checked)}
              />

              <Checkbox
                label="Require Email Verification"
                description="Require email verification for large payments"
                checked={securitySettings.requireEmailVerification}
                onChange={(e) => handleSecuritySettingChange('requireEmailVerification', e.target.checked)}
              />

              <Checkbox
                label="Enable Fraud Detection"
                description="Use AI-powered fraud detection"
                checked={securitySettings.enableFraudDetection}
                onChange={(e) => handleSecuritySettingChange('enableFraudDetection', e.target.checked)}
              />

              <Checkbox
                label="Block Suspicious Transactions"
                description="Automatically block potentially fraudulent payments"
                checked={securitySettings.blockSuspiciousTransactions}
                onChange={(e) => handleSecuritySettingChange('blockSuspiciousTransactions', e.target.checked)}
              />

              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="CheckCircle" size={20} className="text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-success">Security Score: 95%</p>
                    <p className="text-xs text-success/80 mt-1">
                      Your payment setup has excellent security measures
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Base Pay Integration */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Zap" size={24} className="text-accent" />
              <h3 className="text-lg font-medium text-text-primary">Base Pay Integration</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-accent" />
                  <p className="text-sm font-medium text-accent">Base Pay Enabled</p>
                </div>
                <p className="text-xs text-accent/80">
                  Contract-free crypto payments with instant settlement
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-text-primary">Merchant ID</label>
                  <div className="bg-muted rounded-lg p-3 mt-1">
                    <p className="text-sm font-mono text-text-primary">{integrationSettings.basePay.merchantId}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-primary">API Key</label>
                  <div className="flex space-x-2 mt-1">
                    <div className="bg-muted rounded-lg p-3 flex-1">
                      <p className="text-sm font-mono text-text-primary">
                        {integrationSettings.basePay.apiKey.substring(0, 8)}...
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={regenerateApiKey}
                      iconName="RefreshCw"
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">Custom Domain</p>
                    <p className="text-xs text-text-secondary">Use your own domain for payments</p>
                  </div>
                  <Checkbox
                    checked={integrationSettings.customDomain.enabled}
                    onChange={(e) => setIntegrationSettings(prev => ({
                      ...prev,
                      customDomain: { ...prev.customDomain, enabled: e.target.checked }
                    }))}
                  />
                </div>

                {integrationSettings.customDomain.enabled && (
                  <div className="mt-3">
                    <Input
                      type="text"
                      placeholder="pay.yourdomain.com"
                      value={integrationSettings.customDomain.domain}
                      onChange={(e) => setIntegrationSettings(prev => ({
                        ...prev,
                        customDomain: { ...prev.customDomain, domain: e.target.value }
                      }))}
                    />
                  </div>
                )}
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
          Back to Notifications
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Testing
        </Button>
      </div>
    </div>
  );
};

export default PaymentSettings;