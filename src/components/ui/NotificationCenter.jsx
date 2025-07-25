import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate loading notifications
    const mockNotifications = [
      {
        id: '1',
        type: 'payment',
        title: 'Payment Received',
        message: 'You received 0.05 ETH from user @cryptofan',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        icon: 'CreditCard',
        color: 'success'
      },
      {
        id: '2',
        type: 'lead',
        title: 'New Subscriber',
        message: 'Sarah Johnson subscribed to your newsletter',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        icon: 'UserPlus',
        color: 'accent'
      },
      {
        id: '3',
        type: 'system',
        title: 'Profile Updated',
        message: 'Your profile changes have been saved successfully',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
        icon: 'CheckCircle',
        color: 'primary'
      },
      {
        id: '4',
        type: 'payment',
        title: 'Transaction Confirmed',
        message: 'Payment of 0.1 ETH has been confirmed on Base network',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        icon: 'Shield',
        color: 'success'
      },
      {
        id: '5',
        type: 'lead',
        title: 'Form Submission',
        message: 'New contact form submission from your profile page',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        icon: 'Mail',
        color: 'accent'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      success: 'text-success bg-success/10 border-success/20',
      accent: 'text-accent bg-accent/10 border-accent/20',
      primary: 'text-primary bg-primary/10 border-primary/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      error: 'text-error bg-error/10 border-error/20'
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-muted rounded-md transition-smooth"
      >
        <Icon name="Bell" size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Desktop Notification Panel */}
      {isOpen && (
        <div className="hidden sm:block absolute right-0 top-full mt-2 w-96 bg-surface border border-border rounded-lg shadow-prominent z-50 animate-scale-in">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-text-secondary">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 transition-smooth ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-md border ${getColorClasses(notification.color)}`}>
                        <Icon name={notification.icon} size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text-primary">
                              {notification.title}
                            </p>
                            <p className="text-sm text-text-secondary mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-text-secondary mt-2">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-muted rounded-md transition-smooth"
                                title="Mark as read"
                              >
                                <Icon name="Check" size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="p-1 hover:bg-muted rounded-md transition-smooth text-text-secondary hover:text-destructive"
                              title="Remove"
                            >
                              <Icon name="X" size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Notification Panel */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-surface rounded-t-lg max-h-[80vh] flex flex-col animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="mt-2 text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-text-secondary">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${!notification.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-md border ${getColorClasses(notification.color)}`}>
                          <Icon name={notification.icon} size={16} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-text-primary">
                                {notification.title}
                              </p>
                              <p className="text-sm text-text-secondary mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-text-secondary mt-2">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                            
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="p-2 hover:bg-muted rounded-md transition-smooth text-text-secondary hover:text-destructive ml-2"
                            >
                              <Icon name="X" size={16} />
                            </button>
                          </div>
                          
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="mt-2 text-xs text-primary hover:text-primary/80 transition-smooth"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
