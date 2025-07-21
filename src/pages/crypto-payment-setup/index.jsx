import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import step components
import StepProgress from './components/StepProgress';
import WalletConnectionStep from './components/WalletConnectionStep';
import PaymentButtonCreator from './components/PaymentButtonCreator';
import NotificationSettings from './components/NotificationSettings';
import PaymentSettings from './components/PaymentSettings';
import IntegrationTesting from './components/IntegrationTesting';
import TransactionHistory from './components/TransactionHistory';

const CryptoPaymentSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const steps = [
    {
      id: 'wallet',
      title: 'Wallet',
      description: 'Connect wallet',
      icon: 'Wallet'
    },
    {
      id: 'buttons',
      title: 'Buttons',
      description: 'Create payments',
      icon: 'CreditCard'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Setup alerts',
      icon: 'Bell'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure options',
      icon: 'Settings'
    },
    {
      id: 'testing',
      title: 'Testing',
      description: 'Verify setup',
      icon: 'TestTube'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsSetupComplete(true);
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setIsSetupComplete(false);
  };

  const breadcrumbs = [
    { label: 'Dashboard', path: '/', current: false },
    { label: 'Crypto Payment Setup', path: '/crypto-payment-setup', current: true }
  ];

  if (isSetupComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <QuickActionToolbar />
        
        <main className="container mx-auto px-4 lg:px-6 py-8">
          <NavigationBreadcrumbs customBreadcrumbs={breadcrumbs} />
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Payment Setup Complete!
              </h1>
              <p className="text-lg text-text-secondary">
                Your crypto payment system is now ready to accept payments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="Link" size={24} className="text-primary" />
                  <h3 className="text-lg font-medium text-text-primary">Payment Links</h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Your payment buttons are now live and ready to use
                </p>
                <Button
                  variant="outline"
                  iconName="ExternalLink"
                  iconPosition="right"
                  fullWidth
                >
                  View Profile Page
                </Button>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Icon name="BarChart3" size={24} className="text-accent" />
                  <h3 className="text-lg font-medium text-text-primary">Analytics</h3>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  Track your payment performance and earnings
                </p>
                <Button
                  variant="outline"
                  iconName="TrendingUp"
                  iconPosition="right"
                  fullWidth
                >
                  View Analytics
                </Button>
              </div>
            </div>

            <div className="mb-8">
              <TransactionHistory />
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <Icon name="Share" size={32} className="mx-auto text-primary mb-2" />
                  <h4 className="font-medium text-text-primary mb-1">Share Your Profile</h4>
                  <p className="text-xs text-text-secondary">
                    Start sharing your payment links with your audience
                  </p>
                </div>
                
                <div className="text-center p-4 border border-border rounded-lg">
                  <Icon name="Users" size={32} className="mx-auto text-accent mb-2" />
                  <h4 className="font-medium text-text-primary mb-1">Build Your Audience</h4>
                  <p className="text-xs text-text-secondary">
                    Use lead generation tools to grow your subscriber base
                  </p>
                </div>
                
                <div className="text-center p-4 border border-border rounded-lg">
                  <Icon name="Zap" size={32} className="mx-auto text-warning mb-2" />
                  <h4 className="font-medium text-text-primary mb-1">Optimize Performance</h4>
                  <p className="text-xs text-text-secondary">
                    Monitor analytics and optimize your payment strategy
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <Button
                variant="outline"
                onClick={handleStartOver}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Setup Another Payment
              </Button>
              <Button
                variant="default"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionToolbar />
      
      <main className="container mx-auto px-4 lg:px-6 py-8">
        <NavigationBreadcrumbs customBreadcrumbs={breadcrumbs} />
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Crypto Payment Setup
            </h1>
            <p className="text-lg text-text-secondary">
              Configure your Web3 payment system in just a few steps
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <StepProgress 
              currentStep={currentStep}
              totalSteps={steps.length}
              steps={steps}
            />
          </div>

          {/* Step Content */}
          <div className="bg-card border border-border rounded-lg p-6 lg:p-8 mb-8">
            <WalletConnectionStep
              onNext={handleNext}
              isActive={currentStep === 0}
            />
            
            <PaymentButtonCreator
              onNext={handleNext}
              onPrevious={handlePrevious}
              isActive={currentStep === 1}
            />
            
            <NotificationSettings
              onNext={handleNext}
              onPrevious={handlePrevious}
              isActive={currentStep === 2}
            />
            
            <PaymentSettings
              onNext={handleNext}
              onPrevious={handlePrevious}
              isActive={currentStep === 3}
            />
            
            <IntegrationTesting
              onPrevious={handlePrevious}
              onComplete={handleComplete}
              isActive={currentStep === 4}
            />
          </div>

          {/* Help Section */}
          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Icon name="HelpCircle" size={24} className="text-primary mt-1" />
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">Need Help?</h3>
                <p className="text-sm text-text-secondary mb-4">
                  Setting up crypto payments can be complex. Our support team is here to help you every step of the way.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Book"
                    iconPosition="left"
                  >
                    Documentation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MessageCircle"
                    iconPosition="left"
                  >
                    Live Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Mail"
                    iconPosition="left"
                  >
                    Email Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CryptoPaymentSetup;