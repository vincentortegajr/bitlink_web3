import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Funnel } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LeadMetrics = () => {
  const [selectedView, setSelectedView] = useState('conversion');

  const conversionData = [
    { stage: 'Profile Views', value: 2450, percentage: 100 },
    { stage: 'Link Clicks', value: 1225, percentage: 50 },
    { stage: 'Form Views', value: 490, percentage: 20 },
    { stage: 'Email Signups', value: 147, percentage: 6 },
    { stage: 'Conversions', value: 29, percentage: 1.2 }
  ];

  const trafficSources = [
    { source: 'Direct', visitors: 1250, leads: 45, rate: 3.6 },
    { source: 'Social Media', visitors: 890, leads: 67, rate: 7.5 },
    { source: 'Search', visitors: 670, leads: 23, rate: 3.4 },
    { source: 'Referral', visitors: 340, leads: 18, rate: 5.3 },
    { source: 'Email', visitors: 180, leads: 12, rate: 6.7 }
  ];

  const leadGrowthData = [
    { date: 'Jan 15', leads: 12 },
    { date: 'Jan 16', leads: 18 },
    { date: 'Jan 17', leads: 25 },
    { date: 'Jan 18', leads: 31 },
    { date: 'Jan 19', leads: 28 },
    { date: 'Jan 20', leads: 42 },
    { date: 'Jan 21', leads: 38 }
  ];

  const topPerformingContent = [
    {
      id: '1',
      title: 'Web3 Development Guide',
      type: 'Ebook',
      downloads: 234,
      leads: 89,
      conversionRate: 38.0
    },
    {
      id: '2',
      title: 'Crypto Trading Newsletter',
      type: 'Newsletter',
      downloads: 456,
      leads: 156,
      conversionRate: 34.2
    },
    {
      id: '3',
      title: 'DeFi Investment Course',
      type: 'Course',
      downloads: 123,
      leads: 67,
      conversionRate: 54.5
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-prominent">
          <p className="text-sm font-medium text-text-primary mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center space-x-2 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={selectedView === 'conversion' ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedView('conversion')}
        >
          Conversion Funnel
        </Button>
        <Button
          variant={selectedView === 'sources' ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedView('sources')}
        >
          Traffic Sources
        </Button>
        <Button
          variant={selectedView === 'growth' ? "default" : "ghost"}
          size="sm"
          onClick={() => setSelectedView('growth')}
        >
          Lead Growth
        </Button>
      </div>

      {/* Conversion Funnel */}
      {selectedView === 'conversion' && (
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Conversion Funnel</h3>
          
          <div className="space-y-4">
            {conversionData.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{stage.stage}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-text-secondary">{stage.percentage}%</span>
                    <span className="text-sm font-medium text-text-primary">{stage.value.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
                
                {index < conversionData.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Traffic Sources */}
      {selectedView === 'sources' && (
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Traffic Sources</h3>
          
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-md border border-primary/20">
                    <Icon name={
                      source.source === 'Direct' ? 'Globe' :
                      source.source === 'Social Media' ? 'Share2' :
                      source.source === 'Search' ? 'Search' :
                      source.source === 'Referral' ? 'ExternalLink' : 'Mail'
                    } size={16} />
                  </div>
                  
                  <div>
                    <p className="font-medium text-text-primary">{source.source}</p>
                    <p className="text-sm text-text-secondary">{source.visitors.toLocaleString()} visitors</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-text-primary">{source.leads} leads</p>
                  <p className="text-sm text-success">{source.rate}% conversion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Growth */}
      {selectedView === 'growth' && (
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Daily Lead Growth</h3>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="leads" 
                  fill="var(--color-accent)" 
                  radius={[4, 4, 0, 0]}
                  name="Leads"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Performing Content */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Top Performing Content</h3>
          <Button variant="outline" size="sm" iconName="BarChart3" iconPosition="left">
            View Details
          </Button>
        </div>

        <div className="space-y-4">
          {topPerformingContent.map((content, index) => (
            <div key={content.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 bg-accent/10 text-accent rounded-md border border-accent/20 text-sm font-medium">
                  {index + 1}
                </div>
                
                <div>
                  <p className="font-medium text-text-primary">{content.title}</p>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary mt-1">
                    <span>{content.type}</span>
                    <span>•</span>
                    <span>{content.downloads} downloads</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium text-text-primary">{content.leads} leads</p>
                <p className="text-sm text-success">{content.conversionRate}% rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadMetrics;