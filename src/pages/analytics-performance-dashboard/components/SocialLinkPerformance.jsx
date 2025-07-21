import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SocialLinkPerformance = () => {
  const [selectedMetric, setSelectedMetric] = useState('clicks');

  const linkPerformanceData = [
    {
      id: '1',
      title: 'Twitter Profile',
      url: 'twitter.com/cryptodev',
      clicks: 1245,
      ctr: 8.5,
      conversions: 23,
      icon: 'Twitter',
      color: '#1DA1F2'
    },
    {
      id: '2',
      title: 'GitHub Repository',
      url: 'github.com/web3-projects',
      clicks: 890,
      ctr: 12.3,
      conversions: 45,
      icon: 'Github',
      color: '#333'
    },
    {
      id: '3',
      title: 'LinkedIn Profile',
      url: 'linkedin.com/in/blockchain-dev',
      clicks: 567,
      ctr: 6.8,
      conversions: 18,
      icon: 'Linkedin',
      color: '#0077B5'
    },
    {
      id: '4',
      title: 'Personal Website',
      url: 'mywebsite.com',
      clicks: 432,
      ctr: 15.2,
      conversions: 34,
      icon: 'Globe',
      color: '#10B981'
    },
    {
      id: '5',
      title: 'YouTube Channel',
      url: 'youtube.com/cryptotutorials',
      clicks: 321,
      ctr: 9.7,
      conversions: 12,
      icon: 'Youtube',
      color: '#FF0000'
    }
  ];

  const chartData = linkPerformanceData.map(link => ({
    name: link.title.split(' ')[0],
    clicks: link.clicks,
    ctr: link.ctr,
    conversions: link.conversions
  }));

  const geographicData = [
    { country: 'United States', clicks: 1234, percentage: 35.2 },
    { country: 'United Kingdom', clicks: 567, percentage: 16.1 },
    { country: 'Germany', clicks: 432, percentage: 12.3 },
    { country: 'Canada', clicks: 321, percentage: 9.1 },
    { country: 'Australia', clicks: 234, percentage: 6.7 },
    { country: 'Others', clicks: 723, percentage: 20.6 }
  ];

  const deviceData = [
    { device: 'Mobile', clicks: 2145, percentage: 61.2 },
    { device: 'Desktop', clicks: 1023, percentage: 29.2 },
    { device: 'Tablet', clicks: 337, percentage: 9.6 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-prominent">
          <p className="text-sm font-medium text-text-primary mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'ctr' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Chart */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Link Performance</h3>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedMetric === 'clicks' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric('clicks')}
            >
              Clicks
            </Button>
            <Button
              variant={selectedMetric === 'ctr' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric('ctr')}
            >
              CTR
            </Button>
            <Button
              variant={selectedMetric === 'conversions' ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric('conversions')}
            >
              Conversions
            </Button>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={selectedMetric} 
                fill="var(--color-primary)" 
                radius={[4, 4, 0, 0]}
                name={selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Link Performance */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Link Details</h3>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export Data
          </Button>
        </div>

        <div className="space-y-4">
          {linkPerformanceData.map((link, index) => (
            <div key={link.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-md border" style={{ backgroundColor: `${link.color}20`, borderColor: `${link.color}40` }}>
                  <Icon name={link.icon} size={20} style={{ color: link.color }} />
                </div>
                
                <div>
                  <p className="font-medium text-text-primary">{link.title}</p>
                  <p className="text-sm text-text-secondary">{link.url}</p>
                </div>
              </div>

              <div className="flex items-center space-x-8 text-sm">
                <div className="text-center">
                  <p className="font-medium text-text-primary">{link.clicks.toLocaleString()}</p>
                  <p className="text-text-secondary">Clicks</p>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-text-primary">{link.ctr}%</p>
                  <p className="text-text-secondary">CTR</p>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-text-primary">{link.conversions}</p>
                  <p className="text-text-secondary">Conversions</p>
                </div>

                <Button variant="ghost" size="sm" iconName="ExternalLink">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic & Device Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Geographic Distribution</h3>
          
          <div className="space-y-4">
            {geographicData.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-4 bg-primary/20 rounded-sm flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{country.country}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${country.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-text-secondary w-12 text-right">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Device Distribution</h3>
          
          <div className="space-y-4">
            {deviceData.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 text-accent rounded-md border border-accent/20">
                    <Icon name={
                      device.device === 'Mobile' ? 'Smartphone' :
                      device.device === 'Desktop' ? 'Monitor' : 'Tablet'
                    } size={16} />
                  </div>
                  <span className="font-medium text-text-primary">{device.device}</span>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-text-primary">{device.clicks.toLocaleString()}</p>
                  <p className="text-sm text-text-secondary">{device.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinkPerformance;