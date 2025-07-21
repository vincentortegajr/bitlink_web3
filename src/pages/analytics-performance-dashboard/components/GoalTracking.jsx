import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalTracking = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [showAddGoal, setShowAddGoal] = useState(false);

  const goals = [
    {
      id: '1',
      title: 'Monthly Revenue',
      target: 5000,
      current: 3750,
      unit: 'USD',
      period: 'month',
      category: 'revenue',
      icon: 'DollarSign',
      color: '#10B981',
      deadline: '2025-01-31'
    },
    {
      id: '2',
      title: 'New Leads',
      target: 200,
      current: 147,
      unit: 'leads',
      period: 'month',
      category: 'leads',
      icon: 'Users',
      color: '#3B82F6',
      deadline: '2025-01-31'
    },
    {
      id: '3',
      title: 'Profile Views',
      target: 10000,
      current: 8234,
      unit: 'views',
      period: 'month',
      category: 'engagement',
      icon: 'Eye',
      color: '#8B5CF6',
      deadline: '2025-01-31'
    },
    {
      id: '4',
      title: 'Email Subscribers',
      target: 1000,
      current: 756,
      unit: 'subscribers',
      period: 'quarter',
      category: 'growth',
      icon: 'Mail',
      color: '#F59E0B',
      deadline: '2025-03-31'
    }
  ];

  const milestones = [
    {
      id: '1',
      title: 'First $1000 Revenue',
      date: '2025-01-10',
      achieved: true,
      description: 'Reached first milestone in crypto payments'
    },
    {
      id: '2',
      title: '100 Email Subscribers',
      date: '2025-01-12',
      achieved: true,
      description: 'Built initial email list through lead magnets'
    },
    {
      id: '3',
      title: '500 Profile Views',
      date: '2025-01-15',
      achieved: true,
      description: 'Organic traffic growth milestone'
    },
    {
      id: '4',
      title: '50 Crypto Payments',
      date: '2025-01-25',
      achieved: false,
      description: 'Target for payment adoption'
    }
  ];

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return '#10B981'; // success
    if (percentage >= 70) return '#F59E0B'; // warning
    return '#EF4444'; // error
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Goal Tracking</h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={selectedPeriod === 'month' ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </Button>
            <Button
              variant={selectedPeriod === 'quarter' ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod('quarter')}
            >
              Quarter
            </Button>
            <Button
              variant={selectedPeriod === 'year' ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </Button>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowAddGoal(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Goal
          </Button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {goals
          .filter(goal => selectedPeriod === 'all' || goal.period === selectedPeriod)
          .map((goal) => {
            const percentage = getProgressPercentage(goal.current, goal.target);
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <div key={goal.id} className="bg-surface border border-border rounded-lg p-6 shadow-subtle hover:shadow-medium transition-smooth">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-md border" style={{ 
                    backgroundColor: `${goal.color}20`, 
                    borderColor: `${goal.color}40`,
                    color: goal.color 
                  }}>
                    <Icon name={goal.icon} size={20} />
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-text-secondary">
                      {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-text-primary mb-1">{goal.title}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-text-primary">
                      {goal.current.toLocaleString()}
                    </span>
                    <span className="text-sm text-text-secondary">
                      / {goal.target.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                </div>

                <div className="w-16 h-16 mx-auto mb-4">
                  <CircularProgressbar
                    value={percentage}
                    text={`${Math.round(percentage)}%`}
                    styles={buildStyles({
                      textSize: '24px',
                      pathColor: goal.color,
                      textColor: 'var(--color-text-primary)',
                      trailColor: 'var(--color-muted)',
                      backgroundColor: 'transparent'
                    })}
                  />
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: goal.color
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Milestones */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Recent Milestones</h3>
          <Button variant="outline" size="sm" iconName="Trophy" iconPosition="left">
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex items-start space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                milestone.achieved 
                  ? 'bg-success border-success text-white' :'bg-surface border-border text-text-secondary'
              }`}>
                {milestone.achieved ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium ${
                    milestone.achieved ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {milestone.title}
                  </h4>
                  <span className="text-xs text-text-secondary">{milestone.date}</span>
                </div>
                
                <p className="text-sm text-text-secondary">{milestone.description}</p>
                
                {milestone.achieved && (
                  <div className="flex items-center space-x-1 mt-2">
                    <Icon name="Trophy" size={14} className="text-warning" />
                    <span className="text-xs text-warning font-medium">Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg shadow-prominent max-w-md w-full animate-scale-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Add New Goal</h3>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="p-2 hover:bg-muted rounded-md transition-smooth"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Goal Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Monthly Revenue Target"
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Target Value</label>
                    <input
                      type="number"
                      placeholder="1000"
                      className="w-full px-3 py-2 border border-border rounded-md bg-input text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Unit</label>
                    <select className="w-full px-3 py-2 border border-border rounded-md bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="USD">USD</option>
                      <option value="leads">Leads</option>
                      <option value="views">Views</option>
                      <option value="subscribers">Subscribers</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Deadline</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <Button
                    variant="default"
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1"
                  >
                    Create Goal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracking;