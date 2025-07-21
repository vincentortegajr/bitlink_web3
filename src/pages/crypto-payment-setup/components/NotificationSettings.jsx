import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = ({ onNext, onPrevious, isActive }) => {
  const [emailNotifications, setEmailNotifications] = useState({
    paymentReceived: true,
    paymentFailed: true,
    dailySummary: false,
    weeklySummary: true
  });

  const [webhookSettings, setWebhookSettings] = useState({
    enabled: false,
    url: '',
    secret: '',
    events: {
      paymentSuccess: true,
      paymentFailed: true,
      paymentPending: false
    }
  });

  const [emailSettings, setEmailSettings] = useState({
    notificationEmail: 'user@example.com',
    customTemplate: false,
    includeTransactionDetails: true
  });

  const [testSettings, setTestSettings] = useState({
    testMode: true,
    testEmail: '',
    lastTestSent: null
  });

  const handleEmailNotificationChange = (key, checked) => {
    setEmailNotifications(prev => ({ ...prev, [key]: checked }));
  };

  const handleWebhookEventChange = (key, checked) => {
    setWebhookSettings(prev => ({
      ...prev,
      events: { ...prev.events, [key]: checked }
    }));
  };

  const handleTestNotification = () => {
    // Simulate sending test notification
    setTestSettings(prev => ({
      ...prev,
      lastTestSent: new Date()
    }));
  };

  const generateWebhookSecret = () => {
    const secret = 'wh_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setWebhookSettings(prev => ({ ...prev, secret }));
  };

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Notification Settings</h2>
        <p className="text-text-secondary">
          Configure how you want to be notified about payments and transactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Mail" size={24} className="text-primary" />
              <h3 className="text-lg font-medium text-text-primary">Email Notifications</h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Notification Email"
                type="email"
                placeholder="your@email.com"
                value={emailSettings.notificationEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, notificationEmail: e.target.value }))}
                description="Email address where notifications will be sent"
              />

              <div className="space-y-3">
                <p className="text-sm font-medium text-text-primary">Email Preferences</p>
                
                <Checkbox
                  label="Payment Received"
                  description="Get notified when you receive a payment"
                  checked={emailNotifications.paymentReceived}
                  onChange={(e) => handleEmailNotificationChange('paymentReceived', e.target.checked)}
                />

                <Checkbox
                  label="Payment Failed"
                  description="Get notified when a payment fails"
                  checked={emailNotifications.paymentFailed}
                  onChange={(e) => handleEmailNotificationChange('paymentFailed', e.target.checked)}
                />

                <Checkbox
                  label="Daily Summary"
                  description="Daily report of all transactions"
                  checked={emailNotifications.dailySummary}
                  onChange={(e) => handleEmailNotificationChange('dailySummary', e.target.checked)}
                />

                <Checkbox
                  label="Weekly Summary"
                  description="Weekly report with analytics"
                  checked={emailNotifications.weeklySummary}
                  onChange={(e) => handleEmailNotificationChange('weeklySummary', e.target.checked)}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <Checkbox
                  label="Include Transaction Details"
                  description="Include full transaction data in emails"
                  checked={emailSettings.includeTransactionDetails}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, includeTransactionDetails: e.target.checked }))}
                />
              </div>
            </div>
          </div>

          {/* Test Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="TestTube" size={24} className="text-warning" />
              <h3 className="text-lg font-medium text-text-primary">Test Notifications</h3>
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Test Mode"
                description="Enable test mode for safe testing"
                checked={testSettings.testMode}
                onChange={(e) => setTestSettings(prev => ({ ...prev, testMode: e.target.checked }))}
              />

              <Input
                label="Test Email"
                type="email"
                placeholder="test@email.com"
                value={testSettings.testEmail}
                onChange={(e) => setTestSettings(prev => ({ ...prev, testEmail: e.target.value }))}
                description="Send test notifications to this email"
              />

              <Button
                variant="outline"
                onClick={handleTestNotification}
                iconName="Send"
                iconPosition="left"
                fullWidth
                disabled={!testSettings.testEmail}
              >
                Send Test Notification
              </Button>

              {testSettings.lastTestSent && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <p className="text-sm text-success">
                      Test sent at {testSettings.lastTestSent.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Webhook Settings */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Webhook" size={24} className="text-accent" />
              <h3 className="text-lg font-medium text-text-primary">Webhook Integration</h3>
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Enable Webhooks"
                description="Send HTTP notifications to your server"
                checked={webhookSettings.enabled}
                onChange={(e) => setWebhookSettings(prev => ({ ...prev, enabled: e.target.checked }))}
              />

              {webhookSettings.enabled && (
                <>
                  <Input
                    label="Webhook URL"
                    type="url"
                    placeholder="https://your-server.com/webhook"
                    value={webhookSettings.url}
                    onChange={(e) => setWebhookSettings(prev => ({ ...prev, url: e.target.value }))}
                    description="Your server endpoint for receiving webhooks"
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary">Webhook Secret</label>
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Webhook secret for verification"
                        value={webhookSettings.secret}
                        onChange={(e) => setWebhookSettings(prev => ({ ...prev, secret: e.target.value }))}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={generateWebhookSecret}
                        iconName="RefreshCw"
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-xs text-text-secondary">
                      Used to verify webhook authenticity
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-text-primary">Webhook Events</p>
                    
                    <Checkbox
                      label="Payment Success"
                      description="Notify when payment is successful"
                      checked={webhookSettings.events.paymentSuccess}
                      onChange={(e) => handleWebhookEventChange('paymentSuccess', e.target.checked)}
                    />

                    <Checkbox
                      label="Payment Failed"
                      description="Notify when payment fails"
                      checked={webhookSettings.events.paymentFailed}
                      onChange={(e) => handleWebhookEventChange('paymentFailed', e.target.checked)}
                    />

                    <Checkbox
                      label="Payment Pending"
                      description="Notify when payment is pending"
                      checked={webhookSettings.events.paymentPending}
                      onChange={(e) => handleWebhookEventChange('paymentPending', e.target.checked)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Settings" size={24} className="text-secondary" />
              <h3 className="text-lg font-medium text-text-primary">Advanced Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Notification Delivery</p>
                    <ul className="text-xs text-text-secondary mt-1 space-y-1">
                      <li>• Email notifications are sent within 30 seconds</li>
                      <li>• Webhooks have 3 retry attempts with exponential backoff</li>
                      <li>• Failed notifications are logged for 30 days</li>
                      <li>• Rate limit: 1000 notifications per hour</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warning">Security Notice</p>
                    <p className="text-xs text-warning/80 mt-1">
                      Always verify webhook signatures and use HTTPS endpoints for production
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
          Back to Payment Buttons
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Settings
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;