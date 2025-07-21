import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';

// Import all components
import MetricCard from './components/MetricCard';
import PerformanceChart from './components/PerformanceChart';
import PaymentAnalytics from './components/PaymentAnalytics';
import LeadMetrics from './components/LeadMetrics';
import SocialLinkPerformance from './components/SocialLinkPerformance';
import ABTestingResults from './components/ABTestingResults';
import GoalTracking from './components/GoalTracking';
import ExportReports from './components/ExportReports';

const AnalyticsPerformanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Mock data for overview metrics
  const overviewMetrics = [
    {
      title: 'Profile Views',
      value: '8,234',
      change: 12.5,
      changeType: 'positive',
      icon: 'Eye',
      color: 'primary'
    },
    {
      title: 'Link Clicks',
      value: '3,456',
      change: 8.3,
      changeType: 'positive',
      icon: 'MousePointer',
      color: 'accent'
    },
    {
      title: 'Payments Received',
      value: '$3,750',
      change: -2.1,
      changeType: 'negative',
      icon: 'CreditCard',
      color: 'success'
    },
    {
      title: 'Leads Generated',
      value: '147',
      change: 15.7,
      changeType: 'positive',
      icon: 'Users',
      color: 'warning'
    }
  ];

  // Mock data for performance charts
  const profileViewsData = [
    { date: 'Jan 15', value: 1200 },
    { date: 'Jan 16', value: 1350 },
    { date: 'Jan 17', value: 1180 },
    { date: 'Jan 18', value: 1420 },
    { date: 'Jan 19', value: 1380 },
    { date: 'Jan 20', value: 1650 },
    { date: 'Jan 21', value: 1580 }
  ];

  const revenueData = [
    { date: 'Jan 15', value: 450 },
    { date: 'Jan 16', value: 520 },
    { date: 'Jan 17', value: 380 },
    { date: 'Jan 18', value: 680 },
    { date: 'Jan 19', value: 590 },
    { date: 'Jan 20', value: 750 },
    { date: 'Jan 21', value: 620 }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'payments', label: 'Payments', icon: 'CreditCard' },
    { id: 'leads', label: 'Leads', icon: 'Users' },
    { id: 'social', label: 'Social Links', icon: 'Share2' },
    { id: 'testing', label: 'A/B Testing', icon: 'TestTube' },
    { id: 'goals', label: 'Goals', icon: 'Target' },
    { id: 'reports', label: 'Reports', icon: 'FileText' }
  ];

  const timeRanges = [
    { value: '24h', label: '24H' },
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' }
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      // In a real app, this would fetch new data
      console.log('Real-time update triggered');
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  const breadcrumbs = [
    { label: 'Analytics', path: '/analytics-performance-dashboard', current: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionToolbar />
      
      <div className="px-4 lg:px-6 py-6 pb-20 md:pb-6">
        <NavigationBreadcrumbs customBreadcrumbs={breadcrumbs} />
        
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Analytics & Performance</h1>
            <p className="text-text-secondary">
              Comprehensive insights into your profile performance and engagement metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* Real-time Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-smooth ${
                  isRealTimeEnabled 
                    ? 'bg-success/10 text-success border border-success/20' :'bg-muted text-text-secondary border border-border'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  isRealTimeEnabled ? 'bg-success animate-pulse' : 'bg-text-secondary'
                }`}></div>
                <span>Real-time</span>
              </button>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={timeRange === range.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range.value)}
                  className="text-xs"
                >
                  {range.label}
                </Button>
              ))}
            </div>

            {/* Notification Center */}
            <NotificationCenter />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-border">
            <div className="flex space-x-1 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-smooth whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewMetrics.map((metric, index) => (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    changeType={metric.changeType}
                    icon={metric.icon}
                    color={metric.color}
                  />
                ))}
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceChart
                  title="Profile Views Trend"
                  data={profileViewsData}
                  type="line"
                  color="#2563EB"
                />
                <PerformanceChart
                  title="Revenue Trend"
                  data={revenueData}
                  type="bar"
                  color="#10B981"
                />
              </div>

              {/* Quick Insights */}
              <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-4 bg-primary/10 text-primary rounded-lg mb-3 w-fit mx-auto">
                      <Icon name="TrendingUp" size={24} />
                    </div>
                    <h4 className="font-medium text-text-primary mb-1">Peak Performance</h4>
                    <p className="text-sm text-text-secondary">
                      Your profile performed best on weekends with 23% higher engagement
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-success/10 text-success rounded-lg mb-3 w-fit mx-auto">
                      <Icon name="Target" size={24} />
                    </div>
                    <h4 className="font-medium text-text-primary mb-1">Goal Progress</h4>
                    <p className="text-sm text-text-secondary">
                      You're 75% towards your monthly revenue goal of $5,000
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-4 bg-warning/10 text-warning rounded-lg mb-3 w-fit mx-auto">
                      <Icon name="Lightbulb" size={24} />
                    </div>
                    <h4 className="font-medium text-text-primary mb-1">Optimization Tip</h4>
                    <p className="text-sm text-text-secondary">
                      Adding video content could increase engagement by up to 40%
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && <PaymentAnalytics />}

          {/* Leads Tab */}
          {activeTab === 'leads' && <LeadMetrics />}

          {/* Social Links Tab */}
          {activeTab === 'social' && <SocialLinkPerformance />}

          {/* A/B Testing Tab */}
          {activeTab === 'testing' && <ABTestingResults />}

          {/* Goals Tab */}
          {activeTab === 'goals' && <GoalTracking />}

          {/* Reports Tab */}
          {activeTab === 'reports' && <ExportReports />}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPerformanceDashboard;