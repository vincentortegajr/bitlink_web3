import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentButtonCreator = ({ onNext, onPrevious, isActive }) => {
  const [paymentButtons, setPaymentButtons] = useState([
    {
      id: '1',
      title: 'Buy Me a Coffee',
      description: 'Support my content creation',
      amount: '0.01',
      currency: 'ETH',
      buttonText: 'Send Tip',
      buttonColor: 'primary'
    }
  ]);
  const [selectedButton, setSelectedButton] = useState('1');
  const [isEditing, setIsEditing] = useState(false);

  const currencyOptions = [
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'USDC', label: 'USD Coin (USDC)' },
    { value: 'BASE', label: 'Base Token (BASE)' }
  ];

  const buttonColorOptions = [
    { value: 'primary', label: 'Blue' },
    { value: 'success', label: 'Green' },
    { value: 'warning', label: 'Orange' },
    { value: 'secondary', label: 'Gray' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'ETH',
    buttonText: 'Pay Now',
    buttonColor: 'primary'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddButton = () => {
    if (!formData.title || !formData.amount) return;

    const newButton = {
      id: Date.now().toString(),
      ...formData
    };

    setPaymentButtons(prev => [...prev, newButton]);
    setSelectedButton(newButton.id);
    setFormData({
      title: '',
      description: '',
      amount: '',
      currency: 'ETH',
      buttonText: 'Pay Now',
      buttonColor: 'primary'
    });
    setIsEditing(false);
  };

  const handleEditButton = (button) => {
    setFormData(button);
    setSelectedButton(button.id);
    setIsEditing(true);
  };

  const handleUpdateButton = () => {
    setPaymentButtons(prev =>
      prev.map(button =>
        button.id === selectedButton ? { ...button, ...formData } : button
      )
    );
    setIsEditing(false);
    setFormData({
      title: '',
      description: '',
      amount: '',
      currency: 'ETH',
      buttonText: 'Pay Now',
      buttonColor: 'primary'
    });
  };

  const handleDeleteButton = (id) => {
    setPaymentButtons(prev => prev.filter(button => button.id !== id));
    if (selectedButton === id) {
      setSelectedButton(paymentButtons[0]?.id || '');
    }
  };

  const getButtonVariant = (color) => {
    const variantMap = {
      primary: 'default',
      success: 'success',
      warning: 'warning',
      secondary: 'secondary'
    };
    return variantMap[color] || 'default';
  };

  const selectedButtonData = paymentButtons.find(b => b.id === selectedButton);

  if (!isActive) return null;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Create Payment Buttons</h2>
        <p className="text-text-secondary">
          Design custom payment buttons for your profile page
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Button Creator Form */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">
              {isEditing ? 'Edit Payment Button' : 'Create New Button'}
            </h3>

            <div className="space-y-4">
              <Input
                label="Button Title"
                type="text"
                placeholder="e.g., Buy Me a Coffee"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />

              <Input
                label="Description"
                type="text"
                placeholder="Brief description of the payment"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  placeholder="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />

                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={formData.currency}
                  onChange={(value) => handleInputChange('currency', value)}
                />
              </div>

              <Input
                label="Button Text"
                type="text"
                placeholder="Pay Now"
                value={formData.buttonText}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
              />

              <Select
                label="Button Color"
                options={buttonColorOptions}
                value={formData.buttonColor}
                onChange={(value) => handleInputChange('buttonColor', value)}
              />

              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="default"
                      onClick={handleUpdateButton}
                      iconName="Save"
                      iconPosition="left"
                      fullWidth
                    >
                      Update Button
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          title: '',
                          description: '',
                          amount: '',
                          currency: 'ETH',
                          buttonText: 'Pay Now',
                          buttonColor: 'primary'
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleAddButton}
                    iconName="Plus"
                    iconPosition="left"
                    fullWidth
                    disabled={!formData.title || !formData.amount}
                  >
                    Add Payment Button
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Existing Buttons List */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Your Payment Buttons</h3>
            
            {paymentButtons.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="CreditCard" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-text-secondary">No payment buttons created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentButtons.map((button) => (
                  <div
                    key={button.id}
                    className={`p-4 border rounded-lg transition-smooth cursor-pointer ${
                      selectedButton === button.id
                        ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedButton(button.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary">{button.title}</h4>
                        <p className="text-sm text-text-secondary">{button.description}</p>
                        <p className="text-sm font-mono text-primary mt-1">
                          {button.amount} {button.currency}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditButton(button);
                          }}
                          iconName="Edit"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteButton(button.id);
                          }}
                          iconName="Trash2"
                          className="text-destructive hover:text-destructive"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-medium text-text-primary mb-4">Live Preview</h3>
            
            {selectedButtonData ? (
              <div className="space-y-4">
                {/* Desktop Preview */}
                <div className="hidden sm:block">
                  <p className="text-sm text-text-secondary mb-3">Desktop View</p>
                  <div className="bg-background border border-border rounded-lg p-6">
                    <div className="text-center space-y-3">
                      <h4 className="text-xl font-semibold text-text-primary">
                        {selectedButtonData.title}
                      </h4>
                      {selectedButtonData.description && (
                        <p className="text-text-secondary">{selectedButtonData.description}</p>
                      )}
                      <div className="text-2xl font-bold text-primary font-mono">
                        {selectedButtonData.amount} {selectedButtonData.currency}
                      </div>
                      <Button
                        variant={getButtonVariant(selectedButtonData.buttonColor)}
                        size="lg"
                        iconName="CreditCard"
                        iconPosition="left"
                        fullWidth
                      >
                        {selectedButtonData.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                <div>
                  <p className="text-sm text-text-secondary mb-3">Mobile View</p>
                  <div className="max-w-xs mx-auto bg-background border border-border rounded-lg p-4">
                    <div className="text-center space-y-3">
                      <h4 className="text-lg font-semibold text-text-primary">
                        {selectedButtonData.title}
                      </h4>
                      {selectedButtonData.description && (
                        <p className="text-sm text-text-secondary">{selectedButtonData.description}</p>
                      )}
                      <div className="text-xl font-bold text-primary font-mono">
                        {selectedButtonData.amount} {selectedButtonData.currency}
                      </div>
                      <Button
                        variant={getButtonVariant(selectedButtonData.buttonColor)}
                        size="default"
                        iconName="CreditCard"
                        iconPosition="left"
                        fullWidth
                      >
                        {selectedButtonData.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Eye" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-text-secondary">Create a payment button to see preview</p>
              </div>
            )}
          </div>

          {/* Payment Link Generator */}
          {selectedButtonData && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Payment Link</h3>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-text-secondary mb-1">Shareable Payment URL</p>
                  <p className="text-sm font-mono text-text-primary break-all">
                    https://bitlink.app/pay/{selectedButtonData.id}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Copy"
                    iconPosition="left"
                    fullWidth
                  >
                    Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="QrCode"
                    iconPosition="left"
                    fullWidth
                  >
                    QR Code
                  </Button>
                </div>
              </div>
            </div>
          )}
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
          Back to Wallet
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          iconName="ArrowRight"
          iconPosition="right"
          disabled={paymentButtons.length === 0}
        >
          Continue to Notifications
        </Button>
      </div>
    </div>
  );
};

export default PaymentButtonCreator;