import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
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
    <div className="bg-surface border border-border rounded-lg p-4 shadow-subtle">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-2">
              <Icon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={14} 
                className={getChangeColor(changeType)}
              />
              <span className={`text-xs font-medium ${getChangeColor(changeType)}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-md border ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;