import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colorMap = {
      primary: 'text-primary bg-primary/10 border-primary/20',
      success: 'text-success bg-success/10 border-success/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      accent: 'text-accent bg-accent/10 border-accent/20'
    };
    return colorMap[colorType] || colorMap.primary;
  };

  const getChangeColor = (type) => {
    return type === 'positive' ? 'text-success' : type === 'negative' ? 'text-destructive' : 'text-text-secondary';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 shadow-subtle hover:shadow-medium transition-smooth">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-md border ${getColorClasses(color)}`}>
          <Icon name={icon} size={20} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor(changeType)}`}>
            <Icon 
              name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
              size={14} 
            />
            <span className="font-medium">{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-2xl font-bold text-text-primary mb-1">{value}</p>
        <p className="text-sm text-text-secondary">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;