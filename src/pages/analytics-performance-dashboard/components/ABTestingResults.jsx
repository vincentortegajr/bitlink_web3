import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ABTestingResults = () => {
  const [selectedTest, setSelectedTest] = useState('profile-cta');

  const activeTests = [
    {
      id: 'profile-cta',
      name: 'Profile CTA Button',
      status: 'running',
      startDate: '2025-01-15',
      endDate: '2025-01-29',
      confidence: 95.2,
      winner: 'B',
      variants: [
        {
          name: 'Variant A',
          description: 'Get Started Now',
          visitors: 1245,
          conversions: 89,
          rate: 7.1,
          isControl: true
        },
        {
          name: 'Variant B',
          description: 'Join the Community',
          visitors: 1198,
          conversions: 127,
          rate: 10.6,
          isWinner: true
        }
      ]
    },
    {
      id: 'lead-form',
      name: 'Lead Capture Form',
      status: 'completed',
      startDate: '2025-01-08',
      endDate: '2025-01-21',
      confidence: 87.3,
      winner: 'A',
      variants: [
        {
          name: 'Variant A',
          description: 'Single-step form',
          visitors: 2134,
          conversions: 234,
          rate: 11.0,
          isWinner: true
        },
        {
          name: 'Variant B',
          description: 'Multi-step form',
          visitors: 2089,
          conversions: 189,
          rate: 9.0,
          isControl: true
        }
      ]
    },
    {
      id: 'payment-button',
      name: 'Payment Button Design',
      status: 'draft',
      startDate: '2025-01-25',
      endDate: '2025-02-08',
      confidence: 0,
      winner: null,
      variants: [
        {
          name: 'Variant A',
          description: 'Blue gradient button',
          visitors: 0,
          conversions: 0,
          rate: 0,
          isControl: true
        },
        {
          name: 'Variant B',
          description: 'Green solid button',
          visitors: 0,
          conversions: 0,
          rate: 0
        }
      ]
    }
  ];

  const recommendations = [
    {
      id: '1',
      type: 'optimization',
      title: 'Implement Winning CTA',
      description: 'Deploy "Join the Community" button across all profile pages for 10.6% conversion rate',
      impact: 'High',
      effort: 'Low',
      icon: 'TrendingUp'
    },
    {
      id: '2',
      type: 'test',
      title: 'Test Payment Flow',
      description: 'A/B test one-click vs multi-step payment process to improve completion rates',
      impact: 'Medium',
      effort: 'Medium',
      icon: 'TestTube'
    },
    {
      id: '3',
      type: 'analysis',
      title: 'Mobile Optimization',
      description: 'Mobile conversion rates are 23% lower - test mobile-specific designs',
      impact: 'High',
      effort: 'High',
      icon: 'Smartphone'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-warning bg-warning/10 border-warning/20';
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'draft': return 'text-text-secondary bg-muted border-border';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-error bg-error/10 border-error/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'Low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const selectedTestData = activeTests.find(test => test.id === selectedTest);

  return (
    <div className="space-y-6">
      {/* Test Selection */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-text-primary mb-4">A/B Testing Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTests.map((test) => (
            <button
              key={test.id}
              onClick={() => setSelectedTest(test.id)}
              className={`p-4 rounded-lg border text-left transition-smooth hover:shadow-medium ${
                selectedTest === test.id 
                  ? 'border-primary bg-primary/5' :'border-border bg-muted hover:bg-muted/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-text-primary">{test.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(test.status)}`}>
                  {test.status}
                </span>
              </div>
              
              <div className="text-sm text-text-secondary">
                {test.status === 'completed' && test.confidence > 0 && (
                  <p>Winner: Variant {test.winner} ({test.confidence}% confidence)</p>
                )}
                {test.status === 'running' && (
                  <p>Running until {test.endDate}</p>
                )}
                {test.status === 'draft' && (
                  <p>Starts {test.startDate}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Test Details */}
      {selectedTestData && (
        <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{selectedTestData.name}</h3>
              <p className="text-sm text-text-secondary">
                {selectedTestData.startDate} - {selectedTestData.endDate}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedTestData.confidence > 0 && (
                <div className="text-right">
                  <p className="text-sm text-text-secondary">Statistical Confidence</p>
                  <p className="text-lg font-bold text-success">{selectedTestData.confidence}%</p>
                </div>
              )}
              
              <Button 
                variant={selectedTestData.status === 'running' ? "destructive" : "default"}
                size="sm"
                iconName={selectedTestData.status === 'running' ? "Square" : "Play"}
                iconPosition="left"
              >
                {selectedTestData.status === 'running' ? 'Stop Test' : 
                 selectedTestData.status === 'draft' ? 'Start Test' : 'View Details'}
              </Button>
            </div>
          </div>

          {/* Variant Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedTestData.variants.map((variant, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-lg border ${
                  variant.isWinner 
                    ? 'border-success bg-success/5' 
                    : variant.isControl 
                    ? 'border-primary bg-primary/5' :'border-border bg-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-text-primary">{variant.name}</h4>
                  <div className="flex items-center space-x-2">
                    {variant.isControl && (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Control
                      </span>
                    )}
                    {variant.isWinner && (
                      <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success border border-success/20">
                        Winner
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-4">{variant.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Visitors</span>
                    <span className="font-medium text-text-primary">{variant.visitors.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Conversions</span>
                    <span className="font-medium text-text-primary">{variant.conversions.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Conversion Rate</span>
                    <span className={`font-bold ${variant.isWinner ? 'text-success' : 'text-text-primary'}`}>
                      {variant.rate}%
                    </span>
                  </div>
                </div>

                {selectedTestData.status !== 'draft' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          variant.isWinner ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${variant.rate * 10}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Optimization Recommendations</h3>
          <Button variant="outline" size="sm" iconName="Lightbulb" iconPosition="left">
            Generate More
          </Button>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="flex items-start space-x-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
              <div className="p-2 bg-accent/10 text-accent rounded-md border border-accent/20">
                <Icon name={rec.icon} size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{rec.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(rec.impact)}`}>
                      {rec.impact} Impact
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-muted border border-border text-text-secondary">
                      {rec.effort} Effort
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-text-secondary mb-3">{rec.description}</p>
                
                <Button variant="outline" size="sm">
                  Implement
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ABTestingResults;